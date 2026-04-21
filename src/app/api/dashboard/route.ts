import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { isAuthenticated } from "@/lib/auth";

/**
 * GET /api/dashboard
 *
 * Aggregated metrics for the /forge overview page. Returns top-line KPIs +
 * trends + recent activity — all in one round-trip so the dashboard renders
 * in a single fetch.
 */
export async function GET() {
  const authed = await isAuthenticated();
  if (!authed) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const now = new Date();
  const sevenDaysAgo = new Date(now);
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const thirtyDaysAgo = new Date(now);
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const [
    totalLeads,
    newLeads7d,
    newLeads30d,
    leadsByTier,
    leadsByStage,
    totalAccounts,
    totalContacts,
    totalDeals,
    dealsByStage,
    pipelineValue,
    toolCompletions7d,
    totalToolCompletions,
    premiumSales,
    emailsSent7d,
    totalPublishedContent,
    totalActiveCampaigns,
    totalToolsSeeded,
    recentLeads,
    recentActivities,
    topTools,
    topContent,
  ] = await Promise.all([
    prisma.lead.count(),
    prisma.lead.count({ where: { createdAt: { gte: sevenDaysAgo } } }),
    prisma.lead.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
    prisma.lead.groupBy({ by: ["tier"], _count: true }),
    prisma.lead.groupBy({ by: ["stage"], _count: true }),
    prisma.account.count(),
    prisma.contact.count(),
    prisma.deal.count(),
    prisma.deal.groupBy({
      by: ["stage"],
      _count: true,
      _sum: { valueINR: true, weightedValue: true },
    }),
    prisma.deal.aggregate({
      _sum: { valueINR: true, weightedValue: true },
      where: { stage: { notIn: ["CLOSED_WON", "CLOSED_LOST"] } },
    }),
    prisma.toolCompletion.count({ where: { createdAt: { gte: sevenDaysAgo } } }),
    prisma.toolCompletion.count(),
    prisma.toolCompletion.count({ where: { premiumPurchased: true } }),
    prisma.emailSend.count({
      where: { sentAt: { gte: sevenDaysAgo, not: null } },
    }),
    prisma.publishedContent.count(),
    prisma.outreachCampaign.count({ where: { status: "ACTIVE" } }),
    prisma.tool.count({ where: { isActive: true } }),
    prisma.lead.findMany({
      orderBy: { createdAt: "desc" },
      take: 8,
      select: {
        id: true,
        email: true,
        firstName: true,
        tier: true,
        icp: true,
        stage: true,
        totalScore: true,
        createdAt: true,
        source: true,
      },
    }),
    prisma.leadActivity.findMany({
      orderBy: { createdAt: "desc" },
      take: 12,
      include: {
        lead: { select: { email: true, firstName: true } },
      },
    }),
    prisma.tool.findMany({
      where: { isActive: true },
      orderBy: { totalCompletions: "desc" },
      take: 5,
      select: { slug: true, name: true, totalCompletions: true, totalPremiumSales: true, icp: true },
    }),
    prisma.publishedContent.findMany({
      orderBy: { publishedAt: "desc" },
      take: 5,
      select: { slug: true, title: true, publishedAt: true },
    }),
  ]);

  return NextResponse.json({
    leads: {
      total: totalLeads,
      new7d: newLeads7d,
      new30d: newLeads30d,
      byTier: leadsByTier.map((b) => ({ tier: b.tier, count: b._count })),
      byStage: leadsByStage.map((b) => ({ stage: b.stage, count: b._count })),
    },
    accounts: { total: totalAccounts },
    contacts: { total: totalContacts },
    deals: {
      total: totalDeals,
      byStage: dealsByStage.map((b) => ({
        stage: b.stage,
        count: b._count,
        valueINR: b._sum.valueINR || 0,
        weightedValue: b._sum.weightedValue || 0,
      })),
      openPipelineValue: pipelineValue._sum.valueINR || 0,
      weightedPipelineValue: pipelineValue._sum.weightedValue || 0,
    },
    revenue: {
      premiumSales,
      // Estimate MRR from premium tool sales (one-time, so treat as monthly avg)
      estimatedRevenueINR: premiumSales * 300, // rough avg across tool prices
    },
    activity: {
      toolCompletions7d,
      totalToolCompletions,
      emailsSent7d,
    },
    content: {
      publishedPosts: totalPublishedContent,
      tools: totalToolsSeeded,
    },
    outreach: {
      activeCampaigns: totalActiveCampaigns,
    },
    recent: {
      leads: recentLeads,
      activities: recentActivities.map((a) => ({
        id: a.id,
        type: a.type,
        leadEmail: a.lead?.email,
        leadName: a.lead?.firstName,
        metadata: a.metadata,
        createdAt: a.createdAt,
      })),
      topTools,
      topContent,
    },
  });
}
