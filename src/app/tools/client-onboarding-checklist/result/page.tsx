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
import type {
  OnboardingChecklistInput,
  ChecklistItem,
} from "@/lib/tools/types";

interface ResultPayload {
  checklistText: string;
  items: ChecklistItem[];
}

export default function OnboardingChecklistResultPage() {
  const router = useRouter();
  const [input, setInput] = useState<OnboardingChecklistInput | null>(null);
  const [result, setResult] = useState<ResultPayload | null>(null);
  const [loading, setLoading] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const [leadId, setLeadId] = useState<string>("");

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("tool:onboarding-checklist:input");
      if (!raw) {
        router.replace("/tools/client-onboarding-checklist");
        return;
      }
      setInput(JSON.parse(raw) as OnboardingChecklistInput);
    } catch {
      router.replace("/tools/client-onboarding-checklist");
    }
  }, [router]);

  async function runGenerate(leadIdForPersist: string) {
    if (!input) return;
    setLoading(true);
    try {
      const res = await fetch(
        "/api/tools/client-onboarding-checklist/generate",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...input, leadId: leadIdForPersist }),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Generation failed");
      setResult({ checklistText: data.checklistText, items: data.items });
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Could not generate checklist"
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
    if (!result) return;
    navigator.clipboard.writeText(result.checklistText).then(() => {
      toast.success("Checklist copied to clipboard");
    });
  }

  function handleDownload() {
    if (!result) return;
    const blob = new Blob([result.checklistText], {
      type: "text/plain;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `onboarding-checklist.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <ToolLayout
      eyebrow="Result"
      title="Your Onboarding Checklist is ready"
      subtitle={
        unlocked
          ? "Review, copy, download, or upgrade for the full automated workflow template."
          : "Enter your email to unlock your onboarding checklist."
      }
    >
      {!unlocked ? (
        <EmailGate
          icp="SOLO_LAWYER"
          sourceDetail="client-onboarding-checklist"
          onUnlocked={(id) => handleUnlocked(id)}
        />
      ) : (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileCheck size={18} className="text-emerald-600" />
                Onboarding Checklist
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center gap-2 py-12 text-sm text-slate-500">
                  <Loader2 size={16} className="animate-spin" />
                  Building your checklist…
                </div>
              ) : result ? (
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

                  {result.items.length > 0 ? (
                    <div className="mt-4 space-y-2">
                      {result.items.map((i) => (
                        <div
                          key={i.step}
                          className="flex items-start gap-3 rounded-lg border border-slate-200 bg-white p-3"
                        >
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-semibold text-blue-800">
                            {i.step}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between gap-2">
                              <div className="text-sm font-medium text-slate-900">
                                {i.title}
                              </div>
                              <span className="shrink-0 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600">
                                ~{i.estimatedMinutes}m
                              </span>
                            </div>
                            <p className="mt-1 text-xs leading-relaxed text-slate-600">
                              {i.detail}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : null}
                </>
              ) : (
                <p className="text-sm text-slate-500">No output yet.</p>
              )}
            </CardContent>
          </Card>

          <PremiumUpsell
            title="Automated onboarding workflow template"
            description="Get a Notion / Airtable-compatible template with automations, status tracking, and matter-ID auto-assignment."
            priceInr={299}
            ctaLabel="Upgrade for ₹299"
            bullets={[
              "Notion / Airtable importable template",
              "Status automation + reminders",
              "DPDP consent collection link",
              "Weekly matter-health dashboard",
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
