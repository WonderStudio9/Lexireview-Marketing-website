import { NextRequest, NextResponse } from "next/server";
import { handleRb2bWebhook, RB2BWebhookPayload } from "@/lib/enrichment/rb2b";

/**
 * POST /api/webhooks/rb2b
 *
 * Receives reverse-IP identifications from RB2B.
 * Secured by optional `RB2B_WEBHOOK_SECRET` header.
 */
export async function POST(request: NextRequest) {
  const secret = process.env.RB2B_WEBHOOK_SECRET;
  if (secret) {
    const header = request.headers.get("x-rb2b-signature");
    if (header !== secret) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  let body: RB2BWebhookPayload;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!body.company?.name) {
    return NextResponse.json({ error: "company.name required" }, { status: 400 });
  }

  try {
    const result = await handleRb2bWebhook(body);
    return NextResponse.json({ ok: true, ...result });
  } catch (err) {
    console.error("[/api/webhooks/rb2b] error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Internal error" },
      { status: 500 },
    );
  }
}
