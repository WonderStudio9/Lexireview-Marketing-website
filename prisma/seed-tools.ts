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
    | "MSME_OWNER"
    | "NRI"
    | "SENIOR_CITIZEN"
    | "FREELANCER"
    | "RE_DEVELOPER"
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

  // ==========================================
  // Week 3 — Real Estate Developer tools
  // ==========================================
  {
    slug: "rera-compliance-checker",
    name: "RERA Compliance Checker",
    shortDescription:
      "Score your project against RERA 2016 — registration, disclosure, escrow and quarterly updates",
    longDescription:
      "Checks your project against the key obligations under the Real Estate (Regulation and Development) Act, 2016: registration (Section 3), public disclosure (Section 11), carpet-area disclosure (Section 14), 70% escrow (Section 4(2)(l)(D)) and quarterly updates. Returns a compliance score, section-referenced findings and indicative penalty exposure.",
    category: "real-estate-developers",
    icp: "RE_DEVELOPER",
    premiumPdf: true,
    premiumPrice: 999900, // ₹9,999
  },
  {
    slug: "builder-buyer-agreement-analyzer",
    name: "Builder-Buyer Agreement Clause Analyzer",
    shortDescription:
      "AI-powered review of your Builder-Buyer Agreement against RERA Sections 13, 14, 18 and 19",
    longDescription:
      "Claude analyses your Builder-Buyer Agreement against key RERA sections (13 — advance booking, 14 — carpet area, 18 — delay penalty, 19 — allottee rights and tripartite arrangement). Flags red flags, market-standard vs non-standard clauses, and gives concrete recommendations and questions for the developer.",
    category: "real-estate-developers",
    icp: "RE_DEVELOPER",
    premiumPdf: true,
    premiumPrice: 499900, // ₹4,999
  },
  {
    slug: "real-estate-stamp-duty-calculator",
    name: "Real Estate Stamp Duty Calculator",
    shortDescription:
      "State-wise stamp duty, registration + local fees for Sale Deed / ATS / Allotment / Conveyance",
    longDescription:
      "State-wise stamp duty and registration charges for the four core real-estate transactions: Sale Deed, Agreement to Sell, Allotment Letter and Conveyance. Auto-applies women and first-time-buyer concessions. Returns a full closing-cost breakdown with municipal surcharge and additional local fees.",
    category: "real-estate-developers",
    icp: "RE_DEVELOPER",
    premiumPdf: true,
    premiumPrice: 19900, // ₹199
  },
  {
    slug: "rera-penalty-calculator",
    name: "RERA Penalty Calculator",
    shortDescription:
      "Indicative exposure under RERA Act Sections 59-66 with mitigation recommendations",
    longDescription:
      "Maps your violation (late filing / non-registration / false disclosure / delayed possession / fund misuse / continued default) to the specific RERA Section (59–66), returns base penalty and per-unit penalty computation, imprisonment risk and specific mitigation steps.",
    category: "real-estate-developers",
    icp: "RE_DEVELOPER",
    premiumPdf: true,
    premiumPrice: 299900, // ₹2,999
  },
  {
    slug: "agreement-to-sell-generator",
    name: "Agreement-to-Sell Generator",
    shortDescription:
      "TPA § 54 + RERA-aligned Agreement to Sell for real-estate transactions",
    longDescription:
      "Generate a Transfer of Property Act, 1882 Section 54-compliant Agreement to Sell. Covers consideration, earnest money, payment schedule, possession commitment, stamp duty allocation, RERA Section 13/14 alignment, and registration under the Registration Act, 1908.",
    category: "real-estate-developers",
    icp: "RE_DEVELOPER",
    premiumPdf: true,
    premiumPrice: 299900, // ₹2,999
  },
  {
    slug: "tripartite-agreement-generator",
    name: "Tripartite Agreement Generator",
    shortDescription:
      "Builder-Buyer-Bank tripartite per RERA § 19 + Banking Regulation Act with Builder NOC",
    longDescription:
      "Generate a tripartite agreement among Builder, Buyer and Lender bank, with Builder NOC for mortgage, direct loan disbursement to the project escrow account (RERA § 4(2)(l)(D)), Pre-EMI / EMI commitments, SARFAESI coordination and Section 19 compliance.",
    category: "real-estate-developers",
    icp: "RE_DEVELOPER",
    premiumPdf: true,
    premiumPrice: 399900, // ₹3,999
  },

  // ==========================================
  // Week 3 — Additional citizen tools
  // ==========================================
  {
    slug: "rti-application-drafter",
    name: "RTI Application Drafter",
    shortDescription:
      "Draft an RTI application under the Right to Information Act, 2005",
    longDescription:
      "Generates a properly formatted RTI application addressed to the PIO with Section 6(1) reference, fee note (₹10 or BPL exemption), delivery mode, and prayer clauses. Includes first-appeal guidance.",
    category: "citizens-consumers",
    icp: "CONSUMER_DISPUTE",
    premiumPdf: true,
    premiumPrice: 29900, // ₹299
  },
  {
    slug: "notice-period-rules-checker",
    name: "Notice Period Rules Checker",
    shortDescription:
      "Find out the exact notice period enforceable in your state and industry",
    longDescription:
      "State-specific analysis under the Industrial Employment Standing Orders Act and your local Shops & Establishments Act. Checks non-compete enforceability under Section 27 of the Indian Contract Act, 1872 and garden-leave norms.",
    category: "citizens-employees",
    icp: "EMPLOYEE",
    premiumPdf: true,
    premiumPrice: 19900, // ₹199
  },
  {
    slug: "gratuity-calculator",
    name: "Gratuity Calculator",
    shortDescription:
      "Exact gratuity under Payment of Gratuity Act, 1972 + Section 10(10) tax",
    longDescription:
      "Computes gratuity using the 15/26 formula (or 1/2 for non-covered employers), applies the ₹20L Section 10(10) exemption cap, and explains eligibility, rounding and Section 4(6) forfeiture rules.",
    category: "citizens-employees",
    icp: "EMPLOYEE",
    premiumPdf: true,
    premiumPrice: 29900, // ₹299
  },
  {
    slug: "salary-structure-analyzer",
    name: "Salary Structure Analyzer",
    shortDescription:
      "AI analyses your CTC and suggests tax-efficient restructure",
    longDescription:
      "AI-powered analysis of your salary breakdown. Flags HRA under-utilisation, suggests LTA, NPS 80CCD(2) and standard-deduction levers, and returns a target restructure with estimated monthly savings.",
    category: "citizens-employees",
    icp: "EMPLOYEE",
    premiumPdf: true,
    premiumPrice: 49900, // ₹499
  },
  {
    slug: "partnership-deed-generator",
    name: "Partnership Deed Generator",
    shortDescription:
      "Indian Partnership Act 1932 deed for 2 to 5 partners in minutes",
    longDescription:
      "Generates a Partnership Deed with capital contribution, profit sharing, management, admission / retirement, dissolution and Section 40(b)-aligned remuneration. Guidance on Registrar of Firms (Form A) filing.",
    category: "citizens-msme",
    icp: "MSME_OWNER",
    premiumPdf: true,
    premiumPrice: 49900, // ₹499
  },
  {
    slug: "will-drafter",
    name: "Will Drafter (Simple)",
    shortDescription:
      "Simple Will under Indian Succession Act, 1925 — 2 witnesses required",
    longDescription:
      "Generates a Will compliant with Section 63 of the Indian Succession Act, 1925. Handles assets, beneficiaries, executor, residuary clause, no-contest. Flags special treatment under Muslim personal law.",
    category: "citizens-senior-citizens",
    icp: "SENIOR_CITIZEN",
    premiumPdf: true,
    premiumPrice: 99900, // ₹999
  },
  {
    slug: "gift-deed-generator",
    name: "Gift Deed Generator",
    shortDescription:
      "Gift Deed under Section 122, TPA — stamp duty & registration note",
    longDescription:
      "Generates a Gift Deed with relationship-based stamp duty estimate (concessional for family), acceptance clause, Section 56(2)(x) tax note, and registration requirement flag for immovable property.",
    category: "citizens-nri",
    icp: "NRI",
    premiumPdf: true,
    premiumPrice: 59900, // ₹599
  },
  {
    slug: "power-of-attorney-generator",
    name: "Power of Attorney Generator",
    shortDescription:
      "General / Specific / Durable POA — NRI consular note included",
    longDescription:
      "Generates a POA under the Powers-of-Attorney Act, 1882 with Indian Stamp Act notes, notarisation guidance, NRI consular-attestation requirement, and Suraj Lamp 2011 registration requirement for property-related POAs.",
    category: "citizens-nri",
    icp: "NRI",
    premiumPdf: true,
    premiumPrice: 99900, // ₹999
  },
  {
    slug: "rental-receipt-generator",
    name: "Rental Receipt Generator",
    shortDescription:
      "HRA-compliant rent receipt with PAN + Section 194-IB TDS note",
    longDescription:
      "Generates a rent receipt ready for HRA proof under Section 10(13A) and Rule 2A. Flags landlord PAN requirement if rent ≥ ₹8,333/mo and Section 194-IB TDS requirement if rent ≥ ₹50,000/mo.",
    category: "citizens-tenants",
    icp: "TENANT_LANDLORD",
    premiumPdf: true,
    premiumPrice: 9900, // ₹99
  },
  {
    slug: "freelancer-contract-simple",
    name: "Freelancer Contract Generator (Simple)",
    shortDescription:
      "Simple freelance services agreement with GST + TDS 194J notes",
    longDescription:
      "A simplified, India-ready freelance services agreement with GST reverse-charge notes, Section 194J TDS, IP assignment, confidentiality, and milestone-based payment schedule.",
    category: "citizens-freelancers",
    icp: "FREELANCER",
    premiumPdf: true,
    premiumPrice: 29900, // ₹299
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
