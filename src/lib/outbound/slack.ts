/**
 * Slack webhook helper for outbound sales alerts.
 *
 * Stub-mode: when SLACK_WEBHOOK_URL is missing, logs to console instead of
 * posting. The function signature is identical so callers don't branch.
 */

export interface SlackNotifyOptions {
  webhookUrl?: string;
  /** Optional title rendered as bold header line. */
  title?: string;
}

export async function notifySlack(
  message: string,
  options: SlackNotifyOptions = {},
): Promise<{ success: boolean; stubbed?: boolean; error?: string }> {
  const url = options.webhookUrl || process.env.SLACK_WEBHOOK_URL;
  const text = options.title ? `*${options.title}*\n${message}` : message;

  if (!url) {
    console.log(`[outbound/slack STUBBED] ${text}`);
    return { success: true, stubbed: true };
  }

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ text }),
    });
    if (!res.ok) {
      const body = await res.text().catch(() => "");
      return { success: false, error: `Slack ${res.status}: ${body.slice(0, 200)}` };
    }
    return { success: true };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Unknown error",
    };
  }
}

export async function notifyPositiveReply(args: {
  leadEmail: string;
  leadName?: string;
  campaign?: string;
  snippet?: string;
}) {
  const parts = [
    `Lead: ${args.leadName ? `${args.leadName} <${args.leadEmail}>` : args.leadEmail}`,
    args.campaign ? `Campaign: ${args.campaign}` : null,
    args.snippet ? `> ${args.snippet.slice(0, 280)}` : null,
  ].filter(Boolean);
  return notifySlack(parts.join("\n"), { title: "Positive reply — create demo" });
}

export async function notifyDemoBooked(args: {
  leadEmail: string;
  leadName?: string;
  when?: string;
}) {
  const parts = [
    `Lead: ${args.leadName ? `${args.leadName} <${args.leadEmail}>` : args.leadEmail}`,
    args.when ? `When: ${args.when}` : null,
  ].filter(Boolean);
  return notifySlack(parts.join("\n"), { title: "Demo booked" });
}

export async function notifyStageChange(args: {
  leadEmail: string;
  from: string;
  to: string;
}) {
  return notifySlack(
    `${args.leadEmail}: ${args.from} -> ${args.to}`,
    { title: "Stage change" },
  );
}
