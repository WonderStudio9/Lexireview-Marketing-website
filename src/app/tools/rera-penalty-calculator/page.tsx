"use client";

import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { AlertTriangle, Loader2 } from "lucide-react";

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

const schema = z.object({
  violationType: z.enum([
    "Late Filing of Quarterly Updates",
    "Non-Registration",
    "False / Incorrect Disclosure",
    "Delayed Possession",
    "Misuse of Funds (70% Escrow)",
    "Continued Default",
  ]),
  projectCostInr: z.coerce.number().int().positive(),
  durationMonths: z.coerce.number().int().nonnegative().max(120),
  numberOfViolations: z.coerce.number().int().nonnegative().max(100),
});

type FormValues = z.infer<typeof schema>;

export default function ReraPenaltyLanding() {
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
      violationType: "Late Filing of Quarterly Updates",
      durationMonths: 3,
      numberOfViolations: 1,
    },
  });

  async function onSubmit(values: FormValues) {
    setSubmitting(true);
    try {
      sessionStorage.setItem(
        "tool:rera-penalty:input",
        JSON.stringify(values)
      );
    } catch {}
    router.push("/tools/rera-penalty-calculator/result");
  }

  return (
    <ToolLayout
      eyebrow="Free Developer Tool"
      title="RERA Penalty Calculator"
      subtitle="Estimate your exposure under Sections 59–66 of RERA 2016. Maps your violation to the exact Section, base penalty, per-unit penalty and imprisonment risk."
      badges={[
        { label: "Sections covered", value: "59–66" },
        { label: "Violation types", value: "6" },
        { label: "Act", value: "RERA 2016" },
        { label: "Price", value: "Free" },
      ]}
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle size={18} className="text-amber-600" />
            Violation details
          </CardTitle>
          <p className="text-sm text-slate-600">
            Select the violation, duration and project cost. We&apos;ll return
            an indicative penalty with mitigation steps.
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Label>Violation type *</Label>
                <Controller
                  control={control}
                  name="violationType"
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Late Filing of Quarterly Updates">
                          Late filing of quarterly updates
                        </SelectItem>
                        <SelectItem value="Non-Registration">
                          Non-registration (Section 3)
                        </SelectItem>
                        <SelectItem value="False / Incorrect Disclosure">
                          False / incorrect disclosure at registration
                        </SelectItem>
                        <SelectItem value="Delayed Possession">
                          Delayed possession (Section 18)
                        </SelectItem>
                        <SelectItem value="Misuse of Funds (70% Escrow)">
                          Misuse of funds / 70% escrow violation
                        </SelectItem>
                        <SelectItem value="Continued Default">
                          Continued default (Section 64)
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
              <div>
                <Label>Estimated project cost (₹) *</Label>
                <Input
                  type="number"
                  {...register("projectCostInr")}
                  placeholder="250000000"
                />
                <ErrText m={errors.projectCostInr?.message} />
              </div>
              <div>
                <Label>Duration of non-compliance (months)</Label>
                <Input
                  type="number"
                  {...register("durationMonths")}
                  placeholder="3"
                />
              </div>
              <div>
                <Label>Number of violations / instances</Label>
                <Input
                  type="number"
                  {...register("numberOfViolations")}
                  placeholder="1"
                />
              </div>
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
                  "Calculate penalty →"
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
