"use client";

import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { TrendingUp, Loader2 } from "lucide-react";

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
import { PRACTICE_AREAS, CITY_TIERS } from "@/lib/tools/types";

const schema = z.object({
  yearsExperience: z.coerce.number().int().min(0).max(40),
  practiceArea: z.enum(PRACTICE_AREAS),
  cityTier: z.enum(CITY_TIERS),
  currentHourlyRate: z.coerce.number().int().nonnegative(),
  currentRetainer: z.coerce.number().int().nonnegative(),
  activeMatters: z.coerce.number().int().nonnegative(),
});

type FormValues = z.infer<typeof schema>;

export default function FeeAnalyzerLanding() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    watch,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      yearsExperience: 5,
      practiceArea: "Litigation",
      cityTier: "Tier 1",
      currentHourlyRate: 2500,
      currentRetainer: 30000,
      activeMatters: 10,
    },
  });

  const yoe = watch("yearsExperience");

  async function onSubmit(values: FormValues) {
    setSubmitting(true);
    try {
      sessionStorage.setItem(
        "tool:fee-analyzer:input",
        JSON.stringify(values)
      );
    } catch {}
    router.push("/tools/fee-structure-analyzer/result");
  }

  return (
    <ToolLayout
      eyebrow="For Solo Lawyers"
      title="Fee Structure Analyzer"
      subtitle="Benchmark your hourly rate and retainer against peers in your practice area, city tier and experience bracket. Know where you stand."
      badges={[
        { label: "Practice areas", value: "9" },
        { label: "City tiers", value: "4" },
        { label: "Experience", value: "0-40 yrs" },
        { label: "Price", value: "Free" },
      ]}
    >
      <Card className="mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp size={18} className="text-blue-700" />
            About your practice
          </CardTitle>
          <p className="text-sm text-slate-600">
            Tell us your segment and current rates. We&apos;ll benchmark you
            against our peer dataset on the next screen.
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <section>
              <h3 className="font-heading mb-3 text-sm font-semibold text-slate-700 uppercase tracking-wider">
                Your segment
              </h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label>Years of experience * ({yoe ?? 0})</Label>
                  <Input
                    type="range"
                    min={0}
                    max={40}
                    step={1}
                    {...register("yearsExperience")}
                    className="h-11 cursor-pointer accent-blue-700"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>0</span>
                    <span>10</span>
                    <span>20</span>
                    <span>30</span>
                    <span>40</span>
                  </div>
                </div>
                <div>
                  <Label>Practice area *</Label>
                  <Controller
                    control={control}
                    name="practiceArea"
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {PRACTICE_AREAS.map((p) => (
                            <SelectItem key={p} value={p}>
                              {p}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
                <div>
                  <Label>City tier *</Label>
                  <Controller
                    control={control}
                    name="cityTier"
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {CITY_TIERS.map((c) => (
                            <SelectItem key={c} value={c}>
                              {c}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
              </div>
            </section>

            <section>
              <h3 className="font-heading mb-3 text-sm font-semibold text-slate-700 uppercase tracking-wider">
                Your current numbers
              </h3>
              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <Label>Hourly rate (₹) *</Label>
                  <Input
                    type="number"
                    {...register("currentHourlyRate")}
                    placeholder="2500"
                  />
                </div>
                <div>
                  <Label>Current retainer (₹)</Label>
                  <Input
                    type="number"
                    {...register("currentRetainer")}
                    placeholder="30000"
                  />
                </div>
                <div>
                  <Label>Active matters</Label>
                  <Input
                    type="number"
                    {...register("activeMatters")}
                    placeholder="10"
                  />
                </div>
              </div>
            </section>

            <div className="flex flex-col gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-slate-500">
                Benchmarks are directional; see full disclaimer on results.
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
                  "Analyze my fees →"
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
