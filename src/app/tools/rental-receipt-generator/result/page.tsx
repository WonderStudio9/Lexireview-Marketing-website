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
  RentalReceiptInput,
  RentalReceiptOutput,
} from "@/lib/tools/types";

export default function RentalReceiptResultPage() {
  const router = useRouter();
  const [input, setInput] = useState<RentalReceiptInput | null>(null);
  const [output, setOutput] = useState<RentalReceiptOutput | null>(null);
  const [loading, setLoading] = useState(false);
  const [unlocked, setUnlocked] = useState(false);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("tool:rental-receipt:input");
      if (!raw) {
        router.replace("/tools/rental-receipt-generator");
        return;
      }
      setInput(JSON.parse(raw) as RentalReceiptInput);
    } catch {
      router.replace("/tools/rental-receipt-generator");
    }
  }, [router]);

  async function runGenerate(leadId: string) {
    if (!input) return;
    setLoading(true);
    try {
      const res = await fetch("/api/tools/rental-receipt-generator/generate", {
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
      .writeText(output.receiptText)
      .then(() => toast.success("Copied"));
  }

  function handleDownload() {
    if (!output) return;
    const blob = new Blob([output.receiptText], {
      type: "text/plain;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `rent-receipt-${input?.monthYear ?? "month"}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <ToolLayout
      eyebrow="Result"
      title="Your rent receipt is ready"
      subtitle={
        unlocked
          ? "HRA-compliant — give to your HR / keep for your ITR."
          : "Enter your email to unlock your receipt."
      }
    >
      {!unlocked ? (
        <EmailGate
          icp="TENANT_LANDLORD"
          sourceDetail="rental-receipt-generator"
          onUnlocked={(id) => handleUnlocked(id)}
        />
      ) : loading ? (
        <Card>
          <CardContent className="flex items-center gap-2 py-12 text-sm text-slate-500">
            <Loader2 size={16} className="animate-spin" />
            Generating your receipt…
          </CardContent>
        </Card>
      ) : output ? (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileCheck size={18} className="text-emerald-600" />
                Rent receipt
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
                {output.receiptText}
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
                <span className="font-semibold">HRA / PAN:</span> {output.hraNote}
              </p>
              <p>
                <span className="font-semibold">TDS:</span> {output.tdsNote}
              </p>
            </CardContent>
          </Card>

          <PremiumUpsell
            title="Annual 12-month rental receipts pack"
            description="Generate 12 consecutive monthly receipts in one go — perfect for HRA proof across an entire financial year."
            priceInr={99}
            ctaLabel="Upgrade for ₹99"
            bullets={[
              "12 months of receipts in one PDF",
              "Auto-incrementing receipt numbers",
              "Revenue-stamp line where required",
              "HRA proof packet ready to hand to HR",
            ]}
          />
        </div>
      ) : null}
    </ToolLayout>
  );
}
