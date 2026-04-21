"use client";

import { Crown, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface PremiumUpsellProps {
  title: string;
  description: string;
  priceInr: number;
  bullets?: string[];
  ctaLabel?: string;
}

/**
 * Bottom-of-result upsell card. Razorpay is not yet wired — clicking
 * the CTA just shows a "Coming soon" toast. Pure UI stub by design.
 */
export function PremiumUpsell({
  title,
  description,
  priceInr,
  bullets,
  ctaLabel = "Upgrade",
}: PremiumUpsellProps) {
  return (
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
          onClick={() =>
            toast.info("Premium checkout coming soon", {
              description:
                "Razorpay integration is being added shortly. You'll get an email as soon as it's live.",
            })
          }
          className="h-11 bg-white px-6 text-blue-800 hover:bg-blue-50"
        >
          {ctaLabel} →
        </Button>
      </div>
    </div>
  );
}
