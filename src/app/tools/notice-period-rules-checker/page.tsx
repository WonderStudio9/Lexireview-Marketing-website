"use client";

import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { Briefcase, Loader2 } from "lucide-react";

import { ToolLayout } from "@/components/tools/tool-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
  state: z.string().min(1, "Required"),
  employeeType: z.enum(["Permanent", "Probation", "Contract"]),
  tenureMonths: z.coerce.number().int().nonnegative().max(600),
  industry: z.enum([
    "IT / ITES",
    "Manufacturing",
    "Services",
    "BFSI",
    "Healthcare",
    "Retail",
    "Other",
  ]),
  contractClause: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export default function NoticePeriodLanding() {
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
      employeeType: "Permanent",
      industry: "IT / ITES",
      tenureMonths: 12,
    },
  });

  async function onSubmit(values: FormValues) {
    setSubmitting(true);
    try {
      sessionStorage.setItem("tool:notice-period:input", JSON.stringify(values));
    } catch {}
    router.push("/tools/notice-period-rules-checker/result");
  }

  return (
    <ToolLayout
      eyebrow="Free Citizen Tool"
      title="Notice Period Rules Checker"
      subtitle="Find out what notice your employer can actually enforce in your state and industry, and whether non-compete / garden leave clauses are valid."
      badges={[
        { label: "States covered", value: "28 + 8 UTs" },
        { label: "Employee types", value: "3" },
        { label: "Non-compete check", value: "Section 27 ICA" },
        { label: "Price", value: "Free" },
      ]}
    >
      <Card className="mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Briefcase size={18} className="text-blue-700" />
            Your employment details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label>Your state *</Label>
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
              <div>
                <Label>Employee type *</Label>
                <Controller
                  control={control}
                  name="employeeType"
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Permanent">Permanent</SelectItem>
                        <SelectItem value="Probation">Probation</SelectItem>
                        <SelectItem value="Contract">Contract</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
              <div>
                <Label>Tenure so far (months) *</Label>
                <Input
                  type="number"
                  {...register("tenureMonths")}
                  placeholder="18"
                />
                <ErrText m={errors.tenureMonths?.message} />
              </div>
              <div>
                <Label>Industry *</Label>
                <Controller
                  control={control}
                  name="industry"
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="IT / ITES">IT / ITES</SelectItem>
                        <SelectItem value="Manufacturing">Manufacturing</SelectItem>
                        <SelectItem value="Services">Services</SelectItem>
                        <SelectItem value="BFSI">BFSI</SelectItem>
                        <SelectItem value="Healthcare">Healthcare</SelectItem>
                        <SelectItem value="Retail">Retail</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
              <div className="sm:col-span-2">
                <Label>
                  Paste your contract notice clause (optional)
                </Label>
                <Textarea
                  rows={4}
                  {...register("contractClause")}
                  placeholder='e.g. "Either party may terminate by giving 90 days prior written notice..."'
                />
              </div>
            </div>

            <div className="flex flex-col gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-slate-500">
                We&apos;ll show you the statutory minimum, contract vs statute,
                and non-compete analysis.
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
                  "Check my rules →"
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
