"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Calculator, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { ToolLayout } from "@/components/tools/tool-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { EmailGate } from "@/components/tools/email-gate";
import { PremiumUpsell } from "@/components/tools/premium-upsell";
import type { ReStampDutyInput, ReStampDutyOutput } from "@/lib/tools/types";

export default function ReStampDutyResultPage() {
  const router = useRouter();
  const [input, setInput] = useState<ReStampDutyInput | null>(null);
  const [output, setOutput] = useState<ReStampDutyOutput | null>(null);
  const [loading, setLoading] = useState(false);
  const [unlocked, setUnlocked] = useState(false);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("tool:re-stamp-duty:input");
      if (!raw) {
        router.replace("/tools/real-estate-stamp-duty-calculator");
        return;
      }
      setInput(JSON.parse(raw) as ReStampDutyInput);
    } catch {
      router.replace("/tools/real-estate-stamp-duty-calculator");
    }
  }, [router]);

  async function runCalc(leadId: string) {
    if (!input) return;
    setLoading(true);
    try {
      const res = await fetch(
        "/api/tools/real-estate-stamp-duty-calculator/calculate",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...input, leadId }),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Calculation failed");
      setOutput(data as ReStampDutyOutput);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not calculate");
    } finally {
      setLoading(false);
    }
  }

  const fmt = (n: number) => `₹${n.toLocaleString("en-IN")}`;

  return (
    <ToolLayout
      eyebrow="Result"
      title="Real Estate Stamp Duty Estimate"
      subtitle={
        input
          ? `${input.transactionType} • ${input.city}, ${input.state}`
          : "Calculating…"
      }
    >
      {!unlocked ? (
        <EmailGate
          icp="RE_DEVELOPER"
          sourceDetail="real-estate-stamp-duty-calculator"
          onUnlocked={(id) => {
            setUnlocked(true);
            runCalc(id);
          }}
        />
      ) : loading ? (
        <div className="flex items-center gap-2 py-16 text-sm text-slate-500">
          <Loader2 size={16} className="animate-spin" /> Calculating…
        </div>
      ) : output && input ? (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator size={18} className="text-blue-700" /> Closing-cost
                breakdown
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-6 rounded-xl border border-blue-100 bg-gradient-to-br from-blue-50 to-white p-4">
                <p className="text-xs font-semibold tracking-wider text-blue-700 uppercase">
                  Total cost to closing
                </p>
                <p className="font-heading mt-1 text-3xl font-bold text-blue-900 sm:text-4xl">
                  {fmt(output.costToClosing)}
                </p>
                <p className="mt-1 text-xs text-slate-600">
                  on a consideration of {fmt(input.propertyValue)}
                </p>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Component</TableHead>
                    <TableHead>Rate</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>
                      Stamp duty{" "}
                      {output.womenConcessionApplied ? (
                        <span className="ml-1 text-[10px] font-semibold tracking-wider text-emerald-700 uppercase">
                          women concession
                        </span>
                      ) : null}
                      {output.firstTimeBuyerRebateApplied ? (
                        <span className="ml-1 text-[10px] font-semibold tracking-wider text-blue-700 uppercase">
                          FTB rebate
                        </span>
                      ) : null}
                    </TableCell>
                    <TableCell>{output.stampDutyRatePct}%</TableCell>
                    <TableCell className="text-right font-medium">
                      {fmt(output.stampDuty)}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Registration charges</TableCell>
                    <TableCell>{output.registrationRatePct}%</TableCell>
                    <TableCell className="text-right font-medium">
                      {fmt(output.registrationCharges)}
                    </TableCell>
                  </TableRow>
                  {output.municipalSurcharge > 0 ? (
                    <TableRow>
                      <TableCell>Municipal surcharge</TableCell>
                      <TableCell>—</TableCell>
                      <TableCell className="text-right font-medium">
                        {fmt(output.municipalSurcharge)}
                      </TableCell>
                    </TableRow>
                  ) : null}
                  <TableRow>
                    <TableCell>
                      Additional local fees{" "}
                      <span className="text-xs text-slate-500">
                        (labour cess + legal scrutiny + mutation)
                      </span>
                    </TableCell>
                    <TableCell>~0.2%</TableCell>
                    <TableCell className="text-right font-medium">
                      {fmt(output.additionalLocalFees)}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>

              {output.notes.length > 0 ? (
                <ul className="mt-4 space-y-2 text-xs text-slate-600">
                  {output.notes.map((n, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="mt-1 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-blue-600" />
                      {n}
                    </li>
                  ))}
                </ul>
              ) : null}

              <p className="mt-4 rounded-lg bg-amber-50 p-3 text-xs text-amber-900">
                <strong>Disclaimer: </strong>
                {output.disclaimer}
              </p>
            </CardContent>
          </Card>

          <PremiumUpsell
            title="Full state-specific closing cost breakdown PDF"
            description="Print-ready PDF with state stamp-act citations, municipality-wise schedule, pre-SRO checklist and builder-buyer payment schedule."
            priceInr={199}
            ctaLabel="Get the PDF for ₹199"
            bullets={[
              "State stamp-act citations inline",
              "Municipality-wise cess & surcharge schedule",
              "Pre-SRO checklist",
              "Developer payment / milestone schedule template",
            ]}
          />
        </div>
      ) : null}
    </ToolLayout>
  );
}
