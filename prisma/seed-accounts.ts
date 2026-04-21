/**
 * Bulk-ingests starter Account records from JSON files in /data/accounts/.
 *
 * Use this to seed the prospecting universe for outbound campaigns. Replace
 * the sample JSONs with full scrapes/exports when available.
 *
 * Run: cd /var/www/lexiforge && npx tsx prisma/seed-accounts.ts
 *
 * Idempotent — upsert by (name, state) pair.
 */
import { PrismaClient } from "@prisma/client";
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const prisma = new PrismaClient();

interface AccountJson {
  name: string;
  domain?: string | null;
  city?: string;
  state?: string;
  country?: string;
  tier?: "CITIZEN" | "SMB" | "MID_MARKET" | "ENTERPRISE" | "GOVERNMENT";
  icp?: string;
  industry?: string;
  subIndustry?: string;
  revenueRange?: string;
  website?: string;
  linkedinUrl?: string;
  employees?: number;
}

interface AccountFile {
  description: string;
  source: string;
  accounts: AccountJson[];
}

const DATA_DIR = join(__dirname, "..", "data", "accounts");

const FILES = [
  "credai-members-sample.json",
  "rbi-nbfcs-sample.json",
  "india-startups-sample.json",
  "solo-lawyers-sample.json",
  // tier1-accounts.json is a special format — separate loader below
];

async function seedFile(filename: string) {
  const path = join(DATA_DIR, filename);
  let data: AccountFile;
  try {
    data = JSON.parse(readFileSync(path, "utf-8"));
  } catch (err) {
    console.log(`  ✗ Skipping ${filename}: ${err}`);
    return { created: 0, updated: 0 };
  }

  let created = 0;
  let updated = 0;
  for (const a of data.accounts) {
    const lookupDomain = a.domain?.toLowerCase() || undefined;

    const existing = lookupDomain
      ? await prisma.account.findUnique({ where: { domain: lookupDomain } })
      : await prisma.account.findFirst({
          where: { name: a.name, state: a.state },
        });

    if (existing) {
      await prisma.account.update({
        where: { id: existing.id },
        data: {
          name: a.name,
          domain: lookupDomain,
          city: a.city,
          state: a.state,
          country: a.country || "IN",
          tier: a.tier || "SMB",
          icp: (a.icp as never) || "UNKNOWN",
          industry: a.industry,
          subIndustry: a.subIndustry,
          revenueRange: a.revenueRange,
          website: a.website || (lookupDomain ? `https://${lookupDomain}` : null),
          linkedinUrl: a.linkedinUrl,
          employees: a.employees,
        },
      });
      updated++;
    } else {
      await prisma.account.create({
        data: {
          name: a.name,
          domain: lookupDomain,
          city: a.city,
          state: a.state,
          country: a.country || "IN",
          tier: a.tier || "SMB",
          icp: (a.icp as never) || "UNKNOWN",
          industry: a.industry,
          subIndustry: a.subIndustry,
          revenueRange: a.revenueRange,
          website: a.website || (lookupDomain ? `https://${lookupDomain}` : null),
          linkedinUrl: a.linkedinUrl,
          employees: a.employees,
        },
      });
      created++;
    }
  }
  console.log(`  ${filename}: ${created} created, ${updated} updated`);
  return { created, updated };
}

async function seedTier1() {
  const path = join(DATA_DIR, "..", "tier1-accounts.json");
  let data;
  try {
    data = JSON.parse(readFileSync(path, "utf-8"));
  } catch (err) {
    console.log(`  ✗ Skipping tier1-accounts.json: ${err}`);
    return { created: 0, updated: 0 };
  }

  let created = 0;
  let updated = 0;
  for (const a of data.accounts) {
    const lookupDomain = a.website?.toLowerCase() || undefined;
    const existing = lookupDomain
      ? await prisma.account.findUnique({ where: { domain: lookupDomain } })
      : await prisma.account.findFirst({ where: { name: a.name } });

    const enrichment = {
      sourceTier: "TIER_1",
      priority: a.priority,
      offices: a.offices,
      lawyers: a.lawyers,
      practiceAreas: a.practiceAreas,
      contactRoles: a.contactRoles,
      abmNote: a.abmNote,
      warmIntroPath: a.warmIntroPath,
    };

    if (existing) {
      await prisma.account.update({
        where: { id: existing.id },
        data: {
          name: a.name,
          domain: lookupDomain,
          city: a.hq,
          state: null,
          country: "IN",
          tier: "ENTERPRISE",
          icp: "TIER1_LAW_FIRM",
          industry: "Legal Services",
          website: lookupDomain ? `https://${lookupDomain}` : null,
          enrichmentData: enrichment,
        },
      });
      updated++;
    } else {
      await prisma.account.create({
        data: {
          name: a.name,
          domain: lookupDomain,
          city: a.hq,
          country: "IN",
          tier: "ENTERPRISE",
          icp: "TIER1_LAW_FIRM",
          industry: "Legal Services",
          website: lookupDomain ? `https://${lookupDomain}` : null,
          enrichmentData: enrichment,
        },
      });
      created++;
    }
  }
  console.log(`  tier1-accounts.json: ${created} created, ${updated} updated`);
  return { created, updated };
}

async function main() {
  console.log("=== Seeding Account prospecting universe ===\n");
  let totalCreated = 0;
  let totalUpdated = 0;

  for (const f of FILES) {
    const r = await seedFile(f);
    totalCreated += r.created;
    totalUpdated += r.updated;
  }

  const t1 = await seedTier1();
  totalCreated += t1.created;
  totalUpdated += t1.updated;

  console.log(
    `\n=== Done: ${totalCreated} accounts created, ${totalUpdated} updated ===`,
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
