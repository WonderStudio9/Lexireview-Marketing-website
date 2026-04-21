"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FileCheck, Copy, Download, Loader2, Scale } from "lucide-react";
import { toast } from "sonner";

import { ToolLayout } from "@/components/tools/tool-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmailGate } from "@/components/tools/email-gate";
import { PremiumUpsell } from "@/components/tools/premium-upsell";
import type { ConsumerComplaintInput, Forum } from "@/lib/tools/types";

export default function ConsumerComplaintResultPage() {
  const router = useRouter();
  const [input, setInput] = useState<ConsumerComplaintInput | null>(null);
  const [complaint, setComplaint] = useState<string | null>(null);
  const [forum, setForum] = useState<Forum | null>(null);
  const [loading, setLoading] = useState(false);
  const [unlocked, setUnlocked] = useState(false);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("tool:consumer-complaint:input");
      if (!raw) {
        router.replace("/tools/consumer-complaint-drafter");
        return;
      }
      setInput(JSON.parse(raw) as ConsumerComplaintInput);
    } catch {
      router.replace("/tools/consumer-complaint-drafter");
    }
  }, [router]);

  async function runGenerate(leadId: string) {
    if (!input) return;
    setLoading(true);
    try {
      const res = await fetch(
        "/api/tools/consumer-complaint-drafter/generate",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...input, leadId }),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Generation failed");
      setComplaint(data.complaintText);
      setForum(data.forum as Forum);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Could not generate complaint"
      );
    } finally {
      setLoading(false);
    }
  }

  function handleCopy() {
    if (!complaint) return;
    navigator.clipboard
      .writeText(complaint)
      .then(() => toast.success("Complaint copied"));
  }

  function handleDownload() {
    if (!complaint) return;
    const blob = new Blob([complaint], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "consumer-complaint.txt";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <ToolLayout
      eyebrow="Result"
      title="Your Consumer Complaint"
      subtitle={
        forum
          ? `Auto-filed at the right level: ${forum}`
          : "Drafted under the Consumer Protection Act, 2019"
      }
    >
      {!unlocked ? (
        <EmailGate
          icp="CONSUMER_DISPUTE"
          sourceDetail="consumer-complaint-drafter"
          onUnlocked={(id) => {
            setUnlocked(true);
            runGenerate(id);
          }}
        />
      ) : (
        <>
          {forum ? (
            <div className="mb-6 rounded-xl border border-blue-100 bg-blue-50 p-4">
              <div className="flex items-center gap-2 text-blue-800">
                <Scale size={16} />
                <p className="text-sm font-medium">
                  Recommended forum: <strong>{forum}</strong>
                </p>
              </div>
              <p className="mt-1 text-xs text-slate-600">
                Based on the amount involved. File online via{" "}
                <a
                  href="https://edaakhil.nic.in"
                  target="_blank"
                  rel="noreferrer"
                  className="underline"
                >
                  e-Daakhil
                </a>
                .
              </p>
            </div>
          ) : null}

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileCheck size={18} className="text-emerald-600" />
                Draft complaint
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center gap-2 py-12 text-sm text-slate-500">
                  <Loader2 size={16} className="animate-spin" /> Drafting your
                  complaint…
                </div>
              ) : complaint ? (
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
                    {complaint}
                  </pre>
                </>
              ) : null}
            </CardContent>
          </Card>

          <PremiumUpsell
            title="Full court-filing kit"
            description="Annexures template, filing fee table, affidavit format, and a step-by-step e-Daakhil submission guide."
            priceInr={499}
            ctaLabel="Get the filing kit for ₹499"
            bullets={[
              "Annexures A-1 to A-4 pre-formatted",
              "Filing fee calculator for your forum",
              "Affidavit & vakalatnama templates",
              "e-Daakhil submission walkthrough",
            ]}
          />
        </>
      )}
    </ToolLayout>
  );
}
