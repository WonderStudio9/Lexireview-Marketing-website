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
import type { StartupEmploymentInput } from "@/lib/tools/types";

export default function StartupEmploymentResultPage() {
  const router = useRouter();
  const [input, setInput] = useState<StartupEmploymentInput | null>(null);
  const [contract, setContract] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [unlocked, setUnlocked] = useState(false);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("tool:startup-employment:input");
      if (!raw) {
        router.replace("/tools/startup-employment-contract");
        return;
      }
      setInput(JSON.parse(raw) as StartupEmploymentInput);
    } catch {
      router.replace("/tools/startup-employment-contract");
    }
  }, [router]);

  async function runGenerate(leadId: string) {
    if (!input) return;
    setLoading(true);
    try {
      const res = await fetch(
        "/api/tools/startup-employment-contract/generate",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...input, leadId }),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Generation failed");
      setContract(data.contractText);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not generate");
    } finally {
      setLoading(false);
    }
  }

  function handleCopy() {
    if (!contract) return;
    navigator.clipboard.writeText(contract).then(() => toast.success("Copied"));
  }

  function handleDownload() {
    if (!contract) return;
    const blob = new Blob([contract], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `employment-contract-${(input?.employee.name ?? "employee")
      .toLowerCase()
      .replace(/\s+/g, "-")}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <ToolLayout
      eyebrow="Result"
      title={`Employment Contract${input?.employee.name ? ` — ${input.employee.name}` : ""}`}
      subtitle="Review, copy or download. Share with your hire for signature on the joining date."
    >
      {!unlocked ? (
        <EmailGate
          icp="STARTUP_FOUNDER"
          sourceDetail="startup-employment-contract"
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
                Employment Contract
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center gap-2 py-12 text-sm text-slate-500">
                  <Loader2 size={16} className="animate-spin" /> Drafting the
                  contract…
                </div>
              ) : contract ? (
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
                    {contract}
                  </pre>
                </>
              ) : (
                <p className="text-sm text-slate-500">No output yet.</p>
              )}
            </CardContent>
          </Card>

          <PremiumUpsell
            title="State-specific contract + gratuity/PF addendum + POSH policy"
            description="State-specific shops-and-establishments compliance, gratuity/PF/ESI addenda, and a full POSH policy bundle."
            priceInr={599}
            ctaLabel="Upgrade for ₹599"
            bullets={[
              "State-specific S&E Act compliance",
              "Gratuity / PF / ESI addenda",
              "Full POSH policy + IC constitution template",
              "Onboarding / offboarding checklists",
            ]}
          />
        </>
      )}
    </ToolLayout>
  );
}
