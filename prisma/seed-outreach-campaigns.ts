/**
 * Seed cold-outreach campaigns with multi-touch cadences.
 *
 * Run:  npx tsx prisma/seed-outreach-campaigns.ts
 *
 * This script is additive: it upserts by campaign name and replaces existing
 * step definitions only for the 4 canonical campaigns below. Existing data
 * (prospects, stats) is preserved.
 *
 * Templates use {{firstName}}, {{company}}, {{firstLine}}, {{title}},
 * {{city}} placeholders. {{firstLine}} is replaced at send time by
 * `personalizeEmail` (Claude) with 1-2 sentences of context.
 */
import { PrismaClient, LeadICP, CampaignChannel, CampaignStatus, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

type StepSeed = {
  order: number;
  dayOffset: number;
  channel: CampaignChannel;
  subject?: string;
  bodyTemplate: string;
  conditions?: Record<string, unknown>;
};

type CampaignSeed = {
  name: string;
  description: string;
  targetICP: LeadICP;
  channel: CampaignChannel;
  targetCount: number;
  steps: StepSeed[];
};

const baseConditions = { skipIfReplied: true, skipIfBounced: true, skipIfUnsubscribed: true };

const SOLO_LAWYER: CampaignSeed = {
  name: "SOLO_LAWYER_COLD_OUTREACH",
  description: "5-touch cold outbound for solo practitioners and small-firm partners. 500/day target.",
  targetICP: "SOLO_LAWYER",
  channel: "MULTI_TOUCH",
  targetCount: 500,
  steps: [
    {
      order: 0,
      dayOffset: 1,
      channel: "EMAIL",
      subject: "{{firstName}}, 2 mins to shave hours off contract review?",
      bodyTemplate: [
        "Hi {{firstName}},",
        "",
        "{{firstLine}}",
        "",
        "Most solo practitioners I speak with in India spend 3-5 hours per contract on manual clause review and precedent hunting. LexiReview runs 6 parallel AI engines (risk, citations, templates, recommendations) against your draft in under 45 seconds and cites the exact Indian law references.",
        "",
        "Worth a 15-min look? Happy to run one of your actual drafts through it on a call.",
        "",
        "Warmly,",
        "Priyabrata",
      ].join("\n"),
      conditions: baseConditions,
    },
    {
      order: 1,
      dayOffset: 3,
      channel: "LINKEDIN",
      bodyTemplate: [
        "Hi {{firstName}} — sent you an email the other day about LexiReview (AI contract review built for Indian law).",
        "Would love to connect + show a 90-sec demo on one of your own drafts. No pitch, just useful.",
      ].join("\n"),
      conditions: baseConditions,
    },
    {
      order: 2,
      dayOffset: 5,
      channel: "EMAIL",
      subject: "Re: {{firstName}}, 2 mins to shave hours off contract review?",
      bodyTemplate: [
        "Hi {{firstName}},",
        "",
        "Just circling back. Quick numbers from practitioners already on LexiReview:",
        "",
        "- 45 seconds average review time (vs 3-5 hours manual)",
        "- 98.5% detection accuracy on Indian-law issues",
        "- Cites ICA, DPDP, RBI, SEBI, RERA, Stamp Act sections inline",
        "",
        "Starter is INR 4,999/mo for 25 reviews. Free trial gets 3 reviews, no card.",
        "",
        "Want me to send the trial link?",
        "",
        "Priyabrata",
      ].join("\n"),
      conditions: baseConditions,
    },
    {
      order: 3,
      dayOffset: 8,
      channel: "EMAIL",
      subject: "Quick call {{firstName}}?",
      bodyTemplate: [
        "Hi {{firstName}},",
        "",
        "Happy to jump on a 10-min call if easier than email. Indian legal-AI space moves fast and I'd rather understand your workflow than pitch at you.",
        "",
        "If the answer is just 'not right now' that is also a perfectly fine reply — I'll stop writing.",
        "",
        "Priyabrata",
      ].join("\n"),
      conditions: baseConditions,
    },
    {
      order: 4,
      dayOffset: 12,
      channel: "EMAIL",
      subject: "Last note from me",
      bodyTemplate: [
        "Hi {{firstName}},",
        "",
        "Closing the loop on my end. If contract review ever starts swallowing your week, LexiReview is here: https://lexireview.in",
        "",
        "All the best with {{company}}.",
        "",
        "Priyabrata",
      ].join("\n"),
      conditions: baseConditions,
    },
  ],
};

const STARTUP: CampaignSeed = {
  name: "STARTUP_COLD_OUTREACH",
  description: "5-touch cold outbound for startup founders / GCs. 500/day target.",
  targetICP: "STARTUP_FOUNDER",
  channel: "MULTI_TOUCH",
  targetCount: 500,
  steps: [
    {
      order: 0,
      dayOffset: 1,
      channel: "EMAIL",
      subject: "{{firstName}}, contracts eating your founder hours?",
      bodyTemplate: [
        "Hi {{firstName}},",
        "",
        "{{firstLine}}",
        "",
        "LexiReview triages any contract in under 2 seconds (no cost) and gives a full AI review in 45s — flagging risk against Indian law (ICA, DPDP, RBI, SEBI, RERA).",
        "",
        "Founders on the Starter plan review 25 contracts/month for INR 4,999. Worth a look?",
        "",
        "Priyabrata",
      ].join("\n"),
      conditions: baseConditions,
    },
    {
      order: 1,
      dayOffset: 3,
      channel: "LINKEDIN",
      bodyTemplate: [
        "Hey {{firstName}}, building something in Indian legal AI — LexiReview. Would love to connect and share a 90-sec demo if useful for {{company}}.",
      ].join("\n"),
      conditions: baseConditions,
    },
    {
      order: 2,
      dayOffset: 5,
      channel: "EMAIL",
      subject: "Re: {{firstName}}, contracts eating your founder hours?",
      bodyTemplate: [
        "Hi {{firstName}},",
        "",
        "One more nudge. Founders at seed + Series A startups are using LexiReview to:",
        "",
        "- cut outside-counsel spend on routine reviews",
        "- catch DPDP + ICA red flags before signing vendor / employment MSAs",
        "- generate draft NDAs + employment letters from a 6-step wizard",
        "",
        "Free trial is 3 reviews, no card. Want the link?",
        "",
        "Priyabrata",
      ].join("\n"),
      conditions: baseConditions,
    },
    {
      order: 3,
      dayOffset: 8,
      channel: "EMAIL",
      subject: "{{firstName}} — 10 mins this week?",
      bodyTemplate: [
        "Hi {{firstName}},",
        "",
        "Short call this week? Happy to run an actual {{company}} contract through LexiReview on screen — you'll see exactly what flags first.",
        "",
        "Priyabrata",
      ].join("\n"),
      conditions: baseConditions,
    },
    {
      order: 4,
      dayOffset: 12,
      channel: "EMAIL",
      subject: "Wrapping up",
      bodyTemplate: [
        "Hi {{firstName}},",
        "",
        "I'll stop bugging you — if legal ever becomes a bottleneck, lexireview.in is here.",
        "",
        "Good luck with {{company}}.",
        "",
        "Priyabrata",
      ].join("\n"),
      conditions: baseConditions,
    },
  ],
};

const RE_DEVELOPER: CampaignSeed = {
  name: "RE_DEVELOPER_COLD_OUTREACH",
  description: "4-touch cold outbound for real estate developers + RERA counsel. 200/day target.",
  targetICP: "RE_DEVELOPER",
  channel: "MULTI_TOUCH",
  targetCount: 200,
  steps: [
    {
      order: 0,
      dayOffset: 1,
      channel: "EMAIL",
      subject: "{{firstName}}, RERA + Stamp Act checks in 45 seconds",
      bodyTemplate: [
        "Hi {{firstName}},",
        "",
        "{{firstLine}}",
        "",
        "LexiReview scans your agreements against RERA (state-specific), Stamp Acts for all 28 states, and the Registration Act — surfacing clause-level risk with citations. Builders use it for Sale Agreements, JDAs, BBAs, Lease Deeds.",
        "",
        "Stamp duty calculator is free to try; full review is 45s.",
        "",
        "Priyabrata",
      ].join("\n"),
      conditions: baseConditions,
    },
    {
      order: 1,
      dayOffset: 3,
      channel: "LINKEDIN",
      bodyTemplate: [
        "Hi {{firstName}}, saw {{company}}'s work. LexiReview does AI review on BBAs/JDAs with RERA + stamp duty built in. Worth a connect?",
      ].join("\n"),
      conditions: baseConditions,
    },
    {
      order: 2,
      dayOffset: 5,
      channel: "EMAIL",
      subject: "Re: {{firstName}}, RERA + Stamp Act checks in 45 seconds",
      bodyTemplate: [
        "Hi {{firstName}},",
        "",
        "Quick follow-up. One clause we flag often: indemnity caps on delayed possession — most standard BBAs in circulation don't align with the 2024 RERA Appellate rulings.",
        "",
        "Happy to show how LexiReview catches this in 45s on a live BBA.",
        "",
        "Priyabrata",
      ].join("\n"),
      conditions: baseConditions,
    },
    {
      order: 3,
      dayOffset: 8,
      channel: "EMAIL",
      subject: "Closing the loop",
      bodyTemplate: [
        "Hi {{firstName}},",
        "",
        "Last note — lexireview.in is here whenever BBA/JDA review gets heavy. Stamp duty calculator is free across all 28 states.",
        "",
        "Priyabrata",
      ].join("\n"),
      conditions: baseConditions,
    },
  ],
};

const TIER1_ABM: CampaignSeed = {
  name: "TIER1_LAW_FIRM_ABM",
  description: "6-touch hand-personalized ABM for tier-1 law firm partners. 2/week pace.",
  targetICP: "TIER1_LAW_FIRM",
  channel: "MULTI_TOUCH",
  targetCount: 40,
  steps: [
    {
      order: 0,
      dayOffset: 1,
      channel: "EMAIL",
      subject: "{{firstName}} — a question about {{company}}'s review throughput",
      bodyTemplate: [
        "Dear {{firstName}},",
        "",
        "{{firstLine}}",
        "",
        "I'm building LexiReview for Indian-law contract intelligence at the tier-1 firm scale — Matter Workspaces, Playbooks, White-Label, Precedent Search across SC/HC/NCLAT/NCDRC/RERA/DRT. Several partners we speak with mention review throughput on syndicated deals as a live pain.",
        "",
        "Would a 20-min walkthrough be appropriate — specific to the practice area {{title}} leads?",
        "",
        "Warm regards,",
        "Priyabrata",
      ].join("\n"),
      conditions: baseConditions,
    },
    {
      order: 1,
      dayOffset: 4,
      channel: "LINKEDIN",
      bodyTemplate: [
        "Dear {{firstName}}, I wrote to {{company}} email earlier this week about LexiReview — an Indian-law contract intelligence platform (Matter Workspaces + Playbooks + white-label).",
        "Would value a connection and your perspective.",
      ].join("\n"),
      conditions: baseConditions,
    },
    {
      order: 2,
      dayOffset: 8,
      channel: "EMAIL",
      subject: "Re: a question about {{company}}'s review throughput",
      bodyTemplate: [
        "Dear {{firstName}},",
        "",
        "Circling back. A few differentiators specific to tier-1 firms:",
        "",
        "- Matter Workspaces with chain-hashed audit trails (SHA-256, CAG-suitable)",
        "- White-label branding for client portals",
        "- Precedent search across SC/HC/NCLAT/NCDRC/RERA/DRT — cited inline",
        "- Batch processing (100+ contracts) for due diligence",
        "- e-Office integration for government-panel mandates",
        "",
        "Happy to share an enterprise one-pager or run a private session for {{company}} partners.",
        "",
        "Priyabrata",
      ].join("\n"),
      conditions: baseConditions,
    },
    {
      order: 3,
      dayOffset: 12,
      channel: "EMAIL",
      subject: "A short memo for {{firstName}}",
      bodyTemplate: [
        "Dear {{firstName}},",
        "",
        "Attached thinking — a 1-pager on how LexiReview fits a tier-1 firm's tech stack without displacing DMS or eSign vendors. Happy to walk through it.",
        "",
        "Priyabrata",
      ].join("\n"),
      conditions: baseConditions,
    },
    {
      order: 4,
      dayOffset: 18,
      channel: "LINKEDIN",
      bodyTemplate: [
        "Dear {{firstName}} — last note from me. If enterprise AI-led review ever moves up the agenda for {{company}}, I'd welcome a conversation.",
      ].join("\n"),
      conditions: baseConditions,
    },
    {
      order: 5,
      dayOffset: 25,
      channel: "EMAIL",
      subject: "Standing invitation",
      bodyTemplate: [
        "Dear {{firstName}},",
        "",
        "Wrapping up my outreach on this topic. LexiReview remains at lexireview.in — a standing invitation to a private session for {{company}} whenever the timing is right.",
        "",
        "With respect,",
        "Priyabrata",
      ].join("\n"),
      conditions: baseConditions,
    },
  ],
};

const CAMPAIGNS: CampaignSeed[] = [SOLO_LAWYER, STARTUP, RE_DEVELOPER, TIER1_ABM];

async function upsertCampaign(seed: CampaignSeed) {
  const existing = await prisma.outreachCampaign.findFirst({ where: { name: seed.name } });
  if (existing) {
    await prisma.outreachStep.deleteMany({ where: { campaignId: existing.id } });
    await prisma.outreachCampaign.update({
      where: { id: existing.id },
      data: {
        description: seed.description,
        targetICP: seed.targetICP,
        channel: seed.channel,
        targetCount: seed.targetCount,
        status: CampaignStatus.DRAFT,
        steps: {
          create: seed.steps.map((s) => ({
            order: s.order,
            dayOffset: s.dayOffset,
            channel: s.channel,
            subject: s.subject,
            bodyTemplate: s.bodyTemplate,
            conditions: s.conditions as unknown as Prisma.InputJsonValue | undefined,
          })),
        },
      },
    });
    return { id: existing.id, created: false };
  }
  const row = await prisma.outreachCampaign.create({
    data: {
      name: seed.name,
      description: seed.description,
      targetICP: seed.targetICP,
      channel: seed.channel,
      targetCount: seed.targetCount,
      status: CampaignStatus.DRAFT,
      steps: {
        create: seed.steps.map((s) => ({
          order: s.order,
          dayOffset: s.dayOffset,
          channel: s.channel,
          subject: s.subject,
          bodyTemplate: s.bodyTemplate,
          conditions: s.conditions as unknown as Prisma.InputJsonValue | undefined,
        })),
      },
    },
  });
  return { id: row.id, created: true };
}

async function main() {
  for (const seed of CAMPAIGNS) {
    const res = await upsertCampaign(seed);
    console.log(
      `${res.created ? "created" : "updated"} campaign ${seed.name} id=${res.id} steps=${seed.steps.length}`,
    );
  }
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
