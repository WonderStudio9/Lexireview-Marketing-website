"use client";

import * as React from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  Loader2,
  ArrowLeft,
  Building2,
  Users,
  Briefcase,
  Zap,
  Globe,
  MapPin,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StatsCard } from "@/components/forge/stats-card";
import { toast } from "sonner";

interface AccountDetail {
  id: string;
  name: string;
  domain?: string | null;
  industry?: string | null;
  subIndustry?: string | null;
  employees?: number | null;
  revenueRange?: string | null;
  city?: string | null;
  state?: string | null;
  country: string;
  tier: string;
  icp: string;
  website?: string | null;
  linkedinUrl?: string | null;
  enrichmentData?: unknown;
  contacts: Array<{
    id: string;
    firstName: string;
    lastName?: string | null;
    email?: string | null;
    title?: string | null;
    seniority?: string | null;
    linkedinUrl?: string | null;
  }>;
  leads: Array<{
    id: string;
    email: string;
    stage: string;
    totalScore: number;
    source: string;
    createdAt: string;
  }>;
  deals: Array<{
    id: string;
    name: string;
    stage: string;
    valueINR: number;
    probability: number;
    expectedCloseDate?: string | null;
  }>;
}

const tierColors: Record<string, string> = {
  CITIZEN: "bg-emerald-500/15 text-emerald-400",
  SMB: "bg-blue-500/15 text-blue-400",
  MID_MARKET: "bg-indigo-500/15 text-indigo-400",
  ENTERPRISE: "bg-amber-500/15 text-amber-400",
  GOVERNMENT: "bg-purple-500/15 text-purple-400",
};

function formatINR(n: number): string {
  if (n >= 10_000_000) return `₹${(n / 10_000_000).toFixed(1)}Cr`;
  if (n >= 100_000) return `₹${(n / 100_000).toFixed(1)}L`;
  if (n >= 1000) return `₹${(n / 1000).toFixed(1)}K`;
  return `₹${n}`;
}

export default function AccountDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [loading, setLoading] = React.useState(true);
  const [enriching, setEnriching] = React.useState(false);
  const [account, setAccount] = React.useState<AccountDetail | null>(null);

  const fetchAccount = React.useCallback(() => {
    fetch(`/api/accounts/${id}`)
      .then((r) => r.json())
      .then((a) => {
        if (a.error) throw new Error(a.error);
        setAccount(a);
        setLoading(false);
      })
      .catch((e) => {
        toast.error(e.message);
        setLoading(false);
      });
  }, [id]);

  React.useEffect(() => {
    fetchAccount();
  }, [fetchAccount]);

  async function handleEnrich() {
    setEnriching(true);
    try {
      const res = await fetch(`/api/accounts/${id}/enrich`, { method: "POST" });
      if (!res.ok) throw new Error("Enrichment failed");
      const result = await res.json();
      if (result.sources.length === 0) {
        toast.info("No new data found", {
          description: "API keys may not be configured (Apollo/Hunter/RB2B).",
        });
      } else {
        toast.success(
          `Enriched from ${result.sources.join(", ")} · +${result.contactsFound} contacts`,
        );
      }
      fetchAccount();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed");
    } finally {
      setEnriching(false);
    }
  }

  if (loading)
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-6 h-6 text-teal-400 animate-spin" />
      </div>
    );

  if (!account) return <div className="text-slate-400 p-4">Account not found</div>;

  const totalPipeline = account.deals.reduce((acc, d) => acc + d.valueINR, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 text-xs text-slate-500">
        <button
          onClick={() => router.push("/forge/accounts")}
          className="hover:text-slate-300 inline-flex items-center gap-1"
        >
          <ArrowLeft size={12} /> All Accounts
        </button>
      </div>

      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl font-bold text-white">{account.name}</h1>
            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium ${tierColors[account.tier]}`}>
              {account.tier.replace(/_/g, " ")}
            </span>
            <span className="text-[10px] text-slate-500 uppercase tracking-wider">
              {account.icp.replace(/_/g, " ")}
            </span>
          </div>
          <div className="flex items-center gap-4 text-xs text-slate-500">
            {account.domain && (
              <a href={`https://${account.domain}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 hover:text-teal-400">
                <Globe size={12} /> {account.domain}
              </a>
            )}
            {(account.city || account.state) && (
              <span className="inline-flex items-center gap-1">
                <MapPin size={12} /> {[account.city, account.state, account.country].filter(Boolean).join(", ")}
              </span>
            )}
            {account.industry && <span>{account.industry}</span>}
            {account.employees && <span>{account.employees.toLocaleString()} employees</span>}
          </div>
        </div>
        <Button
          size="sm"
          onClick={handleEnrich}
          disabled={enriching}
          className="bg-teal-600 hover:bg-teal-500 text-white"
        >
          {enriching ? <Loader2 size={14} className="animate-spin" /> : <Zap size={14} />}
          Enrich Now
        </Button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatsCard title="Contacts" value={account.contacts.length} icon={Users} />
        <StatsCard title="Leads" value={account.leads.length} icon={Users} />
        <StatsCard title="Deals" value={account.deals.length} icon={Briefcase} />
        <StatsCard title="Pipeline" value={formatINR(totalPipeline)} icon={Briefcase} />
      </div>

      <Tabs defaultValue="contacts" className="space-y-4">
        <TabsList className="bg-white/[0.03]">
          <TabsTrigger value="contacts">Contacts ({account.contacts.length})</TabsTrigger>
          <TabsTrigger value="leads">Leads ({account.leads.length})</TabsTrigger>
          <TabsTrigger value="deals">Deals ({account.deals.length})</TabsTrigger>
          <TabsTrigger value="enrichment">Enrichment</TabsTrigger>
        </TabsList>

        <TabsContent value="contacts">
          <Card className="bg-white/[0.03] border-0 ring-1 ring-white/[0.06] text-white">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="border-white/[0.06] hover:bg-transparent">
                    <TableHead className="text-slate-400 text-xs">Name</TableHead>
                    <TableHead className="text-slate-400 text-xs">Title</TableHead>
                    <TableHead className="text-slate-400 text-xs">Email</TableHead>
                    <TableHead className="text-slate-400 text-xs">Seniority</TableHead>
                    <TableHead className="text-slate-400 text-xs">LinkedIn</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {account.contacts.length === 0 ? (
                    <TableRow className="border-white/[0.04]">
                      <TableCell colSpan={5} className="text-center py-8 text-slate-500">
                        No contacts yet. Click &quot;Enrich Now&quot; to find decision-makers.
                      </TableCell>
                    </TableRow>
                  ) : (
                    account.contacts.map((c) => (
                      <TableRow key={c.id} className="border-white/[0.04] hover:bg-white/[0.02]">
                        <TableCell>
                          <Link href={`/forge/contacts/${c.id}`} className="text-sm text-slate-200 hover:text-teal-400">
                            {c.firstName} {c.lastName || ""}
                          </Link>
                        </TableCell>
                        <TableCell className="text-xs text-slate-400">{c.title || "—"}</TableCell>
                        <TableCell className="text-xs text-slate-300 font-mono">{c.email || "—"}</TableCell>
                        <TableCell className="text-xs text-slate-400">{c.seniority || "—"}</TableCell>
                        <TableCell>
                          {c.linkedinUrl && (
                            <a href={c.linkedinUrl} target="_blank" rel="noreferrer" className="text-[10px] text-blue-400 hover:text-blue-300">
                              View ↗
                            </a>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="leads">
          <Card className="bg-white/[0.03] border-0 ring-1 ring-white/[0.06] text-white">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="border-white/[0.06] hover:bg-transparent">
                    <TableHead className="text-slate-400 text-xs">Email</TableHead>
                    <TableHead className="text-slate-400 text-xs">Stage</TableHead>
                    <TableHead className="text-slate-400 text-xs text-right">Score</TableHead>
                    <TableHead className="text-slate-400 text-xs">Source</TableHead>
                    <TableHead className="text-slate-400 text-xs">When</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {account.leads.length === 0 ? (
                    <TableRow className="border-white/[0.04]">
                      <TableCell colSpan={5} className="text-center py-8 text-slate-500">
                        No leads yet.
                      </TableCell>
                    </TableRow>
                  ) : (
                    account.leads.map((l) => (
                      <TableRow key={l.id} className="border-white/[0.04] hover:bg-white/[0.02]">
                        <TableCell className="text-sm text-slate-200">{l.email}</TableCell>
                        <TableCell className="text-xs text-slate-400">{l.stage}</TableCell>
                        <TableCell className="text-right text-sm tabular-nums">{l.totalScore}</TableCell>
                        <TableCell className="text-xs text-slate-400">{l.source.replace(/_/g, " ").toLowerCase()}</TableCell>
                        <TableCell className="text-xs text-slate-500">
                          {new Date(l.createdAt).toLocaleDateString()}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="deals">
          <Card className="bg-white/[0.03] border-0 ring-1 ring-white/[0.06] text-white">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="border-white/[0.06] hover:bg-transparent">
                    <TableHead className="text-slate-400 text-xs">Name</TableHead>
                    <TableHead className="text-slate-400 text-xs">Stage</TableHead>
                    <TableHead className="text-slate-400 text-xs text-right">Value</TableHead>
                    <TableHead className="text-slate-400 text-xs text-right">Prob</TableHead>
                    <TableHead className="text-slate-400 text-xs">Close Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {account.deals.length === 0 ? (
                    <TableRow className="border-white/[0.04]">
                      <TableCell colSpan={5} className="text-center py-8 text-slate-500">
                        No deals yet.
                      </TableCell>
                    </TableRow>
                  ) : (
                    account.deals.map((d) => (
                      <TableRow key={d.id} className="border-white/[0.04] hover:bg-white/[0.02]">
                        <TableCell>
                          <Link href={`/forge/deals/${d.id}`} className="text-sm text-slate-200 hover:text-teal-400">
                            {d.name}
                          </Link>
                        </TableCell>
                        <TableCell className="text-xs text-slate-400">{d.stage.replace(/_/g, " ")}</TableCell>
                        <TableCell className="text-right text-sm tabular-nums text-slate-300">
                          {formatINR(d.valueINR)}
                        </TableCell>
                        <TableCell className="text-right text-xs text-slate-500">{d.probability}%</TableCell>
                        <TableCell className="text-xs text-slate-500">
                          {d.expectedCloseDate ? new Date(d.expectedCloseDate).toLocaleDateString() : "—"}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="enrichment">
          <Card className="bg-white/[0.03] border-0 ring-1 ring-white/[0.06] text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold">Enrichment Data</CardTitle>
            </CardHeader>
            <CardContent>
              {account.enrichmentData ? (
                <pre className="text-[11px] text-slate-300 bg-slate-950/60 p-4 rounded-lg overflow-x-auto max-h-96">
                  {JSON.stringify(account.enrichmentData, null, 2)}
                </pre>
              ) : (
                <p className="text-sm text-slate-500 py-8 text-center">
                  No enrichment data. Click &quot;Enrich Now&quot; to fetch firmographics + decision-makers.
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
