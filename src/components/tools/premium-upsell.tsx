"use client";

import * as React from "react";
import Script from "next/script";
import { Crown, Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface PremiumUpsellProps {
  title: string;
  description: string;
  priceInr: number;
  bullets?: string[];
  ctaLabel?: string;
  /** Tool slug is required to start Razorpay checkout. If omitted, the CTA
   * falls back to a "contact us" toast (legacy behavior). */
  toolSlug?: string;
  leadId?: string;
  toolCompletionId?: string;
  /** Called after Razorpay reports capture success. Receives toolCompletionId. */
  onPaymentSuccess?: (toolCompletionId?: string) => void;
}

type RazorpayHandlerResponse = {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
};

type RazorpayCheckoutOptions = {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  prefill?: { name?: string; email?: string; contact?: string };
  notes?: Record<string, string>;
  theme?: { color?: string };
  handler: (response: RazorpayHandlerResponse) => void;
  modal?: { ondismiss?: () => void };
};

interface RazorpayConstructor {
  new (opts: RazorpayCheckoutOptions): { open: () => void };
}

declare global {
  interface Window {
    Razorpay?: RazorpayConstructor;
  }
}

/**
 * Razorpay-backed premium upsell. Calls /api/checkout to create an order
 * then opens the Razorpay Checkout widget. On capture success, calls
 * onPaymentSuccess so the result page can enable the premium PDF download.
 */
export function PremiumUpsell({
  title,
  description,
  priceInr,
  bullets,
  ctaLabel = "Upgrade",
  toolSlug,
  leadId,
  toolCompletionId,
  onPaymentSuccess,
}: PremiumUpsellProps) {
  const [loading, setLoading] = React.useState(false);

  async function handleCheckout() {
    if (!toolSlug) {
      toast.info("Premium upgrade coming soon", {
        description:
          "Email hello@lexireview.in to purchase this template now — we'll invoice you directly.",
      });
      return;
    }
    setLoading(true);
    try {
      // 1. Create Razorpay order on server
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ toolSlug, leadId, toolCompletionId }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        if (data.stubbed) {
          toast.info("Payments coming online soon", {
            description:
              "We're finalising the payment integration. Email hello@lexireview.in to purchase now.",
          });
        } else {
          toast.error(data.error || "Could not start checkout");
        }
        return;
      }

      const { orderId, amount, currency, keyId, toolName } = await res.json();

      if (!window.Razorpay) {
        toast.error("Razorpay script failed to load. Refresh and try again.");
        return;
      }

      // 2. Open Razorpay Checkout
      const rzp = new window.Razorpay({
        key: keyId,
        amount,
        currency,
        name: "LexiReview",
        description: toolName,
        order_id: orderId,
        theme: { color: "#2563eb" },
        notes: {
          toolSlug,
          toolCompletionId: toolCompletionId || "",
        },
        handler: async (response) => {
          // 3. Let the webhook do the work — optimistic success toast
          toast.success("Payment captured", {
            description: "Your premium PDF is unlocking. This may take a few seconds.",
          });
          onPaymentSuccess?.(toolCompletionId);
          // Give the webhook a moment, then optionally poll
          setTimeout(() => {
            if (toolCompletionId) {
              fetch(`/api/tools/completion/${toolCompletionId}`)
                .then((r) => r.json())
                .then((c) => {
                  if (c.premiumPurchased) {
                    toast.success("Premium unlocked. Re-download for the verified PDF.");
                  }
                })
                .catch(() => {});
            }
          }, 2500);
          console.log("[razorpay] payment success", response.razorpay_payment_id);
        },
        modal: {
          ondismiss: () => {
            toast("Checkout closed", {
              description: "You can retry the upgrade any time.",
            });
          },
        },
      });

      rzp.open();
    } catch (err) {
      console.error(err);
      toast.error(err instanceof Error ? err.message : "Checkout failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="lazyOnload"
      />
      <div className="mt-10 overflow-hidden rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-700 via-blue-800 to-blue-900 p-6 text-white shadow-lg sm:p-8">
        <div className="flex items-start gap-3">
          <div className="rounded-lg bg-white/15 p-2">
            <Crown size={22} className="text-blue-100" />
          </div>
          <div>
            <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-2 py-0.5 text-[10px] font-semibold tracking-wider uppercase">
              <Sparkles size={10} /> Premium
            </span>
            <h3 className="font-heading mt-2 text-xl font-semibold sm:text-2xl">
              {title}
            </h3>
            <p className="mt-2 max-w-xl text-sm text-blue-100">{description}</p>
          </div>
        </div>

        {bullets && bullets.length > 0 ? (
          <ul className="mt-4 grid gap-2 text-sm text-blue-50 sm:grid-cols-2">
            {bullets.map((b) => (
              <li key={b} className="flex gap-2">
                <span className="mt-1 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />
                <span>{b}</span>
              </li>
            ))}
          </ul>
        ) : null}

        <div className="mt-6 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <span className="font-heading text-3xl font-bold">
              ₹{priceInr.toLocaleString("en-IN")}
            </span>
            <span className="ml-2 text-sm text-blue-100">one-time</span>
          </div>
          <Button
            type="button"
            size="lg"
            disabled={loading}
            onClick={handleCheckout}
            className="h-11 bg-white px-6 text-blue-800 hover:bg-blue-50 disabled:opacity-50"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : <>{ctaLabel} →</>}
          </Button>
        </div>
      </div>
    </>
  );
}
