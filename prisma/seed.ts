import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const KEYWORD_CLUSTERS = [
  {
    cluster: "RBI Compliance",
    keywords: [
      { keyword: "RBI NBFC outsourcing directions 2025 compliance", intent: "informational", funnelStage: "TOFU" as const },
      { keyword: "NBFC outsourcing contract checklist RBI", intent: "informational", funnelStage: "MOFU" as const },
      { keyword: "RBI vendor risk management guidelines NBFC", intent: "informational", funnelStage: "TOFU" as const },
      { keyword: "NBFC outsourcing agreement template RBI compliant", intent: "commercial", funnelStage: "MOFU" as const },
      { keyword: "RBI inspection rights clause outsourcing contract", intent: "informational", funnelStage: "MOFU" as const },
      { keyword: "NBFC IT outsourcing contract review April 2026", intent: "informational", funnelStage: "TOFU" as const },
      { keyword: "RBI audit readiness contract management NBFC", intent: "commercial", funnelStage: "MOFU" as const },
      { keyword: "NBFC compliance calendar 2025-26", intent: "informational", funnelStage: "TOFU" as const },
      { keyword: "exit strategy clause NBFC outsourcing contract RBI", intent: "informational", funnelStage: "MOFU" as const },
      { keyword: "subcontracting controls NBFC outsourcing RBI directions", intent: "informational", funnelStage: "MOFU" as const },
      { keyword: "RBI cybersecurity compliance checklist NBFC 2026", intent: "informational", funnelStage: "TOFU" as const },
      { keyword: "NBFC board-level outsourcing governance RBI", intent: "informational", funnelStage: "TOFU" as const },
    ],
  },
  {
    cluster: "DPDP Act",
    keywords: [
      { keyword: "DPDP Act compliance for contracts India", intent: "informational", funnelStage: "TOFU" as const },
      { keyword: "data fiduciary data processor agreement DPDP", intent: "informational", funnelStage: "MOFU" as const },
      { keyword: "DPDP Act contract clauses template", intent: "commercial", funnelStage: "MOFU" as const },
      { keyword: "consent management DPDP Act India", intent: "informational", funnelStage: "TOFU" as const },
      { keyword: "DPDP Act vendor contract compliance NBFC", intent: "commercial", funnelStage: "MOFU" as const },
      { keyword: "DPDP Act breach notification clause contract", intent: "informational", funnelStage: "MOFU" as const },
      { keyword: "DPDP Act penalties non-compliance 250 crore", intent: "informational", funnelStage: "TOFU" as const },
      { keyword: "DPDP vs GDPR contract clauses comparison", intent: "informational", funnelStage: "TOFU" as const },
      { keyword: "data processing agreement India DPDP Rules 2025", intent: "informational", funnelStage: "MOFU" as const },
      { keyword: "DPDP Act security safeguards contract obligations", intent: "informational", funnelStage: "MOFU" as const },
      { keyword: "consent manager registration DPDP Rules 2026", intent: "informational", funnelStage: "TOFU" as const },
      { keyword: "void contract clauses DPDP Act data fiduciary", intent: "informational", funnelStage: "MOFU" as const },
    ],
  },
  {
    cluster: "AI Contract Review",
    keywords: [
      { keyword: "AI contract review software India", intent: "commercial", funnelStage: "MOFU" as const },
      { keyword: "contract management software India 2026", intent: "commercial", funnelStage: "MOFU" as const },
      { keyword: "AI clause extraction Indian contracts", intent: "informational", funnelStage: "MOFU" as const },
      { keyword: "non-standard clause detection AI contract", intent: "informational", funnelStage: "MOFU" as const },
      { keyword: "AI legal tech India 2026", intent: "informational", funnelStage: "TOFU" as const },
      { keyword: "contract review automation NBFC lending agreements", intent: "commercial", funnelStage: "MOFU" as const },
      { keyword: "AI contract risk scoring India", intent: "informational", funnelStage: "MOFU" as const },
      { keyword: "best CLM software India", intent: "commercial", funnelStage: "BOFU" as const },
      { keyword: "AI playbook contract review legal teams", intent: "informational", funnelStage: "MOFU" as const },
      { keyword: "contract analysis software Indian Contract Act", intent: "commercial", funnelStage: "MOFU" as const },
      { keyword: "free contract review software India", intent: "commercial", funnelStage: "TOFU" as const },
      { keyword: "AI contract summarization legal India", intent: "informational", funnelStage: "MOFU" as const },
    ],
  },
  {
    cluster: "Financial Services CLM",
    keywords: [
      { keyword: "contract management NBFC India", intent: "commercial", funnelStage: "MOFU" as const },
      { keyword: "loan agreement automation India RBI", intent: "informational", funnelStage: "MOFU" as const },
      { keyword: "co-lending agreement compliance RBI", intent: "informational", funnelStage: "TOFU" as const },
      { keyword: "NBFC vendor contract management", intent: "commercial", funnelStage: "MOFU" as const },
      { keyword: "digital lending contract compliance RBI directions", intent: "informational", funnelStage: "MOFU" as const },
      { keyword: "key fact statement loan agreement KFS RBI", intent: "informational", funnelStage: "TOFU" as const },
      { keyword: "NBFC contract repository software", intent: "commercial", funnelStage: "BOFU" as const },
      { keyword: "loan agreement e-signing NBFC Aadhaar eSign", intent: "informational", funnelStage: "MOFU" as const },
      { keyword: "third party contract risk management banking India", intent: "informational", funnelStage: "MOFU" as const },
      { keyword: "NBFC escrow agreement co-lending compliance", intent: "informational", funnelStage: "MOFU" as const },
      { keyword: "default loss guarantee contract clause NBFC", intent: "informational", funnelStage: "MOFU" as const },
      { keyword: "SARFAESI notice management NBFC contract", intent: "commercial", funnelStage: "MOFU" as const },
    ],
  },
  {
    cluster: "ICA Compliance",
    keywords: [
      { keyword: "Section 10 Indian Contract Act valid contract", intent: "informational", funnelStage: "TOFU" as const },
      { keyword: "void agreements Indian Contract Act", intent: "informational", funnelStage: "TOFU" as const },
      { keyword: "free consent Indian Contract Act Section 14", intent: "informational", funnelStage: "TOFU" as const },
      { keyword: "lawful consideration Indian Contract Act", intent: "informational", funnelStage: "TOFU" as const },
      { keyword: "stamp duty contract enforceability India", intent: "informational", funnelStage: "MOFU" as const },
      { keyword: "e-stamping compliance India 2026 state-wise", intent: "informational", funnelStage: "MOFU" as const },
      { keyword: "unstamped contract admissibility evidence India", intent: "informational", funnelStage: "MOFU" as const },
      { keyword: "e-contract validity Indian Contract Act IT Act", intent: "informational", funnelStage: "MOFU" as const },
      { keyword: "void vs voidable contract India", intent: "informational", funnelStage: "TOFU" as const },
      { keyword: "restraint of trade clause Indian Contract Act Section 27", intent: "informational", funnelStage: "TOFU" as const },
      { keyword: "indemnity clause Indian Contract Act Section 124", intent: "informational", funnelStage: "MOFU" as const },
      { keyword: "digital stamp duty mandatory July 2025 India", intent: "informational", funnelStage: "TOFU" as const },
    ],
  },
  {
    cluster: "Comparisons",
    keywords: [
      { keyword: "LexiReview vs SpotDraft", intent: "commercial", funnelStage: "BOFU" as const },
      { keyword: "LexiReview vs Leegality", intent: "commercial", funnelStage: "BOFU" as const },
      { keyword: "LexiReview vs Provakil", intent: "commercial", funnelStage: "BOFU" as const },
      { keyword: "LexiReview vs Icertis India", intent: "commercial", funnelStage: "BOFU" as const },
      { keyword: "best contract management software NBFC India", intent: "commercial", funnelStage: "BOFU" as const },
      { keyword: "SpotDraft alternatives India 2026", intent: "commercial", funnelStage: "BOFU" as const },
      { keyword: "Leegality alternatives contract management", intent: "commercial", funnelStage: "BOFU" as const },
      { keyword: "contract review software for Indian law", intent: "commercial", funnelStage: "MOFU" as const },
      { keyword: "AI contract review vs manual review India", intent: "informational", funnelStage: "MOFU" as const },
      { keyword: "CLM software for regulated industries India", intent: "commercial", funnelStage: "MOFU" as const },
      { keyword: "Provakil alternatives contract lifecycle management", intent: "commercial", funnelStage: "BOFU" as const },
      { keyword: "contract management tool RBI DPDP compliance", intent: "commercial", funnelStage: "BOFU" as const },
    ],
  },
];

const DEFAULT_CRON_JOBS = [
  { name: "Process Next Content Brief", schedule: "0 */6 * * *", taskType: "process_brief" },
  { name: "Check Keyword Rankings", schedule: "0 6 * * *", taskType: "check_keywords" },
  { name: "Check AI Citations", schedule: "0 9 * * *", taskType: "check_citations" },
];

async function main() {
  console.log("Seeding database...");

  // Seed keywords
  for (const cluster of KEYWORD_CLUSTERS) {
    for (const kw of cluster.keywords) {
      await prisma.keyword.upsert({
        where: {
          cluster_keyword: { cluster: cluster.cluster, keyword: kw.keyword },
        },
        update: {},
        create: {
          cluster: cluster.cluster,
          keyword: kw.keyword,
          intent: kw.intent,
          funnelStage: kw.funnelStage,
        },
      });
    }
    console.log(`  Seeded ${cluster.keywords.length} keywords for cluster: ${cluster.cluster}`);
  }

  // Seed cron jobs
  for (const job of DEFAULT_CRON_JOBS) {
    await prisma.cronJob.upsert({
      where: { name: job.name },
      update: {},
      create: job,
    });
  }
  console.log(`  Seeded ${DEFAULT_CRON_JOBS.length} cron jobs`);

  console.log("Seeding complete!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
