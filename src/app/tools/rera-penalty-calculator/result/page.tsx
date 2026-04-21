"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, Loader2, Gavel, Lightbulb } from "lucide-react";
import { toast } from "sonner";

import { ToolLayout } from "@/components/tools/tool-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmailGate } from "@/components/tools/email-gate";
import { PremiumUpsell } from "@/components/tools/premium-upsell";
import type { ReraPenaltyInput, ReraPenaltyOutput } from "@/lib/tools/types";

export default function ReraPenaltyResultPage() {
  const router = useRouter();
  const [input, setInput] = useState<ReraPenaltyInput | null>(null);
  const [output, setOutput] = useState<ReraPenaltyOutput | null>(null);
  const [loading, setLoading] = useState(false);
  const [unlocked, setUnlocked] = useState(false);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("tool:rera-penalty:input");
      if (!raw) {
        router.replace("/tools/rera-penalty-calculator");
        return;
      }
      setInput(JSON.parse(raw) as ReraPenaltyInput);
    } catch {
      router.replace("/tools/rera-penalty-calculator");
    }
  }, [router]);

  async function runCalc(leadId: string) {
    if (!input) return;
    setLoading(true);
    try {
      const res = await fetch("/api/tools/rera-penalty-calculator/calculate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...input, leadId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Calculation failed");
      setOutput(data as ReraPenaltyOutput);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not calculate");
    } finally {
      setLoading(false);
    }
  }

  const fmt = (n: number) => `₹${n.toLocaleString("en-IN")}`;

  return (
    <ToolLayout
      eyebrow="Result"
      title="RERA Penalty Estimate"
      subtitle="Indicative exposure under the Real Estate (Regulation and Development) Act, 2016."
    >
      {!unlocked ? (
        <EmailGate
          icp="RE_DEVELOPER"
          sourceDetail="rera-penalty-calculator"
          onUnlocked={(id) => {
            setUnlocked(true);
            runCalc(id);
          }}
        />
      ) : loading ? (
        <div className="flex items-center gap-2 py-16 text-sm text-slate-500">
          <Loader2 size={16} className="animate-spin" /> Computing penalty…
        </div>
      ) : output && input ? (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gavel size={18} className="text-blue-700" />
                {output.applicableSection}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-6 rounded-xl border border-red-100 bg-gradient-to-br from-red-50 to-white p-4">
                <p className="text-xs font-semibold tracking-wider text-red-700 uppercase">
                  Total estimated penalty
                </p>
                <p className="font-heading mt-1 text-3xl font-bold text-red-900 sm:text-4xl">
                  {fmt(output.totalPenaltyInr)}
                </p>
                <p className="mt-1 text-xs text-slate-600">
                  on a project cost of {fmt(input.projectCostInr)} and{" "}
                  {input.durationMonths} month(s) / {input.numberOfViolations}{" "}
                  instance(s).
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <Stat label="Base penalty" value={fmt(output.basePenaltyInr)} />
                <Stat
                  label="Per-unit (month / instance / day)"
                  value={fmt(output.perDayOrPerInstancePenaltyInr)}
                />
              </div>

              <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-3">
                <div className="flex items-center gap-2 text-sm font-semibold text-amber-900">
                  <AlertTriangle size={14} /> Imprisonment risk
                </div>
                <p className="mt-1 text-xs leading-relaxed text-amber-900">
                  {output.imprisonmentRisk}
                </p>
              </div>

              <ul className="mt-4 space-y-2 text-xs text-slate-600">
                {output.bullets.map((b, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="mt-1 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-blue-600" />
                    {b}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb size={18} className="text-emerald-600" />
                Mitigation recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="list-decimal space-y-2 pl-5 text-sm text-slate-700">
                {output.mitigations.map((m, i) => (
                  <li key={i}>{m}</li>
                ))}
              </ol>

              <p className="mt-4 rounded-lg bg-amber-50 p-3 text-xs text-amber-900">
                <strong>Disclaimer: </strong>
                {output.disclaimer}
              </p>
            </CardContent>
          </Card>

          <PremiumUpsell
            title="Custom compliance remediation plan"
            description="A RERA-qualified advocate prepares a project-specific remediation plan, filing templates and a 30-60-90-day milestone roadmap."
            priceInr={2999}
            ctaLabel="Upgrade for ₹2,999"
            bullets={[
              "Project-specific remediation plan",
              "Form templates (Form A, quarterly, deviation notice)",
              "30-60-90-day milestone roadmap",
              "1 × 45-min strategy call",
            ]}
          />
        </div>
      ) : null}
    </ToolLayout>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
      <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
        {label}
      </p>
      <p className="font-heading mt-1 text-lg font-bold text-slate-900">
        {value}
      </p>
    </div>
  );
}
