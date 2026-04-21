"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, Loader2, AlertTriangle, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

import { ToolLayout } from "@/components/tools/tool-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmailGate } from "@/components/tools/email-gate";
import { PremiumUpsell } from "@/components/tools/premium-upsell";
import type { ReraComplianceInput, ReraComplianceOutput } from "@/lib/tools/types";

export default function ReraComplianceResultPage() {
  const router = useRouter();
  const [input, setInput] = useState<ReraComplianceInput | null>(null);
  const [output, setOutput] = useState<ReraComplianceOutput | null>(null);
  const [loading, setLoading] = useState(false);
  const [unlocked, setUnlocked] = useState(false);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("tool:rera-compliance:input");
      if (!raw) {
        router.replace("/tools/rera-compliance-checker");
        return;
      }
      setInput(JSON.parse(raw) as ReraComplianceInput);
    } catch {
      router.replace("/tools/rera-compliance-checker");
    }
  }, [router]);

  async function runCheck(leadId: string) {
    if (!input) return;
    setLoading(true);
    try {
      const res = await fetch("/api/tools/rera-compliance-checker/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...input, leadId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Check failed");
      setOutput(data as ReraComplianceOutput);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not run check");
    } finally {
      setLoading(false);
    }
  }

  return (
    <ToolLayout
      eyebrow="Result"
      title="RERA Compliance Scorecard"
      subtitle={
        unlocked
          ? "Review each item and map the remediation to the relevant RERA section."
          : "Enter your email to unlock the scorecard."
      }
    >
      {!unlocked ? (
        <EmailGate
          icp="RE_DEVELOPER"
          sourceDetail="rera-compliance-checker"
          onUnlocked={(id) => {
            setUnlocked(true);
            runCheck(id);
          }}
        />
      ) : loading ? (
        <div className="flex items-center gap-2 py-16 text-sm text-slate-500">
          <Loader2 size={16} className="animate-spin" /> Scoring the project…
        </div>
      ) : output ? (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShieldCheck size={18} className="text-blue-700" /> Score
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-3">
                <Stat
                  label="Compliance score"
                  value={`${output.score}/100`}
                  accent="blue"
                />
                <Stat label="Status" value={output.status} accent="emerald" />
                <Stat
                  label="Penalty exposure"
                  value={`₹${output.penaltyExposureInr.low.toLocaleString(
                    "en-IN"
                  )} – ₹${output.penaltyExposureInr.high.toLocaleString("en-IN")}`}
                  accent="amber"
                />
              </div>
              <ul className="mt-5 space-y-2 text-xs text-slate-600">
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
                <AlertTriangle size={18} className="text-amber-600" />
                Findings ({output.findings.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {output.findings.length === 0 ? (
                <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
                  <CheckCircle2 size={16} /> No major gaps detected against our
                  checklist.
                </div>
              ) : (
                <ul className="space-y-3">
                  {output.findings.map((f, i) => (
                    <li
                      key={i}
                      className={`rounded-lg border p-3 ${severityClass(
                        f.severity
                      )}`}
                    >
                      <div className="flex items-center gap-2">
                        <AlertTriangle
                          size={14}
                          className={severityIcon(f.severity)}
                        />
                        <span className="font-medium">{f.item}</span>
                        <span className="ml-auto text-[10px] font-semibold uppercase tracking-wider">
                          {f.severity}
                        </span>
                      </div>
                      <p className="mt-1 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                        {f.section}
                      </p>
                      <p className="mt-2 text-xs leading-relaxed text-slate-700">
                        {f.remediation}
                      </p>
                    </li>
                  ))}
                </ul>
              )}

              <p className="mt-4 rounded-lg bg-amber-50 p-3 text-xs text-amber-900">
                <strong>Disclaimer: </strong>
                {output.disclaimer}
              </p>
            </CardContent>
          </Card>

          <PremiumUpsell
            title="Full RERA audit + filing support"
            description="RERA-qualified advocate reviews your project, prepares Form A / quarterly updates, and files at the State RERA portal on your behalf."
            priceInr={9999}
            ctaLabel="Upgrade for ₹9,999"
            bullets={[
              "RERA-qualified advocate review",
              "Form A + quarterly update prep and filing",
              "Escrow compliance memo (CA + engineer + architect)",
              "30-day free support post-filing",
            ]}
          />
        </div>
      ) : null}
    </ToolLayout>
  );
}

function Stat({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent: "blue" | "emerald" | "amber";
}) {
  const palette =
    accent === "blue"
      ? "from-blue-50 to-white border-blue-100 text-blue-900"
      : accent === "emerald"
      ? "from-emerald-50 to-white border-emerald-100 text-emerald-900"
      : "from-amber-50 to-white border-amber-100 text-amber-900";
  return (
    <div
      className={`rounded-xl border bg-gradient-to-br p-4 ${palette}`}
    >
      <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
        {label}
      </p>
      <p className="font-heading mt-1 text-2xl font-bold">{value}</p>
    </div>
  );
}

function severityClass(s: "critical" | "high" | "medium" | "low") {
  if (s === "critical") return "border-red-200 bg-red-50";
  if (s === "high") return "border-orange-200 bg-orange-50";
  if (s === "medium") return "border-amber-200 bg-amber-50";
  return "border-blue-200 bg-blue-50";
}
function severityIcon(s: "critical" | "high" | "medium" | "low") {
  if (s === "critical") return "text-red-600";
  if (s === "high") return "text-orange-600";
  if (s === "medium") return "text-amber-600";
  return "text-blue-600";
}
