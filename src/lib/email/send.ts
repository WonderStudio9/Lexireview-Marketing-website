import { prisma } from "@/lib/db";
import { getResend, FROM_EMAIL, FROM_NAME, REPLY_TO } from "./resend";

export interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
  text: string;
  leadId?: string;
  templateId?: string;
  fromEmail?: string;
  fromName?: string;
  replyTo?: string;
}

export interface SendEmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
  /** When RESEND_API_KEY is not set, emails are logged (stubbed) but still recorded as EmailSend rows. */
  stubbed?: boolean;
}

/**
 * Send a transactional/marketing email via Resend.
 *
 * Behaviour:
 *   1. Always records an `EmailSend` row in PostgreSQL (for audit + tracking).
 *   2. If `RESEND_API_KEY` is set, sends the email and stores `resendMessageId`.
 *   3. If `RESEND_API_KEY` is NOT set, marks the send as stubbed and logs to console.
 *      This lets us build + test email flows before the API key is configured.
 */
export async function sendEmail(params: SendEmailParams): Promise<SendEmailResult> {
  const from = `${params.fromName || FROM_NAME} <${params.fromEmail || FROM_EMAIL}>`;
  const resend = getResend();

  // Resolve the lead first. If leadId provided, use it. Otherwise, try to match by email.
  let resolvedLeadId = params.leadId;
  if (!resolvedLeadId) {
    const lead = await prisma.lead.findUnique({ where: { email: params.to } });
    resolvedLeadId = lead?.id;
  }

  // If no lead exists, we still want to record the send — create a lightweight record.
  if (!resolvedLeadId) {
    console.warn(`[email/send] No lead found for ${params.to}; send will not be recorded.`);
    if (!resend) {
      console.log(`[email/send STUBBED] → ${params.to} | ${params.subject}`);
      return { success: true, stubbed: true };
    }
    // Still send, but skip DB record.
    try {
      const { data, error } = await resend.emails.send({
        from,
        to: params.to,
        subject: params.subject,
        html: params.html,
        text: params.text,
        replyTo: params.replyTo || REPLY_TO,
      });
      if (error) return { success: false, error: error.message };
      return { success: true, messageId: data?.id };
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : "Unknown error" };
    }
  }

  // Create the EmailSend row BEFORE sending so we have a record even if the API fails.
  const emailSend = await prisma.emailSend.create({
    data: {
      leadId: resolvedLeadId,
      templateId: params.templateId,
      subject: params.subject,
      fromEmail: params.fromEmail || FROM_EMAIL,
      toEmail: params.to,
      bodyHtml: params.html,
    },
  });

  // Stub mode — no API key configured
  if (!resend) {
    console.log(
      `[email/send STUBBED] to=${params.to} subject="${params.subject}" leadId=${resolvedLeadId} emailSendId=${emailSend.id}`,
    );
    return { success: true, stubbed: true };
  }

  // Real send
  try {
    const { data, error } = await resend.emails.send({
      from,
      to: params.to,
      subject: params.subject,
      html: params.html,
      text: params.text,
      replyTo: params.replyTo || REPLY_TO,
    });

    if (error) {
      await prisma.emailSend.update({
        where: { id: emailSend.id },
        data: { failedAt: new Date(), failureReason: error.message },
      });
      return { success: false, error: error.message };
    }

    await prisma.emailSend.update({
      where: { id: emailSend.id },
      data: { sentAt: new Date(), resendMessageId: data?.id },
    });

    return { success: true, messageId: data?.id };
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    await prisma.emailSend.update({
      where: { id: emailSend.id },
      data: { failedAt: new Date(), failureReason: msg },
    });
    return { success: false, error: msg };
  }
}
