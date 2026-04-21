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
import type { AgreementToSellInput } from "@/lib/tools/types";

export default function AtsResultPage() {
  const router = useRouter();
  const [input, setInput] = useState<AgreementToSellInput | null>(null);
  const [agreement, setAgreement] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [unlocked, setUnlocked] = useState(false);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("tool:agreement-to-sell:input");
      if (!raw) {
        router.replace("/tools/agreement-to-sell-generator");
        return;
      }
      setInput(JSON.parse(raw) as AgreementToSellInput);
    } catch {
      router.replace("/tools/agreement-to-sell-generator");
    }
  }, [router]);

  async function runGenerate(leadId: string) {
    if (!input) return;
    setLoading(true);
    try {
      const res = await fetch("/api/tools/agreement-to-sell-generator/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...input, leadId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Generation failed");
      setAgreement(data.agreementText as string);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not generate");
    } finally {
      setLoading(false);
    }
  }

  function handleCopy() {
    if (!agreement) return;
    navigator.clipboard.writeText(agreement).then(() => {
      toast.success("Agreement copied to clipboard");
    });
  }

  function handleDownload() {
    if (!agreement) return;
    const blob = new Blob([agreement], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `agreement-to-sell-${input?.city ?? "india"}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <ToolLayout
      eyebrow="Result"
      title="Agreement to Sell"
      subtitle={
        unlocked
          ? "Review, copy or download. Upgrade for registered ATS + escrow + lawyer review."
          : "Enter your email to unlock the draft."
      }
    >
      {!unlocked ? (
        <EmailGate
          icp="RE_DEVELOPER"
          sourceDetail="agreement-to-sell-generator"
          onUnlocked={(id) => {
            setUnlocked(true);
            runGenerate(id);
          }}
        />
      ) : (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileCheck size={18} className="text-emerald-600" />
                Generated Agreement to Sell
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center gap-2 py-12 text-sm text-slate-500">
                  <Loader2 size={16} className="animate-spin" /> Drafting…
                </div>
              ) : agreement ? (
                <>
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
                    {agreement}
                  </pre>
                </>
              ) : (
                <p className="text-sm text-slate-500">No output yet.</p>
              )}
            </CardContent>
          </Card>

          <PremiumUpsell
            title="Registered ATS with escrow + lawyer review"
            description="A real-estate lawyer reviews the agreement, adds escrow mechanics, and coordinates stamping + SRO registration."
            priceInr={2999}
            ctaLabel="Upgrade for ₹2,999"
            bullets={[
              "Lawyer review (24h turnaround)",
              "Escrow / milestone payments integrated",
              "e-Stamp paper sourcing guidance",
              "SRO registration coordination",
            ]}
          />
        </>
      )}
    </ToolLayout>
  );
}
