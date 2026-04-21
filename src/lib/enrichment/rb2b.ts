/**
 * RB2B reverse IP lookup integration.
 *
 * RB2B identifies anonymous B2B website visitors by their company.
 * Free tier: 100 identifications/month.
 *
 * Integration: RB2B sends webhook POSTs to /api/webhooks/rb2b when
 * a visitor is identified. This module provides the handler.
 */

import { prisma } from "@/lib/db";

export interface RB2BWebhookPayload {
  identifiedAt: string; // ISO
  person: {
    firstName?: string;
    lastName?: string;
    linkedinUrl?: string;
    email?: string;
    title?: string;
    seniority?: string;
  };
  company: {
    name: string;
    domain?: string;
    industry?: string;
    employees?: number;
    revenue?: string;
    linkedinUrl?: string;
    city?: string;
    state?: string;
    country?: string;
  };
  session: {
    visitorId: string;
    referrer?: string;
    utmSource?: string;
    pagesViewed?: string[];
    timeOnSite?: number;
  };
}

/**
 * Handle an RB2B webhook — creates/updates Account + Contact + links
 * to the Visitor anonymous session if present.
 */
export async function handleRb2bWebhook(payload: RB2BWebhookPayload): Promise<{
  accountId: string;
  contactId?: string;
  visitorLinked: boolean;
}> {
  const domain = payload.company.domain?.toLowerCase();

  // Upsert account
  let account;
  if (domain) {
    const existing = await prisma.account.findUnique({ where: { domain } });
    if (existing) {
      account = await prisma.account.update({
        where: { id: existing.id },
        data: {
          name: payload.company.name || existing.name,
          industry: payload.company.industry || existing.industry,
          employees: payload.company.employees || existing.employees,
          revenueRange: payload.company.revenue || existing.revenueRange,
          linkedinUrl: payload.company.linkedinUrl || existing.linkedinUrl,
          city: payload.company.city || existing.city,
          state: payload.company.state || existing.state,
          country: payload.company.country || existing.country || "IN",
          enrichmentData: {
            ...((existing.enrichmentData as Record<string, unknown>) || {}),
            rb2b: { lastSeen: payload.identifiedAt },
          },
        },
      });
    } else {
      account = await prisma.account.create({
        data: {
          name: payload.company.name,
          domain,
          industry: payload.company.industry,
          employees: payload.company.employees,
          revenueRange: payload.company.revenue,
          linkedinUrl: payload.company.linkedinUrl,
          city: payload.company.city,
          state: payload.company.state,
          country: payload.company.country || "IN",
          tier: inferTier(payload.company.employees),
          icp: "UNKNOWN",
          enrichmentData: { rb2b: { firstSeen: payload.identifiedAt } },
        },
      });
    }
  } else {
    account = await prisma.account.create({
      data: {
        name: payload.company.name,
        country: "IN",
        tier: inferTier(payload.company.employees),
        icp: "UNKNOWN",
        enrichmentData: { rb2b: { firstSeen: payload.identifiedAt } },
      },
    });
  }

  // Upsert contact if person data present
  let contactId: string | undefined;
  if (payload.person.firstName) {
    const email = payload.person.email?.toLowerCase();
    const existing = email
      ? await prisma.contact.findFirst({
          where: { email, accountId: account.id },
        })
      : null;

    if (existing) {
      const updated = await prisma.contact.update({
        where: { id: existing.id },
        data: {
          linkedinUrl: payload.person.linkedinUrl || existing.linkedinUrl,
          title: payload.person.title || existing.title,
          seniority: payload.person.seniority || existing.seniority,
        },
      });
      contactId = updated.id;
    } else {
      const created = await prisma.contact.create({
        data: {
          accountId: account.id,
          firstName: payload.person.firstName,
          lastName: payload.person.lastName,
          email,
          linkedinUrl: payload.person.linkedinUrl,
          title: payload.person.title,
          seniority: payload.person.seniority,
        },
      });
      contactId = created.id;
    }
  }

  // Link to visitor session if possible
  let visitorLinked = false;
  if (payload.session?.visitorId) {
    const visitor = await prisma.visitor.findUnique({
      where: { anonymousId: payload.session.visitorId },
    });
    if (visitor && contactId) {
      // If the contact has an email and it matches a Lead, link visitor.leadId
      const contact = await prisma.contact.findUnique({
        where: { id: contactId },
      });
      if (contact?.email) {
        const lead = await prisma.lead.findUnique({
          where: { email: contact.email },
        });
        if (lead) {
          await prisma.visitor.update({
            where: { id: visitor.id },
            data: { leadId: lead.id },
          });
          visitorLinked = true;
        }
      }
    }
  }

  return { accountId: account.id, contactId, visitorLinked };
}

function inferTier(employees?: number): "CITIZEN" | "SMB" | "MID_MARKET" | "ENTERPRISE" {
  if (!employees) return "SMB";
  if (employees < 50) return "SMB";
  if (employees < 500) return "MID_MARKET";
  return "ENTERPRISE";
}
