"use client";

import * as React from "react";
import {
  Loader2,
  TrendingUp,
  Users,
  Target,
  UserPlus,
  ShoppingCart,
  XCircle,
  BarChart3,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatsCard } from "@/components/forge/stats-card";

interface Funnel {
  totalLeads: number;
  mqlLeads: number;
  sqlLeads: number;
  trialLeads: number;
  customerLeads: number;
  churnedLeads: number;
  mqlToSqlRate: number;
  sqlToTrialRate: number;
  trialToCustomerRate: number;
}

interface SourceRow {
  source: string;
  count: number;
}

interface TierRow {
  tier: string;
  count: number;
}

interface AnalyticsData {
  funnel: Funnel;
  bySource: SourceRow[];
  byTier: TierRow[];
}

const tierColors: Record<string, string> = {
  CITIZEN: "bg-emerald-500",
  SMB: "bg-blue-500",
  MID_MARKET: "bg-indigo-500",
  ENTERPRISE: "bg-amber-500",
  GOVERNMENT: "bg-purple-500",
};

const sourceColors: Record<string, string> = {
  ORGANIC_BLOG: "bg-teal-500",
  ORGANIC_TOOL: "bg-cyan-500",
  ORGANIC_LANDING: "bg-blue-500",
  PAID_GOOGLE: "bg-amber-500",
  PAID_LINKEDIN: "bg-purple-500",
  SOCIAL_LINKEDIN: "bg-indigo-500",
  SOCIAL_QUORA: "bg-red-500",
  SOCIAL_REDDIT: "bg-orange-500",
  SOCIAL_MEDIUM: "bg-emerald-500",
  REFERRAL: "bg-pink-500",
  OUTBOUND_EMAIL: "bg-fuchsia-500",
  OUTBOUND_LINKEDIN: "bg-violet-500",
  DIRECT: "bg-slate-500",
  UNKNOWN: "bg-slate-600",
};

export default function AnalyticsPage() {
  const [loading, setLoading] = React.useState(true);
  const [data, setData] = React.useState<AnalyticsData | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    fetch("/api/attribution")
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((d) => {
        setData(d);
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

  if (error || !data)
    return (
      <div className="text-red-400 p-4">Failed to load analytics: {error}</div>
    );

  const { funnel, bySource, byTier } = data;

  const overallConversionRate =
    funnel.totalLeads > 0
      ? (funnel.customerLeads / funnel.totalLeads) * 100
      : 0;

  return (
    <div className="space-y-6">
      {/* Top KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatsCard
          title="Total Leads"
          value={funnel.totalLeads}
          icon={Users}
        />
        <StatsCard
          title="Qualified (MQL + SQL)"
          value={funnel.mqlLeads + funnel.sqlLeads}
          icon={Target}
          subtitle={`${((funnel.mqlLeads + funnel.sqlLeads) / Math.max(funnel.totalLeads, 1) * 100).toFixed(1)}% of total`}
        />
        <StatsCard
          title="Customers"
          value={funnel.customerLeads}
          icon={ShoppingCart}
          subtitle={`${overallConversionRate.toFixed(2)}% conversion`}
        />
        <StatsCard
          title="Churned"
          value={funnel.churnedLeads}
          icon={XCircle}
        />
      </div>

      {/* Funnel stages */}
      <Card className="bg-white/[0.03] border-0 ring-1 ring-white/[0.06] text-white">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <BarChart3 size={14} className="text-teal-400" />
            <CardTitle className="text-sm font-semibold text-white">
              Conversion Funnel
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <FunnelStep
              label="Total Leads"
              count={funnel.totalLeads}
              total={funnel.totalLeads}
              color="bg-slate-400"
            />
            <FunnelStep
              label="MQL (Marketing Qualified)"
              count={funnel.mqlLeads}
              total={funnel.totalLeads}
              color="bg-blue-500"
            />
            <FunnelStep
              label="SQL (Sales Qualified)"
              count={funnel.sqlLeads}
              total={funnel.totalLeads}
              color="bg-cyan-500"
            />
            <FunnelStep
              label="Trial Started"
              count={funnel.trialLeads}
              total={funnel.totalLeads}
              color="bg-indigo-500"
            />
            <FunnelStep
              label="Customer"
              count={funnel.customerLeads}
              total={funnel.totalLeads}
              color="bg-emerald-500"
            />
          </div>

          {/* Conversion rates */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6 pt-6 border-t border-white/[0.04]">
            <RateCard
              label="MQL → SQL"
              value={funnel.mqlToSqlRate}
              icon={TrendingUp}
            />
            <RateCard
              label="SQL → Trial"
              value={funnel.sqlToTrialRate}
              icon={UserPlus}
            />
            <RateCard
              label="Trial → Customer"
              value={funnel.trialToCustomerRate}
              icon={ShoppingCart}
            />
          </div>
        </CardContent>
      </Card>

      {/* Source + Tier breakdowns */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <Card className="bg-white/[0.03] border-0 ring-1 ring-white/[0.06] text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-white">
              Leads by Source
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {bySource.length === 0 ? (
              <p className="text-sm text-slate-500 py-8 text-center">No data yet.</p>
            ) : (
              bySource
                .sort((a, b) => b.count - a.count)
                .slice(0, 12)
                .map((s) => {
                  const total = bySource.reduce((acc, x) => acc + x.count, 0);
                  const pct = total > 0 ? (s.count / total) * 100 : 0;
                  return (
                    <div key={s.source}>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-slate-300">
                          {s.source.replace(/_/g, " ").toLowerCase()}
                        </span>
                        <span className="text-slate-500 tabular-nums">
                          {s.count} ({pct.toFixed(1)}%)
                        </span>
                      </div>
                      <div className="h-1.5 bg-white/[0.04] rounded-full overflow-hidden">
                        <div
                          className={`h-full ${sourceColors[s.source] || "bg-slate-500"}`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })
            )}
          </CardContent>
        </Card>

        <Card className="bg-white/[0.03] border-0 ring-1 ring-white/[0.06] text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-white">
              Leads by Tier (ICP)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {byTier.length === 0 ? (
              <p className="text-sm text-slate-500 py-8 text-center">No data yet.</p>
            ) : (
              byTier
                .sort((a, b) => b.count - a.count)
                .map((t) => {
                  const total = byTier.reduce((acc, x) => acc + x.count, 0);
                  const pct = total > 0 ? (t.count / total) * 100 : 0;
                  return (
                    <div key={t.tier}>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-slate-300">
                          {t.tier.replace(/_/g, " ")}
                        </span>
                        <span className="text-slate-500 tabular-nums">
                          {t.count} ({pct.toFixed(1)}%)
                        </span>
                      </div>
                      <div className="h-1.5 bg-white/[0.04] rounded-full overflow-hidden">
                        <div
                          className={`h-full ${tierColors[t.tier] || "bg-slate-500"}`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })
            )}
          </CardContent>
        </Card>
      </div>

      <div className="text-xs text-slate-500 text-center">
        Multi-touch attribution models (First/Last/Linear/Time-Decay/U-Shaped) available via{" "}
        <code className="text-slate-400">/api/attribution?leadId=&lt;id&gt;&amp;model=LAST_TOUCH</code>
      </div>
    </div>
  );
}

function FunnelStep({
  label,
  count,
  total,
  color,
}: {
  label: string;
  count: number;
  total: number;
  color: string;
}) {
  const pct = total > 0 ? (count / total) * 100 : 0;
  return (
    <div>
      <div className="flex items-center justify-between text-sm mb-1.5">
        <span className="text-slate-300">{label}</span>
        <span className="text-slate-400 tabular-nums">
          {count} <span className="text-[10px] text-slate-500">({pct.toFixed(1)}%)</span>
        </span>
      </div>
      <div className="h-5 bg-white/[0.04] rounded-md overflow-hidden">
        <div
          className={`h-full ${color} transition-all duration-500`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

function RateCard({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: number;
  icon: React.ElementType;
}) {
  return (
    <div className="rounded-lg bg-white/[0.02] p-3">
      <div className="flex items-center gap-2 mb-1">
        <Icon size={12} className="text-teal-400" />
        <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
          {label}
        </span>
      </div>
      <div className="text-xl font-bold text-white tabular-nums">
        {value.toFixed(1)}%
      </div>
    </div>
  );
}
