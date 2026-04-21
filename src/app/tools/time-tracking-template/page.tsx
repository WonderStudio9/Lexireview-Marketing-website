"use client";

import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { Clock, Loader2 } from "lucide-react";

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
import { PRACTICE_AREAS } from "@/lib/tools/types";

const schema = z.object({
  billingModel: z.enum(["Hourly", "Flat", "Mixed"]),
  baseHourlyRate: z.coerce.number().int().nonnegative(),
  practiceArea: z.enum(PRACTICE_AREAS),
  numLawyers: z.coerce.number().int().min(1).max(5),
  includeParalegal: z.boolean(),
  roundingRule: z.enum(["6-min", "15-min", "30-min"]),
  includeNonBillable: z.boolean(),
});

type FormValues = z.infer<typeof schema>;

export default function TimeTrackingLanding() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    control,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      billingModel: "Hourly",
      baseHourlyRate: 2500,
      practiceArea: "Litigation",
      numLawyers: 1,
      includeParalegal: false,
      roundingRule: "6-min",
      includeNonBillable: true,
    },
  });

  async function onSubmit(values: FormValues) {
    setSubmitting(true);
    try {
      sessionStorage.setItem(
        "tool:time-tracking:input",
        JSON.stringify(values)
      );
    } catch {}
    router.push("/tools/time-tracking-template/result");
  }

  return (
    <ToolLayout
      eyebrow="For Solo Lawyers"
      title="Time Tracking Template Generator"
      subtitle="A CSV time-sheet calibrated to your billing model, practice area and rounding rule. Drop it into Google Sheets and start billing."
      badges={[
        { label: "Billing models", value: "3" },
        { label: "Rounding rules", value: "6 / 15 / 30 min" },
        { label: "Price", value: "Free" },
        { label: "Output", value: "CSV + guide" },
      ]}
    >
      <Card className="mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock size={18} className="text-blue-700" />
            Your billing inputs
          </CardTitle>
          <p className="text-sm text-slate-600">
            We&apos;ll produce a ready-to-open CSV template with sample rows
            and usage notes.
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
                  <Label>Billing model *</Label>
                  <Controller
                    control={control}
                    name="billingModel"
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Hourly">Hourly</SelectItem>
                          <SelectItem value="Flat">Flat</SelectItem>
                          <SelectItem value="Mixed">Mixed</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
                <div>
                  <Label>Base hourly rate (₹) *</Label>
                  <Input
                    type="number"
                    {...register("baseHourlyRate")}
                    placeholder="2500"
                  />
                </div>
                <div>
                  <Label>Number of lawyers (1-5) *</Label>
                  <Input
                    type="number"
                    {...register("numLawyers")}
                    placeholder="1"
                    min={1}
                    max={5}
                  />
                </div>
                <div>
                  <Label>Time rounding rule *</Label>
                  <Controller
                    control={control}
                    name="roundingRule"
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="6-min">
                            6-min (industry standard)
                          </SelectItem>
                          <SelectItem value="15-min">15-min</SelectItem>
                          <SelectItem value="30-min">30-min</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
              </div>
            </section>

            <section>
              <h3 className="font-heading mb-3 text-sm font-semibold text-slate-700 uppercase tracking-wider">
                Include
              </h3>
              <div className="space-y-3">
                <Controller
                  control={control}
                  name="includeParalegal"
                  render={({ field }) => (
                    <ToggleRow
                      checked={field.value}
                      onChange={field.onChange}
                      title="Include paralegal time"
                      desc="Adds a paralegal timekeeper row at ~30% of base hourly rate."
                    />
                  )}
                />
                <Controller
                  control={control}
                  name="includeNonBillable"
                  render={({ field }) => (
                    <ToggleRow
                      checked={field.value}
                      onChange={field.onChange}
                      title="Include non-billable categories"
                      desc="Business development, firm admin, CPD, pro bono (for utilisation reporting)."
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
                  "Generate template →"
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
