import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { isAuthenticated } from "@/lib/auth";
import { runPipeline, publishContent } from "@/lib/agents/pipeline";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authed = await isAuthenticated();
  if (!authed) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  const brief = await prisma.contentBrief.findUnique({
    where: { id },
    include: {
      drafts: { orderBy: { createdAt: "desc" } },
      agentLogs: { orderBy: { createdAt: "desc" } },
      published: true,
    },
  });

  if (!brief) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json(brief);
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authed = await isAuthenticated();
  if (!authed) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await request.json();

  if (body.action === "generate") {
    runPipeline(id).catch((err) => {
      console.error(`Pipeline failed for brief ${id}:`, err);
    });
    return NextResponse.json({ message: "Pipeline started" });
  }

  if (body.action === "publish") {
    const published = await publishContent(id);
    return NextResponse.json(published);
  }

  const updated = await prisma.contentBrief.update({
    where: { id },
    data: body,
  });

  return NextResponse.json(updated);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authed = await isAuthenticated();
  if (!authed) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  await prisma.contentBrief.delete({ where: { id } });

  return NextResponse.json({ message: "Deleted" });
}
