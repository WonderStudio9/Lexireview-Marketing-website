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
import type { OfferLetterAnalysis } from "@/lib/tools/types";

export default function OfferLetterResultPage() {
  const router = useRouter();
  const [offerText, setOfferText] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<OfferLetterAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [unlocked, setUnlocked] = useState(false);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("tool:offer-letter:input");
      if (!raw) {
        router.replace("/tools/offer-letter-decoder");
        return;
      }
      const parsed = JSON.parse(raw) as { offerText: string };
      setOfferText(parsed.offerText);
    } catch {
      router.replace("/tools/offer-letter-decoder");
    }
  }, [router]);

  async function runAnalyze(leadId: string) {
    if (!offerText) return;
    setLoading(true);
    try {
      const res = await fetch("/api/tools/offer-letter-decoder/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ offerText, leadId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Analysis failed");
      setAnalysis(data.analysis as OfferLetterAnalysis);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not analyze");
    } finally {
      setLoading(false);
    }
  }

  function handleUnlocked(leadId: string) {
    setUnlocked(true);
    runAnalyze(leadId);
  }

  return (
    <ToolLayout
      eyebrow="Result"
      title="Offer Letter Analysis"
      subtitle="Here's what the fine print actually says — and what to push back on."
    >
      {!unlocked ? (
        <EmailGate
          icp="EMPLOYEE"
          sourceDetail="offer-letter-decoder"
          headline="Unlock your free offer letter analysis"
          subcopy="Email-gated so we can send you a copy + negotiation playbook."
          onUnlocked={(id) => handleUnlocked(id)}
        />
      ) : loading ? (
        <div className="flex items-center gap-2 py-16 text-sm text-slate-500">
          <Loader2 size={16} className="animate-spin" /> Analyzing your offer with Claude…
        </div>
      ) : analysis ? (
        <div className="space-y-6">
          {/* Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles size={18} className="text-blue-700" />
                Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed text-slate-700">
                {analysis.summary}
              </p>
            </CardContent>
          </Card>

          {/* Compensation */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BadgeIndianRupee size={18} className="text-blue-700" />
                Compensation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4 grid gap-3 sm:grid-cols-2">
                <Stat
                  label="CTC"
                  value={analysis.compensation.ctc ?? "Not specified"}
                />
                <Stat
                  label="Estimated in-hand (monthly)"
                  value={analysis.compensation.inHandEstimate ?? "—"}
                />
              </div>

              {analysis.compensation.breakdown?.length ? (
                <div className="overflow-hidden rounded-lg border border-slate-200">
                  <table className="min-w-full text-sm">
                    <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
                      <tr>
                        <th className="px-3 py-2 text-left">Component</th>
                        <th className="px-3 py-2 text-left">Amount</th>
                        <th className="px-3 py-2 text-left">Notes</th>
                      </tr>
                    </thead>
                    <tbody>
                      {analysis.compensation.breakdown.map((b, i) => (
                        <tr key={i} className="border-t border-slate-100">
                          <td className="px-3 py-2 font-medium text-slate-800">
                            {b.label}
                          </td>
                          <td className="px-3 py-2 text-slate-700">{b.amount}</td>
                          <td className="px-3 py-2 text-xs text-slate-500">
                            {b.notes ?? "—"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : null}
            </CardContent>
          </Card>

          {/* Red flags */}
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

          {/* Standard vs non-standard */}
          <div className="grid gap-4 sm:grid-cols-2">
            {analysis.standardClauses?.length ? (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle2 size={18} className="text-emerald-600" />
                    Standard clauses
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-slate-700">
                    {analysis.standardClauses.map((c, i) => (
                      <li key={i} className="flex gap-2">
                        <span className="mt-1 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                        {c}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ) : null}
            {analysis.nonStandardClauses?.length ? (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Info size={18} className="text-amber-600" />
                    Non-standard clauses
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-slate-700">
                    {analysis.nonStandardClauses.map((c, i) => (
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

          {/* Negotiation tips */}
          {analysis.negotiationTips?.length ? (
            <Card>
              <CardHeader>
                <CardTitle>Negotiation tips</CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="list-decimal space-y-2 pl-5 text-sm text-slate-700">
                  {analysis.negotiationTips.map((t, i) => (
                    <li key={i}>{t}</li>
                  ))}
                </ol>
              </CardContent>
            </Card>
          ) : null}

          {/* Questions for HR */}
          {analysis.questionsForHr?.length ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircleQuestion size={18} className="text-blue-700" />
                  Questions to ask HR
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-slate-700">
                  {analysis.questionsForHr.map((q, i) => (
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
            title="Lawyer-written negotiation email template"
            description="A polished, ready-to-send email you can forward to HR with proposed redlines based on this exact offer."
            priceInr={299}
            ctaLabel="Get template for ₹299"
            bullets={[
              "Personalized to the exact red flags above",
              "Polite but firm tone, no burning bridges",
              "Fallback clauses if HR says no",
              "Delivered to your inbox in minutes",
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
