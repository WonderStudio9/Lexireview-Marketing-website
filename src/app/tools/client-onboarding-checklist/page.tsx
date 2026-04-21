"use client";

import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { ListChecks, Loader2 } from "lucide-react";

import { ToolLayout } from "@/components/tools/tool-layout";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PRACTICE_AREAS } from "@/lib/tools/types";

const schema = z.object({
  practiceArea: z.enum(PRACTICE_AREAS),
  includeKyc: z.boolean(),
  includeDpdp: z.boolean(),
  includeConflictCheck: z.boolean(),
  includeFeeAdvance: z.boolean(),
  complexity: z.enum(["Simple", "Medium", "Complex"]),
});

type FormValues = z.infer<typeof schema>;

export default function OnboardingChecklistLanding() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const {
    handleSubmit,
    control,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      practiceArea: "Litigation",
      includeKyc: false,
      includeDpdp: true,
      includeConflictCheck: true,
      includeFeeAdvance: false,
      complexity: "Medium",
    },
  });

  async function onSubmit(values: FormValues) {
    setSubmitting(true);
    try {
      sessionStorage.setItem(
        "tool:onboarding-checklist:input",
        JSON.stringify(values)
      );
    } catch {}
    router.push("/tools/client-onboarding-checklist/result");
  }

  return (
    <ToolLayout
      eyebrow="For Solo Lawyers"
      title="Client Onboarding Checklist Generator"
      subtitle="A step-by-step onboarding checklist calibrated to your practice area and matter complexity. DPDP, KYC and conflict checks baked in."
      badges={[
        { label: "Practice areas", value: "9" },
        { label: "Steps", value: "10–20" },
        { label: "Price", value: "Free" },
        { label: "Output", value: "Text + steps" },
      ]}
    >
      <Card className="mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ListChecks size={18} className="text-blue-700" />
            Your workflow inputs
          </CardTitle>
          <p className="text-sm text-slate-600">
            We&apos;ll generate an ordered, estimated-time onboarding playbook
            on the next screen.
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <section>
              <h3 className="font-heading mb-3 text-sm font-semibold text-slate-700 uppercase tracking-wider">
                Matter
              </h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label>Practice area *</Label>
                  <Controller
                    control={control}
                    name="practiceArea"
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {PRACTICE_AREAS.map((p) => (
                            <SelectItem key={p} value={p}>
                              {p}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
                <div>
                  <Label>Matter complexity *</Label>
                  <Controller
                    control={control}
                    name="complexity"
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Simple">Simple</SelectItem>
                          <SelectItem value="Medium">Medium</SelectItem>
                          <SelectItem value="Complex">Complex</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
              </div>
            </section>

            <section>
              <h3 className="font-heading mb-3 text-sm font-semibold text-slate-700 uppercase tracking-wider">
                Checklist options
              </h3>
              <div className="space-y-3">
                <Controller
                  control={control}
                  name="includeConflictCheck"
                  render={({ field }) => (
                    <ToggleRow
                      checked={field.value}
                      onChange={field.onChange}
                      title="Include conflict check step"
                      desc="Required under BCI Rule 33. Recommended."
                    />
                  )}
                />
                <Controller
                  control={control}
                  name="includeDpdp"
                  render={({ field }) => (
                    <ToggleRow
                      checked={field.value}
                      onChange={field.onChange}
                      title="Include DPDP Act consent step"
                      desc="Collects explicit client consent for data processing (default ON)."
                    />
                  )}
                />
                <Controller
                  control={control}
                  name="includeKyc"
                  render={({ field }) => (
                    <ToggleRow
                      checked={field.value}
                      onChange={field.onChange}
                      title="Include KYC / PMLA checks"
                      desc="Add identity verification + beneficial ownership declaration."
                    />
                  )}
                />
                <Controller
                  control={control}
                  name="includeFeeAdvance"
                  render={({ field }) => (
                    <ToggleRow
                      checked={field.value}
                      onChange={field.onChange}
                      title="Include fee-advance invoice step"
                      desc="Raise a proforma or tax invoice as part of onboarding."
                    />
                  )}
                />
              </div>
            </section>

            <div className="flex flex-col gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-slate-500">
                We&apos;ll email you a copy on the next page.
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
                  "Generate checklist →"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </ToolLayout>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <label className="mb-1 block text-xs font-medium text-slate-700">
      {children}
    </label>
  );
}

function ToggleRow({
  checked,
  onChange,
  title,
  desc,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  title: string;
  desc: string;
}) {
  return (
    <label
      className={`flex cursor-pointer items-start gap-3 rounded-lg border px-4 py-3 transition-colors ${
        checked
          ? "border-blue-600 bg-blue-50"
          : "border-slate-200 bg-white hover:border-slate-300"
      }`}
    >
      <input
        type="checkbox"
        className="mt-0.5 h-4 w-4 accent-blue-700"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <div>
        <div className="text-sm font-medium text-slate-900">{title}</div>
        <div className="text-xs text-slate-600">{desc}</div>
      </div>
    </label>
  );
}
