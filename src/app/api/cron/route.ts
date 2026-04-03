import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { isAuthenticated } from "@/lib/auth";

export async function GET() {
  const authed = await isAuthenticated();
  if (!authed) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const jobs = await prisma.cronJob.findMany({
    orderBy: { name: "asc" },
  });

  return NextResponse.json(jobs);
}

export async function PATCH(request: NextRequest) {
  const authed = await isAuthenticated();
  if (!authed) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id, enabled } = await request.json();

  const job = await prisma.cronJob.update({
    where: { id },
    data: { enabled },
  });

  return NextResponse.json(job);
}
