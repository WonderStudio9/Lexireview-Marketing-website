import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { isAuthenticated } from "@/lib/auth";

/**
 * GET /api/stats — aggregated database counts for Settings > Database Stats tab.
 * Admin-only.
 */
export async function GET() {
  const authed = await isAuthenticated();
  if (!authed) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const [
    leadsTotal,
    leadsByTier,
    accountsTotal,
    contactsTotal,
    dealsTotal,
    dealsAgg,
    blogPublished,
    toolsTotal,
    toolsCompletionsAgg,
    sequencesTotal,
    templatesTotal,
    emailSendsTotal,
    campaignsTotal,
    campaignsByStatus,
  ] = await Promise.all([
    prisma.lead.count(),
    prisma.lead.groupBy({ by: ["tier"], _count: true }),
    prisma.account.count(),
    prisma.contact.count(),
    prisma.deal.count(),
    prisma.deal.aggregate({
      _sum: { valueINR: true, weightedValue: true },
    }),
    prisma.publishedContent.count(),
    prisma.tool.count(),
    prisma.tool.aggregate({ _sum: { totalCompletions: true } }),
    prisma.emailSequence.count(),
    prisma.emailTemplate.count(),
    prisma.emailSend.count({ where: { sentAt: { not: null } } }),
    prisma.outreachCampaign.count(),
    prisma.outreachCampaign.groupBy({ by: ["status"], _count: true }),
  ]);

  return NextResponse.json({
    leads: {
      total: leadsTotal,
      byTier: leadsByTier.map((r) => ({ tier: r.tier, count: r._count })),
    },
    accounts: { total: accountsTotal },
    contacts: { total: contactsTotal },
    deals: {
      total: dealsTotal,
      totalPipelineValue: dealsAgg._sum.valueINR ?? 0,
      weightedValue: dealsAgg._sum.weightedValue ?? 0,
    },
    blogPosts: { published: blogPublished },
    tools: {
      total: toolsTotal,
      totalCompletions: toolsCompletionsAgg._sum.totalCompletions ?? 0,
    },
    emails: {
      sequences: sequencesTotal,
      templates: templatesTotal,
      sent: emailSendsTotal,
    },
    campaigns: {
      total: campaignsTotal,
      byStatus: campaignsByStatus.map((r) => ({ status: r.status, count: r._count })),
      active: campaignsByStatus.find((r) => r.status === "ACTIVE")?._count ?? 0,
    },
  });
}
