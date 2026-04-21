"use client";

import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { FileSignature, Loader2, Plus, Trash2 } from "lucide-react";

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

const partySchema = z.object({
  name: z.string().min(1),
  designation: z.string().min(1),
  organization: z.string().min(1),
});

const schema = z.object({
  mouType: z.enum([
    "Co-founder",
    "Advisor",
    "Business Partnership",
    "Channel Partner",
  ]),
  parties: z.array(partySchema).min(2).max(6),
  purpose: z.string().min(5),
  termMonths: z.coerce.number().int().positive().max(240),
  consideration: z.enum(["equity", "cash", "both", "none"]),
  considerationDetails: z.string().optional(),
  includeConfidentiality: z.boolean(),
  includeExclusivity: z.boolean(),
  governingState: z.string().min(1),
});

type FormValues = z.infer<typeof schema>;

export default function MouLanding() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      mouType: "Advisor",
      termMonths: 12,
      consideration: "equity",
      includeConfidentiality: true,
      includeExclusivity: false,
      parties: [
        { name: "", designation: "", organization: "" },
        { name: "", designation: "", organization: "" },
      ],
    },
  });

  const parties = watch("parties") ?? [];

  function addParty() {
    if (parties.length >= 6) return;
    setValue("parties", [
      ...parties,
      { name: "", designation: "", organization: "" },
    ]);
  }

  function removeParty(i: number) {
    if (parties.length <= 2) return;
    setValue("parties", parties.filter((_, idx) => idx !== i));
  }

  async function onSubmit(values: FormValues) {
    setSubmitting(true);
    try {
      sessionStorage.setItem("tool:mou:input", JSON.stringify(values));
    } catch {}
    router.push("/tools/mou-generator/result");
  }

  return (
    <ToolLayout
      eyebrow="Free Startup Tool"
      title="MOU Generator"
      subtitle="Draft a Memorandum of Understanding for co-founders, advisors, business partnerships or channel partners. India-law aligned."
      badges={[
        { label: "MOU types", value: "4" },
        { label: "Parties", value: "2 – 6" },
        { label: "Law basis", value: "ICA 1872" },
        { label: "Price", value: "Free" },
      ]}
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileSignature size={18} className="text-blue-700" />
            MOU details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <Label>MOU type *</Label>
              <Controller
                control={control}
                name="mouType"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Co-founder">Co-founder</SelectItem>
                      <SelectItem value="Advisor">Advisor</SelectItem>
                      <SelectItem value="Business Partnership">
                        Business Partnership
                      </SelectItem>
                      <SelectItem value="Channel Partner">
                        Channel Partner
                      </SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <section>
              <div className="mb-3 flex items-center justify-between">
                <h3 className="font-heading text-sm font-semibold uppercase tracking-wider text-slate-700">
                  Parties ({parties.length})
                </h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-8"
                  onClick={addParty}
                  disabled={parties.length >= 6}
                >
                  <Plus size={14} /> Add party
                </Button>
              </div>
              <div className="space-y-4">
                {parties.map((_, i) => (
                  <div
                    key={i}
                    className="rounded-lg border border-slate-200 bg-slate-50 p-4"
                  >
                    <div className="mb-3 flex items-center justify-between">
                      <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Party {i + 1}
                      </span>
                      {parties.length > 2 ? (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-7 text-red-600"
                          onClick={() => removeParty(i)}
                        >
                          <Trash2 size={13} /> Remove
                        </Button>
                      ) : null}
                    </div>
                    <div className="grid gap-3 sm:grid-cols-3">
                      <div>
                        <Label>Name *</Label>
                        <Input {...register(`parties.${i}.name` as const)} />
                      </div>
                      <div>
                        <Label>Designation *</Label>
                        <Input
                          {...register(`parties.${i}.designation` as const)}
                        />
                      </div>
                      <div>
                        <Label>Organization *</Label>
                        <Input
                          {...register(`parties.${i}.organization` as const)}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <Label>Purpose of MOU *</Label>
              <Textarea
                {...register("purpose")}
                placeholder="e.g., Advisor shall provide strategic advisory services in product and fundraising for 12 months…"
                className="min-h-[90px]"
              />
              <ErrText m={errors.purpose?.message} />
            </section>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label>Term (months) *</Label>
                <Input type="number" {...register("termMonths")} />
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
                <ErrText m={errors.governingState?.message} />
              </div>
              <div>
                <Label>Consideration *</Label>
                <Controller
                  control={control}
                  name="consideration"
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="equity">Equity</SelectItem>
                        <SelectItem value="cash">Cash</SelectItem>
                        <SelectItem value="both">Both</SelectItem>
                        <SelectItem value="none">None</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
              <div>
                <Label>Consideration details (optional)</Label>
                <Input
                  {...register("considerationDetails")}
                  placeholder="e.g., 0.5% equity vesting over 24 months"
                />
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <ToggleCard
                checked={watch("includeConfidentiality")}
                onChange={(v) => setValue("includeConfidentiality", v)}
                title="Include confidentiality"
                detail="3-year confidentiality obligation for non-public info shared."
              />
              <ToggleCard
                checked={watch("includeExclusivity")}
                onChange={(v) => setValue("includeExclusivity", v)}
                title="Include exclusivity"
                detail="Prevents discussions of similar arrangements with competitors."
              />
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
                  "Generate MOU →"
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
function ToggleCard({
  checked,
  onChange,
  title,
  detail,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  title: string;
  detail: string;
}) {
  return (
    <label
      className={`flex cursor-pointer items-start gap-3 rounded-lg border p-4 transition-colors ${
        checked
          ? "border-blue-600 bg-blue-50"
          : "border-slate-200 bg-white hover:border-slate-300"
      }`}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-1 h-4 w-4 accent-blue-700"
      />
      <div>
        <p className="text-sm font-medium text-slate-900">{title}</p>
        <p className="text-xs text-slate-500">{detail}</p>
      </div>
    </label>
  );
}
