import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { isAuthenticated } from "@/lib/auth";
import { z } from "zod";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const authed = await isAuthenticated();
  if (!authed) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const deal = await prisma.deal.findUnique({
    where: { id },
    include: {
      account: true,
      primaryLead: { include: { activities: { orderBy: { createdAt: "desc" }, take: 30 } } },
      notes: { orderBy: { createdAt: "desc" } },
      proposals: { orderBy: { version: "desc" } },
    },
  });
  if (!deal) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(deal);
}

const PatchSchema = z.object({
  name: z.string().optional(),
  stage: z.enum(["DISCOVERY","DEMO_SCHEDULED","DEMO_DONE","POC","PROPOSAL","NEGOTIATION","CLOSED_WON","CLOSED_LOST"]).optional(),
  valueINR: z.number().int().nonnegative().optional(),
  probability: z.number().int().min(0).max(100).optional(),
  expectedCloseDate: z.string().nullable().optional(),
  lossReason: z.string().optional(),
  reasonNote: z.string().optional(),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const authed = await isAuthenticated();
  if (!authed) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const body = await request.json().catch(() => ({}));
  const parsed = PatchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed", issues: parsed.error.issues }, { status: 400 });
  }
  const data = parsed.data;

  const existing = await prisma.deal.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const patch: Record<string, unknown> = {};
  if (data.name !== undefined) patch.name = data.name;
  if (data.valueINR !== undefined) patch.valueINR = data.valueINR;
  if (data.probability !== undefined) patch.probability = data.probability;
  if (data.expectedCloseDate !== undefined)
    patch.expectedCloseDate = data.expectedCloseDate ? new Date(data.expectedCloseDate) : null;
  if (data.lossReason !== undefined) patch.lossReason = data.lossReason;
  if (data.stage && data.stage !== existing.stage) {
    patch.stage = data.stage;
    patch.stageChangedAt = new Date();
    if (data.stage === "CLOSED_WON" || data.stage === "CLOSED_LOST") {
      patch.actualCloseDate = new Date();
    }
  }
  const v = (patch.valueINR as number | undefined) ?? existing.valueINR;
  const p = (patch.probability as number | undefined) ?? existing.probability;
  patch.weightedValue = Math.round((v * p) / 100);

  const updated = await prisma.deal.update({ where: { id }, data: patch });

  // Record stage change as note
  if (data.stage && data.stage !== existing.stage) {
    await prisma.dealNote.create({
      data: {
        dealId: id,
        content: `Stage: ${existing.stage} → ${data.stage}${data.reasonNote ? ` — ${data.reasonNote}` : ""}`,
      },
    });
  }

  return NextResponse.json(updated);
}
