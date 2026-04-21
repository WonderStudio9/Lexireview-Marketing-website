"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, CheckCircle2, Info, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { ToolLayout } from "@/components/tools/tool-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmailGate } from "@/components/tools/email-gate";
import { PremiumUpsell } from "@/components/tools/premium-upsell";
import type {
  NoticePeriodInput,
  NoticePeriodOutput,
} from "@/lib/tools/types";

export default function NoticePeriodResultPage() {
  const router = useRouter();
  const [input, setInput] = useState<NoticePeriodInput | null>(null);
  const [output, setOutput] = useState<NoticePeriodOutput | null>(null);
  const [loading, setLoading] = useState(false);
  const [unlocked, setUnlocked] = useState(false);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("tool:notice-period:input");
      if (!raw) {
        router.replace("/tools/notice-period-rules-checker");
        return;
      }
      setInput(JSON.parse(raw) as NoticePeriodInput);
    } catch {
      router.replace("/tools/notice-period-rules-checker");
    }
  }, [router]);

  async function runCalculate(leadId: string) {
    if (!input) return;
    setLoading(true);
    try {
      const res = await fetch(
        "/api/tools/notice-period-rules-checker/calculate",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...input, leadId }),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Calculation failed");
      setOutput(data);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Could not analyse notice period"
      );
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
      title="Your notice period analysis"
      subtitle={
        unlocked
          ? "State-specific statutory rules + enforceability of non-compete."
          : "Enter your email to unlock the full analysis."
      }
    >
      {!unlocked ? (
        <EmailGate
          icp="EMPLOYEE"
          sourceDetail="notice-period-rules-checker"
          onUnlocked={(id) => handleUnlocked(id)}
        />
      ) : (
        <>
          {loading ? (
            <Card>
              <CardContent className="flex items-center gap-2 py-12 text-sm text-slate-500">
                <Loader2 size={16} className="animate-spin" />
                Analysing your notice period rules…
              </CardContent>
            </Card>
          ) : output ? (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle2 size={18} className="text-emerald-600" />
                    Applicable notice period
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
                    <div className="font-heading text-3xl font-bold text-blue-900">
                      {output.applicableNoticeDays} days
                    </div>
                    <div className="mt-1 text-sm text-blue-800">
                      {output.applicableLaw}
                    </div>
                  </div>
                  <p className="mt-4 text-sm text-slate-700">
                    {output.contractVsStatutory}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle size={18} className="text-amber-600" />
                    Non-compete & garden leave
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-slate-700">
                  <p>
                    <span className="font-semibold">Non-compete:</span>{" "}
                    {output.nonCompeteEnforceable}. Section 27 of the Indian
                    Contract Act, 1872 renders most post-termination non-compete
                    restraints void, subject to narrow exceptions.
                  </p>
                  <p>
                    <span className="font-semibold">Garden leave:</span>{" "}
                    {output.gardenLeaveNote}
                  </p>
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
                  <p className="mt-4 text-xs text-slate-500">
                    {output.disclaimer}
                  </p>
                </CardContent>
              </Card>

              <PremiumUpsell
                title="Custom negotiation letter to shorten notice"
                description="Lawyer-drafted letter to HR + senior management, citing your exact state rules and specific contract clauses. Persuasive, polite, pressure-applying."
                priceInr={199}
                ctaLabel="Upgrade for ₹199"
                bullets={[
                  "Tailored to your industry & state",
                  "Cites statutory minimums",
                  "Buyout calculation included",
                  "Email & printable versions",
                ]}
              />
            </div>
          ) : null}
        </>
      )}
    </ToolLayout>
  );
}
