/**
 * Razorpay payment integration.
 *
 * Stub mode: when RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET is missing, returns
 * null from createOrder (caller must handle). Webhook verification also stubbed.
 *
 * Set env vars on VPS:
 *   RAZORPAY_KEY_ID=rzp_live_xxx
 *   RAZORPAY_KEY_SECRET=xxx
 *   RAZORPAY_WEBHOOK_SECRET=xxx
 */
import Razorpay from "razorpay";
import crypto from "node:crypto";

export interface RazorpayOrder {
  id: string;
  amount: number;
  currency: string;
  receipt: string;
  status: string;
  keyId: string; // Public key for checkout widget
}

let _client: Razorpay | null = null;

function getClient(): Razorpay | null {
  if (_client) return _client;
  const key_id = process.env.RAZORPAY_KEY_ID;
  const key_secret = process.env.RAZORPAY_KEY_SECRET;
  if (!key_id || !key_secret) return null;
  _client = new Razorpay({ key_id, key_secret });
  return _client;
}

/**
 * Create a Razorpay order (amount in paise). Returns null in stub mode.
 */
export async function createOrder(params: {
  amountPaise: number;
  currency?: string;
  receipt: string;
  notes?: Record<string, string>;
}): Promise<RazorpayOrder | null> {
  const client = getClient();
  if (!client) {
    console.log(
      `[razorpay STUBBED] createOrder ${params.receipt} for ₹${params.amountPaise / 100}`
    );
    return null;
  }

  try {
    const order = await client.orders.create({
      amount: params.amountPaise,
      currency: params.currency || "INR",
      receipt: params.receipt,
      notes: params.notes,
    });

    return {
      id: order.id,
      amount: Number(order.amount),
      currency: order.currency,
      receipt: String(order.receipt ?? ""),
      status: order.status,
      keyId: process.env.RAZORPAY_KEY_ID!,
    };
  } catch (err) {
    console.error("[razorpay] createOrder error:", err);
    return null;
  }
}

/**
 * Verify the signature returned by the client after checkout.
 * Docs: https://razorpay.com/docs/payments/server-integration/nodejs/payment-gateway/build-integration/#handle-payments
 */
export function verifyPaymentSignature(params: {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}): boolean {
  const secret = process.env.RAZORPAY_KEY_SECRET;
  if (!secret) {
    console.log("[razorpay STUBBED] verifyPaymentSignature — no secret");
    return false;
  }

  const body = `${params.razorpayOrderId}|${params.razorpayPaymentId}`;
  const expected = crypto
    .createHmac("sha256", secret)
    .update(body)
    .digest("hex");

  return expected === params.razorpaySignature;
}

/**
 * Verify an incoming webhook body using the webhook secret.
 */
export function verifyWebhookSignature(
  rawBody: string,
  signature: string
): boolean {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret) return false;

  const expected = crypto
    .createHmac("sha256", secret)
    .update(rawBody)
    .digest("hex");

  return expected === signature;
}

export function isRazorpayConfigured(): boolean {
  return Boolean(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET);
}

export function getPublicKeyId(): string | null {
  return process.env.RAZORPAY_KEY_ID || null;
}
