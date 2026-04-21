/**
 * Campaign CRUD.
 *
 * POST /api/campaigns — create an OutreachCampaign (+ optional steps).
 *   Accepts an optional `createOnSmartlead` flag which will also call
 *   SmartLead.createCampaign so the remote campaign id is stored as a note
 *   on the description field.
 *
 * GET /api/campaigns — list campaigns with rollups. Auth required.
 */
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { isAuthenticated } from "@/lib/auth";
import { createCampaign as createSmartleadCampaign } from "@/lib/outbound/smartlead";

const ICP_VALUES = [
  "TENANT_LANDLORD",
  "HOME_BUYER",
  "EMPLOYEE",
  "FREELANCER",
  "MSME_OWNER",
  "CONTENT_CREATOR",
  "STARTUP_FOUNDER_EARLY",
  "NRI",
  "CONSUMER_DISPUTE",
  "SENIOR_CITIZEN",
  "STUDENT",
  "COUPLE",
  "FARMER",
  "SOLO_LAWYER",
  "SMALL_LAW_FIRM",
  "STARTUP_FOUNDER",
  "SME_OWNER",
  "CA_TAX_CONSULTANT",
  "HR_CONSULTANT",
  "FRACTIONAL_GC",
  "MID_TIER_LAW_FIRM",
  "IN_HOUSE_LEGAL_TEAM",
  "MID_NBFC",
  "RE_DEVELOPER",
  "INSURANCE_COMPANY",
  "PE_VC_FIRM",
  "PROCUREMENT_HEAD",
  "TIER1_LAW_FIRM",
  "LISTED_COMPANY",
  "LARGE_NBFC",
  "LARGE_BANK",
  "FINTECH_UNICORN",
  "BIG4_CONSULTING",
  "MNC_INDIA_OPS",
  "CENTRAL_GOVT",
  "STATE_GOVT",
  "PSU",
  "REGULATOR",
  "COURT_TRIBUNAL",
  "UNKNOWN",
] as const;

const stepSchema = z.object({
  order: z.number().int().min(0),
  dayOffset: z.number().int().min(0),
  channel: z.enum(["EMAIL", "LINKEDIN", "WHATSAPP", "MULTI_TOUCH"]),
  subject: z.string().optional(),
  bodyTemplate: z.string().min(1),
  conditions: z.record(z.unknown()).optional(),
});

const createSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  targetICP: z.enum(ICP_VALUES),
  channel: z.enum(["EMAIL", "LINKEDIN", "WHATSAPP", "MULTI_TOUCH"]),
  targetCount: z.number().int().min(0).optional(),
  steps: z.array(stepSchema).optional(),
  createOnSmartlead: z.boolean().optional(),
  inboxes: z.array(z.string()).optional(),
});

export async function POST(req: NextRequest) {
  const authed = await isAuthenticated();
  if (!authed) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await req.json().catch(() => null)) as unknown;
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid payload", details: parsed.error.flatten() },
      { status: 400 },
    );
  }
  const input = parsed.data;

  let smartleadNote = input.description ?? "";
  if (input.createOnSmartlead) {
    const result = await createSmartleadCampaign(
      input.name,
      input.inboxes ?? [],
      {},
    );
    smartleadNote = `${smartleadNote}\nsmartleadCampaignId=${result.smartleadCampaignId}`.trim();
  }

  const campaign = await prisma.outreachCampaign.create({
    data: {
      name: input.name,
      description: smartleadNote,
      targetICP: input.targetICP,
      channel: input.channel,
      targetCount: input.targetCount ?? 0,
      steps: input.steps
        ? {
            create: input.steps.map((s) => ({
              order: s.order,
              dayOffset: s.dayOffset,
              channel: s.channel,
              subject: s.subject,
              bodyTemplate: s.bodyTemplate,
              conditions: s.conditions as unknown as Prisma.InputJsonValue | undefined,
            })),
          }
        : undefined,
    },
    include: { steps: { orderBy: { order: "asc" } } },
  });

  return NextResponse.json(campaign, { status: 201 });
}

export async function GET() {
  const authed = await isAuthenticated();
  if (!authed) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const campaigns = await prisma.outreachCampaign.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      steps: { orderBy: { order: "asc" } },
      _count: { select: { prospects: true } },
    },
  });

  return NextResponse.json(campaigns);
}
