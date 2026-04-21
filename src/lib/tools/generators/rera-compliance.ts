import type {
  ReraComplianceInput,
  ReraComplianceOutput,
  ReraComplianceFinding,
} from "@/lib/tools/types";

/**
 * RERA Compliance scoring. Not legal advice — an indicative
 * checklist against the public-facing obligations in the
 * Real Estate (Regulation and Development) Act, 2016.
 */
export function generateReraCompliance(
  input: ReraComplianceInput
): ReraComplianceOutput {
  const findings: ReraComplianceFinding[] = [];

  // Registration (Section 3) — mandatory for projects > 500 sqm or > 8 apartments.
  const requiresRegistration =
    input.projectAreaSqft >= 5382 /* ~500 sqm */ || input.plotCount > 8;

  if (requiresRegistration && input.registrationStatus !== "Registered") {
    findings.push({
      item: "Project not registered with State RERA",
      section: "RERA Act Section 3 (Prior Registration)",
      severity: "critical",
      remediation:
        "File Form A with the State RERA Authority before any marketing, booking or sale. Non-registration attracts penalty up to 10% of estimated project cost (Section 59).",
    });
  }

  // Website / Public Disclosure (Section 11)
  if (!input.websitePublished) {
    findings.push({
      item: "No public project webpage with RERA details",
      section: "RERA Act Section 11 (Functions and Duties of Promoter)",
      severity: "high",
      remediation:
        "Create a dedicated project webpage hosting: RERA registration certificate, approved plans, stage-wise timeline, quarterly updates, and a list of allottees. Link it on the State RERA portal.",
    });
  }

  // Carpet Area (Section 4(2)(h)/14)
  if (!input.carpetAreaDisclosed) {
    findings.push({
      item: "Carpet area not disclosed in agreement / marketing",
      section: "RERA Act Section 4(2)(h) & Section 14 (Adherence to Plan)",
      severity: "high",
      remediation:
        "Disclose carpet area (as defined in Section 2(k) — net usable floor area) in every sale document, advertisement and allotment letter. 'Super area' pricing is explicitly prohibited.",
    });
  }
  if (!input.builtUpAreaDisclosed) {
    findings.push({
      item: "Built-up area not separately disclosed",
      section: "RERA Act Section 4(2)(h)",
      severity: "medium",
      remediation:
        "Mention built-up / super area as a separate line item for transparency, but base all pricing and the buyer-seller agreement on carpet area only.",
    });
  }

  // Escrow / 70% rule (Section 4(2)(l)(D))
  if (!input.escrowAccount) {
    findings.push({
      item: "No separate escrow / project bank account",
      section: "RERA Act Section 4(2)(l)(D) (Escrow Account)",
      severity: "critical",
      remediation:
        "Open a dedicated project bank account. Deposit 70% of amounts received from allottees into this account. Withdrawals must be certified by an engineer, architect and CA in proportion to construction progress.",
    });
  }
  if (input.escrowAccount && !input.seventyPctEscrowCompliant) {
    findings.push({
      item: "70% escrow proceeds rule not followed",
      section: "RERA Act Section 4(2)(l)(D) proviso",
      severity: "critical",
      remediation:
        "Route 70% of every collection into the escrow account and withdraw only against certified construction progress. Any shortfall in routing is a substantive breach attracting Section 61 penalty.",
    });
  }

  // Quarterly updates (Section 11(1) + state rules)
  if (!input.quarterlyUpdatesFiled) {
    findings.push({
      item: "Quarterly project updates not uploaded to RERA portal",
      section: "RERA Act Section 11(1) + State Rules",
      severity: "high",
      remediation:
        "Upload quarterly progress (as required by state rules — typically within 15 days of quarter-end): sanctioned plans, stage of construction, approvals pending/received, booking status.",
    });
  }

  // Scoring — each finding deducts weighted points from 100.
  const deduction: Record<ReraComplianceFinding["severity"], number> = {
    critical: 25,
    high: 12,
    medium: 6,
    low: 3,
  };
  const raw = findings.reduce((acc, f) => acc + deduction[f.severity], 0);
  const score = Math.max(0, 100 - raw);

  let status: ReraComplianceOutput["status"] = "Compliant";
  if (score < 50) status = "Non-compliant";
  else if (score < 85) status = "Partially compliant";

  // Penalty exposure (indicative):
  // Section 59 — non-registration penalty up to 10% of project cost.
  // Section 61 — other violations up to 5% of project cost.
  // Project cost is not an input; we use project area as a proxy: ₹3,000/sqft x area.
  const inferredProjectCost = Math.round(input.projectAreaSqft * 3000);
  const critCount = findings.filter((f) => f.severity === "critical").length;
  const highCount = findings.filter((f) => f.severity === "high").length;
  const low = critCount > 0 ? Math.round(inferredProjectCost * 0.02) : 0;
  const high =
    critCount > 0
      ? Math.round(inferredProjectCost * 0.1)
      : highCount > 0
      ? Math.round(inferredProjectCost * 0.05)
      : 0;

  const bullets = [
    "Scored against key obligations under RERA Act 2016 Sections 3, 4, 11, 13, 14, and 19.",
    "Penalty exposure is indicative and assumes a project cost of ₹3,000 per sqft of project area.",
    "A 'Compliant' score (85+) does not substitute for certified legal review.",
    "State-specific RERA Rules may add more obligations (e.g. MahaRERA advertising norms, HRERA fund-utilisation reports).",
  ];

  return {
    score,
    status,
    findings,
    penaltyExposureInr: { low, high },
    bullets,
    disclaimer:
      "This checker is informational only. Verify project-specific exposure with a RERA-qualified advocate and the applicable State Real Estate Regulatory Authority.",
    metadata: { generatedAt: new Date().toISOString(), state: input.state },
  };
}
