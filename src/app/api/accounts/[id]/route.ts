import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { isAuthenticated } from "@/lib/auth";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const authed = await isAuthenticated();
  if (!authed) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const account = await prisma.account.findUnique({
    where: { id },
    include: {
      contacts: { orderBy: { createdAt: "desc" } },
      leads: { orderBy: { createdAt: "desc" }, take: 50 },
      deals: { orderBy: { createdAt: "desc" } },
    },
  });
  if (!account) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(account);
}
