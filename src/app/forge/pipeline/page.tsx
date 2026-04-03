"use client"

import * as React from "react"
import { Plus, Filter, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog"
import { PipelineCard } from "@/components/forge/pipeline-card"

const COLUMNS = [
  "BRIEFED",
  "STRATEGY",
  "DRAFTING",
  "LEGAL_REVIEW",
  "SEO_OPTIMIZATION",
  "QUALITY_CHECK",
  "APPROVED",
  "PUBLISHED",
  "REJECTED",
] as const

type PipelineStatus = (typeof COLUMNS)[number]

interface ContentItem {
  id: string
  title: string
  status: PipelineStatus
  icp?: string
  funnelStage?: string
  qualityScore?: number
  updatedAt: string
  cluster?: string
}

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

const columnColors: Record<string, string> = {
  BRIEFED: "bg-slate-400",
  STRATEGY: "bg-blue-400",
  DRAFTING: "bg-indigo-400",
  LEGAL_REVIEW: "bg-purple-400",
  SEO_OPTIMIZATION: "bg-cyan-400",
  QUALITY_CHECK: "bg-amber-400",
  APPROVED: "bg-teal-400",
  PUBLISHED: "bg-emerald-400",
  REJECTED: "bg-red-400",
}

export default function PipelinePage() {
  const [items, setItems] = React.useState<ContentItem[]>([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  const [selectedItem, setSelectedItem] = React.useState<ContentItem | null>(null)
  const [detailOpen, setDetailOpen] = React.useState(false)
  const [newBriefOpen, setNewBriefOpen] = React.useState(false)
  const [newTitle, setNewTitle] = React.useState("")
  const [creating, setCreating] = React.useState(false)

  const fetchBriefs = React.useCallback(() => {
    fetch("/api/content")
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json()
      })
      .then((briefs) => {
        const mapped: ContentItem[] = briefs.map((b: Record<string, unknown>) => ({
          id: b.id,
          title: b.topic,
          status: b.status as PipelineStatus,
          icp: b.icp || undefined,
          funnelStage: b.funnelStage || undefined,
          cluster: b.cluster || undefined,
          qualityScore:
            Array.isArray(b.drafts) && b.drafts.length > 0
              ? (b.drafts[0] as Record<string, unknown>)?.qualityScore ?? undefined
              : undefined,
          updatedAt: b.updatedAt as string,
        }))
        setItems(mapped)
        setLoading(false)
      })
      .catch((err) => {
        setError(err.message)
        setLoading(false)
      })
  }, [])

  React.useEffect(() => {
    fetchBriefs()
  }, [fetchBriefs])

  const handleCreateBrief = async () => {
    if (!newTitle.trim()) return
    setCreating(true)
    try {
      const res = await fetch("/api/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: newTitle.trim(),
          channel: "BLOG",
          funnelStage: "TOFU",
        }),
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      setNewTitle("")
      setNewBriefOpen(false)
      fetchBriefs()
    } catch (err) {
      console.error("Failed to create brief:", err)
    } finally {
      setCreating(false)
    }
  }

  const grouped = React.useMemo(() => {
    const map: Record<string, ContentItem[]> = {}
    for (const col of COLUMNS) map[col] = []
    for (const item of items) {
      if (map[item.status]) map[item.status].push(item)
    }
    return map
  }, [items])

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
        Failed to load pipeline: {error}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" className="border-white/[0.06] bg-white/[0.02] text-slate-400 hover:text-white gap-1.5">
            <Filter className="w-3.5 h-3.5" />
            Filter
          </Button>
          <span className="text-xs text-slate-500">{items.length} content pieces</span>
        </div>
        <Dialog open={newBriefOpen} onOpenChange={setNewBriefOpen}>
          <DialogTrigger
            render={
              <Button size="sm" className="bg-teal-600 hover:bg-teal-500 text-white gap-1.5" />
            }
          >
            <Plus className="w-3.5 h-3.5" />
            New Brief
          </DialogTrigger>
          <DialogContent className="bg-slate-900 ring-white/[0.08] text-white sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-white">Create New Brief</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-400">Content Title</label>
                <Input
                  placeholder="e.g. DPDP Act Compliance Guide for NBFCs"
                  value={newTitle}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewTitle(e.target.value)}
                  className="bg-white/[0.04] border-white/[0.06] text-white placeholder:text-slate-500"
                  onKeyDown={(e: React.KeyboardEvent) => {
                    if (e.key === "Enter") handleCreateBrief()
                  }}
                />
              </div>
            </div>
            <DialogFooter className="bg-slate-950/50">
              <DialogClose render={<Button variant="outline" className="border-white/[0.06] text-slate-400" />}>
                Cancel
              </DialogClose>
              <Button
                onClick={handleCreateBrief}
                disabled={creating}
                className="bg-teal-600 hover:bg-teal-500 text-white"
              >
                {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : "Create Brief"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Kanban Board */}
      <div className="overflow-x-auto pb-4 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
        <div className="flex gap-3 min-w-max">
          {COLUMNS.map((col) => (
            <div key={col} className="w-64 shrink-0">
              <div className="flex items-center gap-2 mb-3 px-1">
                <div className={cn("w-2 h-2 rounded-full", columnColors[col])} />
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  {col.replace(/_/g, " ")}
                </span>
                <span className="text-[10px] font-medium text-slate-600 bg-white/[0.04] px-1.5 py-0.5 rounded-full">
                  {grouped[col].length}
                </span>
              </div>
              <div className="space-y-2.5 min-h-[8rem]">
                {grouped[col].map((item) => (
                  <PipelineCard
                    key={item.id}
                    title={item.title}
                    icp={item.icp}
                    funnelStage={item.funnelStage}
                    qualityScore={item.qualityScore}
                    updatedAt={item.updatedAt}
                    onClick={() => {
                      setSelectedItem(item)
                      setDetailOpen(true)
                    }}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Detail Dialog */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="bg-slate-900 ring-white/[0.08] text-white sm:max-w-lg">
          {selectedItem && (
            <>
              <DialogHeader>
                <DialogTitle className="text-white leading-snug">
                  {selectedItem.title}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-2">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Status</p>
                    <span
                      className={cn(
                        "inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium",
                        statusColors[selectedItem.status] || "bg-slate-500/15 text-slate-400"
                      )}
                    >
                      {selectedItem.status.replace(/_/g, " ")}
                    </span>
                  </div>
                  {selectedItem.icp && (
                    <div>
                      <p className="text-xs text-slate-500 mb-1">ICP</p>
                      <p className="text-slate-200">{selectedItem.icp}</p>
                    </div>
                  )}
                  {selectedItem.funnelStage && (
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Funnel Stage</p>
                      <p className="text-slate-200">{selectedItem.funnelStage}</p>
                    </div>
                  )}
                  {selectedItem.cluster && (
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Cluster</p>
                      <p className="text-slate-200">{selectedItem.cluster}</p>
                    </div>
                  )}
                  {selectedItem.qualityScore !== undefined && (
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Quality Score</p>
                      <p className="text-slate-200 font-semibold tabular-nums">
                        {selectedItem.qualityScore}/100
                      </p>
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">Last Updated</p>
                  <p className="text-slate-300 text-sm">
                    {new Date(selectedItem.updatedAt).toLocaleString()}
                  </p>
                </div>
              </div>
              <DialogFooter className="bg-slate-950/50">
                <DialogClose render={<Button variant="outline" className="border-white/[0.06] text-slate-400" />}>
                  Close
                </DialogClose>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
