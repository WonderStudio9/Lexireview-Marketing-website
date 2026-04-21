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
import type { CustomerMsaInput } from "@/lib/tools/types";

export default function CustomerMsaResultPage() {
  const router = useRouter();
  const [input, setInput] = useState<CustomerMsaInput | null>(null);
  const [msa, setMsa] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [unlocked, setUnlocked] = useState(false);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("tool:customer-msa:input");
      if (!raw) {
        router.replace("/tools/customer-msa-generator");
        return;
      }
      setInput(JSON.parse(raw) as CustomerMsaInput);
    } catch {
      router.replace("/tools/customer-msa-generator");
    }
  }, [router]);

  async function runGenerate(leadId: string) {
    if (!input) return;
    setLoading(true);
    try {
      const res = await fetch("/api/tools/customer-msa-generator/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...input, leadId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Generation failed");
      setMsa(data.msaText);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not generate MSA");
    } finally {
      setLoading(false);
    }
  }

  function handleCopy() {
    if (!msa) return;
    navigator.clipboard.writeText(msa).then(() => toast.success("Copied"));
  }

  function handleDownload() {
    if (!msa) return;
    const blob = new Blob([msa], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `customer-msa-${(input?.vendor.name ?? "vendor")
      .toLowerCase()
      .replace(/\s+/g, "-")}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <ToolLayout
      eyebrow="Result"
      title={`Your ${input?.customerType ?? ""} MSA`}
      subtitle="Review, copy or download. Use per-customer Order Forms to reference this MSA."
    >
      {!unlocked ? (
        <EmailGate
          icp="STARTUP_FOUNDER"
          sourceDetail="customer-msa-generator"
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
                Master Services Agreement
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center gap-2 py-12 text-sm text-slate-500">
                  <Loader2 size={16} className="animate-spin" /> Drafting MSA…
                </div>
              ) : msa ? (
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
                    {msa}
                  </pre>
                </>
              ) : (
                <p className="text-sm text-slate-500">No output yet.</p>
              )}
            </CardContent>
          </Card>

          <PremiumUpsell
            title="Complete MSA + Data Processing Agreement + SOW templates"
            description="MSA + DPA (Schedule 1) + 3 Statement-of-Work templates + security addendum, reviewed by a practising Indian IT-law advocate."
            priceInr={999}
            ctaLabel="Upgrade for ₹999"
            bullets={[
              "Standalone DPA aligned to DPDP Act 2023",
              "3 x SOW templates (Services / SaaS / Hybrid)",
              "Information-security addendum (SOC 2 style)",
              "Lawyer-reviewed Word + PDF delivery",
            ]}
          />
        </>
      )}
    </ToolLayout>
  );
}
