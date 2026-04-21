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
  agreementText: z
    .string()
    .min(200, "Paste at least 200 characters of the agreement.")
    .max(30000, "Agreement text exceeds 30,000 characters."),
});

type FormValues = z.infer<typeof schema>;

export default function BuilderBuyerAnalyzerLanding() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { agreementText: "" },
  });

  async function onSubmit(values: FormValues) {
    setSubmitting(true);
    try {
      sessionStorage.setItem(
        "tool:builder-buyer-analyzer:input",
        JSON.stringify({ agreementText: values.agreementText })
      );
    } catch {}
    router.push("/tools/builder-buyer-agreement-analyzer/result");
  }

  return (
    <ToolLayout
      eyebrow="Free Developer Tool"
      title="Builder-Buyer Agreement Analyzer"
      subtitle="Paste the agreement. Claude identifies clauses, checks Section 18 / 13 / 14 / 19 compliance under RERA, and flags common red flags."
      badges={[
        { label: "AI engine", value: "Claude Sonnet 4.5" },
        { label: "Time", value: "~30 sec" },
        { label: "RERA sections", value: "13, 14, 18, 19" },
        { label: "Price", value: "Free" },
      ]}
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileSearch size={18} className="text-blue-700" />
            Paste the Builder-Buyer Agreement
          </CardTitle>
          <p className="text-sm text-slate-600">
            Paste the entire agreement text. We don&apos;t store content — it&apos;s
            sent to Claude for analysis only.
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <Textarea
                {...register("agreementText")}
                placeholder="Paste the Builder-Buyer Agreement text here…"
                className="min-h-[360px] font-mono text-[13px]"
              />
              {errors.agreementText ? (
                <p className="mt-1 text-xs text-red-600">
                  {errors.agreementText.message}
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
                  "Analyse agreement →"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </ToolLayout>
  );
}
