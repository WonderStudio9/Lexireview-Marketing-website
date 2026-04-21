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
import type { RetainerAgreementInput } from "@/lib/tools/types";

export default function RetainerResultPage() {
  const router = useRouter();
  const [input, setInput] = useState<RetainerAgreementInput | null>(null);
  const [agreement, setAgreement] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const [leadId, setLeadId] = useState<string>("");

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("tool:retainer-agreement:input");
      if (!raw) {
        router.replace("/tools/retainer-agreement-generator");
        return;
      }
      setInput(JSON.parse(raw) as RetainerAgreementInput);
    } catch {
      router.replace("/tools/retainer-agreement-generator");
    }
  }, [router]);

  async function runGenerate(leadIdForPersist: string) {
    if (!input) return;
    setLoading(true);
    try {
      const res = await fetch(
        "/api/tools/retainer-agreement-generator/generate",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...input, leadId: leadIdForPersist }),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Generation failed");
      setAgreement(data.agreementText);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Could not generate agreement"
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

  function handleCopy() {
    if (!agreement) return;
    navigator.clipboard.writeText(agreement).then(() => {
      toast.success("Retainer copied to clipboard");
    });
  }

  function handleDownload() {
    if (!agreement) return;
    const blob = new Blob([agreement], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `retainer-agreement.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <ToolLayout
      eyebrow="Result"
      title="Your Retainer Agreement is ready"
      subtitle={
        unlocked
          ? "Review, copy, download, or upgrade for a custom fee-escalation + withdrawal version."
          : "Enter your email to unlock the full retainer agreement."
      }
    >
      {!unlocked ? (
        <EmailGate
          icp="SOLO_LAWYER"
          sourceDetail="retainer-agreement-generator"
          onUnlocked={(id) => handleUnlocked(id)}
        />
      ) : (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileCheck size={18} className="text-emerald-600" />
                Generated Retainer
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center gap-2 py-12 text-sm text-slate-500">
                  <Loader2 size={16} className="animate-spin" />
                  Drafting your retainer…
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
            title="Custom retainer + fee escalation + withdrawal clauses"
            description="Get a bespoke retainer with annual fee-escalation schedule, detailed withdrawal grounds, and privilege-protecting termination language."
            priceInr={499}
            ctaLabel="Upgrade for ₹499"
            bullets={[
              "Annual fee-escalation schedule",
              "Detailed withdrawal & conflict clauses",
              "Client-account reconciliation annex",
              "Lawyer-verified BCI-aligned template",
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
