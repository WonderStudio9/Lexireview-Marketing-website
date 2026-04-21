"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  AlertTriangle,
  BadgeIndianRupee,
  CheckCircle2,
  Info,
  Loader2,
  MessageCircleQuestion,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";

import { ToolLayout } from "@/components/tools/tool-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmailGate } from "@/components/tools/email-gate";
import { PremiumUpsell } from "@/components/tools/premium-upsell";
import type { SalaryStructureAnalysis } from "@/lib/tools/types";

export default function SalaryAnalyzerResultPage() {
  const router = useRouter();
  const [salaryText, setSalaryText] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<SalaryStructureAnalysis | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [unlocked, setUnlocked] = useState(false);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("tool:salary-structure:input");
      if (!raw) {
        router.replace("/tools/salary-structure-analyzer");
        return;
      }
      const parsed = JSON.parse(raw) as { salaryText: string };
      setSalaryText(parsed.salaryText);
    } catch {
      router.replace("/tools/salary-structure-analyzer");
    }
  }, [router]);

  async function runAnalyze(leadId: string) {
    if (!salaryText) return;
    setLoading(true);
    try {
      const res = await fetch("/api/tools/salary-structure-analyzer/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ salaryText, leadId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Analysis failed");
      setAnalysis(data.analysis as SalaryStructureAnalysis);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not analyse");
    } finally {
      setLoading(false);
    }
  }

  function handleUnlocked(id: string) {
    setUnlocked(true);
    runAnalyze(id);
  }

  const sevClass = (s: string) =>
    s === "high"
      ? "border-red-200 bg-red-50 text-red-900"
      : s === "medium"
      ? "border-amber-200 bg-amber-50 text-amber-900"
      : "border-emerald-200 bg-emerald-50 text-emerald-900";

  return (
    <ToolLayout
      eyebrow="Result"
      title="Salary structure — AI analysis"
      subtitle={
        unlocked
          ? "Tax optimisations, HRA / LTA / NPS levers, red flags."
          : "Enter your email to unlock the analysis."
      }
    >
      {!unlocked ? (
        <EmailGate
          icp="EMPLOYEE"
          sourceDetail="salary-structure-analyzer"
          onUnlocked={(id) => handleUnlocked(id)}
        />
      ) : loading ? (
        <Card>
          <CardContent className="flex items-center gap-2 py-12 text-sm text-slate-500">
            <Loader2 size={16} className="animate-spin" />
            Analysing your salary structure with AI…
          </CardContent>
        </Card>
      ) : analysis ? (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles size={18} className="text-blue-700" />
                Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-700">{analysis.summary}</p>
              {analysis.inHandEstimate ? (
                <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                  <div className="text-xs font-semibold uppercase tracking-wider text-emerald-800">
                    Estimated monthly in-hand
                  </div>
                  <div className="font-heading mt-1 text-2xl font-bold text-emerald-900">
                    {analysis.inHandEstimate}
                  </div>
                </div>
              ) : null}
            </CardContent>
          </Card>

          {analysis.currentBreakdown?.length ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BadgeIndianRupee size={18} className="text-blue-700" />
                  Current breakdown
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-slate-700">
                  {analysis.currentBreakdown.map((b, i) => (
                    <li key={i} className="flex justify-between gap-3 border-b border-slate-100 py-2">
                      <span className="font-medium">{b.label}</span>
                      <span className="text-slate-600">{b.amount}{b.notes ? ` — ${b.notes}` : ""}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ) : null}

          {analysis.taxOptimizations?.length ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle2 size={18} className="text-emerald-600" />
                  Tax optimisations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm text-slate-700">
                  {analysis.taxOptimizations.map((o, i) => (
                    <li
                      key={i}
                      className="rounded-lg border border-emerald-200 bg-emerald-50 p-3"
                    >
                      <div className="font-semibold text-emerald-900">
                        {o.title}
                        {o.monthlySavingInr
                          ? ` — save ${o.monthlySavingInr}/mo`
                          : ""}
                      </div>
                      <div className="mt-1 text-emerald-800">{o.detail}</div>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ) : null}

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info size={18} className="text-blue-700" />
                Section-wise levers
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-slate-700">
              <p><span className="font-semibold">HRA:</span> {analysis.hraOptimization}</p>
              <p><span className="font-semibold">LTA:</span> {analysis.ltaOptimization}</p>
              <p><span className="font-semibold">NPS 80CCD(2):</span> {analysis.nps80ccd2}</p>
            </CardContent>
          </Card>

          {analysis.restructureSuggestion?.length ? (
            <Card>
              <CardHeader>
                <CardTitle>Restructure suggestion</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-slate-700">
                  {analysis.restructureSuggestion.map((s, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="mt-1 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-blue-600" />
                      {s}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ) : null}

          {analysis.redFlags?.length ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle size={18} className="text-amber-600" />
                  Red flags
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  {analysis.redFlags.map((r, i) => (
                    <li key={i} className={`rounded-lg border p-3 ${sevClass(r.severity)}`}>
                      <div className="font-semibold">{r.title}</div>
                      <div className="mt-0.5 text-xs opacity-80">{r.detail}</div>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ) : null}

          {analysis.questionsForHr?.length ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircleQuestion size={18} className="text-blue-700" />
                  Questions for HR
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-slate-700">
                  {analysis.questionsForHr.map((q, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="mt-1 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-blue-600" />
                      {q}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ) : null}

          <PremiumUpsell
            title="Personalized tax planning report"
            description="A comprehensive, personalised tax-planning report — old-vs-new regime projection, deduction checklist, and advance-tax schedule."
            priceInr={499}
            ctaLabel="Upgrade for ₹499"
            bullets={[
              "Old vs new regime comparison on your exact numbers",
              "Advance-tax installment calendar",
              "80C / 80D / 80CCD optimisation stack",
              "PDF report for your CA",
            ]}
          />
        </div>
      ) : null}
    </ToolLayout>
  );
}
