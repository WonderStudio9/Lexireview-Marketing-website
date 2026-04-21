import type {
  NoticePeriodInput,
  NoticePeriodOutput,
} from "@/lib/tools/types";

// Simplified per-state rules table. Real-world practice varies by
// whether a unit is covered by the Shops & Establishments Act, the
// Industrial Employment (Standing Orders) Act 1946, or the new Code
// on Industrial Relations, 2020. These defaults are conservative and
// are cross-checked against what most employers actually put in
// offer letters.
const STATE_DEFAULT_DAYS: Record<string, number> = {
  Karnataka: 30,
  Maharashtra: 30,
  "Tamil Nadu": 30,
  Telangana: 30,
  "Andhra Pradesh": 30,
  Delhi: 30,
  Haryana: 30,
  Kerala: 30,
  "West Bengal": 30,
  Gujarat: 30,
  Rajasthan: 30,
  "Madhya Pradesh": 30,
  Punjab: 30,
  "Uttar Pradesh": 30,
};

export function calculateNoticePeriod(
  input: NoticePeriodInput
): NoticePeriodOutput {
  const { state, employeeType, tenureMonths, industry, contractClause } = input;

  // Statutory baseline
  let statutoryDays = STATE_DEFAULT_DAYS[state] ?? 30;
  if (employeeType === "Probation") statutoryDays = 15;
  if (employeeType === "Contract") statutoryDays = 0; // governed by contract

  // Contract override inference (very rough — real tools would NER this)
  let contractDays: number | null = null;
  if (contractClause) {
    const low = contractClause.toLowerCase();
    const match = low.match(/(\d{1,3})\s*(day|days|month|months)/);
    if (match) {
      const n = parseInt(match[1], 10);
      contractDays = /month/.test(match[2]) ? n * 30 : n;
    }
  }

  const applicableNoticeDays =
    contractDays !== null
      ? Math.max(contractDays, statutoryDays)
      : statutoryDays;

  const applicableLaw =
    employeeType === "Permanent"
      ? state === "Maharashtra" || state === "Karnataka" || state === "Tamil Nadu"
        ? `${state} Shops & Establishments Act (read with Industrial Employment Standing Orders Act, 1946 and the IR Code, 2020 where notified)`
        : `${state} Shops & Establishments Act read with Industrial Employment Standing Orders Act, 1946`
      : employeeType === "Probation"
      ? `${state} Shops & Establishments Act (probation clause) — typically 7-15 days notice`
      : `Governed primarily by the employment contract. The IR Code, 2020 applies where notified.`;

  const contractVsStatutory =
    contractDays === null
      ? `No explicit contract notice clause was provided. We have applied the statutory default for ${state} (${statutoryDays} days).`
      : contractDays > statutoryDays
      ? `Your contract specifies ${contractDays} days, which is longer than the statutory minimum of ${statutoryDays} days. The longer contractual period is enforceable, but not beyond what is reasonable for the role (courts have trimmed excessive clauses).`
      : contractDays < statutoryDays
      ? `Your contract specifies ${contractDays} days but the statutory minimum in ${state} is ${statutoryDays} days. The statutory minimum will override the contract for protected workmen categories.`
      : `Your contract and statute are aligned at ${statutoryDays} days.`;

  const nonCompeteEnforceable: "Likely unenforceable" | "Narrowly enforceable" =
    "Likely unenforceable";

  const gardenLeaveNote =
    industry === "IT / ITES" || industry === "BFSI"
      ? "Garden leave (employer pays salary but bars you from joining a competitor for the notice period) is common in IT/ITES and BFSI for senior roles. Payment of full salary during garden leave is a pre-condition to enforceability."
      : "Garden leave is less common outside IT/ITES, BFSI and senior management. Employer must continue to pay full salary during the garden-leave period.";

  const bullets: string[] = [
    `Applicable notice period: ${applicableNoticeDays} days for a ${employeeType.toLowerCase()} employee in ${state}.`,
    `Tenure so far: ${tenureMonths} months — note that some employers prorate notice for tenure under 6 months.`,
    `Buyout: most employers allow buyout at (notice days not served) × (basic+DA)/30. This is taxable salary in your hands.`,
    `Non-compete clauses are generally unenforceable in India under Section 27 of the Indian Contract Act, 1872, except for narrow, time-bound restraints necessary to protect trade secrets.`,
    `Non-solicit of employees / customers is more likely to be enforced, provided it is limited in time (typically 12 months) and scope.`,
    `Unpaid leave / LOP during notice does not automatically extend the notice period — insist on written confirmation either way.`,
    `${gardenLeaveNote}`,
  ];

  return {
    applicableNoticeDays,
    applicableLaw,
    contractVsStatutory,
    nonCompeteEnforceable,
    gardenLeaveNote,
    bullets,
    disclaimer:
      "This is a general indicative analysis based on statutory defaults. Actual enforceability depends on role, seniority, whether you are a 'workman' under the IR Code, and the precise wording of your contract. Consult an employment lawyer for high-stakes exits.",
    metadata: { generatedAt: new Date().toISOString(), state },
  };
}
