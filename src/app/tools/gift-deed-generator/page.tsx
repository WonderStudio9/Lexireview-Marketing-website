"use client";

import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { FileSignature, Loader2 } from "lucide-react";

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
  donorName: z.string().min(1),
  donorFather: z.string().min(1),
  donorAddress: z.string().min(1),
  donorPan: z.string().optional(),
  doneeName: z.string().min(1),
  doneeFather: z.string().min(1),
  doneeAddress: z.string().min(1),
  doneePan: z.string().optional(),
  relationship: z.enum([
    "Spouse",
    "Parent",
    "Child",
    "Sibling",
    "Grandparent",
    "Grandchild",
    "Other Blood Relative",
    "Non-Relative",
  ]),
  propertyType: z.enum(["Immovable", "Movable"]),
  propertyDescription: z.string().min(5),
  propertyValue: z.coerce.number().int().nonnegative(),
  state: z.string().min(1),
  city: z.string().min(1),
});

type FormValues = z.infer<typeof schema>;

export default function GiftDeedLanding() {
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
      relationship: "Child",
      propertyType: "Immovable",
    },
  });

  async function onSubmit(values: FormValues) {
    setSubmitting(true);
    try {
      sessionStorage.setItem("tool:gift-deed:input", JSON.stringify(values));
    } catch {}
    router.push("/tools/gift-deed-generator/result");
  }

  return (
    <ToolLayout
      eyebrow="Free NRI / Family Tool"
      title="Gift Deed Generator"
      subtitle="Draft a Gift Deed under Section 122 of the Transfer of Property Act, 1882 — with state-specific stamp duty estimate."
      badges={[
        { label: "Section", value: "122 TPA" },
        { label: "States", value: "28 + 8 UTs" },
        { label: "Stamp duty", value: "Concessional if relative" },
        { label: "Price", value: "Free" },
      ]}
    >
      <Card className="mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileSignature size={18} className="text-blue-700" />
            Donor, donee & property
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <section>
              <h3 className="font-heading mb-3 text-sm font-semibold uppercase tracking-wider text-slate-700">
                Donor
              </h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label>Full name *</Label>
                  <Input {...register("donorName")} />
                  <ErrText m={errors.donorName?.message} />
                </div>
                <div>
                  <Label>Father / spouse name *</Label>
                  <Input {...register("donorFather")} />
                  <ErrText m={errors.donorFather?.message} />
                </div>
                <div className="sm:col-span-2">
                  <Label>Address *</Label>
                  <Input {...register("donorAddress")} />
                  <ErrText m={errors.donorAddress?.message} />
                </div>
                <div>
                  <Label>PAN (optional)</Label>
                  <Input {...register("donorPan")} />
                </div>
              </div>
            </section>

            <section>
              <h3 className="font-heading mb-3 text-sm font-semibold uppercase tracking-wider text-slate-700">
                Donee
              </h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label>Full name *</Label>
                  <Input {...register("doneeName")} />
                  <ErrText m={errors.doneeName?.message} />
                </div>
                <div>
                  <Label>Father / spouse name *</Label>
                  <Input {...register("doneeFather")} />
                  <ErrText m={errors.doneeFather?.message} />
                </div>
                <div className="sm:col-span-2">
                  <Label>Address *</Label>
                  <Input {...register("doneeAddress")} />
                  <ErrText m={errors.doneeAddress?.message} />
                </div>
                <div>
                  <Label>PAN (optional)</Label>
                  <Input {...register("doneePan")} />
                </div>
                <div>
                  <Label>Relationship *</Label>
                  <Controller
                    control={control}
                    name="relationship"
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Spouse">Spouse</SelectItem>
                          <SelectItem value="Parent">Parent</SelectItem>
                          <SelectItem value="Child">Child</SelectItem>
                          <SelectItem value="Sibling">Sibling</SelectItem>
                          <SelectItem value="Grandparent">Grandparent</SelectItem>
                          <SelectItem value="Grandchild">Grandchild</SelectItem>
                          <SelectItem value="Other Blood Relative">
                            Other Blood Relative
                          </SelectItem>
                          <SelectItem value="Non-Relative">Non-Relative</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
              </div>
            </section>

            <section>
              <h3 className="font-heading mb-3 text-sm font-semibold uppercase tracking-wider text-slate-700">
                Property
              </h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label>Property type *</Label>
                  <Controller
                    control={control}
                    name="propertyType"
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Immovable">Immovable (land / flat / house)</SelectItem>
                          <SelectItem value="Movable">Movable (jewellery / shares / car)</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
                <div>
                  <Label>Approx. property value (₹) *</Label>
                  <Input type="number" {...register("propertyValue")} placeholder="5000000" />
                  <ErrText m={errors.propertyValue?.message} />
                </div>
                <div className="sm:col-span-2">
                  <Label>Full description *</Label>
                  <Textarea
                    rows={4}
                    {...register("propertyDescription")}
                    placeholder="e.g. Flat No. 402, Building B, Sunrise Apartments, Plot 27, Andheri West, Mumbai - 400058, admeasuring 850 sq ft carpet area..."
                  />
                  <ErrText m={errors.propertyDescription?.message} />
                </div>
                <div>
                  <Label>State *</Label>
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
                  <Input {...register("city")} />
                  <ErrText m={errors.city?.message} />
                </div>
              </div>
            </section>

            <div className="flex flex-col gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-slate-500">
                We&apos;ll compute stamp duty and flag registration requirements.
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
                  "Generate deed →"
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
