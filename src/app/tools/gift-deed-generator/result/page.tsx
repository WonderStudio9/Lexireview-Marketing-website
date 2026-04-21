"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  BadgeIndianRupee,
  Copy,
  Download,
  FileCheck,
  Info,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

import { ToolLayout } from "@/components/tools/tool-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmailGate } from "@/components/tools/email-gate";
import { PremiumUpsell } from "@/components/tools/premium-upsell";
import type { GiftDeedInput, GiftDeedOutput } from "@/lib/tools/types";

export default function GiftDeedResultPage() {
  const router = useRouter();
  const [input, setInput] = useState<GiftDeedInput | null>(null);
  const [output, setOutput] = useState<GiftDeedOutput | null>(null);
  const [loading, setLoading] = useState(false);
  const [unlocked, setUnlocked] = useState(false);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("tool:gift-deed:input");
      if (!raw) {
        router.replace("/tools/gift-deed-generator");
        return;
      }
      setInput(JSON.parse(raw) as GiftDeedInput);
    } catch {
      router.replace("/tools/gift-deed-generator");
    }
  }, [router]);

  async function runGenerate(leadId: string) {
    if (!input) return;
    setLoading(true);
    try {
      const res = await fetch("/api/tools/gift-deed-generator/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...input, leadId }),
      });
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
      .writeText(output.deedText)
      .then(() => toast.success("Copied"));
  }

  function handleDownload() {
    if (!output) return;
    const blob = new Blob([output.deedText], {
      type: "text/plain;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `gift-deed.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <ToolLayout
      eyebrow="Result"
      title="Your Gift Deed is ready"
      subtitle={
        unlocked
          ? "Review deed, stamp duty estimate, and registration note."
          : "Enter your email to unlock the full deed."
      }
    >
      {!unlocked ? (
        <EmailGate
          icp="NRI"
          sourceDetail="gift-deed-generator"
          onUnlocked={(id) => handleUnlocked(id)}
        />
      ) : loading ? (
        <Card>
          <CardContent className="flex items-center gap-2 py-12 text-sm text-slate-500">
            <Loader2 size={16} className="animate-spin" />
            Drafting your Gift Deed…
          </CardContent>
        </Card>
      ) : output ? (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BadgeIndianRupee size={18} className="text-emerald-600" />
                Stamp duty & registration
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                  <div className="text-xs font-semibold uppercase tracking-wider text-emerald-800">
                    Stamp duty estimate
                  </div>
                  <div className="font-heading mt-1 text-2xl font-bold text-emerald-900">
                    ₹{output.stampDutyEstimate.toLocaleString("en-IN")}
                  </div>
                  <div className="mt-2 text-[11px] text-emerald-800">
                    Rate applied: {output.stampDutyRatePct}%
                  </div>
                </div>
                <div
                  className={`rounded-xl border p-4 ${
                    output.registrationRequired
                      ? "border-amber-200 bg-amber-50"
                      : "border-blue-200 bg-blue-50"
                  }`}
                >
                  <div className="text-xs font-semibold uppercase tracking-wider">
                    Registration
                  </div>
                  <div className="font-heading mt-1 text-2xl font-bold">
                    {output.registrationRequired ? "Mandatory" : "Optional"}
                  </div>
                  <div className="mt-2 text-[11px]">
                    {output.registrationRequired
                      ? "Section 17, Registration Act, 1908"
                      : "Section 123, Transfer of Property Act, 1882"}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileCheck size={18} className="text-emerald-600" />
                Generated Gift Deed
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
                {output.deedText}
              </pre>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info size={18} className="text-blue-700" />
                Key points
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-slate-700">
                {output.bullets.map((b) => (
                  <li key={b} className="flex gap-2">
                    <span className="mt-1 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-blue-600" />
                    {b}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <PremiumUpsell
            title="Registered Gift Deed + NRI-specific tax note"
            description="For NRI donors, we add FEMA-compliance notes, repatriation limits (USD 1M p.a.), and a registered deed ready for Sub-Registrar filing."
            priceInr={599}
            ctaLabel="Upgrade for ₹599"
            bullets={[
              "FEMA-compliant NRI gift clauses",
              "Sub-Registrar filing checklist",
              "State-specific stamp paper guidance",
              "Tax note for donor and donee",
            ]}
          />
        </div>
      ) : null}
    </ToolLayout>
  );
}
