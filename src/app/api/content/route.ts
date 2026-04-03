import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { isAuthenticated } from "@/lib/auth";
import { runPipeline } from "@/lib/agents/pipeline";

export async function GET() {
  const authed = await isAuthenticated();
  if (!authed) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const briefs = await prisma.contentBrief.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      drafts: { orderBy: { createdAt: "desc" }, take: 1 },
      published: true,
    },
  });

  return NextResponse.json(briefs);
}

export async function POST(request: NextRequest) {
  const authed = await isAuthenticated();
  if (!authed) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const { topic, icp, channel, funnelStage, cluster, keywords, autoGenerate } = body;

  const brief = await prisma.contentBrief.create({
    data: {
      topic,
      icp,
      channel: channel || "BLOG",
      funnelStage: funnelStage || "TOFU",
      cluster: cluster || "general",
      keywords: keywords || [],
    },
  });

  if (autoGenerate) {
    // Run pipeline in background (don't await)
    runPipeline(brief.id).catch((err) => {
      console.error(`Pipeline failed for brief ${brief.id}:`, err);
    });
  }

  return NextResponse.json(brief, { status: 201 });
}
