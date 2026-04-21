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
import type {
  FreelancerContractInput,
  FreelancerContractOutput,
} from "@/lib/tools/types";

export default function FreelancerContractResultPage() {
  const router = useRouter();
  const [input, setInput] = useState<FreelancerContractInput | null>(null);
  const [output, setOutput] = useState<FreelancerContractOutput | null>(null);
  const [loading, setLoading] = useState(false);
  const [unlocked, setUnlocked] = useState(false);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(
        "tool:freelancer-contract-simple:input"
      );
      if (!raw) {
        router.replace("/tools/freelancer-contract-simple");
        return;
      }
      setInput(JSON.parse(raw) as FreelancerContractInput);
    } catch {
      router.replace("/tools/freelancer-contract-simple");
    }
  }, [router]);

  async function runGenerate(leadId: string) {
    if (!input) return;
    setLoading(true);
    try {
      const res = await fetch(
        "/api/tools/freelancer-contract-simple/generate",
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
      .writeText(output.contractText)
      .then(() => toast.success("Copied"));
  }

  function handleDownload() {
    if (!output) return;
    const blob = new Blob([output.contractText], {
      type: "text/plain;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `freelancer-contract.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <ToolLayout
      eyebrow="Result"
      title="Your freelance contract is ready"
      subtitle={
        unlocked
          ? "Review contract, GST and TDS notes, then share with your client."
          : "Enter your email to unlock the full contract."
      }
    >
      {!unlocked ? (
        <EmailGate
          icp="FREELANCER"
          sourceDetail="freelancer-contract-simple"
          onUnlocked={(id) => handleUnlocked(id)}
        />
      ) : loading ? (
        <Card>
          <CardContent className="flex items-center gap-2 py-12 text-sm text-slate-500">
            <Loader2 size={16} className="animate-spin" />
            Drafting your contract…
          </CardContent>
        </Card>
      ) : output ? (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileCheck size={18} className="text-emerald-600" />
                Freelance Services Agreement
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
                {output.contractText}
              </pre>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info size={18} className="text-blue-700" />
                Tax notes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-slate-700">
              <p>
                <span className="font-semibold">GST:</span> {output.gstNote}
              </p>
              <p>
                <span className="font-semibold">TDS:</span> {output.tdsNote}
              </p>
            </CardContent>
          </Card>

          <PremiumUpsell
            title="Milestone-based contract with escrow clauses"
            description="Robust, milestone-based contract with escrow triggers, kill fee, change-order pricing, and lawyer-reviewed IP language."
            priceInr={299}
            ctaLabel="Upgrade for ₹299"
            bullets={[
              "Escrow release triggers per milestone",
              "Kill-fee / termination-for-convenience",
              "Change-order pricing framework",
              "International client-ready (US, UK, SG)",
            ]}
          />
        </div>
      ) : null}
    </ToolLayout>
  );
}
