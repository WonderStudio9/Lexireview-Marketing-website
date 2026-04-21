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
import type { RentAgreementInput } from "@/lib/tools/types";

export default function RentAgreementResultPage() {
  const router = useRouter();
  const [input, setInput] = useState<RentAgreementInput | null>(null);
  const [agreement, setAgreement] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const [leadId, setLeadId] = useState<string>("");

  // Hydrate the form input that was saved in sessionStorage on the form page.
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("tool:rent-agreement:input");
      if (!raw) {
        router.replace("/tools/rent-agreement-generator");
        return;
      }
      setInput(JSON.parse(raw) as RentAgreementInput);
    } catch {
      router.replace("/tools/rent-agreement-generator");
    }
  }, [router]);

  async function runGenerate(leadIdForPersist: string) {
    if (!input) return;
    setLoading(true);
    try {
      const res = await fetch(
        "/api/tools/rent-agreement-generator/generate",
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
      toast.success("Agreement copied to clipboard");
    });
  }

  function handleDownload() {
    if (!agreement) return;
    const blob = new Blob([agreement], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `rent-agreement-${input?.city ?? "india"}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <ToolLayout
      eyebrow="Result"
      title="Your Rent Agreement is ready"
      subtitle={
        unlocked
          ? "Review it below. Copy, download, or upgrade for a lawyer-verified PDF."
          : "Enter your email to unlock the full agreement."
      }
    >
      {!unlocked ? (
        <EmailGate
          icp="TENANT_LANDLORD"
          sourceDetail="rent-agreement-generator"
          onUnlocked={(id) => handleUnlocked(id)}
        />
      ) : (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileCheck size={18} className="text-emerald-600" />
                Generated Agreement
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center gap-2 py-12 text-sm text-slate-500">
                  <Loader2 size={16} className="animate-spin" />
                  Drafting your agreement…
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
            title="Get the lawyer-verified, state-specific PDF"
            description={`Ready to register at your SRO in ${input?.city ?? "your city"}. Stamped, formatted, with witness annexures.`}
            priceInr={199}
            ctaLabel="Upgrade for ₹199"
            bullets={[
              "State-specific clauses aligned to local Rent Control Act",
              "Pre-formatted for e-Stamp paper",
              "Witness annexures + ID attachment guide",
              "Lawyer-verified template",
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
