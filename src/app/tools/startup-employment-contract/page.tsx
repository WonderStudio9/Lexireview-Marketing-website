"use client";

import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { Briefcase, Loader2 } from "lucide-react";

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

const schema = z.object({
  companyName: z.string().min(1),
  companyAddress: z.string().min(1),
  empName: z.string().min(1),
  empPan: z.string().optional(),
  empDesignation: z.string().min(1),
  empState: z.string().min(1),
  employmentType: z.enum(["Full-time", "Part-time", "Contract", "Intern"]),
  basic: z.coerce.number().nonnegative(),
  hra: z.coerce.number().nonnegative(),
  specialAllowance: z.coerce.number().nonnegative(),
  variable: z.coerce.number().nonnegative(),
  esopCount: z.coerce.number().nonnegative().optional(),
  joiningBonus: z.coerce.number().nonnegative(),
  joiningBonusClawbackMonths: z.coerce.number().int().nonnegative().max(36),
  noticePeriodDays: z.enum(["30", "60", "90"]),
  includeNonCompete: z.boolean(),
  includeNonSolicitation: z.boolean(),
  includeIpAssignment: z.boolean(),
  gardenLeave: z.boolean(),
  joiningDate: z.string().min(1),
});

type FormValues = z.infer<typeof schema>;

export default function StartupEmploymentLanding() {
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
      employmentType: "Full-time",
      noticePeriodDays: "60",
      includeIpAssignment: true,
      includeNonSolicitation: true,
      includeNonCompete: false,
      gardenLeave: false,
      basic: 0,
      hra: 0,
      specialAllowance: 0,
      variable: 0,
      joiningBonus: 0,
      joiningBonusClawbackMonths: 12,
    },
  });

  async function onSubmit(values: FormValues) {
    setSubmitting(true);
    const payload = {
      companyName: values.companyName,
      companyAddress: values.companyAddress,
      employee: {
        name: values.empName,
        pan: values.empPan,
        designation: values.empDesignation,
        state: values.empState,
      },
      employmentType: values.employmentType,
      ctc: {
        basic: values.basic,
        hra: values.hra,
        specialAllowance: values.specialAllowance,
        variable: values.variable,
        esopCount: values.esopCount,
      },
      joiningBonus: values.joiningBonus,
      joiningBonusClawbackMonths: values.joiningBonusClawbackMonths,
      noticePeriodDays: Number(values.noticePeriodDays) as 30 | 60 | 90,
      includeNonCompete: values.includeNonCompete,
      includeNonSolicitation: values.includeNonSolicitation,
      includeIpAssignment: values.includeIpAssignment,
      gardenLeave: values.gardenLeave,
      joiningDate: values.joiningDate,
    };
    try {
      sessionStorage.setItem(
        "tool:startup-employment:input",
        JSON.stringify(payload)
      );
    } catch {}
    router.push("/tools/startup-employment-contract/result");
  }

  return (
    <ToolLayout
      eyebrow="Free Startup Tool"
      title="Startup Employment Contract Generator"
      subtitle="Generate a complete employment contract for a startup hire — compliant with the new Labour Codes, DPDP and POSH."
      badges={[
        { label: "Types", value: "FT / PT / Contract / Intern" },
        { label: "Clauses", value: "15+" },
        { label: "Law basis", value: "Labour Codes 2019-20" },
        { label: "Price", value: "Free" },
      ]}
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Briefcase size={18} className="text-blue-700" />
            Employment contract details
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
                  <Input {...register("companyName")} />
                  <ErrText m={errors.companyName?.message} />
                </div>
                <div>
                  <Label>Company registered address *</Label>
                  <Input {...register("companyAddress")} />
                  <ErrText m={errors.companyAddress?.message} />
                </div>
              </div>
            </section>

            <section>
              <h3 className="font-heading mb-3 text-sm font-semibold uppercase tracking-wider text-slate-700">
                Employee
              </h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label>Name *</Label>
                  <Input {...register("empName")} />
                  <ErrText m={errors.empName?.message} />
                </div>
                <div>
                  <Label>PAN</Label>
                  <Input {...register("empPan")} placeholder="ABCDE1234F" />
                </div>
                <div>
                  <Label>Designation *</Label>
                  <Input {...register("empDesignation")} />
                  <ErrText m={errors.empDesignation?.message} />
                </div>
                <div>
                  <Label>State *</Label>
                  <Controller
                    control={control}
                    name="empState"
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
                  <ErrText m={errors.empState?.message} />
                </div>
                <div>
                  <Label>Employment type *</Label>
                  <Controller
                    control={control}
                    name="employmentType"
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Full-time">Full-time</SelectItem>
                          <SelectItem value="Part-time">Part-time</SelectItem>
                          <SelectItem value="Contract">Contract</SelectItem>
                          <SelectItem value="Intern">Intern</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
                <div>
                  <Label>Joining date *</Label>
                  <Input type="date" {...register("joiningDate")} />
                </div>
              </div>
            </section>

            <section>
              <h3 className="font-heading mb-3 text-sm font-semibold uppercase tracking-wider text-slate-700">
                CTC breakdown (annual ₹)
              </h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label>Basic *</Label>
                  <Input type="number" {...register("basic")} />
                </div>
                <div>
                  <Label>HRA *</Label>
                  <Input type="number" {...register("hra")} />
                </div>
                <div>
                  <Label>Special allowance</Label>
                  <Input type="number" {...register("specialAllowance")} />
                </div>
                <div>
                  <Label>Variable pay</Label>
                  <Input type="number" {...register("variable")} />
                </div>
                <div>
                  <Label>ESOP options (count, optional)</Label>
                  <Input type="number" {...register("esopCount")} />
                </div>
              </div>
            </section>

            <section>
              <h3 className="font-heading mb-3 text-sm font-semibold uppercase tracking-wider text-slate-700">
                Joining bonus & notice
              </h3>
              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <Label>Joining bonus (₹)</Label>
                  <Input type="number" {...register("joiningBonus")} />
                </div>
                <div>
                  <Label>Clawback period (months)</Label>
                  <Input
                    type="number"
                    {...register("joiningBonusClawbackMonths")}
                  />
                </div>
                <div>
                  <Label>Notice period *</Label>
                  <Controller
                    control={control}
                    name="noticePeriodDays"
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="30">30 days</SelectItem>
                          <SelectItem value="60">60 days</SelectItem>
                          <SelectItem value="90">90 days</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
              </div>
            </section>

            <section>
              <h3 className="font-heading mb-3 text-sm font-semibold uppercase tracking-wider text-slate-700">
                Clauses
              </h3>
              <div className="grid gap-3 sm:grid-cols-2">
                <ToggleCard
                  checked={watch("includeIpAssignment")}
                  onChange={(v) => setValue("includeIpAssignment", v)}
                  title="IP assignment"
                  detail="All employee-created IP vests in Company. Highly recommended."
                />
                <ToggleCard
                  checked={watch("includeNonSolicitation")}
                  onChange={(v) => setValue("includeNonSolicitation", v)}
                  title="Non-solicitation"
                  detail="12-month post-termination non-solicitation. Enforceable in India."
                />
                <ToggleCard
                  checked={watch("includeNonCompete")}
                  onChange={(v) => setValue("includeNonCompete", v)}
                  title="Non-compete"
                  detail="Narrowly drafted per §27 ICA 1872. Largely unenforceable post-termination."
                />
                <ToggleCard
                  checked={watch("gardenLeave")}
                  onChange={(v) => setValue("gardenLeave", v)}
                  title="Garden leave option"
                  detail="Allows Company to place employee on paid leave during notice."
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
                  "Generate contract →"
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
