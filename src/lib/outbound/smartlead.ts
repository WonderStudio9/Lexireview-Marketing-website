/**
 * SmartLead integration — cold outbound engine.
 *
 * Stub-mode behaviour (when SMARTLEAD_API_KEY is missing):
 *   - All functions return { stubbed: true } shaped results.
 *   - Sends are logged to console AND recorded in the `EmailSend` table so we
 *     can wire up UI + cadence logic before credentials arrive.
 *   - `smartleadCampaignId` lives on `EmailSend.resendMessageId` (reusing the
 *     existing provider id column to avoid a schema migration).
 *
 * Activation checklist (once SMARTLEAD_API_KEY arrives):
 *   1. Drop the key + workspace id in .env (see .env.example).
 *   2. Point SmartLead webhooks at POST /api/webhooks/smartlead with the
 *      SMARTLEAD_WEBHOOK_SECRET value as `x-smartlead-signature`.
 *   3. Flip OutreachCampaign.status to ACTIVE via the dashboard — no code
 *      changes required. The cron worker picks up prospects automatically.
 *
 * Rate-limit guardrail: 200 sends / inbox / day per industry best practice.
 * The `checkRateLimit` helper is enforced both here (per call) and in the
 * cadence worker (global daily cap).
 */
import { prisma } from "@/lib/db";

const SMARTLEAD_BASE_URL = "https://server.smartlead.ai/api/v1";
const DAILY_INBOX_LIMIT = 200;

export interface SmartLeadClient {
  apiKey: string;
  workspaceId?: string;
}

export interface SendColdEmailParams {
  campaignId?: string;
  leadId?: string;
  toEmail: string;
  fromEmail: string;
  subject: string;
  bodyHtml: string;
  bodyText?: string;
  inboxId?: string;
  /** Optional smartlead campaign id to attach this send to */
  smartleadCampaignId?: string;
}

export interface SendColdEmailResult {
  success: boolean;
  messageId?: string;
  smartleadCampaignId?: string;
  error?: string;
  stubbed?: boolean;
  rateLimited?: boolean;
}

export interface CampaignSettings {
  trackOpens?: boolean;
  trackClicks?: boolean;
  stopOnReply?: boolean;
  dailyLimit?: number;
  timezone?: string;
}

export interface SmartLeadLead {
  firstName?: string;
  lastName?: string;
  email: string;
  companyName?: string;
  website?: string;
  linkedInProfile?: string;
  location?: string;
  customFields?: Record<string, string>;
}

export interface ReplyStatus {
  leadEmail: string;
  replied: boolean;
  repliedAt?: Date;
  replyText?: string;
  classification?: "POSITIVE" | "NEGATIVE" | "NEUTRAL" | "UNSUBSCRIBE";
}

let _client: SmartLeadClient | null = null;

/**
 * Null-safe SmartLead singleton. Returns null when API key is missing so
 * callers must handle the stub path explicitly.
 */
export function getSmartLead(): SmartLeadClient | null {
  if (_client) return _client;
  const apiKey = process.env.SMARTLEAD_API_KEY;
  if (!apiKey) return null;
  _client = {
    apiKey,
    workspaceId: process.env.SMARTLEAD_WORKSPACE_ID,
  };
  return _client;
}

/** Count sends from a given inbox in the last 24h. */
async function sendsFromInboxToday(fromEmail: string): Promise<number> {
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000);
  return prisma.emailSend.count({
    where: {
      fromEmail,
      sentAt: { gte: since },
    },
  });
}

export async function checkRateLimit(fromEmail: string): Promise<{
  allowed: boolean;
  sentToday: number;
  limit: number;
}> {
  const sentToday = await sendsFromInboxToday(fromEmail);
  return {
    allowed: sentToday < DAILY_INBOX_LIMIT,
    sentToday,
    limit: DAILY_INBOX_LIMIT,
  };
}

async function smartleadFetch<T>(
  path: string,
  init: RequestInit & { client: SmartLeadClient },
): Promise<T> {
  const { client, ...rest } = init;
  const url = `${SMARTLEAD_BASE_URL}${path}${path.includes("?") ? "&" : "?"}api_key=${encodeURIComponent(client.apiKey)}`;
  const res = await fetch(url, {
    ...rest,
    headers: {
      "content-type": "application/json",
      ...(rest.headers || {}),
    },
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`SmartLead ${res.status}: ${body.slice(0, 200)}`);
  }
  return (await res.json()) as T;
}

/**
 * Send a single cold email via SmartLead. In stub mode, records the send to
 * `EmailSend` and logs to console.
 */
export async function sendColdEmail(
  params: SendColdEmailParams,
): Promise<SendColdEmailResult> {
  const client = getSmartLead();

  // Rate limit check — enforced in both stub + real mode so dashboards are
  // accurate during local testing.
  const rate = await checkRateLimit(params.fromEmail);
  if (!rate.allowed) {
    console.warn(
      `[outbound/smartlead] RATE LIMITED for inbox=${params.fromEmail} sentToday=${rate.sentToday}`,
    );
    return {
      success: false,
      rateLimited: true,
      error: `Daily limit reached for ${params.fromEmail} (${rate.sentToday}/${rate.limit})`,
    };
  }

  // Record the send attempt first so we always have an audit trail.
  let emailSendId: string | undefined;
  if (params.leadId) {
    const row = await prisma.emailSend.create({
      data: {
        leadId: params.leadId,
        subject: params.subject,
        fromEmail: params.fromEmail,
        toEmail: params.toEmail,
        bodyHtml: params.bodyHtml,
      },
    });
    emailSendId = row.id;
  }

  // Stub mode
  if (!client) {
    console.log(
      `[outbound/smartlead STUBBED] to=${params.toEmail} subj="${params.subject}" from=${params.fromEmail}`,
    );
    if (emailSendId) {
      await prisma.emailSend.update({
        where: { id: emailSendId },
        data: {
          sentAt: new Date(),
          resendMessageId: params.smartleadCampaignId
            ? `stub:${params.smartleadCampaignId}`
            : "stub:smartlead",
        },
      });
    }
    return {
      success: true,
      stubbed: true,
      smartleadCampaignId: params.smartleadCampaignId,
    };
  }

  // Real send
  try {
    // SmartLead does not expose a transactional single-send API for cold
    // outreach — instead prospects must be added to a campaign. When a
    // smartleadCampaignId is supplied we use the add-lead endpoint; callers
    // relying on single-send should use the transactional Resend path.
    if (!params.smartleadCampaignId) {
      throw new Error(
        "smartleadCampaignId is required for real sends; use cadence.sendNextTouch",
      );
    }
    const result = await smartleadFetch<{ ok: boolean; message?: string }>(
      `/campaigns/${params.smartleadCampaignId}/leads`,
      {
        client,
        method: "POST",
        body: JSON.stringify({
          lead_list: [
            {
              first_name: params.toEmail.split("@")[0],
              email: params.toEmail,
            },
          ],
        }),
      },
    );
    if (emailSendId) {
      await prisma.emailSend.update({
        where: { id: emailSendId },
        data: {
          sentAt: new Date(),
          resendMessageId: `smartlead:${params.smartleadCampaignId}`,
        },
      });
    }
    return {
      success: result.ok !== false,
      smartleadCampaignId: params.smartleadCampaignId,
    };
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    if (emailSendId) {
      await prisma.emailSend.update({
        where: { id: emailSendId },
        data: { failedAt: new Date(), failureReason: msg },
      });
    }
    return { success: false, error: msg };
  }
}

/**
 * Create a new SmartLead campaign. In stub mode, returns a deterministic
 * fake id prefixed with `stub:`.
 */
export async function createCampaign(
  name: string,
  inboxes: string[],
  settings: CampaignSettings = {},
): Promise<{ smartleadCampaignId: string; stubbed?: boolean }> {
  const client = getSmartLead();
  if (!client) {
    const stubId = `stub:${name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
    console.log(
      `[outbound/smartlead STUBBED] createCampaign name="${name}" inboxes=${inboxes.length} id=${stubId}`,
    );
    return { smartleadCampaignId: stubId, stubbed: true };
  }
  const data = await smartleadFetch<{ id: string | number }>("/campaigns/create", {
    client,
    method: "POST",
    body: JSON.stringify({
      name,
      client_id: client.workspaceId,
      inbox_ids: inboxes,
      track_settings: {
        open_tracking: settings.trackOpens ?? true,
        click_tracking: settings.trackClicks ?? true,
      },
      stop_lead_settings: settings.stopOnReply === false ? "DONT_STOP" : "REPLY_TO_AN_EMAIL",
      daily_sending_limit: settings.dailyLimit ?? DAILY_INBOX_LIMIT,
      timezone: settings.timezone ?? "Asia/Kolkata",
    }),
  });
  return { smartleadCampaignId: String(data.id) };
}

/** Bulk add leads to a SmartLead campaign. */
export async function addLeadsToCampaign(
  campaignId: string,
  leads: SmartLeadLead[],
): Promise<{ added: number; stubbed?: boolean }> {
  const client = getSmartLead();
  if (!client) {
    console.log(
      `[outbound/smartlead STUBBED] addLeadsToCampaign campaign=${campaignId} count=${leads.length}`,
    );
    return { added: leads.length, stubbed: true };
  }
  await smartleadFetch(`/campaigns/${campaignId}/leads`, {
    client,
    method: "POST",
    body: JSON.stringify({
      lead_list: leads.map((l) => ({
        first_name: l.firstName,
        last_name: l.lastName,
        email: l.email,
        company_name: l.companyName,
        website: l.website,
        linkedin_profile: l.linkedInProfile,
        location: l.location,
        custom_fields: l.customFields ?? {},
      })),
    }),
  });
  return { added: leads.length };
}

/**
 * Poll reply status for a lead. Typically webhooks are preferred, but this
 * supports manual reconciliation.
 */
export async function getReplyStatus(
  leadEmail: string,
): Promise<ReplyStatus> {
  const client = getSmartLead();
  if (!client) {
    console.log(`[outbound/smartlead STUBBED] getReplyStatus ${leadEmail}`);
    return { leadEmail, replied: false };
  }
  try {
    const data = await smartleadFetch<{
      replied?: boolean;
      replied_at?: string;
      reply_text?: string;
      classification?: ReplyStatus["classification"];
    }>(`/leads/search?email=${encodeURIComponent(leadEmail)}`, {
      client,
      method: "GET",
    });
    return {
      leadEmail,
      replied: Boolean(data.replied),
      repliedAt: data.replied_at ? new Date(data.replied_at) : undefined,
      replyText: data.reply_text,
      classification: data.classification,
    };
  } catch (err) {
    console.error("[outbound/smartlead] getReplyStatus failed", err);
    return { leadEmail, replied: false };
  }
}
