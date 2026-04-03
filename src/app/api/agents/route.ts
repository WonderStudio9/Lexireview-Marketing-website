import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { isAuthenticated } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const authed = await isAuthenticated();
  if (!authed) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const agentName = searchParams.get("agent");
  const briefId = searchParams.get("briefId");
  const limit = parseInt(searchParams.get("limit") || "50");
  const offset = parseInt(searchParams.get("offset") || "0");

  const where: Record<string, unknown> = {};
  if (agentName) where.agentName = agentName;
  if (briefId) where.briefId = briefId;

  const [logs, total] = await Promise.all([
    prisma.agentLog.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: limit,
      skip: offset,
      include: { brief: { select: { topic: true, status: true } } },
    }),
    prisma.agentLog.count({ where }),
  ]);

  return NextResponse.json({ logs, total, limit, offset });
}
