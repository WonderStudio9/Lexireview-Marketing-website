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
  vendorName: z.string().min(1),
  vendorAddress: z.string().min(1),
  vendorState: z.string().min(1),
  customerType: z.enum(["SaaS", "Services", "Hybrid"]),
  paymentTerm: z.enum(["upfront", "monthly", "annual"]),
  sla: z.enum(["99.5%", "99.9%"]),
  dpdpApplicable: z.boolean(),
  liabilityCap: z.enum(["1x", "2x", "unlimited"]),
  governingState: z.string().min(1),
  includeArbitration: z.boolean(),
});

type FormValues = z.infer<typeof schema>;

export default function CustomerMsaLanding() {
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
      customerType: "SaaS",
      paymentTerm: "annual",
      sla: "99.9%",
      dpdpApplicable: true,
      liabilityCap: "1x",
      includeArbitration: true,
    },
  });

  async function onSubmit(values: FormValues) {
    setSubmitting(true);
    const payload = {
      vendor: {
        name: values.vendorName,
        address: values.vendorAddress,
        state: values.vendorState,
      },
      customerType: values.customerType,
      paymentTerm: values.paymentTerm,
      sla: values.sla,
      dpdpApplicable: values.dpdpApplicable,
      liabilityCap: values.liabilityCap,
      governingState: values.governingState,
      includeArbitration: values.includeArbitration,
    };
    try {
      sessionStorage.setItem(
        "tool:customer-msa:input",
        JSON.stringify(payload)
      );
    } catch {}
    router.push("/tools/customer-msa-generator/result");
  }

  return (
    <ToolLayout
      eyebrow="Free Startup Tool"
      title="Customer MSA Generator (SaaS-standard)"
      subtitle="Draft a SaaS-standard Master Services Agreement with proper DPDP compliance, SLAs, IP and data-breach notification."
      badges={[
        { label: "Customer types", value: "3" },
        { label: "SLA levels", value: "99.5% / 99.9%" },
        { label: "DPDP", value: "Act 2023" },
        { label: "Price", value: "Free" },
      ]}
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileSignature size={18} className="text-blue-700" />
            MSA details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <section>
              <h3 className="font-heading mb-3 text-sm font-semibold uppercase tracking-wider text-slate-700">
                Your company (Vendor)
              </h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label>Name *</Label>
                  <Input {...register("vendorName")} />
                  <ErrText m={errors.vendorName?.message} />
                </div>
                <div>
                  <Label>State *</Label>
                  <Controller
                    control={control}
                    name="vendorState"
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
                  <ErrText m={errors.vendorState?.message} />
                </div>
                <div className="sm:col-span-2">
                  <Label>Registered address *</Label>
                  <Input {...register("vendorAddress")} />
                  <ErrText m={errors.vendorAddress?.message} />
                </div>
              </div>
            </section>

            <section>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label>Customer / delivery type *</Label>
                  <Controller
                    control={control}
                    name="customerType"
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="SaaS">SaaS</SelectItem>
                          <SelectItem value="Services">Services</SelectItem>
                          <SelectItem value="Hybrid">Hybrid</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
                <div>
                  <Label>Payment term *</Label>
                  <Controller
                    control={control}
                    name="paymentTerm"
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="upfront">Upfront</SelectItem>
                          <SelectItem value="monthly">Monthly (in arrears)</SelectItem>
                          <SelectItem value="annual">Annual (in advance)</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
                <div>
                  <Label>SLA level *</Label>
                  <Controller
                    control={control}
                    name="sla"
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="99.5%">99.5% uptime</SelectItem>
                          <SelectItem value="99.9%">99.9% uptime</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
                <div>
                  <Label>Limitation of liability cap *</Label>
                  <Controller
                    control={control}
                    name="liabilityCap"
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1x">1× fees paid (last 12m)</SelectItem>
                          <SelectItem value="2x">2× fees paid (last 12m)</SelectItem>
                          <SelectItem value="unlimited">Unlimited</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
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
              </div>
            </section>

            <div className="grid gap-3 sm:grid-cols-2">
              <ToggleCard
                checked={watch("dpdpApplicable")}
                onChange={(v) => setValue("dpdpApplicable", v)}
                title="DPDP Act applies"
                detail="Inserts Data Processing terms per Digital Personal Data Protection Act 2023."
              />
              <ToggleCard
                checked={watch("includeArbitration")}
                onChange={(v) => setValue("includeArbitration", v)}
                title="Arbitration clause"
                detail="Disputes via arbitration (A&C Act 1996); otherwise court jurisdiction."
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
                  "Generate MSA →"
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
