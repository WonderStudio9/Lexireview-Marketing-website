"use client";

import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { forwardRef, useState } from "react";
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
import { ALL_STATES_UTS } from "@/lib/tools/types";

const schema = z.object({
  state: z.string().min(1),
  transactionType: z.enum([
    "Sale Deed",
    "Agreement to Sell",
    "Allotment Letter",
    "Conveyance",
  ]),
  propertyValue: z.coerce.number().int().positive(),
  buyerGender: z.enum(["Male", "Female", "Joint"]),
  firstTimeBuyer: z.boolean(),
  city: z.string().min(1),
});

type FormValues = z.infer<typeof schema>;

export default function ReStampDutyLanding() {
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
      buyerGender: "Male",
      firstTimeBuyer: false,
    },
  });

  async function onSubmit(values: FormValues) {
    setSubmitting(true);
    try {
      sessionStorage.setItem(
        "tool:re-stamp-duty:input",
        JSON.stringify(values)
      );
    } catch {}
    router.push("/tools/real-estate-stamp-duty-calculator/result");
  }

  return (
    <ToolLayout
      eyebrow="Free Developer Tool"
      title="Real Estate Stamp Duty Calculator"
      subtitle="State-wise stamp duty, registration charges, local surcharge and additional closing fees for Sale Deeds, ATS, Allotment Letters and Conveyances."
      badges={[
        { label: "Transactions", value: "4 types" },
        { label: "States covered", value: "28 + 8 UTs" },
        { label: "Women concession", value: "Auto-applied" },
        { label: "Price", value: "Free" },
      ]}
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator size={18} className="text-blue-700" />
            Transaction details
          </CardTitle>
          <p className="text-sm text-slate-600">
            Enter the property value and transaction type. We&apos;ll return a
            state-specific breakdown of stamp duty, registration and local fees.
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label>State / UT *</Label>
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
                <Input {...register("city")} placeholder="e.g. Pune" />
                <ErrText m={errors.city?.message} />
              </div>
              <div>
                <Label>Transaction type *</Label>
                <Controller
                  control={control}
                  name="transactionType"
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Sale Deed">Sale Deed</SelectItem>
                        <SelectItem value="Agreement to Sell">Agreement to Sell</SelectItem>
                        <SelectItem value="Allotment Letter">Allotment Letter</SelectItem>
                        <SelectItem value="Conveyance">Conveyance</SelectItem>
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
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                        <SelectItem value="Joint">Joint (Male + Female)</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
              <div>
                <Label>Property / consideration value (₹) *</Label>
                <Input
                  type="number"
                  {...register("propertyValue")}
                  placeholder="5000000"
                />
                <ErrText m={errors.propertyValue?.message} />
              </div>
              <div className="sm:pt-6">
                <Toggle
                  {...register("firstTimeBuyer")}
                  label="First-time home buyer (concession eligible)"
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
                  "Calculate stamp duty →"
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
