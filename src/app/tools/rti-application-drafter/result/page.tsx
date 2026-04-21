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
import type { RtiApplicationInput } from "@/lib/tools/types";

export default function RtiResultPage() {
  const router = useRouter();
  const [input, setInput] = useState<RtiApplicationInput | null>(null);
  const [application, setApplication] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const [leadId, setLeadId] = useState<string>("");

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("tool:rti:input");
      if (!raw) {
        router.replace("/tools/rti-application-drafter");
        return;
      }
      setInput(JSON.parse(raw) as RtiApplicationInput);
    } catch {
      router.replace("/tools/rti-application-drafter");
    }
  }, [router]);

  async function runGenerate(leadIdForPersist: string) {
    if (!input) return;
    setLoading(true);
    try {
      const res = await fetch("/api/tools/rti-application-drafter/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...input, leadId: leadIdForPersist }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Generation failed");
      setApplication(data.applicationText);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Could not generate application"
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
    if (!application) return;
    navigator.clipboard.writeText(application).then(() => {
      toast.success("Application copied to clipboard");
    });
  }

  function handleDownload() {
    if (!application) return;
    const blob = new Blob([application], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `rti-application.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <ToolLayout
      eyebrow="Result"
      title="Your RTI application is ready"
      subtitle={
        unlocked
          ? "Review it below. Copy, download, or upgrade for first-appeal templates."
          : "Enter your email to unlock the full application."
      }
    >
      {!unlocked ? (
        <EmailGate
          icp="CONSUMER_DISPUTE"
          sourceDetail="rti-application-drafter"
          onUnlocked={(id) => handleUnlocked(id)}
        />
      ) : (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileCheck size={18} className="text-emerald-600" />
                Drafted RTI Application
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center gap-2 py-12 text-sm text-slate-500">
                  <Loader2 size={16} className="animate-spin" />
                  Drafting your application…
                </div>
              ) : application ? (
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
                    {application}
                  </pre>
                </>
              ) : (
                <p className="text-sm text-slate-500">No output yet.</p>
              )}
            </CardContent>
          </Card>

          <PremiumUpsell
            title="First appeal + complaint to CIC templates"
            description="If your PIO doesn't respond in 30 days, or rejects your application, you need a First Appeal under Section 19(1) and, later, a Second Appeal / Complaint to the CIC."
            priceInr={299}
            ctaLabel="Upgrade for ₹299"
            bullets={[
              "First Appeal template (Section 19(1))",
              "Second Appeal / Complaint to Central or State Information Commission",
              "Ready-to-file cover page + index",
              "SLA & penalty clauses explained",
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
