import type { ReraPenaltyInput, ReraPenaltyOutput } from "@/lib/tools/types";

/**
 * RERA Penalty Calculator — indicative computation against
 * Sections 59 through 66 of the Real Estate (Regulation and
 * Development) Act, 2016.
 *
 * Key references:
 * - Section 59: Non-registration — up to 10% of estimated project cost.
 * - Section 60: False information at registration — up to 5% of estimated project cost.
 * - Section 61: Contravention of Act / rules other than Section 3, 4 — up to 5% of estimated project cost.
 * - Section 63: Non-compliance with orders of Authority — up to 5% of estimated project cost.
 * - Section 64: Non-compliance with Appellate Tribunal orders — up to 10% and/or 3 years imprisonment.
 * - Section 66: Offence by companies — the person in charge of conduct of business is punishable.
 */
export function generateReraPenalty(
  input: ReraPenaltyInput
): ReraPenaltyOutput {
  const { violationType, projectCostInr, durationMonths, numberOfViolations } =
    input;

  let section = "Section 61";
  let sectionLabel =
    "Section 61 — Penalty for contravention of the Act / rules";
  let pctBase = 0.01; // starting 1% of project cost
  let pctCap = 0.05; // cap 5% of project cost
  let perUnitLabel = "per month of continuing default";
  let perUnitPenalty = Math.round(projectCostInr * 0.002);
  let imprisonmentRisk =
    "Monetary penalty only under Section 61. Continued default may attract Section 64 (imprisonment up to 3 years).";

  switch (violationType) {
    case "Non-Registration":
      section = "Section 59";
      sectionLabel =
        "Section 59 — Penalty for non-registration under Section 3";
      pctBase = 0.05;
      pctCap = 0.1;
      perUnitLabel = "per month of continued non-registration";
      perUnitPenalty = Math.round(projectCostInr * 0.003);
      imprisonmentRisk =
        "Section 59(2): Continued violation after penalty may attract imprisonment up to 3 years and/or a further fine up to 10% of estimated project cost.";
      break;
    case "False / Incorrect Disclosure":
      section = "Section 60";
      sectionLabel =
        "Section 60 — Penalty for providing false information at registration";
      pctBase = 0.02;
      pctCap = 0.05;
      perUnitLabel = "per instance of false disclosure";
      perUnitPenalty = Math.round(projectCostInr * 0.005);
      imprisonmentRisk =
        "Section 60: Up to 5% of estimated project cost. Criminal liability under Indian Penal Code Section 420 may run in parallel.";
      break;
    case "Delayed Possession":
      section = "Section 18";
      sectionLabel =
        "Section 18 — Return of amount & interest / compensation for delayed possession";
      pctBase = 0.0; // not a fixed penalty — compensation-based
      pctCap = 0.0;
      perUnitLabel = "per month of delay (interest @ MCLR + 2%)";
      // Indicative 10.5% p.a. interest on project cost × duration
      perUnitPenalty = Math.round(projectCostInr * (0.105 / 12));
      imprisonmentRisk =
        "Section 18 is compensatory: promoter must refund with interest if allottee exits, or pay monthly interest on the amount received till possession. No imprisonment.";
      break;
    case "Misuse of Funds (70% Escrow)":
      section = "Section 61 + Section 4(2)(l)(D)";
      sectionLabel =
        "Section 61 read with Section 4(2)(l)(D) — Diversion of project funds";
      pctBase = 0.03;
      pctCap = 0.05;
      perUnitLabel = "per instance of escrow violation";
      perUnitPenalty = Math.round(projectCostInr * 0.005);
      imprisonmentRisk =
        "Diversion of escrow funds is treated as a serious breach. Section 66 makes officers-in-charge personally liable. Criminal liability under IPC for breach of trust may apply.";
      break;
    case "Late Filing of Quarterly Updates":
      section = "Section 61";
      sectionLabel = "Section 61 — Failure to comply with filing obligations";
      pctBase = 0.005;
      pctCap = 0.02;
      perUnitLabel = "per quarter of late / missed filing";
      perUnitPenalty = Math.round(projectCostInr * 0.001);
      imprisonmentRisk =
        "No direct imprisonment. Repeat non-compliance may lead to suspension / revocation of project registration under Section 7.";
      break;
    case "Continued Default":
      section = "Section 64";
      sectionLabel =
        "Section 64 — Non-compliance with orders of Appellate Tribunal";
      pctBase = 0.05;
      pctCap = 0.1;
      perUnitLabel = "per day of continued non-compliance";
      perUnitPenalty = Math.round(projectCostInr * 0.0005);
      imprisonmentRisk =
        "Section 64: Imprisonment up to 3 years and/or fine up to 10% of estimated project cost. Non-cognizable; complaint must be filed by RERA officer.";
      break;
  }

  const basePenalty = Math.round(projectCostInr * pctBase);
  const cappedBase = Math.min(basePenalty, Math.round(projectCostInr * pctCap));

  // Per-unit × duration / count, capped at the Act's ceiling.
  const unitCount =
    violationType === "False / Incorrect Disclosure" ||
    violationType === "Misuse of Funds (70% Escrow)"
      ? Math.max(1, numberOfViolations)
      : Math.max(1, durationMonths);

  const perUnitTotal = perUnitPenalty * unitCount;
  const combined = cappedBase + perUnitTotal;
  const totalPenaltyInr = Math.min(combined, Math.round(projectCostInr * pctCap));

  const mitigations: string[] = [
    "File pending quarterly updates and past due returns within 30 days; request condonation under the State RERA Rules.",
    "Make a voluntary disclosure to the Authority before a suo motu complaint is registered — penalties are routinely mitigated for voluntary compliance.",
    "Shift balance unutilised collections into the designated escrow account immediately and obtain a CA + Engineer + Architect certificate to reset compliance posture.",
    "Engage a RERA-qualified advocate to file a detailed reply with milestone evidence; typical adjudication reduces penalty by 30–60% for first-time, good-faith breaches.",
    "For delayed possession, offer the allottee a defined compensation schedule (interest at MCLR + 2% under Section 18) and obtain a written waiver of further claims.",
  ];

  const bullets = [
    `Applicable provision: ${sectionLabel}`,
    `Base penalty ceiling: ${Math.round(pctCap * 100)}% of estimated project cost = ₹${Math.round(projectCostInr * pctCap).toLocaleString("en-IN")}.`,
    `Recurring element: ${perUnitLabel} — indicative ₹${perUnitPenalty.toLocaleString("en-IN")} per unit.`,
    "Adjudicating Officer retains discretion to scale penalty based on turnover, gravity and good-faith.",
  ];

  return {
    applicableSection: sectionLabel,
    basePenaltyInr: cappedBase,
    perDayOrPerInstancePenaltyInr: perUnitPenalty,
    totalPenaltyInr,
    imprisonmentRisk,
    mitigations,
    bullets,
    disclaimer:
      "This is an indicative penalty model. The Adjudicating Officer / Authority retains statutory discretion (Section 71) and the actual penalty will depend on turnover, gravity, repeat offences and the Act's ceilings. Obtain certified legal advice before any self-assessment.",
    metadata: { generatedAt: new Date().toISOString() },
  };
}
