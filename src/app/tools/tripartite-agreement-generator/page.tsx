"use client";

import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { Handshake, Loader2 } from "lucide-react";

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
  builderName: z.string().min(1),
  builderAddress: z.string().min(1),
  builderContact: z.string().optional(),
  buyerName: z.string().min(1),
  buyerAddress: z.string().min(1),
  buyerContact: z.string().optional(),
  bankName: z.string().min(1),
  bankAddress: z.string().min(1),
  bankContact: z.string().optional(),
  propertyDescription: z.string().min(1),
  propertyAddress: z.string().min(1),
  loanAmount: z.coerce.number().int().positive(),
  constructionStage: z.enum([
    "Pre-Construction",
    "Foundation",
    "Plinth",
    "Slabs",
    "Walls",
    "Finishing",
    "Ready to Move",
  ]),
  escrowMechanism: z.string().min(1),
  state: z.string().min(1),
  city: z.string().min(1),
});

type FormValues = z.infer<typeof schema>;

export default function TripartiteLanding() {
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
      constructionStage: "Foundation",
      escrowMechanism:
        "Bank to disburse directly to the project escrow account under RERA § 4(2)(l)(D); withdrawals only against CA + engineer + architect certification.",
    },
  });

  async function onSubmit(values: FormValues) {
    setSubmitting(true);
    const payload = {
      builder: {
        name: values.builderName,
        address: values.builderAddress,
        contact: values.builderContact,
      },
      buyer: {
        name: values.buyerName,
        address: values.buyerAddress,
        contact: values.buyerContact,
      },
      bank: {
        name: values.bankName,
        address: values.bankAddress,
        contact: values.bankContact,
      },
      propertyDescription: values.propertyDescription,
      propertyAddress: values.propertyAddress,
      loanAmount: values.loanAmount,
      constructionStage: values.constructionStage,
      escrowMechanism: values.escrowMechanism,
      state: values.state,
      city: values.city,
    };
    try {
      sessionStorage.setItem(
        "tool:tripartite:input",
        JSON.stringify(payload)
      );
    } catch {}
    router.push("/tools/tripartite-agreement-generator/result");
  }

  return (
    <ToolLayout
      eyebrow="Free Developer Tool"
      title="Tripartite Agreement Generator"
      subtitle="Builder + Buyer + Bank (Lender) agreement — aligned to RERA § 19, Banking Regulation Act 1949 and SARFAESI. Includes Builder NOC and Pre-EMI commitments."
      badges={[
        { label: "Parties", value: "Builder, Buyer, Bank" },
        { label: "Statutes", value: "RERA + BR Act" },
        { label: "Clauses", value: "17" },
        { label: "Price", value: "Free" },
      ]}
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Handshake size={18} className="text-blue-700" />
            Party &amp; loan details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <section>
              <H3>Builder / Developer</H3>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Company / developer name *" err={errors.builderName?.message}>
                  <Input {...register("builderName")} />
                </Field>
                <Field label="Contact (optional)">
                  <Input {...register("builderContact")} placeholder="Phone / email" />
                </Field>
                <Field label="Registered office address *" err={errors.builderAddress?.message} wide>
                  <Input {...register("builderAddress")} />
                </Field>
              </div>
            </section>

            <section>
              <H3>Buyer / Allottee / Borrower</H3>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Full name *" err={errors.buyerName?.message}>
                  <Input {...register("buyerName")} />
                </Field>
                <Field label="Contact (optional)">
                  <Input {...register("buyerContact")} />
                </Field>
                <Field label="Address *" err={errors.buyerAddress?.message} wide>
                  <Input {...register("buyerAddress")} />
                </Field>
              </div>
            </section>

            <section>
              <H3>Bank / Lender</H3>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Bank name *" err={errors.bankName?.message}>
                  <Input {...register("bankName")} placeholder="e.g. HDFC Bank Limited" />
                </Field>
                <Field label="Contact (optional)">
                  <Input {...register("bankContact")} />
                </Field>
                <Field label="Branch office address *" err={errors.bankAddress?.message} wide>
                  <Input {...register("bankAddress")} />
                </Field>
              </div>
            </section>

            <section>
              <H3>Property &amp; Loan</H3>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Property description *" err={errors.propertyDescription?.message} wide>
                  <Input {...register("propertyDescription")} placeholder="e.g. Flat no. 804, 8th Floor, Block C, Tower 2 — carpet 720 sqft" />
                </Field>
                <Field label="Property address *" err={errors.propertyAddress?.message} wide>
                  <Input {...register("propertyAddress")} />
                </Field>
                <Field label="Loan amount (₹) *" err={errors.loanAmount?.message}>
                  <Input type="number" {...register("loanAmount")} placeholder="5000000" />
                </Field>
                <Field label="Construction stage *">
                  <Controller
                    control={control}
                    name="constructionStage"
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Pre-Construction">Pre-construction</SelectItem>
                          <SelectItem value="Foundation">Foundation</SelectItem>
                          <SelectItem value="Plinth">Plinth</SelectItem>
                          <SelectItem value="Slabs">Slabs</SelectItem>
                          <SelectItem value="Walls">Walls</SelectItem>
                          <SelectItem value="Finishing">Finishing</SelectItem>
                          <SelectItem value="Ready to Move">Ready to move</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
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
                <Field label="Escrow / fund-utilisation mechanism *" err={errors.escrowMechanism?.message} wide>
                  <Textarea {...register("escrowMechanism")} />
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
