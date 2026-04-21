"use client";

import * as React from "react";
import Link from "next/link";
import { Loader2, Building2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StatsCard } from "@/components/forge/stats-card";

interface Account {
  id: string;
  name: string;
  domain?: string | null;
  industry?: string | null;
  tier: string;
  icp: string;
  city?: string | null;
  state?: string | null;
  _count: { contacts: number; leads: number; deals: number };
  enrichmentData?: unknown;
}

const tierColors: Record<string, string> = {
  CITIZEN: "bg-emerald-500/15 text-emerald-400",
  SMB: "bg-blue-500/15 text-blue-400",
  MID_MARKET: "bg-indigo-500/15 text-indigo-400",
  ENTERPRISE: "bg-amber-500/15 text-amber-400",
  GOVERNMENT: "bg-purple-500/15 text-purple-400",
};

export default function AccountsPage() {
  const [loading, setLoading] = React.useState(true);
  const [accounts, setAccounts] = React.useState<Account[]>([]);
  const [total, setTotal] = React.useState(0);
  const [byTier, setByTier] = React.useState<Array<{ tier: string; _count: number }>>(
    [],
  );
  const [error, setError] = React.useState<string | null>(null);
  const [search, setSearch] = React.useState("");

  const fetchAccounts = React.useCallback((q: string) => {
    const url = q ? `/api/accounts?limit=100&q=${encodeURIComponent(q)}` : "/api/accounts?limit=100";
    fetch(url)
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((data) => {
        setAccounts(data.accounts);
        setTotal(data.total);
        setByTier(data.byTier);
        setLoading(false);
      })
      .catch((e) => {
        setError(e.message);
        setLoading(false);
      });
  }, []);

  React.useEffect(() => {
    fetchAccounts("");
  }, [fetchAccounts]);

  React.useEffect(() => {
    const t = setTimeout(() => fetchAccounts(search), 300);
    return () => clearTimeout(t);
  }, [search, fetchAccounts]);

  const byTierMap = byTier.reduce(
    (acc, b) => {
      acc[b.tier] = b._count;
      return acc;
    },
    {} as Record<string, number>,
  );

  if (loading)
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-6 h-6 text-teal-400 animate-spin" />
      </div>
    );
  if (error) return <div className="text-red-400 p-4">{error}</div>;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatsCard title="Total Accounts" value={total} icon={Building2} />
        <StatsCard title="Enterprise" value={byTierMap.ENTERPRISE || 0} icon={Building2} />
        <StatsCard title="Mid-Market" value={byTierMap.MID_MARKET || 0} icon={Building2} />
        <StatsCard title="SMB" value={byTierMap.SMB || 0} icon={Building2} />
      </div>

      <Card className="bg-white/[0.03] border-0 ring-1 ring-white/[0.06] text-white">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <CardTitle className="text-sm font-semibold text-white">Accounts</CardTitle>
            <Input
              placeholder="Search name or domain..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-64 h-8 bg-white/[0.04] border-white/[0.06] text-sm text-slate-300 placeholder:text-slate-500"
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-white/[0.06] hover:bg-transparent">
                <TableHead className="text-slate-400 text-xs">Name</TableHead>
                <TableHead className="text-slate-400 text-xs">Domain</TableHead>
                <TableHead className="text-slate-400 text-xs">Industry</TableHead>
                <TableHead className="text-slate-400 text-xs">Tier</TableHead>
                <TableHead className="text-slate-400 text-xs">ICP</TableHead>
                <TableHead className="text-slate-400 text-xs text-right">Contacts</TableHead>
                <TableHead className="text-slate-400 text-xs text-right">Leads</TableHead>
                <TableHead className="text-slate-400 text-xs text-right">Deals</TableHead>
                <TableHead className="text-slate-400 text-xs">Enriched</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {accounts.length === 0 ? (
                <TableRow className="border-white/[0.04]">
                  <TableCell colSpan={9} className="text-center py-8 text-slate-500">
                    No accounts yet. Run the seed-accounts script to populate.
                  </TableCell>
                </TableRow>
              ) : (
                accounts.map((a) => (
                  <TableRow key={a.id} className="border-white/[0.04] hover:bg-white/[0.02]">
                    <TableCell className="text-sm text-slate-200 font-medium">
                      <Link href={`/forge/accounts/${a.id}`} className="hover:text-teal-400">
                        {a.name}
                      </Link>
                    </TableCell>
                    <TableCell className="text-xs text-slate-500 font-mono">
                      {a.domain || "—"}
                    </TableCell>
                    <TableCell className="text-xs text-slate-400">{a.industry || "—"}</TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium ${tierColors[a.tier] || "bg-slate-500/15 text-slate-400"}`}
                      >
                        {a.tier.replace(/_/g, " ")}
                      </span>
                    </TableCell>
                    <TableCell className="text-[10px] text-slate-400">
                      {a.icp.replace(/_/g, " ")}
                    </TableCell>
                    <TableCell className="text-right tabular-nums text-sm text-slate-300">
                      {a._count.contacts}
                    </TableCell>
                    <TableCell className="text-right tabular-nums text-sm text-slate-300">
                      {a._count.leads}
                    </TableCell>
                    <TableCell className="text-right tabular-nums text-sm text-slate-300">
                      {a._count.deals}
                    </TableCell>
                    <TableCell>
                      {a.enrichmentData ? (
                        <span className="text-[10px] text-emerald-400">✓</span>
                      ) : (
                        <span className="text-[10px] text-slate-600">—</span>
                      )}
                    </TableCell>
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
