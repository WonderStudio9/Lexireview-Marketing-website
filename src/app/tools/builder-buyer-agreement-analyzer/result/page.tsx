"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  AlertTriangle,
  CheckCircle2,
  FileSearch,
  Info,
  Loader2,
  MessageCircleQuestion,
  ShieldAlert,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";

import { ToolLayout } from "@/components/tools/tool-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmailGate } from "@/components/tools/email-gate";
import { PremiumUpsell } from "@/components/tools/premium-upsell";
import type { BuilderBuyerAnalysis } from "@/lib/tools/types";

export default function BuilderBuyerAnalyzerResultPage() {
  const router = useRouter();
  const [agreementText, setAgreementText] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<BuilderBuyerAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [unlocked, setUnlocked] = useState(false);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("tool:builder-buyer-analyzer:input");
      if (!raw) {
        router.replace("/tools/builder-buyer-agreement-analyzer");
        return;
      }
      const parsed = JSON.parse(raw) as { agreementText: string };
      setAgreementText(parsed.agreementText);
    } catch {
      router.replace("/tools/builder-buyer-agreement-analyzer");
    }
  }, [router]);

  async function runAnalyze(leadId: string) {
    if (!agreementText) return;
    setLoading(true);
    try {
      const res = await fetch(
        "/api/tools/builder-buyer-agreement-analyzer/analyze",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ agreementText, leadId }),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Analysis failed");
      setAnalysis(data.analysis as BuilderBuyerAnalysis);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not analyze");
    } finally {
      setLoading(false);
    }
  }

  return (
    <ToolLayout
      eyebrow="Result"
      title="Builder-Buyer Agreement Analysis"
      subtitle="RERA Section-by-Section review, red flags, and recommendations."
    >
      {!unlocked ? (
        <EmailGate
          icp="RE_DEVELOPER"
          sourceDetail="builder-buyer-agreement-analyzer"
          headline="Unlock your free agreement analysis"
          onUnlocked={(id) => {
            setUnlocked(true);
            runAnalyze(id);
          }}
        />
      ) : loading ? (
        <div className="flex items-center gap-2 py-16 text-sm text-slate-500">
          <Loader2 size={16} className="animate-spin" /> Analyzing with Claude…
        </div>
      ) : analysis ? (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles size={18} className="text-blue-700" /> Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed text-slate-700">
                {analysis.summary}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileSearch size={18} className="text-blue-700" /> RERA Sectional
                Compliance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 sm:grid-cols-2">
                <SectionCompliance
                  label="§ 18 — Delay penalty / possession"
                  status={analysis.section18Compliance.status}
                  detail={analysis.section18Compliance.detail}
                />
                <SectionCompliance
                  label="§ 13 — Advance booking (≤10% before ATS)"
                  status={analysis.section13Compliance.status}
                  detail={analysis.section13Compliance.detail}
                />
                <SectionCompliance
                  label="§ 14 — Carpet area & adherence to plan"
                  status={analysis.section14Compliance.status}
                  detail={analysis.section14Compliance.detail}
                />
                <SectionCompliance
                  label="§ 19 — Allottee rights / tripartite"
                  status={analysis.section19Compliance.status}
                  detail={analysis.section19Compliance.detail}
                />
              </div>
            </CardContent>
          </Card>

          {analysis.clausesIdentified?.length ? (
            <Card>
              <CardHeader>
                <CardTitle>Clauses identified</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-hidden rounded-lg border border-slate-200">
                  <table className="min-w-full text-sm">
                    <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
                      <tr>
                        <th className="px-3 py-2 text-left">Clause</th>
                        <th className="px-3 py-2 text-left">Found</th>
                        <th className="px-3 py-2 text-left">Notes</th>
                      </tr>
                    </thead>
                    <tbody>
                      {analysis.clausesIdentified.map((c, i) => (
                        <tr key={i} className="border-t border-slate-100">
                          <td className="px-3 py-2 font-medium text-slate-800">
                            {c.label}
                          </td>
                          <td className="px-3 py-2">
                            {c.found ? (
                              <span className="inline-flex items-center gap-1 text-emerald-700">
                                <CheckCircle2 size={14} /> Yes
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-red-700">
                                <AlertTriangle size={14} /> Missing
                              </span>
                            )}
                          </td>
                          <td className="px-3 py-2 text-xs text-slate-500">
                            {c.notes ?? "—"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          ) : null}

          {analysis.redFlags?.length ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShieldAlert size={18} className="text-red-600" />
                  Red flags ({analysis.redFlags.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {analysis.redFlags.map((r, i) => (
                    <li
                      key={i}
                      className={`rounded-lg border p-3 ${severityClass(
                        r.severity
                      )}`}
                    >
                      <div className="flex items-center gap-2">
                        <AlertTriangle
                          size={14}
                          className={severityIcon(r.severity)}
                        />
                        <span className="font-medium">{r.title}</span>
                        <span className="ml-auto text-[10px] font-semibold uppercase tracking-wider">
                          {r.severity}
                        </span>
                      </div>
                      <p className="mt-1 text-xs leading-relaxed text-slate-700">
                        {r.detail}
                      </p>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ) : null}

          <div className="grid gap-4 sm:grid-cols-2">
            {analysis.marketStandard?.length ? (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle2 size={18} className="text-emerald-600" />
                    Market standard
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-slate-700">
                    {analysis.marketStandard.map((c, i) => (
                      <li key={i} className="flex gap-2">
                        <span className="mt-1 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                        {c}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ) : null}
            {analysis.nonStandard?.length ? (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Info size={18} className="text-amber-600" /> Non-standard
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-slate-700">
                    {analysis.nonStandard.map((c, i) => (
                      <li key={i} className="flex gap-2">
                        <span className="mt-1 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
                        {c}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ) : null}
          </div>

          {analysis.recommendations?.length ? (
            <Card>
              <CardHeader>
                <CardTitle>Recommendations</CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="list-decimal space-y-2 pl-5 text-sm text-slate-700">
                  {analysis.recommendations.map((t, i) => (
                    <li key={i}>{t}</li>
                  ))}
                </ol>
              </CardContent>
            </Card>
          ) : null}

          {analysis.questionsForDeveloper?.length ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircleQuestion size={18} className="text-blue-700" />
                  Questions to ask the developer
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-slate-700">
                  {analysis.questionsForDeveloper.map((q, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="mt-0.5 text-slate-400">Q{i + 1}.</span>
                      <span>{q}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ) : null}

          <PremiumUpsell
            title="Lawyer redline + MahaRERA / HRERA-specific fixes"
            description="A senior real-estate lawyer redlines the agreement with fallback clauses and state-specific RERA fixes (MahaRERA / HRERA / TNRERA)."
            priceInr={4999}
            ctaLabel="Upgrade for ₹4,999"
            bullets={[
              "Senior real-estate lawyer redline",
              "State-specific RERA rules applied",
              "Fallback language for each red flag",
              "1 × 30-min strategy call",
            ]}
          />
        </div>
      ) : (
        <p className="text-sm text-slate-500">No analysis yet.</p>
      )}
    </ToolLayout>
  );
}

function SectionCompliance({
  label,
  status,
  detail,
}: {
  label: string;
  status: string;
  detail: string;
}) {
  const statusColor = /non|violat|missing|fail/i.test(status)
    ? "border-red-200 bg-red-50 text-red-900"
    : /partial|risk|unclear/i.test(status)
    ? "border-amber-200 bg-amber-50 text-amber-900"
    : "border-emerald-200 bg-emerald-50 text-emerald-900";
  return (
    <div className={`rounded-lg border p-3 ${statusColor}`}>
      <p className="text-[11px] font-semibold uppercase tracking-wider">
        {label}
      </p>
      <p className="font-heading mt-1 text-base font-semibold">{status}</p>
      <p className="mt-1 text-xs leading-relaxed text-slate-700">{detail}</p>
    </div>
  );
}

function severityClass(s: "high" | "medium" | "low") {
  if (s === "high") return "border-red-200 bg-red-50";
  if (s === "medium") return "border-amber-200 bg-amber-50";
  return "border-blue-200 bg-blue-50";
}

function severityIcon(s: "high" | "medium" | "low") {
  if (s === "high") return "text-red-600";
  if (s === "medium") return "text-amber-600";
  return "text-blue-600";
}
