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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ALL_STATES_UTS, RETAINER_TYPES } from "@/lib/tools/types";

const schema = z.object({
  retainerType: z.enum(RETAINER_TYPES),
  firmName: z.string().min(1, "Firm name is required"),
  lawyerName: z.string().min(1),
  lawyerAddress: z.string().min(1),
  barCouncilNumber: z.string().optional(),
  clientName: z.string().min(1),
  clientAddress: z.string().min(1),
  matterDescription: z.string().min(1),
  hourlyRate: z.coerce.number().int().nonnegative(),
  retainerAmount: z.coerce.number().int().nonnegative(),
  billingCycle: z.enum(["Monthly", "Quarterly", "Milestone"]),
  includedServices: z.string().min(1),
  exclusions: z.string().min(1),
  governingState: z.string().min(1, "Governing state is required"),
  includeBciCompliance: z.boolean(),
});

type FormValues = z.infer<typeof schema>;

export default function RetainerAgreementLanding() {
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
      retainerType: "General",
      billingCycle: "Monthly",
      includeBciCompliance: true,
      hourlyRate: 2500,
      retainerAmount: 50000,
    },
  });

  async function onSubmit(values: FormValues) {
    setSubmitting(true);
    try {
      sessionStorage.setItem(
        "tool:retainer-agreement:input",
        JSON.stringify(values)
      );
    } catch {}
    router.push("/tools/retainer-agreement-generator/result");
  }

  return (
    <ToolLayout
      eyebrow="For Solo Lawyers"
      title="Retainer Agreement Generator"
      subtitle="A BCI-aligned attorney-client retainer agreement for your solo or small-firm practice. Covers scope, fees, conflict, privilege and withdrawal."
      badges={[
        { label: "Retainer types", value: "4" },
        { label: "BCI Rules", value: "Included" },
        { label: "Time", value: "≈ 4 min" },
        { label: "Price", value: "Free" },
      ]}
    >
      <Card className="mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileSignature size={18} className="text-blue-700" />
            Engagement details
          </CardTitle>
          <p className="text-sm text-slate-600">
            We&apos;ll assemble a lawyer-ready retainer agreement on the next
            screen.
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <section>
              <h3 className="font-heading mb-3 text-sm font-semibold text-slate-700 uppercase tracking-wider">
                Retainer
              </h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label>Retainer type *</Label>
                  <Controller
                    control={control}
                    name="retainerType"
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {RETAINER_TYPES.map((r) => (
                            <SelectItem key={r} value={r}>
                              {r}
                            </SelectItem>
                          ))}
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

            <section>
              <h3 className="font-heading mb-3 text-sm font-semibold text-slate-700 uppercase tracking-wider">
                Firm / Attorney
              </h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label>Firm name *</Label>
                  <Input {...register("firmName")} />
                  <ErrText m={errors.firmName?.message} />
                </div>
                <div>
                  <Label>Lead lawyer name *</Label>
                  <Input {...register("lawyerName")} />
                  <ErrText m={errors.lawyerName?.message} />
                </div>
                <div className="sm:col-span-2">
                  <Label>Firm / lawyer address *</Label>
                  <Input {...register("lawyerAddress")} />
                  <ErrText m={errors.lawyerAddress?.message} />
                </div>
                <div>
                  <Label>Bar Council Enrolment No. (optional)</Label>
                  <Input
                    {...register("barCouncilNumber")}
                    placeholder="e.g. MAH/12345/2012"
                  />
                </div>
              </div>
            </section>

            <section>
              <h3 className="font-heading mb-3 text-sm font-semibold text-slate-700 uppercase tracking-wider">
                Client
              </h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label>Client name *</Label>
                  <Input {...register("clientName")} />
                  <ErrText m={errors.clientName?.message} />
                </div>
                <div>
                  <Label>Client address *</Label>
                  <Input {...register("clientAddress")} />
                  <ErrText m={errors.clientAddress?.message} />
                </div>
                <div className="sm:col-span-2">
                  <Label>Matter description *</Label>
                  <Textarea
                    {...register("matterDescription")}
                    placeholder="Brief description of the matter, e.g. advisory on an IT services agreement with ABC Pvt Ltd"
                    rows={3}
                  />
                  <ErrText m={errors.matterDescription?.message} />
                </div>
              </div>
            </section>

            <section>
              <h3 className="font-heading mb-3 text-sm font-semibold text-slate-700 uppercase tracking-wider">
                Fees
              </h3>
              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <Label>Hourly rate (₹) *</Label>
                  <Input
                    type="number"
                    {...register("hourlyRate")}
                    placeholder="2500"
                  />
                </div>
                <div>
                  <Label>Retainer amount (₹) *</Label>
                  <Input
                    type="number"
                    {...register("retainerAmount")}
                    placeholder="50000"
                  />
                </div>
                <div>
                  <Label>Billing cycle *</Label>
                  <Controller
                    control={control}
                    name="billingCycle"
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Monthly">Monthly</SelectItem>
                          <SelectItem value="Quarterly">Quarterly</SelectItem>
                          <SelectItem value="Milestone">Milestone</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
              </div>
            </section>

            <section>
              <h3 className="font-heading mb-3 text-sm font-semibold text-slate-700 uppercase tracking-wider">
                Scope
              </h3>
              <div className="grid gap-4">
                <div>
                  <Label>Included services *</Label>
                  <Textarea
                    {...register("includedServices")}
                    rows={3}
                    placeholder="e.g. Contract review and negotiation; ongoing advisory; drafting notices; representation before tribunals up to the first hearing"
                  />
                  <ErrText m={errors.includedServices?.message} />
                </div>
                <div>
                  <Label>Exclusions *</Label>
                  <Textarea
                    {...register("exclusions")}
                    rows={3}
                    placeholder="e.g. Appellate work; criminal complaints; out-of-station travel beyond 100 km"
                  />
                  <ErrText m={errors.exclusions?.message} />
                </div>
              </div>
            </section>

            <section>
              <Controller
                control={control}
                name="includeBciCompliance"
                render={({ field }) => (
                  <ToggleRow
                    checked={field.value}
                    onChange={field.onChange}
                    title="Include BCI Rules of Professional Conduct clauses"
                    desc="Adds confidentiality, client account & withdrawal clauses aligned to BCI Rules (recommended)."
                  />
                )}
              />
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
                  "Generate retainer agreement →"
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
