import { NextResponse } from "next/server";
import { z } from "zod";
import Anthropic from "@anthropic-ai/sdk";
import { prisma } from "@/lib/db";

const schema = z.object({
  salaryText: z.string().min(20).max(20000),
  leadId: z.string().optional(),
});

const SYSTEM_PROMPT = `You are a senior Indian tax & compensation consultant. The user provides a salary breakdown (either pasted from their offer letter / payslip, or a description of CTC with components).

Analyze it and return STRICT JSON with this schema (no markdown, no prose outside JSON):

{
  "summary": string,
  "currentBreakdown": [ { "label": string, "amount": string, "notes": string | null } ],
  "inHandEstimate": string | null,
  "taxOptimizations": [ { "title": string, "detail": string, "monthlySavingInr": string | null } ],
  "hraOptimization": string,
  "ltaOptimization": string,
  "nps80ccd2": string,
  "restructureSuggestion": string[],
  "redFlags": [ { "title": string, "detail": string, "severity": "high" | "medium" | "low" } ],
  "questionsForHr": string[]
}

Guidelines (Indian context, new tax regime as default from FY 2024-25 unless user indicates old):
- Basic should ideally be 40-50% of CTC (enables HRA & PF, but too high bloats PF/gratuity cost-to-company).
- HRA exemption under Section 10(13A) = LEAST of (actual HRA, rent - 10% basic, 50% basic in metro / 40% non-metro).
- LTA under Section 10(5) — twice in a block of 4 years, domestic travel only.
- Section 80CCD(2) — employer NPS contribution up to 10% of basic is deductible in NEW regime (14% from FY 2024-25 for CG employees).
- Standard deduction ₹75,000 (new regime, FY 2024-25).
- Flag: if gross > ₹50L but no restructure opportunities used, if basic < 30% of CTC (HRA underutilised), if "variable" is >30% without explicit target, if "performance bonus" is disclosed as guaranteed.
- Be concrete with numbers where possible.
- Always return valid JSON. Do not wrap in code fences.`;

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const input = schema.parse(json);

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { ok: false, error: "ANTHROPIC_API_KEY not configured" },
        { status: 500 }
      );
    }

    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    const msg = await client.messages.create({
      model: "claude-sonnet-4-5-20250929",
      max_tokens: 4000,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: `Here is my salary structure. Analyze it and return JSON.\n\n---\n\n${input.salaryText}\n\n---`,
        },
      ],
    });

    const textBlock = msg.content.find((c) => c.type === "text");
    if (!textBlock || textBlock.type !== "text") {
      throw new Error("Unexpected response from Claude");
    }

    const raw = textBlock.text.trim();
    const jsonStr = raw
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/\s*```\s*$/i, "")
      .trim();

    let analysis: unknown;
    try {
      analysis = JSON.parse(jsonStr);
    } catch {
      return NextResponse.json(
        { ok: false, error: "Could not parse model response" },
        { status: 502 }
      );
    }

    if (input.leadId) {
      try {
        const tool = await prisma.tool.findUnique({
          where: { slug: "salary-structure-analyzer" },
        });
        if (tool) {
          await prisma.toolCompletion.create({
            data: {
              toolId: tool.id,
              leadId: input.leadId,
              inputData: { salaryTextLen: input.salaryText.length } as unknown as object,
              outputData: analysis as object,
            },
          });
          await prisma.tool.update({
            where: { id: tool.id },
            data: { totalCompletions: { increment: 1 } },
          });
        }
      } catch (err) {
        console.warn("ToolCompletion persistence failed:", err);
      }
    }

    return NextResponse.json({ ok: true, analysis });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { ok: false, error: "Invalid input", issues: err.issues },
        { status: 400 }
      );
    }
    console.error("[salary-structure] error:", err);
    return NextResponse.json(
      { ok: false, error: "Server error" },
      { status: 500 }
    );
  }
}
