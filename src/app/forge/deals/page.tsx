"use client";

import * as React from "react";
import { Loader2, Plus, IndianRupee } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";

const STAGES = [
  "DISCOVERY",
  "DEMO_SCHEDULED",
  "DEMO_DONE",
  "POC",
  "PROPOSAL",
  "NEGOTIATION",
  "CLOSED_WON",
  "CLOSED_LOST",
] as const;

const stageColors: Record<string, string> = {
  DISCOVERY: "bg-slate-400",
  DEMO_SCHEDULED: "bg-blue-400",
  DEMO_DONE: "bg-indigo-400",
  POC: "bg-cyan-400",
  PROPOSAL: "bg-amber-400",
  NEGOTIATION: "bg-orange-400",
  CLOSED_WON: "bg-emerald-400",
  CLOSED_LOST: "bg-red-400",
};

interface Deal {
  id: string;
  name: string;
  stage: string;
  valueINR: number;
  probability: number;
  weightedValue: number;
  expectedCloseDate?: string | null;
  account?: { name: string; tier: string; icp: string };
  primaryLead?: { email: string; firstName?: string | null };
  _count?: { notes: number; proposals: number };
}

interface StageAgg {
  stage: string;
  _count: number;
  _sum: { valueINR: number | null; weightedValue: number | null };
}

function formatINR(n: number): string {
  if (n >= 10_000_000) return `₹${(n / 10_000_000).toFixed(1)}Cr`;
  if (n >= 100_000) return `₹${(n / 100_000).toFixed(1)}L`;
  if (n >= 1000) return `₹${(n / 1000).toFixed(0)}K`;
  return `₹${n}`;
}

export default function DealsPage() {
  const [loading, setLoading] = React.useState(true);
  const [deals, setDeals] = React.useState<Deal[]>([]);
  const [byStage, setByStage] = React.useState<StageAgg[]>([]);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    fetch("/api/deals")
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((data) => {
        setDeals(data.deals);
        setByStage(data.byStage);
        setLoading(false);
      })
      .catch((e) => {
        setError(e.message);
        setLoading(false);
      });
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-6 h-6 text-teal-400 animate-spin" />
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center h-96 text-red-400">{error}</div>
    );

  const grouped: Record<string, Deal[]> = {};
  STAGES.forEach((s) => (grouped[s] = []));
  deals.forEach((d) => grouped[d.stage]?.push(d));

  const aggByStage = new Map<string, StageAgg>();
  byStage.forEach((a) => aggByStage.set(a.stage, a));

  const totalPipeline = byStage.reduce(
    (acc, a) => acc + (a._sum.valueINR || 0),
    0,
  );
  const weightedPipeline = byStage.reduce(
    (acc, a) => acc + (a._sum.weightedValue || 0),
    0,
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-4">
          <div className="text-xs text-slate-500">
            <span className="text-slate-300 font-semibold">{deals.length}</span>{" "}
            deals ·{" "}
            <span className="text-slate-300 font-semibold">{formatINR(totalPipeline)}</span>{" "}
            pipeline ·{" "}
            <span className="text-emerald-400 font-semibold">
              {formatINR(weightedPipeline)}
            </span>{" "}
            weighted
          </div>
        </div>
      </div>

      <div className="overflow-x-auto pb-4 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
        <div className="flex gap-3 min-w-max">
          {STAGES.map((stage) => {
            const agg = aggByStage.get(stage);
            const stageDeals = grouped[stage] || [];
            const stageValue = agg?._sum.valueINR || 0;
            return (
              <div key={stage} className="w-72 shrink-0">
                <div className="flex items-center gap-2 mb-3 px-1">
                  <div className={cn("w-2 h-2 rounded-full", stageColors[stage])} />
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    {stage.replace(/_/g, " ")}
                  </span>
                  <span className="text-[10px] font-medium text-slate-600 bg-white/[0.04] px-1.5 py-0.5 rounded-full">
                    {stageDeals.length}
                  </span>
                  {stageValue > 0 && (
                    <span className="ml-auto text-[10px] font-semibold text-slate-300 tabular-nums">
                      {formatINR(stageValue)}
                    </span>
                  )}
                </div>
                <div className="space-y-2.5 min-h-[8rem]">
                  {stageDeals.map((d) => (
                    <Card
                      key={d.id}
                      className="bg-white/[0.03] border-0 ring-1 ring-white/[0.06] hover:ring-white/[0.12] cursor-pointer transition-all text-white"
                    >
                      <CardContent className="p-3 space-y-2">
                        <div className="text-sm font-medium text-slate-200 leading-snug line-clamp-2">
                          {d.name}
                        </div>
                        {d.account && (
                          <div className="text-xs text-slate-400">
                            {d.account.name}
                          </div>
                        )}
                        <div className="flex items-center justify-between text-xs">
                          <span className="inline-flex items-center gap-1 tabular-nums text-slate-300">
                            <IndianRupee size={11} />
                            {formatINR(d.valueINR)}
                          </span>
                          <span className="text-slate-500 text-[10px] font-medium">
                            {d.probability}%
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
