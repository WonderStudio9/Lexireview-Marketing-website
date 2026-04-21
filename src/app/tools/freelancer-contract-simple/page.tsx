"use client";

import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { Briefcase, Loader2, Plus, X } from "lucide-react";

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
  freelancerName: z.string().min(1),
  freelancerAddress: z.string().min(1),
  freelancerPan: z.string().optional(),
  freelancerGstin: z.string().optional(),
  clientName: z.string().min(1),
  clientAddress: z.string().min(1),
  clientGstin: z.string().optional(),
  projectScope: z.string().min(5),
  deliverables: z.string().min(5),
  paymentType: z.enum(["Hourly", "Fixed Project", "Milestone"]),
  hourlyRate: z.coerce.number().nonnegative().optional(),
  fixedAmount: z.coerce.number().nonnegative().optional(),
  paymentTermDays: z.coerce.number().int().positive().max(180),
  ipAssignment: z.boolean(),
  confidentiality: z.boolean(),
  governingState: z.string().min(1),
  startDate: z.string().min(1),
  endDate: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

interface Milestone {
  description: string;
  amount: number;
  dueDate?: string;
}

export default function FreelancerContractLanding() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [milestones, setMilestones] = useState<Milestone[]>([]);

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      paymentType: "Fixed Project",
      paymentTermDays: 15,
      ipAssignment: true,
      confidentiality: true,
    },
  });

  const paymentType = watch("paymentType");

  async function onSubmit(values: FormValues) {
    setSubmitting(true);
    const payload = { ...values, milestones: paymentType === "Milestone" ? milestones : undefined };
    try {
      sessionStorage.setItem(
        "tool:freelancer-contract-simple:input",
        JSON.stringify(payload)
      );
    } catch {}
    router.push("/tools/freelancer-contract-simple/result");
  }

  return (
    <ToolLayout
      eyebrow="Free Freelancer Tool"
      title="Freelancer Contract Generator"
      subtitle="A simplified, India-ready freelance services agreement — with GST, TDS Section 194J, IP assignment and milestone payment clauses."
      badges={[
        { label: "GST aware", value: "Yes" },
        { label: "TDS", value: "194J" },
        { label: "IP assignment", value: "Optional" },
        { label: "Price", value: "Free" },
      ]}
    >
      <Card className="mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Briefcase size={18} className="text-blue-700" />
            Parties, scope & payment
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <section>
              <h3 className="font-heading mb-3 text-sm font-semibold uppercase tracking-wider text-slate-700">
                Freelancer
              </h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label>Your name *</Label>
                  <Input {...register("freelancerName")} />
                  <ErrText m={errors.freelancerName?.message} />
                </div>
                <div>
                  <Label>PAN (optional)</Label>
                  <Input {...register("freelancerPan")} />
                </div>
                <div>
                  <Label>GSTIN (optional)</Label>
                  <Input {...register("freelancerGstin")} />
                </div>
                <div className="sm:col-span-2">
                  <Label>Address *</Label>
                  <Input {...register("freelancerAddress")} />
                  <ErrText m={errors.freelancerAddress?.message} />
                </div>
              </div>
            </section>

            <section>
              <h3 className="font-heading mb-3 text-sm font-semibold uppercase tracking-wider text-slate-700">
                Client
              </h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label>Client name *</Label>
                  <Input {...register("clientName")} />
                  <ErrText m={errors.clientName?.message} />
                </div>
                <div>
                  <Label>Client GSTIN (optional)</Label>
                  <Input {...register("clientGstin")} />
                </div>
                <div className="sm:col-span-2">
                  <Label>Client address *</Label>
                  <Input {...register("clientAddress")} />
                  <ErrText m={errors.clientAddress?.message} />
                </div>
              </div>
            </section>

            <section>
              <h3 className="font-heading mb-3 text-sm font-semibold uppercase tracking-wider text-slate-700">
                Scope & deliverables
              </h3>
              <div className="grid gap-4">
                <div>
                  <Label>Project scope *</Label>
                  <Textarea rows={3} {...register("projectScope")} />
                  <ErrText m={errors.projectScope?.message} />
                </div>
                <div>
                  <Label>Deliverables *</Label>
                  <Textarea rows={3} {...register("deliverables")} />
                  <ErrText m={errors.deliverables?.message} />
                </div>
              </div>
            </section>

            <section>
              <h3 className="font-heading mb-3 text-sm font-semibold uppercase tracking-wider text-slate-700">
                Payment
              </h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label>Payment type *</Label>
                  <Controller
                    control={control}
                    name="paymentType"
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Hourly">Hourly</SelectItem>
                          <SelectItem value="Fixed Project">
                            Fixed Project
                          </SelectItem>
                          <SelectItem value="Milestone">Milestone</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
                <div>
                  <Label>Payment term (days from invoice) *</Label>
                  <Input type="number" {...register("paymentTermDays")} />
                </div>
                {paymentType === "Hourly" ? (
                  <div>
                    <Label>Hourly rate (₹)</Label>
                    <Input type="number" {...register("hourlyRate")} />
                  </div>
                ) : null}
                {paymentType === "Fixed Project" ? (
                  <div>
                    <Label>Total fixed amount (₹)</Label>
                    <Input type="number" {...register("fixedAmount")} />
                  </div>
                ) : null}
              </div>

              {paymentType === "Milestone" ? (
                <div className="mt-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="text-xs font-semibold text-slate-700">
                      Milestones
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setMilestones((m) => [
                          ...m,
                          { description: "", amount: 0 },
                        ])
                      }
                      className="h-8"
                    >
                      <Plus size={12} /> Add milestone
                    </Button>
                  </div>
                  {milestones.map((m, i) => (
                    <div
                      key={i}
                      className="grid gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3 sm:grid-cols-4"
                    >
                      <div className="sm:col-span-2">
                        <Input
                          placeholder="Description"
                          value={m.description}
                          onChange={(e) =>
                            setMilestones((prev) =>
                              prev.map((x, j) =>
                                j === i
                                  ? { ...x, description: e.target.value }
                                  : x
                              )
                            )
                          }
                        />
                      </div>
                      <Input
                        type="number"
                        placeholder="Amount (₹)"
                        value={m.amount}
                        onChange={(e) =>
                          setMilestones((prev) =>
                            prev.map((x, j) =>
                              j === i
                                ? {
                                    ...x,
                                    amount: parseInt(e.target.value) || 0,
                                  }
                                : x
                            )
                          )
                        }
                      />
                      <div className="flex gap-2">
                        <Input
                          type="date"
                          value={m.dueDate ?? ""}
                          onChange={(e) =>
                            setMilestones((prev) =>
                              prev.map((x, j) =>
                                j === i
                                  ? { ...x, dueDate: e.target.value }
                                  : x
                              )
                            )
                          }
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="h-10 w-10 p-0"
                          onClick={() =>
                            setMilestones((prev) =>
                              prev.filter((_, j) => j !== i)
                            )
                          }
                        >
                          <X size={14} />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : null}
            </section>

            <section>
              <h3 className="font-heading mb-3 text-sm font-semibold uppercase tracking-wider text-slate-700">
                Terms
              </h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label>Start date *</Label>
                  <Input type="date" {...register("startDate")} />
                </div>
                <div>
                  <Label>End date (optional)</Label>
                  <Input type="date" {...register("endDate")} />
                </div>
                <div>
                  <Label>Governing state *</Label>
                  <Controller
                    control={control}
                    name="governingState"
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
                </div>
                <div>
                  <Label>IP assignment?</Label>
                  <Controller
                    control={control}
                    name="ipAssignment"
                    render={({ field }) => (
                      <Select
                        value={field.value ? "yes" : "no"}
                        onValueChange={(v) => field.onChange(v === "yes")}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="yes">
                            Yes — assign to client
                          </SelectItem>
                          <SelectItem value="no">
                            No — licence only
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
                <div>
                  <Label>Confidentiality clause?</Label>
                  <Controller
                    control={control}
                    name="confidentiality"
                    render={({ field }) => (
                      <Select
                        value={field.value ? "yes" : "no"}
                        onValueChange={(v) => field.onChange(v === "yes")}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="yes">Yes</SelectItem>
                          <SelectItem value="no">No</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
              </div>
            </section>

            <div className="flex flex-col gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-slate-500">
                Free — ready to sign and send to your client.
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
                  "Generate contract →"
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
