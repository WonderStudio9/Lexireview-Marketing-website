"use client"

import * as React from "react"
import { Loader2, ChevronDown, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface AgentLog {
  id: string
  timestamp: string
  agentName: string
  action: string
  contentPiece: string
  durationMs: number
  input?: Record<string, unknown>
  output?: Record<string, unknown>
  error?: string | null
}

const agentColors: Record<string, string> = {
  "Strategy Agent": "bg-blue-500/15 text-blue-400",
  "Writer Agent": "bg-indigo-500/15 text-indigo-400",
  "SEO Agent": "bg-cyan-500/15 text-cyan-400",
  "Legal Agent": "bg-purple-500/15 text-purple-400",
  "Quality Agent": "bg-amber-500/15 text-amber-400",
  "Publisher Agent": "bg-emerald-500/15 text-emerald-400",
  "Research Agent": "bg-pink-500/15 text-pink-400",
  "SEO/AEO/GEO Agent": "bg-cyan-500/15 text-cyan-400",
  "Legal Accuracy Agent": "bg-purple-500/15 text-purple-400",
}

const AGENT_NAMES = [
  "Strategy Agent",
  "Writer Agent",
  "SEO Agent",
  "SEO/AEO/GEO Agent",
  "Legal Agent",
  "Legal Accuracy Agent",
  "Quality Agent",
  "Publisher Agent",
  "Research Agent",
]

function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`
  return `${(ms / 1000).toFixed(1)}s`
}

function formatTime(ts: string): string {
  return new Date(ts).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  })
}

function formatDate(ts: string): string {
  return new Date(ts).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  })
}

export default function AgentsPage() {
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  const [logs, setLogs] = React.useState<AgentLog[]>([])
  const [expandedRows, setExpandedRows] = React.useState<Set<string>>(new Set())
  const [agentFilter, setAgentFilter] = React.useState<string>("all")
  const [searchQuery, setSearchQuery] = React.useState("")

  React.useEffect(() => {
    fetch("/api/agents?limit=100")
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json()
      })
      .then((data) => {
        const mapped: AgentLog[] = (data.logs || []).map(
          (log: Record<string, unknown>) => ({
            id: log.id,
            timestamp: log.createdAt as string,
            agentName: log.agentName as string,
            action: log.action as string,
            contentPiece:
              (log.brief as Record<string, unknown>)?.topic || "Unknown",
            durationMs: (log.durationMs as number) || 0,
            input: log.input as Record<string, unknown> | undefined,
            output: log.output as Record<string, unknown> | undefined,
            error: log.error as string | null,
          })
        )
        setLogs(mapped)
        setLoading(false)
      })
      .catch((err) => {
        setError(err.message)
        setLoading(false)
      })
  }, [])

  const toggleRow = (id: string) => {
    setExpandedRows((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const filteredLogs = React.useMemo(() => {
    return logs.filter((log) => {
      if (agentFilter !== "all" && log.agentName !== agentFilter) return false
      if (searchQuery) {
        const q = searchQuery.toLowerCase()
        return (
          log.contentPiece.toLowerCase().includes(q) ||
          log.action.toLowerCase().includes(q) ||
          log.agentName.toLowerCase().includes(q)
        )
      }
      return true
    })
  }, [logs, agentFilter, searchQuery])

  // Collect unique agent names from actual data
  const uniqueAgents = React.useMemo(() => {
    const names = new Set(logs.map((l) => l.agentName))
    return Array.from(names).sort()
  }, [logs])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-6 h-6 text-teal-400 animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96 text-red-400">
        Failed to load agent logs: {error}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative w-64">
          <Input
            placeholder="Search logs..."
            value={searchQuery}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
            className="h-8 bg-white/[0.04] border-white/[0.06] text-sm text-slate-300 placeholder:text-slate-500"
          />
        </div>
        <Select value={agentFilter} onValueChange={(v) => setAgentFilter(v ?? "")}>
          <SelectTrigger className="w-48 border-white/[0.06] bg-white/[0.04] text-slate-300">
            <SelectValue placeholder="All Agents" />
          </SelectTrigger>
          <SelectContent className="bg-slate-900 ring-white/[0.08] text-white">
            <SelectItem value="all" className="text-slate-300 focus:bg-white/[0.06] focus:text-white">
              All Agents
            </SelectItem>
            {uniqueAgents.map((name) => (
              <SelectItem
                key={name}
                value={name}
                className="text-slate-300 focus:bg-white/[0.06] focus:text-white"
              >
                {name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <span className="text-xs text-slate-500">{filteredLogs.length} logs</span>
      </div>

      {/* Logs Table */}
      <Card className="bg-white/[0.03] border-0 ring-1 ring-white/[0.06] text-white">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-white/[0.06] hover:bg-transparent">
                <TableHead className="text-slate-400 text-xs w-8" />
                <TableHead className="text-slate-400 text-xs">Timestamp</TableHead>
                <TableHead className="text-slate-400 text-xs">Agent</TableHead>
                <TableHead className="text-slate-400 text-xs">Action</TableHead>
                <TableHead className="text-slate-400 text-xs">Content Piece</TableHead>
                <TableHead className="text-slate-400 text-xs text-right">Duration</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLogs.length === 0 ? (
                <TableRow className="border-white/[0.04]">
                  <TableCell colSpan={6} className="text-center py-8 text-slate-500">
                    {logs.length === 0
                      ? "No agent activity yet. Run a content pipeline to generate logs."
                      : "No logs match your filter"}
                  </TableCell>
                </TableRow>
              ) : (
                filteredLogs.map((log) => (
                  <React.Fragment key={log.id}>
                    <TableRow
                      className={cn(
                        "border-white/[0.04] hover:bg-white/[0.02] cursor-pointer",
                        log.error && "bg-red-500/[0.03]"
                      )}
                      onClick={() => toggleRow(log.id)}
                    >
                      <TableCell className="w-8 px-3">
                        {expandedRows.has(log.id) ? (
                          <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                        ) : (
                          <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                        )}
                      </TableCell>
                      <TableCell className="text-xs text-slate-400 tabular-nums">
                        <span className="text-slate-500">{formatDate(log.timestamp)}</span>{" "}
                        {formatTime(log.timestamp)}
                      </TableCell>
                      <TableCell>
                        <span
                          className={cn(
                            "inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium",
                            agentColors[log.agentName] || "bg-slate-500/15 text-slate-400"
                          )}
                        >
                          {log.agentName}
                        </span>
                      </TableCell>
                      <TableCell className="text-sm text-slate-200">
                        {log.action}
                      </TableCell>
                      <TableCell className="text-sm text-slate-300 max-w-xs truncate">
                        {log.contentPiece}
                      </TableCell>
                      <TableCell className="text-right text-xs text-slate-400 tabular-nums">
                        {formatDuration(log.durationMs)}
                      </TableCell>
                    </TableRow>
                    {expandedRows.has(log.id) && (
                      <TableRow className="border-white/[0.04] bg-white/[0.01]">
                        <TableCell colSpan={6} className="px-6 py-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {log.error && (
                              <div className="md:col-span-2">
                                <p className="text-[10px] font-semibold text-red-400 uppercase tracking-wider mb-2">
                                  Error
                                </p>
                                <pre className="text-xs text-red-300 bg-red-950/30 rounded-lg p-3 overflow-x-auto">
                                  {log.error}
                                </pre>
                              </div>
                            )}
                            {log.input && (
                              <div>
                                <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
                                  Input
                                </p>
                                <pre className="text-xs text-slate-400 bg-slate-950/50 rounded-lg p-3 overflow-x-auto max-h-48">
                                  {JSON.stringify(log.input, null, 2)}
                                </pre>
                              </div>
                            )}
                            {log.output && (
                              <div>
                                <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
                                  Output
                                </p>
                                <pre className="text-xs text-teal-400/80 bg-slate-950/50 rounded-lg p-3 overflow-x-auto max-h-48">
                                  {JSON.stringify(log.output, null, 2)}
                                </pre>
                              </div>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
