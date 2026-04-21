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
  icp:
    | "TENANT_LANDLORD"
    | "EMPLOYEE"
    | "STARTUP_FOUNDER"
    | "CONSUMER_DISPUTE"
    | "SOLO_LAWYER"
    | "UNKNOWN";
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

  // ==========================================
  // Week 2 — Solo Lawyer / Small Law Firm tools
  // ==========================================
  {
    slug: "matter-intake-form-generator",
    name: "Matter Intake Form Generator",
    shortDescription:
      "Customised client intake form for your solo or small-firm practice",
    longDescription:
      "Generates a printable client matter intake form tailored to your practice area, state and billing model. Includes conflict-check questions and optional KYC/DPDP consent blocks.",
    category: "solo-lawyer-ops",
    icp: "SOLO_LAWYER",
    premiumPdf: true,
    premiumPrice: 49900, // ₹499
  },
  {
    slug: "retainer-agreement-generator",
    name: "Retainer Agreement Generator",
    shortDescription:
      "BCI-aligned attorney-client retainer agreements in minutes",
    longDescription:
      "Covers General, Specific Matter, Evergreen and Class Action retainers. Includes confidentiality, conflict, withdrawal and client-account clauses per BCI Rules of Professional Conduct.",
    category: "solo-lawyer-ops",
    icp: "SOLO_LAWYER",
    premiumPdf: true,
    premiumPrice: 49900, // ₹499
  },
  {
    slug: "client-onboarding-checklist",
    name: "Client Onboarding Checklist",
    shortDescription:
      "Step-by-step onboarding playbook for your practice area",
    longDescription:
      "Personalised first-72-hour onboarding checklist with KYC, DPDP consent, conflict check, engagement letter and fee-advance steps, plus practice-area-specific items and time estimates.",
    category: "solo-lawyer-ops",
    icp: "SOLO_LAWYER",
    premiumPdf: true,
    premiumPrice: 29900, // ₹299
  },
  {
    slug: "time-tracking-template",
    name: "Time Tracking Template",
    shortDescription:
      "CSV time-sheet template calibrated to your billing model",
    longDescription:
      "Generates a downloadable CSV with sample rows, activity codes, rounding rules (6/15/30-min) and optional non-billable categories. Open in Google Sheets / Excel and start billing.",
    category: "solo-lawyer-ops",
    icp: "SOLO_LAWYER",
    premiumPdf: true,
    premiumPrice: 29900, // ₹299
  },
  {
    slug: "fee-structure-analyzer",
    name: "Fee Structure Analyzer",
    shortDescription:
      "Benchmark your rates against peers in your segment",
    longDescription:
      "Compare your hourly rate and retainer to peer p25/p50/p75 for your practice area, city tier and experience bracket. Estimates annual earning potential and suggests rate adjustments.",
    category: "solo-lawyer-ops",
    icp: "SOLO_LAWYER",
    premiumPdf: true,
    premiumPrice: 99900, // ₹999
  },

  // ==========================================
  // Week 2 — Startup Founder tools
  // ==========================================
  {
    slug: "founders-agreement-generator",
    name: "Founders Agreement Generator",
    shortDescription:
      "Draft a founders agreement with vesting, drag/tag-along, ROFR and IP assignment",
    longDescription:
      "Generates a comprehensive Indian founders agreement with 4-year vesting + 1-year cliff (configurable), IP assignment, drag/tag-along, ROFR and configurable exit scenarios (death, disability, termination for cause, voluntary).",
    category: "startup-founder",
    icp: "STARTUP_FOUNDER",
    premiumPdf: true,
    premiumPrice: 99900, // ₹999
  },
  {
    slug: "esop-vesting-calculator",
    name: "ESOP Vesting Calculator + Grant Letter",
    shortDescription:
      "Compute full vesting schedule + auto-draft grant letter with India tax notes",
    longDescription:
      "Generates a full vesting schedule (monthly / quarterly / annual) with configurable cliff and period, auto-drafts the grant letter and summarises Section 17(2) perquisite tax and DPIIT Section 80-IAC deferral.",
    category: "startup-founder",
    icp: "STARTUP_FOUNDER",
    premiumPdf: true,
    premiumPrice: 59900, // ₹599
  },
  {
    slug: "mou-generator",
    name: "MOU Generator",
    shortDescription:
      "Co-founder, advisor, partnership or channel-partner MOUs in 2 minutes",
    longDescription:
      "Draft an MOU for co-founder discussions, advisor engagements, business partnerships or channel-partner arrangements. Configurable term, consideration (equity / cash / both / none), confidentiality and exclusivity.",
    category: "startup-founder",
    icp: "STARTUP_FOUNDER",
    premiumPdf: true,
    premiumPrice: 29900, // ₹299
  },
  {
    slug: "cap-table-template",
    name: "Cap Table Template Generator",
    shortDescription:
      "Pre- and post-dilution cap tables with ESOP pool and next-round modelling",
    longDescription:
      "Builds pre- and post-dilution cap tables for your stage (pre-seed → Series B) with ESOP pool allocation, angel investors, and next-round dilution modelling. Downloadable CSV; liquidation preference summary.",
    category: "startup-founder",
    icp: "STARTUP_FOUNDER",
    premiumPdf: true,
    premiumPrice: 49900, // ₹499
  },
  {
    slug: "term-sheet-decoder",
    name: "Term Sheet Decoder",
    shortDescription:
      "Paste a term sheet — get AI-powered red flags + negotiation levers",
    longDescription:
      "AI-powered analysis of your term sheet. Extracts valuation, key terms (liquidation preference, anti-dilution, veto rights, vesting), flags founder-adverse terms and gives concrete negotiation levers.",
    category: "startup-founder",
    icp: "STARTUP_FOUNDER",
    premiumPdf: true,
    premiumPrice: 99900, // ₹999
  },
  {
    slug: "investor-nda-generator",
    name: "Investor NDA Generator",
    shortDescription:
      "NDAs for VC / Angel / Corporate / PE discussions with appropriate carve-outs",
    longDescription:
      "Generate an investor-specific NDA (one-way) with portfolio carve-outs appropriate to the investor type, configurable duration, optional non-solicitation and non-disparagement, and proper DPDP alignment.",
    category: "startup-founder",
    icp: "STARTUP_FOUNDER",
    premiumPdf: true,
    premiumPrice: 39900, // ₹399
  },
  {
    slug: "startup-employment-contract",
    name: "Startup Employment Contract Generator",
    shortDescription:
      "Full-time, part-time, contract or intern employment contracts for startup hires",
    longDescription:
      "Generates a 15+ clause employment contract aligned to the new Labour Codes (Wages Code 2019, IR Code 2020), DPDP Act 2023 and POSH Act 2013. Handles CTC breakdown, joining bonus clawback, IP, non-solicit.",
    category: "startup-founder",
    icp: "STARTUP_FOUNDER",
    premiumPdf: true,
    premiumPrice: 59900, // ₹599
  },
  {
    slug: "customer-msa-generator",
    name: "Customer MSA Generator (SaaS-standard)",
    shortDescription:
      "SaaS-standard Master Services Agreement with DPDP + SLA + limitation of liability",
    longDescription:
      "Draft a SaaS-standard Customer MSA with DPDP-compliant data-processing terms, 99.5%/99.9% SLA with service credits, configurable limitation of liability, and optional arbitration clause.",
    category: "startup-founder",
    icp: "STARTUP_FOUNDER",
    premiumPdf: true,
    premiumPrice: 99900, // ₹999
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
  console.log(`\n${TOOLS.length} tools seeded.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
