"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Copy, Download, FileCheck, Info, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { ToolLayout } from "@/components/tools/tool-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmailGate } from "@/components/tools/email-gate";
import { PremiumUpsell } from "@/components/tools/premium-upsell";
import type { PoaInput, PoaOutput } from "@/lib/tools/types";

export default function PoaResultPage() {
  const router = useRouter();
  const [input, setInput] = useState<PoaInput | null>(null);
  const [output, setOutput] = useState<PoaOutput | null>(null);
  const [loading, setLoading] = useState(false);
  const [unlocked, setUnlocked] = useState(false);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("tool:poa:input");
      if (!raw) {
        router.replace("/tools/power-of-attorney-generator");
        return;
      }
      setInput(JSON.parse(raw) as PoaInput);
    } catch {
      router.replace("/tools/power-of-attorney-generator");
    }
  }, [router]);

  async function runGenerate(leadId: string) {
    if (!input) return;
    setLoading(true);
    try {
      const res = await fetch(
        "/api/tools/power-of-attorney-generator/generate",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...input, leadId }),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Generation failed");
      setOutput(data);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not generate");
    } finally {
      setLoading(false);
    }
  }

  function handleUnlocked(id: string) {
    setUnlocked(true);
    runGenerate(id);
  }

  function handleCopy() {
    if (!output) return;
    navigator.clipboard
      .writeText(output.poaText)
      .then(() => toast.success("Copied"));
  }

  function handleDownload() {
    if (!output) return;
    const blob = new Blob([output.poaText], {
      type: "text/plain;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `poa.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <ToolLayout
      eyebrow="Result"
      title="Your Power of Attorney is ready"
      subtitle={
        unlocked
          ? "Review POA, notarisation, consular attestation and registration notes."
          : "Enter your email to unlock the full POA."
      }
    >
      {!unlocked ? (
        <EmailGate
          icp="NRI"
          sourceDetail="power-of-attorney-generator"
          onUnlocked={(id) => handleUnlocked(id)}
        />
      ) : loading ? (
        <Card>
          <CardContent className="flex items-center gap-2 py-12 text-sm text-slate-500">
            <Loader2 size={16} className="animate-spin" />
            Drafting your POA…
          </CardContent>
        </Card>
      ) : output ? (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileCheck size={18} className="text-emerald-600" />
                Generated Power of Attorney
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-4">
                <Button
                  onClick={handleCopy}
                  variant="outline"
                  size="sm"
                  className="h-9"
                >
                  <Copy size={14} /> Copy
                </Button>
                <Button
                  onClick={handleDownload}
                  variant="outline"
                  size="sm"
                  className="h-9"
                >
                  <Download size={14} /> Download .txt
                </Button>
              </div>
              <pre className="mt-4 max-h-[60vh] overflow-auto rounded-lg bg-slate-50 p-4 text-[13px] leading-relaxed whitespace-pre-wrap text-slate-800">
                {output.poaText}
              </pre>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info size={18} className="text-blue-700" />
                Attestation requirements
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-slate-700">
              <p><span className="font-semibold">Notarisation:</span> {output.notarizationNote}</p>
              <p><span className="font-semibold">Consular attestation:</span> {output.consularNote}</p>
              <p><span className="font-semibold">Registration:</span> {output.registrationNote}</p>
              <ul className="mt-2 space-y-2 border-t border-slate-200 pt-3">
                {output.bullets.map((b) => (
                  <li key={b} className="flex gap-2">
                    <span className="mt-1 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-blue-600" />
                    {b}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <PremiumUpsell
            title="Notarized + consular-attested POA for NRIs"
            description="End-to-end NRI POA service — draft, consular attestation, courier to India, stamp-duty adjudication and registration coordination."
            priceInr={999}
            ctaLabel="Upgrade for ₹999"
            bullets={[
              "Consular / apostille attestation support",
              "Adjudication at Collector of Stamps",
              "Sub-Registrar filing coordination",
              "30-day SLA for full turnaround",
            ]}
          />
        </div>
      ) : null}
    </ToolLayout>
  );
}
