"use client";

import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { Handshake, Loader2, Plus, Trash2 } from "lucide-react";

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
import { ALL_STATES_UTS } from "@/lib/tools/types";

const founderSchema = z.object({
  name: z.string().min(1, "Required"),
  pan: z.string().optional(),
  role: z.string().min(1, "Required"),
  equityPct: z.coerce.number().min(0).max(100),
  vestingYears: z.coerce.number().int().positive().max(10),
});

const schema = z.object({
  companyName: z.string().min(1),
  stateOfIncorporation: z.string().min(1),
  founders: z.array(founderSchema).min(2).max(5),
  vestingYears: z.coerce.number().int().positive().max(10),
  cliffMonths: z.coerce.number().int().nonnegative().max(36),
  includeIpAssignment: z.boolean(),
  includeNonCompete: z.boolean(),
  exitDeath: z.boolean(),
  exitDisability: z.boolean(),
  exitTerminationForCause: z.boolean(),
  exitVoluntary: z.boolean(),
});

type FormValues = z.infer<typeof schema>;

export default function FoundersAgreementLanding() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      vestingYears: 4,
      cliffMonths: 12,
      includeIpAssignment: true,
      includeNonCompete: false,
      exitDeath: true,
      exitDisability: true,
      exitTerminationForCause: true,
      exitVoluntary: true,
      founders: [
        { name: "", pan: "", role: "CEO", equityPct: 50, vestingYears: 4 },
        { name: "", pan: "", role: "CTO", equityPct: 50, vestingYears: 4 },
      ],
    },
  });

  const founders = watch("founders") ?? [];
  const ip = watch("includeIpAssignment");
  const nc = watch("includeNonCompete");

  function addFounder() {
    if (founders.length >= 5) return;
    setValue("founders", [
      ...founders,
      { name: "", pan: "", role: "", equityPct: 0, vestingYears: 4 },
    ]);
  }

  function removeFounder(i: number) {
    if (founders.length <= 2) return;
    setValue(
      "founders",
      founders.filter((_, idx) => idx !== i)
    );
  }

  async function onSubmit(values: FormValues) {
    setSubmitting(true);
    const payload = {
      companyName: values.companyName,
      stateOfIncorporation: values.stateOfIncorporation,
      founders: values.founders,
      vestingYears: values.vestingYears,
      cliffMonths: values.cliffMonths,
      includeIpAssignment: values.includeIpAssignment,
      includeNonCompete: values.includeNonCompete,
      exitScenarios: {
        death: values.exitDeath,
        disability: values.exitDisability,
        terminationForCause: values.exitTerminationForCause,
        voluntary: values.exitVoluntary,
      },
    };
    try {
      sessionStorage.setItem(
        "tool:founders-agreement:input",
        JSON.stringify(payload)
      );
    } catch {}
    router.push("/tools/founders-agreement-generator/result");
  }

  return (
    <ToolLayout
      eyebrow="Free Startup Tool"
      title="Founders Agreement Generator"
      subtitle="Draft a robust founders agreement with vesting, drag/tag-along, ROFR and IP assignment in 5 minutes. India-ready."
      badges={[
        { label: "Founders supported", value: "2 – 5" },
        { label: "Time", value: "≈ 5 min" },
        { label: "Law basis", value: "Companies Act 2013" },
        { label: "Price", value: "Free" },
      ]}
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Handshake size={18} className="text-blue-700" />
            Agreement details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <section>
              <h3 className="font-heading mb-3 text-sm font-semibold uppercase tracking-wider text-slate-700">
                Company
              </h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label>Company name *</Label>
                  <Input {...register("companyName")} placeholder="Acme Technologies Pvt Ltd" />
                  <ErrText m={errors.companyName?.message} />
                </div>
                <div>
                  <Label>State of incorporation *</Label>
                  <Controller
                    control={control}
                    name="stateOfIncorporation"
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
                  <ErrText m={errors.stateOfIncorporation?.message} />
                </div>
              </div>
            </section>

            <section>
              <div className="mb-3 flex items-center justify-between">
                <h3 className="font-heading text-sm font-semibold uppercase tracking-wider text-slate-700">
                  Founders ({founders.length})
                </h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-8"
                  onClick={addFounder}
                  disabled={founders.length >= 5}
                >
                  <Plus size={14} /> Add founder
                </Button>
              </div>
              <div className="space-y-4">
                {founders.map((_, i) => (
                  <div
                    key={i}
                    className="rounded-lg border border-slate-200 bg-slate-50 p-4"
                  >
                    <div className="mb-3 flex items-center justify-between">
                      <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Founder {i + 1}
                      </span>
                      {founders.length > 2 ? (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-7 text-red-600"
                          onClick={() => removeFounder(i)}
                        >
                          <Trash2 size={13} /> Remove
                        </Button>
                      ) : null}
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div>
                        <Label>Name *</Label>
                        <Input {...register(`founders.${i}.name` as const)} />
                      </div>
                      <div>
                        <Label>PAN</Label>
                        <Input
                          {...register(`founders.${i}.pan` as const)}
                          placeholder="ABCDE1234F"
                        />
                      </div>
                      <div>
                        <Label>Role *</Label>
                        <Input
                          {...register(`founders.${i}.role` as const)}
                          placeholder="CEO / CTO / COO"
                        />
                      </div>
                      <div>
                        <Label>Equity %</Label>
                        <Input
                          type="number"
                          step="0.01"
                          {...register(`founders.${i}.equityPct` as const)}
                        />
                      </div>
                      <div>
                        <Label>Vesting years</Label>
                        <Input
                          type="number"
                          {...register(`founders.${i}.vestingYears` as const)}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h3 className="font-heading mb-3 text-sm font-semibold uppercase tracking-wider text-slate-700">
                Vesting defaults
              </h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label>Vesting period (years)</Label>
                  <Input type="number" {...register("vestingYears")} />
                </div>
                <div>
                  <Label>Cliff (months)</Label>
                  <Input type="number" {...register("cliffMonths")} />
                </div>
              </div>
            </section>

            <section>
              <h3 className="font-heading mb-3 text-sm font-semibold uppercase tracking-wider text-slate-700">
                Protective clauses
              </h3>
              <div className="grid gap-3 sm:grid-cols-2">
                <ToggleCard
                  checked={ip}
                  onChange={(v) => setValue("includeIpAssignment", v)}
                  title="IP assignment"
                  detail="All founder-created IP vests in the Company. Highly recommended."
                />
                <ToggleCard
                  checked={nc}
                  onChange={(v) => setValue("includeNonCompete", v)}
                  title="Non-compete clause"
                  detail="Narrowly drafted per §27 of Indian Contract Act, 1872."
                />
              </div>
            </section>

            <section>
              <h3 className="font-heading mb-3 text-sm font-semibold uppercase tracking-wider text-slate-700">
                Founder exit scenarios
              </h3>
              <div className="grid gap-3 sm:grid-cols-2">
                <ExitToggle
                  label="Death"
                  value={watch("exitDeath")}
                  onChange={(v) => setValue("exitDeath", v)}
                />
                <ExitToggle
                  label="Permanent disability"
                  value={watch("exitDisability")}
                  onChange={(v) => setValue("exitDisability", v)}
                />
                <ExitToggle
                  label="Termination for cause"
                  value={watch("exitTerminationForCause")}
                  onChange={(v) => setValue("exitTerminationForCause", v)}
                />
                <ExitToggle
                  label="Voluntary exit"
                  value={watch("exitVoluntary")}
                  onChange={(v) => setValue("exitVoluntary", v)}
                />
              </div>
            </section>

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
                  "Generate agreement →"
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

function ToggleCard({
  checked,
  onChange,
  title,
  detail,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  title: string;
  detail: string;
}) {
  return (
    <label
      className={`flex cursor-pointer items-start gap-3 rounded-lg border p-4 transition-colors ${
        checked
          ? "border-blue-600 bg-blue-50"
          : "border-slate-200 bg-white hover:border-slate-300"
      }`}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-1 h-4 w-4 accent-blue-700"
      />
      <div>
        <p className="text-sm font-medium text-slate-900">{title}</p>
        <p className="text-xs text-slate-500">{detail}</p>
      </div>
    </label>
  );
}

function ExitToggle({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label
      className={`flex cursor-pointer items-center gap-3 rounded-lg border px-3 py-2 text-sm transition-colors ${
        value
          ? "border-blue-600 bg-blue-50 text-blue-900"
          : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
      }`}
    >
      <input
        type="checkbox"
        checked={value}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 accent-blue-700"
      />
      {label}
    </label>
  );
}
