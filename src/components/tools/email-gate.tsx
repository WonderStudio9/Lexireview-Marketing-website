"use client";

import { useState } from "react";
import { Mail, ShieldCheck, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { captureLead } from "@/lib/tools/capture-lead";

interface EmailGateProps {
  icp: string;
  source?: string;
  sourceDetail?: string;
  headline?: string;
  subcopy?: string;
  buttonLabel?: string;
  onUnlocked: (leadId: string, email: string) => void;
}

/**
 * Inline email-gate shown before the user sees tool output.
 * Collects email, POSTs to /api/lead, then calls onUnlocked.
 * Lead capture failures are tolerated (UX unlocks anyway) so
 * a backend hiccup never blocks the citizen from their result.
 */
export function EmailGate({
  icp,
  source = "ORGANIC_TOOL",
  sourceDetail,
  headline = "Almost there — enter your email to unlock your result",
  subcopy = "We'll email you a copy and send you occasional Indian-law tips. Unsubscribe any time.",
  buttonLabel = "Unlock result",
  onUnlocked,
}: EmailGateProps) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);

    const trimmed = email.trim();
    if (!trimmed || !/.+@.+\..+/.test(trimmed)) {
      setErr("Please enter a valid email address");
      return;
    }

    setLoading(true);
    try {
      let leadId = "";
      try {
        const r = await captureLead({
          email: trimmed,
          icp,
          source,
          firstTouchUrl:
            typeof window !== "undefined" ? window.location.href : "",
          sourceDetail,
        });
        leadId = r.leadId;
      } catch {
        // Non-blocking: even if the /api/lead route is not live yet,
        // still unlock the user's result. We log for debugging.
        // eslint-disable-next-line no-console
        console.warn("Lead capture failed — proceeding without leadId.");
      }
      onUnlocked(leadId, trimmed);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative overflow-hidden rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 via-white to-blue-50 p-6 sm:p-8">
      <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-blue-800 text-white shadow-md">
        <Mail size={22} />
      </div>
      <h2 className="font-heading text-xl font-semibold text-slate-900 sm:text-2xl">
        {headline}
      </h2>
      <p className="mt-2 max-w-xl text-sm text-slate-600">{subcopy}</p>

      <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-3 sm:flex-row">
        <Input
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="h-11 text-base sm:flex-1"
          aria-label="Email address"
          autoComplete="email"
        />
        <Button
          type="submit"
          disabled={loading}
          size="lg"
          className="h-11 bg-blue-700 px-6 text-white hover:bg-blue-800 disabled:opacity-60"
        >
          {loading ? (
            <span className="inline-flex items-center gap-2">
              <Loader2 size={16} className="animate-spin" /> Unlocking…
            </span>
          ) : (
            buttonLabel
          )}
        </Button>
      </form>

      {err ? (
        <p className="mt-2 text-xs text-red-600">{err}</p>
      ) : (
        <p className="mt-3 flex items-center gap-1.5 text-xs text-slate-500">
          <ShieldCheck size={13} className="text-emerald-600" />
          No spam. DPDP-compliant. We never share your email.
        </p>
      )}
    </div>
  );
}
