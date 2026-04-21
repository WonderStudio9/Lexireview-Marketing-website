"use client";

import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { forwardRef, useState } from "react";
import { ShieldCheck, Loader2 } from "lucide-react";

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
  state: z.string().min(1, "State is required"),
  projectType: z.enum(["Residential", "Commercial", "Mixed-use"]),
  projectAreaSqft: z.coerce.number().int().positive(),
  plotCount: z.coerce.number().int().nonnegative(),
  registrationStatus: z.enum([
    "Registered",
    "Pending",
    "Not Registered",
    "Exempt",
  ]),
  carpetAreaDisclosed: z.boolean(),
  builtUpAreaDisclosed: z.boolean(),
  escrowAccount: z.boolean(),
  websitePublished: z.boolean(),
  seventyPctEscrowCompliant: z.boolean(),
  quarterlyUpdatesFiled: z.boolean(),
});

type FormValues = z.infer<typeof schema>;

export default function ReraComplianceCheckerLanding() {
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
      projectType: "Residential",
      registrationStatus: "Not Registered",
      carpetAreaDisclosed: false,
      builtUpAreaDisclosed: false,
      escrowAccount: false,
      websitePublished: false,
      seventyPctEscrowCompliant: false,
      quarterlyUpdatesFiled: false,
      plotCount: 0,
    },
  });

  async function onSubmit(values: FormValues) {
    setSubmitting(true);
    try {
      sessionStorage.setItem(
        "tool:rera-compliance:input",
        JSON.stringify(values)
      );
    } catch {}
    router.push("/tools/rera-compliance-checker/result");
  }

  return (
    <ToolLayout
      eyebrow="Free Developer Tool"
      title="RERA Compliance Checker"
      subtitle="Score your project against the Real Estate (Regulation and Development) Act, 2016 — registration, disclosure, escrow, and quarterly-update obligations."
      badges={[
        { label: "Checks", value: "10+ items" },
        { label: "Act", value: "RERA 2016" },
        { label: "States covered", value: "All India" },
        { label: "Price", value: "Free" },
      ]}
    >
      <Card className="mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShieldCheck size={18} className="text-blue-700" />
            Tell us about the project
          </CardTitle>
          <p className="text-sm text-slate-600">
            We&apos;ll map each answer to a RERA section and return a
            compliance score with specific remediation steps.
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <section>
              <h3 className="font-heading mb-3 text-sm font-semibold text-slate-700 uppercase tracking-wider">
                Project
              </h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label>State / UT *</Label>
                  <Controller
                    control={control}
                    name="state"
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
                  <ErrText m={errors.state?.message} />
                </div>
                <div>
                  <Label>Project type *</Label>
                  <Controller
                    control={control}
                    name="projectType"
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Residential">Residential</SelectItem>
                          <SelectItem value="Commercial">Commercial</SelectItem>
                          <SelectItem value="Mixed-use">Mixed-use</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
                <div>
                  <Label>Project area (sq ft) *</Label>
                  <Input
                    type="number"
                    {...register("projectAreaSqft")}
                    placeholder="50000"
                  />
                  <ErrText m={errors.projectAreaSqft?.message} />
                </div>
                <div>
                  <Label>Plot / apartment count</Label>
                  <Input
                    type="number"
                    {...register("plotCount")}
                    placeholder="12"
                  />
                </div>
                <div className="sm:col-span-2">
                  <Label>RERA registration status *</Label>
                  <Controller
                    control={control}
                    name="registrationStatus"
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Registered">Registered</SelectItem>
                          <SelectItem value="Pending">Application pending</SelectItem>
                          <SelectItem value="Not Registered">Not registered</SelectItem>
                          <SelectItem value="Exempt">Exempt (&lt; 500 sqm / &lt; 8 apartments)</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
              </div>
            </section>

            <section>
              <h3 className="font-heading mb-3 text-sm font-semibold text-slate-700 uppercase tracking-wider">
                Disclosures & Controls
              </h3>
              <div className="grid gap-3 sm:grid-cols-2">
                <Toggle {...register("carpetAreaDisclosed")} label="Carpet area disclosed in marketing / agreement" />
                <Toggle {...register("builtUpAreaDisclosed")} label="Built-up area separately disclosed" />
                <Toggle {...register("escrowAccount")} label="Separate escrow / project bank account opened" />
                <Toggle {...register("websitePublished")} label="RERA webpage live (plans, updates, allottees)" />
                <Toggle {...register("seventyPctEscrowCompliant")} label="70% of sale proceeds routed to escrow" />
                <Toggle {...register("quarterlyUpdatesFiled")} label="Quarterly updates filed on RERA portal" />
              </div>
            </section>

            <div className="flex flex-col gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-slate-500">
                We&apos;ll email you the compliance scorecard on the next page.
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
                  "Check compliance →"
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

// Native checkbox rendered as a card-styled row (works with react-hook-form's register)
const Toggle = forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement> & { label: string }
>(function Toggle({ label, ...rest }, ref) {
  return (
    <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-slate-200 bg-white px-3 py-3 text-sm text-slate-700 hover:border-slate-300">
      <input
        ref={ref}
        type="checkbox"
        className="mt-0.5 h-4 w-4 accent-blue-700"
        {...rest}
      />
      <span>{label}</span>
    </label>
  );
});
