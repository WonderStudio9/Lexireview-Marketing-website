"use client";

import * as React from "react";
import { Loader2, Users, Mail, Target, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StatsCard } from "@/components/forge/stats-card";

interface Lead {
  id: string;
  email: string;
  firstName?: string | null;
  tier: string;
  icp: string;
  stage: string;
  source: string;
  totalScore: number;
  createdAt: string;
}

interface StatsRow {
  tier: string;
  _count: number;
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
  LOST: "bg-red-500/15 text-red-400",
  CHURNED: "bg-red-500/15 text-red-400",
};

function formatTimeAgo(date: string): string {
  const now = new Date();
  const then = new Date(date);
  const diffMs = now.getTime() - then.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
}

export default function LeadsPage() {
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [leads, setLeads] = React.useState<Lead[]>([]);
  const [stats, setStats] = React.useState<StatsRow[]>([]);
  const [total, setTotal] = React.useState(0);

  React.useEffect(() => {
    fetch("/api/leads?limit=100")
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((data) => {
        setLeads(data.leads);
        setStats(data.stats);
        setTotal(data.total);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
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

  if (error) {
    return (
      <div className="flex items-center justify-center h-96 text-red-400">
        Failed to load leads: {error}
      </div>
    );
  }

  const byTier = stats.reduce((acc, s) => {
    acc[s.tier] = s._count;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatsCard title="Total Leads" value={total} icon={Users} />
        <StatsCard title="Citizens" value={byTier.CITIZEN || 0} icon={Mail} />
        <StatsCard title="SMB + Mid-market" value={(byTier.SMB || 0) + (byTier.MID_MARKET || 0)} icon={Target} />
        <StatsCard title="Enterprise" value={byTier.ENTERPRISE || 0} icon={TrendingUp} />
      </div>

      {/* Leads table */}
      <Card className="bg-white/[0.03] border-0 ring-1 ring-white/[0.06] text-white">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold text-white">Recent Leads</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-white/[0.06] hover:bg-transparent">
                <TableHead className="text-slate-400 text-xs">Email</TableHead>
                <TableHead className="text-slate-400 text-xs">Name</TableHead>
                <TableHead className="text-slate-400 text-xs">Tier</TableHead>
                <TableHead className="text-slate-400 text-xs">ICP</TableHead>
                <TableHead className="text-slate-400 text-xs">Stage</TableHead>
                <TableHead className="text-slate-400 text-xs">Source</TableHead>
                <TableHead className="text-slate-400 text-xs text-right">Score</TableHead>
                <TableHead className="text-slate-400 text-xs text-right">Captured</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leads.length === 0 ? (
                <TableRow className="border-white/[0.04]">
                  <TableCell colSpan={8} className="text-center py-8 text-slate-500">
                    No leads captured yet. Lead capture forms on blog, tools, and landing pages will populate this table.
                  </TableCell>
                </TableRow>
              ) : (
                leads.map((lead) => (
                  <TableRow key={lead.id} className="border-white/[0.04] hover:bg-white/[0.02]">
                    <TableCell className="text-sm text-slate-200">{lead.email}</TableCell>
                    <TableCell className="text-sm text-slate-300">{lead.firstName || "—"}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium ${tierColors[lead.tier] || "bg-slate-500/15 text-slate-400"}`}>
                        {lead.tier.replace(/_/g, " ")}
                      </span>
                    </TableCell>
                    <TableCell className="text-xs text-slate-400">{lead.icp.replace(/_/g, " ")}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium ${stageColors[lead.stage] || "bg-slate-500/15 text-slate-400"}`}>
                        {lead.stage}
                      </span>
                    </TableCell>
                    <TableCell className="text-xs text-slate-400">{lead.source.replace(/_/g, " ").toLowerCase()}</TableCell>
                    <TableCell className="text-right text-sm tabular-nums text-slate-300">{lead.totalScore}</TableCell>
                    <TableCell className="text-right text-xs text-slate-500">{formatTimeAgo(lead.createdAt)}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
