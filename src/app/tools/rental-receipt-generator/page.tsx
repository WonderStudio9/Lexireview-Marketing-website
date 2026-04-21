"use client";

import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { Receipt, Loader2 } from "lucide-react";

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
  tenantName: z.string().min(1),
  tenantAddress: z.string().optional(),
  landlordName: z.string().min(1),
  landlordAddress: z.string().min(1),
  landlordPan: z.string().optional(),
  propertyAddress: z.string().min(1),
  monthYear: z.string().min(1),
  amount: z.coerce.number().positive(),
  paymentMode: z.enum(["Cash", "Bank Transfer", "UPI", "Cheque"]),
  paymentDate: z.string().min(1),
});

type FormValues = z.infer<typeof schema>;

export default function RentalReceiptLanding() {
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
      paymentMode: "Bank Transfer",
    },
  });

  async function onSubmit(values: FormValues) {
    setSubmitting(true);
    try {
      sessionStorage.setItem(
        "tool:rental-receipt:input",
        JSON.stringify(values)
      );
    } catch {}
    router.push("/tools/rental-receipt-generator/result");
  }

  return (
    <ToolLayout
      eyebrow="Free Tenant Tool"
      title="Rental Receipt Generator"
      subtitle="HRA-compliant rent receipt for your tax filing — with PAN and TDS notes as required under Section 10(13A) and Section 194-IB."
      badges={[
        { label: "HRA rule", value: "Section 10(13A)" },
        { label: "PAN needed if rent ≥", value: "₹8,333/mo" },
        { label: "TDS applies if", value: "₹50,000/mo" },
        { label: "Price", value: "Free" },
      ]}
    >
      <Card className="mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Receipt size={18} className="text-blue-700" />
            Receipt details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <section>
              <h3 className="font-heading mb-3 text-sm font-semibold uppercase tracking-wider text-slate-700">
                Tenant
              </h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label>Tenant name *</Label>
                  <Input {...register("tenantName")} />
                  <ErrText m={errors.tenantName?.message} />
                </div>
                <div>
                  <Label>Tenant address (optional)</Label>
                  <Input {...register("tenantAddress")} />
                </div>
              </div>
            </section>

            <section>
              <h3 className="font-heading mb-3 text-sm font-semibold uppercase tracking-wider text-slate-700">
                Landlord
              </h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label>Landlord name *</Label>
                  <Input {...register("landlordName")} />
                  <ErrText m={errors.landlordName?.message} />
                </div>
                <div>
                  <Label>Landlord PAN (required if rent ≥ ₹8,333/mo)</Label>
                  <Input {...register("landlordPan")} />
                </div>
                <div className="sm:col-span-2">
                  <Label>Landlord address *</Label>
                  <Input {...register("landlordAddress")} />
                  <ErrText m={errors.landlordAddress?.message} />
                </div>
              </div>
            </section>

            <section>
              <h3 className="font-heading mb-3 text-sm font-semibold uppercase tracking-wider text-slate-700">
                Payment
              </h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <Label>Property address *</Label>
                  <Input {...register("propertyAddress")} />
                  <ErrText m={errors.propertyAddress?.message} />
                </div>
                <div>
                  <Label>Month *</Label>
                  <Input type="month" {...register("monthYear")} />
                  <ErrText m={errors.monthYear?.message} />
                </div>
                <div>
                  <Label>Amount (₹) *</Label>
                  <Input type="number" {...register("amount")} />
                  <ErrText m={errors.amount?.message} />
                </div>
                <div>
                  <Label>Payment date *</Label>
                  <Input type="date" {...register("paymentDate")} />
                  <ErrText m={errors.paymentDate?.message} />
                </div>
                <div>
                  <Label>Payment mode *</Label>
                  <Controller
                    control={control}
                    name="paymentMode"
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Bank Transfer">
                            Bank Transfer
                          </SelectItem>
                          <SelectItem value="UPI">UPI</SelectItem>
                          <SelectItem value="Cheque">Cheque</SelectItem>
                          <SelectItem value="Cash">Cash</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
              </div>
            </section>

            <div className="flex flex-col gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-slate-500">
                Ideal for HRA claim in your Form 12BB / ITR.
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
                  "Generate receipt →"
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
