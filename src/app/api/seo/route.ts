import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { isAuthenticated } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const authed = await isAuthenticated();
  if (!authed) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type") || "keywords";

  if (type === "keywords") {
    const keywords = await prisma.keyword.findMany({
      orderBy: [{ cluster: "asc" }, { keyword: "asc" }],
      include: {
        snapshots: { orderBy: { checkedAt: "desc" }, take: 7 },
      },
    });

    const clusters = keywords.reduce(
      (acc, kw) => {
        if (!acc[kw.cluster]) acc[kw.cluster] = [];
        acc[kw.cluster].push(kw);
        return acc;
      },
      {} as Record<string, typeof keywords>
    );

    const stats = {
      totalKeywords: keywords.length,
      rankingTop10: keywords.filter((k) => k.currentRank && k.currentRank <= 10).length,
      rankingTop50: keywords.filter((k) => k.currentRank && k.currentRank <= 50).length,
      notRanking: keywords.filter((k) => !k.currentRank).length,
    };

    return NextResponse.json({ clusters, stats });
  }

  if (type === "citations") {
    const citations = await prisma.aiCitation.findMany({
      orderBy: { checkedAt: "desc" },
      take: 100,
    });

    const byEngine = citations.reduce(
      (acc, c) => {
        if (!acc[c.engine]) acc[c.engine] = { total: 0, cited: 0 };
        acc[c.engine].total++;
        if (c.cited) acc[c.engine].cited++;
        return acc;
      },
      {} as Record<string, { total: number; cited: number }>
    );

    return NextResponse.json({ citations, byEngine });
  }

  return NextResponse.json({ error: "Invalid type" }, { status: 400 });
}
