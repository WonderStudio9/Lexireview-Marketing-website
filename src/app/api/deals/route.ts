import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { isAuthenticated } from "@/lib/auth";
import { z } from "zod";

export async function GET(request: NextRequest) {
  const authed = await isAuthenticated();
  if (!authed) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const stage = searchParams.get("stage");
  const where: Record<string, unknown> = {};
  if (stage) where.stage = stage;

  const [deals, byStage] = await Promise.all([
    prisma.deal.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        account: { select: { name: true, tier: true, icp: true } },
        primaryLead: { select: { email: true, firstName: true } },
        _count: { select: { notes: true, proposals: true } },
      },
    }),
    prisma.deal.groupBy({
      by: ["stage"],
      _count: true,
      _sum: { valueINR: true, weightedValue: true },
    }),
  ]);

  return NextResponse.json({ deals, byStage });
}

const CreateSchema = z.object({
  name: z.string().min(1),
  accountId: z.string().min(1),
  primaryLeadId: z.string().optional(),
  stage: z.enum(["DISCOVERY","DEMO_SCHEDULED","DEMO_DONE","POC","PROPOSAL","NEGOTIATION","CLOSED_WON","CLOSED_LOST"]).optional(),
  valueINR: z.number().int().nonnegative().optional(),
  probability: z.number().int().min(0).max(100).optional(),
  expectedCloseDate: z.string().optional(),
});

export async function POST(request: NextRequest) {
  const authed = await isAuthenticated();
  if (!authed) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json().catch(() => ({}));
  const parsed = CreateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed", issues: parsed.error.issues }, { status: 400 });
  }

  const data = parsed.data;
  const valueINR = data.valueINR ?? 0;
  const probability = data.probability ?? 10;

  const deal = await prisma.deal.create({
    data: {
      name: data.name,
      accountId: data.accountId,
      primaryLeadId: data.primaryLeadId,
      stage: data.stage ?? "DISCOVERY",
      valueINR,
      probability,
      weightedValue: Math.round((valueINR * probability) / 100),
      expectedCloseDate: data.expectedCloseDate ? new Date(data.expectedCloseDate) : undefined,
    },
  });
  return NextResponse.json(deal, { status: 201 });
}
