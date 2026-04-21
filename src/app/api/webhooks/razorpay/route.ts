import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyWebhookSignature } from "@/lib/payments/razorpay";

/**
 * POST /api/webhooks/razorpay
 *
 * Razorpay webhook handler. Verifies signature then marks the ToolCompletion
 * as purchased so premium PDF downloads become allowed.
 *
 * Set the webhook URL in Razorpay Dashboard to:
 *   https://lexireview.in/api/webhooks/razorpay
 * Events to subscribe: payment.captured, payment.failed
 * Webhook secret: RAZORPAY_WEBHOOK_SECRET in .env
 */
export async function POST(request: NextRequest) {
  const rawBody = await request.text();
  const signature = request.headers.get("x-razorpay-signature") || "";

  if (!verifyWebhookSignature(rawBody, signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  let event;
  try {
    event = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const eventType = event.event as string;
  const payment = event.payload?.payment?.entity;

  if (!payment) {
    return NextResponse.json({ ok: true, ignored: "no payment entity" });
  }

  const notes = payment.notes as Record<string, string> | null;
  const toolSlug = notes?.toolSlug;
  const toolCompletionId = notes?.toolCompletionId;
  const leadId = notes?.leadId;

  if (eventType === "payment.captured" && toolSlug) {
    // Mark tool completion as purchased (if provided)
    if (toolCompletionId) {
      await prisma.toolCompletion.update({
        where: { id: toolCompletionId },
        data: {
          premiumPurchased: true,
          razorpayPaymentId: payment.id,
        },
      }).catch((err) => {
        console.error(`[razorpay webhook] toolCompletion update failed:`, err);
      });
    }

    // Bump tool stats
    const tool = await prisma.tool.findUnique({ where: { slug: toolSlug } });
    if (tool) {
      await prisma.tool.update({
        where: { id: tool.id },
        data: { totalPremiumSales: { increment: 1 } },
      });
    }

    // Log activity on the lead's timeline
    if (leadId) {
      await prisma.leadActivity
        .create({
          data: {
            leadId,
            type: "SUBSCRIPTION_STARTED",
            metadata: {
              type: "premium-pdf",
              toolSlug,
              amountPaise: payment.amount,
              razorpayPaymentId: payment.id,
            },
          },
        })
        .catch(() => {});
    }

    return NextResponse.json({ ok: true, captured: true, toolSlug });
  }

  if (eventType === "payment.failed" && toolCompletionId) {
    // Log but don't change state
    if (leadId) {
      await prisma.leadActivity
        .create({
          data: {
            leadId,
            type: "PAYMENT_FAILED",
            metadata: {
              toolSlug,
              reason: payment.error_description,
            },
          },
        })
        .catch(() => {});
    }
    return NextResponse.json({ ok: true, failed: true });
  }

  return NextResponse.json({ ok: true, eventType });
}
