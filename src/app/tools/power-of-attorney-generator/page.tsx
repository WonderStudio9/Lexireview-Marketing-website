"use client";

import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
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

const ALL_POWERS = [
  "Bank & Financial Operations",
  "Property Management",
  "Property Sale / Purchase",
  "Court Representation / Litigation",
  "Tax Filings & Assessments",
  "Company / Business Affairs",
  "Insurance Claims",
  "Rental Collection & Tenancy",
] as const;

const schema = z.object({
  poaType: z.enum(["General", "Specific", "Durable"]),
  principalName: z.string().min(1),
  principalFather: z.string().min(1),
  principalAddress: z.string().min(1),
  principalIsNri: z.boolean(),
  attorneyName: z.string().min(1),
  attorneyFather: z.string().min(1),
  attorneyAddress: z.string().min(1),
  validityMonths: z.coerce.number().int().positive().max(600),
  state: z.string().min(1),
  city: z.string().min(1),
});

type FormValues = z.infer<typeof schema>;

export default function PoaLanding() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [powers, setPowers] = useState<string[]>([
    "Bank & Financial Operations",
  ]);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      poaType: "Specific",
      principalIsNri: false,
      validityMonths: 24,
    },
  });

  function togglePower(p: string) {
    setPowers((prev) =>
      prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]
    );
  }

  async function onSubmit(values: FormValues) {
    if (powers.length === 0) {
      alert("Please select at least one power.");
      return;
    }
    setSubmitting(true);
    try {
      sessionStorage.setItem(
        "tool:poa:input",
        JSON.stringify({ ...values, powers })
      );
    } catch {}
    router.push("/tools/power-of-attorney-generator/result");
  }

  return (
    <ToolLayout
      eyebrow="Free NRI Tool"
      title="Power of Attorney Generator"
      subtitle="Draft a General, Specific or Durable Power of Attorney — with Indian stamp-duty, notarisation and consular-attestation notes for NRIs."
      badges={[
        { label: "Types", value: "General / Specific / Durable" },
        { label: "Act", value: "POA Act 1882" },
        { label: "NRI-ready", value: "Yes" },
        { label: "Price", value: "Free" },
      ]}
    >
      <Card className="mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileSignature size={18} className="text-blue-700" />
            Principal, attorney & powers
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <section>
              <h3 className="font-heading mb-3 text-sm font-semibold uppercase tracking-wider text-slate-700">
                Type & validity
              </h3>
              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <Label>POA type *</Label>
                  <Controller
                    control={control}
                    name="poaType"
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="General">General</SelectItem>
                          <SelectItem value="Specific">Specific</SelectItem>
                          <SelectItem value="Durable">Durable</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
                <div>
                  <Label>Validity (months) *</Label>
                  <Input type="number" {...register("validityMonths")} />
                </div>
                <div>
                  <Label>Principal is NRI *</Label>
                  <Controller
                    control={control}
                    name="principalIsNri"
                    render={({ field }) => (
                      <Select
                        value={field.value ? "yes" : "no"}
                        onValueChange={(v) => field.onChange(v === "yes")}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="no">No</SelectItem>
                          <SelectItem value="yes">Yes</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
              </div>
            </section>

            <section>
              <h3 className="font-heading mb-3 text-sm font-semibold uppercase tracking-wider text-slate-700">
                Principal
              </h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label>Full name *</Label>
                  <Input {...register("principalName")} />
                  <ErrText m={errors.principalName?.message} />
                </div>
                <div>
                  <Label>Father / spouse name *</Label>
                  <Input {...register("principalFather")} />
                  <ErrText m={errors.principalFather?.message} />
                </div>
                <div className="sm:col-span-2">
                  <Label>Address *</Label>
                  <Input {...register("principalAddress")} />
                  <ErrText m={errors.principalAddress?.message} />
                </div>
              </div>
            </section>

            <section>
              <h3 className="font-heading mb-3 text-sm font-semibold uppercase tracking-wider text-slate-700">
                Attorney
              </h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label>Full name *</Label>
                  <Input {...register("attorneyName")} />
                  <ErrText m={errors.attorneyName?.message} />
                </div>
                <div>
                  <Label>Father / spouse name *</Label>
                  <Input {...register("attorneyFather")} />
                  <ErrText m={errors.attorneyFather?.message} />
                </div>
                <div className="sm:col-span-2">
                  <Label>Address *</Label>
                  <Input {...register("attorneyAddress")} />
                  <ErrText m={errors.attorneyAddress?.message} />
                </div>
              </div>
            </section>

            <section>
              <h3 className="font-heading mb-3 text-sm font-semibold uppercase tracking-wider text-slate-700">
                Powers granted
              </h3>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {ALL_POWERS.map((p) => (
                  <label
                    key={p}
                    className={`flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors ${
                      powers.includes(p)
                        ? "border-blue-600 bg-blue-50 text-blue-900"
                        : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                    }`}
                  >
                    <input
                      type="checkbox"
                      className="h-4 w-4 accent-blue-700"
                      checked={powers.includes(p)}
                      onChange={() => togglePower(p)}
                    />
                    {p}
                  </label>
                ))}
              </div>
            </section>

            <section>
              <h3 className="font-heading mb-3 text-sm font-semibold uppercase tracking-wider text-slate-700">
                Location
              </h3>
              <div className="grid gap-4 sm:grid-cols-2">
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
              </div>
            </section>

            <div className="flex flex-col gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-slate-500">
                Property-related POAs must be registered (Suraj Lamp, 2011).
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
                  "Generate POA →"
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
