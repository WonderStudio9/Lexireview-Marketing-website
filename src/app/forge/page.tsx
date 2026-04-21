"use client";

import * as React from "react";
import Link from "next/link";
import {
  Loader2,
  Users,
  Building2,
  Briefcase,
  FileText,
  Mail,
  TrendingUp,
  ArrowRight,
  Send,
  Activity,
  Wrench,
  Crown,
  Sparkles,
  IndianRupee,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatsCard } from "@/components/forge/stats-card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface DashboardData {
  leads: {
    total: number;
    new7d: number;
    new30d: number;
    byTier: Array<{ tier: string; count: number }>;
    byStage: Array<{ stage: string; count: number }>;
  };
  accounts: { total: number };
  contacts: { total: number };
  deals: {
    total: number;
    byStage: Array<{ stage: string; count: number; valueINR: number; weightedValue: number }>;
    openPipelineValue: number;
    weightedPipelineValue: number;
  };
  revenue: { premiumSales: number; estimatedRevenueINR: number };
  activity: { toolCompletions7d: number; totalToolCompletions: number; emailsSent7d: number };
  content: { publishedPosts: number; tools: number };
  outreach: { activeCampaigns: number };
  recent: {
    leads: Array<{
      id: string;
      email: string;
      firstName?: string | null;
      tier: string;
      icp: string;
      stage: string;
      totalScore: number;
      createdAt: string;
      source: string;
    }>;
    activities: Array<{
      id: string;
      type: string;
      leadEmail?: string;
      leadName?: string;
      metadata?: unknown;
      createdAt: string;
    }>;
    topTools: Array<{
      slug: string;
      name: string;
      totalCompletions: number;
      totalPremiumSales: number;
      icp: string;
    }>;
    topContent: Array<{ slug: string; title: string; publishedAt: string }>;
  };
}

const tierColors: Record<string, string> = {
  CITIZEN: "bg-emerald-500/15 text-emerald-400",
  SMB: "bg-blue-500/15 text-blue-400",
  MID_MARKET: "bg-indigo-500/15 text-indigo-400",
  ENTERPRISE: "bg-amber-500/15 text-amber-400",
  GOVERNMENT: "bg-purple-500/15 text-purple-400",
};

const stageColors: Record<string, string> = {
  LEAD: "bg-slate-500/15 text-slate-400",
  MQL: "bg-blue-500/15 text-blue-400",
  SQL: "bg-cyan-500/15 text-cyan-400",
  TRIAL: "bg-indigo-500/15 text-indigo-400",
  OPPORTUNITY: "bg-amber-500/15 text-amber-400",
  CUSTOMER: "bg-emerald-500/15 text-emerald-400",
  NURTURE: "bg-pink-500/15 text-pink-400",
};

function formatINR(n: number): string {
  if (n >= 10_000_000) return `₹${(n / 10_000_000).toFixed(1)}Cr`;
  if (n >= 100_000) return `₹${(n / 100_000).toFixed(1)}L`;
  if (n >= 1000) return `₹${(n / 1000).toFixed(1)}K`;
  return `₹${n}`;
}

function formatTimeAgo(date: string): string {
  const diffMs = Date.now() - new Date(date).getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 30) return `${diffDays}d ago`;
  return new Date(date).toLocaleDateString();
}

function activityLabel(type: string): string {
  return type
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/^\w/, (c) => c.toUpperCase());
}

export default function ForgeDashboard() {
  const [loading, setLoading] = React.useState(true);
  const [data, setData] = React.useState<DashboardData | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    fetch("/api/dashboard")
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-6 h-6 text-teal-400 animate-spin" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="text-red-400 p-4">
        Failed to load dashboard: {error}
      </div>
    );
  }

  const topLeadBreakdown = data.leads.byTier
    .sort((a, b) => b.count - a.count)
    .slice(0, 4);

  return (
    <div className="space-y-6">
      {/* Top-level KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatsCard
          title="Total Leads"
          value={data.leads.total}
          icon={Users}
          subtitle={`+${data.leads.new7d} this week · +${data.leads.new30d} this month`}
        />
        <StatsCard
          title="Open Pipeline"
          value={formatINR(data.deals.openPipelineValue)}
          icon={Briefcase}
          subtitle={`${formatINR(data.deals.weightedPipelineValue)} weighted`}
        />
        <StatsCard
          title="Tool Completions"
          value={data.activity.totalToolCompletions}
          icon={Wrench}
          subtitle={`+${data.activity.toolCompletions7d} this week`}
        />
        <StatsCard
          title="Premium Sales"
          value={data.revenue.premiumSales}
          icon={Crown}
          subtitle={`est. ${formatINR(data.revenue.estimatedRevenueINR)}`}
        />
      </div>

      {/* Row 2: Deals pipeline + Lead funnel */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {/* Pipeline stages */}
        <Card className="bg-white/[0.03] border-0 ring-1 ring-white/[0.06] text-white">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold text-white">
                Sales Pipeline
              </CardTitle>
              <Link href="/forge/deals">
                <Button variant="ghost" size="xs" className="text-slate-400 hover:text-white gap-1">
                  View deals <ArrowRight className="w-3 h-3" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {data.deals.byStage.length === 0 ? (
              <p className="text-sm text-slate-500 py-6 text-center">
                No deals yet. Create your first deal from the Accounts page.
              </p>
            ) : (
              data.deals.byStage.map((s) => (
                <div
                  key={s.stage}
                  className="flex items-center justify-between text-sm"
                >
                  <span className="text-slate-300">{s.stage.replace(/_/g, " ")}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-slate-500">{s.count} deals</span>
                    <span className="font-semibold text-teal-400 tabular-nums min-w-[70px] text-right">
                      {formatINR(s.valueINR)}
                    </span>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Lead funnel */}
        <Card className="bg-white/[0.03] border-0 ring-1 ring-white/[0.06] text-white">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold text-white">
                Lead Funnel (by Stage)
              </CardTitle>
              <Link href="/forge/leads">
                <Button variant="ghost" size="xs" className="text-slate-400 hover:text-white gap-1">
                  View leads <ArrowRight className="w-3 h-3" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {data.leads.byStage.length === 0 ? (
              <p className="text-sm text-slate-500 py-6 text-center">
                No leads yet.
              </p>
            ) : (
              data.leads.byStage
                .sort((a, b) => b.count - a.count)
                .map((s) => {
                  const pct =
                    data.leads.total > 0 ? (s.count / data.leads.total) * 100 : 0;
                  return (
                    <div key={s.stage}>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium ${stageColors[s.stage] || "bg-slate-500/15 text-slate-400"}`}
                        >
                          {s.stage}
                        </span>
                        <span className="text-xs text-slate-400 tabular-nums">
                          {s.count} ({pct.toFixed(0)}%)
                        </span>
                      </div>
                      <div className="h-1.5 bg-white/[0.04] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-teal-500 to-emerald-400"
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

      {/* Row 3: Quick stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-6 gap-3">
        <QuickStat label="Accounts" value={data.accounts.total} icon={Building2} href="/forge/accounts" />
        <QuickStat label="Contacts" value={data.contacts.total} icon={Users} href="/forge/contacts" />
        <QuickStat label="Deals" value={data.deals.total} icon={Briefcase} href="/forge/deals" />
        <QuickStat
          label="Campaigns"
          value={data.outreach.activeCampaigns}
          icon={Send}
          href="/forge/campaigns"
          subtitle="active"
        />
        <QuickStat
          label="Emails Sent"
          value={data.activity.emailsSent7d}
          icon={Mail}
          href="/forge/leads"
          subtitle="7d"
        />
        <QuickStat
          label="Blog Posts"
          value={data.content.publishedPosts}
          icon={FileText}
          href="/forge/pipeline"
        />
      </div>

      {/* Row 4: Recent leads + Activity feed */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <Card className="bg-white/[0.03] border-0 ring-1 ring-white/[0.06] text-white xl:col-span-2">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold text-white">Recent Leads</CardTitle>
              <Link href="/forge/leads">
                <Button variant="ghost" size="xs" className="text-slate-400 hover:text-white gap-1">
                  View all <ArrowRight className="w-3 h-3" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {data.recent.leads.length === 0 ? (
              <p className="text-sm text-slate-500 py-8 text-center">No leads captured yet.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="border-white/[0.06] hover:bg-transparent">
                    <TableHead className="text-slate-400 text-xs">Email</TableHead>
                    <TableHead className="text-slate-400 text-xs">Tier</TableHead>
                    <TableHead className="text-slate-400 text-xs">Stage</TableHead>
                    <TableHead className="text-slate-400 text-xs text-right">Score</TableHead>
                    <TableHead className="text-slate-400 text-xs text-right">When</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.recent.leads.map((l) => (
                    <TableRow key={l.id} className="border-white/[0.04] hover:bg-white/[0.02]">
                      <TableCell className="text-sm text-slate-200">
                        <div>{l.email}</div>
                        {l.firstName && <div className="text-[10px] text-slate-500">{l.firstName}</div>}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium ${tierColors[l.tier] || "bg-slate-500/15 text-slate-400"}`}
                        >
                          {l.tier}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium ${stageColors[l.stage] || "bg-slate-500/15 text-slate-400"}`}
                        >
                          {l.stage}
                        </span>
                      </TableCell>
                      <TableCell className="text-sm tabular-nums text-slate-300 text-right">
                        {l.totalScore}
                      </TableCell>
                      <TableCell className="text-xs text-slate-500 text-right">
                        {formatTimeAgo(l.createdAt)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        <Card className="bg-white/[0.03] border-0 ring-1 ring-white/[0.06] text-white">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <Activity size={14} className="text-teal-400" />
              <CardTitle className="text-sm font-semibold text-white">Activity</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-2 max-h-96 overflow-y-auto">
            {data.recent.activities.length === 0 ? (
              <p className="text-sm text-slate-500 py-8 text-center">No activity yet.</p>
            ) : (
              data.recent.activities.map((a) => (
                <div key={a.id} className="flex gap-3 text-xs border-b border-white/[0.04] pb-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-teal-400 mt-1.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-slate-300">{activityLabel(a.type)}</div>
                    {a.leadEmail && (
                      <div className="text-slate-500 truncate">{a.leadEmail}</div>
                    )}
                    <div className="text-slate-600 text-[10px] mt-0.5">
                      {formatTimeAgo(a.createdAt)}
                    </div>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      {/* Row 5: Top tools + Top content */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <Card className="bg-white/[0.03] border-0 ring-1 ring-white/[0.06] text-white">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles size={14} className="text-teal-400" />
                <CardTitle className="text-sm font-semibold text-white">Top Tools</CardTitle>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {data.recent.topTools.length === 0 ? (
              <p className="text-sm text-slate-500 py-8 text-center">No tool usage yet.</p>
            ) : (
              data.recent.topTools.map((t) => (
                <div key={t.slug} className="flex items-center justify-between text-sm border-b border-white/[0.04] pb-2">
                  <div className="flex-1 min-w-0">
                    <div className="text-slate-200 truncate">{t.name}</div>
                    <div className="text-[10px] text-slate-500 font-mono truncate">
                      /{t.slug}
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-xs">
                    <div className="text-right">
                      <div className="text-slate-300 tabular-nums">{t.totalCompletions}</div>
                      <div className="text-[9px] text-slate-600 uppercase tracking-wider">uses</div>
                    </div>
                    <div className="text-right">
                      <div className="text-amber-400 tabular-nums">{t.totalPremiumSales}</div>
                      <div className="text-[9px] text-slate-600 uppercase tracking-wider">paid</div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card className="bg-white/[0.03] border-0 ring-1 ring-white/[0.06] text-white">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <FileText size={14} className="text-teal-400" />
              <CardTitle className="text-sm font-semibold text-white">Recent Published Content</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {data.recent.topContent.length === 0 ? (
              <p className="text-sm text-slate-500 py-8 text-center">No published content yet.</p>
            ) : (
              data.recent.topContent.map((c) => (
                <div key={c.slug} className="flex items-start justify-between text-sm border-b border-white/[0.04] pb-2">
                  <a
                    href={`https://lexireview.in/blog/${c.slug}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 min-w-0 hover:text-teal-400 text-slate-200 leading-snug"
                  >
                    {c.title}
                  </a>
                  <span className="text-[10px] text-slate-500 ml-3 whitespace-nowrap">
                    {formatTimeAgo(c.publishedAt)}
                  </span>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      {/* Lead tier breakdown strip */}
      <Card className="bg-white/[0.03] border-0 ring-1 ring-white/[0.06] text-white">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <TrendingUp size={14} className="text-teal-400" />
            <CardTitle className="text-sm font-semibold text-white">Lead Tier Split</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {topLeadBreakdown.map((t) => {
              const pct = data.leads.total > 0 ? (t.count / data.leads.total) * 100 : 0;
              return (
                <div key={t.tier} className="rounded-lg bg-white/[0.02] p-3">
                  <div className="flex items-center gap-1.5 mb-1">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        tierColors[t.tier]?.replace(/text-|bg-/g, "").split(" ")[0] ?? "bg-slate-400"
                      }`}
                    />
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                      {t.tier.replace(/_/g, " ")}
                    </span>
                  </div>
                  <div className="text-2xl font-bold text-white tabular-nums">{t.count}</div>
                  <div className="text-[10px] text-slate-500">{pct.toFixed(1)}% of total</div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function QuickStat({
  label,
  value,
  icon: Icon,
  href,
  subtitle,
}: {
  label: string;
  value: number | string;
  icon: React.ElementType;
  href: string;
  subtitle?: string;
}) {
  return (
    <Link href={href}>
      <Card className="bg-white/[0.03] border-0 ring-1 ring-white/[0.06] text-white hover:ring-white/[0.12] transition-all cursor-pointer">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
              {label}
            </span>
            <Icon size={14} className="text-slate-500" />
          </div>
          <div className="text-xl font-bold text-white tabular-nums">{value}</div>
          {subtitle && <div className="text-[10px] text-slate-600">{subtitle}</div>}
        </CardContent>
      </Card>
    </Link>
  );
}
