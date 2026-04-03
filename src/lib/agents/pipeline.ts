import Anthropic from "@anthropic-ai/sdk";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { AGENT_PROMPTS } from "./prompts";
import type { AgentName, AgentInput } from "./types";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const PIPELINE_ORDER: AgentName[] = [
  "strategy",
  "writer",
  "legal",
  "seo",
  "quality",
];

async function runAgent(
  agentName: AgentName,
  input: AgentInput
): Promise<Record<string, unknown>> {
  const startTime = Date.now();
  const systemPrompt = AGENT_PROMPTS[agentName];

  if (!systemPrompt) {
    throw new Error(`No prompt defined for agent: ${agentName}`);
  }

  try {
    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 8192,
      system: systemPrompt,
      messages: [
        {
          role: "user",
          content: JSON.stringify(input),
        },
      ],
    });

    const responseText =
      message.content[0].type === "text" ? message.content[0].text : "";

    let result: Record<string, unknown>;
    try {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      result = jsonMatch ? JSON.parse(jsonMatch[0]) : { raw: responseText };
    } catch {
      result = { raw: responseText };
    }

    const durationMs = Date.now() - startTime;

    await prisma.agentLog.create({
      data: {
        briefId: input.briefId,
        agentName,
        action: `${agentName}_complete`,
        input: input as unknown as Prisma.InputJsonValue,
        output: result as unknown as Prisma.InputJsonValue,
        durationMs,
      },
    });

    return result;
  } catch (error) {
    const durationMs = Date.now() - startTime;
    const errorMsg =
      error instanceof Error ? error.message : "Unknown error";

    await prisma.agentLog.create({
      data: {
        briefId: input.briefId,
        agentName,
        action: `${agentName}_error`,
        input: input as unknown as Prisma.InputJsonValue,
        error: errorMsg,
        durationMs,
      },
    });

    throw error;
  }
}

export async function runPipeline(briefId: string) {
  const brief = await prisma.contentBrief.findUniqueOrThrow({
    where: { id: briefId },
  });

  const agentInput: AgentInput = {
    briefId: brief.id,
    topic: brief.topic,
    icp: brief.icp,
    channel: brief.channel,
    funnelStage: brief.funnelStage,
    cluster: brief.cluster,
    keywords: brief.keywords,
    previousOutputs: {},
  };

  const outputs: Record<string, unknown> = {};

  for (const agentName of PIPELINE_ORDER) {
    const statusMap: Record<string, string> = {
      strategy: "STRATEGY",
      writer: "DRAFTING",
      legal: "LEGAL_REVIEW",
      seo: "SEO_OPTIMIZATION",
      quality: "QUALITY_CHECK",
    };

    await prisma.contentBrief.update({
      where: { id: briefId },
      data: { status: statusMap[agentName] as never },
    });

    agentInput.previousOutputs = outputs;
    const result = await runAgent(agentName, agentInput);
    outputs[agentName] = result;

    // After quality agent, check score and decide
    if (agentName === "quality") {
      const score = (result as { score?: number }).score ?? 0;
      const recommendation =
        (result as { recommendation?: string }).recommendation ?? "REJECT";

      if (recommendation === "PUBLISH" || score >= 85) {
        await prisma.contentBrief.update({
          where: { id: briefId },
          data: { status: "APPROVED" },
        });
      } else if (recommendation === "REJECT" || score < 70) {
        await prisma.contentBrief.update({
          where: { id: briefId },
          data: { status: "REJECTED" },
        });
      } else {
        // REVISE — keep at QUALITY_CHECK for human review
        await prisma.contentBrief.update({
          where: { id: briefId },
          data: { status: "QUALITY_CHECK" },
        });
      }

      // Save the draft
      const writerOutput = outputs.writer as {
        title?: string;
        metaTitle?: string;
        metaDesc?: string;
        bodyMdx?: string;
      } | undefined;
      const seoOutput = outputs.seo as {
        optimizedBody?: string;
        optimizedTitle?: string;
        optimizedMeta?: string;
      } | undefined;

      await prisma.contentDraft.create({
        data: {
          briefId,
          title: seoOutput?.optimizedTitle ?? writerOutput?.title ?? brief.topic,
          metaTitle: seoOutput?.optimizedTitle ?? writerOutput?.metaTitle,
          metaDesc: seoOutput?.optimizedMeta ?? writerOutput?.metaDesc,
          bodyMdx: seoOutput?.optimizedBody ?? writerOutput?.bodyMdx ?? "",
          agentOutputs: outputs as unknown as Prisma.InputJsonValue,
          qualityScore: score,
        },
      });
    }
  }

  return outputs;
}

export async function publishContent(briefId: string) {
  const brief = await prisma.contentBrief.findUniqueOrThrow({
    where: { id: briefId },
    include: { drafts: { orderBy: { createdAt: "desc" }, take: 1 } },
  });

  const draft = brief.drafts[0];
  if (!draft) throw new Error("No draft found for this brief");

  const slug = (draft.title ?? brief.topic)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  const seoOutput = (draft.agentOutputs as Record<string, unknown>)?.seo as {
    schemaMarkup?: Record<string, unknown>;
  } | undefined;

  const published = await prisma.publishedContent.create({
    data: {
      briefId,
      slug,
      title: draft.title ?? brief.topic,
      metaTitle: draft.metaTitle,
      metaDesc: draft.metaDesc,
      bodyMdx: draft.bodyMdx ?? "",
      schema: seoOutput?.schemaMarkup as unknown as Prisma.InputJsonValue,
    },
  });

  await prisma.contentBrief.update({
    where: { id: briefId },
    data: { status: "PUBLISHED" },
  });

  return published;
}
