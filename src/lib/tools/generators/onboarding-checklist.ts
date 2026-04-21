import type {
  OnboardingChecklistInput,
  OnboardingChecklistOutput,
  ChecklistItem,
  PracticeArea,
} from "@/lib/tools/types";

/**
 * Produces a personalised client-onboarding checklist for a solo /
 * small-firm practice. Items are ordered into a realistic first-72-hour
 * workflow, with explanations and an estimated time per step.
 */
export function generateOnboardingChecklist(
  input: OnboardingChecklistInput
): OnboardingChecklistOutput {
  const {
    practiceArea,
    includeKyc,
    includeDpdp,
    includeConflictCheck,
    includeFeeAdvance,
    complexity,
  } = input;

  const items: ChecklistItem[] = [];
  let step = 1;
  const push = (title: string, detail: string, mins: number) => {
    items.push({ step: step++, title, detail, estimatedMinutes: mins });
  };

  // ---- 1. First contact ----
  push(
    "Log the initial enquiry",
    "Record how the client found you, the referrer (if any), and a one-line description of the matter. Use your CRM, a spreadsheet, or even a notebook — but capture it.",
    5
  );

  push(
    "Schedule the consultation",
    "Send a calendar invite with a short intake questionnaire attached. Mention that nothing discussed prior to a signed engagement creates an attorney-client relationship.",
    10
  );

  // ---- 2. Pre-engagement checks ----
  if (includeConflictCheck) {
    push(
      "Run a conflict check",
      "Check all opposing parties, co-defendants, and related entities against your existing client list. Document the clearance (or recuse). Required under BCI Rule 33.",
      15
    );
  }

  if (includeKyc) {
    push(
      "Collect KYC / PMLA identity documents",
      "Obtain PAN / Aadhaar (masked) / Passport. For entity clients also collect CIN, GSTIN, board resolution and beneficial-ownership declaration. Retain copies in the matter file.",
      20
    );
  }

  // ---- 3. Engagement ----
  push(
    "Send the fee-structure proposal",
    `For ${practiceArea.toLowerCase()} work this would typically include hourly rate, retainer size, scope of services and key exclusions. Pin expectations early to reduce disputes later.`,
    20
  );

  push(
    "Issue the engagement letter",
    "Use a standard engagement / retainer template. Include scope, fees, billing cycle, disbursements, confidentiality, termination and governing law. Get it signed before substantive work begins.",
    25
  );

  if (includeFeeAdvance) {
    push(
      "Raise the fee-advance invoice",
      "Raise a proforma invoice or tax invoice for the agreed advance / retainer. Credit-book it against the client in your BCI Rule 25-29 compliant client account.",
      15
    );
  }

  if (includeDpdp) {
    push(
      "Collect explicit DPDP consent",
      "Under the Digital Personal Data Protection Act, 2023, obtain the client's written consent to collect, process and retain their personal data. State purpose, retention period and the client's rights (access, correction, erasure, grievance).",
      10
    );
  }

  // ---- 4. Matter opening ----
  push(
    "Open the matter file",
    "Assign a matter ID, create physical and digital folders, set retention labels, add key dates (limitation, filing deadlines, hearing dates) to the calendar.",
    15
  );

  // Practice-area specific
  const paSpecific = practiceAreaItems(practiceArea);
  for (const it of paSpecific) push(it.title, it.detail, it.mins);

  // Complexity-driven extras
  if (complexity === "Medium" || complexity === "Complex") {
    push(
      "Draft and send the matter plan",
      "One-page outline of phases, milestones, key deliverables and estimated fee per phase. Approved in writing by the client before Phase 1 begins.",
      30
    );
  }
  if (complexity === "Complex") {
    push(
      "Assemble the matter team",
      "Allocate internal roles (lead, associate, paralegal), brief briefing counsel if applicable, and set up a weekly check-in cadence.",
      30
    );
    push(
      "Set up a shared, access-controlled workspace",
      "Use a DPDP-aligned tool (encrypted at rest, role-based access). Avoid free consumer email attachments for privileged material.",
      20
    );
  }

  // ---- 5. Client success ----
  push(
    "Send the welcome email",
    "Summarise: who your point of contact is, how invoices are raised, preferred communication channel, turnaround expectations, and how to escalate.",
    10
  );

  push(
    "Diarise the first review",
    "Set a 30- or 60-day internal check-in to review progress against the matter plan. Proactive updates beat reactive firefighting every time.",
    5
  );

  const totalMins = items.reduce((s, i) => s + i.estimatedMinutes, 0);

  const header = `
CLIENT ONBOARDING CHECKLIST
Practice area: ${practiceArea}
Matter complexity: ${complexity}
Total estimated time: ~${Math.round(totalMins / 60)}h ${totalMins % 60}m
Generated: ${new Date().toLocaleDateString("en-IN")}
`.trim();

  const body = items
    .map(
      (i) =>
        `${String(i.step).padStart(2, "0")}. [${String(i.estimatedMinutes).padStart(2, "0")}m]  ${i.title}\n    ${wrap(i.detail, 72, "    ")}`
    )
    .join("\n\n");

  const footer = `
Notes
-----
- Tick each item as done; this is your audit trail if a client later
  disputes the engagement terms or DPDP processing.
- Keep the signed engagement letter + DPDP consent in the matter file
  for at least 7 years after closure (or longer per applicable law).
- Revisit this checklist every quarter — practice areas evolve, and so
  should your intake.

— End of Checklist —

Generated by LexiReview for solo and small-firm use. This is an
informational template, not legal advice.
`.trim();

  const checklistText = [header, "", body, "", footer].join("\n");

  return {
    checklistText,
    items,
    metadata: {
      generatedAt: new Date().toISOString(),
      practiceArea,
      complexity,
    },
  };
}

function practiceAreaItems(
  pa: PracticeArea
): { title: string; detail: string; mins: number }[] {
  switch (pa) {
    case "Corporate":
      return [
        {
          title: "Collect corporate records",
          detail: "MoA / AoA, board resolutions, shareholder agreements, latest financials and cap table.",
          mins: 25,
        },
        {
          title: "Flag regulatory touchpoints",
          detail: "Identify any RBI, SEBI, CCI, MCA or FEMA angles early; these drive timelines.",
          mins: 15,
        },
      ];
    case "Litigation":
      return [
        {
          title: "Check limitation & pendency",
          detail: "Compute limitation under the Limitation Act, 1963. Pull any existing court records via the CNR / Case Status portal.",
          mins: 20,
        },
        {
          title: "Collect pleadings & evidence",
          detail: "Prior pleadings, notices, correspondence, receipts, photographs, witness details. Keep originals — work from certified copies.",
          mins: 30,
        },
      ];
    case "IP":
      return [
        {
          title: "Run a prior-art / conflict search",
          detail: "For trademarks, use the IPO's public search. For patents, InPASS + any commercial search. For copyright, document the chain of authorship.",
          mins: 30,
        },
      ];
    case "Real Estate":
      return [
        {
          title: "Obtain title chain & encumbrance certificate",
          detail: "30-year title chain, EC from sub-registrar, RERA registration, property-tax receipts and khata.",
          mins: 40,
        },
      ];
    case "Family":
      return [
        {
          title: "Sensitivity & safety check",
          detail: "In matrimonial / custody matters, screen for domestic violence (PWDVA), child-safety concerns and urgency. Plan communication channels that protect the client.",
          mins: 20,
        },
      ];
    case "Criminal":
      return [
        {
          title: "FIR & charge-sheet review",
          detail: "Obtain FIR copy, charge-sheet (if filed), previous bail orders and custody status. Record limitation under BNSS / CrPC.",
          mins: 30,
        },
      ];
    case "Tax":
      return [
        {
          title: "Collect assessment & notices",
          detail: "ITR copies, assessment orders, scrutiny notices (u/s 143(2), 148, 263), GST assessment orders and demand notices.",
          mins: 25,
        },
      ];
    case "Labor":
      return [
        {
          title: "Collect employment record",
          detail: "Appointment letter, salary slips, leave / disciplinary record, termination / transfer orders, any prior complaints (IC / POSH).",
          mins: 20,
        },
      ];
    case "Other":
    default:
      return [];
  }
}

function wrap(s: string, width: number, pad: string): string {
  const words = s.split(/\s+/);
  const lines: string[] = [];
  let cur = "";
  for (const w of words) {
    if ((cur + " " + w).trim().length > width) {
      lines.push(cur.trim());
      cur = w;
    } else {
      cur = (cur + " " + w).trim();
    }
  }
  if (cur) lines.push(cur.trim());
  return lines.join("\n" + pad);
}
