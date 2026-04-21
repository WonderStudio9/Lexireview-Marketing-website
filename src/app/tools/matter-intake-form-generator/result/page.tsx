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
import type { MatterIntakeInput } from "@/lib/tools/types";

export default function MatterIntakeResultPage() {
  const router = useRouter();
  const [input, setInput] = useState<MatterIntakeInput | null>(null);
  const [formText, setFormText] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const [leadId, setLeadId] = useState<string>("");

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("tool:matter-intake:input");
      if (!raw) {
        router.replace("/tools/matter-intake-form-generator");
        return;
      }
      setInput(JSON.parse(raw) as MatterIntakeInput);
    } catch {
      router.replace("/tools/matter-intake-form-generator");
    }
  }, [router]);

  async function runGenerate(leadIdForPersist: string) {
    if (!input) return;
    setLoading(true);
    try {
      const res = await fetch(
        "/api/tools/matter-intake-form-generator/generate",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...input, leadId: leadIdForPersist }),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Generation failed");
      setFormText(data.formText);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Could not generate intake form"
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
    if (!formText) return;
    navigator.clipboard.writeText(formText).then(() => {
      toast.success("Intake form copied to clipboard");
    });
  }

  function handleDownload() {
    if (!formText) return;
    const blob = new Blob([formText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `matter-intake-form-${input?.practiceArea ?? "generic"}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <ToolLayout
      eyebrow="Result"
      title="Your Matter Intake Form is ready"
      subtitle={
        unlocked
          ? "Review it below. Copy, download, or upgrade for a DPDP-compliant e-sign ready version."
          : "Enter your email to unlock the full intake form."
      }
    >
      {!unlocked ? (
        <EmailGate
          icp="SOLO_LAWYER"
          sourceDetail="matter-intake-form-generator"
          onUnlocked={(id) => handleUnlocked(id)}
        />
      ) : (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileCheck size={18} className="text-emerald-600" />
                Generated Intake Form
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center gap-2 py-12 text-sm text-slate-500">
                  <Loader2 size={16} className="animate-spin" />
                  Drafting your intake form…
                </div>
              ) : formText ? (
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
                    {formText}
                  </pre>
                </>
              ) : (
                <p className="text-sm text-slate-500">No output yet.</p>
              )}
            </CardContent>
          </Card>

          <PremiumUpsell
            title="State-specific + DPDP-compliant intake form with e-sign ready"
            description="Pre-formatted for Leegality / DocuSign workflows, with state-specific KYC clauses and DPDP notice-and-consent text vetted for your jurisdiction."
            priceInr={499}
            ctaLabel="Upgrade for ₹499"
            bullets={[
              "State-specific intake clauses",
              "Full DPDP Act notice + consent block",
              "Leegality / DocuSign e-sign template",
              "Conflict-check matrix + matter ID format",
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
