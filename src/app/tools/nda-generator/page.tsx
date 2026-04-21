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
  ndaType: z.enum(["Mutual", "One-Way", "Employee-Employer", "Investor", "Vendor"]),
  dpName: z.string().min(1),
  dpAddress: z.string().min(1),
  dpEntity: z.string().min(1),
  rpName: z.string().min(1),
  rpAddress: z.string().min(1),
  rpEntity: z.string().min(1),
  purpose: z.string().min(5),
  durationYears: z.coerce.number().int().positive().max(20),
  governingState: z.string().min(1),
  includeNonCompete: z.boolean(),
  includeNonSolicitation: z.boolean(),
});

type FormValues = z.infer<typeof schema>;

export default function NdaLanding() {
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
      ndaType: "Mutual",
      durationYears: 2,
      includeNonCompete: false,
      includeNonSolicitation: false,
    },
  });

  const nc = watch("includeNonCompete");
  const ns = watch("includeNonSolicitation");

  async function onSubmit(values: FormValues) {
    setSubmitting(true);
    const payload = {
      ndaType: values.ndaType,
      disclosingParty: {
        name: values.dpName,
        address: values.dpAddress,
        entityType: values.dpEntity,
      },
      receivingParty: {
        name: values.rpName,
        address: values.rpAddress,
        entityType: values.rpEntity,
      },
      purpose: values.purpose,
      durationYears: values.durationYears,
      governingState: values.governingState,
      includeNonCompete: values.includeNonCompete,
      includeNonSolicitation: values.includeNonSolicitation,
    };
    try {
      sessionStorage.setItem("tool:nda:input", JSON.stringify(payload));
    } catch {}
    router.push("/tools/nda-generator/result");
  }

  return (
    <ToolLayout
      eyebrow="Free Citizen Tool"
      title="NDA Generator"
      subtitle="Create a clean, Indian-law-ready Non-Disclosure Agreement in 2 minutes. Mutual, one-way, employee, investor or vendor — with optional non-compete & non-solicitation."
      badges={[
        { label: "NDA variants", value: "5" },
        { label: "Time", value: "~2 min" },
        { label: "Law basis", value: "ICA §27 aware" },
        { label: "Price", value: "Free" },
      ]}
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileSignature size={18} className="text-blue-700" />
            NDA details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <Label>NDA type *</Label>
              <Controller
                control={control}
                name="ndaType"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Mutual">Mutual</SelectItem>
                      <SelectItem value="One-Way">One-Way</SelectItem>
                      <SelectItem value="Employee-Employer">
                        Employee-Employer
                      </SelectItem>
                      <SelectItem value="Investor">Investor</SelectItem>
                      <SelectItem value="Vendor">Vendor</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            {/* Disclosing party */}
            <section>
              <h3 className="font-heading mb-3 text-sm font-semibold uppercase tracking-wider text-slate-700">
                Disclosing party
              </h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label>Name *</Label>
                  <Input {...register("dpName")} />
                  <ErrText m={errors.dpName?.message} />
                </div>
                <div>
                  <Label>Entity type *</Label>
                  <Input
                    {...register("dpEntity")}
                    placeholder="Private Limited Company / Individual"
                  />
                  <ErrText m={errors.dpEntity?.message} />
                </div>
                <div className="sm:col-span-2">
                  <Label>Address *</Label>
                  <Input {...register("dpAddress")} />
                  <ErrText m={errors.dpAddress?.message} />
                </div>
              </div>
            </section>

            {/* Receiving party */}
            <section>
              <h3 className="font-heading mb-3 text-sm font-semibold uppercase tracking-wider text-slate-700">
                Receiving party
              </h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label>Name *</Label>
                  <Input {...register("rpName")} />
                  <ErrText m={errors.rpName?.message} />
                </div>
                <div>
                  <Label>Entity type *</Label>
                  <Input {...register("rpEntity")} />
                  <ErrText m={errors.rpEntity?.message} />
                </div>
                <div className="sm:col-span-2">
                  <Label>Address *</Label>
                  <Input {...register("rpAddress")} />
                  <ErrText m={errors.rpAddress?.message} />
                </div>
              </div>
            </section>

            <section>
              <Label>Purpose of disclosure *</Label>
              <Textarea
                {...register("purpose")}
                placeholder="Describe why the parties are sharing confidential information…"
                className="min-h-[100px]"
              />
              <ErrText m={errors.purpose?.message} />
            </section>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label>Duration of confidentiality (years) *</Label>
                <Input
                  type="number"
                  {...register("durationYears")}
                  placeholder="2"
                />
                <ErrText m={errors.durationYears?.message} />
              </div>
              <div>
                <Label>Governing state *</Label>
                <Controller
                  control={control}
                  name="governingState"
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                    >
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

            <div className="grid gap-3 sm:grid-cols-2">
              <label
                className={`flex cursor-pointer items-start gap-3 rounded-lg border p-4 transition-colors ${
                  nc
                    ? "border-blue-600 bg-blue-50"
                    : "border-slate-200 bg-white hover:border-slate-300"
                }`}
              >
                <input
                  type="checkbox"
                  checked={nc}
                  onChange={(e) =>
                    setValue("includeNonCompete", e.target.checked)
                  }
                  className="mt-1 h-4 w-4 accent-blue-700"
                />
                <div>
                  <p className="text-sm font-medium text-slate-900">
                    Include non-compete clause
                  </p>
                  <p className="text-xs text-slate-500">
                    Narrowly drafted per Section 27 ICA. Post-termination
                    non-competes are largely unenforceable in India.
                  </p>
                </div>
              </label>

              <label
                className={`flex cursor-pointer items-start gap-3 rounded-lg border p-4 transition-colors ${
                  ns
                    ? "border-blue-600 bg-blue-50"
                    : "border-slate-200 bg-white hover:border-slate-300"
                }`}
              >
                <input
                  type="checkbox"
                  checked={ns}
                  onChange={(e) =>
                    setValue("includeNonSolicitation", e.target.checked)
                  }
                  className="mt-1 h-4 w-4 accent-blue-700"
                />
                <div>
                  <p className="text-sm font-medium text-slate-900">
                    Include non-solicitation clause
                  </p>
                  <p className="text-xs text-slate-500">
                    Restricts soliciting employees/customers using confidential
                    information.
                  </p>
                </div>
              </label>
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
