/**
 * Bulk-enroll contacts into an OutreachCampaign.
 *
 * POST /api/campaigns/:id/enroll
 *   body: { contactIds: string[] }
 *
 * Creates OutreachProspect rows via `startCadence` (which also schedules the
 * first touch). Idempotent — existing prospects are returned as
 * alreadyEnrolled.
 */
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { isAuthenticated } from "@/lib/auth";
import { startCadence } from "@/lib/outbound/cadence";

const schema = z.object({
  contactIds: z.array(z.string().min(1)).min(1).max(5000),
});

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const authed = await isAuthenticated();
  if (!authed) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id: campaignId } = await context.params;
  const campaign = await prisma.outreachCampaign.findUnique({
    where: { id: campaignId },
  });
  if (!campaign) {
    return NextResponse.json({ error: "Campaign not found" }, { status: 404 });
  }

  const body = (await req.json().catch(() => null)) as unknown;
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid payload", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const results: { contactId: string; prospectId: string; alreadyEnrolled: boolean }[] = [];
  const errors: { contactId: string; error: string }[] = [];

  for (const contactId of parsed.data.contactIds) {
    try {
      const { prospectId, alreadyEnrolled } = await startCadence(campaignId, contactId);
      results.push({ contactId, prospectId, alreadyEnrolled: Boolean(alreadyEnrolled) });
    } catch (err) {
      errors.push({
        contactId,
        error: err instanceof Error ? err.message : "Unknown error",
      });
    }
  }

  await prisma.outreachCampaign.update({
    where: { id: campaignId },
    data: {
      targetCount: {
        increment: results.filter((r) => !r.alreadyEnrolled).length,
      },
    },
  });

  return NextResponse.json({
    enrolled: results.filter((r) => !r.alreadyEnrolled).length,
    alreadyEnrolled: results.filter((r) => r.alreadyEnrolled).length,
    errors,
    results,
  });
}
