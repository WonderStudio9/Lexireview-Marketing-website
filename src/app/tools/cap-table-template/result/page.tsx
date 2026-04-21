"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BarChart3, Download, Loader2, Info } from "lucide-react";
import { toast } from "sonner";

import { ToolLayout } from "@/components/tools/tool-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmailGate } from "@/components/tools/email-gate";
import { PremiumUpsell } from "@/components/tools/premium-upsell";
import type { CapTableInput, CapTableOutput } from "@/lib/tools/types";

export default function CapTableResultPage() {
  const router = useRouter();
  const [input, setInput] = useState<CapTableInput | null>(null);
  const [result, setResult] = useState<CapTableOutput | null>(null);
  const [loading, setLoading] = useState(false);
  const [unlocked, setUnlocked] = useState(false);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("tool:cap-table:input");
      if (!raw) {
        router.replace("/tools/cap-table-template");
        return;
      }
      setInput(JSON.parse(raw) as CapTableInput);
    } catch {
      router.replace("/tools/cap-table-template");
    }
  }, [router]);

  async function runGenerate(leadId: string) {
    if (!input) return;
    setLoading(true);
    try {
      const res = await fetch("/api/tools/cap-table-template/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...input, leadId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Generation failed");
      setResult({
        preDilution: data.preDilution,
        postDilution: data.postDilution,
        liquidationSummary: data.liquidationSummary,
        csv: data.csv,
        notes: data.notes,
        metadata: data.metadata,
      });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not build");
    } finally {
      setLoading(false);
    }
  }

  function downloadCsv() {
    if (!result) return;
    const blob = new Blob([result.csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `cap-table-${(input?.companyName ?? "company")
      .toLowerCase()
      .replace(/\s+/g, "-")}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <ToolLayout
      eyebrow="Result"
      title={`Cap Table — ${input?.companyName ?? ""}`}
      subtitle="Review pre- and post-dilution. Download CSV for your records."
    >
      {!unlocked ? (
        <EmailGate
          icp="STARTUP_FOUNDER"
          sourceDetail="cap-table-template"
          onUnlocked={(id) => {
            setUnlocked(true);
            runGenerate(id);
          }}
        />
      ) : loading ? (
        <div className="flex items-center gap-2 py-16 text-sm text-slate-500">
          <Loader2 size={16} className="animate-spin" /> Building cap table…
        </div>
      ) : result ? (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 size={18} className="text-blue-700" />
                Pre-dilution cap table
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CapTable rows={result.preDilution} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 size={18} className="text-blue-700" />
                Post-dilution cap table (after next round)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CapTable rows={result.postDilution} />
              <div className="mt-4">
                <Button
                  onClick={downloadCsv}
                  variant="outline"
                  size="sm"
                  className="h-9"
                >
                  <Download size={14} /> Download CSV
                </Button>
              </div>
            </CardContent>
          </Card>

          {result.liquidationSummary?.length ? (
            <Card>
              <CardHeader>
                <CardTitle>Liquidation preference summary</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-slate-700">
                  {result.liquidationSummary.map((s, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="mt-1 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-blue-600" />
                      {s}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ) : null}

          {result.notes?.length ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info size={18} className="text-amber-600" /> Notes & assumptions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-slate-700">
                  {result.notes.map((n, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="mt-1 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
                      {n}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ) : null}

          <PremiumUpsell
            title="Interactive Google Sheets cap table with waterfall analysis"
            description="Live-editable Google Sheets cap table with dilution waterfall, exit-return modelling and ESOP refresh analysis."
            priceInr={499}
            ctaLabel="Upgrade for ₹499"
            bullets={[
              "Interactive waterfall modelling",
              "Exit-return analysis at multiple valuations",
              "ESOP refresh scenario planner",
              "Delivered as editable Google Sheet",
            ]}
          />
        </div>
      ) : (
        <p className="text-sm text-slate-500">No result.</p>
      )}
    </ToolLayout>
  );
}

function CapTable({ rows }: { rows: CapTableOutput["preDilution"] }) {
  return (
    <div className="overflow-auto rounded-lg border border-slate-200">
      <table className="min-w-full text-sm">
        <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
          <tr>
            <th className="px-3 py-2 text-left">Holder</th>
            <th className="px-3 py-2 text-left">Share class</th>
            <th className="px-3 py-2 text-right">Shares</th>
            <th className="px-3 py-2 text-right">Equity %</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="border-t border-slate-100">
              <td className="px-3 py-2 font-medium text-slate-800">{r.holder}</td>
              <td className="px-3 py-2 text-slate-600">{r.shareClass}</td>
              <td className="px-3 py-2 text-right text-slate-700">
                {r.shares.toLocaleString("en-IN")}
              </td>
              <td className="px-3 py-2 text-right font-medium text-slate-900">
                {r.equityPct}%
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
