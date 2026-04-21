import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { isAuthenticated } from "@/lib/auth";

/**
 * GET /api/leads — list all captured leads for the Forge dashboard.
 * Requires admin auth.
 */
export async function GET(request: NextRequest) {
  const authed = await isAuthenticated();
  if (!authed) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get("limit") || "100");
  const offset = parseInt(searchParams.get("offset") || "0");
  const tier = searchParams.get("tier");
  const stage = searchParams.get("stage");

  const where: Record<string, unknown> = {};
  if (tier) where.tier = tier;
  if (stage) where.stage = stage;

  const [leads, total, stats] = await Promise.all([
    prisma.lead.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: limit,
      skip: offset,
    }),
    prisma.lead.count({ where }),
    prisma.lead.groupBy({
      by: ["tier"],
      _count: true,
    }),
  ]);

  return NextResponse.json({ leads, total, limit, offset, stats });
}
