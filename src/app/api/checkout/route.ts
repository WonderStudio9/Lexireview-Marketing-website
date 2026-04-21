import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import {
  createOrder,
  isRazorpayConfigured,
  getPublicKeyId,
} from "@/lib/payments/razorpay";

const CheckoutSchema = z.object({
  toolSlug: z.string().min(1),
  leadId: z.string().optional(),
  toolCompletionId: z.string().optional(),
});

/**
 * POST /api/checkout
 *
 * Starts a premium PDF purchase. Looks up the Tool's premiumPrice from DB,
 * creates a Razorpay order, returns the order ID + public key for the
 * client-side checkout widget.
 *
 * Response (success):
 *   { orderId, amount, currency, keyId, toolName, toolCompletionId }
 *
 * Response (stub mode — no Razorpay keys):
 *   { error: "Razorpay not configured", stubbed: true }
 */
export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  const parsed = CheckoutSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.issues },
      { status: 400 }
    );
  }
  const data = parsed.data;

  if (!isRazorpayConfigured()) {
    return NextResponse.json(
      {
        error:
          "Payments are not yet configured. Contact hello@lexireview.in to purchase.",
        stubbed: true,
      },
      { status: 503 }
    );
  }

  // Look up the tool
  const tool = await prisma.tool.findUnique({ where: { slug: data.toolSlug } });
  if (!tool) {
    return NextResponse.json({ error: "Tool not found" }, { status: 404 });
  }
  if (!tool.premiumPdf || !tool.premiumPrice || tool.premiumPrice <= 0) {
    return NextResponse.json(
      { error: "This tool has no premium upgrade" },
      { status: 400 }
    );
  }

  // Create Razorpay order
  const order = await createOrder({
    amountPaise: tool.premiumPrice,
    currency: "INR",
    receipt: `lxr_${tool.slug.slice(0, 15)}_${Date.now().toString(36)}`,
    notes: {
      toolSlug: tool.slug,
      toolName: tool.name,
      leadId: data.leadId || "",
      toolCompletionId: data.toolCompletionId || "",
    },
  });

  if (!order) {
    return NextResponse.json(
      { error: "Failed to create payment order" },
      { status: 500 }
    );
  }

  return NextResponse.json({
    orderId: order.id,
    amount: order.amount,
    currency: order.currency,
    keyId: getPublicKeyId(),
    toolName: tool.name,
    toolCompletionId: data.toolCompletionId,
  });
}
