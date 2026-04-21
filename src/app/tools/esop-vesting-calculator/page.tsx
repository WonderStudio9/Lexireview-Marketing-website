"use client";

import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
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
  granteeName: z.string().min(1),
  companyName: z.string().min(1),
  totalOptions: z.coerce.number().int().positive(),
  strikePriceInr: z.coerce.number().nonnegative(),
  vestingFrequency: z.enum(["monthly", "quarterly", "annual"]),
  vestingYears: z.coerce.number().int().positive().max(10),
  cliffMonths: z.coerce.number().int().nonnegative().max(36),
  grantDate: z.string().min(1),
  esopType: z.enum(["ISO", "NSO", "Indian ESOP"]),
});

type FormValues = z.infer<typeof schema>;

export default function EsopLanding() {
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
      vestingFrequency: "monthly",
      vestingYears: 4,
      cliffMonths: 12,
      esopType: "Indian ESOP",
      strikePriceInr: 10,
    },
  });

  async function onSubmit(values: FormValues) {
    setSubmitting(true);
    try {
      sessionStorage.setItem("tool:esop:input", JSON.stringify(values));
    } catch {}
    router.push("/tools/esop-vesting-calculator/result");
  }

  return (
    <ToolLayout
      eyebrow="Free Startup Tool"
      title="ESOP Vesting Calculator + Grant Letter"
      subtitle="Visualise the full vesting schedule and generate a ready-to-send grant letter for your employees — with India tax notes."
      badges={[
        { label: "ESOP types", value: "3" },
        { label: "Schedules", value: "Monthly / Qtr / Yr" },
        { label: "Tax notes", value: "Sec 17(2)" },
        { label: "Price", value: "Free" },
      ]}
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator size={18} className="text-blue-700" />
            Grant details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label>Grantee name *</Label>
                <Input {...register("granteeName")} />
                <ErrText m={errors.granteeName?.message} />
              </div>
              <div>
                <Label>Company name *</Label>
                <Input {...register("companyName")} />
                <ErrText m={errors.companyName?.message} />
              </div>
              <div>
                <Label>Total options granted *</Label>
                <Input
                  type="number"
                  {...register("totalOptions")}
                  placeholder="10000"
                />
                <ErrText m={errors.totalOptions?.message} />
              </div>
              <div>
                <Label>Strike price (₹) *</Label>
                <Input
                  type="number"
                  step="0.01"
                  {...register("strikePriceInr")}
                />
                <ErrText m={errors.strikePriceInr?.message} />
              </div>
              <div>
                <Label>Vesting frequency *</Label>
                <Controller
                  control={control}
                  name="vestingFrequency"
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="quarterly">Quarterly</SelectItem>
                        <SelectItem value="annual">Annual</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
              <div>
                <Label>ESOP type *</Label>
                <Controller
                  control={control}
                  name="esopType"
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Indian ESOP">Indian ESOP</SelectItem>
                        <SelectItem value="ISO">ISO (US)</SelectItem>
                        <SelectItem value="NSO">NSO (US)</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
              <div>
                <Label>Vesting period (years) *</Label>
                <Input type="number" {...register("vestingYears")} />
                <ErrText m={errors.vestingYears?.message} />
              </div>
              <div>
                <Label>Cliff (months)</Label>
                <Input type="number" {...register("cliffMonths")} />
              </div>
              <div>
                <Label>Grant date *</Label>
                <Input type="date" {...register("grantDate")} />
                <ErrText m={errors.grantDate?.message} />
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
                  "Calculate & draft letter →"
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
