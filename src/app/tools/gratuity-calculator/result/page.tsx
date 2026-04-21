"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BadgeIndianRupee, CheckCircle2, Info, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { ToolLayout } from "@/components/tools/tool-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmailGate } from "@/components/tools/email-gate";
import { PremiumUpsell } from "@/components/tools/premium-upsell";
import type { GratuityInput, GratuityOutput } from "@/lib/tools/types";

export default function GratuityResultPage() {
  const router = useRouter();
  const [input, setInput] = useState<GratuityInput | null>(null);
  const [output, setOutput] = useState<GratuityOutput | null>(null);
  const [loading, setLoading] = useState(false);
  const [unlocked, setUnlocked] = useState(false);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("tool:gratuity:input");
      if (!raw) {
        router.replace("/tools/gratuity-calculator");
        return;
      }
      setInput(JSON.parse(raw) as GratuityInput);
    } catch {
      router.replace("/tools/gratuity-calculator");
    }
  }, [router]);

  async function runCalculate(leadId: string) {
    if (!input) return;
    setLoading(true);
    try {
      const res = await fetch("/api/tools/gratuity-calculator/calculate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...input, leadId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Calculation failed");
      setOutput(data);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not calculate");
    } finally {
      setLoading(false);
    }
  }

  function handleUnlocked(id: string) {
    setUnlocked(true);
    runCalculate(id);
  }

  return (
    <ToolLayout
      eyebrow="Result"
      title="Your gratuity estimate"
      subtitle={
        unlocked
          ? "Formula, amount, tax treatment under Section 10(10)."
          : "Enter your email to unlock your gratuity estimate."
      }
    >
      {!unlocked ? (
        <EmailGate
          icp="EMPLOYEE"
          sourceDetail="gratuity-calculator"
          onUnlocked={(id) => handleUnlocked(id)}
        />
      ) : loading ? (
        <Card>
          <CardContent className="flex items-center gap-2 py-12 text-sm text-slate-500">
            <Loader2 size={16} className="animate-spin" />
            Computing your gratuity…
          </CardContent>
        </Card>
      ) : output ? (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BadgeIndianRupee size={18} className="text-emerald-600" />
                Your gratuity amount
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                  <div className="text-xs font-semibold uppercase tracking-wider text-emerald-800">
                    Gratuity payable
                  </div>
                  <div className="font-heading mt-1 text-2xl font-bold text-emerald-900">
                    ₹{output.gratuityAmount.toLocaleString("en-IN")}
                  </div>
                  <div className="mt-2 text-[11px] text-emerald-800">
                    Formula: {output.formula}
                  </div>
                </div>
                <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
                  <div className="text-xs font-semibold uppercase tracking-wider text-blue-800">
                    Tax-exempt portion
                  </div>
                  <div className="font-heading mt-1 text-2xl font-bold text-blue-900">
                    ₹{output.taxExemption.toLocaleString("en-IN")}
                  </div>
                  <div className="mt-2 text-[11px] text-blue-800">
                    Cap of ₹20L under Section 10(10)(ii) / (iii)
                  </div>
                </div>
              </div>

              <p className="mt-4 text-sm text-slate-700">
                {output.eligibilityNote}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle2 size={18} className="text-blue-700" />
                Tax treatment
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-700">{output.taxNote}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info size={18} className="text-blue-700" />
                Key points
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-slate-700">
                {output.bullets.map((b) => (
                  <li key={b} className="flex gap-2">
                    <span className="mt-1 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-blue-600" />
                    {b}
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-xs text-slate-500">{output.disclaimer}</p>
            </CardContent>
          </Card>

          <PremiumUpsell
            title="Combined PF + EPS + Gratuity retirement calculator"
            description="Your full retirement corpus — PF, EPS (pension), gratuity, and leave encashment, with tax and inflation projections."
            priceInr={299}
            ctaLabel="Upgrade for ₹299"
            bullets={[
              "PF + EPS + gratuity + leave encashment",
              "Tax-impact simulation under both regimes",
              "Year-by-year corpus projection",
              "PDF downloadable report",
            ]}
          />
        </div>
      ) : null}
    </ToolLayout>
  );
}
