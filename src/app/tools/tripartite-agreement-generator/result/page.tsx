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
import type { TripartiteAgreementInput } from "@/lib/tools/types";

export default function TripartiteResultPage() {
  const router = useRouter();
  const [input, setInput] = useState<TripartiteAgreementInput | null>(null);
  const [agreement, setAgreement] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [unlocked, setUnlocked] = useState(false);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("tool:tripartite:input");
      if (!raw) {
        router.replace("/tools/tripartite-agreement-generator");
        return;
      }
      setInput(JSON.parse(raw) as TripartiteAgreementInput);
    } catch {
      router.replace("/tools/tripartite-agreement-generator");
    }
  }, [router]);

  async function runGenerate(leadId: string) {
    if (!input) return;
    setLoading(true);
    try {
      const res = await fetch(
        "/api/tools/tripartite-agreement-generator/generate",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...input, leadId }),
        }
      );
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
    a.download = `tripartite-agreement-${input?.city ?? "india"}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <ToolLayout
      eyebrow="Result"
      title="Tripartite Agreement"
      subtitle={
        unlocked
          ? "Review, copy or download. Upgrade for a bank-approved under-construction tripartite."
          : "Enter your email to unlock the draft."
      }
    >
      {!unlocked ? (
        <EmailGate
          icp="RE_DEVELOPER"
          sourceDetail="tripartite-agreement-generator"
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
                Generated Tripartite Agreement
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
            title="Custom tripartite for under-construction + home loan"
            description="Aligned to your bank's template (HDFC / ICICI / SBI / Kotak). Includes Builder NOC, escrow annexure, Pre-EMI table and SARFAESI coordination."
            priceInr={3999}
            ctaLabel="Upgrade for ₹3,999"
            bullets={[
              "Bank-approved tripartite template",
              "Builder NOC + escrow annexure",
              "Pre-EMI & disbursement schedule",
              "SARFAESI and RERA § 19 alignment",
            ]}
          />
        </>
      )}
    </ToolLayout>
  );
}
