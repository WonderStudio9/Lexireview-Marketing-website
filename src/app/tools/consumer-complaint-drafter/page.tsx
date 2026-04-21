"use client";

import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { Gavel, Loader2 } from "lucide-react";

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

const STEPS = [
  "Emailed company",
  "Called customer care",
  "Social media",
  "Consumer helpline 1915",
];

const schema = z.object({
  complaintType: z.enum([
    "Product defect",
    "Service deficiency",
    "Fraud",
    "E-commerce issue",
    "Banking",
    "Insurance",
    "Other",
  ]),
  companyName: z.string().min(1),
  companyAddress: z.string().min(1),
  name: z.string().min(1),
  address: z.string().min(1),
  phone: z.string().min(1),
  email: z.string().email(),
  transactionDate: z.string().min(1),
  amountInvolved: z.coerce.number().int().nonnegative(),
  issueDescription: z.string().min(10),
  compensationSought: z.string().min(5),
});

type FormValues = z.infer<typeof schema>;

export default function ConsumerComplaintLanding() {
  const router = useRouter();
  const [stepsTaken, setStepsTaken] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      complaintType: "Product defect",
    },
  });

  function toggleStep(s: string) {
    setStepsTaken((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
    );
  }

  async function onSubmit(values: FormValues) {
    setSubmitting(true);
    const payload = {
      complaintType: values.complaintType,
      company: { name: values.companyName, address: values.companyAddress },
      complainant: {
        name: values.name,
        address: values.address,
        phone: values.phone,
        email: values.email,
      },
      transactionDate: values.transactionDate,
      amountInvolved: values.amountInvolved,
      issueDescription: values.issueDescription,
      stepsTaken,
      compensationSought: values.compensationSought,
    };
    try {
      sessionStorage.setItem(
        "tool:consumer-complaint:input",
        JSON.stringify(payload)
      );
    } catch {}
    router.push("/tools/consumer-complaint-drafter/result");
  }

  return (
    <ToolLayout
      eyebrow="Free Citizen Tool"
      title="Consumer Complaint Drafter"
      subtitle="Draft a ready-to-file consumer complaint under the Consumer Protection Act, 2019. We auto-select the right forum (District / State / National CDRC) based on your claim value."
      badges={[
        { label: "Act", value: "CPA 2019" },
        { label: "Forum", value: "Auto-selected" },
        { label: "E-filing", value: "e-Daakhil ready" },
        { label: "Price", value: "Free" },
      ]}
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gavel size={18} className="text-blue-700" />
            Complaint details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <Label>Complaint type *</Label>
              <Controller
                control={control}
                name="complaintType"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[
                        "Product defect",
                        "Service deficiency",
                        "Fraud",
                        "E-commerce issue",
                        "Banking",
                        "Insurance",
                        "Other",
                      ].map((v) => (
                        <SelectItem key={v} value={v}>
                          {v}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <section>
              <h3 className="font-heading mb-3 text-sm font-semibold uppercase tracking-wider text-slate-700">
                Company / opposite party
              </h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label>Company name *</Label>
                  <Input {...register("companyName")} />
                  <ErrText m={errors.companyName?.message} />
                </div>
                <div>
                  <Label>Company address *</Label>
                  <Input {...register("companyAddress")} />
                  <ErrText m={errors.companyAddress?.message} />
                </div>
              </div>
            </section>

            <section>
              <h3 className="font-heading mb-3 text-sm font-semibold uppercase tracking-wider text-slate-700">
                Your details
              </h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label>Full name *</Label>
                  <Input {...register("name")} />
                  <ErrText m={errors.name?.message} />
                </div>
                <div>
                  <Label>Phone *</Label>
                  <Input {...register("phone")} />
                  <ErrText m={errors.phone?.message} />
                </div>
                <div>
                  <Label>Email *</Label>
                  <Input type="email" {...register("email")} />
                  <ErrText m={errors.email?.message} />
                </div>
                <div>
                  <Label>Full address *</Label>
                  <Input {...register("address")} />
                  <ErrText m={errors.address?.message} />
                </div>
              </div>
            </section>

            <section>
              <h3 className="font-heading mb-3 text-sm font-semibold uppercase tracking-wider text-slate-700">
                Dispute
              </h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label>Date of transaction / issue *</Label>
                  <Input type="date" {...register("transactionDate")} />
                  <ErrText m={errors.transactionDate?.message} />
                </div>
                <div>
                  <Label>Amount involved (₹) *</Label>
                  <Input
                    type="number"
                    {...register("amountInvolved")}
                    placeholder="15000"
                  />
                  <ErrText m={errors.amountInvolved?.message} />
                </div>
              </div>
              <div className="mt-4">
                <Label>Brief description of the issue *</Label>
                <Textarea
                  {...register("issueDescription")}
                  className="min-h-[140px]"
                  placeholder="Describe what happened, when, and how the company has failed to resolve it…"
                />
                <ErrText m={errors.issueDescription?.message} />
              </div>
              <div className="mt-4">
                <Label>Compensation sought *</Label>
                <Textarea
                  {...register("compensationSought")}
                  className="min-h-[100px]"
                  placeholder="e.g. Refund of ₹15,000 with 12% p.a. interest, compensation of ₹25,000 for mental agony, and cost of proceedings…"
                />
                <ErrText m={errors.compensationSought?.message} />
              </div>
            </section>

            <section>
              <Label>Steps already taken</Label>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {STEPS.map((s) => (
                  <label
                    key={s}
                    className={`flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors ${
                      stepsTaken.includes(s)
                        ? "border-blue-600 bg-blue-50 text-blue-900"
                        : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                    }`}
                  >
                    <input
                      type="checkbox"
                      className="h-4 w-4 accent-blue-700"
                      checked={stepsTaken.includes(s)}
                      onChange={() => toggleStep(s)}
                    />
                    {s}
                  </label>
                ))}
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
                  "Draft my complaint →"
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
