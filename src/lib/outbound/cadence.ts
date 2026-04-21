/**
 * Cold email cadence engine.
 *
 * Responsibilities:
 *   - enrolls Contacts into an OutreachCampaign via OutreachProspect
 *   - advances prospects through OutreachStep rows respecting dayOffset
 *   - sends the next touch through SmartLead (email) or Unipile (linkedin)
 *   - handles replies, bounces, unsubscribes
 *
 * The worker (/api/cron/outreach) calls sendNextTouch on every prospect with
 * nextTouchAt <= now and status = ACTIVE.
 */
import { prisma } from "@/lib/db";
import {
  sendColdEmail,
  checkRateLimit,
  type SendColdEmailResult,
} from "./smartlead";
import { sendLinkedInMessage } from "./unipile";
import { personalizeEmail } from "./personalize";
import { notifyPositiveReply } from "./slack";

export type ProspectStatus =
  | "ACTIVE"
  | "PAUSED"
  | "REPLIED"
  | "BOUNCED"
  | "UNSUBSCRIBED"
  | "COMPLETED";

const FROM_EMAIL = process.env.OUTREACH_FROM_EMAIL || "hello@lexireview-outreach.com";

function addDays(from: Date, days: number): Date {
  const d = new Date(from);
  d.setDate(d.getDate() + days);
  return d;
}

/**
 * Enroll a contact into a campaign. Schedules the first touch based on step 0.
 */
export async function startCadence(
  campaignId: string,
  contactId: string,
): Promise<{ prospectId: string; alreadyEnrolled?: boolean }> {
  const existing = await prisma.outreachProspect.findFirst({
    where: { campaignId, contactId },
  });
  if (existing) {
    return { prospectId: existing.id, alreadyEnrolled: true };
  }

  const firstStep = await prisma.outreachStep.findFirst({
    where: { campaignId },
    orderBy: { order: "asc" },
  });

  const now = new Date();
  const nextTouchAt = firstStep ? addDays(now, firstStep.dayOffset) : null;

  const prospect = await prisma.outreachProspect.create({
    data: {
      campaignId,
      contactId,
      currentStep: 0,
      status: "ACTIVE",
      nextTouchAt,
    },
  });

  return { prospectId: prospect.id };
}

/**
 * Advance a prospect to the next step after a successful send. Updates
 * currentStep, lastTouchAt, and nextTouchAt (or marks COMPLETED when done).
 */
export async function advanceCadence(prospectId: string): Promise<void> {
  const prospect = await prisma.outreachProspect.findUnique({
    where: { id: prospectId },
  });
  if (!prospect) return;

  const steps = await prisma.outreachStep.findMany({
    where: { campaignId: prospect.campaignId },
    orderBy: { order: "asc" },
  });

  const nextIndex = prospect.currentStep + 1;
  const now = new Date();

  if (nextIndex >= steps.length) {
    await prisma.outreachProspect.update({
      where: { id: prospectId },
      data: {
        status: "COMPLETED",
        lastTouchAt: now,
        nextTouchAt: null,
      },
    });
    return;
  }

  const currentStep = steps[prospect.currentStep];
  const nextStep = steps[nextIndex];
  const delta = Math.max(0, nextStep.dayOffset - (currentStep?.dayOffset ?? 0));

  await prisma.outreachProspect.update({
    where: { id: prospectId },
    data: {
      currentStep: nextIndex,
      lastTouchAt: now,
      nextTouchAt: addDays(now, delta),
    },
  });
}

type StepConditions = {
  skipIfReplied?: boolean;
  skipIfBounced?: boolean;
  skipIfUnsubscribed?: boolean;
  /** When true, only run the step if the previous step had no reply/bounce. */
  onlyIfNoEngagement?: boolean;
};

function parseConditions(raw: unknown): StepConditions {
  if (!raw || typeof raw !== "object") return {};
  return raw as StepConditions;
}

/**
 * Send the next touch for a prospect. Handles:
 *   - terminal statuses (skip silently)
 *   - condition evaluation (skip reply/bounce/unsubscribe)
 *   - EMAIL vs LINKEDIN routing
 *   - Claude personalization
 *   - rate limit enforcement (per inbox)
 *   - auto-advance on success
 */
export async function sendNextTouch(
  prospectId: string,
): Promise<{
  sent: boolean;
  skipped?: boolean;
  reason?: string;
  result?: SendColdEmailResult;
}> {
  const prospect = await prisma.outreachProspect.findUnique({
    where: { id: prospectId },
    include: {
      campaign: { include: { steps: { orderBy: { order: "asc" } } } },
      contact: { include: { account: true, lead: true } },
    },
  });

  if (!prospect) return { sent: false, reason: "prospect-not-found" };
  if (prospect.status !== "ACTIVE") {
    return { sent: false, skipped: true, reason: `status=${prospect.status}` };
  }

  const step = prospect.campaign.steps[prospect.currentStep];
  if (!step) {
    await prisma.outreachProspect.update({
      where: { id: prospectId },
      data: { status: "COMPLETED", nextTouchAt: null },
    });
    return { sent: false, skipped: true, reason: "no-more-steps" };
  }

  const conditions = parseConditions(step.conditions);
  if (conditions.skipIfReplied && prospect.status === ("REPLIED" as ProspectStatus)) {
    return { sent: false, skipped: true, reason: "replied" };
  }

  // LinkedIn step
  if (step.channel === "LINKEDIN") {
    const profileUrl = prospect.contact.linkedinUrl;
    if (!profileUrl) {
      // Skip + advance so the cadence keeps moving for prospects without a
      // LinkedIn URL.
      await advanceCadence(prospectId);
      return { sent: false, skipped: true, reason: "no-linkedin-url" };
    }
    const personalized = await personalizeEmail({
      template: step.bodyTemplate,
      subject: step.subject ?? undefined,
      account: {
        ...prospect.contact.account,
        enrichmentData:
          prospect.contact.account.enrichmentData &&
          typeof prospect.contact.account.enrichmentData === "object" &&
          !Array.isArray(prospect.contact.account.enrichmentData)
            ? (prospect.contact.account.enrichmentData as Record<string, unknown>)
            : null,
      },
      contact: prospect.contact,
    });
    const linkedin = await sendLinkedInMessage({
      profileUrl,
      message: personalized.body,
      mode: "MESSAGE",
    });
    if (linkedin.success) {
      await advanceCadence(prospectId);
    }
    return {
      sent: linkedin.success,
      result: {
        success: linkedin.success,
        stubbed: linkedin.stubbed,
        error: linkedin.error,
      },
    };
  }

  // EMAIL step
  if (!prospect.contact.email) {
    await advanceCadence(prospectId);
    return { sent: false, skipped: true, reason: "no-email" };
  }

  const rate = await checkRateLimit(FROM_EMAIL);
  if (!rate.allowed) {
    return { sent: false, skipped: true, reason: "rate-limited" };
  }

  const personalized = await personalizeEmail({
    template: step.bodyTemplate,
    subject: step.subject ?? undefined,
    account: prospect.contact.account,
    contact: prospect.contact,
  });

  const sendResult = await sendColdEmail({
    leadId: prospect.contact.leadId ?? undefined,
    toEmail: prospect.contact.email,
    fromEmail: FROM_EMAIL,
    subject: personalized.subject ?? step.subject ?? "Following up",
    bodyHtml: personalized.body,
    bodyText: personalized.body,
  });

  if (sendResult.success) {
    await prisma.outreachCampaign.update({
      where: { id: prospect.campaignId },
      data: { sentCount: { increment: 1 } },
    });
    await advanceCadence(prospectId);
  }

  return { sent: sendResult.success, result: sendResult };
}

export interface HandleReplyInput {
  classification?: "POSITIVE" | "NEGATIVE" | "NEUTRAL" | "UNSUBSCRIBE";
  snippet?: string;
}

/**
 * Called when a reply is detected (via webhook or polling). Marks prospect as
 * REPLIED/UNSUBSCRIBED, stops the cadence, and fires Slack alert for positives.
 */
export async function handleReply(
  prospectId: string,
  reply: HandleReplyInput = {},
): Promise<void> {
  const prospect = await prisma.outreachProspect.findUnique({
    where: { id: prospectId },
    include: {
      campaign: true,
      contact: { include: { account: true, lead: true } },
    },
  });
  if (!prospect) return;

  const newStatus: ProspectStatus =
    reply.classification === "UNSUBSCRIBE" ? "UNSUBSCRIBED" : "REPLIED";

  await prisma.outreachProspect.update({
    where: { id: prospectId },
    data: { status: newStatus, lastTouchAt: new Date(), nextTouchAt: null },
  });

  await prisma.outreachCampaign.update({
    where: { id: prospect.campaignId },
    data: {
      repliedCount: { increment: 1 },
      ...(reply.classification === "POSITIVE"
        ? { positiveReplies: { increment: 1 } }
        : {}),
    },
  });

  if (prospect.contact.leadId) {
    await prisma.leadActivity.create({
      data: {
        leadId: prospect.contact.leadId,
        type: "EMAIL_REPLIED",
        metadata: {
          prospectId,
          campaign: prospect.campaign.name,
          classification: reply.classification,
          snippet: reply.snippet,
        },
      },
    });
  }

  if (reply.classification === "POSITIVE" && prospect.contact.email) {
    await notifyPositiveReply({
      leadEmail: prospect.contact.email,
      leadName: [prospect.contact.firstName, prospect.contact.lastName]
        .filter(Boolean)
        .join(" "),
      campaign: prospect.campaign.name,
      snippet: reply.snippet,
    });
  }
}
