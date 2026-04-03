import * as cron from "node-cron";
import { prisma } from "@/lib/db";
import { runPipeline } from "@/lib/agents/pipeline";

const activeCrons: Map<string, ReturnType<typeof cron.schedule>> = new Map();

async function processNextBrief() {
  const brief = await prisma.contentBrief.findFirst({
    where: { status: "BRIEFED" },
    orderBy: [{ priority: "desc" }, { createdAt: "asc" }],
  });

  if (!brief) {
    console.log("[Cron] No briefs in queue");
    return;
  }

  console.log(`[Cron] Processing brief: ${brief.topic}`);
  try {
    await runPipeline(brief.id);
    console.log(`[Cron] Pipeline complete for: ${brief.topic}`);
  } catch (err) {
    console.error(`[Cron] Pipeline failed for: ${brief.topic}`, err);
  }
}

async function checkKeywordRankings() {
  const keywords = await prisma.keyword.findMany();
  console.log(`[Cron] Checking rankings for ${keywords.length} keywords`);

  for (const kw of keywords) {
    // Placeholder: integrate with SerpAPI or similar
    await prisma.seoSnapshot.create({
      data: {
        keywordId: kw.id,
        rank: null,
        serpData: { status: "pending_api_integration" },
      },
    });

    await prisma.keyword.update({
      where: { id: kw.id },
      data: { lastChecked: new Date() },
    });
  }

  console.log(`[Cron] Keyword check complete`);
}

async function checkAiCitations() {
  const queries = [
    "AI contract management India",
    "DPDP Act compliance software",
    "contract management for NBFCs",
    "RBI compliance automation",
    "best CLM software India",
    "LexiReview",
  ];

  const engines = ["perplexity", "chatgpt", "google_ai_overview", "bing_copilot"];

  for (const query of queries) {
    for (const engine of engines) {
      // Placeholder: integrate with web scraping
      await prisma.aiCitation.create({
        data: {
          engine,
          query,
          cited: false,
          snippet: null,
        },
      });
    }
  }

  console.log(`[Cron] AI citation check complete`);
}

const TASK_HANDLERS: Record<string, () => Promise<void>> = {
  process_brief: processNextBrief,
  check_keywords: checkKeywordRankings,
  check_citations: checkAiCitations,
};

export async function initCronJobs() {
  const jobs = await prisma.cronJob.findMany({ where: { enabled: true } });

  for (const job of jobs) {
    if (!cron.validate(job.schedule)) {
      console.warn(`[Cron] Invalid schedule for ${job.name}: ${job.schedule}`);
      continue;
    }

    const handler = TASK_HANDLERS[job.taskType];
    if (!handler) {
      console.warn(`[Cron] Unknown task type: ${job.taskType}`);
      continue;
    }

    const task = cron.schedule(job.schedule, async () => {
      console.log(`[Cron] Running: ${job.name}`);
      await prisma.cronJob.update({
        where: { id: job.id },
        data: { lastRunAt: new Date() },
      });
      await handler();
    });

    activeCrons.set(job.id, task);
    console.log(`[Cron] Scheduled: ${job.name} (${job.schedule})`);
  }
}

export async function seedDefaultCronJobs() {
  const defaults = [
    {
      name: "Process Next Content Brief",
      schedule: "0 */6 * * *",
      taskType: "process_brief",
    },
    {
      name: "Check Keyword Rankings",
      schedule: "0 6 * * *",
      taskType: "check_keywords",
    },
    {
      name: "Check AI Citations",
      schedule: "0 9 * * *",
      taskType: "check_citations",
    },
  ];

  for (const job of defaults) {
    await prisma.cronJob.upsert({
      where: { name: job.name },
      update: {},
      create: job,
    });
  }
}

export function stopAllCrons() {
  for (const [id, task] of activeCrons) {
    task.stop();
    activeCrons.delete(id);
  }
}
