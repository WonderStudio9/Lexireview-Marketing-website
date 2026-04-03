"use client"

import * as React from "react"
import {
  FileText,
  GitBranch,
  CheckCircle2,
  Star,
  Plus,
  Search,
  ScrollText,
  ArrowRight,
  TrendingUp,
  Loader2,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { StatsCard } from "@/components/forge/stats-card"
import Link from "next/link"

const statusColors: Record<string, string> = {
  BRIEFED: "bg-slate-500/15 text-slate-400",
  STRATEGY: "bg-blue-500/15 text-blue-400",
  DRAFTING: "bg-indigo-500/15 text-indigo-400",
  LEGAL_REVIEW: "bg-purple-500/15 text-purple-400",
  SEO_OPTIMIZATION: "bg-cyan-500/15 text-cyan-400",
  QUALITY_CHECK: "bg-amber-500/15 text-amber-400",
  APPROVED: "bg-teal-500/15 text-teal-400",
  PUBLISHED: "bg-emerald-500/15 text-emerald-400",
  REJECTED: "bg-red-500/15 text-red-400",
}

interface Brief {
  id: string
  topic: string
  status: string
  icp: string
  funnelStage: string
  cluster: string
  createdAt: string
  updatedAt: string
  drafts?: Array<{ qualityScore?: number | null }>
  published?: { slug: string; publishedAt: string } | null
}

function formatTimeAgo(date: string): string {
  const now = new Date()
  const then = new Date(date)
  const diffMs = now.getTime() - then.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  if (diffMins < 60) return `${diffMins}m ago`
  const diffHours = Math.floor(diffMins / 60)
  if (diffHours < 24) return `${diffHours}h ago`
  const diffDays = Math.floor(diffHours / 24)
  return `${diffDays}d ago`
}

export default function ForgeDashboard() {
  const [loading, setLoading] = React.useState(true)
  const [briefs, setBriefs] = React.useState<Brief[]>([])
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    fetch("/api/content")
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json()
      })
      .then((data) => {
        setBriefs(data)
        setLoading(false)
      })
      .catch((err) => {
        setError(err.message)
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-28 rounded-xl bg-white/[0.03] animate-pulse ring-1 ring-white/[0.06]"
            />
          ))}
        </div>
        <div className="flex items-center justify-center h-40">
          <Loader2 className="w-6 h-6 text-teal-400 animate-spin" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96 text-red-400">
        Failed to load dashboard: {error}
      </div>
    )
  }

  const totalBriefs = briefs.length
  const publishedCount = briefs.filter((b) => b.status === "PUBLISHED").length
  const inPipeline = briefs.filter(
    (b) => !["PUBLISHED", "REJECTED"].includes(b.status)
  ).length
  const scoresArray = briefs
    .map((b) => b.drafts?.[0]?.qualityScore)
    .filter((s): s is number => typeof s === "number" && s > 0)
  const avgQuality =
    scoresArray.length > 0
      ? (scoresArray.reduce((a, b) => a + b, 0) / scoresArray.length).toFixed(1)
      : "--"

  const recentBriefs = briefs.slice(0, 10)

  return (
    <div className="space-y-6">
      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatsCard
          title="Total Briefs"
          value={totalBriefs}
          icon={FileText}
        />
        <StatsCard
          title="In Pipeline"
          value={inPipeline}
          icon={GitBranch}
          subtitle="Active content pieces"
        />
        <StatsCard
          title="Published"
          value={publishedCount}
          icon={CheckCircle2}
        />
        <StatsCard
          title="Avg Quality Score"
          value={avgQuality}
          icon={Star}
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Recent Pipeline Activity */}
        <Card className="xl:col-span-2 bg-white/[0.03] border-0 ring-1 ring-white/[0.06] text-white">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold text-white">
                Recent Pipeline Activity
              </CardTitle>
              <Link href="/forge/pipeline">
                <Button variant="ghost" size="xs" className="text-slate-400 hover:text-white gap-1">
                  View all <ArrowRight className="w-3 h-3" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="border-white/[0.06] hover:bg-transparent">
                  <TableHead className="text-slate-400 text-xs">Title</TableHead>
                  <TableHead className="text-slate-400 text-xs">Status</TableHead>
                  <TableHead className="text-slate-400 text-xs text-right">Score</TableHead>
                  <TableHead className="text-slate-400 text-xs text-right">Updated</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentBriefs.map((item) => (
                  <TableRow
                    key={item.id}
                    className="border-white/[0.04] hover:bg-white/[0.02]"
                  >
                    <TableCell className="text-sm text-slate-200 max-w-xs truncate">
                      {item.topic}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium ${
                          statusColors[item.status] || "bg-slate-500/15 text-slate-400"
                        }`}
                      >
                        {item.status.replace(/_/g, " ")}
                      </span>
                    </TableCell>
                    <TableCell className="text-right text-sm tabular-nums text-slate-300">
                      {item.drafts?.[0]?.qualityScore ?? "--"}
                    </TableCell>
                    <TableCell className="text-right text-xs text-slate-500">
                      {formatTimeAgo(item.updatedAt)}
                    </TableCell>
                  </TableRow>
                ))}
                {recentBriefs.length === 0 && (
                  <TableRow className="border-white/[0.04]">
                    <TableCell colSpan={4} className="text-center py-8 text-slate-500">
                      No content briefs yet
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Right column */}
        <div className="space-y-4">
          {/* Quick Actions */}
          <Card className="bg-white/[0.03] border-0 ring-1 ring-white/[0.06] text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold text-white">
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link href="/forge/pipeline">
                <Button
                  variant="outline"
                  className="w-full justify-start gap-2 border-white/[0.06] bg-white/[0.02] text-slate-300 hover:text-white hover:bg-teal-500/10 hover:border-teal-500/30"
                >
                  <Plus className="w-4 h-4 text-teal-400" />
                  New Brief
                </Button>
              </Link>
              <Link href="/forge/analytics">
                <Button
                  variant="outline"
                  className="w-full justify-start gap-2 border-white/[0.06] bg-white/[0.02] text-slate-300 hover:text-white hover:bg-teal-500/10 hover:border-teal-500/30"
                >
                  <Search className="w-4 h-4 text-teal-400" />
                  SEO Analytics
                </Button>
              </Link>
              <Link href="/forge/agents">
                <Button
                  variant="outline"
                  className="w-full justify-start gap-2 border-white/[0.06] bg-white/[0.02] text-slate-300 hover:text-white hover:bg-teal-500/10 hover:border-teal-500/30"
                >
                  <ScrollText className="w-4 h-4 text-teal-400" />
                  View Agent Logs
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Cluster Breakdown */}
          <Card className="bg-white/[0.03] border-0 ring-1 ring-white/[0.06] text-white">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <CardTitle className="text-sm font-semibold text-white">
                  Content by Cluster
                </CardTitle>
                <TrendingUp className="w-3.5 h-3.5 text-teal-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {Object.entries(
                  briefs.reduce((acc, b) => {
                    const cluster = b.cluster || "Uncategorized"
                    acc[cluster] = (acc[cluster] || 0) + 1
                    return acc
                  }, {} as Record<string, number>)
                )
                  .sort(([, a], [, b]) => b - a)
                  .map(([cluster, count]) => (
                    <div key={cluster} className="flex items-center justify-between text-sm">
                      <span className="text-slate-300 truncate">{cluster}</span>
                      <span className="text-slate-500 tabular-nums">{count}</span>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
