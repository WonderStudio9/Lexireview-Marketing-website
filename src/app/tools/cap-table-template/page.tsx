"use client";

import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { BarChart3, Loader2, Plus, Trash2 } from "lucide-react";

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
  companyName: z.string().min(1),
  stage: z.enum(["pre-seed", "seed", "series A", "series B"]),
  founders: z
    .array(
      z.object({
        name: z.string().min(1),
        equityPct: z.coerce.number().min(0).max(100),
      })
    )
    .min(1)
    .max(5),
  esopPoolPct: z.coerce.number().min(0).max(30),
  includePreferred: z.boolean(),
  angelInvestorCount: z.coerce.number().int().min(0).max(10),
  nextRoundSizeCr: z.coerce.number().nonnegative(),
  nextRoundValuationCr: z.coerce.number().positive(),
});

type FormValues = z.infer<typeof schema>;

export default function CapTableLanding() {
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
      stage: "seed",
      esopPoolPct: 10,
      includePreferred: true,
      angelInvestorCount: 0,
      nextRoundSizeCr: 5,
      nextRoundValuationCr: 25,
      founders: [
        { name: "", equityPct: 50 },
        { name: "", equityPct: 50 },
      ],
    },
  });

  const founders = watch("founders") ?? [];

  function addFounder() {
    if (founders.length >= 5) return;
    setValue("founders", [...founders, { name: "", equityPct: 0 }]);
  }

  function removeFounder(i: number) {
    if (founders.length <= 1) return;
    setValue(
      "founders",
      founders.filter((_, idx) => idx !== i)
    );
  }

  async function onSubmit(values: FormValues) {
    setSubmitting(true);
    try {
      sessionStorage.setItem("tool:cap-table:input", JSON.stringify(values));
    } catch {}
    router.push("/tools/cap-table-template/result");
  }

  return (
    <ToolLayout
      eyebrow="Free Startup Tool"
      title="Cap Table Template Generator"
      subtitle="Visualise current + post-dilution cap table for your next round. Handles ESOP pool, angels, preferred stock and liquidation preferences."
      badges={[
        { label: "Stages", value: "Pre-seed → B" },
        { label: "Founders", value: "1 – 5" },
        { label: "CSV export", value: "Yes" },
        { label: "Price", value: "Free" },
      ]}
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 size={18} className="text-blue-700" />
            Cap table details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label>Company name *</Label>
                <Input {...register("companyName")} />
                <ErrText m={errors.companyName?.message} />
              </div>
              <div>
                <Label>Company stage *</Label>
                <Controller
                  control={control}
                  name="stage"
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pre-seed">Pre-seed</SelectItem>
                        <SelectItem value="seed">Seed</SelectItem>
                        <SelectItem value="series A">Series A</SelectItem>
                        <SelectItem value="series B">Series B</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            </div>

            <section>
              <div className="mb-3 flex items-center justify-between">
                <h3 className="font-heading text-sm font-semibold uppercase tracking-wider text-slate-700">
                  Founders ({founders.length})
                </h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-8"
                  onClick={addFounder}
                  disabled={founders.length >= 5}
                >
                  <Plus size={14} /> Add
                </Button>
              </div>
              <div className="space-y-3">
                {founders.map((_, i) => (
                  <div
                    key={i}
                    className="grid grid-cols-1 gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3 sm:grid-cols-[2fr_1fr_auto]"
                  >
                    <div>
                      <Label>Founder name</Label>
                      <Input {...register(`founders.${i}.name` as const)} />
                    </div>
                    <div>
                      <Label>Equity %</Label>
                      <Input
                        type="number"
                        step="0.01"
                        {...register(`founders.${i}.equityPct` as const)}
                      />
                    </div>
                    <div className="flex items-end">
                      {founders.length > 1 ? (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-9 text-red-600"
                          onClick={() => removeFounder(i)}
                        >
                          <Trash2 size={14} />
                        </Button>
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label>ESOP pool (%)</Label>
                <Input type="number" step="0.1" {...register("esopPoolPct")} />
              </div>
              <div>
                <Label>Angel investors (0–10)</Label>
                <Input type="number" {...register("angelInvestorCount")} />
              </div>
              <div>
                <Label>Next round size (₹Cr)</Label>
                <Input
                  type="number"
                  step="0.1"
                  {...register("nextRoundSizeCr")}
                />
              </div>
              <div>
                <Label>Next round post-money valuation (₹Cr) *</Label>
                <Input
                  type="number"
                  step="0.1"
                  {...register("nextRoundValuationCr")}
                />
                <ErrText m={errors.nextRoundValuationCr?.message} />
              </div>
            </div>

            <label
              className={`flex cursor-pointer items-start gap-3 rounded-lg border p-4 transition-colors ${
                watch("includePreferred")
                  ? "border-blue-600 bg-blue-50"
                  : "border-slate-200 bg-white hover:border-slate-300"
              }`}
            >
              <input
                type="checkbox"
                checked={watch("includePreferred")}
                onChange={(e) => setValue("includePreferred", e.target.checked)}
                className="mt-1 h-4 w-4 accent-blue-700"
              />
              <div>
                <p className="text-sm font-medium text-slate-900">
                  Include preferred stock
                </p>
                <p className="text-xs text-slate-500">
                  Adds liquidation-preference summary (assumes 1x non-participating).
                </p>
              </div>
            </label>

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
                  "Build cap table →"
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
