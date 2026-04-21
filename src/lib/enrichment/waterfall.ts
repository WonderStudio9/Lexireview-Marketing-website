/**
 * Enrichment waterfall: tries cheap sources first, falls through to expensive.
 *
 * Strategy:
 *   1. Hunter.io (~$49/mo) — email finder + domain lookup
 *   2. Apollo.io (~$99/mo) — firmographics + contacts
 *   3. (Future: Clay, Clearbit, ZoomInfo)
 *
 * Each step: if result found, stop + save. If not, try next.
 *
 * Records the result into Account.enrichmentData with a `source` tag so
 * we can audit which tool produced each fact.
 */

import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { enrichOrganization, findContactsInOrg } from "./apollo";
import { findEmail, verifyEmail } from "./hunter";

export interface WaterfallResult {
  accountId: string;
  account: {
    name: string;
    domain?: string | null;
    enriched: boolean;
  };
  sources: string[];
  contactsFound: number;
  error?: string;
}

/**
 * Enrich a single Account end-to-end.
 * Finds firmographics + up to 10 contacts with key roles.
 */
export async function enrichAccount(accountId: string): Promise<WaterfallResult> {
  const account = await prisma.account.findUnique({ where: { id: accountId } });
  if (!account) {
    return {
      accountId,
      account: { name: "", enriched: false },
      sources: [],
      contactsFound: 0,
      error: "Account not found",
    };
  }

  if (!account.domain) {
    return {
      accountId,
      account: { name: account.name, domain: null, enriched: false },
      sources: [],
      contactsFound: 0,
      error: "No domain for enrichment lookup",
    };
  }

  const sources: string[] = [];
  const existingData = (account.enrichmentData as Prisma.JsonObject | null) || {};
  let enrichedData: Record<string, unknown> = { ...existingData };
  let contactsFound = 0;

  // Step 1: Apollo organization enrichment
  const org = await enrichOrganization(account.domain);
  if (org) {
    sources.push("apollo");
    enrichedData = { ...enrichedData, apollo: JSON.parse(JSON.stringify(org)) };
    await prisma.account.update({
      where: { id: accountId },
      data: {
        industry: org.industry || account.industry,
        employees: org.employees || account.employees,
        linkedinUrl: org.linkedin || account.linkedinUrl,
        revenueRange: org.revenue || account.revenueRange,
        enrichmentData: enrichedData as Prisma.InputJsonValue,
      },
    });
  }

  // Step 2: Apollo contacts (for key decision-maker roles)
  const DECISION_MAKER_TITLES = [
    "General Counsel",
    "CEO",
    "CFO",
    "COO",
    "Chief Compliance Officer",
    "Head of Legal",
    "Legal Head",
    "Managing Partner",
    "Senior Partner",
    "CTO",
    "VP Legal",
    "Director Legal",
  ];

  const contacts = await findContactsInOrg({
    domain: account.domain,
    titles: DECISION_MAKER_TITLES,
    seniority: ["vp", "director", "c_suite", "partner"],
    limit: 10,
  });

  for (const person of contacts) {
    if (!person.email && !person.linkedin) continue;

    // Upsert by email (if present) or linkedin
    const lookupKey = person.email?.toLowerCase();
    let existing = null;
    if (lookupKey) {
      existing = await prisma.contact.findFirst({
        where: { email: lookupKey, accountId: accountId },
      });
    }

    if (existing) {
      await prisma.contact.update({
        where: { id: existing.id },
        data: {
          firstName: person.firstName || existing.firstName,
          lastName: person.lastName || existing.lastName,
          title: person.title || existing.title,
          linkedinUrl: person.linkedin || existing.linkedinUrl,
          phone: person.phone || existing.phone,
          seniority: person.seniority || existing.seniority,
          department: person.department || existing.department,
        },
      });
    } else if (person.firstName) {
      await prisma.contact.create({
        data: {
          accountId,
          firstName: person.firstName,
          lastName: person.lastName,
          email: lookupKey,
          title: person.title,
          linkedinUrl: person.linkedin,
          phone: person.phone,
          seniority: person.seniority,
          department: person.department,
        },
      });
      contactsFound++;
    }
  }

  // Step 3: Hunter fallback — if Apollo returned 0 contacts, try to find at least
  // one email via Hunter.io using generic first names for key roles
  if (contactsFound === 0 && sources.length === 0) {
    const found = await findEmail({ domain: account.domain });
    if (found?.email) {
      sources.push("hunter");

      // Verify the email before committing
      const verify = await verifyEmail(found.email);
      if (!verify || verify.valid || verify.score > 50) {
        await prisma.contact.create({
          data: {
            accountId,
            firstName: found.firstName || "Unknown",
            lastName: found.lastName,
            email: found.email.toLowerCase(),
            title: found.position,
            linkedinUrl: found.linkedin,
            phone: found.phoneNumber,
            seniority: found.seniority,
            department: found.department,
          },
        });
        contactsFound++;
        enrichedData = { ...enrichedData, hunter: JSON.parse(JSON.stringify(found)) };
        await prisma.account.update({
          where: { id: accountId },
          data: { enrichmentData: enrichedData as Prisma.InputJsonValue },
        });
      }
    }
  }

  return {
    accountId,
    account: {
      name: account.name,
      domain: account.domain,
      enriched: sources.length > 0,
    },
    sources,
    contactsFound,
  };
}

/**
 * Batch enrich — useful for cron or admin trigger.
 * Enriches up to `limit` unenriched accounts.
 */
export async function enrichUnenrichedAccounts(limit: number = 20): Promise<{
  processed: number;
  totalEnriched: number;
  totalContactsAdded: number;
}> {
  const accounts = await prisma.account.findMany({
    where: { enrichmentData: { equals: null as never } },
    take: limit,
  });

  let totalEnriched = 0;
  let totalContactsAdded = 0;
  for (const a of accounts) {
    const r = await enrichAccount(a.id);
    if (r.sources.length > 0) totalEnriched++;
    totalContactsAdded += r.contactsFound;
  }

  return {
    processed: accounts.length,
    totalEnriched,
    totalContactsAdded,
  };
}
