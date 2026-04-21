"use client";

import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { FileSignature, Loader2 } from "lucide-react";

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
  incorporationState: z.string().min(1),
  investorName: z.string().min(1),
  investorType: z.enum(["VC", "Angel", "Corporate", "PE"]),
  purpose: z.enum(["Fundraising", "M&A", "Partnership Discussion"]),
  durationYears: z.coerce.number().int().positive().max(10),
  includeNonSolicitation: z.boolean(),
  includeNonDisparagement: z.boolean(),
  governingState: z.string().min(1),
});

type FormValues = z.infer<typeof schema>;

export default function InvestorNdaLanding() {
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
      investorType: "VC",
      purpose: "Fundraising",
      durationYears: 2,
      includeNonSolicitation: true,
      includeNonDisparagement: false,
    },
  });

  async function onSubmit(values: FormValues) {
    setSubmitting(true);
    try {
      sessionStorage.setItem("tool:investor-nda:input", JSON.stringify(values));
    } catch {}
    router.push("/tools/investor-nda-generator/result");
  }

  return (
    <ToolLayout
      eyebrow="Free Startup Tool"
      title="Investor NDA Generator"
      subtitle="Generate an investor-specific NDA for fundraising or M&A discussions. Includes portfolio carve-outs appropriate to the investor type."
      badges={[
        { label: "Investor types", value: "4" },
        { label: "Purpose", value: "Fundraise / M&A" },
        { label: "Law basis", value: "ICA / DPDP" },
        { label: "Price", value: "Free" },
      ]}
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileSignature size={18} className="text-blue-700" />
            Investor NDA details
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
                  <Label>Incorporation state *</Label>
                  <Controller
                    control={control}
                    name="incorporationState"
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
                  <ErrText m={errors.incorporationState?.message} />
                </div>
              </div>
            </section>

            <section>
              <h3 className="font-heading mb-3 text-sm font-semibold uppercase tracking-wider text-slate-700">
                Investor
              </h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label>Investor name *</Label>
                  <Input {...register("investorName")} />
                  <ErrText m={errors.investorName?.message} />
                </div>
                <div>
                  <Label>Investor type *</Label>
                  <Controller
                    control={control}
                    name="investorType"
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="VC">Venture Capital</SelectItem>
                          <SelectItem value="Angel">Angel</SelectItem>
                          <SelectItem value="Corporate">Corporate</SelectItem>
                          <SelectItem value="PE">Private Equity</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
                <div>
                  <Label>Purpose *</Label>
                  <Controller
                    control={control}
                    name="purpose"
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Fundraising">Fundraising</SelectItem>
                          <SelectItem value="M&A">M&A</SelectItem>
                          <SelectItem value="Partnership Discussion">
                            Partnership Discussion
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
                <div>
                  <Label>Duration (years) *</Label>
                  <Input type="number" {...register("durationYears")} />
                </div>
              </div>
            </section>

            <div>
              <Label>Governing state *</Label>
              <Controller
                control={control}
                name="governingState"
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
              <ErrText m={errors.governingState?.message} />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <ToggleCard
                checked={watch("includeNonSolicitation")}
                onChange={(v) => setValue("includeNonSolicitation", v)}
                title="Include non-solicitation"
                detail="12-month non-solicitation of Company employees known via disclosure."
              />
              <ToggleCard
                checked={watch("includeNonDisparagement")}
                onChange={(v) => setValue("includeNonDisparagement", v)}
                title="Include non-disparagement"
                detail="Prevents public disparaging of the Company, its founders or products."
              />
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
                  "Generate NDA →"
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
