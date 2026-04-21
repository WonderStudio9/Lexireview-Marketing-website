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
import type { MouInput } from "@/lib/tools/types";

export default function MouResultPage() {
  const router = useRouter();
  const [input, setInput] = useState<MouInput | null>(null);
  const [mou, setMou] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [unlocked, setUnlocked] = useState(false);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("tool:mou:input");
      if (!raw) {
        router.replace("/tools/mou-generator");
        return;
      }
      setInput(JSON.parse(raw) as MouInput);
    } catch {
      router.replace("/tools/mou-generator");
    }
  }, [router]);

  async function runGenerate(leadId: string) {
    if (!input) return;
    setLoading(true);
    try {
      const res = await fetch("/api/tools/mou-generator/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...input, leadId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Generation failed");
      setMou(data.mouText);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not generate MOU");
    } finally {
      setLoading(false);
    }
  }

  function handleCopy() {
    if (!mou) return;
    navigator.clipboard.writeText(mou).then(() => toast.success("Copied"));
  }

  function handleDownload() {
    if (!mou) return;
    const blob = new Blob([mou], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `mou-${(input?.mouType ?? "draft").toLowerCase().replace(/\s+/g, "-")}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <ToolLayout
      eyebrow="Result"
      title={`Your ${input?.mouType ?? ""} MOU`}
      subtitle="Review, copy or download. For advisor/partnership MOUs that are binding, execute on e-stamp paper."
    >
      {!unlocked ? (
        <EmailGate
          icp="STARTUP_FOUNDER"
          sourceDetail="mou-generator"
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
                Memorandum of Understanding
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center gap-2 py-12 text-sm text-slate-500">
                  <Loader2 size={16} className="animate-spin" /> Drafting your MOU…
                </div>
              ) : mou ? (
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
                    {mou}
                  </pre>
                </>
              ) : (
                <p className="text-sm text-slate-500">No output yet.</p>
              )}
            </CardContent>
          </Card>

          <PremiumUpsell
            title="Advisor MOU with vesting + standard termination"
            description="Ready-to-sign Advisor MOU with quarterly vesting, standard termination and advisor equity grant letter."
            priceInr={299}
            ctaLabel="Upgrade for ₹299"
            bullets={[
              "Advisor vesting with standard market terms",
              "Bundled with equity grant letter",
              "State-specific stamp duty guidance",
              "Editable Word + signed PDF",
            ]}
          />
        </>
      )}
    </ToolLayout>
  );
}
