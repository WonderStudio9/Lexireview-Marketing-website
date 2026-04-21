"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FileCheck, Copy, Download, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { ToolLayout } from "@/components/tools/tool-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmailGate } from "@/components/tools/email-gate";
import { PremiumUpsell } from "@/components/tools/premium-upsell";
import type { TimeTrackingInput } from "@/lib/tools/types";

interface Output {
  csvText: string;
  instructionsText: string;
}

export default function TimeTrackingResultPage() {
  const router = useRouter();
  const [input, setInput] = useState<TimeTrackingInput | null>(null);
  const [output, setOutput] = useState<Output | null>(null);
  const [loading, setLoading] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const [leadId, setLeadId] = useState<string>("");

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("tool:time-tracking:input");
      if (!raw) {
        router.replace("/tools/time-tracking-template");
        return;
      }
      setInput(JSON.parse(raw) as TimeTrackingInput);
    } catch {
      router.replace("/tools/time-tracking-template");
    }
  }, [router]);

  async function runGenerate(leadIdForPersist: string) {
    if (!input) return;
    setLoading(true);
    try {
      const res = await fetch(
        "/api/tools/time-tracking-template/generate",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...input, leadId: leadIdForPersist }),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Generation failed");
      setOutput({
        csvText: data.csvText,
        instructionsText: data.instructionsText,
      });
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Could not generate template"
      );
    } finally {
      setLoading(false);
    }
  }

  function handleUnlocked(id: string) {
    setLeadId(id);
    setUnlocked(true);
    runGenerate(id);
  }

  function handleCopyCsv() {
    if (!output) return;
    navigator.clipboard.writeText(output.csvText).then(() => {
      toast.success("CSV copied to clipboard");
    });
  }

  function handleDownloadCsv() {
    if (!output) return;
    const blob = new Blob([output.csvText], {
      type: "text/csv;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `time-tracking-template.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleDownloadInstructions() {
    if (!output) return;
    const blob = new Blob([output.instructionsText], {
      type: "text/plain;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `time-tracking-instructions.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <ToolLayout
      eyebrow="Result"
      title="Your Time Tracking Template is ready"
      subtitle={
        unlocked
          ? "Download the CSV, drop it in Google Sheets, or upgrade for the automated version."
          : "Enter your email to unlock your time tracking template."
      }
    >
      {!unlocked ? (
        <EmailGate
          icp="SOLO_LAWYER"
          sourceDetail="time-tracking-template"
          onUnlocked={(id) => handleUnlocked(id)}
        />
      ) : (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileCheck size={18} className="text-emerald-600" />
                Time Tracking Template
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center gap-2 py-12 text-sm text-slate-500">
                  <Loader2 size={16} className="animate-spin" />
                  Building your template…
                </div>
              ) : output ? (
                <>
                  <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-4">
                    <Button
                      onClick={handleDownloadCsv}
                      variant="outline"
                      size="sm"
                      className="h-9"
                    >
                      <Download size={14} /> Download .csv
                    </Button>
                    <Button
                      onClick={handleCopyCsv}
                      variant="outline"
                      size="sm"
                      className="h-9"
                    >
                      <Copy size={14} /> Copy CSV
                    </Button>
                    <Button
                      onClick={handleDownloadInstructions}
                      variant="outline"
                      size="sm"
                      className="h-9"
                    >
                      <Download size={14} /> Download instructions
                    </Button>
                  </div>
                  <div className="mt-4">
                    <h4 className="mb-2 text-xs font-semibold tracking-wide text-slate-600 uppercase">
                      CSV preview
                    </h4>
                    <pre className="max-h-[35vh] overflow-auto rounded-lg bg-slate-900 p-4 text-[12px] leading-relaxed whitespace-pre text-slate-100">
                      {output.csvText}
                    </pre>
                  </div>
                  <div className="mt-6">
                    <h4 className="mb-2 text-xs font-semibold tracking-wide text-slate-600 uppercase">
                      Usage instructions
                    </h4>
                    <pre className="max-h-[35vh] overflow-auto rounded-lg bg-slate-50 p-4 text-[13px] leading-relaxed whitespace-pre-wrap text-slate-800">
                      {output.instructionsText}
                    </pre>
                  </div>
                </>
              ) : (
                <p className="text-sm text-slate-500">No output yet.</p>
              )}
            </CardContent>
          </Card>

          <PremiumUpsell
            title="Google Sheets template + invoice automation + client portal"
            description="Get a live Google Sheets workbook with auto-totals, invoice generation formulas, WIP ageing and a simple client portal."
            priceInr={299}
            ctaLabel="Upgrade for ₹299"
            bullets={[
              "Live Google Sheets workbook",
              "Auto-compute invoices from time entries",
              "WIP ageing & utilisation dashboard",
              "Client-visible read-only portal",
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
