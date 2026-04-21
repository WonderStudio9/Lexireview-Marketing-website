"use client";

import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { FileText, Loader2 } from "lucide-react";

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

const DEFAULT_AMENITIES = [
  "Furnished",
  "Semi-furnished",
  "Parking",
  "Power backup",
  "Water supply",
  "Air conditioning",
  "Wi-Fi",
  "Gated security",
  "Lift",
  "Maintenance staff",
];

const schema = z.object({
  state: z.string().min(1, "State is required"),
  city: z.string().min(1, "City is required"),
  propertyType: z.enum(["Residential", "Commercial"]),
  monthlyRent: z.coerce.number().int().positive("Must be positive"),
  securityDeposit: z.coerce.number().int().nonnegative(),
  rentalPeriodMonths: z.coerce.number().int().positive().max(120),
  lockInMonths: z.coerce.number().int().nonnegative().max(60),
  startDate: z.string().min(1),
  lessorName: z.string().min(1),
  lessorFather: z.string().min(1),
  lessorAddress: z.string().min(1),
  lessorPan: z.string().optional(),
  lesseeName: z.string().min(1),
  lesseeFather: z.string().min(1),
  lesseeAddress: z.string().min(1),
  lesseePan: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export default function RentAgreementLanding() {
  const router = useRouter();
  const [amenities, setAmenities] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      propertyType: "Residential",
      rentalPeriodMonths: 11,
      lockInMonths: 6,
    },
  });

  function toggleAmenity(a: string) {
    setAmenities((prev) =>
      prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]
    );
  }

  async function onSubmit(values: FormValues) {
    setSubmitting(true);
    const payload = {
      state: values.state,
      city: values.city,
      propertyType: values.propertyType,
      monthlyRent: values.monthlyRent,
      securityDeposit: values.securityDeposit,
      rentalPeriodMonths: values.rentalPeriodMonths,
      lockInMonths: values.lockInMonths,
      startDate: values.startDate,
      lessor: {
        name: values.lessorName,
        fatherName: values.lessorFather,
        address: values.lessorAddress,
        pan: values.lessorPan,
      },
      lessee: {
        name: values.lesseeName,
        fatherName: values.lesseeFather,
        address: values.lesseeAddress,
        pan: values.lesseePan,
      },
      amenities,
    };

    try {
      sessionStorage.setItem(
        "tool:rent-agreement:input",
        JSON.stringify(payload)
      );
    } catch {}
    router.push("/tools/rent-agreement-generator/result");
  }

  return (
    <ToolLayout
      eyebrow="Free Citizen Tool"
      title="Rent Agreement Generator"
      subtitle="Create a ready-to-use rent agreement for any Indian state in under 3 minutes. Residential or commercial. No signup required."
      badges={[
        { label: "States covered", value: "28 + 8 UTs" },
        { label: "Time to draft", value: "≈ 3 min" },
        { label: "Price", value: "Free" },
        { label: "Agreement type", value: "Lease / Leave & Licence" },
      ]}
    >
      <Card className="mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText size={18} className="text-blue-700" />
            Enter your details
          </CardTitle>
          <p className="text-sm text-slate-600">
            We&apos;ll turn this into a clean, Indian-law-aligned rent agreement
            on the next screen.
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Property */}
            <section>
              <h3 className="font-heading mb-3 text-sm font-semibold text-slate-700 uppercase tracking-wider">
                Property
              </h3>
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
                  <Input {...register("city")} placeholder="e.g. Mumbai" />
                  <ErrText m={errors.city?.message} />
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
                          <SelectItem value="Residential">
                            Residential
                          </SelectItem>
                          <SelectItem value="Commercial">Commercial</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
                <div>
                  <Label>Start date *</Label>
                  <Input type="date" {...register("startDate")} />
                  <ErrText m={errors.startDate?.message} />
                </div>
              </div>
            </section>

            {/* Commercials */}
            <section>
              <h3 className="font-heading mb-3 text-sm font-semibold text-slate-700 uppercase tracking-wider">
                Commercials
              </h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label>Monthly rent (₹) *</Label>
                  <Input
                    type="number"
                    {...register("monthlyRent")}
                    placeholder="25000"
                  />
                  <ErrText m={errors.monthlyRent?.message} />
                </div>
                <div>
                  <Label>Security deposit (₹) *</Label>
                  <Input
                    type="number"
                    {...register("securityDeposit")}
                    placeholder="50000"
                  />
                  <ErrText m={errors.securityDeposit?.message} />
                </div>
                <div>
                  <Label>Rental period (months) *</Label>
                  <Input
                    type="number"
                    {...register("rentalPeriodMonths")}
                    placeholder="11"
                  />
                  <ErrText m={errors.rentalPeriodMonths?.message} />
                </div>
                <div>
                  <Label>Lock-in (months)</Label>
                  <Input
                    type="number"
                    {...register("lockInMonths")}
                    placeholder="6"
                  />
                </div>
              </div>
            </section>

            {/* Lessor */}
            <section>
              <h3 className="font-heading mb-3 text-sm font-semibold text-slate-700 uppercase tracking-wider">
                Lessor / Landlord
              </h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label>Full name *</Label>
                  <Input {...register("lessorName")} />
                  <ErrText m={errors.lessorName?.message} />
                </div>
                <div>
                  <Label>Father&apos;s name *</Label>
                  <Input {...register("lessorFather")} />
                  <ErrText m={errors.lessorFather?.message} />
                </div>
                <div className="sm:col-span-2">
                  <Label>Address *</Label>
                  <Input {...register("lessorAddress")} />
                  <ErrText m={errors.lessorAddress?.message} />
                </div>
                <div>
                  <Label>PAN (optional)</Label>
                  <Input {...register("lessorPan")} placeholder="ABCDE1234F" />
                </div>
              </div>
            </section>

            {/* Lessee */}
            <section>
              <h3 className="font-heading mb-3 text-sm font-semibold text-slate-700 uppercase tracking-wider">
                Lessee / Tenant
              </h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label>Full name *</Label>
                  <Input {...register("lesseeName")} />
                  <ErrText m={errors.lesseeName?.message} />
                </div>
                <div>
                  <Label>Father&apos;s name *</Label>
                  <Input {...register("lesseeFather")} />
                  <ErrText m={errors.lesseeFather?.message} />
                </div>
                <div className="sm:col-span-2">
                  <Label>Address *</Label>
                  <Input {...register("lesseeAddress")} />
                  <ErrText m={errors.lesseeAddress?.message} />
                </div>
                <div>
                  <Label>PAN (optional)</Label>
                  <Input {...register("lesseePan")} />
                </div>
              </div>
            </section>

            {/* Amenities */}
            <section>
              <h3 className="font-heading mb-3 text-sm font-semibold text-slate-700 uppercase tracking-wider">
                Amenities included
              </h3>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {DEFAULT_AMENITIES.map((a) => (
                  <label
                    key={a}
                    className={`flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors ${
                      amenities.includes(a)
                        ? "border-blue-600 bg-blue-50 text-blue-900"
                        : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                    }`}
                  >
                    <input
                      type="checkbox"
                      className="h-4 w-4 accent-blue-700"
                      checked={amenities.includes(a)}
                      onChange={() => toggleAmenity(a)}
                    />
                    {a}
                  </label>
                ))}
              </div>
            </section>

            <div className="flex flex-col gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-slate-500">
                We&apos;ll email you a copy on the next page.
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
