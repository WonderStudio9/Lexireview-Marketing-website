/**
 * Seeds Week 6 email sequences: 9 sequences across RE Developers, NBFCs,
 * Tier-1 Law Firms and Citizen ICPs (MSME, Tenant, Home Buyer).
 *
 * Run: cd /var/www/lexiforge && npx tsx prisma/seed-email-sequences-week6.ts
 * Idempotent — safe to re-run (skips sequences whose name already exists).
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type Trigger =
  | "LEAD_CAPTURED"
  | "LEAD_MAGNET_DOWNLOADED"
  | "TOOL_COMPLETED"
  | "TRIAL_STARTED"
  | "TRIAL_REVIEW_1_USED"
  | "TRIAL_REVIEW_3_USED"
  | "TRIAL_EXPIRED"
  | "FIRST_PAYMENT"
  | "DEMO_BOOKED"
  | "DEMO_NO_SHOW"
  | "MANUAL_ADD";

// Note: DEMO_DONE was requested in the spec but the schema does not define it.
// The closest trigger available is DEMO_BOOKED; we use that for post-demo
// follow-ups and rely on a downstream worker to only fire it after the
// scheduled demo datetime has passed.
// BLOG_READ was also requested but is not a schema trigger — we use
// LEAD_MAGNET_DOWNLOADED as a proxy for content-engaged NBFC leads.

type TargetICP =
  | "TENANT_LANDLORD"
  | "HOME_BUYER"
  | "MSME_OWNER"
  | "RE_DEVELOPER"
  | "MID_NBFC"
  | "LARGE_NBFC"
  | "TIER1_LAW_FIRM";

interface TemplateSeed {
  order: number;
  delayHours: number;
  subject: string;
  bodyHtml: string;
  bodyText: string;
}

interface SequenceSeed {
  name: string;
  description: string;
  trigger: Trigger;
  targetICP?: TargetICP;
  templates: TemplateSeed[];
}

// ==========================================
// Template builders (same pattern as Week 1/2)
// ==========================================

function wrapHtml(heading: string, bodyInner: string): string {
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8" /><title>${escapeHtml(heading)}</title></head>
<body style="margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:#f8fafc;">
  <div style="max-width:560px;margin:0 auto;padding:40px 24px;">
    <div style="background:linear-gradient(135deg,#2563eb 0%,#1d4ed8 100%);color:white;padding:24px 32px;border-radius:16px 16px 0 0;">
      <h1 style="margin:0;font-size:20px;font-weight:700;letter-spacing:-0.02em;">LexiReview</h1>
    </div>
    <div style="background:white;padding:32px;border-radius:0 0 16px 16px;border:1px solid #e2e8f0;border-top:none;">
      <h2 style="margin:0 0 16px;color:#0f172a;font-size:22px;">${escapeHtml(heading)}</h2>
      ${bodyInner}
      <p style="color:#64748b;font-size:13px;margin-top:24px;">— Team LexiReview</p>
    </div>
    <p style="text-align:center;color:#94a3b8;font-size:12px;margin-top:24px;">
      LexiDraft Technologies • Bengaluru, India<br/>
      <a href="https://lexireview.in" style="color:#94a3b8;">lexireview.in</a> •
      <a href="https://lexireview.in/unsubscribe" style="color:#94a3b8;">unsubscribe</a>
    </p>
  </div>
</body>
</html>`;
}

function welcomeHtml(
  heading: string,
  intro: string,
  ctas: { href: string; label: string }[],
): string {
  const ctasHtml = ctas
    .map(
      (c) =>
        `<li style="margin-bottom:12px;"><a href="${c.href}" style="color:#2563eb;text-decoration:none;font-weight:500;">${escapeHtml(c.label)} →</a></li>`,
    )
    .join("");
  return wrapHtml(
    heading,
    `<p style="color:#1e293b;line-height:1.6;font-size:15px;">${escapeHtml(intro)}</p>
     <ul style="color:#1e293b;line-height:1.8;font-size:15px;padding-left:20px;">${ctasHtml}</ul>`,
  );
}

function bulletsHtml(
  heading: string,
  intro: string,
  ctas: { href: string; label: string }[],
): string {
  return welcomeHtml(heading, intro, ctas);
}

function plainHtml(
  heading: string,
  body: string,
  ctas: { href: string; label: string }[] = [],
): string {
  const ctasHtml = ctas
    .map(
      (c) =>
        `<a href="${c.href}" style="display:inline-block;margin-top:16px;margin-right:12px;background:#2563eb;color:white;padding:10px 20px;border-radius:8px;text-decoration:none;font-size:14px;font-weight:500;">${escapeHtml(c.label)}</a>`,
    )
    .join("");
  return wrapHtml(
    heading,
    `<p style="color:#1e293b;line-height:1.6;font-size:15px;">${escapeHtml(body)}</p>
     <div>${ctasHtml}</div>`,
  );
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// ==========================================
// Sequences
// ==========================================

const SEQUENCES: SequenceSeed[] = [
  // ==========================================
  // 1. RE_DEVELOPER_WELCOME (4 emails, 14 days)
  // ==========================================
  {
    name: "RE_DEVELOPER_WELCOME",
    description:
      "4-email welcome sequence for real-estate developers captured via RERA tools or solutions page.",
    trigger: "LEAD_CAPTURED",
    targetICP: "RE_DEVELOPER",
    templates: [
      {
        order: 1,
        delayHours: 0,
        subject: "Welcome — your 6 RERA compliance tools are live",
        bodyHtml: bulletsHtml(
          "Start with these",
          "You're in. These 6 RERA-specific tools are the ones our developer customers run first. Each one takes 3–5 minutes and flags the gaps that regulators actually check.",
          [
            {
              href: "https://lexireview.in/tools/rera-compliance-checker",
              label: "RERA Compliance Checker",
            },
            {
              href: "https://lexireview.in/tools/builder-buyer-agreement-analyzer",
              label: "Builder-Buyer Agreement Analyzer",
            },
            {
              href: "https://lexireview.in/tools/escrow-70-calculator",
              label: "70% Escrow Calculator",
            },
            {
              href: "https://lexireview.in/tools/rera-project-registration-checker",
              label: "Project Registration Readiness Checker",
            },
            {
              href: "https://lexireview.in/tools/possession-delay-compensation",
              label: "Possession Delay Compensation Estimator",
            },
            {
              href: "https://lexireview.in/lead-magnets/rera-compliance-handbook",
              label: "Download the RERA Compliance Handbook (80 pages)",
            },
          ],
        ),
        bodyText: `Welcome to LexiReview.\n\nThe 6 RERA tools our developer customers run first:\n\n1. RERA Compliance Checker: https://lexireview.in/tools/rera-compliance-checker\n2. Builder-Buyer Agreement Analyzer: https://lexireview.in/tools/builder-buyer-agreement-analyzer\n3. 70% Escrow Calculator: https://lexireview.in/tools/escrow-70-calculator\n4. Project Registration Readiness: https://lexireview.in/tools/rera-project-registration-checker\n5. Possession Delay Compensation: https://lexireview.in/tools/possession-delay-compensation\n6. RERA Compliance Handbook (80 pages): https://lexireview.in/lead-magnets/rera-compliance-handbook\n\nReply with any questions — we read every reply.\n\n— Team LexiReview`,
      },
      {
        order: 2,
        delayHours: 48,
        subject: "MahaRERA vs HRERA vs KRERA — the differences that trip developers",
        bodyHtml: plainHtml(
          "State-wise RERA differences",
          "The Central RERA Act is one thing. The state rules are another. MahaRERA enforces strict project-level escrow audits, HRERA has unique possession-date recalculation rules, and KRERA has tighter agent registration timelines. We've mapped the top 15 differences across 18 states — if you operate in multiple states, this saves weeks of confusion.",
          [
            {
              href: "https://lexireview.in/blog/maharera-vs-hrera-vs-krera-state-wise-comparison",
              label: "Read the state-wise comparison",
            },
            {
              href: "https://lexireview.in/tools/rera-compliance-checker",
              label: "Run a state-specific compliance check",
            },
          ],
        ),
        bodyText: `MahaRERA vs HRERA vs KRERA — the differences that matter.\n\nCentral RERA is one thing; state rules are another. MahaRERA has stricter escrow audits, HRERA has unique possession-date rules, KRERA has tighter agent timelines. If you operate in multiple states, this is weeks of confusion avoided.\n\nRead: https://lexireview.in/blog/maharera-vs-hrera-vs-krera-state-wise-comparison\nRun state check: https://lexireview.in/tools/rera-compliance-checker`,
      },
      {
        order: 3,
        delayHours: 120,
        subject: "The 70% escrow rule — 5 mistakes that cost developers registration",
        bodyHtml: plainHtml(
          "70% escrow — avoid these",
          "Section 4(2)(l)(D) sounds simple: 70% of buyer money into a project escrow. In practice, the rule trips up even experienced developers. The five most common mistakes: (1) co-mingling escrow with corporate accounts, (2) misreading what counts as 'amount realised', (3) withdrawing before CA/engineer/architect tri-certification, (4) wrong treatment of GST in the 70% base, (5) using the same escrow across phases. Each one can pause registration.",
          [
            {
              href: "https://lexireview.in/blog/rera-70-percent-escrow-mistakes-developers",
              label: "Read the full breakdown",
            },
            {
              href: "https://lexireview.in/tools/escrow-70-calculator",
              label: "Run the escrow calculator",
            },
          ],
        ),
        bodyText: `70% escrow rule — 5 mistakes that cost developers their registration:\n\n1. Co-mingling escrow with corporate accounts\n2. Misreading 'amount realised'\n3. Withdrawing before CA/engineer/architect tri-certification\n4. Wrong GST treatment in the 70% base\n5. One escrow across phases\n\nFull breakdown: https://lexireview.in/blog/rera-70-percent-escrow-mistakes-developers\nEscrow calculator: https://lexireview.in/tools/escrow-70-calculator`,
      },
      {
        order: 4,
        delayHours: 240,
        subject: "Quick demo? + a case study you'll want to read",
        bodyHtml: plainHtml(
          "Developer case study + demo",
          "One of our developer customers, a mid-sized builder with 4 active projects in MMR, moved their RERA compliance score from 62/100 to 95/100 in 90 days using LexiReview. Builder-buyer agreements, escrow tracking, quarterly filings — all in one workspace. Want a 20-minute walkthrough tailored to your project portfolio?",
          [
            {
              href: "https://cal.lexireview.in/enterprise",
              label: "Book a 20-min demo",
            },
            {
              href: "https://lexireview.in/blog/developer-62-to-95-rera-score-case-study",
              label: "Read the case study",
            },
          ],
        ),
        bodyText: `Developer case study: RERA score 62 → 95 in 90 days.\n\nMid-sized MMR builder, 4 projects. Builder-buyer agreements, escrow tracking, quarterly filings — one workspace.\n\nRead: https://lexireview.in/blog/developer-62-to-95-rera-score-case-study\nBook demo: https://cal.lexireview.in/enterprise`,
      },
    ],
  },

  // ==========================================
  // 2. RE_DEVELOPER_COMPLIANCE_GAP (3 emails)
  // ==========================================
  {
    name: "RE_DEVELOPER_COMPLIANCE_GAP",
    description:
      "Follow-up for developers who completed the RERA Compliance Checker tool. Surfaces their score, gaps and the paid audit upgrade.",
    trigger: "TOOL_COMPLETED",
    targetICP: "RE_DEVELOPER",
    templates: [
      {
        order: 1,
        delayHours: 0,
        subject: "Your RERA compliance score — and the 3 gaps we'd fix first",
        bodyHtml: plainHtml(
          "Your score + top gaps",
          "Thanks for running the RERA Compliance Checker. Your result, along with the statute references for each finding, is saved in your account. The three gap categories developers most commonly hit are: (1) builder-buyer agreement clause drift from the state model form, (2) quarterly filing delays, (3) escrow withdrawal paperwork missing tri-party sign-off. We've linked the handbook sections for each below.",
          [
            {
              href: "https://app.lexireview.in/compliance/rera",
              label: "View your full report",
            },
            {
              href: "https://lexireview.in/lead-magnets/rera-compliance-handbook",
              label: "RERA Compliance Handbook",
            },
          ],
        ),
        bodyText: `Your RERA compliance result is saved in your account.\n\nThe 3 gap categories developers most commonly hit:\n1. Builder-buyer clause drift from state model\n2. Quarterly filing delays\n3. Escrow withdrawal missing tri-party sign-off\n\nFull report: https://app.lexireview.in/compliance/rera\nHandbook: https://lexireview.in/lead-magnets/rera-compliance-handbook`,
      },
      {
        order: 2,
        delayHours: 72,
        subject: "62 → 95: what one developer actually did in 90 days",
        bodyHtml: plainHtml(
          "The 90-day playbook",
          "A Hyderabad-based developer with 3 ongoing projects started at a compliance score of 62. Ninety days later, they were at 95. The work was unglamorous: rewriting two standard BBA templates, moving quarterly filings onto a calendar with automatic reminders, and running every new contract through LexiReview before signing. We wrote up every step — including the internal objections they had to overcome.",
          [
            {
              href: "https://lexireview.in/blog/developer-62-to-95-rera-score-case-study",
              label: "Read the 90-day case study",
            },
          ],
        ),
        bodyText: `62 → 95 in 90 days — what a Hyderabad developer actually did.\n\nRewrote 2 BBA templates, moved quarterly filings onto auto-reminder calendars, ran every new contract through LexiReview first.\n\nFull write-up: https://lexireview.in/blog/developer-62-to-95-rera-score-case-study`,
      },
      {
        order: 3,
        delayHours: 240,
        subject: "Full compliance audit — ₹9,999 one-off, 10 business days",
        bodyHtml: plainHtml(
          "Go beyond the self-check",
          "The self-serve tool gives you a directional score. Our paid audit goes further: a RERA-trained reviewer checks all your BBAs, your escrow reconciliation, last 4 quarters of filings, and gives you a written remediation plan. ₹9,999 one-off, delivered within 10 business days, credited against your first Professional-tier subscription.",
          [
            {
              href: "https://app.lexireview.in/audit/rera",
              label: "Book the audit",
            },
            {
              href: "mailto:founder@lexireview.in?subject=RERA%20audit%20enquiry",
              label: "Ask a question first",
            },
          ],
        ),
        bodyText: `Full RERA compliance audit — ₹9,999 one-off, delivered in 10 business days.\n\nIncludes: BBAs reviewed, escrow reconciled, 4 quarters of filings checked, written remediation plan. Credited against your first Professional subscription.\n\nBook: https://app.lexireview.in/audit/rera\nQuestions: founder@lexireview.in`,
      },
    ],
  },

  // ==========================================
  // 3. NBFC_WELCOME (3 emails, 10 days)
  // ==========================================
  {
    name: "NBFC_WELCOME",
    description:
      "3-email welcome sequence for NBFC leads (mid and large). RBI compliance focus, ROI calculator.",
    trigger: "LEAD_CAPTURED",
    targetICP: "MID_NBFC",
    templates: [
      {
        order: 1,
        delayHours: 0,
        subject: "Welcome — LexiReview for NBFCs in 3 minutes",
        bodyHtml: bulletsHtml(
          "Start here",
          "You're in. LexiReview is built around RBI Master Directions, Scale-Based Regulation tiering, and the full NBFC contract stack — co-lending agreements, DA/DBT, DSA/collection, vendor, outsourcing. These are the resources our NBFC customers read first.",
          [
            {
              href: "https://lexireview.in/solutions/nbfc",
              label: "NBFC solution overview",
            },
            {
              href: "https://lexireview.in/tools/rbi-master-direction-checker",
              label: "RBI Master Direction gap checker",
            },
            {
              href: "https://lexireview.in/tools/co-lending-agreement-analyzer",
              label: "Co-lending agreement analyzer",
            },
            {
              href: "https://lexireview.in/tools/fair-practice-code-auditor",
              label: "Fair Practices Code auditor",
            },
          ],
        ),
        bodyText: `Welcome to LexiReview.\n\nBuilt around RBI Master Directions, Scale-Based Regulation tiering, and the full NBFC contract stack.\n\n- NBFC overview: https://lexireview.in/solutions/nbfc\n- RBI MD gap checker: https://lexireview.in/tools/rbi-master-direction-checker\n- Co-lending analyzer: https://lexireview.in/tools/co-lending-agreement-analyzer\n- Fair Practices Code auditor: https://lexireview.in/tools/fair-practice-code-auditor`,
      },
      {
        order: 2,
        delayHours: 72,
        subject: "What AI catches in NBFC contracts that manual review misses",
        bodyHtml: plainHtml(
          "Manual review's blind spots",
          "In 2,500+ NBFC contract reviews we've done, the same gaps recur: (1) outsourcing agreements missing RBI's business continuity clause, (2) co-lending MoUs silent on NPA recognition and write-off sharing, (3) DSA agreements without grievance redressal SLAs, (4) vendor contracts missing cyber incident notification under the 2023 IT framework, (5) collection agency MoUs silent on fair practices adherence. A human reviewer catches 60–70% of these. Our engines catch 95%+, and cite the exact MD paragraph every time.",
          [
            {
              href: "https://lexireview.in/blog/ai-contract-review-nbfc-rbi-gaps",
              label: "Read the 5 most common gaps",
            },
            {
              href: "https://cal.lexireview.in/enterprise",
              label: "Book a 20-min NBFC demo",
            },
          ],
        ),
        bodyText: `The 5 gaps AI catches in NBFC contracts that manual review misses:\n\n1. Outsourcing agreements missing RBI business-continuity clause\n2. Co-lending MoUs silent on NPA recognition + write-off sharing\n3. DSA agreements without grievance redressal SLAs\n4. Vendor contracts missing cyber incident notification (2023 IT framework)\n5. Collection agency MoUs silent on fair-practices adherence\n\nRead: https://lexireview.in/blog/ai-contract-review-nbfc-rbi-gaps\nBook demo: https://cal.lexireview.in/enterprise`,
      },
      {
        order: 3,
        delayHours: 192,
        subject: "Your NBFC ROI: what 500 contract reviews a month saves",
        bodyHtml: plainHtml(
          "Run the ROI numbers",
          "For a mid-sized NBFC doing 500 contract reviews a month (co-lending, DSA, vendor, outsourcing), manual review averages 2–4 hours per contract at a blended cost of ₹2,800/hour. LexiReview averages 45 seconds per contract at ₹70 of compute. Even at the conservative end, that's ₹14 lakh a month saved — and the audit trail is chain-hashed and CAG-suitable. Our ROI calculator lets you plug in your actual volumes.",
          [
            {
              href: "https://lexireview.in/tools/nbfc-roi-calculator",
              label: "Run the ROI calculator",
            },
            {
              href: "https://cal.lexireview.in/enterprise",
              label: "Book a demo with the numbers",
            },
          ],
        ),
        bodyText: `NBFC ROI at 500 reviews/month:\n\nManual: 2-4 hrs × ₹2,800/hr\nLexiReview: 45 sec × ₹70 compute\nConservative estimate: ₹14 lakh/month saved. Chain-hashed, CAG-suitable audit trail.\n\nCalculator: https://lexireview.in/tools/nbfc-roi-calculator\nBook demo: https://cal.lexireview.in/enterprise`,
      },
    ],
  },

  // ==========================================
  // 4. NBFC_CONTRACT_COMPLIANCE (3 emails)
  // ==========================================
  {
    name: "NBFC_CONTRACT_COMPLIANCE",
    description:
      "Nurture for NBFC leads who have engaged with NBFC-specific content (used LEAD_MAGNET_DOWNLOADED as the closest schema trigger, interpreted as blog/content engagement).",
    trigger: "LEAD_MAGNET_DOWNLOADED",
    targetICP: "MID_NBFC",
    templates: [
      {
        order: 1,
        delayHours: 0,
        subject: "More RBI contract topics you'll want next",
        bodyHtml: bulletsHtml(
          "Continue reading",
          "Based on what you read, these are the next four pieces our NBFC readers click through to. All written by the LexiReview compliance team and updated for the 2025 Master Directions.",
          [
            {
              href: "https://lexireview.in/blog/nbfc-outsourcing-agreement-rbi-checklist",
              label: "RBI outsourcing agreement checklist (17 clauses)",
            },
            {
              href: "https://lexireview.in/blog/co-lending-agreement-review-guide",
              label: "Co-lending agreements — clause-by-clause guide",
            },
            {
              href: "https://lexireview.in/blog/scale-based-regulation-npbfc-mid-upper-layer",
              label: "Scale-Based Regulation: Base, Middle, Upper, Top layer",
            },
            {
              href: "https://lexireview.in/blog/npbfc-digital-lending-guidelines-contract-impact",
              label: "Digital Lending Guidelines — 2022 & 2024 contract updates",
            },
          ],
        ),
        bodyText: `More RBI contract topics you'll want next:\n\n- RBI outsourcing checklist: https://lexireview.in/blog/nbfc-outsourcing-agreement-rbi-checklist\n- Co-lending clause guide: https://lexireview.in/blog/co-lending-agreement-review-guide\n- Scale-Based Regulation layers: https://lexireview.in/blog/scale-based-regulation-npbfc-mid-upper-layer\n- Digital Lending contract updates: https://lexireview.in/blog/npbfc-digital-lending-guidelines-contract-impact`,
      },
      {
        order: 2,
        delayHours: 120,
        subject: "DPDP + NBFC — the 2026 double compliance mandate",
        bodyHtml: plainHtml(
          "DPDP on top of RBI",
          "From 2026, every NBFC has to meet DPDP Act obligations on top of the existing RBI framework — consent architecture, data fiduciary notices, breach notifications within 72 hours, and erasure-on-request. The places this lands in your contracts: DSA agreements, collection MoUs, co-lending arrangements, and every vendor that touches borrower data. We've built a side-by-side map of RBI Master Directions and DPDP requirements so nothing gets double-counted or missed.",
          [
            {
              href: "https://lexireview.in/blog/dpdp-nbfc-double-compliance-2026",
              label: "Read the 2026 compliance map",
            },
            {
              href: "https://lexireview.in/lead-magnets/dpdp-nbfc-contract-checklist",
              label: "DPDP + NBFC contract checklist (PDF)",
            },
          ],
        ),
        bodyText: `DPDP + NBFC — the 2026 double compliance mandate.\n\nConsent architecture, fiduciary notices, 72-hour breach notifications, erasure-on-request — all landing in DSA, collection, co-lending and vendor contracts.\n\nCompliance map: https://lexireview.in/blog/dpdp-nbfc-double-compliance-2026\nChecklist: https://lexireview.in/lead-magnets/dpdp-nbfc-contract-checklist`,
      },
      {
        order: 3,
        delayHours: 288,
        subject: "Case study + a quick demo offer",
        bodyHtml: plainHtml(
          "What one mid-NBFC did",
          "A mid-layer NBFC (₹4,200 Cr AUM, 18 lending partners) moved from a 14-day average contract turnaround to under 3 days using LexiReview. The outsourcing team now processes 3x the volume with the same headcount, and every contract carries a chain-hashed audit trail for the inspection cycle. Full write-up below, plus a short demo if you'd like to see how it maps to your stack.",
          [
            {
              href: "https://lexireview.in/blog/mid-nbfc-14d-to-3d-turnaround-case-study",
              label: "Read the case study",
            },
            {
              href: "https://cal.lexireview.in/enterprise",
              label: "Book a 20-min demo",
            },
          ],
        ),
        bodyText: `Case study: mid-NBFC (₹4,200 Cr AUM, 18 lending partners) moved contract turnaround from 14 days to under 3 days. 3x volume with the same headcount, chain-hashed audit trail.\n\nRead: https://lexireview.in/blog/mid-nbfc-14d-to-3d-turnaround-case-study\nBook demo: https://cal.lexireview.in/enterprise`,
      },
    ],
  },

  // ==========================================
  // 5. TIER1_LAW_FIRM_WELCOME (3 emails, 10 days)
  // ==========================================
  {
    name: "TIER1_LAW_FIRM_WELCOME",
    description:
      "Partner-to-partner welcome sequence for Tier-1 law firms. Enterprise overview, security pack, AI adoption benchmark.",
    trigger: "LEAD_CAPTURED",
    targetICP: "TIER1_LAW_FIRM",
    templates: [
      {
        order: 1,
        delayHours: 0,
        subject: "A brief introduction, and three documents worth your time",
        bodyHtml: plainHtml(
          "Introduction",
          "Thank you for the interest. LexiReview is built specifically for Indian legal practice, and currently serves a number of Tier-1 and full-service firms in a white-label configuration. Three documents should give you a complete picture: the enterprise overview, our security and data-handling pack (VAPT, DPDP, SOC 2 roadmap, hosting specifics), and a link to book twenty minutes with our enterprise team at a time that suits you. If it would be simpler, the partner on your account will respond to a reply here within one working day.",
          [
            {
              href: "https://lexireview.in/solutions/law-firms",
              label: "Enterprise overview",
            },
            {
              href: "https://lexireview.in/security",
              label: "Security & data-handling pack",
            },
            {
              href: "https://cal.lexireview.in/enterprise",
              label: "Book twenty minutes",
            },
          ],
        ),
        bodyText: `Thank you for the interest. LexiReview is built specifically for Indian legal practice and currently serves a number of Tier-1 and full-service firms in white-label configurations.\n\nThree documents:\n- Enterprise overview: https://lexireview.in/solutions/law-firms\n- Security pack (VAPT, DPDP, SOC 2 roadmap, hosting): https://lexireview.in/security\n- Book twenty minutes: https://cal.lexireview.in/enterprise\n\nHappy to answer anything directly — a reply to this email reaches the partner on your account within one working day.\n\n— Team LexiReview`,
      },
      {
        order: 2,
        delayHours: 96,
        subject: "Two case studies and the AI Adoption Benchmark for Indian law firms",
        bodyHtml: plainHtml(
          "Sharing some evidence",
          "We run an annual AI Adoption Benchmark across full-service Indian firms — this year's report covers 37 firms and tracks tool deployment, partner-level adoption, matter-level ROI, and client communication practices. Alongside it, two case studies worth a read: a full-service firm that standardised its M&A due-diligence workflow on LexiReview, and a regional full-service firm that replaced a US-built tool and recovered three paralegal FTEs of capacity. All three documents are attached to your account and linked below.",
          [
            {
              href: "https://lexireview.in/lead-magnets/ai-adoption-benchmark-indian-law-firms",
              label: "AI Adoption Benchmark (2025)",
            },
            {
              href: "https://lexireview.in/case-studies/ma-due-diligence-tier1-firm",
              label: "Case study: M&A DD standardisation",
            },
            {
              href: "https://lexireview.in/case-studies/regional-firm-us-tool-replacement",
              label: "Case study: US-tool replacement",
            },
          ],
        ),
        bodyText: `AI Adoption Benchmark + two case studies.\n\n- Benchmark (37 full-service firms): https://lexireview.in/lead-magnets/ai-adoption-benchmark-indian-law-firms\n- M&A DD standardisation: https://lexireview.in/case-studies/ma-due-diligence-tier1-firm\n- Regional firm replacing a US tool: https://lexireview.in/case-studies/regional-firm-us-tool-replacement`,
      },
      {
        order: 3,
        delayHours: 240,
        subject: "A custom ROI report for your firm, if useful",
        bodyHtml: plainHtml(
          "Tailored to your firm size",
          "If it would help internal conversations, we are happy to put together a custom ROI report for your firm — sized to your headcount, matter mix, and current review throughput, with a comparable reference from a firm of similar scale. It takes about five business days to produce and requires only a short call. Let us know if that would be useful, and we'll set it up.",
          [
            {
              href: "https://cal.lexireview.in/enterprise",
              label: "Schedule the scoping call",
            },
            {
              href: "mailto:founder@lexireview.in?subject=Custom%20ROI%20report%20-%20Tier-1%20firm",
              label: "Reply directly",
            },
          ],
        ),
        bodyText: `A custom ROI report for your firm — sized to headcount, matter mix, and current throughput, with a reference from a firm of comparable scale. About five business days to produce, one short scoping call.\n\nSchedule: https://cal.lexireview.in/enterprise\nOr reply to this email: founder@lexireview.in`,
      },
    ],
  },

  // ==========================================
  // 6. TIER1_POST_DEMO (3 emails)
  // ==========================================
  {
    name: "TIER1_POST_DEMO",
    description:
      "Post-demo follow-up for Tier-1 firms. Uses DEMO_BOOKED trigger (closest to the requested DEMO_DONE); downstream worker fires after the demo datetime.",
    trigger: "DEMO_BOOKED",
    targetICP: "TIER1_LAW_FIRM",
    templates: [
      {
        order: 1,
        delayHours: 24,
        subject: "Thank you for the time — recap and decision deck attached",
        bodyHtml: plainHtml(
          "Recap",
          "Thank you for the conversation yesterday. As promised, the decision deck is attached to your account — it covers the deployment options we discussed (shared tenant vs dedicated, white-label, integration touchpoints with your matter management system), the commercial structure, and the data-handling specifics your IT team asked about. Two clarifications from the call are flagged in the deck. Please let us know of any follow-up questions, and we'll get them answered within a working day.",
          [
            {
              href: "https://app.lexireview.in/docs/tier1-decision-deck",
              label: "Open the decision deck",
            },
            {
              href: "mailto:founder@lexireview.in?subject=Post-demo%20follow-up",
              label: "Reply with questions",
            },
          ],
        ),
        bodyText: `Thank you for the time.\n\nThe decision deck is on your account — deployment options, commercial structure, data-handling specifics. Two clarifications from the call are flagged.\n\nDeck: https://app.lexireview.in/docs/tier1-decision-deck\nReply: founder@lexireview.in`,
      },
      {
        order: 2,
        delayHours: 120,
        subject: "Reference call with a comparable firm, if helpful",
        bodyHtml: plainHtml(
          "Reference call",
          "Several of the firms we spoke to at this stage found a short reference call with a peer institution useful. We can arrange a call with a managing partner at a comparable full-service firm who has been on LexiReview for eighteen months — they have offered to speak candidly about procurement, rollout, and partner adoption. Let us know if that would be useful and we'll introduce.",
          [
            {
              href: "mailto:founder@lexireview.in?subject=Reference%20call%20request",
              label: "Ask for the introduction",
            },
          ],
        ),
        bodyText: `Reference call with a comparable firm, if helpful.\n\nA managing partner at a full-service peer firm (18 months on LexiReview) has offered to speak candidly about procurement, rollout and partner adoption. Happy to make the introduction — reply to set it up.\n\nfounder@lexireview.in`,
      },
      {
        order: 3,
        delayHours: 336,
        subject: "Checking in — a possible pilot scope",
        bodyHtml: plainHtml(
          "A light pilot",
          "A gentle follow-up. If a full procurement process is some way out, several firms have found it useful to begin with a six-week pilot on a single practice group — typically M&A or banking & finance. We'd scope it to five named users, full feature set, a dedicated reviewer from our side, and a written post-pilot report. A pilot of that shape is a useful input to the formal decision and commits your firm to nothing beyond the six weeks. Happy to share the standard pilot scope if it helps.",
          [
            {
              href: "https://cal.lexireview.in/enterprise",
              label: "Discuss a pilot",
            },
            {
              href: "mailto:founder@lexireview.in?subject=Pilot%20scope%20-%20Tier-1",
              label: "Ask for the standard scope",
            },
          ],
        ),
        bodyText: `A possible pilot scope — six weeks, single practice group (typically M&A or banking & finance), five named users, full feature set, dedicated reviewer from our side, written post-pilot report. Useful input to the formal decision, commits the firm to nothing beyond the six weeks.\n\nDiscuss: https://cal.lexireview.in/enterprise\nAsk for scope: founder@lexireview.in`,
      },
    ],
  },

  // ==========================================
  // 7. CITIZEN_MSME_OWNER (4 emails, 14 days)
  // ==========================================
  {
    name: "CITIZEN_MSME_OWNER",
    description:
      "4-email welcome sequence for MSME owners captured via Partnership Deed tool, MSME Payment Delay tool, or MSME content.",
    trigger: "LEAD_CAPTURED",
    targetICP: "MSME_OWNER",
    templates: [
      {
        order: 1,
        delayHours: 0,
        subject: "Welcome — 3 MSME tools to start with",
        bodyHtml: bulletsHtml(
          "Start here",
          "Running an MSME in India means legal friction in three places more than anywhere else: partner agreements, vendor contracts, and delayed payments from big customers. These three tools cover the first two directly, and give you a template to fight the third.",
          [
            {
              href: "https://lexireview.in/tools/partnership-deed-generator",
              label: "Partnership Deed generator (state-specific)",
            },
            {
              href: "https://lexireview.in/tools/msme-payment-delay-notice",
              label: "MSME Payment Delay notice drafter",
            },
            {
              href: "https://lexireview.in/tools/vendor-contract-analyzer",
              label: "Vendor contract analyzer",
            },
          ],
        ),
        bodyText: `Welcome.\n\nThree MSME tools to start with:\n1. Partnership Deed: https://lexireview.in/tools/partnership-deed-generator\n2. MSME Payment Delay notice: https://lexireview.in/tools/msme-payment-delay-notice\n3. Vendor contract analyzer: https://lexireview.in/tools/vendor-contract-analyzer`,
      },
      {
        order: 2,
        delayHours: 72,
        subject: "Section 15 of the MSMED Act — what you can actually recover",
        bodyHtml: plainHtml(
          "MSMED Act payment delays",
          "Section 15 of the MSMED Act says buyers must pay registered MSMEs within 45 days (or the contractual date, whichever is earlier). Section 16 mandates compound interest at three times the RBI bank rate for any delay. Section 18 gives you access to the MSME Samadhaan portal — a conciliation and arbitration mechanism that doesn't need a lawyer. Most MSMEs don't use this because they don't know the procedure. Our guide walks through the notice, filing on Samadhaan, and enforcement — with a sample notice you can send today.",
          [
            {
              href: "https://lexireview.in/blog/msmed-act-section-15-payment-delay-remedies",
              label: "Read the Section 15 guide",
            },
            {
              href: "https://lexireview.in/tools/msme-payment-delay-notice",
              label: "Draft a notice now",
            },
          ],
        ),
        bodyText: `MSMED Act Section 15 — what you can actually recover.\n\nBuyers must pay registered MSMEs within 45 days. Section 16 — compound interest at 3x RBI bank rate on delay. Section 18 — MSME Samadhaan portal for conciliation and arbitration, no lawyer needed.\n\nGuide: https://lexireview.in/blog/msmed-act-section-15-payment-delay-remedies\nDraft notice: https://lexireview.in/tools/msme-payment-delay-notice`,
      },
      {
        order: 3,
        delayHours: 168,
        subject: "GST and TDS clauses in vendor contracts — the 2-minute check",
        bodyHtml: plainHtml(
          "GST + TDS in contracts",
          "Most vendor disputes in MSME books trace back to one of three clause gaps: (1) GST treatment unclear — who bears it if rates change, how ITC flows, reverse-charge situations; (2) TDS mismatch — Section 194C (contractors), 194J (professional services), 194Q (goods) each carry different rates and thresholds and the contract should say which applies; (3) no tax invoice delivery SLA, so payments and ITC get stuck. The vendor contract analyzer runs these checks in under a minute.",
          [
            {
              href: "https://lexireview.in/blog/gst-tds-clauses-vendor-contracts-msme",
              label: "Read the full 2-minute check",
            },
            {
              href: "https://lexireview.in/tools/vendor-contract-analyzer",
              label: "Analyze a vendor contract",
            },
          ],
        ),
        bodyText: `GST + TDS clauses in vendor contracts — the 2-minute check.\n\n1. GST treatment clarity (rate-change, ITC, RCM)\n2. TDS section — 194C, 194J, 194Q — each has different rates and thresholds\n3. Tax invoice delivery SLA\n\nRead: https://lexireview.in/blog/gst-tds-clauses-vendor-contracts-msme\nAnalyze: https://lexireview.in/tools/vendor-contract-analyzer`,
      },
      {
        order: 4,
        delayHours: 288,
        subject: "Ready to scale? Starter plan at ₹4,999/mo covers most MSMEs",
        bodyHtml: plainHtml(
          "Starter pricing for MSMEs",
          "At ₹4,999/mo, the Starter plan gives you 25 contract reviews a month, every premium template, and three user seats for your team. For most MSMEs — a founder, an accounts person, an operations lead — that's enough headroom. If even one late-payment notice gets your ₹5 lakh invoice cleared in 30 days instead of 90, the plan has paid for itself for the year.",
          [
            {
              href: "https://app.lexireview.in/signup",
              label: "Start Starter plan",
            },
            {
              href: "https://lexireview.in/pricing",
              label: "See full pricing",
            },
          ],
        ),
        bodyText: `Starter plan — ₹4,999/mo. 25 contract reviews, every premium template, 3 user seats.\n\nIf one delayed-payment notice clears a ₹5 lakh invoice in 30 days instead of 90, the plan pays for itself for a year.\n\nStart: https://app.lexireview.in/signup\nPricing: https://lexireview.in/pricing`,
      },
    ],
  },

  // ==========================================
  // 8. CITIZEN_TENANT (3 emails)
  // ==========================================
  {
    name: "CITIZEN_TENANT",
    description:
      "3-email welcome sequence for tenants/landlords captured via Rent Agreement or Stamp Duty tool.",
    trigger: "LEAD_CAPTURED",
    targetICP: "TENANT_LANDLORD",
    templates: [
      {
        order: 1,
        delayHours: 0,
        subject: "Welcome — rent agreement + stamp duty, the 2 tools you'll need",
        bodyHtml: bulletsHtml(
          "Start here",
          "Whether you're renting or letting, two tools cover 90% of your legal questions. Both are free and both are state-specific — Maharashtra rules don't apply in Karnataka, and our tools know the difference.",
          [
            {
              href: "https://lexireview.in/tools/rent-agreement-generator",
              label: "Rent Agreement generator (28 states)",
            },
            {
              href: "https://lexireview.in/tools/stamp-duty-calculator",
              label: "Stamp Duty Calculator",
            },
          ],
        ),
        bodyText: `Welcome.\n\nTwo tools that cover most of what you'll need:\n1. Rent Agreement (28 states): https://lexireview.in/tools/rent-agreement-generator\n2. Stamp Duty Calculator: https://lexireview.in/tools/stamp-duty-calculator\n\nBoth free, both state-specific.`,
      },
      {
        order: 2,
        delayHours: 72,
        subject: "11-month vs 1-year rent agreement — when registration kicks in",
        bodyHtml: plainHtml(
          "The 11-month trick",
          "You've probably heard of the '11-month agreement'. The reason: Section 17 of the Registration Act makes agreements of one year or more mandatorily registrable — which means higher stamp duty, registrar appointment, notarisation, the whole works. Eleven-month agreements skip all that. But they are not always the right answer: if you want clear legal protection as a tenant, a registered lease carries much more weight in a dispute, and some banks will not accept an 11-month document as address proof. We walk through when each one makes sense.",
          [
            {
              href: "https://lexireview.in/blog/11-month-vs-1-year-rent-agreement-registration",
              label: "Read: 11-month vs 1-year",
            },
            {
              href: "https://lexireview.in/tools/rent-agreement-generator",
              label: "Generate either kind",
            },
          ],
        ),
        bodyText: `11-month vs 1-year rent agreement — when registration kicks in.\n\nSection 17 of the Registration Act — agreements of 1 year or more must be registered. 11 months skip that. But registered leases carry more weight in disputes, and some banks don't accept 11-month docs as address proof.\n\nRead: https://lexireview.in/blog/11-month-vs-1-year-rent-agreement-registration\nGenerate: https://lexireview.in/tools/rent-agreement-generator`,
      },
      {
        order: 3,
        delayHours: 168,
        subject: "Tenant rights 101 — what your landlord can and cannot do",
        bodyHtml: plainHtml(
          "Your rights as a tenant",
          "Under the Model Tenancy Act 2021 and state rent-control laws, your landlord cannot: (1) enter the premises without 24 hours' written notice, (2) cut off water or electricity to force you out, (3) increase rent during the agreement term except as the contract provides, (4) evict you without a proper legal notice and court order, (5) retain the deposit beyond the agreed time without itemised deductions. You can: negotiate the notice period, ask for interest on your deposit under state rent laws, and record any harassment with the local rent controller. Our guide covers the full list with state-wise variations.",
          [
            {
              href: "https://lexireview.in/blog/tenant-rights-india-landlord-101",
              label: "Read the full tenant rights guide",
            },
          ],
        ),
        bodyText: `Tenant rights 101 — what your landlord can and cannot do.\n\nYour landlord cannot:\n- Enter without 24-hr written notice\n- Cut water or electricity\n- Increase rent during the term (unless the contract says so)\n- Evict without notice and court order\n- Withhold deposit beyond agreed time without itemised deductions\n\nFull guide (with state variations): https://lexireview.in/blog/tenant-rights-india-landlord-101`,
      },
    ],
  },

  // ==========================================
  // 9. CITIZEN_HOME_BUYER (4 emails)
  // ==========================================
  {
    name: "CITIZEN_HOME_BUYER",
    description:
      "4-email welcome sequence for home buyers captured via Stamp Duty or Builder-Buyer Analyzer tool.",
    trigger: "LEAD_CAPTURED",
    targetICP: "HOME_BUYER",
    templates: [
      {
        order: 1,
        delayHours: 0,
        subject: "Welcome — before you sign that builder-buyer agreement",
        bodyHtml: bulletsHtml(
          "Start here",
          "Buying a home in India involves two documents nobody reads carefully enough: the stamp duty certificate, and the builder-buyer agreement. These two tools flag the issues before you sign — each takes under five minutes.",
          [
            {
              href: "https://lexireview.in/tools/real-estate-stamp-duty-calculator",
              label: "RE Stamp Duty Calculator (state + buyer category)",
            },
            {
              href: "https://lexireview.in/tools/builder-buyer-agreement-analyzer",
              label: "Builder-Buyer Agreement Analyzer",
            },
          ],
        ),
        bodyText: `Welcome.\n\nTwo tools every home buyer should run before signing:\n1. RE Stamp Duty Calculator (state + buyer category): https://lexireview.in/tools/real-estate-stamp-duty-calculator\n2. Builder-Buyer Agreement Analyzer: https://lexireview.in/tools/builder-buyer-agreement-analyzer`,
      },
      {
        order: 2,
        delayHours: 48,
        subject: "15 red flags in builder-buyer agreements",
        bodyHtml: plainHtml(
          "What to look for",
          "After running the analyzer over thousands of builder-buyer agreements, fifteen clauses come up again and again: one-sided termination rights, extended grace periods (6-12 months on top of possession), buyer penalty 10x builder penalty, super-built area calculated at builder's sole discretion, forfeiture of 10%+ on cancellation, no interest on delayed refunds, arbitration seat in builder's city, unilateral modification rights, OC-linked possession (not physical handover), car park as 'licence' not 'sale', club membership mandatory, maintenance contracts auto-rolling for 3 years, escalation clauses uncapped, stamp duty burden shifted to buyer, and force majeure written so broadly it covers anything. Our guide explains what each one does to you and what to push back on.",
          [
            {
              href: "https://lexireview.in/blog/15-red-flags-builder-buyer-agreements",
              label: "Read the 15 red flags",
            },
            {
              href: "https://lexireview.in/tools/builder-buyer-agreement-analyzer",
              label: "Analyze your BBA",
            },
          ],
        ),
        bodyText: `15 red flags in builder-buyer agreements:\n\n- One-sided termination\n- 6-12 month grace period on top of possession\n- Buyer penalty 10x builder penalty\n- Super-built area at builder discretion\n- 10%+ forfeiture on cancellation\n- No interest on delayed refunds\n- Arbitration seat in builder's city\n- Unilateral modification rights\n- OC-linked possession\n- Car park as licence not sale\n- Mandatory club membership\n- 3-year auto-rolling maintenance\n- Uncapped escalation\n- Stamp duty shifted to buyer\n- Overbroad force majeure\n\nFull guide: https://lexireview.in/blog/15-red-flags-builder-buyer-agreements\nAnalyze your BBA: https://lexireview.in/tools/builder-buyer-agreement-analyzer`,
      },
      {
        order: 3,
        delayHours: 120,
        subject: "RERA Section 18 — your compensation right for possession delay",
        bodyHtml: plainHtml(
          "Section 18 in plain English",
          "Section 18 of the RERA Act is the single strongest right a home buyer has. If the builder fails to hand over possession by the date in the agreement, you can: (1) withdraw and get a full refund with interest at SBI-MCLR+2% from the date you paid each instalment, or (2) continue and receive monthly interest at the same rate for every month of delay. No court, no lawyer needed — you file directly with the state RERA authority. The builder cannot contract out of this right. Our guide has the filing steps and a sample complaint.",
          [
            {
              href: "https://lexireview.in/blog/rera-section-18-possession-delay-compensation",
              label: "Read the Section 18 guide",
            },
            {
              href: "https://lexireview.in/tools/rera-possession-delay-complaint",
              label: "Draft a RERA complaint",
            },
          ],
        ),
        bodyText: `RERA Section 18 — your compensation right for possession delay.\n\nIf the builder misses the agreement possession date, you can:\n1. Withdraw and take a full refund with interest at SBI-MCLR+2% from each instalment date, OR\n2. Continue and receive monthly interest at the same rate for every delayed month\n\nNo court or lawyer needed — file directly with state RERA. Builder cannot contract out.\n\nGuide: https://lexireview.in/blog/rera-section-18-possession-delay-compensation\nDraft complaint: https://lexireview.in/tools/rera-possession-delay-complaint`,
      },
      {
        order: 4,
        delayHours: 240,
        subject: "RERA or Consumer Court — which one to pick",
        bodyHtml: plainHtml(
          "Choosing your forum",
          "Home buyers have two doors: state RERA authority or the Consumer Protection forum (District, State, NCDRC). The trade-offs: RERA is faster on possession delay, registration gaps, and project-level issues — typically 60-90 days to a first order. Consumer Court is stronger on deficiency of service, defective construction, and compensation beyond the RERA formula — but slower. A 2021 Supreme Court decision confirmed that buyers can use either forum. We set out a simple decision framework based on what you're actually fighting for.",
          [
            {
              href: "https://lexireview.in/blog/rera-vs-consumer-court-home-buyer-decision-guide",
              label: "Read the decision guide",
            },
            {
              href: "mailto:founder@lexireview.in?subject=Home%20buyer%20question",
              label: "Ask us a specific question",
            },
          ],
        ),
        bodyText: `RERA or Consumer Court — which to pick.\n\nRERA: faster (60-90 days to first order), strong on possession delay, registration gaps, project-level issues.\nConsumer Court: slower, stronger on deficiency of service, defective construction, compensation beyond RERA formula.\n\nSupreme Court (2021) confirmed buyers can use either.\n\nDecision guide: https://lexireview.in/blog/rera-vs-consumer-court-home-buyer-decision-guide\nQuestions: founder@lexireview.in`,
      },
    ],
  },
];

// ==========================================
// Seed runner
// ==========================================

async function main() {
  let totalTemplates = 0;
  for (const seq of SEQUENCES) {
    const existing = await prisma.emailSequence.findFirst({ where: { name: seq.name } });
    if (existing) {
      console.log(`• Skipping ${seq.name} — already exists`);
      continue;
    }

    const created = await prisma.emailSequence.create({
      data: {
        name: seq.name,
        description: seq.description,
        trigger: seq.trigger,
        targetICP: seq.targetICP,
        templates: {
          create: seq.templates.map((t) => ({
            order: t.order,
            delayHours: t.delayHours,
            subject: t.subject,
            bodyHtml: t.bodyHtml,
            bodyText: t.bodyText,
          })),
        },
      },
      include: { templates: true },
    });
    totalTemplates += created.templates.length;
    console.log(`✓ Seeded ${seq.name} with ${created.templates.length} emails`);
  }
  console.log(`\n${SEQUENCES.length} Week 6 email sequences processed (${totalTemplates} templates created this run).`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
