/**
 * SmartLead webhook receiver.
 *
 * Validates the shared secret, normalizes SmartLead event payloads, updates
 * the matching OutreachProspect, writes a LeadActivity row, and for positive
 * replies creates a Deal in DISCOVERY stage + Slack alert.
 *
 * Validation: SmartLead signs events with the SMARTLEAD_WEBHOOK_SECRET value;
 * we accept either `x-smartlead-signature` header or `?secret=` query param
 * to keep setup flexible during onboarding.
 */
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { handleReply } from "@/lib/outbound/cadence";
import { notifyStageChange } from "@/lib/outbound/slack";

const eventSchema = z.object({
  event_type: z
    .enum([
      "EMAIL_SENT",
      "EMAIL_OPEN",
      "EMAIL_OPENED",
      "EMAIL_CLICK",
      "EMAIL_CLICKED",
      "EMAIL_REPLY",
      "EMAIL_REPLIED",
      "EMAIL_BOUNCE",
      "EMAIL_BOUNCED",
      "EMAIL_UNSUBSCRIBE",
      "EMAIL_UNSUBSCRIBED",
      "LEAD_CATEGORY_UPDATED",
    ])
    .or(z.string()),
  campaign_id: z.union([z.string(), z.number()]).optional(),
  lead: z
    .object({
      email: z.string().email().optional(),
      first_name: z.string().optional(),
      last_name: z.string().optional(),
    })
    .optional(),
  lead_email: z.string().email().optional(),
  reply_text: z.string().optional(),
  reply_category: z.string().optional(),
  bounce_reason: z.string().optional(),
});

function isAuthorized(req: NextRequest): boolean {
  const secret = process.env.SMARTLEAD_WEBHOOK_SECRET;
  if (!secret) {
    // In stub/dev mode (no secret set) we accept the call but log a warning.
    console.warn("[webhooks/smartlead] SMARTLEAD_WEBHOOK_SECRET not set — accepting without auth");
    return true;
  }
  const headerSig = req.headers.get("x-smartlead-signature");
  const querySig = req.nextUrl.searchParams.get("secret");
  return headerSig === secret || querySig === secret;
}

function classifyReply(
  category: string | undefined,
): "POSITIVE" | "NEGATIVE" | "NEUTRAL" | "UNSUBSCRIBE" {
  if (!category) return "NEUTRAL";
  const lc = category.toLowerCase();
  if (lc.includes("interest") || lc.includes("positive") || lc.includes("meeting")) {
    return "POSITIVE";
  }
  if (lc.includes("unsub") || lc.includes("opt_out") || lc.includes("do_not_contact")) {
    return "UNSUBSCRIBE";
  }
  if (lc.includes("not_interest") || lc.includes("negative") || lc.includes("reject")) {
    return "NEGATIVE";
  }
  return "NEUTRAL";
}

export async function POST(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const raw = (await req.json().catch(() => null)) as unknown;
  const parsed = eventSchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid payload", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const event = parsed.data;
  const email = event.lead?.email || event.lead_email;
  if (!email) {
    return NextResponse.json({ error: "missing lead email" }, { status: 400 });
  }

  // Find the prospect by matching contact email.
  const contact = await prisma.contact.findFirst({
    where: { email },
    include: { outreachProspects: true, lead: true, account: true },
  });
  if (!contact) {
    console.warn(`[webhooks/smartlead] No contact for ${email}`);
    return NextResponse.json({ ok: true, ignored: true });
  }

  const prospect = contact.outreachProspects.find(
    (p) => p.status === "ACTIVE" || p.status === "REPLIED",
  );

  const type = event.event_type.toUpperCase();

  if (type === "EMAIL_REPLY" || type === "EMAIL_REPLIED") {
    const classification = classifyReply(event.reply_category);
    if (prospect) {
      await handleReply(prospect.id, {
        classification,
        snippet: event.reply_text,
      });
    }

    // For positive replies create a DISCOVERY Deal + flip lead stage
    if (classification === "POSITIVE") {
      const existingDeal = await prisma.deal.findFirst({
        where: { accountId: contact.accountId, stage: { not: "CLOSED_LOST" } },
      });
      if (!existingDeal) {
        await prisma.deal.create({
          data: {
            name: `${contact.account.name} — outbound reply`,
            accountId: contact.accountId,
            primaryLeadId: contact.leadId ?? null,
            stage: "DISCOVERY",
            valueINR: 0,
            probability: 15,
          },
        });
      }
      if (contact.leadId && contact.lead && contact.lead.stage !== "OPPORTUNITY") {
        const prev = contact.lead.stage;
        await prisma.lead.update({
          where: { id: contact.leadId },
          data: { stage: "OPPORTUNITY", stageChangedAt: new Date() },
        });
        await notifyStageChange({ leadEmail: email, from: prev, to: "OPPORTUNITY" });
      }
    }

    return NextResponse.json({ ok: true, classification });
  }

  if (type === "EMAIL_BOUNCE" || type === "EMAIL_BOUNCED") {
    if (prospect) {
      await prisma.outreachProspect.update({
        where: { id: prospect.id },
        data: { status: "BOUNCED", nextTouchAt: null },
      });
    }
    if (contact.leadId) {
      await prisma.emailSend.updateMany({
        where: { leadId: contact.leadId, bouncedAt: null, sentAt: { not: null } },
        data: { bouncedAt: new Date(), failureReason: event.bounce_reason ?? "bounced" },
      });
    }
    return NextResponse.json({ ok: true, bounced: true });
  }

  if (type === "EMAIL_UNSUBSCRIBE" || type === "EMAIL_UNSUBSCRIBED") {
    if (prospect) {
      await prisma.outreachProspect.update({
        where: { id: prospect.id },
        data: { status: "UNSUBSCRIBED", nextTouchAt: null },
      });
    }
    if (contact.leadId) {
      await prisma.lead.update({
        where: { id: contact.leadId },
        data: { unsubscribedAt: new Date() },
      });
      await prisma.leadActivity.create({
        data: {
          leadId: contact.leadId,
          type: "NOTE_ADDED",
          metadata: { note: "Unsubscribed via SmartLead" },
        },
      });
    }
    return NextResponse.json({ ok: true, unsubscribed: true });
  }

  if (type === "EMAIL_OPEN" || type === "EMAIL_OPENED") {
    if (contact.leadId) {
      await prisma.emailSend.updateMany({
        where: { leadId: contact.leadId, openedAt: null, sentAt: { not: null } },
        data: { openedAt: new Date() },
      });
      await prisma.leadActivity.create({
        data: { leadId: contact.leadId, type: "EMAIL_OPENED", metadata: { email } },
      });
    }
    return NextResponse.json({ ok: true });
  }

  if (type === "EMAIL_CLICK" || type === "EMAIL_CLICKED") {
    if (contact.leadId) {
      await prisma.emailSend.updateMany({
        where: { leadId: contact.leadId, clickedAt: null, sentAt: { not: null } },
        data: { clickedAt: new Date() },
      });
      await prisma.leadActivity.create({
        data: { leadId: contact.leadId, type: "EMAIL_CLICKED", metadata: { email } },
      });
    }
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ ok: true, ignored: true });
}
