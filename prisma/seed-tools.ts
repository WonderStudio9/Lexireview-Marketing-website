/**
 * Seeds the initial 5 citizen tool records.
 *
 * Run: cd /var/www/lexiforge && npx tsx prisma/seed-tools.ts
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface ToolSeed {
  slug: string;
  name: string;
  shortDescription: string;
  longDescription: string;
  category: string;
  icp: "TENANT_LANDLORD" | "EMPLOYEE" | "STARTUP_FOUNDER" | "CONSUMER_DISPUTE" | "UNKNOWN";
  premiumPdf: boolean;
  premiumPrice: number | null; // paise
}

const TOOLS: ToolSeed[] = [
  {
    slug: "rent-agreement-generator",
    name: "Rent Agreement Generator",
    shortDescription: "Generate state-specific rent agreements in 2 minutes",
    longDescription:
      "Covers all 28 states and 8 UTs. Handles residential, commercial, lock-in periods, security deposit clauses, and stamp duty guidance. Lawyer-verified state-specific PDFs available as premium upgrade.",
    category: "citizens-tenants",
    icp: "TENANT_LANDLORD",
    premiumPdf: true,
    premiumPrice: 19900, // ₹199
  },
  {
    slug: "stamp-duty-calculator",
    name: "Stamp Duty Calculator",
    shortDescription: "Calculate stamp duty + registration fees for every Indian state",
    longDescription:
      "Covers sale deed, gift deed, lease, mortgage, conveyance, and development agreements. Factors in women concessions, property type, and city surcharges for accurate calculations.",
    category: "citizens-tenants",
    icp: "TENANT_LANDLORD",
    premiumPdf: true,
    premiumPrice: 9900, // ₹99
  },
  {
    slug: "offer-letter-decoder",
    name: "Offer Letter Decoder",
    shortDescription: "AI analyses your offer letter in 30 seconds",
    longDescription:
      "Spots red flags: bonds, non-competes, excessive notice periods, unilateral-change clauses. Estimates your real in-hand salary. Gives concrete negotiation levers and questions to ask HR.",
    category: "citizens-employees",
    icp: "EMPLOYEE",
    premiumPdf: true,
    premiumPrice: 29900, // ₹299
  },
  {
    slug: "nda-generator",
    name: "NDA Generator",
    shortDescription: "Create mutual, one-way, employee, investor, or vendor NDAs",
    longDescription:
      "Generates Indian Contract Act-compliant NDAs with proper confidentiality, non-compete (Section 27 aware), and non-solicitation clauses. State-specific jurisdiction + governing law.",
    category: "citizens-startups",
    icp: "STARTUP_FOUNDER",
    premiumPdf: true,
    premiumPrice: 29900, // ₹299
  },
  {
    slug: "consumer-complaint-drafter",
    name: "Consumer Complaint Drafter",
    shortDescription: "Draft a Consumer Protection Act 2019 complaint in minutes",
    longDescription:
      "Auto-selects the right forum (District / State / National CDRC) based on your claim value. Formats the complaint with all required sections, prayers, and annexure references.",
    category: "citizens-consumers",
    icp: "CONSUMER_DISPUTE",
    premiumPdf: true,
    premiumPrice: 49900, // ₹499
  },
];

async function main() {
  for (const tool of TOOLS) {
    const existing = await prisma.tool.findUnique({ where: { slug: tool.slug } });
    if (existing) {
      await prisma.tool.update({
        where: { slug: tool.slug },
        data: {
          name: tool.name,
          shortDescription: tool.shortDescription,
          longDescription: tool.longDescription,
          category: tool.category,
          icp: tool.icp,
          premiumPdf: tool.premiumPdf,
          premiumPrice: tool.premiumPrice,
          isActive: true,
        },
      });
      console.log(`↻ Updated ${tool.slug}`);
    } else {
      await prisma.tool.create({
        data: {
          slug: tool.slug,
          name: tool.name,
          shortDescription: tool.shortDescription,
          longDescription: tool.longDescription,
          category: tool.category,
          icp: tool.icp,
          premiumPdf: tool.premiumPdf,
          premiumPrice: tool.premiumPrice,
          isActive: true,
        },
      });
      console.log(`✓ Seeded ${tool.slug}`);
    }
  }
  console.log("\n5 tools seeded.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
