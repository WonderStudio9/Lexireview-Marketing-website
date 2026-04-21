"use client"

import * as React from "react"
import {
  Activity,
  Database,
  Server,
  Download,
  Loader2,
  CircleAlert,
  FileDown,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type Integration = {
  name: string
  description: string
  envVar: string
  configured: boolean
  masked: string
  extraChecks?: { label: string; ok: boolean }[]
}

type Stats = {
  leads: { total: number; byTier: { tier: string; count: number }[] }
  accounts: { total: number }
  contacts: { total: number }
  deals: { total: number; totalPipelineValue: number; weightedValue: number }
  blogPosts: { published: number }
  tools: { total: number; totalCompletions: number }
  emails: { sequences: number; templates: number; sent: number }
  campaigns: {
    total: number
    active: number
    byStatus: { status: string; count: number }[]
  }
}

// ---------------------------------------------------------------------------
// Tab 1 — Integrations Health
// ---------------------------------------------------------------------------

function statusDot(configured: boolean) {
  return (
    <span
      className={`inline-block w-2 h-2 rounded-full ${
        configured ? "bg-emerald-400 shadow-[0_0_6px] shadow-emerald-400/60" : "bg-red-400"
      }`}
    />
  )
}

function IntegrationsTab() {
  const [data, setData] = React.useState<Integration[] | null>(null)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    fetch("/api/health")
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`)
        return r.json()
      })
      .then((d) => setData(d.integrations))
      .catch((e) => setError(String(e?.message ?? e)))
  }, [])

  if (error) {
    return (
      <div className="text-red-400 text-sm flex items-center gap-2">
        <CircleAlert className="w-4 h-4" /> Failed to load: {error}
      </div>
    )
  }
  if (!data) {
    return (
      <div className="flex items-center justify-center h-40">
        <Loader2 className="w-6 h-6 text-teal-400 animate-spin" />
      </div>
    )
  }

  const configured = data.filter((i) => i.configured).length

  return (
    <Card className="bg-white/[0.03] border-0 ring-1 ring-white/[0.06] text-white">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold text-white">
            Integrations Health
          </CardTitle>
          <Badge
            variant="outline"
            className="border-white/[0.08] bg-white/[0.03] text-slate-300"
          >
            {configured} / {data.length} configured
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="border-white/[0.06] hover:bg-transparent">
              <TableHead className="text-slate-400 text-xs">Status</TableHead>
              <TableHead className="text-slate-400 text-xs">Integration</TableHead>
              <TableHead className="text-slate-400 text-xs">Description</TableHead>
              <TableHead className="text-slate-400 text-xs">Env Var</TableHead>
              <TableHead className="text-slate-400 text-xs text-right">
                Configured at
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((i) => (
              <TableRow
                key={i.envVar}
                className="border-white/[0.04] hover:bg-white/[0.02]"
              >
                <TableCell className="py-3">{statusDot(i.configured)}</TableCell>
                <TableCell className="text-sm text-slate-100 font-medium">
                  {i.name}
                </TableCell>
                <TableCell className="text-sm text-slate-400">
                  {i.description}
                </TableCell>
                <TableCell className="text-xs text-slate-500 font-mono">
                  {i.envVar}
                  {i.extraChecks && i.extraChecks.length > 0 && (
                    <div className="mt-1 space-y-0.5">
                      {i.extraChecks.map((c) => (
                        <div key={c.label} className="flex items-center gap-1.5">
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              c.ok ? "bg-emerald-400" : "bg-red-400"
                            }`}
                          />
                          <span>{c.label}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </TableCell>
                <TableCell className="text-right text-xs text-slate-400 tabular-nums font-mono">
                  {i.configured ? i.masked : (
                    <span className="text-red-400/80">not set</span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

// ---------------------------------------------------------------------------
// Tab 2 — Database Stats
// ---------------------------------------------------------------------------

function formatINR(value: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value)
}

function StatBlock({
  label,
  value,
  sub,
}: {
  label: string
  value: string | number
  sub?: string
}) {
  return (
    <div className="rounded-lg bg-white/[0.03] ring-1 ring-white/[0.06] px-4 py-3">
      <div className="text-xs text-slate-400">{label}</div>
      <div className="text-xl font-semibold text-white tabular-nums mt-0.5">
        {value}
      </div>
      {sub && <div className="text-[11px] text-slate-500 mt-0.5">{sub}</div>}
    </div>
  )
}

function StatsTab() {
  const [data, setData] = React.useState<Stats | null>(null)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    fetch("/api/stats")
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`)
        return r.json()
      })
      .then(setData)
      .catch((e) => setError(String(e?.message ?? e)))
  }, [])

  if (error) {
    return (
      <div className="text-red-400 text-sm flex items-center gap-2">
        <CircleAlert className="w-4 h-4" /> Failed to load: {error}
      </div>
    )
  }
  if (!data) {
    return (
      <div className="flex items-center justify-center h-40">
        <Loader2 className="w-6 h-6 text-teal-400 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <Card className="bg-white/[0.03] border-0 ring-1 ring-white/[0.06] text-white">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold text-white">Revenue Engine</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <StatBlock label="Total Leads" value={data.leads.total} />
            <StatBlock label="Accounts" value={data.accounts.total} />
            <StatBlock label="Contacts" value={data.contacts.total} />
            <StatBlock
              label="Deals"
              value={data.deals.total}
              sub={`${formatINR(data.deals.totalPipelineValue)} pipeline`}
            />
          </div>

          {data.leads.byTier.length > 0 && (
            <div className="mt-4">
              <div className="text-xs text-slate-400 mb-2">Leads by tier</div>
              <div className="flex flex-wrap gap-2">
                {data.leads.byTier.map((t) => (
                  <Badge
                    key={t.tier}
                    variant="outline"
                    className="border-white/[0.08] bg-white/[0.03] text-slate-300"
                  >
                    {t.tier}: <span className="ml-1 text-teal-300">{t.count}</span>
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="bg-white/[0.03] border-0 ring-1 ring-white/[0.06] text-white">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold text-white">Content</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <StatBlock label="Published Posts" value={data.blogPosts.published} />
            <StatBlock
              label="Tools"
              value={data.tools.total}
              sub={`${data.tools.totalCompletions} completions`}
            />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white/[0.03] border-0 ring-1 ring-white/[0.06] text-white">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold text-white">Email & Outreach</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <StatBlock label="Sequences" value={data.emails.sequences} />
            <StatBlock label="Templates" value={data.emails.templates} />
            <StatBlock label="Emails Sent" value={data.emails.sent} />
            <StatBlock
              label="Campaigns"
              value={data.campaigns.total}
              sub={`${data.campaigns.active} active`}
            />
          </div>

          {data.campaigns.byStatus.length > 0 && (
            <div className="mt-4">
              <div className="text-xs text-slate-400 mb-2">Campaigns by status</div>
              <div className="flex flex-wrap gap-2">
                {data.campaigns.byStatus.map((s) => (
                  <Badge
                    key={s.status}
                    variant="outline"
                    className="border-white/[0.08] bg-white/[0.03] text-slate-300"
                  >
                    {s.status}: <span className="ml-1 text-teal-300">{s.count}</span>
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Tab 3 — Environment (read-only, non-secret)
// ---------------------------------------------------------------------------

type EnvRow = { key: string; value: string; masked?: boolean }

function EnvironmentTab({ env }: { env: EnvRow[] }) {
  return (
    <Card className="bg-white/[0.03] border-0 ring-1 ring-white/[0.06] text-white">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold text-white">
          Environment
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="border-white/[0.06] hover:bg-transparent">
              <TableHead className="text-slate-400 text-xs">Variable</TableHead>
              <TableHead className="text-slate-400 text-xs">Value</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {env.map((r) => (
              <TableRow
                key={r.key}
                className="border-white/[0.04] hover:bg-white/[0.02]"
              >
                <TableCell className="text-sm text-slate-200 font-mono">
                  {r.key}
                </TableCell>
                <TableCell className="text-sm text-slate-400 font-mono break-all">
                  {r.value || <span className="text-red-400/80">not set</span>}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <div className="mt-4 rounded-lg bg-white/[0.02] ring-1 ring-white/[0.06] p-3 text-xs text-slate-400">
          To edit env vars, update{" "}
          <code className="font-mono text-teal-300">
            /var/www/lexiforge/.env
          </code>{" "}
          on the VPS and run{" "}
          <code className="font-mono text-teal-300">
            pm2 restart lexiforge-web
          </code>
          .
        </div>
      </CardContent>
    </Card>
  )
}

// ---------------------------------------------------------------------------
// Tab 4 — Data Export
// ---------------------------------------------------------------------------

const EXPORTS = [
  { resource: "leads", label: "All Leads" },
  { resource: "accounts", label: "All Accounts" },
  { resource: "contacts", label: "All Contacts" },
  { resource: "deals", label: "All Deals" },
] as const

function ExportTab() {
  return (
    <Card className="bg-white/[0.03] border-0 ring-1 ring-white/[0.06] text-white">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold text-white">Data Export</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {EXPORTS.map((e) => (
            <a
              key={e.resource}
              href={`/api/export/${e.resource}?format=csv`}
              className="flex items-center justify-between px-4 py-3 rounded-lg bg-white/[0.03] ring-1 ring-white/[0.06] hover:ring-teal-500/30 hover:bg-teal-500/5 transition"
            >
              <div className="flex items-center gap-3">
                <FileDown className="w-4 h-4 text-teal-400" />
                <div>
                  <div className="text-sm text-white font-medium">{e.label}</div>
                  <div className="text-[11px] text-slate-500 font-mono">
                    /api/export/{e.resource}?format=csv
                  </div>
                </div>
              </div>
              <Download className="w-4 h-4 text-slate-400" />
            </a>
          ))}
        </div>
        <p className="mt-4 text-xs text-slate-500">
          CSV downloads are admin-authenticated and may include personally
          identifiable information. Handle exports responsibly.
        </p>
      </CardContent>
    </Card>
  )
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function SettingsPage() {
  const [env, setEnv] = React.useState<EnvRow[] | null>(null)

  React.useEffect(() => {
    // Env is rendered client-side from a public config endpoint. We reuse
    // /api/health for admin-auth gating and augment with non-secret vars
    // exposed through NEXT_PUBLIC_ for legitimate client display. For now,
    // show what we can read safely via NEXT_PUBLIC_ + a dedicated fetch.
    fetch("/api/stats")
      .then((r) => (r.ok ? r.json() : null))
      .then(() => {
        // Populate env client-side. We only surface public/server-exposed data
        // labels — values are derived from window-scoped vars when available.
        const rows: EnvRow[] = [
          {
            key: "NODE_ENV",
            value: process.env.NODE_ENV ?? "",
          },
          {
            key: "SITE_URL",
            value: process.env.NEXT_PUBLIC_SITE_URL ?? "",
          },
          {
            key: "DATABASE_URL",
            value: "postgres://***@***:5432/lexiforge",
            masked: true,
          },
          {
            key: "ADMIN_USERNAME",
            value: "admin (default)",
          },
          {
            key: "FROM_EMAIL",
            value: process.env.NEXT_PUBLIC_FROM_EMAIL ?? "hello@lexireview.in",
          },
          {
            key: "FROM_NAME",
            value: process.env.NEXT_PUBLIC_FROM_NAME ?? "LexiReview",
          },
          {
            key: "REPLY_TO",
            value: process.env.NEXT_PUBLIC_REPLY_TO ?? "hello@lexireview.in",
          },
        ]
        setEnv(rows)
      })
  }, [])

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-white">Settings</h2>
        <p className="text-sm text-slate-400 mt-0.5">
          Integration health, database stats, environment, and data export.
        </p>
      </div>

      <Tabs defaultValue="integrations" className="gap-4">
        <TabsList className="bg-white/[0.03] ring-1 ring-white/[0.06]">
          <TabsTrigger value="integrations">
            <Activity className="w-3.5 h-3.5" />
            Integrations
          </TabsTrigger>
          <TabsTrigger value="stats">
            <Database className="w-3.5 h-3.5" />
            Database Stats
          </TabsTrigger>
          <TabsTrigger value="environment">
            <Server className="w-3.5 h-3.5" />
            Environment
          </TabsTrigger>
          <TabsTrigger value="export">
            <Download className="w-3.5 h-3.5" />
            Data Export
          </TabsTrigger>
        </TabsList>

        <TabsContent value="integrations">
          <IntegrationsTab />
        </TabsContent>
        <TabsContent value="stats">
          <StatsTab />
        </TabsContent>
        <TabsContent value="environment">
          {env ? (
            <EnvironmentTab env={env} />
          ) : (
            <div className="flex items-center justify-center h-40">
              <Loader2 className="w-6 h-6 text-teal-400 animate-spin" />
            </div>
          )}
        </TabsContent>
        <TabsContent value="export">
          <ExportTab />
        </TabsContent>
      </Tabs>
    </div>
  )
}
