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
import type { PartnershipDeedInput } from "@/lib/tools/types";

export default function PartnershipDeedResultPage() {
  const router = useRouter();
  const [input, setInput] = useState<PartnershipDeedInput | null>(null);
  const [deed, setDeed] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [unlocked, setUnlocked] = useState(false);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("tool:partnership-deed:input");
      if (!raw) {
        router.replace("/tools/partnership-deed-generator");
        return;
      }
      setInput(JSON.parse(raw) as PartnershipDeedInput);
    } catch {
      router.replace("/tools/partnership-deed-generator");
    }
  }, [router]);

  async function runGenerate(leadId: string) {
    if (!input) return;
    setLoading(true);
    try {
      const res = await fetch("/api/tools/partnership-deed-generator/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...input, leadId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Generation failed");
      setDeed(data.deedText);
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
    if (!deed) return;
    navigator.clipboard.writeText(deed).then(() => toast.success("Copied"));
  }

  function handleDownload() {
    if (!deed) return;
    const blob = new Blob([deed], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `partnership-deed-${input?.firmName ?? "firm"}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <ToolLayout
      eyebrow="Result"
      title="Your Partnership Deed is ready"
      subtitle={
        unlocked
          ? "Review, copy, or download. Ready to stamp and register."
          : "Enter your email to unlock the full deed."
      }
    >
      {!unlocked ? (
        <EmailGate
          icp="MSME_OWNER"
          sourceDetail="partnership-deed-generator"
          onUnlocked={(id) => handleUnlocked(id)}
        />
      ) : (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileCheck size={18} className="text-emerald-600" />
                Generated Partnership Deed
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center gap-2 py-12 text-sm text-slate-500">
                  <Loader2 size={16} className="animate-spin" />
                  Drafting your deed…
                </div>
              ) : deed ? (
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
                    {deed}
                  </pre>
                </>
              ) : null}
            </CardContent>
          </Card>

          <PremiumUpsell
            title="Registered partnership + Form A filing guide"
            description="Lawyer-verified deed + step-by-step filing guide for Form A with your state Registrar of Firms, plus all optional annexures."
            priceInr={499}
            ctaLabel="Upgrade for ₹499"
            bullets={[
              "Stamp-duty value computed for your state",
              "Form A pre-fill sheet",
              "Registrar of Firms filing checklist",
              "PAN / GST application checklist",
            ]}
          />
        </>
      )}
    </ToolLayout>
  );
}
