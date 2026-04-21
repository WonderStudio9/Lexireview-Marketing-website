"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Calculator,
  Copy,
  Download,
  FileCheck,
  Loader2,
  ScrollText,
} from "lucide-react";
import { toast } from "sonner";

import { ToolLayout } from "@/components/tools/tool-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmailGate } from "@/components/tools/email-gate";
import { PremiumUpsell } from "@/components/tools/premium-upsell";
import type { EsopInput, EsopOutput } from "@/lib/tools/types";

export default function EsopResultPage() {
  const router = useRouter();
  const [input, setInput] = useState<EsopInput | null>(null);
  const [result, setResult] = useState<EsopOutput | null>(null);
  const [loading, setLoading] = useState(false);
  const [unlocked, setUnlocked] = useState(false);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("tool:esop:input");
      if (!raw) {
        router.replace("/tools/esop-vesting-calculator");
        return;
      }
      setInput(JSON.parse(raw) as EsopInput);
    } catch {
      router.replace("/tools/esop-vesting-calculator");
    }
  }, [router]);

  async function runGenerate(leadId: string) {
    if (!input) return;
    setLoading(true);
    try {
      const res = await fetch("/api/tools/esop-vesting-calculator/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...input, leadId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Generation failed");
      setResult({
        schedule: data.schedule,
        grantLetterText: data.grantLetterText,
        taxSummary: data.taxSummary,
        metadata: data.metadata,
      });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not calculate");
    } finally {
      setLoading(false);
    }
  }

  function copyLetter() {
    if (!result) return;
    navigator.clipboard.writeText(result.grantLetterText).then(() =>
      toast.success("Grant letter copied")
    );
  }

  function downloadLetter() {
    if (!result) return;
    const blob = new Blob([result.grantLetterText], {
      type: "text/plain;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `grant-letter-${(input?.granteeName ?? "grantee")
      .toLowerCase()
      .replace(/\s+/g, "-")}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <ToolLayout
      eyebrow="Result"
      title={`ESOP Schedule — ${input?.granteeName ?? ""}`}
      subtitle="Vesting schedule, grant letter and tax implications — review below."
    >
      {!unlocked ? (
        <EmailGate
          icp="STARTUP_FOUNDER"
          sourceDetail="esop-vesting-calculator"
          onUnlocked={(id) => {
            setUnlocked(true);
            runGenerate(id);
          }}
        />
      ) : loading ? (
        <div className="flex items-center gap-2 py-16 text-sm text-slate-500">
          <Loader2 size={16} className="animate-spin" /> Computing schedule…
        </div>
      ) : result ? (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator size={18} className="text-blue-700" />
                Vesting schedule
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-auto rounded-lg border border-slate-200">
                <table className="min-w-full text-sm">
                  <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
                    <tr>
                      <th className="px-3 py-2 text-left">#</th>
                      <th className="px-3 py-2 text-left">Date</th>
                      <th className="px-3 py-2 text-right">Vested this period</th>
                      <th className="px-3 py-2 text-right">Cumulative</th>
                      <th className="px-3 py-2 text-right">Unvested</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.schedule.map((r) => (
                      <tr key={r.period} className="border-t border-slate-100">
                        <td className="px-3 py-2 text-slate-500">{r.period}</td>
                        <td className="px-3 py-2">{r.date}</td>
                        <td className="px-3 py-2 text-right font-medium text-slate-900">
                          {r.vestedThisPeriod.toLocaleString("en-IN")}
                        </td>
                        <td className="px-3 py-2 text-right text-emerald-700">
                          {r.cumulativeVested.toLocaleString("en-IN")}
                        </td>
                        <td className="px-3 py-2 text-right text-slate-500">
                          {r.unvested.toLocaleString("en-IN")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ScrollText size={18} className="text-blue-700" />
                Grant letter
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-4">
                <Button
                  onClick={copyLetter}
                  variant="outline"
                  size="sm"
                  className="h-9"
                >
                  <Copy size={14} /> Copy letter
                </Button>
                <Button
                  onClick={downloadLetter}
                  variant="outline"
                  size="sm"
                  className="h-9"
                >
                  <Download size={14} /> Download .txt
                </Button>
              </div>
              <pre className="mt-4 max-h-[60vh] overflow-auto rounded-lg bg-slate-50 p-4 text-[13px] leading-relaxed whitespace-pre-wrap text-slate-800">
                {result.grantLetterText}
              </pre>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileCheck size={18} className="text-emerald-600" />
                Tax implications (India)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-slate-700">
                {result.taxSummary.map((t, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="mt-1 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-blue-600" />
                    {t}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <PremiumUpsell
            title="Complete ESOP pool + grant letter + tax advisory note"
            description="Lawyer + CA reviewed grant letter with Section 17(2) tax memo, DPIIT deferral calculation and ESOP-pool sizing sheet."
            priceInr={599}
            ctaLabel="Upgrade for ₹599"
            bullets={[
              "Section 17(2) perquisite tax memo",
              "DPIIT Section 80-IAC deferral analysis",
              "Grant letter reviewed by lawyer",
              "ESOP pool sizing worksheet (Excel)",
            ]}
          />
        </div>
      ) : (
        <p className="text-sm text-slate-500">No result.</p>
      )}
    </ToolLayout>
  );
}
