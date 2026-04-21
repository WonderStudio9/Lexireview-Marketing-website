"use client";

import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { Handshake, Loader2, Plus, X } from "lucide-react";

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

const partnerSchema = z.object({
  name: z.string().min(1),
  address: z.string().min(1),
  pan: z.string().optional(),
  profitSharePct: z.coerce.number().nonnegative().max(100),
  capitalContribution: z.coerce.number().int().nonnegative(),
});

const schema = z.object({
  firmName: z.string().min(1),
  businessNature: z.string().min(3),
  state: z.string().min(1),
  city: z.string().min(1),
  bankName: z.string().min(1),
  duration: z.enum(["Fixed Term", "At Will"]),
  fixedTermYears: z.coerce.number().int().positive().max(99).optional(),
  commencementDate: z.string().min(1),
  partners: z.array(partnerSchema).min(2).max(5),
});

type FormValues = z.infer<typeof schema>;

export default function PartnershipDeedLanding() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [partnerCount, setPartnerCount] = useState(2);

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      duration: "At Will",
      partners: [
        { name: "", address: "", profitSharePct: 50, capitalContribution: 100000 },
        { name: "", address: "", profitSharePct: 50, capitalContribution: 100000 },
      ],
    },
  });

  const duration = watch("duration");

  async function onSubmit(values: FormValues) {
    setSubmitting(true);
    try {
      sessionStorage.setItem(
        "tool:partnership-deed:input",
        JSON.stringify({ ...values, partners: values.partners.slice(0, partnerCount) })
      );
    } catch {}
    router.push("/tools/partnership-deed-generator/result");
  }

  return (
    <ToolLayout
      eyebrow="Free MSME Tool"
      title="Partnership Deed Generator"
      subtitle="Draft an Indian Partnership Act, 1932-aligned partnership deed for 2 to 5 partners — capital, profit share, management, dissolution."
      badges={[
        { label: "Partners", value: "2 – 5" },
        { label: "Act", value: "Partnership 1932" },
        { label: "Time", value: "≈ 3 min" },
        { label: "Price", value: "Free" },
      ]}
    >
      <Card className="mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Handshake size={18} className="text-blue-700" />
            Firm & partners
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <section>
              <h3 className="font-heading mb-3 text-sm font-semibold uppercase tracking-wider text-slate-700">
                Firm details
              </h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label>Firm name *</Label>
                  <Input {...register("firmName")} placeholder="e.g. Shri Ram Enterprises" />
                  <ErrText m={errors.firmName?.message} />
                </div>
                <div>
                  <Label>Nature of business *</Label>
                  <Input
                    {...register("businessNature")}
                    placeholder="e.g. trading in electronic goods"
                  />
                  <ErrText m={errors.businessNature?.message} />
                </div>
                <div>
                  <Label>State *</Label>
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
                  <Label>City *</Label>
                  <Input {...register("city")} />
                  <ErrText m={errors.city?.message} />
                </div>
                <div>
                  <Label>Bank name *</Label>
                  <Input {...register("bankName")} placeholder="e.g. HDFC Bank" />
                  <ErrText m={errors.bankName?.message} />
                </div>
                <div>
                  <Label>Commencement date *</Label>
                  <Input type="date" {...register("commencementDate")} />
                  <ErrText m={errors.commencementDate?.message} />
                </div>
                <div>
                  <Label>Duration *</Label>
                  <Controller
                    control={control}
                    name="duration"
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="At Will">At Will</SelectItem>
                          <SelectItem value="Fixed Term">Fixed Term</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
                {duration === "Fixed Term" ? (
                  <div>
                    <Label>Fixed term (years)</Label>
                    <Input type="number" {...register("fixedTermYears")} placeholder="5" />
                  </div>
                ) : null}
              </div>
            </section>

            <section>
              <div className="mb-3 flex items-baseline justify-between gap-4">
                <h3 className="font-heading text-sm font-semibold uppercase tracking-wider text-slate-700">
                  Partners ({partnerCount})
                </h3>
                <div className="flex gap-2">
                  {partnerCount < 5 ? (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setPartnerCount((c) => Math.min(5, c + 1))}
                      className="h-8"
                    >
                      <Plus size={12} /> Add partner
                    </Button>
                  ) : null}
                  {partnerCount > 2 ? (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setPartnerCount((c) => Math.max(2, c - 1))}
                      className="h-8"
                    >
                      <X size={12} /> Remove last
                    </Button>
                  ) : null}
                </div>
              </div>
              <div className="space-y-4">
                {Array.from({ length: partnerCount }).map((_, i) => (
                  <div
                    key={i}
                    className="rounded-xl border border-slate-200 bg-slate-50 p-4"
                  >
                    <div className="mb-2 text-xs font-semibold text-slate-700">
                      Partner {i + 1}
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div>
                        <Label>Name *</Label>
                        <Input {...register(`partners.${i}.name` as const)} />
                      </div>
                      <div>
                        <Label>PAN (optional)</Label>
                        <Input {...register(`partners.${i}.pan` as const)} />
                      </div>
                      <div className="sm:col-span-2">
                        <Label>Address *</Label>
                        <Input {...register(`partners.${i}.address` as const)} />
                      </div>
                      <div>
                        <Label>Profit share (%) *</Label>
                        <Input
                          type="number"
                          step="0.01"
                          {...register(`partners.${i}.profitSharePct` as const)}
                        />
                      </div>
                      <div>
                        <Label>Capital (₹) *</Label>
                        <Input
                          type="number"
                          {...register(`partners.${i}.capitalContribution` as const)}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <div className="flex flex-col gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-slate-500">
                Ensure total profit share adds up to 100%.
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
                  "Generate deed →"
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
