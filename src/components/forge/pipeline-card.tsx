"use client"

import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"
import { Clock } from "lucide-react"

interface PipelineCardProps {
  title: string
  icp?: string
  funnelStage?: string
  qualityScore?: number
  updatedAt?: string
  onClick?: () => void
  className?: string
}

const funnelColors: Record<string, string> = {
  TOFU: "bg-blue-500/15 text-blue-400",
  MOFU: "bg-amber-500/15 text-amber-400",
  BOFU: "bg-emerald-500/15 text-emerald-400",
}

const icpColors: Record<string, string> = {
  "Enterprise CTO": "bg-purple-500/15 text-purple-400",
  "SMB Founder": "bg-orange-500/15 text-orange-400",
  "Developer": "bg-cyan-500/15 text-cyan-400",
  "Product Manager": "bg-pink-500/15 text-pink-400",
  "Marketing Lead": "bg-yellow-500/15 text-yellow-400",
}

function timeAgo(date: string): string {
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

function scoreColor(score: number): string {
  if (score >= 90) return "text-emerald-400"
  if (score >= 75) return "text-teal-400"
  if (score >= 60) return "text-amber-400"
  return "text-red-400"
}

export function PipelineCard({
  title,
  icp,
  funnelStage,
  qualityScore,
  updatedAt,
  onClick,
  className,
}: PipelineCardProps) {
  return (
    <Card
      className={cn(
        "bg-white/[0.03] border-0 ring-1 ring-white/[0.06] cursor-pointer hover:ring-teal-500/30 hover:bg-white/[0.05] transition-all",
        className
      )}
      onClick={onClick}
    >
      <CardContent className="pt-0 space-y-2.5">
        <p className="text-sm font-medium text-white leading-snug line-clamp-2">
          {title}
        </p>
        <div className="flex flex-wrap gap-1.5">
          {icp && (
            <span
              className={cn(
                "inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium",
                icpColors[icp] || "bg-slate-500/15 text-slate-400"
              )}
            >
              {icp}
            </span>
          )}
          {funnelStage && (
            <span
              className={cn(
                "inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium",
                funnelColors[funnelStage] || "bg-slate-500/15 text-slate-400"
              )}
            >
              {funnelStage}
            </span>
          )}
        </div>
        <div className="flex items-center justify-between pt-1 border-t border-white/[0.04]">
          {qualityScore !== undefined && (
            <span className={cn("text-xs font-semibold tabular-nums", scoreColor(qualityScore))}>
              {qualityScore}/100
            </span>
          )}
          {updatedAt && (
            <span className="flex items-center gap-1 text-[10px] text-slate-500">
              <Clock className="w-3 h-3" />
              {timeAgo(updatedAt)}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
