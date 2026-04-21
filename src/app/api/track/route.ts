import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";

const TrackSchema = z.object({
  anonymousId: z.string().min(10).max(100),
  path: z.string().min(1).max(500),
  title: z.string().max(500).optional(),
  referrer: z.string().max(500).optional(),
  timeOnPage: z.number().int().nonnegative().optional(),
  scrollDepth: z.number().int().min(0).max(100).optional(),
  utmSource: z.string().max(100).optional(),
  utmMedium: z.string().max(100).optional(),
  utmCampaign: z.string().max(100).optional(),
  leadEmail: z.string().email().optional(),
});

/**
 * POST /api/track — track a page view for attribution + engagement scoring.
 *
 * The client sends a beacon on page load + on page exit.
 * Server maintains Visitor and PageView records, and if the visitor becomes a lead,
 * the Visitor.leadId is set so we can compute first-touch attribution later.
 *
 * Non-blocking: always returns 200 to avoid slowing page navigation.
 */
export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false });
  }

  const parsed = TrackSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false });
  }

  const data = parsed.data;

  try {
    // Upsert Visitor — first touch captures UTMs, last touch updates timestamp
    const visitor = await prisma.visitor.upsert({
      where: { anonymousId: data.anonymousId },
      create: {
        anonymousId: data.anonymousId,
        firstReferrer: data.referrer,
        firstUtmSource: data.utmSource,
        firstUtmMedium: data.utmMedium,
        firstUtmCampaign: data.utmCampaign,
      },
      update: {
        lastSeenAt: new Date(),
      },
    });

    // If the visitor provided their lead email (post-capture), link it
    if (data.leadEmail && !visitor.leadId) {
      const lead = await prisma.lead.findUnique({ where: { email: data.leadEmail.toLowerCase() } });
      if (lead) {
        await prisma.visitor.update({ where: { id: visitor.id }, data: { leadId: lead.id } });

        // Log a page view activity on the lead's timeline
        await prisma.leadActivity.create({
          data: {
            leadId: lead.id,
            type: "PAGE_VIEW",
            metadata: { path: data.path, anonymousId: data.anonymousId },
          },
        });

        // Bump engagement score on every page view (capped at 100)
        await prisma.lead.update({
          where: { id: lead.id },
          data: {
            engagementScore: { increment: 2 },
          },
        });
      }
    }

    // Write the page view
    await prisma.pageView.create({
      data: {
        visitorId: visitor.id,
        path: data.path,
        title: data.title,
        referrer: data.referrer,
        timeOnPage: data.timeOnPage,
        scrollDepth: data.scrollDepth,
        utmSource: data.utmSource,
        utmMedium: data.utmMedium,
        utmCampaign: data.utmCampaign,
      },
    });
  } catch (err) {
    // Swallow errors — tracking must never break the user's experience
    console.error("[/api/track] failed:", err);
  }

  return NextResponse.json({ ok: true });
}
