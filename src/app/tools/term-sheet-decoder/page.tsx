"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { FileSearch, Loader2 } from "lucide-react";

import { ToolLayout } from "@/components/tools/tool-layout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const schema = z.object({
  termSheetText: z
    .string()
    .min(100, "Paste at least 100 characters of the term sheet.")
    .max(30000, "Term sheet too long."),
});

type FormValues = z.infer<typeof schema>;

export default function TermSheetDecoderLanding() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { termSheetText: "" },
  });

  async function onSubmit(values: FormValues) {
    setSubmitting(true);
    try {
      sessionStorage.setItem(
        "tool:term-sheet:input",
        JSON.stringify({ termSheetText: values.termSheetText })
      );
    } catch {}
    router.push("/tools/term-sheet-decoder/result");
  }

  return (
    <ToolLayout
      eyebrow="Free Startup Tool"
      title="Term Sheet Decoder"
      subtitle="Paste a term sheet. Get a plain-English decode, red-flag detection, and concrete negotiation levers — powered by Claude."
      badges={[
        { label: "AI engine", value: "Claude Sonnet 4.5" },
        { label: "Time", value: "~30 sec" },
        { label: "Coverage", value: "Valuation → Vetos" },
        { label: "Price", value: "Free" },
      ]}
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileSearch size={18} className="text-blue-700" />
            Paste the term sheet
          </CardTitle>
          <p className="text-sm text-slate-600">
            Paste the entire term sheet text. We don&apos;t store the content —
            it&apos;s sent to Claude for analysis only.
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <Textarea
                {...register("termSheetText")}
                placeholder="Paste the term sheet here…"
                className="min-h-[360px] font-mono text-[13px]"
              />
              {errors.termSheetText ? (
                <p className="mt-1 text-xs text-red-600">
                  {errors.termSheetText.message}
                </p>
              ) : null}
            </div>

            <div className="flex justify-end border-t border-slate-200 pt-6">
              <Button
                type="submit"
                size="lg"
                disabled={submitting}
                className="h-11 bg-blue-700 px-6 text-white hover:bg-blue-800"
              >
                {submitting ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  "Analyse term sheet →"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </ToolLayout>
  );
}
