import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const completion = await prisma.toolCompletion.findUnique({
    where: { id },
    select: {
      id: true,
      premiumPurchased: true,
      razorpayPaymentId: true,
      tool: { select: { slug: true, name: true, premiumPrice: true } },
      createdAt: true,
    },
  });
  if (!completion) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(completion);
}
