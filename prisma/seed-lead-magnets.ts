/**
 * Seeds the Week 2 lead magnets:
 *   - solo-lawyer-playbook (for ICP: SOLO_LAWYER)
 *   - founder-legal-checklist (for ICP: STARTUP_FOUNDER)
 *
 * These point to HTML pages at /lead-magnets/<slug> (rendered on the site).
 *
 * Run: cd /var/www/lexiforge && npx tsx prisma/seed-lead-magnets.ts
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface MagnetSeed {
  slug: string;
  title: string;
  description: string;
  pdfUrl: string;
  targetICP: "SOLO_LAWYER" | "STARTUP_FOUNDER";
  language: "EN";
}

const MAGNETS: MagnetSeed[] = [
  {
    slug: "solo-lawyer-playbook",
    title: "The Solo Lawyer's Practice Management Playbook",
    description:
      "60 pages. Everything we've learned from 150+ Indian solo practices — setup, client acquisition (BCI-compliant), billing, technology stack, scaling from 1 to 5 lawyers.",
    pdfUrl: "https://lexireview.in/lead-magnets/solo-lawyer-playbook",
    targetICP: "SOLO_LAWYER",
    language: "EN",
  },
  {
    slug: "founder-legal-checklist",
    title: "The Founder's Legal Checklist: Pre-seed to Series A",
    description:
      "25 pages. The 12 legal things every Indian startup founder must get right, from incorporation to ESOP grants to DPDP compliance. Written by Indian lawyers for Indian founders.",
    pdfUrl: "https://lexireview.in/lead-magnets/founder-legal-checklist",
    targetICP: "STARTUP_FOUNDER",
    language: "EN",
  },
];

async function main() {
  for (const m of MAGNETS) {
    const existing = await prisma.leadMagnet.findUnique({ where: { slug: m.slug } });
    if (existing) {
      await prisma.leadMagnet.update({
        where: { slug: m.slug },
        data: {
          title: m.title,
          description: m.description,
          pdfUrl: m.pdfUrl,
          targetICP: m.targetICP,
          language: m.language,
          isActive: true,
        },
      });
      console.log(`↻ Updated ${m.slug}`);
    } else {
      await prisma.leadMagnet.create({
        data: {
          slug: m.slug,
          title: m.title,
          description: m.description,
          pdfUrl: m.pdfUrl,
          targetICP: m.targetICP,
          language: m.language,
        },
      });
      console.log(`✓ Seeded ${m.slug}`);
    }
  }
  console.log(`\n${MAGNETS.length} lead magnets seeded.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
