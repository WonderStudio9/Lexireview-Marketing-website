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
  ShieldAlert,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";

import { ToolLayout } from "@/components/tools/tool-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmailGate } from "@/components/tools/email-gate";
import { PremiumUpsell } from "@/components/tools/premium-upsell";
import type { TermSheetAnalysis } from "@/lib/tools/types";

export default function TermSheetResultPage() {
  const router = useRouter();
  const [termSheetText, setTermSheetText] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<TermSheetAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [unlocked, setUnlocked] = useState(false);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("tool:term-sheet:input");
      if (!raw) {
        router.replace("/tools/term-sheet-decoder");
        return;
      }
      const parsed = JSON.parse(raw) as { termSheetText: string };
      setTermSheetText(parsed.termSheetText);
    } catch {
      router.replace("/tools/term-sheet-decoder");
    }
  }, [router]);

  async function runAnalyze(leadId: string) {
    if (!termSheetText) return;
    setLoading(true);
    try {
      const res = await fetch("/api/tools/term-sheet-decoder/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ termSheetText, leadId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Analysis failed");
      setAnalysis(data.analysis as TermSheetAnalysis);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not analyze");
    } finally {
      setLoading(false);
    }
  }

  return (
    <ToolLayout
      eyebrow="Result"
      title="Term Sheet Analysis"
      subtitle="Decoded. Here&apos;s what the term sheet actually does — and where you have room to push back."
    >
      {!unlocked ? (
        <EmailGate
          icp="STARTUP_FOUNDER"
          sourceDetail="term-sheet-decoder"
          headline="Unlock your free term sheet analysis"
          onUnlocked={(id) => {
            setUnlocked(true);
            runAnalyze(id);
          }}
        />
      ) : loading ? (
        <div className="flex items-center gap-2 py-16 text-sm text-slate-500">
          <Loader2 size={16} className="animate-spin" /> Analyzing the term sheet
          with Claude…
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
                <BadgeIndianRupee size={18} className="text-blue-700" /> Valuation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 sm:grid-cols-3">
                <Stat
                  label="Pre-money"
                  value={analysis.valuation.preMoney ?? "—"}
                />
                <Stat
                  label="Post-money"
                  value={analysis.valuation.postMoney ?? "—"}
                />
                <Stat
                  label="Round size"
                  value={analysis.valuation.roundSize ?? "—"}
                />
              </div>
              {analysis.valuation.investors?.length ? (
                <p className="mt-4 text-sm text-slate-600">
                  <span className="font-semibold">Investors:</span>{" "}
                  {analysis.valuation.investors.join(", ")}
                </p>
              ) : null}
            </CardContent>
          </Card>

          {analysis.keyTerms?.length ? (
            <Card>
              <CardHeader>
                <CardTitle>Key terms</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-hidden rounded-lg border border-slate-200">
                  <table className="min-w-full text-sm">
                    <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
                      <tr>
                        <th className="px-3 py-2 text-left">Term</th>
                        <th className="px-3 py-2 text-left">Value</th>
                        <th className="px-3 py-2 text-left">Notes</th>
                      </tr>
                    </thead>
                    <tbody>
                      {analysis.keyTerms.map((t, i) => (
                        <tr key={i} className="border-t border-slate-100">
                          <td className="px-3 py-2 font-medium text-slate-800">
                            {t.label}
                          </td>
                          <td className="px-3 py-2 text-slate-700">{t.value}</td>
                          <td className="px-3 py-2 text-xs text-slate-500">
                            {t.notes ?? "—"}
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
                  <ShieldAlert size={18} className="text-red-600" /> Red flags (
                  {analysis.redFlags.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {analysis.redFlags.map((r, i) => (
                    <li
                      key={i}
                      className={`rounded-lg border p-3 ${severityClass(r.severity)}`}
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
                    Market-standard
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

          {analysis.negotiationLevers?.length ? (
            <Card>
              <CardHeader>
                <CardTitle>Negotiation levers</CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="list-decimal space-y-2 pl-5 text-sm text-slate-700">
                  {analysis.negotiationLevers.map((t, i) => (
                    <li key={i}>{t}</li>
                  ))}
                </ol>
              </CardContent>
            </Card>
          ) : null}

          {analysis.questionsForInvestor?.length ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircleQuestion size={18} className="text-blue-700" />
                  Questions to ask the investor
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-slate-700">
                  {analysis.questionsForInvestor.map((q, i) => (
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
            title="Lawyer-reviewed term sheet redline with 500+ case references"
            description="Senior VC lawyer reviews the term sheet, provides a redline document with fallback clauses and citations to Indian case law and market precedents."
            priceInr={999}
            ctaLabel="Upgrade for ₹999"
            bullets={[
              "Senior VC lawyer redline (24h turnaround)",
              "500+ Indian and US case precedents referenced",
              "Fallback clauses for each red flag",
              "1 x 30-min strategy call included",
            ]}
          />
        </div>
      ) : (
        <p className="text-sm text-slate-500">No analysis yet.</p>
      )}
    </ToolLayout>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
      <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
        {label}
      </p>
      <p className="font-heading mt-1 text-xl font-bold text-slate-900">
        {value}
      </p>
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
