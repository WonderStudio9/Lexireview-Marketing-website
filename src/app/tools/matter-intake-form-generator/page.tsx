"use client";

import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { FileText, Loader2 } from "lucide-react";

import { ToolLayout } from "@/components/tools/tool-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ALL_STATES_UTS,
  PRACTICE_AREAS,
  BILLING_MODELS,
} from "@/lib/tools/types";

const schema = z.object({
  practiceArea: z.enum(PRACTICE_AREAS),
  firmName: z.string().min(1, "Firm name is required"),
  lawyerName: z.string().min(1, "Lawyer name is required"),
  state: z.string().min(1, "State is required"),
  billingModel: z.enum(BILLING_MODELS),
  includeConflictChecks: z.boolean(),
  includeKyc: z.boolean(),
});

type FormValues = z.infer<typeof schema>;

export default function MatterIntakeLanding() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      practiceArea: "Litigation",
      billingModel: "Hourly",
      includeConflictChecks: true,
      includeKyc: false,
    },
  });

  async function onSubmit(values: FormValues) {
    setSubmitting(true);
    try {
      sessionStorage.setItem(
        "tool:matter-intake:input",
        JSON.stringify(values)
      );
    } catch {}
    router.push("/tools/matter-intake-form-generator/result");
  }

  return (
    <ToolLayout
      eyebrow="For Solo Lawyers"
      title="Matter Intake Form Generator"
      subtitle="A customised client intake form for your solo or small-firm practice. Covers conflict checks, KYC and DPDP consent."
      badges={[
        { label: "Practice areas", value: "9" },
        { label: "Time to draft", value: "≈ 2 min" },
        { label: "Price", value: "Free" },
        { label: "Output", value: "Printable form" },
      ]}
    >
      <Card className="mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText size={18} className="text-blue-700" />
            Tell us about your practice
          </CardTitle>
          <p className="text-sm text-slate-600">
            We&apos;ll turn this into a ready-to-use client matter intake form
            on the next screen.
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <section>
              <h3 className="font-heading mb-3 text-sm font-semibold text-slate-700 uppercase tracking-wider">
                Practice
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
                  <Label>State of practice *</Label>
                  <Controller
                    control={control}
                    name="state"
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select state" />
                        </SelectTrigger>
                        <SelectContent>
                          {ALL_STATES_UTS.map((s) => (
                            <SelectItem key={s} value={s}>
                              {s}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  <ErrText m={errors.state?.message} />
                </div>
              </div>
            </section>

            <section>
              <h3 className="font-heading mb-3 text-sm font-semibold text-slate-700 uppercase tracking-wider">
                Firm
              </h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label>Firm name *</Label>
                  <Input
                    {...register("firmName")}
                    placeholder="e.g. Mehta & Co., Advocates"
                  />
                  <ErrText m={errors.firmName?.message} />
                </div>
                <div>
                  <Label>Lead lawyer name *</Label>
                  <Input
                    {...register("lawyerName")}
                    placeholder="e.g. Adv. Priya Mehta"
                  />
                  <ErrText m={errors.lawyerName?.message} />
                </div>
                <div>
                  <Label>Default billing model *</Label>
                  <Controller
                    control={control}
                    name="billingModel"
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {BILLING_MODELS.map((b) => (
                            <SelectItem key={b} value={b}>
                              {b}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
              </div>
            </section>

            <section>
              <h3 className="font-heading mb-3 text-sm font-semibold text-slate-700 uppercase tracking-wider">
                Sections to include
              </h3>
              <div className="space-y-3">
                <Controller
                  control={control}
                  name="includeConflictChecks"
                  render={({ field }) => (
                    <ToggleRow
                      checked={field.value}
                      onChange={field.onChange}
                      title="Include conflict-check questions"
                      desc="Required under Bar Council of India Rule 33. Recommended for all matters."
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
                      title="Include KYC fields (PAN / Aadhaar masked)"
                      desc="Collects basic identity + explicit DPDP consent. Enable if you handle corporate or tax matters."
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
                  "Generate intake form →"
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

function ErrText({ m }: { m?: string }) {
  if (!m) return null;
  return <p className="mt-1 text-xs text-red-600">{m}</p>;
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
