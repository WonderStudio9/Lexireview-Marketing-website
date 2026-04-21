"use client";

import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Calculator, Loader2 } from "lucide-react";
import { useState } from "react";

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
  state: z.string().min(1),
  transactionType: z.enum([
    "Sale Deed",
    "Gift Deed",
    "Lease",
    "Mortgage",
    "Conveyance",
    "Development Agreement",
  ]),
  propertyValue: z.coerce.number().int().positive(),
  propertyType: z.enum(["Residential", "Commercial", "Agricultural"]),
  buyerGender: z.enum(["Male", "Female", "Joint"]),
  city: z.string().min(1),
});

type FormValues = z.infer<typeof schema>;

export default function StampDutyCalculatorLanding() {
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
      transactionType: "Sale Deed",
      propertyType: "Residential",
      buyerGender: "Male",
    },
  });

  async function onSubmit(values: FormValues) {
    setSubmitting(true);
    try {
      sessionStorage.setItem(
        "tool:stamp-duty:input",
        JSON.stringify(values)
      );
    } catch {}
    router.push("/tools/stamp-duty-calculator/result");
  }

  return (
    <ToolLayout
      eyebrow="Free Citizen Tool"
      title="Stamp Duty & Registration Calculator"
      subtitle="Estimate stamp duty, registration charges and municipal surcharge for any Indian state — residential, commercial or agricultural."
      badges={[
        { label: "States covered", value: "28 + 8 UTs" },
        { label: "Rate base", value: "2025–26" },
        { label: "Women concession", value: "Auto-applied" },
        { label: "Price", value: "Free" },
      ]}
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator size={18} className="text-blue-700" />
            Property details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label>State *</Label>
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
                <Label>City *</Label>
                <Input {...register("city")} placeholder="e.g. Pune" />
                <ErrText m={errors.city?.message} />
              </div>
              <div>
                <Label>Transaction type *</Label>
                <Controller
                  control={control}
                  name="transactionType"
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[
                          "Sale Deed",
                          "Gift Deed",
                          "Lease",
                          "Mortgage",
                          "Conveyance",
                          "Development Agreement",
                        ].map((t) => (
                          <SelectItem key={t} value={t}>
                            {t}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
              <div>
                <Label>Property value (₹) *</Label>
                <Input
                  type="number"
                  {...register("propertyValue")}
                  placeholder="5000000"
                />
                <ErrText m={errors.propertyValue?.message} />
              </div>
              <div>
                <Label>Property type *</Label>
                <Controller
                  control={control}
                  name="propertyType"
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
                        <SelectItem value="Agricultural">
                          Agricultural
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
              <div>
                <Label>Buyer gender *</Label>
                <Controller
                  control={control}
                  name="buyerGender"
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                        <SelectItem value="Joint">Joint (M+F)</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
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
                  "Calculate →"
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
