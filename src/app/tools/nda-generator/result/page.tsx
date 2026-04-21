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
import type { NdaInput } from "@/lib/tools/types";

function pickIcp(ndaType: string): string {
  if (ndaType === "Employee-Employer") return "EMPLOYEE";
  if (ndaType === "Vendor") return "SME_OWNER";
  // Mutual / One-Way / Investor
  return "STARTUP_FOUNDER";
}

export default function NdaResultPage() {
  const router = useRouter();
  const [input, setInput] = useState<NdaInput | null>(null);
  const [nda, setNda] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [unlocked, setUnlocked] = useState(false);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("tool:nda:input");
      if (!raw) {
        router.replace("/tools/nda-generator");
        return;
      }
      setInput(JSON.parse(raw) as NdaInput);
    } catch {
      router.replace("/tools/nda-generator");
    }
  }, [router]);

  async function runGenerate(leadId: string) {
    if (!input) return;
    setLoading(true);
    try {
      const res = await fetch("/api/tools/nda-generator/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...input, leadId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Generation failed");
      setNda(data.ndaText);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not generate NDA");
    } finally {
      setLoading(false);
    }
  }

  function handleCopy() {
    if (!nda) return;
    navigator.clipboard.writeText(nda).then(() => toast.success("Copied"));
  }

  function handleDownload() {
    if (!nda) return;
    const blob = new Blob([nda], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `nda-${(input?.ndaType ?? "draft").toLowerCase()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <ToolLayout
      eyebrow="Result"
      title={`Your ${input?.ndaType ?? ""} NDA`}
      subtitle="Review, copy or download. Execute on appropriate e-stamp paper."
    >
      {!unlocked ? (
        <EmailGate
          icp={input ? pickIcp(input.ndaType) : "STARTUP_FOUNDER"}
          sourceDetail="nda-generator"
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
                Non-Disclosure Agreement
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center gap-2 py-12 text-sm text-slate-500">
                  <Loader2 size={16} className="animate-spin" /> Drafting your
                  NDA…
                </div>
              ) : nda ? (
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
                    {nda}
                  </pre>
                </>
              ) : (
                <p className="text-sm text-slate-500">No output yet.</p>
              )}
            </CardContent>
          </Card>

          <PremiumUpsell
            title="State-specific, lawyer-verified NDA"
            description="Adds jurisdiction-specific stamp duty schedule, witness annexure, and a negotiated fallback clause set."
            priceInr={299}
            ctaLabel="Upgrade for ₹299"
            bullets={[
              "Reviewed by practising Indian advocates",
              "State-stamp-duty schedule attached",
              "Negotiation fallback clauses included",
              "Editable Word/PDF delivery",
            ]}
          />
        </>
      )}
    </ToolLayout>
  );
}
