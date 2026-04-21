import type { GratuityInput, GratuityOutput } from "@/lib/tools/types";

const TAX_EXEMPTION_CAP = 2000000; // ₹20L under Section 10(10)(ii) post-2019

export function calculateGratuity(input: GratuityInput): GratuityOutput {
  const { lastBasicPlusDa, years, months, coverage } = input;

  // Round up to next year if remaining months >= 6 (Gratuity Act rule)
  const effectiveYears = months >= 6 ? years + 1 : years;

  let gratuityAmount = 0;
  let formula = "";

  if (coverage === "Covered under Gratuity Act") {
    // 15 / 26 × basic+DA × completed years
    gratuityAmount = Math.round(
      (15 / 26) * lastBasicPlusDa * effectiveYears
    );
    formula = `(15 ÷ 26) × ${lastBasicPlusDa.toLocaleString("en-IN")} × ${effectiveYears} = ${gratuityAmount.toLocaleString(
      "en-IN"
    )}`;
  } else {
    // Half month × basic+DA × years (applied as 15/30 = 1/2) under 10(10)(iii)
    gratuityAmount = Math.round((15 / 30) * lastBasicPlusDa * effectiveYears);
    formula = `(15 ÷ 30) × ${lastBasicPlusDa.toLocaleString("en-IN")} × ${effectiveYears} = ${gratuityAmount.toLocaleString(
      "en-IN"
    )}`;
  }

  const taxExemption = Math.min(gratuityAmount, TAX_EXEMPTION_CAP);

  const eligibilityNote =
    effectiveYears < 5
      ? "You have completed fewer than 5 years of continuous service. Under Section 4(1) of the Payment of Gratuity Act, 1972, gratuity is generally payable only after 5 years (except in case of death, disablement, or termination). Some employers still pay as a goodwill gesture."
      : `You have completed ${effectiveYears} years of continuous service — you are eligible for gratuity under Section 4(1) of the Payment of Gratuity Act, 1972.`;

  const taxNote =
    coverage === "Covered under Gratuity Act"
      ? `Under Section 10(10)(ii) of the Income Tax Act, the LEAST of the following is exempt: (a) ₹20,00,000 (lifetime cap), (b) actual gratuity received, (c) (15/26) × last drawn basic+DA × completed years. Anything above is added to "Income from Salaries".`
      : `Under Section 10(10)(iii) of the Income Tax Act, the LEAST of the following is exempt: (a) ₹20,00,000, (b) actual gratuity received, (c) (1/2) × average salary (10 months) × completed years. Anything above is taxable as salary.`;

  const bullets: string[] = [
    `Eligibility: minimum 5 years of continuous service (Section 4(1), Payment of Gratuity Act, 1972). Waived in case of death, disablement, or employer termination.`,
    `Formula for Act-covered: (15 ÷ 26) × Last drawn (Basic + DA) × Completed years of service.`,
    `Partial year rounding: 6 months or more is treated as a full year; less than 6 months is ignored.`,
    `Tax exemption cap raised to ₹20,00,000 w.e.f. 29 March 2018 (Section 10(10)(ii)).`,
    `Forfeiture is possible only under Section 4(6) — for wilful damage, riotous conduct, or offence involving moral turpitude during employment.`,
    `Nomination: file Form F under Rule 6 so the gratuity reaches your family directly.`,
    `Interest: if employer delays beyond 30 days of becoming payable, simple interest is due under Section 7(3A).`,
  ];

  return {
    gratuityAmount,
    taxExemption,
    formula,
    taxNote,
    eligibilityNote,
    bullets,
    disclaimer:
      "This is an estimate using standard formulae. Actual gratuity depends on whether your establishment is 'covered' under the Payment of Gratuity Act, 1972, the exact definition of 'wages' in your contract (Basic + DA), and any CTC components explicitly excluded.",
    metadata: { generatedAt: new Date().toISOString() },
  };
}
