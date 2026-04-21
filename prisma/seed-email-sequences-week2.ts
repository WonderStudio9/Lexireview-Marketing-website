/**
 * Seeds Week 2 email sequences: 3 for Solo Lawyers + 3 for Startups.
 *
 * Run: cd /var/www/lexiforge && npx tsx prisma/seed-email-sequences-week2.ts
 * Idempotent — safe to re-run.
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
  targetICP?: "SOLO_LAWYER" | "STARTUP_FOUNDER";
  templates: TemplateSeed[];
}

// ==========================================
// Template builders
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

function bulletsHtml(
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
  // SOLO_LAWYER_WELCOME
  // ==========================================
  {
    name: "SOLO_LAWYER_WELCOME",
    description:
      "Welcome sequence for solo lawyers and small firm partners. Triggered on lead capture when ICP = SOLO_LAWYER.",
    trigger: "LEAD_CAPTURED",
    targetICP: "SOLO_LAWYER",
    templates: [
      {
        order: 1,
        delayHours: 0,
        subject: "Welcome — here are the 3 tools every solo lawyer should try first",
        bodyHtml: bulletsHtml(
          "Start here",
          "You're in. These three tools save the most time for solo practitioners — each takes under 2 minutes.",
          [
            {
              href: "https://lexireview.in/tools/matter-intake-form-generator",
              label: "Matter intake form generator",
            },
            {
              href: "https://lexireview.in/tools/retainer-agreement-generator",
              label: "Retainer agreement generator (BCI-compliant)",
            },
            {
              href: "https://lexireview.in/tools/fee-structure-analyzer",
              label: "Fee structure analyzer (see how you compare)",
            },
          ],
        ),
        bodyText: `Welcome. These three tools save solo lawyers the most time:\n\n1. Matter intake form: https://lexireview.in/tools/matter-intake-form-generator\n2. Retainer agreement: https://lexireview.in/tools/retainer-agreement-generator\n3. Fee structure analyzer: https://lexireview.in/tools/fee-structure-analyzer\n\nReply with any questions — we read every reply.`,
      },
      {
        order: 2,
        delayHours: 48,
        subject: "How LexiReview reviews a 40-page contract in 45 seconds (Indian law-aware)",
        bodyHtml: plainHtml(
          "45 seconds, not 2 hours",
          "Our 6 parallel AI engines review any contract against Indian Contract Act, Stamp Acts (28 states), DPDP, RBI, SEBI, and RERA. Each finding cites the exact clause and statute. Solo lawyers save 4-8 billable hours per review by using LexiReview for the first pass.",
          [
            {
              href: "https://app.lexireview.in/signup",
              label: "Try 3 free reviews",
            },
          ],
        ),
        bodyText: `LexiReview's 6 parallel AI engines review any contract in 45 seconds against Indian law.\n\nTry 3 free reviews: https://app.lexireview.in/signup`,
      },
      {
        order: 3,
        delayHours: 120,
        subject: "Free: The Solo Lawyer's Practice Management Playbook (60 pages)",
        bodyHtml: plainHtml(
          "Free playbook",
          "We compiled everything we've learned from 150+ solo practices in India — practice setup, client acquisition (BCI-compliant), billing, tech stack, scaling. 60 pages. Free.",
          [
            {
              href: "https://lexireview.in/lead-magnets/solo-lawyer-playbook",
              label: "Read the playbook",
            },
          ],
        ),
        bodyText: `Free playbook: The Solo Lawyer's Practice Management Playbook (60 pages).\n\nRead: https://lexireview.in/lead-magnets/solo-lawyer-playbook`,
      },
      {
        order: 4,
        delayHours: 216,
        subject: "Starter plan: ₹4,999/mo covers 25 contract reviews (solo lawyer math)",
        bodyHtml: plainHtml(
          "The math",
          "Starter (₹4,999/mo) gives you 25 AI-powered contract reviews. If you bill even ₹5,000/hour and save just 30 minutes per review, that's ₹62,500 of billable time reclaimed per month. The tool pays for itself in the first 2 reviews.",
          [
            {
              href: "https://app.lexireview.in/signup",
              label: "Start free trial",
            },
            {
              href: "https://lexireview.in/pricing",
              label: "See pricing",
            },
          ],
        ),
        bodyText: `Starter ₹4,999/mo = 25 reviews. Saves 30min per review × ₹5K/hr = ₹62,500/mo billable recovered.\n\nStart trial: https://app.lexireview.in/signup`,
      },
      {
        order: 5,
        delayHours: 336,
        subject: "One last thing — want a personal demo?",
        bodyHtml: plainHtml(
          "15 minutes",
          "If you haven't started a trial yet, I'd love to do a 15-minute demo. Show you your actual contracts being reviewed, answer BCI questions, and honestly tell you if LexiReview fits your practice. No pressure.",
          [
            {
              href: "mailto:founder@lexireview.in?subject=Solo%20lawyer%20demo",
              label: "Reply to schedule",
            },
            {
              href: "https://app.lexireview.in/signup",
              label: "Or start trial",
            },
          ],
        ),
        bodyText: `Want a 15-min personal demo? Reply to this email or start a trial: https://app.lexireview.in/signup`,
      },
    ],
  },

  // ==========================================
  // SOLO_LAWYER_TRIAL_STARTED
  // ==========================================
  {
    name: "SOLO_LAWYER_TRIAL_STARTED",
    description: "Onboarding for solo lawyers who start a free trial on app.lexireview.in.",
    trigger: "TRIAL_STARTED",
    targetICP: "SOLO_LAWYER",
    templates: [
      {
        order: 1,
        delayHours: 0,
        subject: "Trial active — run your first review in the next 10 minutes",
        bodyHtml: plainHtml(
          "Run review #1 now",
          "Upload any contract you've reviewed recently. LexiReview will return: (1) risk score, (2) missing clauses with Indian-law specifics, (3) comparison to your firm's past patterns. Spot-check the output against your own review.",
          [
            {
              href: "https://app.lexireview.in/review/new",
              label: "Start your first review",
            },
          ],
        ),
        bodyText: `Trial is active. Upload any contract: https://app.lexireview.in/review/new`,
      },
      {
        order: 2,
        delayHours: 24,
        subject: "Pro tip: upload a 3-contract batch for fastest learning",
        bodyHtml: plainHtml(
          "Batch upload",
          "Upload 3 similar contracts at once (e.g., 3 vendor MSAs). LexiReview will compare them side-by-side, spot deviations from your patterns, and build your template baseline. This is the single most useful onboarding task.",
          [
            {
              href: "https://app.lexireview.in/batch",
              label: "Upload a batch",
            },
          ],
        ),
        bodyText: `Upload 3 similar contracts for fastest learning: https://app.lexireview.in/batch`,
      },
      {
        order: 3,
        delayHours: 120,
        subject: "Your trial ends in 2 days — here's what Starter unlocks",
        bodyHtml: plainHtml(
          "After trial",
          "You've used some of your 3 free reviews. Starter (₹4,999/mo) gives you 25 reviews/month + playbooks + matter workspace + precedent search. Upgrade anytime — no disruption.",
          [
            {
              href: "https://app.lexireview.in/upgrade",
              label: "Upgrade to Starter",
            },
          ],
        ),
        bodyText: `Trial ends in 2 days. Upgrade to Starter ₹4,999/mo: https://app.lexireview.in/upgrade`,
      },
    ],
  },

  // ==========================================
  // SOLO_LAWYER_NO_TRIAL
  // ==========================================
  {
    name: "SOLO_LAWYER_NO_TRIAL",
    description:
      "For solo lawyers who downloaded a lead magnet or used a free tool but have not started a trial.",
    trigger: "LEAD_MAGNET_DOWNLOADED",
    targetICP: "SOLO_LAWYER",
    templates: [
      {
        order: 1,
        delayHours: 48,
        subject: "Next step: see LexiReview review your own contract (3 free)",
        bodyHtml: plainHtml(
          "See it review your contract",
          "The playbook is one side of the coin. The other is seeing our AI review one of YOUR contracts. 3 reviews free, no card required.",
          [
            {
              href: "https://app.lexireview.in/signup",
              label: "Start 3-review trial",
            },
          ],
        ),
        bodyText: `Start 3 free reviews: https://app.lexireview.in/signup`,
      },
      {
        order: 2,
        delayHours: 168,
        subject: "Solo lawyer case study: 80% turnaround reduction",
        bodyHtml: plainHtml(
          "Real case study",
          "A Pune-based litigator cut contract review turnaround from 14 days to 3 using LexiReview. Same quality, same billing rates, 4x throughput.",
          [
            {
              href: "https://lexireview.in/blog/in-house-legal-team-contract-turnaround-reduction",
              label: "Read the case study",
            },
            {
              href: "https://app.lexireview.in/signup",
              label: "Start trial",
            },
          ],
        ),
        bodyText: `Pune litigator: 14d → 3d turnaround. Read: https://lexireview.in/blog/in-house-legal-team-contract-turnaround-reduction`,
      },
    ],
  },

  // ==========================================
  // STARTUP_WELCOME
  // ==========================================
  {
    name: "STARTUP_WELCOME",
    description:
      "Welcome sequence for startup founders captured via free tools, blog, or startups landing.",
    trigger: "LEAD_CAPTURED",
    targetICP: "STARTUP_FOUNDER",
    templates: [
      {
        order: 1,
        delayHours: 0,
        subject: "Welcome — the 3 founder tools we use most",
        bodyHtml: bulletsHtml(
          "Start here",
          "You're in. These three tools solve the most common legal blockers for pre-seed to Series A founders.",
          [
            {
              href: "https://lexireview.in/tools/founders-agreement-generator",
              label: "Founders agreement generator",
            },
            {
              href: "https://lexireview.in/tools/esop-vesting-calculator",
              label: "ESOP vesting calculator + grant letter",
            },
            {
              href: "https://lexireview.in/tools/term-sheet-decoder",
              label: "Term sheet decoder (AI)",
            },
          ],
        ),
        bodyText: `Welcome. Three founder-first tools:\n1. Founders agreement: https://lexireview.in/tools/founders-agreement-generator\n2. ESOP calculator: https://lexireview.in/tools/esop-vesting-calculator\n3. Term sheet decoder: https://lexireview.in/tools/term-sheet-decoder`,
      },
      {
        order: 2,
        delayHours: 48,
        subject: "Legal 101 for pre-seed founders — free playbook",
        bodyHtml: plainHtml(
          "Free playbook",
          "The Founder's Legal Checklist covers the 12 legal things you must get right from Day 1. Incorporation, IP, founder agreement, first hires, DPDP. 25 pages.",
          [
            {
              href: "https://lexireview.in/lead-magnets/founder-legal-checklist",
              label: "Read the checklist",
            },
          ],
        ),
        bodyText: `Founder legal checklist: https://lexireview.in/lead-magnets/founder-legal-checklist`,
      },
      {
        order: 3,
        delayHours: 120,
        subject: "Why US-built legal tools fail Indian startups",
        bodyHtml: plainHtml(
          "Indian-first matters",
          "US contract AI doesn't know ICA §27 (non-competes unenforceable), Stamp Acts (28 states), DPDP Act 2023, or Section 17(2) ESOP tax. LexiReview is built FROM Indian law up — not localized on top of US templates.",
          [
            {
              href: "https://lexireview.in/features",
              label: "See Indian-law features",
            },
            {
              href: "https://app.lexireview.in/signup",
              label: "Start free trial",
            },
          ],
        ),
        bodyText: `Why US legal AI fails Indian startups: https://lexireview.in/features`,
      },
      {
        order: 4,
        delayHours: 216,
        subject: "Special: ₹999/mo Starter for pre-seed founders (first 12 months)",
        bodyHtml: plainHtml(
          "Pre-seed pricing",
          "We know pre-seed capital is tight. Founders with <₹5Cr raised get Starter at ₹999/mo for first 12 months (normally ₹4,999). Unlimited templates + 10 reviews/month + DPDP compliance assistant.",
          [
            {
              href: "https://app.lexireview.in/signup?plan=preseed",
              label: "Apply for pre-seed pricing",
            },
          ],
        ),
        bodyText: `Pre-seed founder plan: ₹999/mo for first 12 months. Apply: https://app.lexireview.in/signup?plan=preseed`,
      },
      {
        order: 5,
        delayHours: 336,
        subject: "One last resource: the 20 term sheet clauses to always push back on",
        bodyHtml: plainHtml(
          "Red flags",
          "Our most-read founder post: 20 term sheet clauses that should make you walk away. Full-ratchet anti-dilution, 3x participating liquidation, drag-along below 75%, onerous veto rights.",
          [
            {
              href: "https://lexireview.in/blog/term-sheet-red-flags-founders-walk-away",
              label: "Read red flags",
            },
          ],
        ),
        bodyText: `20 term sheet red flags: https://lexireview.in/blog/term-sheet-red-flags-founders-walk-away`,
      },
    ],
  },

  // ==========================================
  // STARTUP_TRIAL_STARTED
  // ==========================================
  {
    name: "STARTUP_TRIAL_STARTED",
    description: "Onboarding for startup founders who start a free trial.",
    trigger: "TRIAL_STARTED",
    targetICP: "STARTUP_FOUNDER",
    templates: [
      {
        order: 1,
        delayHours: 0,
        subject: "Trial active — 3 highest-impact first actions",
        bodyHtml: bulletsHtml(
          "Top 3 actions for founders",
          "Do these 3 in your first session — they're the highest ROI.",
          [
            {
              href: "https://app.lexireview.in/review/new",
              label: "Review your customer MSA (catch DPDP gaps early)",
            },
            {
              href: "https://app.lexireview.in/tools/dpdp-check",
              label: "Run DPDP compliance check on your company",
            },
            {
              href: "https://app.lexireview.in/templates",
              label: "Browse template library",
            },
          ],
        ),
        bodyText: `Top 3 founder actions:\n1. Review your customer MSA: https://app.lexireview.in/review/new\n2. DPDP check: https://app.lexireview.in/tools/dpdp-check\n3. Template library: https://app.lexireview.in/templates`,
      },
      {
        order: 2,
        delayHours: 48,
        subject: "Investor due diligence: have your contracts ready",
        bodyHtml: plainHtml(
          "DD preparation",
          "When a VC starts DD, they ask for 50+ documents in 48 hours. Our Data Room feature lets you organize contracts by type, tag risks, and generate a DD-ready summary in minutes — not days.",
          [
            {
              href: "https://app.lexireview.in/data-room",
              label: "Set up data room",
            },
          ],
        ),
        bodyText: `VC DD-ready data room: https://app.lexireview.in/data-room`,
      },
      {
        order: 3,
        delayHours: 120,
        subject: "Pro plan: what unlocks for growing startups",
        bodyHtml: plainHtml(
          "When to upgrade",
          "Pro (₹14,999/mo) unlocks 100 reviews, 10 users, matter workspaces, precedent search, playbooks. Right for startups with a small in-house legal team or growing fast. Free upgrade within 60 days of signup with code WELCOME60.",
          [
            {
              href: "https://app.lexireview.in/upgrade?code=WELCOME60",
              label: "Upgrade to Pro",
            },
          ],
        ),
        bodyText: `Pro plan: https://app.lexireview.in/upgrade?code=WELCOME60`,
      },
    ],
  },

  // ==========================================
  // STARTUP_PREMIUM_UPGRADE
  // ==========================================
  {
    name: "STARTUP_PREMIUM_UPGRADE",
    description:
      "Sent when a Starter-tier startup founder hits credit limits or usage caps — nudges to Pro.",
    trigger: "TRIAL_REVIEW_3_USED",
    targetICP: "STARTUP_FOUNDER",
    templates: [
      {
        order: 1,
        delayHours: 0,
        subject: "You've used all 3 trial reviews. Here's what Starter unlocks.",
        bodyHtml: plainHtml(
          "Trial complete",
          "You've seen how LexiReview works. Starter (₹4,999/mo) = 25 reviews + all templates + DPDP compliance + team seats (3). No annual contract, cancel anytime.",
          [
            {
              href: "https://app.lexireview.in/upgrade?plan=starter",
              label: "Upgrade to Starter",
            },
            {
              href: "https://app.lexireview.in/upgrade?plan=pro",
              label: "Or upgrade to Pro (10 users)",
            },
          ],
        ),
        bodyText: `Trial complete. Upgrade: https://app.lexireview.in/upgrade`,
      },
      {
        order: 2,
        delayHours: 24,
        subject: "Q: what did you think? (reply this email, reaches founder directly)",
        bodyHtml: plainHtml(
          "Your feedback",
          "We built LexiReview to save Indian founders from US-built legal tools that don't know our law. If our 3-review trial didn't click for you, I want to know why. Reply to this email — reaches my inbox directly.",
          [
            {
              href: "mailto:founder@lexireview.in?subject=Trial%20feedback",
              label: "Reply to founder",
            },
          ],
        ),
        bodyText: `Reply to this email to reach the founder directly.`,
      },
      {
        order: 3,
        delayHours: 168,
        subject: "Final reminder — 7 days to keep your trial reviews",
        bodyHtml: plainHtml(
          "7 days",
          "Your 3 trial reviews + saved templates expire in 7 days. Upgrade any time to keep them, or download your documents before then.",
          [
            {
              href: "https://app.lexireview.in/upgrade",
              label: "Upgrade now",
            },
            {
              href: "https://app.lexireview.in/export",
              label: "Export your data",
            },
          ],
        ),
        bodyText: `7 days until trial data expires. Upgrade or export.`,
      },
    ],
  },
];

// ==========================================
// Seed runner
// ==========================================

async function main() {
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
    console.log(`✓ Seeded ${seq.name} with ${created.templates.length} emails`);
  }
  console.log(`\n${SEQUENCES.length} Week 2 email sequences seeded.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
