/**
 * Seeds the initial email sequences for Week 1.
 *
 * Run:  cd /var/www/lexiforge && npx tsx prisma/seed-email-sequences.ts
 *
 * This creates:
 *   - CITIZEN_WELCOME (5 emails over 14 days)
 *   - SMB_WELCOME (5 emails over 14 days)
 *   - ENTERPRISE_WELCOME (3 emails over 10 days)
 *
 * Additional per-ICP sequences are added in Week 2.
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

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
  trigger: "LEAD_CAPTURED" | "TOOL_COMPLETED" | "LEAD_MAGNET_DOWNLOADED" | "TRIAL_STARTED" | "MANUAL_ADD";
  targetTier?: "CITIZEN" | "SMB" | "MID_MARKET" | "ENTERPRISE" | "GOVERNMENT";
  templates: TemplateSeed[];
}

const SEQUENCES: SequenceSeed[] = [
  // ==========================================
  // CITIZEN_WELCOME
  // ==========================================
  {
    name: "CITIZEN_WELCOME",
    description: "5-email welcome sequence for Indian citizens captured via free tools, blog, or citizens hub.",
    trigger: "LEAD_CAPTURED",
    targetTier: "CITIZEN",
    templates: [
      {
        order: 1,
        delayHours: 0,
        subject: "Welcome to LexiReview — here's what you can do first",
        bodyHtml: welcomeHtml("Welcome", "Your free legal toolkit is live. Start with these three things — each takes less than 5 minutes.", [
          { href: "https://lexireview.in/tools/rent-agreement-generator", label: "Generate a rent agreement (28 states)" },
          { href: "https://lexireview.in/tools/stamp-duty-calculator", label: "Check stamp duty for any state" },
          { href: "https://lexireview.in/tools/offer-letter-decoder", label: "Decode a job offer letter" },
        ]),
        bodyText: `Welcome to LexiReview!\n\nYour free legal toolkit is live. Start with these three:\n\n1. Rent agreement generator (28 states): https://lexireview.in/tools/rent-agreement-generator\n2. Stamp duty calculator: https://lexireview.in/tools/stamp-duty-calculator\n3. Offer letter decoder: https://lexireview.in/tools/offer-letter-decoder\n\nReply with any questions — we read every reply.\n\n— Team LexiReview`,
      },
      {
        order: 2,
        delayHours: 48,
        subject: "The 5 most-used free tools (save time, get it right)",
        bodyHtml: bulletsHtml("The 5 most-used free tools", "Thousands of Indians use these every month. Which one fits your situation?", [
          { href: "https://lexireview.in/tools/nda-generator", label: "NDA Generator — for freelancers, investors, partnerships" },
          { href: "https://lexireview.in/tools/consumer-complaint-drafter", label: "Consumer Complaint Drafter — CP Act 2019, all forums" },
          { href: "https://lexireview.in/tools/rent-agreement-generator", label: "Rent Agreement — state-specific with stamp duty" },
          { href: "https://lexireview.in/tools/stamp-duty-calculator", label: "Stamp Duty Calculator — every state, every transaction type" },
          { href: "https://lexireview.in/tools/offer-letter-decoder", label: "Offer Letter Decoder — red flags in seconds" },
        ]),
        bodyText: `The 5 most-used free tools on LexiReview:\n\n- NDA Generator: https://lexireview.in/tools/nda-generator\n- Consumer Complaint Drafter: https://lexireview.in/tools/consumer-complaint-drafter\n- Rent Agreement: https://lexireview.in/tools/rent-agreement-generator\n- Stamp Duty Calculator: https://lexireview.in/tools/stamp-duty-calculator\n- Offer Letter Decoder: https://lexireview.in/tools/offer-letter-decoder`,
      },
      {
        order: 3,
        delayHours: 120, // Day 5
        subject: "Behind the scenes: how we make templates state-specific",
        bodyHtml: plainHtml("Behind the scenes", "Stamp duty, registration fees, notarisation rules — each Indian state has its own quirks. Our premium templates (₹99–₹499) include every state-specific variation, are lawyer-verified, and save you from the rabbit hole of state websites.", [
          { href: "https://lexireview.in/blog/indian-stamp-duty-rates-2025-state-wise-guide", label: "Read: State-wise stamp duty 2025" },
        ]),
        bodyText: `Behind the scenes: how we make templates state-specific.\n\nEach Indian state has its own stamp duty, registration fees, and notarisation rules. Our premium templates (₹99–₹499) include every variation, are lawyer-verified, and save you from digging through state websites.\n\nRead more: https://lexireview.in/blog/indian-stamp-duty-rates-2025-state-wise-guide`,
      },
      {
        order: 4,
        delayHours: 216, // Day 9
        subject: "Need legal advice for your business? Start here",
        bodyHtml: plainHtml("Upgrade when you're ready", "If you run a business (freelance, SME, startup), our product handles much more than templates — it reviews any contract in 45 seconds, flags risks, checks compliance, and suggests fixes.", [
          { href: "https://app.lexireview.in/signup", label: "Start a free trial (3 reviews, no card)" },
        ]),
        bodyText: `If you run a business, our product reviews any contract in 45 seconds, flags risks, checks compliance, and suggests fixes.\n\nStart a free trial: https://app.lexireview.in/signup`,
      },
      {
        order: 5,
        delayHours: 336, // Day 14
        subject: "One last thing — a discount on premium templates",
        bodyHtml: plainHtml("A parting gift", "Here's a 20% discount on any premium template in your first 7 days. Use code LEXI20 at checkout. These templates are drafted and reviewed by practising Indian lawyers.", [
          { href: "https://lexireview.in/tools", label: "Browse all tools" },
        ]),
        bodyText: `20% off any premium template, valid 7 days. Code: LEXI20.\n\nBrowse all tools: https://lexireview.in/tools`,
      },
    ],
  },

  // ==========================================
  // SMB_WELCOME
  // ==========================================
  {
    name: "SMB_WELCOME",
    description: "5-email welcome sequence for solo lawyers, startups, SMEs, CAs, HR consultants.",
    trigger: "LEAD_CAPTURED",
    targetTier: "SMB",
    templates: [
      {
        order: 1,
        delayHours: 0,
        subject: "Welcome to LexiReview — the 3 things that save the most time",
        bodyHtml: welcomeHtml("Welcome", "LexiReview's 6 parallel AI engines review any Indian contract in 45 seconds. If you're a solo lawyer, startup founder, CA, or HR consultant, here's where to start:", [
          { href: "https://app.lexireview.in/signup", label: "Start a free trial (3 reviews, no card)" },
          { href: "https://lexireview.in/blog/contract-review-checklist-50-points-indian-lawyer", label: "The 50-point contract review checklist" },
          { href: "https://lexireview.in/features", label: "See all features" },
        ]),
        bodyText: `Welcome! LexiReview's 6 parallel AI engines review any Indian contract in 45 seconds.\n\nGet started:\n1. Free trial (3 reviews): https://app.lexireview.in/signup\n2. 50-point contract review checklist: https://lexireview.in/blog/contract-review-checklist-50-points-indian-lawyer\n3. Full features: https://lexireview.in/features`,
      },
      {
        order: 2,
        delayHours: 48,
        subject: "How LexiReview detects what Indian generic AI tools miss",
        bodyHtml: plainHtml("What sets us apart", "US-built contract tools don't know Indian Contract Act, Stamp Acts, DPDP, RBI, SEBI, or RERA. LexiReview is built on top of Indian law — citing actual sections and case precedents.", [
          { href: "https://lexireview.in/blog/how-to-review-contract-45-seconds-ai", label: "Read: How 45-second review works" },
        ]),
        bodyText: `US-built contract tools don't know Indian Contract Act, Stamp Acts, DPDP, RBI, SEBI, or RERA.\n\nLexiReview is built on top of Indian law — citing actual sections and case precedents.\n\nHow 45-second review works: https://lexireview.in/blog/how-to-review-contract-45-seconds-ai`,
      },
      {
        order: 3,
        delayHours: 120,
        subject: "ROI calculator: how much time + money LexiReview saves",
        bodyHtml: plainHtml("Run the numbers", "Solo lawyers bill 6-10 hours per contract review. A mid-sized practice spends 40-60 hours/week on this. Our calculator shows the exact savings.", [
          { href: "https://lexireview.in/blog/roi-ai-contract-review-calculator-india", label: "ROI calculator for Indian legal teams" },
        ]),
        bodyText: `Solo lawyers bill 6-10 hours per contract review. Our ROI calculator shows the exact savings: https://lexireview.in/blog/roi-ai-contract-review-calculator-india`,
      },
      {
        order: 4,
        delayHours: 216,
        subject: "Starter vs Professional — which is right for you?",
        bodyHtml: plainHtml("Pricing that fits", "Starter (₹4,999/mo, 25 reviews) is right for solo practitioners. Professional (₹14,999/mo, 100 reviews) is for growing teams with playbooks and batch processing. See the full comparison.", [
          { href: "https://lexireview.in/pricing", label: "Full pricing comparison" },
          { href: "https://app.lexireview.in/signup", label: "Start free trial" },
        ]),
        bodyText: `Starter ₹4,999/mo (25 reviews) — solo practitioners.\nProfessional ₹14,999/mo (100 reviews) — growing teams.\n\nPricing: https://lexireview.in/pricing\nFree trial: https://app.lexireview.in/signup`,
      },
      {
        order: 5,
        delayHours: 336,
        subject: "One last check-in — and a founder's offer",
        bodyHtml: plainHtml("Let's chat", "If you haven't started a trial yet, hit reply and tell me what's holding you back. I'll personally respond within 24 hours.", [
          { href: "https://app.lexireview.in/signup", label: "Start trial now" },
        ]),
        bodyText: `If you haven't started a trial yet, hit reply and tell me what's holding you back. I'll personally respond within 24 hours.\n\nStart trial: https://app.lexireview.in/signup`,
      },
    ],
  },

  // ==========================================
  // ENTERPRISE_WELCOME
  // ==========================================
  {
    name: "ENTERPRISE_WELCOME",
    description: "3-email welcome sequence for Tier-1 law firms, listed companies, large NBFCs/banks.",
    trigger: "LEAD_CAPTURED",
    targetTier: "ENTERPRISE",
    templates: [
      {
        order: 1,
        delayHours: 0,
        subject: "LexiReview for enterprise — a briefing",
        bodyHtml: plainHtml("Welcome", "LexiReview serves Indian legal teams at scale — parallel AI engines for contract review, white-label deployment, SOC 2 roadmap, and native ICA/DPDP/SEBI/RBI compliance. Here's the enterprise overview.", [
          { href: "https://lexireview.in/solutions/law-firms", label: "Enterprise overview" },
          { href: "https://lexireview.in/security", label: "Security & compliance" },
        ]),
        bodyText: `LexiReview for enterprise legal teams — briefing.\n\nEnterprise overview: https://lexireview.in/solutions/law-firms\nSecurity & compliance: https://lexireview.in/security`,
      },
      {
        order: 2,
        delayHours: 120,
        subject: "Book a 20-minute strategic demo",
        bodyHtml: plainHtml("Demo", "A 20-minute walkthrough with our team: your use cases, integration with your existing stack, white-label requirements, and pricing. We'll send a tailored ROI report within 48 hours.", [
          { href: "https://cal.lexireview.in/enterprise", label: "Book a demo" },
        ]),
        bodyText: `20-minute strategic demo — tailored ROI report within 48 hours.\n\nBook: https://cal.lexireview.in/enterprise`,
      },
      {
        order: 3,
        delayHours: 240, // Day 10
        subject: "Case study: how [Firm] cut contract turnaround 80%",
        bodyHtml: plainHtml("A real case", "A mid-tier firm in Mumbai cut contract turnaround from 14 days to 3 using LexiReview. We documented every step, including the procurement process and security review. Want the full write-up?", [
          { href: "https://lexireview.in/blog/in-house-legal-team-contract-turnaround-reduction", label: "Read the case study" },
          { href: "https://cal.lexireview.in/enterprise", label: "Book demo" },
        ]),
        bodyText: `Case study: 14-day contract turnaround cut to 3 days.\n\nRead: https://lexireview.in/blog/in-house-legal-team-contract-turnaround-reduction\nBook demo: https://cal.lexireview.in/enterprise`,
      },
    ],
  },
];

// ==========================================
// Template HTML generators
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

function welcomeHtml(heading: string, intro: string, ctas: { href: string; label: string }[]): string {
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

function bulletsHtml(heading: string, intro: string, bullets: { href: string; label: string }[]): string {
  return welcomeHtml(heading, intro, bullets);
}

function plainHtml(heading: string, body: string, ctas: { href: string; label: string }[]): string {
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
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

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
        targetTier: seq.targetTier,
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
  console.log("\nAll email sequences seeded.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
