import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { isAuthenticated } from "@/lib/auth";

/**
 * GET /api/search?q=<query>
 * Runs 5 concurrent Prisma searches across leads, accounts, contacts, deals and
 * published blog posts. Admin-only. Query must be at least 2 chars.
 */
export async function GET(request: NextRequest) {
  const authed = await isAuthenticated();
  if (!authed) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const q = (new URL(request.url).searchParams.get("q") ?? "").trim();
  if (q.length < 2) {
    return NextResponse.json({
      leads: [],
      accounts: [],
      contacts: [],
      deals: [],
      blogPosts: [],
    });
  }

  const take = 5;
  const contains = { contains: q, mode: "insensitive" as const };

  const [leads, accounts, contacts, deals, blogPosts] = await Promise.all([
    prisma.lead.findMany({
      where: {
        OR: [
          { email: contains },
          { firstName: contains },
          { lastName: contains },
        ],
      },
      select: { id: true, email: true, tier: true, firstName: true, lastName: true },
      take,
    }),
    prisma.account.findMany({
      where: {
        OR: [{ name: contains }, { domain: contains }],
      },
      select: { id: true, name: true, domain: true, tier: true },
      take,
    }),
    prisma.contact.findMany({
      where: {
        OR: [
          { firstName: contains },
          { lastName: contains },
          { email: contains },
        ],
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        title: true,
      },
      take,
    }),
    prisma.deal.findMany({
      where: { name: contains },
      select: { id: true, name: true, stage: true, valueINR: true },
      take,
    }),
    prisma.publishedContent.findMany({
      where: {
        OR: [{ title: contains }, { slug: contains }],
      },
      select: { id: true, slug: true, title: true },
      take,
    }),
  ]);

  return NextResponse.json({ leads, accounts, contacts, deals, blogPosts });
}
