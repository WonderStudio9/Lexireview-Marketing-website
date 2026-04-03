import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"
import type { LucideIcon } from "lucide-react"

interface StatsCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon: LucideIcon
  trend?: { value: number; label: string }
  className?: string
}

export function StatsCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  className,
}: StatsCardProps) {
  return (
    <Card
      className={cn(
        "bg-white/[0.03] border-0 ring-1 ring-white/[0.06] text-white",
        className
      )}
    >
      <CardContent className="pt-0">
        <div className="flex items-start justify-between">
          <div className="space-y-1.5">
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">
              {title}
            </p>
            <p className="text-2xl font-bold tracking-tight text-white">
              {value}
            </p>
            {subtitle && (
              <p className="text-xs text-slate-500">{subtitle}</p>
            )}
            {trend && (
              <p
                className={cn(
                  "text-xs font-medium",
                  trend.value >= 0 ? "text-teal-400" : "text-red-400"
                )}
              >
                {trend.value >= 0 ? "+" : ""}
                {trend.value}% {trend.label}
              </p>
            )}
          </div>
          <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-teal-500/10">
            <Icon className="w-4.5 h-4.5 text-teal-400" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
