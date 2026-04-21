import type {
  CapTableInput,
  CapTableOutput,
  CapTableRow,
} from "@/lib/tools/types";

/**
 * Computes a pre- and post-dilution cap table for an Indian Private Limited
 * Company, taking founders, ESOP pool, optional angel investors and a projected
 * next round into account. Rounded to integer shares; small rounding goes to
 * the first founder.
 */
export function generateCapTable(input: CapTableInput): CapTableOutput {
  const {
    companyName,
    stage,
    founders,
    esopPoolPct,
    includePreferred,
    angelInvestorCount,
    nextRoundSizeCr,
    nextRoundValuationCr,
  } = input;

  // Assume 10,000,000 authorised shares for a cleaner cap table.
  const totalShares = 10_000_000;

  // Pre-dilution: founders + ESOP pool. Angels (if any at pre-seed/seed)
  // included pro-rata.
  const founderTotalPct = founders.reduce((s, f) => s + f.equityPct, 0);

  // If founders don't sum to 100 - esop - angel allocation, we normalise.
  // Angels get a flat 2% aggregate at pre-seed, 5% at seed (if any).
  const angelAggPct =
    angelInvestorCount > 0
      ? stage === "pre-seed"
        ? 2
        : stage === "seed"
        ? 5
        : 0
      : 0;

  const esopPct = esopPoolPct;
  const availableForFounders = Math.max(100 - esopPct - angelAggPct, 0);
  const scale = founderTotalPct > 0 ? availableForFounders / founderTotalPct : 1;

  const preRows: CapTableRow[] = [];

  let assignedShares = 0;
  founders.forEach((f, i) => {
    const adjPct = f.equityPct * scale;
    const shares = Math.floor((adjPct / 100) * totalShares);
    preRows.push({
      holder: `${f.name} (Founder ${i + 1})`,
      shareClass: "Common",
      shares,
      equityPct: round2(adjPct),
    });
    assignedShares += shares;
  });

  // ESOP pool
  const esopShares = Math.floor((esopPct / 100) * totalShares);
  preRows.push({
    holder: "ESOP Pool (unallocated)",
    shareClass: "Options Reserve",
    shares: esopShares,
    equityPct: round2(esopPct),
  });
  assignedShares += esopShares;

  // Angels (aggregated)
  if (angelInvestorCount > 0 && angelAggPct > 0) {
    const perAngelPct = angelAggPct / angelInvestorCount;
    const perAngelShares = Math.floor((perAngelPct / 100) * totalShares);
    for (let i = 0; i < angelInvestorCount; i++) {
      preRows.push({
        holder: `Angel Investor #${i + 1}`,
        shareClass: includePreferred ? "Seed Preferred" : "Common",
        shares: perAngelShares,
        equityPct: round2(perAngelPct),
      });
      assignedShares += perAngelShares;
    }
  }

  // Rounding reconciliation: any residual goes to the first founder
  const residual = totalShares - assignedShares;
  if (residual !== 0 && preRows.length > 0) {
    preRows[0].shares += residual;
    preRows[0].equityPct = round2((preRows[0].shares / totalShares) * 100);
  }

  // Post-dilution: new round
  const nextRoundInr = nextRoundSizeCr * 1_00_00_000;
  const postValuationInr = nextRoundValuationCr * 1_00_00_000;
  const preValuationInr = postValuationInr - nextRoundInr;
  const investorPct = postValuationInr > 0 ? (nextRoundInr / postValuationInr) * 100 : 0;

  // Dilute existing holders by (1 - investorPct/100)
  const dilutionFactor = 1 - investorPct / 100;

  const postRows: CapTableRow[] = preRows.map((r) => ({
    holder: r.holder,
    shareClass: r.shareClass,
    shares: r.shares,
    equityPct: round2(r.equityPct * dilutionFactor),
  }));

  // Add new investors
  const investorSharesTotal = Math.floor((investorPct / 100) * (totalShares / dilutionFactor));
  postRows.push({
    holder: `Series ${stage === "series B" ? "B" : stage === "series A" ? "A" : "Seed"} Investors`,
    shareClass: includePreferred ? "Preferred" : "Common",
    shares: investorSharesTotal,
    equityPct: round2(investorPct),
  });

  const liquidationSummary: string[] = [];
  if (includePreferred) {
    liquidationSummary.push(
      "Preferred shareholders are assumed to have 1x non-participating liquidation preference."
    );
    liquidationSummary.push(
      "In a liquidation or exit event, preferred holders receive their original investment back first; remaining proceeds are distributed pro-rata among common holders."
    );
    liquidationSummary.push(
      "Watch for: multiple liquidation preferences (2x, 3x) and participating preferred — both are aggressive terms that hurt founders and common holders."
    );
  } else {
    liquidationSummary.push(
      "No preferred stock in this cap table. All holders rank pari-passu in a liquidation event."
    );
  }

  const notes: string[] = [
    `Assumes ${totalShares.toLocaleString("en-IN")} authorised equity shares for readability.`,
    `Pre-dilution total founders equity after ESOP + angel carve-out: ${round2(founders.reduce((s, r) => s + r.equityPct, 0) * scale)}%`,
    `Next round: ₹${nextRoundSizeCr}Cr at ₹${nextRoundValuationCr}Cr post-money → Pre-money: ₹${round2(preValuationInr / 1_00_00_000)}Cr.`,
    `New-investor dilution: ${round2(investorPct)}%; existing holders diluted by the same factor.`,
    "For a real cap table, include SAFE/CCPS conversion terms, anti-dilution, and option-pool shuffles — these materially affect outcomes.",
  ];

  const csv = buildCsv(preRows, postRows);

  return {
    preDilution: preRows,
    postDilution: postRows,
    liquidationSummary,
    csv,
    notes,
    metadata: { generatedAt: new Date().toISOString(), companyName },
  };
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

function buildCsv(pre: CapTableRow[], post: CapTableRow[]): string {
  const header = "Scenario,Holder,Share Class,Shares,Equity %";
  const preLines = pre.map(
    (r) => `Pre-dilution,"${r.holder}",${r.shareClass},${r.shares},${r.equityPct}`
  );
  const postLines = post.map(
    (r) => `Post-dilution,"${r.holder}",${r.shareClass},${r.shares},${r.equityPct}`
  );
  return [header, ...preLines, "", ...postLines].join("\n");
}
