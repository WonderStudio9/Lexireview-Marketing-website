"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { FileSearch, Loader2 } from "lucide-react";

import { ToolLayout } from "@/components/tools/tool-layout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function OfferLetterDecoderLanding() {
  const router = useRouter();
  const [text, setText] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    if (text.trim().length < 50) {
      setErr("Please paste the full offer letter (at least 50 characters).");
      return;
    }
    if (text.length > 20000) {
      setErr("Offer letter is too long. Trim to under 20,000 characters.");
      return;
    }
    setSubmitting(true);
    try {
      sessionStorage.setItem(
        "tool:offer-letter:input",
        JSON.stringify({ offerText: text })
      );
    } catch {}
    router.push("/tools/offer-letter-decoder/result");
  }

  return (
    <ToolLayout
      eyebrow="Free Citizen Tool"
      title="Offer Letter Decoder"
      subtitle="Paste your offer letter. We'll flag red flags, decode your real in-hand salary, and give you negotiation levers — powered by AI trained on Indian employment law."
      badges={[
        { label: "Analyzes", value: "Any CTC" },
        { label: "Time", value: "~30 sec" },
        { label: "Coverage", value: "ICA §27 aware" },
        { label: "Price", value: "Free" },
      ]}
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileSearch size={18} className="text-blue-700" />
            Paste offer letter
          </CardTitle>
          <p className="text-sm text-slate-600">
            Don&apos;t worry — we don&apos;t store your offer letter text. Only
            the analysis output is saved.
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            <Textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste the full offer letter, appointment letter or employment contract here..."
              className="min-h-[320px] font-mono text-[13px]"
            />
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>{text.length.toLocaleString("en-IN")} characters</span>
              <span>20,000 max</span>
            </div>
            {err ? <p className="text-xs text-red-600">{err}</p> : null}
            <div className="flex justify-end border-t border-slate-200 pt-4">
              <Button
                type="submit"
                size="lg"
                disabled={submitting}
                className="h-11 bg-blue-700 px-6 text-white hover:bg-blue-800"
              >
                {submitting ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  "Decode my offer →"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </ToolLayout>
  );
}
