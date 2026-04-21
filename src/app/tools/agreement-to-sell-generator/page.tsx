"use client";

import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { forwardRef, useState } from "react";
import { FileText, Loader2 } from "lucide-react";

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
import { ALL_STATES_UTS } from "@/lib/tools/types";

const schema = z.object({
  sellerName: z.string().min(1),
  sellerFather: z.string().min(1),
  sellerAddress: z.string().min(1),
  sellerPan: z.string().optional(),
  buyerName: z.string().min(1),
  buyerFather: z.string().min(1),
  buyerAddress: z.string().min(1),
  buyerPan: z.string().optional(),
  propertyPlotNo: z.string().min(1),
  propertyKhata: z.string().min(1),
  propertyBoundary: z.string().min(1),
  propertyAreaSqft: z.coerce.number().int().positive(),
  propertyAddress: z.string().min(1),
  considerationAmount: z.coerce.number().int().positive(),
  earnestMoney: z.coerce.number().int().nonnegative(),
  paymentSchedule: z.string().min(1),
  possessionDate: z.string().min(1),
  stampDutyResponsibility: z.enum(["Buyer", "Seller", "Shared (50:50)"]),
  registrationCommitment: z.boolean(),
  state: z.string().min(1),
  city: z.string().min(1),
});

type FormValues = z.infer<typeof schema>;

export default function AtsLanding() {
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
      stampDutyResponsibility: "Shared (50:50)",
      registrationCommitment: true,
    },
  });

  async function onSubmit(values: FormValues) {
    setSubmitting(true);
    const payload = {
      seller: {
        name: values.sellerName,
        fatherName: values.sellerFather,
        address: values.sellerAddress,
        pan: values.sellerPan,
      },
      buyer: {
        name: values.buyerName,
        fatherName: values.buyerFather,
        address: values.buyerAddress,
        pan: values.buyerPan,
      },
      propertyPlotNo: values.propertyPlotNo,
      propertyKhata: values.propertyKhata,
      propertyBoundary: values.propertyBoundary,
      propertyAreaSqft: values.propertyAreaSqft,
      propertyAddress: values.propertyAddress,
      considerationAmount: values.considerationAmount,
      earnestMoney: values.earnestMoney,
      paymentSchedule: values.paymentSchedule,
      possessionDate: values.possessionDate,
      stampDutyResponsibility: values.stampDutyResponsibility,
      registrationCommitment: values.registrationCommitment,
      state: values.state,
      city: values.city,
    };
    try {
      sessionStorage.setItem(
        "tool:agreement-to-sell:input",
        JSON.stringify(payload)
      );
    } catch {}
    router.push("/tools/agreement-to-sell-generator/result");
  }

  return (
    <ToolLayout
      eyebrow="Free Developer Tool"
      title="Agreement-to-Sell Generator"
      subtitle="Generate a Transfer of Property Act 1882 § 54-compliant Agreement to Sell with RERA and state Stamp-Act alignment."
      badges={[
        { label: "Statute", value: "TPA § 54 + RERA" },
        { label: "Clauses", value: "15+" },
        { label: "Ready for", value: "e-Stamp + SRO" },
        { label: "Price", value: "Free" },
      ]}
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText size={18} className="text-blue-700" />
            Deal details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <section>
              <H3>Seller / Developer</H3>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Full name *" err={errors.sellerName?.message}>
                  <Input {...register("sellerName")} />
                </Field>
                <Field label="Father's name *" err={errors.sellerFather?.message}>
                  <Input {...register("sellerFather")} />
                </Field>
                <Field label="Address *" err={errors.sellerAddress?.message} wide>
                  <Input {...register("sellerAddress")} />
                </Field>
                <Field label="PAN (optional)">
                  <Input {...register("sellerPan")} placeholder="ABCDE1234F" />
                </Field>
              </div>
            </section>

            <section>
              <H3>Buyer</H3>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Full name *" err={errors.buyerName?.message}>
                  <Input {...register("buyerName")} />
                </Field>
                <Field label="Father's name *" err={errors.buyerFather?.message}>
                  <Input {...register("buyerFather")} />
                </Field>
                <Field label="Address *" err={errors.buyerAddress?.message} wide>
                  <Input {...register("buyerAddress")} />
                </Field>
                <Field label="PAN (optional)">
                  <Input {...register("buyerPan")} />
                </Field>
              </div>
            </section>

            <section>
              <H3>Property</H3>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Plot No. *" err={errors.propertyPlotNo?.message}>
                  <Input {...register("propertyPlotNo")} placeholder="e.g. 142-B" />
                </Field>
                <Field label="Khata / Khasra No. *" err={errors.propertyKhata?.message}>
                  <Input {...register("propertyKhata")} />
                </Field>
                <Field label="Area (sq ft) *" err={errors.propertyAreaSqft?.message}>
                  <Input type="number" {...register("propertyAreaSqft")} placeholder="1200" />
                </Field>
                <Field label="State *" err={errors.state?.message}>
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
                </Field>
                <Field label="City *" err={errors.city?.message}>
                  <Input {...register("city")} />
                </Field>
                <Field label="Full property address *" err={errors.propertyAddress?.message} wide>
                  <Input {...register("propertyAddress")} />
                </Field>
                <Field label="Boundaries (N / S / E / W) *" err={errors.propertyBoundary?.message} wide>
                  <Textarea {...register("propertyBoundary")} placeholder="North: Road; South: Plot 141; East: Plot 143; West: Park" />
                </Field>
              </div>
            </section>

            <section>
              <H3>Commercials</H3>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Consideration amount (₹) *" err={errors.considerationAmount?.message}>
                  <Input type="number" {...register("considerationAmount")} placeholder="7500000" />
                </Field>
                <Field label="Earnest money (₹) *" err={errors.earnestMoney?.message}>
                  <Input type="number" {...register("earnestMoney")} placeholder="500000" />
                </Field>
                <Field label="Payment schedule *" err={errors.paymentSchedule?.message} wide>
                  <Textarea {...register("paymentSchedule")} placeholder="Tranche 1: 30% on signing. Tranche 2: 40% on plinth. Tranche 3: 30% on possession." />
                </Field>
                <Field label="Possession date *" err={errors.possessionDate?.message}>
                  <Input type="date" {...register("possessionDate")} />
                </Field>
                <Field label="Stamp duty responsibility *">
                  <Controller
                    control={control}
                    name="stampDutyResponsibility"
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Buyer">Buyer bears</SelectItem>
                          <SelectItem value="Seller">Seller bears</SelectItem>
                          <SelectItem value="Shared (50:50)">Shared 50:50</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </Field>
                <Field label=" " wide>
                  <Toggle
                    {...register("registrationCommitment")}
                    label="Parties commit to register the Sale Deed within 10 working days of full payment"
                  />
                </Field>
              </div>
            </section>

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
                  "Generate agreement →"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </ToolLayout>
  );
}

function H3({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="font-heading mb-3 text-sm font-semibold text-slate-700 uppercase tracking-wider">
      {children}
    </h3>
  );
}

function Field({
  label,
  err,
  wide,
  children,
}: {
  label: string;
  err?: string;
  wide?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className={wide ? "sm:col-span-2" : ""}>
      <label className="mb-1 block text-xs font-medium text-slate-700">
        {label}
      </label>
      {children}
      {err ? <p className="mt-1 text-xs text-red-600">{err}</p> : null}
    </div>
  );
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
