import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

/**
 * POST /api/lead-magnets
 * Records a lead magnet download + bumps the leadMagnet download counter.
 * Used as a "commit" after the email gate + /api/lead capture succeeds.
 *
 * Body: { leadId: string, slug: string }
 */
export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  const { leadId, slug } = body as { leadId?: string; slug?: string };

  if (!leadId || !slug) {
    return NextResponse.json({ error: "leadId + slug required" }, { status: 400 });
  }

  // Find the lead magnet — create a record if it doesn't exist (seeded later)
  const magnet = await prisma.leadMagnet.findUnique({ where: { slug } });
  if (!magnet) {
    return NextResponse.json({ error: "Lead magnet not found" }, { status: 404 });
  }

  // Increment counter
  await prisma.leadMagnet.update({
    where: { slug },
    data: { totalDownloads: { increment: 1 } },
  });

  // Log activity on the lead's timeline
  await prisma.leadActivity
    .create({
      data: {
        leadId,
        type: "LEAD_MAGNET_DOWNLOADED",
        metadata: { slug, magnetTitle: magnet.title },
      },
    })
    .catch(() => {
      // Non-blocking
    });

  return NextResponse.json({ ok: true, magnetSlug: slug });
}
