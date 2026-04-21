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
import type { FoundersAgreementInput } from "@/lib/tools/types";

export default function FoundersAgreementResultPage() {
  const router = useRouter();
  const [input, setInput] = useState<FoundersAgreementInput | null>(null);
  const [agreement, setAgreement] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [unlocked, setUnlocked] = useState(false);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("tool:founders-agreement:input");
      if (!raw) {
        router.replace("/tools/founders-agreement-generator");
        return;
      }
      setInput(JSON.parse(raw) as FoundersAgreementInput);
    } catch {
      router.replace("/tools/founders-agreement-generator");
    }
  }, [router]);

  async function runGenerate(leadId: string) {
    if (!input) return;
    setLoading(true);
    try {
      const res = await fetch(
        "/api/tools/founders-agreement-generator/generate",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...input, leadId }),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Generation failed");
      setAgreement(data.agreementText);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not generate");
    } finally {
      setLoading(false);
    }
  }

  function handleCopy() {
    if (!agreement) return;
    navigator.clipboard.writeText(agreement).then(() => toast.success("Copied"));
  }

  function handleDownload() {
    if (!agreement) return;
    const blob = new Blob([agreement], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `founders-agreement-${(input?.companyName ?? "company")
      .toLowerCase()
      .replace(/\s+/g, "-")}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <ToolLayout
      eyebrow="Result"
      title={`Founders Agreement${input?.companyName ? ` — ${input.companyName}` : ""}`}
      subtitle="Review, copy or download. Execute on appropriate e-stamp paper and file with your Company records."
    >
      {!unlocked ? (
        <EmailGate
          icp="STARTUP_FOUNDER"
          sourceDetail="founders-agreement-generator"
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
                Founders Agreement
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center gap-2 py-12 text-sm text-slate-500">
                  <Loader2 size={16} className="animate-spin" /> Drafting your
                  agreement…
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
            title="Lawyer-reviewed agreement with MCA filing guidance"
            description="Your founders agreement reviewed by an Indian corporate lawyer, with guidance on embedding clauses into Articles of Association and MCA filings."
            priceInr={999}
            ctaLabel="Upgrade for ₹999"
            bullets={[
              "Reviewed by practising Indian corporate lawyer",
              "MCA / ROC filing guidance included",
              "Shareholder Agreement crosswalk",
              "Editable Word + signed PDF delivery",
            ]}
          />
        </>
      )}
    </ToolLayout>
  );
}
