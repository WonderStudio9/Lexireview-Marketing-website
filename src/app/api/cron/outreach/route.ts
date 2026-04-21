/**
 * Cadence cron worker.
 *
 * Runs every 15 minutes. Picks up all ACTIVE OutreachProspect rows whose
 * nextTouchAt has elapsed and sends the next touch via sendNextTouch.
 *
 * Authorization: ?secret=<CRON_SECRET> query param.
 *
 * Global safety: we enforce a per-run cap of 200 sends per FROM inbox to
 * mirror the documented industry best practice (and deliverability advice).
 */
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { sendNextTouch } from "@/lib/outbound/cadence";

const BATCH_SIZE = 50;
const MAX_PER_INBOX_PER_RUN = 200;

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const expected = process.env.CRON_SECRET;
  const provided = req.nextUrl.searchParams.get("secret");
  if (!expected) {
    return NextResponse.json(
      { error: "CRON_SECRET not configured" },
      { status: 503 },
    );
  }
  if (provided !== expected) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();
  const prospects = await prisma.outreachProspect.findMany({
    where: {
      status: "ACTIVE",
      nextTouchAt: { lte: now },
    },
    orderBy: { nextTouchAt: "asc" },
    take: BATCH_SIZE,
  });

  let sent = 0;
  let skipped = 0;
  let failed = 0;
  let rateLimited = 0;
  const errors: string[] = [];
  const perInboxCount: Record<string, number> = {};

  for (const prospect of prospects) {
    // Soft cap: prevent a single run from blasting past the daily ceiling.
    const inbox = process.env.OUTREACH_FROM_EMAIL || "hello@lexireview-outreach.com";
    const count = perInboxCount[inbox] ?? 0;
    if (count >= MAX_PER_INBOX_PER_RUN) {
      skipped++;
      continue;
    }

    const result = await sendNextTouch(prospect.id).catch((err: unknown) => {
      errors.push(err instanceof Error ? err.message : "unknown");
      return null;
    });

    if (!result) {
      failed++;
      continue;
    }
    if (result.sent) {
      sent++;
      perInboxCount[inbox] = count + 1;
    } else if (result.skipped) {
      skipped++;
      if (result.reason === "rate-limited") rateLimited++;
    } else {
      failed++;
      if (result.result?.error) errors.push(result.result.error);
    }
  }

  return NextResponse.json({
    ok: true,
    processed: prospects.length,
    sent,
    skipped,
    failed,
    rateLimited,
    errors: errors.slice(0, 10),
    ranAt: now.toISOString(),
  });
}
