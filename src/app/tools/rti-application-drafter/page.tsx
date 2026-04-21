"use client";

import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
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
import { ALL_STATES_UTS } from "@/lib/tools/types";

const schema = z.object({
  publicAuthorityName: z.string().min(1, "Required"),
  publicAuthorityAddress: z.string().min(1, "Required"),
  picoDesignation: z.string().optional(),
  informationSought: z.string().min(10, "Please describe what you need (min 10 chars)"),
  timePeriod: z.string().min(1, "Required"),
  applicantName: z.string().min(1),
  applicantAddress: z.string().min(1),
  applicantPhone: z.string().min(8),
  applicantEmail: z.string().email(),
  isBplCategory: z.boolean(),
  deliveryMode: z.enum(["Email", "Post", "In-person"]),
  state: z.string().min(1),
});

type FormValues = z.infer<typeof schema>;

export default function RtiLanding() {
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
      isBplCategory: false,
      deliveryMode: "Email",
    },
  });

  async function onSubmit(values: FormValues) {
    setSubmitting(true);
    try {
      sessionStorage.setItem("tool:rti:input", JSON.stringify(values));
    } catch {}
    router.push("/tools/rti-application-drafter/result");
  }

  return (
    <ToolLayout
      eyebrow="Free Citizen Tool"
      title="RTI Application Drafter"
      subtitle="Draft a Right to Information application under the RTI Act, 2005 — ready to send by post, email or the online portal."
      badges={[
        { label: "Act", value: "RTI 2005" },
        { label: "Response SLA", value: "30 days" },
        { label: "Fee", value: "₹10 / BPL-free" },
        { label: "Price", value: "Free" },
      ]}
    >
      <Card className="mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gavel size={18} className="text-blue-700" />
            Enter your request details
          </CardTitle>
          <p className="text-sm text-slate-600">
            We&apos;ll draft a compliant RTI application with all required
            sections and prayers.
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <section>
              <h3 className="font-heading mb-3 text-sm font-semibold uppercase tracking-wider text-slate-700">
                Public Authority
              </h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label>Authority name *</Label>
                  <Input
                    {...register("publicAuthorityName")}
                    placeholder="e.g. Municipal Corporation of Delhi"
                  />
                  <ErrText m={errors.publicAuthorityName?.message} />
                </div>
                <div>
                  <Label>PIO designation (optional)</Label>
                  <Input
                    {...register("picoDesignation")}
                    placeholder="e.g. CPIO, Finance Department"
                  />
                </div>
                <div className="sm:col-span-2">
                  <Label>Authority address *</Label>
                  <Input
                    {...register("publicAuthorityAddress")}
                    placeholder="Full postal address"
                  />
                  <ErrText m={errors.publicAuthorityAddress?.message} />
                </div>
              </div>
            </section>

            <section>
              <h3 className="font-heading mb-3 text-sm font-semibold uppercase tracking-wider text-slate-700">
                Information sought
              </h3>
              <div className="grid gap-4">
                <div>
                  <Label>Describe what you want *</Label>
                  <Textarea
                    rows={6}
                    {...register("informationSought")}
                    placeholder="Number each question clearly. E.g. 1. Certified copies of ... 2. Status of my application dated ..."
                  />
                  <ErrText m={errors.informationSought?.message} />
                </div>
                <div>
                  <Label>Time period *</Label>
                  <Input
                    {...register("timePeriod")}
                    placeholder="e.g. 1 April 2023 to 31 March 2024"
                  />
                  <ErrText m={errors.timePeriod?.message} />
                </div>
              </div>
            </section>

            <section>
              <h3 className="font-heading mb-3 text-sm font-semibold uppercase tracking-wider text-slate-700">
                Applicant
              </h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label>Full name *</Label>
                  <Input {...register("applicantName")} />
                  <ErrText m={errors.applicantName?.message} />
                </div>
                <div>
                  <Label>Phone *</Label>
                  <Input {...register("applicantPhone")} />
                  <ErrText m={errors.applicantPhone?.message} />
                </div>
                <div>
                  <Label>Email *</Label>
                  <Input type="email" {...register("applicantEmail")} />
                  <ErrText m={errors.applicantEmail?.message} />
                </div>
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
                <div className="sm:col-span-2">
                  <Label>Address *</Label>
                  <Input {...register("applicantAddress")} />
                  <ErrText m={errors.applicantAddress?.message} />
                </div>
              </div>
            </section>

            <section>
              <h3 className="font-heading mb-3 text-sm font-semibold uppercase tracking-wider text-slate-700">
                Delivery & Fee
              </h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label>Delivery mode *</Label>
                  <Controller
                    control={control}
                    name="deliveryMode"
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Email">Email</SelectItem>
                          <SelectItem value="Post">Registered Post</SelectItem>
                          <SelectItem value="In-person">In-person collection</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
                <div>
                  <Label>BPL category (fee exempt)</Label>
                  <Controller
                    control={control}
                    name="isBplCategory"
                    render={({ field }) => (
                      <Select
                        value={field.value ? "yes" : "no"}
                        onValueChange={(v) => field.onChange(v === "yes")}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="no">No</SelectItem>
                          <SelectItem value="yes">Yes (fee exempt)</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
              </div>
            </section>

            <div className="flex flex-col gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-slate-500">
                Free — ready to print or send online in under 2 minutes.
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
                  "Draft my RTI →"
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
