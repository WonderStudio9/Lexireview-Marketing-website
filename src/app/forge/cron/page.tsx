"use client"

import * as React from "react"
import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
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

interface CronJob {
  id: string
  name: string
  schedule: string
  type: string
  enabled: boolean
  lastRun: string | null
  nextRun: string
  status: "success" | "failed" | "running" | "idle"
}

const initialCronJobs: CronJob[] = [
  {
    id: "1",
    name: "SEO Rank Tracker",
    schedule: "0 6 * * *",
    type: "SEO",
    enabled: true,
    lastRun: "2026-03-29T06:00:00Z",
    nextRun: "2026-03-30T06:00:00Z",
    status: "success",
  },
  {
    id: "2",
    name: "Content Pipeline Processor",
    schedule: "*/15 * * * *",
    type: "Pipeline",
    enabled: true,
    lastRun: "2026-03-29T08:45:00Z",
    nextRun: "2026-03-29T09:00:00Z",
    status: "success",
  },
  {
    id: "3",
    name: "AI Citation Monitor",
    schedule: "0 */4 * * *",
    type: "Analytics",
    enabled: true,
    lastRun: "2026-03-29T08:00:00Z",
    nextRun: "2026-03-29T12:00:00Z",
    status: "success",
  },
  {
    id: "4",
    name: "Quality Score Recalculator",
    schedule: "0 2 * * *",
    type: "Quality",
    enabled: true,
    lastRun: "2026-03-29T02:00:00Z",
    nextRun: "2026-03-30T02:00:00Z",
    status: "success",
  },
  {
    id: "5",
    name: "Dead Link Checker",
    schedule: "0 3 * * 0",
    type: "SEO",
    enabled: false,
    lastRun: "2026-03-23T03:00:00Z",
    nextRun: "2026-03-30T03:00:00Z",
    status: "idle",
  },
  {
    id: "6",
    name: "Competitor Content Scraper",
    schedule: "0 1 * * 1,4",
    type: "Research",
    enabled: true,
    lastRun: "2026-03-28T01:00:00Z",
    nextRun: "2026-03-31T01:00:00Z",
    status: "failed",
  },
  {
    id: "7",
    name: "Analytics Report Generator",
    schedule: "0 8 * * 1",
    type: "Analytics",
    enabled: true,
    lastRun: "2026-03-24T08:00:00Z",
    nextRun: "2026-03-31T08:00:00Z",
    status: "success",
  },
  {
    id: "8",
    name: "Sitemap Regenerator",
    schedule: "0 4 * * *",
    type: "SEO",
    enabled: true,
    lastRun: "2026-03-29T04:00:00Z",
    nextRun: "2026-03-30T04:00:00Z",
    status: "success",
  },
]

const typeColors: Record<string, string> = {
  SEO: "bg-cyan-500/15 text-cyan-400",
  Pipeline: "bg-indigo-500/15 text-indigo-400",
  Analytics: "bg-purple-500/15 text-purple-400",
  Quality: "bg-amber-500/15 text-amber-400",
  Research: "bg-pink-500/15 text-pink-400",
}

const statusConfig: Record<string, { dot: string; label: string }> = {
  success: { dot: "bg-emerald-400", label: "Success" },
  failed: { dot: "bg-red-400", label: "Failed" },
  running: { dot: "bg-blue-400 animate-pulse", label: "Running" },
  idle: { dot: "bg-slate-500", label: "Idle" },
}

function formatDateTime(ts: string | null): string {
  if (!ts) return "Never"
  const d = new Date(ts)
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  })
}

export default function CronPage() {
  const [loading, setLoading] = React.useState(true)
  const [jobs, setJobs] = React.useState<CronJob[]>([])

  React.useEffect(() => {
    const t = setTimeout(() => {
      setJobs(initialCronJobs)
      setLoading(false)
    }, 500)
    return () => clearTimeout(t)
  }, [])

  const toggleJob = (id: string) => {
    setJobs((prev) =>
      prev.map((job) =>
        job.id === id
          ? { ...job, enabled: !job.enabled, status: !job.enabled ? job.status : "idle" }
          : job
      )
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-6 h-6 text-teal-400 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Summary */}
      <div className="flex items-center gap-4 text-sm">
        <span className="text-slate-400">
          <span className="text-white font-semibold">{jobs.filter((j) => j.enabled).length}</span> active
        </span>
        <span className="text-slate-600">|</span>
        <span className="text-slate-400">
          <span className="text-white font-semibold">{jobs.filter((j) => !j.enabled).length}</span> disabled
        </span>
        <span className="text-slate-600">|</span>
        <span className="text-slate-400">
          <span className="text-red-400 font-semibold">{jobs.filter((j) => j.status === "failed").length}</span> failed
        </span>
      </div>

      {/* Jobs Table */}
      <Card className="bg-white/[0.03] border-0 ring-1 ring-white/[0.06] text-white">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-white/[0.06] hover:bg-transparent">
                <TableHead className="text-slate-400 text-xs">Name</TableHead>
                <TableHead className="text-slate-400 text-xs">Schedule</TableHead>
                <TableHead className="text-slate-400 text-xs">Type</TableHead>
                <TableHead className="text-slate-400 text-xs text-center">Status</TableHead>
                <TableHead className="text-slate-400 text-xs text-center">Enabled</TableHead>
                <TableHead className="text-slate-400 text-xs">Last Run</TableHead>
                <TableHead className="text-slate-400 text-xs">Next Run</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {jobs.map((job) => {
                const sc = statusConfig[job.status]
                return (
                  <TableRow
                    key={job.id}
                    className={cn(
                      "border-white/[0.04] hover:bg-white/[0.02]",
                      !job.enabled && "opacity-50"
                    )}
                  >
                    <TableCell className="text-sm text-slate-200 font-medium">
                      {job.name}
                    </TableCell>
                    <TableCell>
                      <code className="text-xs text-slate-400 bg-slate-950/50 px-1.5 py-0.5 rounded font-mono">
                        {job.schedule}
                      </code>
                    </TableCell>
                    <TableCell>
                      <span
                        className={cn(
                          "inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium",
                          typeColors[job.type] || "bg-slate-500/15 text-slate-400"
                        )}
                      >
                        {job.type}
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <div className={cn("w-2 h-2 rounded-full", sc.dot)} />
                        <span className="text-xs text-slate-400">{sc.label}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <button
                        onClick={() => toggleJob(job.id)}
                        className={cn(
                          "relative inline-flex h-5 w-9 items-center rounded-full transition-colors",
                          job.enabled ? "bg-teal-600" : "bg-slate-700"
                        )}
                      >
                        <span
                          className={cn(
                            "inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform",
                            job.enabled ? "translate-x-4.5" : "translate-x-0.5"
                          )}
                        />
                      </button>
                    </TableCell>
                    <TableCell className="text-xs text-slate-400 tabular-nums">
                      {formatDateTime(job.lastRun)}
                    </TableCell>
                    <TableCell className="text-xs text-slate-400 tabular-nums">
                      {job.enabled ? formatDateTime(job.nextRun) : "--"}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
