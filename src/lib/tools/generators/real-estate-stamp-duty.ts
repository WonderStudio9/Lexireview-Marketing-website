import type { ReStampDutyInput, ReStampDutyOutput } from "@/lib/tools/types";
import { STAMP_DUTY_RATES } from "@/lib/tools/stamp-duty-rates";

// Indicative multipliers for real-estate-specific transaction types.
// Sale Deed / Conveyance attract full state stamp duty.
// Agreement to Sell is usually charged nominally (₹100–500) but some states
// tax it proportionately; we use 20% of sale-deed rate as an upper-bound.
// Allotment Letter is typically ₹100 nominal in most states, but we charge
// ~5% of sale-deed rate to capture states that treat it as a conveyance.
const RE_TX_MULT: Record<string, number> = {
  "Sale Deed": 1.0,
  "Conveyance": 1.0,
  "Agreement to Sell": 0.2,
  "Allotment Letter": 0.05,
};

export function generateRealEstateStampDuty(
  input: ReStampDutyInput
): ReStampDutyOutput {
  const row =
    STAMP_DUTY_RATES[input.state] ??
    ({
      state: input.state,
      saleDuty: 6,
      registration: 1,
    } as { state: string; saleDuty: number; registration: number });

  const txMult = RE_TX_MULT[input.transactionType] ?? 1;

  const useWomen =
    row.womenDuty !== undefined &&
    (input.buyerGender === "Female" || input.buyerGender === "Joint");

  let dutyPct = useWomen && row.womenDuty !== undefined
    ? input.buyerGender === "Joint"
      ? (row.saleDuty + row.womenDuty) / 2
      : row.womenDuty
    : row.saleDuty;

  // First-time buyer rebate (indicative): some states offer 0.25%–0.5% concession.
  let ftbApplied = false;
  if (input.firstTimeBuyer) {
    dutyPct = Math.max(0, dutyPct - 0.5);
    ftbApplied = true;
  }

  const effectivePct = dutyPct * txMult;
  const stampDuty = Math.round(input.propertyValue * (effectivePct / 100));
  const registration = Math.round(
    input.propertyValue * (row.registration / 100)
  );
  const surchargePct = row.municipalSurcharge ?? 0;
  const municipal = Math.round(input.propertyValue * (surchargePct / 100));

  // Additional local fees: labour cess, legal scrutiny, mutation — indicative.
  const additionalLocalFees = Math.round(input.propertyValue * 0.002);

  const total = stampDuty + registration + municipal + additionalLocalFees;

  const notes: string[] = [];
  if (row.notes) notes.push(row.notes);
  if (useWomen)
    notes.push(
      input.buyerGender === "Joint"
        ? "Joint (male + female) buyers — averaged concessional rate applied."
        : "Women concession applied per state stamp schedule."
    );
  if (ftbApplied)
    notes.push("First-time buyer concession of 0.5% applied (indicative).");
  if (input.transactionType !== "Sale Deed") {
    notes.push(
      `${input.transactionType} is charged at ${Math.round(
        txMult * 100
      )}% of the sale-deed base rate (indicative; some states levy a nominal fixed fee instead).`
    );
  }
  notes.push(
    "Additional local fees include labour cess (1% in most states), legal scrutiny, and mutation charges — approximated at 0.2% of consideration."
  );

  return {
    stampDuty,
    registrationCharges: registration,
    municipalSurcharge: municipal,
    additionalLocalFees,
    total,
    stampDutyRatePct: Math.round(effectivePct * 100) / 100,
    registrationRatePct: row.registration,
    womenConcessionApplied: useWomen,
    firstTimeBuyerRebateApplied: ftbApplied,
    costToClosing: total,
    notes,
    disclaimer:
      "Rates are indicative for 2025–2026 and vary by sub-registrar. Always verify with the jurisdictional Sub-Registrar Office (SRO) and State RERA portal before execution.",
  };
}
