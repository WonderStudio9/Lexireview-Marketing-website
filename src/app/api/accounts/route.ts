import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { isAuthenticated } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const authed = await isAuthenticated();
  if (!authed) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get("limit") || "50");
  const offset = parseInt(searchParams.get("offset") || "0");
  const tier = searchParams.get("tier");
  const icp = searchParams.get("icp");
  const industry = searchParams.get("industry");
  const search = searchParams.get("q");

  const where: Record<string, unknown> = {};
  if (tier) where.tier = tier;
  if (icp) where.icp = icp;
  if (industry) where.industry = { contains: industry, mode: "insensitive" };
  if (search)
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { domain: { contains: search, mode: "insensitive" } },
    ];

  const [accounts, total, byTier] = await Promise.all([
    prisma.account.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: limit,
      skip: offset,
      include: {
        _count: { select: { contacts: true, leads: true, deals: true } },
      },
    }),
    prisma.account.count({ where }),
    prisma.account.groupBy({ by: ["tier"], _count: true }),
  ]);

  return NextResponse.json({ accounts, total, limit, offset, byTier });
}

export async function POST(request: NextRequest) {
  const authed = await isAuthenticated();
  if (!authed) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await request.json().catch(() => ({}));
  const account = await prisma.account.create({
    data: {
      name: body.name,
      domain: body.domain?.toLowerCase(),
      industry: body.industry,
      tier: body.tier || "SMB",
      icp: body.icp || "UNKNOWN",
      city: body.city,
      state: body.state,
      country: body.country || "IN",
    },
  });
  return NextResponse.json(account, { status: 201 });
}
