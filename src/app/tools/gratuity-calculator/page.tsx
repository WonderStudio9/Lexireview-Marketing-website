"use client";

import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { Calculator, Loader2 } from "lucide-react";

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
  lastBasicPlusDa: z.coerce.number().positive(),
  years: z.coerce.number().int().nonnegative().max(60),
  months: z.coerce.number().int().nonnegative().max(11),
  coverage: z.enum(["Covered under Gratuity Act", "Not covered"]),
});

type FormValues = z.infer<typeof schema>;

export default function GratuityLanding() {
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
      coverage: "Covered under Gratuity Act",
      years: 5,
      months: 0,
    },
  });

  async function onSubmit(values: FormValues) {
    setSubmitting(true);
    try {
      sessionStorage.setItem("tool:gratuity:input", JSON.stringify(values));
    } catch {}
    router.push("/tools/gratuity-calculator/result");
  }

  return (
    <ToolLayout
      eyebrow="Free Citizen Tool"
      title="Gratuity Calculator"
      subtitle="Calculate exactly what your employer owes you under the Payment of Gratuity Act, 1972 — with tax treatment under Section 10(10)."
      badges={[
        { label: "Formula", value: "15 / 26" },
        { label: "Tax cap", value: "₹20L" },
        { label: "Min service", value: "5 years" },
        { label: "Price", value: "Free" },
      ]}
    >
      <Card className="mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator size={18} className="text-blue-700" />
            Your salary & service details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label>Last drawn Basic + DA (₹) *</Label>
                <Input
                  type="number"
                  {...register("lastBasicPlusDa")}
                  placeholder="45000"
                />
                <ErrText m={errors.lastBasicPlusDa?.message} />
              </div>
              <div>
                <Label>Employer coverage *</Label>
                <Controller
                  control={control}
                  name="coverage"
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Covered under Gratuity Act">
                          Covered under Gratuity Act 1972
                        </SelectItem>
                        <SelectItem value="Not covered">
                          Not covered (≤10 employees)
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
              <div>
                <Label>Years of service *</Label>
                <Input type="number" {...register("years")} placeholder="7" />
                <ErrText m={errors.years?.message} />
              </div>
              <div>
                <Label>Additional months (0-11) *</Label>
                <Input type="number" {...register("months")} placeholder="4" />
                <ErrText m={errors.months?.message} />
              </div>
            </div>

            <div className="flex flex-col gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-slate-500">
                Tip: months ≥ 6 count as a full year (Gratuity Act rule).
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
                  "Calculate gratuity →"
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
