/**
 * Unipile integration (LinkedIn outreach).
 *
 * Stub-mode: when UNIPILE_API_KEY is missing, logs to console and returns
 * a fake message id so cadence steps with channel=LINKEDIN don't fail.
 *
 * Activation: drop UNIPILE_API_KEY + UNIPILE_ACCOUNT_ID in env and this
 * module will start making real API calls.
 */

const UNIPILE_BASE_URL = "https://api.unipile.com:13000/api/v1";

export interface UnipileClient {
  apiKey: string;
  accountId?: string;
}

let _client: UnipileClient | null = null;

export function getUnipile(): UnipileClient | null {
  if (_client) return _client;
  const apiKey = process.env.UNIPILE_API_KEY;
  if (!apiKey) return null;
  _client = {
    apiKey,
    accountId: process.env.UNIPILE_ACCOUNT_ID,
  };
  return _client;
}

export interface SendLinkedInMessageParams {
  profileUrl: string;
  message: string;
  mode?: "CONNECTION_REQUEST" | "MESSAGE" | "INMAIL";
}

export interface SendLinkedInResult {
  success: boolean;
  messageId?: string;
  error?: string;
  stubbed?: boolean;
}

export async function sendLinkedInMessage(
  params: SendLinkedInMessageParams,
): Promise<SendLinkedInResult> {
  const client = getUnipile();
  if (!client) {
    console.log(
      `[outbound/unipile STUBBED] linkedin mode=${params.mode ?? "MESSAGE"} profile=${params.profileUrl}`,
    );
    return {
      success: true,
      stubbed: true,
      messageId: `stub:unipile:${Date.now()}`,
    };
  }
  try {
    const res = await fetch(`${UNIPILE_BASE_URL}/users/invite`, {
      method: "POST",
      headers: {
        "x-api-key": client.apiKey,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        account_id: client.accountId,
        provider_id: params.profileUrl,
        message: params.message,
      }),
    });
    if (!res.ok) {
      const msg = await res.text().catch(() => "");
      return { success: false, error: `Unipile ${res.status}: ${msg.slice(0, 200)}` };
    }
    const data = (await res.json()) as { invitation_id?: string };
    return { success: true, messageId: data.invitation_id };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Unknown error",
    };
  }
}
