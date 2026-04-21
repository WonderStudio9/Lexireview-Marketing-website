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
import type { WillInput } from "@/lib/tools/types";

export default function WillResultPage() {
  const router = useRouter();
  const [input, setInput] = useState<WillInput | null>(null);
  const [will, setWill] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [unlocked, setUnlocked] = useState(false);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("tool:will:input");
      if (!raw) {
        router.replace("/tools/will-drafter");
        return;
      }
      setInput(JSON.parse(raw) as WillInput);
    } catch {
      router.replace("/tools/will-drafter");
    }
  }, [router]);

  async function runGenerate(leadId: string) {
    if (!input) return;
    setLoading(true);
    try {
      const res = await fetch("/api/tools/will-drafter/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...input, leadId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Generation failed");
      setWill(data.willText);
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
    if (!will) return;
    navigator.clipboard.writeText(will).then(() => toast.success("Copied"));
  }

  function handleDownload() {
    if (!will) return;
    const blob = new Blob([will], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `will-${input?.testatorName ?? "testator"}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <ToolLayout
      eyebrow="Result"
      title="Your Will is drafted"
      subtitle={
        unlocked
          ? "Sign before 2 witnesses. Registration is optional but recommended."
          : "Enter your email to unlock the full Will."
      }
    >
      {!unlocked ? (
        <EmailGate
          icp="SENIOR_CITIZEN"
          sourceDetail="will-drafter"
          onUnlocked={(id) => handleUnlocked(id)}
        />
      ) : (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileCheck size={18} className="text-emerald-600" />
                Your Last Will & Testament
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center gap-2 py-12 text-sm text-slate-500">
                  <Loader2 size={16} className="animate-spin" />
                  Drafting your Will…
                </div>
              ) : will ? (
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
                    {will}
                  </pre>
                </>
              ) : null}
            </CardContent>
          </Card>

          <PremiumUpsell
            title="Registered Will drafted by advocate + registration guidance"
            description="For peace of mind on a high-value estate. An advocate tailors the Will, adds residuary and codicil clauses, and guides you through Sub-Registrar registration."
            priceInr={999}
            ctaLabel="Upgrade for ₹999"
            bullets={[
              "Lawyer-drafted, personalised Will",
              "Sub-Registrar registration guidance (ISA §18)",
              "Codicil + residuary clauses",
              "Safekeeping advice (locker, Executor copy)",
            ]}
          />
        </>
      )}
    </ToolLayout>
  );
}
