"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Calculator, Loader2, Mail } from "lucide-react";
import { toast } from "sonner";

import { ToolLayout } from "@/components/tools/tool-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PremiumUpsell } from "@/components/tools/premium-upsell";
import type { StampDutyInput, StampDutyOutput } from "@/lib/tools/types";
import { captureLead } from "@/lib/tools/capture-lead";

export default function StampDutyResultPage() {
  const router = useRouter();
  const [input, setInput] = useState<StampDutyInput | null>(null);
  const [output, setOutput] = useState<StampDutyOutput | null>(null);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [emailSubmitting, setEmailSubmitting] = useState(false);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("tool:stamp-duty:input");
      if (!raw) {
        router.replace("/tools/stamp-duty-calculator");
        return;
      }
      const parsed = JSON.parse(raw) as StampDutyInput;
      setInput(parsed);
      runCalc(parsed);
    } catch {
      router.replace("/tools/stamp-duty-calculator");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  async function runCalc(payload: StampDutyInput, leadId?: string) {
    setLoading(true);
    try {
      const res = await fetch("/api/tools/stamp-duty-calculator/calculate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, leadId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Calculation failed");
      setOutput(data as StampDutyOutput);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not calculate");
    } finally {
      setLoading(false);
    }
  }

  async function handleEmailMe(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !/.+@.+\..+/.test(email)) {
      toast.error("Please enter a valid email");
      return;
    }
    setEmailSubmitting(true);
    try {
      await captureLead({
        email: email.trim(),
        icp: "HOME_BUYER",
        source: "ORGANIC_TOOL",
        sourceDetail: "stamp-duty-calculator",
        firstTouchUrl: window.location.href,
      });
      toast.success("We'll email you this calculation shortly");
    } catch {
      toast.success("Saved. We'll send you a copy soon.");
    } finally {
      setEmailSubmitting(false);
    }
  }

  const fmt = (n: number) => `₹${n.toLocaleString("en-IN")}`;

  return (
    <ToolLayout
      eyebrow="Result"
      title="Your Stamp Duty estimate"
      subtitle={
        input
          ? `${input.transactionType} • ${input.propertyType} • ${input.city}, ${input.state}`
          : "Calculating…"
      }
    >
      {loading ? (
        <div className="flex items-center gap-2 py-12 text-sm text-slate-500">
          <Loader2 size={16} className="animate-spin" /> Calculating…
        </div>
      ) : output && input ? (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator size={18} className="text-blue-700" />
                Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-6 rounded-xl border border-blue-100 bg-gradient-to-br from-blue-50 to-white p-4">
                <p className="text-xs font-semibold tracking-wider text-blue-700 uppercase">
                  Total payable
                </p>
                <p className="font-heading mt-1 text-3xl font-bold text-blue-900 sm:text-4xl">
                  {fmt(output.total)}
                </p>
                <p className="mt-1 text-xs text-slate-600">
                  on a property value of {fmt(input.propertyValue)}
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

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail size={18} className="text-blue-700" />
                Email me this result (optional)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={handleEmailMe}
                className="flex flex-col gap-3 sm:flex-row"
              >
                <Input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-10 sm:flex-1"
                />
                <Button
                  type="submit"
                  disabled={emailSubmitting}
                  className="h-10 bg-blue-700 px-6 text-white hover:bg-blue-800"
                >
                  {emailSubmitting ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    "Email me"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          <PremiumUpsell
            title="Download as PDF + legal notes (₹99)"
            description="Formatted PDF with state citations, municipal schedule, and a pre-filing checklist for the SRO."
            priceInr={99}
            ctaLabel="Get the PDF for ₹99"
            bullets={[
              "Professionally formatted for your records",
              "State stamp-act citations inline",
              "Pre-SRO checklist (ID, proof, NOC)",
              "Instant download",
            ]}
          />
        </div>
      ) : null}
    </ToolLayout>
  );
}
