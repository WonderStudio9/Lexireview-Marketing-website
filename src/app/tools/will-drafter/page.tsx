"use client";

import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { FileText, Loader2, Plus, X } from "lucide-react";

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
  testatorName: z.string().min(1),
  fatherName: z.string().min(1),
  age: z.coerce.number().int().min(18).max(130),
  address: z.string().min(1),
  religion: z.enum(["Hindu", "Muslim", "Christian", "Parsi", "Sikh", "Other"]),
  executorName: z.string().min(1),
  executorAddress: z.string().min(1),
  city: z.string().min(1),
  state: z.string().min(1),
  witness1Name: z.string().min(1),
  witness1Address: z.string().min(1),
  witness2Name: z.string().min(1),
  witness2Address: z.string().min(1),
});

type FormValues = z.infer<typeof schema>;

interface Asset {
  description: string;
  approxValue?: number;
}

interface Beneficiary {
  name: string;
  relationship: string;
  sharePct: number;
}

export default function WillLanding() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [assets, setAssets] = useState<Asset[]>([
    { description: "" },
  ]);
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([
    { name: "", relationship: "", sharePct: 100 },
  ]);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { religion: "Hindu" },
  });

  async function onSubmit(values: FormValues) {
    setSubmitting(true);
    const payload = {
      testatorName: values.testatorName,
      fatherName: values.fatherName,
      age: values.age,
      address: values.address,
      religion: values.religion,
      assets: assets.filter((a) => a.description),
      beneficiaries: beneficiaries.filter((b) => b.name),
      executorName: values.executorName,
      executorAddress: values.executorAddress,
      witnesses: [
        { name: values.witness1Name, address: values.witness1Address },
        { name: values.witness2Name, address: values.witness2Address },
      ],
      city: values.city,
      state: values.state,
    };
    try {
      sessionStorage.setItem("tool:will:input", JSON.stringify(payload));
    } catch {}
    router.push("/tools/will-drafter/result");
  }

  return (
    <ToolLayout
      eyebrow="Free Senior Citizen Tool"
      title="Will Drafter (Simple)"
      subtitle="Draft a simple Will under the Indian Succession Act, 1925 in under 5 minutes — with 2 witnesses, executor, and a clear schedule of assets."
      badges={[
        { label: "Act", value: "ISA 1925" },
        { label: "Witnesses", value: "2 (Section 63)" },
        { label: "Registration", value: "Optional" },
        { label: "Price", value: "Free" },
      ]}
    >
      <Card className="mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText size={18} className="text-blue-700" />
            Testator & assets
          </CardTitle>
          <p className="text-sm text-slate-600">
            Important: this is an informational template. For large estates or
            if Muslim personal law applies, consult an advocate.
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <section>
              <h3 className="font-heading mb-3 text-sm font-semibold uppercase tracking-wider text-slate-700">
                Testator
              </h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label>Full name *</Label>
                  <Input {...register("testatorName")} />
                  <ErrText m={errors.testatorName?.message} />
                </div>
                <div>
                  <Label>Father / spouse name *</Label>
                  <Input {...register("fatherName")} />
                  <ErrText m={errors.fatherName?.message} />
                </div>
                <div>
                  <Label>Age *</Label>
                  <Input type="number" {...register("age")} />
                  <ErrText m={errors.age?.message} />
                </div>
                <div>
                  <Label>Religion *</Label>
                  <Controller
                    control={control}
                    name="religion"
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Hindu">Hindu</SelectItem>
                          <SelectItem value="Muslim">Muslim</SelectItem>
                          <SelectItem value="Christian">Christian</SelectItem>
                          <SelectItem value="Parsi">Parsi</SelectItem>
                          <SelectItem value="Sikh">Sikh</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
                <div className="sm:col-span-2">
                  <Label>Address *</Label>
                  <Input {...register("address")} />
                  <ErrText m={errors.address?.message} />
                </div>
                <div>
                  <Label>City *</Label>
                  <Input {...register("city")} />
                  <ErrText m={errors.city?.message} />
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
              </div>
            </section>

            <section>
              <div className="mb-3 flex items-baseline justify-between gap-4">
                <h3 className="font-heading text-sm font-semibold uppercase tracking-wider text-slate-700">
                  Assets
                </h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setAssets((a) => [...a, { description: "" }])}
                  className="h-8"
                >
                  <Plus size={12} /> Add asset
                </Button>
              </div>
              <div className="space-y-3">
                {assets.map((a, i) => (
                  <div
                    key={i}
                    className="grid gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3 sm:grid-cols-3"
                  >
                    <div className="sm:col-span-2">
                      <Input
                        placeholder="e.g. Flat at 12/A, Andheri (W), Mumbai"
                        value={a.description}
                        onChange={(e) =>
                          setAssets((prev) =>
                            prev.map((x, j) =>
                              j === i ? { ...x, description: e.target.value } : x
                            )
                          )
                        }
                      />
                    </div>
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        placeholder="Value (₹)"
                        value={a.approxValue ?? ""}
                        onChange={(e) =>
                          setAssets((prev) =>
                            prev.map((x, j) =>
                              j === i
                                ? {
                                    ...x,
                                    approxValue: e.target.value
                                      ? parseInt(e.target.value, 10)
                                      : undefined,
                                  }
                                : x
                            )
                          )
                        }
                      />
                      {assets.length > 1 ? (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="h-10 w-10 p-0"
                          onClick={() =>
                            setAssets((prev) => prev.filter((_, j) => j !== i))
                          }
                        >
                          <X size={14} />
                        </Button>
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <div className="mb-3 flex items-baseline justify-between gap-4">
                <h3 className="font-heading text-sm font-semibold uppercase tracking-wider text-slate-700">
                  Beneficiaries
                </h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setBeneficiaries((b) => [
                      ...b,
                      { name: "", relationship: "", sharePct: 0 },
                    ])
                  }
                  className="h-8"
                >
                  <Plus size={12} /> Add beneficiary
                </Button>
              </div>
              <div className="space-y-3">
                {beneficiaries.map((b, i) => (
                  <div
                    key={i}
                    className="grid gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3 sm:grid-cols-4"
                  >
                    <Input
                      placeholder="Name"
                      value={b.name}
                      onChange={(e) =>
                        setBeneficiaries((prev) =>
                          prev.map((x, j) =>
                            j === i ? { ...x, name: e.target.value } : x
                          )
                        )
                      }
                    />
                    <Input
                      placeholder="Relationship"
                      value={b.relationship}
                      onChange={(e) =>
                        setBeneficiaries((prev) =>
                          prev.map((x, j) =>
                            j === i ? { ...x, relationship: e.target.value } : x
                          )
                        )
                      }
                    />
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="Share %"
                      value={b.sharePct}
                      onChange={(e) =>
                        setBeneficiaries((prev) =>
                          prev.map((x, j) =>
                            j === i
                              ? {
                                  ...x,
                                  sharePct: parseFloat(e.target.value) || 0,
                                }
                              : x
                          )
                        )
                      }
                    />
                    {beneficiaries.length > 1 ? (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-10 w-10 p-0"
                        onClick={() =>
                          setBeneficiaries((prev) =>
                            prev.filter((_, j) => j !== i)
                          )
                        }
                      >
                        <X size={14} />
                      </Button>
                    ) : null}
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h3 className="font-heading mb-3 text-sm font-semibold uppercase tracking-wider text-slate-700">
                Executor
              </h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label>Executor name *</Label>
                  <Input {...register("executorName")} />
                  <ErrText m={errors.executorName?.message} />
                </div>
                <div>
                  <Label>Executor address *</Label>
                  <Input {...register("executorAddress")} />
                  <ErrText m={errors.executorAddress?.message} />
                </div>
              </div>
            </section>

            <section>
              <h3 className="font-heading mb-3 text-sm font-semibold uppercase tracking-wider text-slate-700">
                Witnesses (2 required)
              </h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label>Witness 1 name *</Label>
                  <Input {...register("witness1Name")} />
                </div>
                <div>
                  <Label>Witness 1 address *</Label>
                  <Input {...register("witness1Address")} />
                </div>
                <div>
                  <Label>Witness 2 name *</Label>
                  <Input {...register("witness2Name")} />
                </div>
                <div>
                  <Label>Witness 2 address *</Label>
                  <Input {...register("witness2Address")} />
                </div>
              </div>
            </section>

            <div className="flex flex-col gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-slate-500">
                Tip: total beneficiary shares should add to 100%.
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
                  "Draft my Will →"
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
