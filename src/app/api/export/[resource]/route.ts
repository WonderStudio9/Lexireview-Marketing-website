import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { isAuthenticated } from "@/lib/auth";

type CsvValue = string | number | boolean | Date | null | undefined;

/**
 * Escape a single CSV cell per RFC 4180.
 */
function csvCell(value: CsvValue): string {
  if (value === null || value === undefined) return "";
  let str: string;
  if (value instanceof Date) str = value.toISOString();
  else str = String(value);

  if (/[",\n\r]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

function toCsv(headers: string[], rows: CsvValue[][]): string {
  const lines = [headers.map(csvCell).join(",")];
  for (const row of rows) lines.push(row.map(csvCell).join(","));
  return lines.join("\r\n");
}

const RESOURCES = new Set(["leads", "accounts", "contacts", "deals"]);

/**
 * GET /api/export/[resource]?format=csv
 * Streams a CSV of the requested resource. Admin-only.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ resource: string }> },
) {
  const authed = await isAuthenticated();
  if (!authed) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { resource } = await params;
  if (!RESOURCES.has(resource)) {
    return NextResponse.json({ error: "Unknown resource" }, { status: 404 });
  }

  const format = new URL(request.url).searchParams.get("format") ?? "csv";
  if (format !== "csv") {
    return NextResponse.json({ error: "Only csv format supported" }, { status: 400 });
  }

  let csv: string;
  let filename: string;

  if (resource === "leads") {
    const rows = await prisma.lead.findMany({
      orderBy: { createdAt: "desc" },
    });
    csv = toCsv(
      [
        "id",
        "email",
        "firstName",
        "lastName",
        "phone",
        "tier",
        "icp",
        "stage",
        "language",
        "source",
        "totalScore",
        "icpFitScore",
        "intentScore",
        "engagementScore",
        "utmSource",
        "utmMedium",
        "utmCampaign",
        "createdAt",
      ],
      rows.map((r) => [
        r.id,
        r.email,
        r.firstName,
        r.lastName,
        r.phone,
        r.tier,
        r.icp,
        r.stage,
        r.language,
        r.source,
        r.totalScore,
        r.icpFitScore,
        r.intentScore,
        r.engagementScore,
        r.utmSource,
        r.utmMedium,
        r.utmCampaign,
        r.createdAt,
      ]),
    );
    filename = "leads.csv";
  } else if (resource === "accounts") {
    const rows = await prisma.account.findMany({
      orderBy: { createdAt: "desc" },
    });
    csv = toCsv(
      [
        "id",
        "name",
        "domain",
        "industry",
        "subIndustry",
        "employees",
        "revenueRange",
        "city",
        "state",
        "country",
        "tier",
        "icp",
        "website",
        "linkedinUrl",
        "createdAt",
      ],
      rows.map((r) => [
        r.id,
        r.name,
        r.domain,
        r.industry,
        r.subIndustry,
        r.employees,
        r.revenueRange,
        r.city,
        r.state,
        r.country,
        r.tier,
        r.icp,
        r.website,
        r.linkedinUrl,
        r.createdAt,
      ]),
    );
    filename = "accounts.csv";
  } else if (resource === "contacts") {
    const rows = await prisma.contact.findMany({
      orderBy: { createdAt: "desc" },
      include: { account: { select: { name: true } } },
    });
    csv = toCsv(
      [
        "id",
        "firstName",
        "lastName",
        "email",
        "phone",
        "title",
        "seniority",
        "department",
        "linkedinUrl",
        "accountId",
        "accountName",
        "createdAt",
      ],
      rows.map((r) => [
        r.id,
        r.firstName,
        r.lastName,
        r.email,
        r.phone,
        r.title,
        r.seniority,
        r.department,
        r.linkedinUrl,
        r.accountId,
        r.account?.name,
        r.createdAt,
      ]),
    );
    filename = "contacts.csv";
  } else {
    // deals
    const rows = await prisma.deal.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        account: { select: { name: true } },
        primaryLead: { select: { email: true } },
      },
    });
    csv = toCsv(
      [
        "id",
        "name",
        "stage",
        "valueINR",
        "probability",
        "weightedValue",
        "expectedCloseDate",
        "actualCloseDate",
        "accountId",
        "accountName",
        "primaryLeadEmail",
        "createdAt",
      ],
      rows.map((r) => [
        r.id,
        r.name,
        r.stage,
        r.valueINR,
        r.probability,
        r.weightedValue,
        r.expectedCloseDate,
        r.actualCloseDate,
        r.accountId,
        r.account?.name,
        r.primaryLead?.email,
        r.createdAt,
      ]),
    );
    filename = "deals.csv";
  }

  // Prepend UTF-8 BOM so Excel opens non-ASCII correctly.
  const body = "\ufeff" + csv;

  return new NextResponse(body, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}
