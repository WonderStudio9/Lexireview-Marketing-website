"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { FileSearch, Loader2, Sparkles } from "lucide-react";

import { ToolLayout } from "@/components/tools/tool-layout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const schema = z.object({
  salaryText: z
    .string()
    .min(20, "Please paste a bit more detail (min 20 chars)")
    .max(20000, "Too long — trim to under 20,000 chars"),
});

type FormValues = z.infer<typeof schema>;

export default function SalaryAnalyzerLanding() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  async function onSubmit(values: FormValues) {
    setSubmitting(true);
    try {
      sessionStorage.setItem(
        "tool:salary-structure:input",
        JSON.stringify(values)
      );
    } catch {}
    router.push("/tools/salary-structure-analyzer/result");
  }

  return (
    <ToolLayout
      eyebrow="AI-powered — Free"
      title="Salary Structure Analyzer"
      subtitle="Paste your salary breakup or CTC components. Our AI restructures it for maximum in-hand pay, with HRA, LTA, NPS and standard deduction tuned for India."
      badges={[
        { label: "Regime", value: "New + Old" },
        { label: "Components", value: "15+" },
        { label: "Under", value: "30 sec" },
        { label: "Price", value: "Free" },
      ]}
    >
      <Card className="mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileSearch size={18} className="text-blue-700" />
            Paste your salary structure
          </CardTitle>
          <p className="text-sm text-slate-600">
            You can paste your offer letter CTC section, a payslip, or simply
            list components (basic, HRA, special allowance, etc.) with amounts.
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-700">
                Your salary breakup *
              </label>
              <Textarea
                rows={14}
                {...register("salaryText")}
                placeholder={`e.g.
Basic: ₹40,000/mo
HRA: ₹20,000/mo
Special Allowance: ₹25,000/mo
PF employer contribution: ₹1,800/mo
Variable: ₹5L p.a.
Total CTC: ₹15L p.a.
Current rent I pay: ₹18,000/mo in Bangalore`}
              />
              {errors.salaryText?.message ? (
                <p className="mt-1 text-xs text-red-600">
                  {errors.salaryText.message}
                </p>
              ) : null}
            </div>

            <div className="flex flex-col gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
              <p className="flex items-center gap-1.5 text-xs text-slate-500">
                <Sparkles size={12} className="text-blue-700" />
                AI-generated suggestions — review with your HR / CA before
                acting.
              </p>
              <Button
                type="submit"
                size="lg"
                disabled={submitting}
                className="h-11 bg-blue-700 px-6 text-white hover:bg-blue-800"
              >
                {submitting ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  "Analyse my salary →"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </ToolLayout>
  );
}
