"use client"

import * as React from "react"
import { Loader2, TrendingUp, TrendingDown, Minus } from "lucide-react"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { StatsCard } from "@/components/forge/stats-card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Search,
  Target,
  Award,
  Hash,
} from "lucide-react"

interface KeywordData {
  id: string
  cluster: string
  keyword: string
  currentRank: number | null
  lastChecked: string | null
}

interface ClusterSummary {
  name: string
  keywords: number
  avgRank: number
  top10: number
  top50: number
  trend: "up" | "down" | "flat"
}

interface SeoStats {
  totalKeywords: number
  rankingTop10: number
  rankingTop50: number
  notRanking: number
}

interface CitationEngine {
  total: number
  cited: number
}

export default function AnalyticsPage() {
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  const [clusters, setClusters] = React.useState<ClusterSummary[]>([])
  const [stats, setStats] = React.useState<SeoStats>({
    totalKeywords: 0,
    rankingTop10: 0,
    rankingTop50: 0,
    notRanking: 0,
  })
  const [citationEngines, setCitationEngines] = React.useState<
    Array<{ name: string; citations: number; color: string }>
  >([])

  React.useEffect(() => {
    Promise.all([
      fetch("/api/seo?type=keywords").then((r) => {
        if (!r.ok) throw new Error(`Keywords API: HTTP ${r.status}`)
        return r.json()
      }),
      fetch("/api/seo?type=citations").then((r) => {
        if (!r.ok) throw new Error(`Citations API: HTTP ${r.status}`)
        return r.json()
      }),
    ])
      .then(([keywordData, citationData]) => {
        // Process keyword clusters
        if (keywordData.stats) {
          setStats(keywordData.stats)
        }

        if (keywordData.clusters) {
          const engineColors: Record<string, string> = {
            Perplexity: "#22d3ee",
            ChatGPT: "#10b981",
            "Google AI Overview": "#6366f1",
            "Bing Copilot": "#f59e0b",
          }

          const clusterSummaries: ClusterSummary[] = Object.entries(
            keywordData.clusters as Record<string, KeywordData[]>
          ).map(([name, keywords]) => {
            const ranked = keywords.filter((k) => k.currentRank !== null)
            const avgRank =
              ranked.length > 0
                ? ranked.reduce((sum, k) => sum + (k.currentRank || 0), 0) / ranked.length
                : 0
            const top10 = keywords.filter(
              (k) => k.currentRank !== null && k.currentRank <= 10
            ).length
            const top50 = keywords.filter(
              (k) => k.currentRank !== null && k.currentRank <= 50
            ).length

            return {
              name,
              keywords: keywords.length,
              avgRank: Number(avgRank.toFixed(1)),
              top10,
              top50,
              trend: "flat" as const,
            }
          })

          setClusters(clusterSummaries.sort((a, b) => b.keywords - a.keywords))
        }

        // Process citations
        if (citationData.byEngine) {
          const defaultColors: Record<string, string> = {
            Perplexity: "#22d3ee",
            ChatGPT: "#10b981",
            "Google AI Overview": "#6366f1",
            "Bing Copilot": "#f59e0b",
          }
          const colorFallbacks = ["#ec4899", "#8b5cf6", "#f97316", "#14b8a6"]
          let colorIdx = 0

          const engines = Object.entries(
            citationData.byEngine as Record<string, CitationEngine>
          ).map(([name, data]) => ({
            name,
            citations: data.cited,
            color:
              defaultColors[name] ||
              colorFallbacks[colorIdx++ % colorFallbacks.length],
          }))

          setCitationEngines(engines)
        }

        setLoading(false)
      })
      .catch((err) => {
        setError(err.message)
        setLoading(false)
      })
  }, [])

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
        Failed to load analytics: {error}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Keyword Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatsCard
          title="Total Keywords"
          value={stats.totalKeywords}
          icon={Hash}
        />
        <StatsCard
          title="Ranking Top 10"
          value={stats.rankingTop10}
          icon={Award}
        />
        <StatsCard
          title="Ranking Top 50"
          value={stats.rankingTop50}
          icon={Target}
        />
        <StatsCard
          title="Not Ranking"
          value={stats.notRanking}
          icon={Search}
        />
      </div>

      {/* Cluster Performance Table */}
      <Card className="bg-white/[0.03] border-0 ring-1 ring-white/[0.06] text-white">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold text-white">
            Cluster Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          {clusters.length === 0 ? (
            <p className="text-center py-8 text-slate-500">
              No keyword data yet. Run a keyword seed or SEO check to populate.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-white/[0.06] hover:bg-transparent">
                  <TableHead className="text-slate-400 text-xs">Cluster</TableHead>
                  <TableHead className="text-slate-400 text-xs text-right">Keywords</TableHead>
                  <TableHead className="text-slate-400 text-xs text-right">Avg Rank</TableHead>
                  <TableHead className="text-slate-400 text-xs text-right">Top 10</TableHead>
                  <TableHead className="text-slate-400 text-xs text-right">Top 50</TableHead>
                  <TableHead className="text-slate-400 text-xs text-center">Trend</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clusters.map((cluster) => (
                  <TableRow key={cluster.name} className="border-white/[0.04] hover:bg-white/[0.02]">
                    <TableCell className="text-sm text-slate-200 font-medium">
                      {cluster.name}
                    </TableCell>
                    <TableCell className="text-right text-sm text-slate-300 tabular-nums">
                      {cluster.keywords}
                    </TableCell>
                    <TableCell className="text-right text-sm text-slate-300 tabular-nums">
                      {cluster.avgRank > 0 ? cluster.avgRank.toFixed(1) : "--"}
                    </TableCell>
                    <TableCell className="text-right text-sm text-slate-300 tabular-nums">
                      {cluster.top10}
                    </TableCell>
                    <TableCell className="text-right text-sm text-slate-300 tabular-nums">
                      {cluster.top50}
                    </TableCell>
                    <TableCell className="text-center">
                      {cluster.trend === "up" && <TrendingUp className="w-4 h-4 text-teal-400 mx-auto" />}
                      {cluster.trend === "down" && <TrendingDown className="w-4 h-4 text-red-400 mx-auto" />}
                      {cluster.trend === "flat" && <Minus className="w-4 h-4 text-slate-500 mx-auto" />}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* AI Citation Tracker */}
      <Card className="bg-white/[0.03] border-0 ring-1 ring-white/[0.06] text-white">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold text-white">
            AI Citation Tracker
          </CardTitle>
        </CardHeader>
        <CardContent>
          {citationEngines.length === 0 ? (
            <p className="text-center py-8 text-slate-500">
              No citation data yet. AI citation monitoring will populate this section.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
              {citationEngines.map((source) => (
                <div
                  key={source.name}
                  className="rounded-lg bg-white/[0.02] ring-1 ring-white/[0.04] p-4 space-y-2"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: source.color }}
                    />
                    <p className="text-xs font-medium text-slate-400">{source.name}</p>
                  </div>
                  <p className="text-2xl font-bold text-white tabular-nums">
                    {source.citations}
                  </p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
