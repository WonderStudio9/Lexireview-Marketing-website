import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { isAuthenticated } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const authed = await isAuthenticated();
  if (!authed) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get("limit") || "50");
  const offset = parseInt(searchParams.get("offset") || "0");
  const accountId = searchParams.get("accountId");
  const search = searchParams.get("q");

  const where: Record<string, unknown> = {};
  if (accountId) where.accountId = accountId;
  if (search)
    where.OR = [
      { firstName: { contains: search, mode: "insensitive" } },
      { lastName: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
      { title: { contains: search, mode: "insensitive" } },
    ];

  const [contacts, total] = await Promise.all([
    prisma.contact.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: limit,
      skip: offset,
      include: { account: { select: { name: true, domain: true } } },
    }),
    prisma.contact.count({ where }),
  ]);

  return NextResponse.json({ contacts, total, limit, offset });
}

export async function POST(request: NextRequest) {
  const authed = await isAuthenticated();
  if (!authed) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await request.json().catch(() => ({}));
  const contact = await prisma.contact.create({
    data: {
      accountId: body.accountId,
      firstName: body.firstName,
      lastName: body.lastName,
      email: body.email?.toLowerCase(),
      title: body.title,
      linkedinUrl: body.linkedinUrl,
      seniority: body.seniority,
      department: body.department,
    },
  });
  return NextResponse.json(contact, { status: 201 });
}
