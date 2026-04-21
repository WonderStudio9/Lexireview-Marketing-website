/**
 * Multi-touch attribution computation.
 *
 * Given a Lead, walks their touchpoints (Visitor.pageViews + LeadActivity)
 * and distributes conversion credit across sources using the chosen model.
 *
 * Models supported:
 *   - FIRST_TOUCH — 100% credit to first touch
 *   - LAST_TOUCH  — 100% credit to last touch before conversion
 *   - LINEAR      — equal credit to every touch
 *   - TIME_DECAY  — more credit to recent touches (half-life 7 days)
 *   - U_SHAPED    — 40% first + 40% last + 20% distributed across middle
 */

import { prisma } from "@/lib/db";

export type AttributionModel = "FIRST_TOUCH" | "LAST_TOUCH" | "LINEAR" | "TIME_DECAY" | "U_SHAPED";

export interface Touchpoint {
  source: string; // "ORGANIC_BLOG", "ORGANIC_TOOL", "SOCIAL_LINKEDIN", etc.
  timestamp: Date;
  url?: string;
  utmSource?: string | null;
  utmMedium?: string | null;
  utmCampaign?: string | null;
}

export interface AttributionResult {
  leadId: string;
  email: string;
  totalTouchpoints: number;
  model: AttributionModel;
  credit: Array<{ source: string; creditPct: number; touchCount: number }>;
}

export async function computeAttribution(
  leadId: string,
  model: AttributionModel = "LAST_TOUCH",
): Promise<AttributionResult | null> {
  const lead = await prisma.lead.findUnique({
    where: { id: leadId },
    include: {
      activities: {
        orderBy: { createdAt: "asc" },
        where: {
          type: { in: ["PAGE_VIEW", "BLOG_READ", "TOOL_STARTED", "TOOL_COMPLETED", "FORM_SUBMITTED"] },
        },
      },
    },
  });
  if (!lead) return null;

  // Seed touchpoints with first-touch from Lead record
  const touchpoints: Touchpoint[] = [];
  if (lead.firstTouchUrl) {
    touchpoints.push({
      source: lead.source,
      timestamp: lead.firstTouchAt,
      url: lead.firstTouchUrl,
      utmSource: lead.utmSource,
      utmMedium: lead.utmMedium,
      utmCampaign: lead.utmCampaign,
    });
  }

  // Add activity-derived touchpoints
  for (const a of lead.activities) {
    const meta = (a.metadata as Record<string, unknown>) || {};
    touchpoints.push({
      source: (meta.source as string) || lead.source,
      timestamp: a.createdAt,
      url: meta.path as string | undefined,
      utmSource: (meta.utmSource as string) || null,
      utmMedium: (meta.utmMedium as string) || null,
      utmCampaign: (meta.utmCampaign as string) || null,
    });
  }

  // Add visitor page views linked to this lead (if any)
  const visitor = await prisma.visitor.findFirst({ where: { leadId } });
  if (visitor) {
    const pageViews = await prisma.pageView.findMany({
      where: { visitorId: visitor.id },
      orderBy: { createdAt: "asc" },
    });
    for (const pv of pageViews) {
      touchpoints.push({
        source: inferSourceFromPath(pv.path, pv.referrer, pv.utmSource),
        timestamp: pv.createdAt,
        url: pv.path,
        utmSource: pv.utmSource,
        utmMedium: pv.utmMedium,
        utmCampaign: pv.utmCampaign,
      });
    }
  }

  if (touchpoints.length === 0) {
    return {
      leadId,
      email: lead.email,
      totalTouchpoints: 0,
      model,
      credit: [],
    };
  }

  // Sort by timestamp
  touchpoints.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

  // Dedupe same-source within 5 min
  const deduped: Touchpoint[] = [];
  for (const t of touchpoints) {
    const last = deduped[deduped.length - 1];
    if (last && last.source === t.source && t.timestamp.getTime() - last.timestamp.getTime() < 5 * 60_000) {
      continue;
    }
    deduped.push(t);
  }

  // Compute credit weights per model
  const weights: number[] = new Array(deduped.length).fill(0);
  const n = deduped.length;

  switch (model) {
    case "FIRST_TOUCH":
      weights[0] = 1;
      break;
    case "LAST_TOUCH":
      weights[n - 1] = 1;
      break;
    case "LINEAR":
      for (let i = 0; i < n; i++) weights[i] = 1 / n;
      break;
    case "TIME_DECAY": {
      const conversionTime = deduped[n - 1].timestamp.getTime();
      const halfLifeMs = 7 * 24 * 60 * 60 * 1000;
      const raw = deduped.map((t) => Math.pow(0.5, (conversionTime - t.timestamp.getTime()) / halfLifeMs));
      const sum = raw.reduce((a, b) => a + b, 0);
      raw.forEach((r, i) => (weights[i] = r / sum));
      break;
    }
    case "U_SHAPED":
      if (n === 1) weights[0] = 1;
      else if (n === 2) {
        weights[0] = 0.5;
        weights[1] = 0.5;
      } else {
        weights[0] = 0.4;
        weights[n - 1] = 0.4;
        const midShare = 0.2 / (n - 2);
        for (let i = 1; i < n - 1; i++) weights[i] = midShare;
      }
      break;
  }

  // Aggregate by source
  const bySource = new Map<string, { credit: number; count: number }>();
  for (let i = 0; i < n; i++) {
    const source = deduped[i].source;
    const prev = bySource.get(source) || { credit: 0, count: 0 };
    prev.credit += weights[i];
    prev.count += 1;
    bySource.set(source, prev);
  }

  const credit = Array.from(bySource.entries())
    .map(([source, data]) => ({
      source,
      creditPct: Math.round(data.credit * 100 * 100) / 100,
      touchCount: data.count,
    }))
    .sort((a, b) => b.creditPct - a.creditPct);

  return {
    leadId,
    email: lead.email,
    totalTouchpoints: n,
    model,
    credit,
  };
}

function inferSourceFromPath(
  path: string,
  referrer?: string | null,
  utmSource?: string | null,
): string {
  if (utmSource === "linkedin") return "SOCIAL_LINKEDIN";
  if (utmSource === "quora") return "SOCIAL_QUORA";
  if (utmSource === "medium") return "SOCIAL_MEDIUM";
  if (utmSource && utmSource.startsWith("paid")) return "PAID";
  if (path.includes("/blog/")) return "ORGANIC_BLOG";
  if (path.includes("/tools/")) return "ORGANIC_TOOL";
  if (path.includes("/citizens/") || path.includes("/solutions/")) return "ORGANIC_LANDING";
  if (referrer?.includes("google.")) return "ORGANIC_BLOG";
  if (referrer?.includes("linkedin.com")) return "SOCIAL_LINKEDIN";
  return "DIRECT";
}

/**
 * Fleet-level funnel summary for the /forge/analytics dashboard.
 */
export async function getFunnelSummary() {
  const [totalLeads, mqlLeads, sqlLeads, trialLeads, customerLeads, churnedLeads] =
    await Promise.all([
      prisma.lead.count(),
      prisma.lead.count({ where: { stage: "MQL" } }),
      prisma.lead.count({ where: { stage: "SQL" } }),
      prisma.lead.count({ where: { stage: "TRIAL" } }),
      prisma.lead.count({ where: { stage: "CUSTOMER" } }),
      prisma.lead.count({ where: { stage: "CHURNED" } }),
    ]);

  const bySource = await prisma.lead.groupBy({
    by: ["source"],
    _count: true,
  });

  const byTier = await prisma.lead.groupBy({
    by: ["tier"],
    _count: true,
  });

  return {
    funnel: {
      totalLeads,
      mqlLeads,
      sqlLeads,
      trialLeads,
      customerLeads,
      churnedLeads,
      mqlToSqlRate: mqlLeads > 0 ? (sqlLeads / mqlLeads) * 100 : 0,
      sqlToTrialRate: sqlLeads > 0 ? (trialLeads / sqlLeads) * 100 : 0,
      trialToCustomerRate: trialLeads > 0 ? (customerLeads / trialLeads) * 100 : 0,
    },
    bySource: bySource.map((s) => ({ source: s.source, count: s._count })),
    byTier: byTier.map((t) => ({ tier: t.tier, count: t._count })),
  };
}
