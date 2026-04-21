import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { icpToTier, classifyICPFromUrl, inferSource } from "@/lib/lead/classify";
import { computeIcpFitScore, computeIntentScore, computeTotalScore, stageFromScore } from "@/lib/lead/score";
import { sendEmail } from "@/lib/email/send";
import type { LeadICP, LeadLanguage } from "@prisma/client";

const LeadSchema = z.object({
  email: z.string().email().max(254),
  firstName: z.string().max(100).optional(),
  lastName: z.string().max(100).optional(),
  phone: z.string().max(20).optional(),
  linkedinUrl: z.string().url().optional(),
  icp: z.string().optional(), // validated against enum below
  language: z.string().optional(),
  sourceDetail: z.string().max(500).optional(),
  leadMagnetSlug: z.string().max(100).optional(),
  toolSlug: z.string().max(100).optional(),
  firstTouchUrl: z.string().url().optional(),
  utmSource: z.string().max(100).optional(),
  utmMedium: z.string().max(100).optional(),
  utmCampaign: z.string().max(100).optional(),
  utmContent: z.string().max(100).optional(),
  utmTerm: z.string().max(100).optional(),
  referrer: z.string().max(500).optional(),
});

const VALID_ICPS = new Set<string>([
  "TENANT_LANDLORD", "HOME_BUYER", "EMPLOYEE", "FREELANCER", "MSME_OWNER",
  "CONTENT_CREATOR", "STARTUP_FOUNDER_EARLY", "NRI", "CONSUMER_DISPUTE",
  "SENIOR_CITIZEN", "STUDENT", "COUPLE", "FARMER",
  "SOLO_LAWYER", "SMALL_LAW_FIRM", "STARTUP_FOUNDER", "SME_OWNER",
  "CA_TAX_CONSULTANT", "HR_CONSULTANT", "FRACTIONAL_GC",
  "MID_TIER_LAW_FIRM", "IN_HOUSE_LEGAL_TEAM", "MID_NBFC", "RE_DEVELOPER",
  "INSURANCE_COMPANY", "PE_VC_FIRM", "PROCUREMENT_HEAD",
  "TIER1_LAW_FIRM", "LISTED_COMPANY", "LARGE_NBFC", "LARGE_BANK",
  "FINTECH_UNICORN", "BIG4_CONSULTING", "MNC_INDIA_OPS",
  "CENTRAL_GOVT", "STATE_GOVT", "PSU", "REGULATOR", "COURT_TRIBUNAL",
  "UNKNOWN",
]);

const VALID_LANGUAGES = new Set<string>([
  "EN", "HI", "TA", "BN", "MR", "GU", "TE", "KN", "PA", "OR", "ML",
]);

/**
 * POST /api/lead
 *
 * Core lead capture endpoint. Called by:
 *   - Blog inline forms
 *   - Exit intent modals
 *   - Free tool email gates
 *   - Lead magnet downloads
 *   - Landing page forms
 *   - Demo bookers
 *
 * Returns the lead ID and status. Dedupes by email.
 */
export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = LeadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.issues },
      { status: 400 },
    );
  }

  const data = parsed.data;
  const normalizedEmail = data.email.toLowerCase().trim();

  // Resolve ICP
  let icp: LeadICP = "UNKNOWN";
  if (data.icp && VALID_ICPS.has(data.icp)) {
    icp = data.icp as LeadICP;
  } else if (data.firstTouchUrl) {
    icp = classifyICPFromUrl(data.firstTouchUrl);
  }

  const tier = icpToTier(icp);

  // Resolve language
  let language: LeadLanguage = "EN";
  if (data.language && VALID_LANGUAGES.has(data.language)) {
    language = data.language as LeadLanguage;
  }

  // Resolve source
  const source = inferSource(
    data.firstTouchUrl,
    data.utmSource,
    data.utmMedium,
    data.referrer,
  );

  // Scoring
  const icpFitScore = computeIcpFitScore(icp, tier);
  const intentScore = computeIntentScore(source, Boolean(data.toolSlug));
  const engagementScore = 0; // Grows over time via LeadActivity
  const totalScore = computeTotalScore(icpFitScore, intentScore, engagementScore);
  const suggestedStage = stageFromScore(totalScore);

  // Upsert lead (dedupe by email)
  const existing = await prisma.lead.findUnique({ where: { email: normalizedEmail } });

  let leadId: string;
  let status: "created" | "updated";

  if (existing) {
    // Update highest-intent info; don't overwrite classification if already set.
    await prisma.lead.update({
      where: { id: existing.id },
      data: {
        firstName: data.firstName || existing.firstName,
        lastName: data.lastName || existing.lastName,
        phone: data.phone || existing.phone,
        linkedinUrl: data.linkedinUrl || existing.linkedinUrl,
        // Upgrade ICP/tier only if we have better info
        icp: existing.icp === "UNKNOWN" ? icp : existing.icp,
        tier: existing.icp === "UNKNOWN" ? tier : existing.tier,
        // Refresh scores — always, so latest engagement matters
        icpFitScore: Math.max(existing.icpFitScore, icpFitScore),
        intentScore: Math.max(existing.intentScore, intentScore),
        totalScore: Math.max(existing.totalScore, totalScore),
        stage: suggestedStage && existing.stage === "LEAD" ? suggestedStage : existing.stage,
      },
    });
    leadId = existing.id;
    status = "updated";

    // Log activity
    await prisma.leadActivity.create({
      data: {
        leadId: existing.id,
        type: "FORM_SUBMITTED",
        metadata: {
          firstTouchUrl: data.firstTouchUrl,
          toolSlug: data.toolSlug,
          leadMagnetSlug: data.leadMagnetSlug,
          sourceDetail: data.sourceDetail,
        },
      },
    });
  } else {
    const created = await prisma.lead.create({
      data: {
        email: normalizedEmail,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        linkedinUrl: data.linkedinUrl,
        tier,
        icp,
        language,
        source,
        firstTouchUrl: data.firstTouchUrl,
        utmSource: data.utmSource,
        utmMedium: data.utmMedium,
        utmCampaign: data.utmCampaign,
        utmContent: data.utmContent,
        utmTerm: data.utmTerm,
        referrer: data.referrer,
        icpFitScore,
        intentScore,
        engagementScore,
        totalScore,
        stage: suggestedStage || "LEAD",
      },
    });
    leadId = created.id;
    status = "created";

    // Log the capture activity
    await prisma.leadActivity.create({
      data: {
        leadId: created.id,
        type: "FORM_SUBMITTED",
        metadata: {
          firstTouchUrl: data.firstTouchUrl,
          toolSlug: data.toolSlug,
          leadMagnetSlug: data.leadMagnetSlug,
          sourceDetail: data.sourceDetail,
          isFirstCapture: true,
        },
      },
    });

    // Send welcome email (non-blocking, stubbed if RESEND_API_KEY not set)
    const firstName = data.firstName || "there";
    const welcomeHtml = buildWelcomeHtml(firstName, tier);
    const welcomeText = buildWelcomeText(firstName, tier);
    sendEmail({
      to: normalizedEmail,
      subject: "Welcome to LexiReview — your legal toolkit is ready",
      html: welcomeHtml,
      text: welcomeText,
      leadId: created.id,
    }).catch((err) => {
      console.error(`[/api/lead] Welcome email failed for ${normalizedEmail}:`, err);
    });
  }

  return NextResponse.json({
    leadId,
    status,
    tier,
    icp,
    totalScore,
  });
}

function buildWelcomeHtml(firstName: string, tier: string): string {
  const heroMessage =
    tier === "CITIZEN"
      ? "You're in. From this inbox you'll get free legal templates, state-specific guides, and answers to the questions Indian citizens actually ask."
      : tier === "SMB" || tier === "MID_MARKET"
      ? "You're in. Expect practical playbooks, contract tips, and occasional product updates — nothing else."
      : "You're in. We'll send you briefings on Indian contract law, compliance, and AI adoption benchmarks for legal teams.";

  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8" /><title>Welcome to LexiReview</title></head>
<body style="margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:#f8fafc;">
  <div style="max-width:560px;margin:0 auto;padding:40px 24px;">
    <div style="background:linear-gradient(135deg,#2563eb 0%,#1d4ed8 100%);color:white;padding:24px 32px;border-radius:16px 16px 0 0;">
      <h1 style="margin:0;font-size:24px;font-weight:700;letter-spacing:-0.02em;">LexiReview</h1>
      <p style="margin:4px 0 0;opacity:0.9;font-size:13px;">AI Contract Intelligence for Indian Law</p>
    </div>
    <div style="background:white;padding:32px;border-radius:0 0 16px 16px;border:1px solid #e2e8f0;border-top:none;">
      <h2 style="margin:0 0 16px;color:#0f172a;font-size:20px;">Hi ${escapeHtml(firstName)},</h2>
      <p style="color:#1e293b;line-height:1.6;font-size:15px;">${escapeHtml(heroMessage)}</p>
      <p style="color:#1e293b;line-height:1.6;font-size:15px;">Here's what you can do right now:</p>
      <ul style="color:#1e293b;line-height:1.8;font-size:15px;padding-left:20px;">
        <li>Try our <a href="https://lexireview.in/tools" style="color:#2563eb;text-decoration:none;">free legal tools</a> — rent agreements, NDAs, stamp duty calculators, and more</li>
        <li>Read our <a href="https://lexireview.in/blog" style="color:#2563eb;text-decoration:none;">40+ guides on Indian contract law</a></li>
        <li>Start a <a href="https://app.lexireview.in/signup" style="color:#2563eb;text-decoration:none;">free trial</a> of LexiReview's AI contract review</li>
      </ul>
      <div style="margin:32px 0 16px;padding:16px;background:#f0f9ff;border-radius:8px;border-left:4px solid #2563eb;">
        <p style="margin:0;color:#1e293b;font-size:14px;">Reply to this email if you have any questions — we read every reply.</p>
      </div>
      <p style="color:#64748b;font-size:13px;margin-top:24px;">— Team LexiReview</p>
    </div>
    <p style="text-align:center;color:#94a3b8;font-size:12px;margin-top:24px;">
      LexiDraft Technologies • Bengaluru, India<br/>
      <a href="https://lexireview.in" style="color:#94a3b8;">lexireview.in</a>
    </p>
  </div>
</body>
</html>`;
}

function buildWelcomeText(firstName: string, tier: string): string {
  const heroMessage =
    tier === "CITIZEN"
      ? "You're in. From this inbox you'll get free legal templates, state-specific guides, and answers to the questions Indian citizens actually ask."
      : tier === "SMB" || tier === "MID_MARKET"
      ? "You're in. Expect practical playbooks, contract tips, and occasional product updates — nothing else."
      : "You're in. We'll send you briefings on Indian contract law, compliance, and AI adoption benchmarks for legal teams.";

  return `Hi ${firstName},

${heroMessage}

Here's what you can do right now:
- Try our free legal tools: https://lexireview.in/tools
- Read our 40+ guides on Indian contract law: https://lexireview.in/blog
- Start a free trial of LexiReview's AI contract review: https://app.lexireview.in/signup

Reply to this email if you have any questions — we read every reply.

— Team LexiReview
LexiDraft Technologies
lexireview.in`;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/**
 * GET /api/lead?email=xyz — fetch a single lead for debugging.
 * Requires admin auth.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get("email");
  const secret = searchParams.get("secret");

  if (!secret || secret !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!email) {
    // Return last 50 leads
    const leads = await prisma.lead.findMany({
      orderBy: { createdAt: "desc" },
      take: 50,
    });
    return NextResponse.json({ leads, total: leads.length });
  }

  const lead = await prisma.lead.findUnique({
    where: { email: email.toLowerCase().trim() },
    include: { activities: { orderBy: { createdAt: "desc" }, take: 20 } },
  });

  if (!lead) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(lead);
}
