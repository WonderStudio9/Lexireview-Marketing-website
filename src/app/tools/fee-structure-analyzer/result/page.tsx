"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { TrendingUp, Loader2, Target, LightbulbIcon } from "lucide-react";
import { toast } from "sonner";

import { ToolLayout } from "@/components/tools/tool-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmailGate } from "@/components/tools/email-gate";
import { PremiumUpsell } from "@/components/tools/premium-upsell";
import type { FeeAnalyzerInput, FeeAnalyzerOutput } from "@/lib/tools/types";

export default function FeeAnalyzerResultPage() {
  const router = useRouter();
  const [input, setInput] = useState<FeeAnalyzerInput | null>(null);
  const [result, setResult] = useState<FeeAnalyzerOutput | null>(null);
  const [loading, setLoading] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const [leadId, setLeadId] = useState<string>("");

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("tool:fee-analyzer:input");
      if (!raw) {
        router.replace("/tools/fee-structure-analyzer");
        return;
      }
      setInput(JSON.parse(raw) as FeeAnalyzerInput);
    } catch {
      router.replace("/tools/fee-structure-analyzer");
    }
  }, [router]);

  async function runAnalyze(leadIdForPersist: string) {
    if (!input) return;
    setLoading(true);
    try {
      const res = await fetch(
        "/api/tools/fee-structure-analyzer/analyze",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...input, leadId: leadIdForPersist }),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Analysis failed");
      setResult(data as FeeAnalyzerOutput);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Could not analyze fees"
      );
    } finally {
      setLoading(false);
    }
  }

  function handleUnlocked(id: string) {
    setLeadId(id);
    setUnlocked(true);
    runAnalyze(id);
  }

  const currentRate = input?.currentHourlyRate ?? 0;
  const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;

  return (
    <ToolLayout
      eyebrow="Result"
      title="Your Fee Benchmark Report"
      subtitle={
        unlocked
          ? "Here's where you stand against peers in your segment."
          : "Enter your email to see your benchmark report."
      }
    >
      {!unlocked ? (
        <EmailGate
          icp="SOLO_LAWYER"
          sourceDetail="fee-structure-analyzer"
          onUnlocked={(id) => handleUnlocked(id)}
        />
      ) : (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp size={18} className="text-emerald-600" />
                Benchmark
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center gap-2 py-12 text-sm text-slate-500">
                  <Loader2 size={16} className="animate-spin" />
                  Crunching the numbers…
                </div>
              ) : result ? (
                <>
                  <div className="mb-6 rounded-lg border border-blue-100 bg-blue-50/60 p-4">
                    <p className="text-xs font-semibold tracking-wide text-blue-800 uppercase">
                      Segment
                    </p>
                    <p className="text-sm text-slate-700">
                      {result.metadata.segment}
                    </p>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-3">
                    <QuartileCard
                      label="Peer p25"
                      value={inr(result.benchmark.p25)}
                      accent="slate"
                    />
                    <QuartileCard
                      label="Peer median (p50)"
                      value={inr(result.benchmark.p50)}
                      accent="blue"
                    />
                    <QuartileCard
                      label="Peer p75"
                      value={inr(result.benchmark.p75)}
                      accent="emerald"
                    />
                  </div>

                  <div className="mt-6 rounded-lg border border-slate-200 bg-white p-5">
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-700">
                        <Target size={18} />
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-medium text-slate-900">
                          You are charging{" "}
                          <span className="font-semibold text-blue-700">
                            {inr(currentRate)}/hr
                          </span>{" "}
                          — position:{" "}
                          <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-800">
                            {result.yourPosition}
                          </span>
                        </div>
                        <div className="mt-3">
                          <RateBar
                            current={currentRate}
                            p25={result.benchmark.p25}
                            p50={result.benchmark.p50}
                            p75={result.benchmark.p75}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 grid gap-4 sm:grid-cols-3">
                    <PotentialCard
                      label="Conservative"
                      value={inr(result.annualPotential.conservative)}
                      sub="1,600 billable hrs @ p25"
                    />
                    <PotentialCard
                      label="Median"
                      value={inr(result.annualPotential.median)}
                      sub="1,800 billable hrs @ p50"
                      highlight
                    />
                    <PotentialCard
                      label="Aggressive"
                      value={inr(result.annualPotential.aggressive)}
                      sub="2,100 billable hrs @ p75"
                    />
                  </div>

                  <div className="mt-6 rounded-lg border border-amber-200 bg-amber-50 p-4">
                    <div className="flex items-start gap-3">
                      <LightbulbIcon
                        size={18}
                        className="mt-0.5 shrink-0 text-amber-600"
                      />
                      <div className="flex-1">
                        <h4 className="text-sm font-semibold text-amber-900">
                          Recommendations
                        </h4>
                        <ul className="mt-2 space-y-2 text-sm text-amber-900">
                          {result.recommendations.map((r, i) => (
                            <li key={i} className="flex gap-2">
                              <span className="mt-1.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
                              <span>{r}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  <p className="mt-6 rounded-lg bg-slate-50 p-4 text-[12px] leading-relaxed text-slate-500">
                    <span className="font-semibold text-slate-700">
                      Disclaimer:
                    </span>{" "}
                    {result.disclaimer}
                  </p>
                </>
              ) : (
                <p className="text-sm text-slate-500">No output yet.</p>
              )}
            </CardContent>
          </Card>

          <PremiumUpsell
            title="Custom benchmark report — 500+ data points, 12 practice areas"
            description="Get a detailed PDF report with full quartile curves, overtime adjustments, client-mix analysis and a 30-min 1-on-1 with a pricing advisor."
            priceInr={999}
            ctaLabel="Upgrade for ₹999"
            bullets={[
              "500+ data points across 12 practice areas",
              "Client-mix & realisation analysis",
              "30-minute 1-on-1 with pricing advisor",
              "Quarterly refresh for 1 year",
            ]}
          />

          {leadId ? (
            <p className="mt-4 text-[11px] text-slate-400">
              Lead ref: {leadId.slice(0, 8)}…
            </p>
          ) : null}
        </>
      )}
    </ToolLayout>
  );
}

function QuartileCard({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent: "slate" | "blue" | "emerald";
}) {
  const classes =
    accent === "blue"
      ? "border-blue-300 bg-blue-50 text-blue-900"
      : accent === "emerald"
        ? "border-emerald-300 bg-emerald-50 text-emerald-900"
        : "border-slate-200 bg-white text-slate-900";
  return (
    <div className={`rounded-lg border p-4 ${classes}`}>
      <div className="text-[11px] font-semibold tracking-wide uppercase opacity-75">
        {label}
      </div>
      <div className="font-heading mt-1 text-xl font-bold">{value}</div>
      <div className="text-[11px] opacity-70">per hour</div>
    </div>
  );
}

function PotentialCard({
  label,
  value,
  sub,
  highlight,
}: {
  label: string;
  value: string;
  sub: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-lg border p-4 ${
        highlight
          ? "border-blue-300 bg-gradient-to-br from-blue-50 to-white"
          : "border-slate-200 bg-white"
      }`}
    >
      <div className="text-[11px] font-semibold tracking-wide text-slate-600 uppercase">
        {label}
      </div>
      <div className="font-heading mt-1 text-lg font-bold text-slate-900">
        {value}
      </div>
      <div className="text-[11px] text-slate-500">{sub}</div>
    </div>
  );
}

function RateBar({
  current,
  p25,
  p50,
  p75,
}: {
  current: number;
  p25: number;
  p50: number;
  p75: number;
}) {
  const max = Math.max(p75 * 1.2, current * 1.1);
  const pct = (n: number) => Math.min(100, Math.max(0, (n / max) * 100));
  return (
    <div className="relative">
      <div className="h-3 w-full overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full bg-gradient-to-r from-emerald-300 via-blue-400 to-blue-700"
          style={{ width: `${pct(p75)}%` }}
        />
      </div>
      <Marker pct={pct(p25)} label="p25" />
      <Marker pct={pct(p50)} label="p50" />
      <Marker pct={pct(p75)} label="p75" />
      <div
        className="absolute -top-1 h-5 w-1 rounded-full bg-slate-900"
        style={{ left: `calc(${pct(current)}% - 2px)` }}
        title="You"
      />
      <div
        className="absolute top-5 -translate-x-1/2 text-[10px] font-semibold text-slate-900"
        style={{ left: `${pct(current)}%` }}
      >
        You
      </div>
    </div>
  );
}

function Marker({ pct, label }: { pct: number; label: string }) {
  return (
    <div
      className="absolute top-[-14px] -translate-x-1/2 text-[9px] tracking-wide text-slate-500 uppercase"
      style={{ left: `${pct}%` }}
    >
      {label}
    </div>
  );
}
