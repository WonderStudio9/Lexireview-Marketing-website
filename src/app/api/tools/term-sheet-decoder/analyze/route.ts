import { NextResponse } from "next/server";
import { z } from "zod";
import Anthropic from "@anthropic-ai/sdk";
import { prisma } from "@/lib/db";

const schema = z.object({
  termSheetText: z.string().min(100).max(30000),
  leadId: z.string().optional(),
});

const SYSTEM_PROMPT = `You are a senior Indian venture-capital / M&A lawyer assisting a startup founder who has just received a term sheet.

Analyze the term sheet and return a STRICT JSON object with this schema (no markdown, no prose outside JSON):

{
  "summary": string, // 2-3 sentence plain-English summary
  "valuation": {
    "preMoney": string | null,
    "postMoney": string | null,
    "roundSize": string | null,
    "investors": string[]
  },
  "keyTerms": [
    { "label": string, "value": string, "notes": string | null }
    // include: Liquidation Preference, Participation, Anti-Dilution, Board Seats, Vesting, Protective Provisions / Veto Rights, Drag-Along, ROFR, Pro-rata, Option Pool
  ],
  "redFlags": [
    { "title": string, "detail": string, "severity": "high" | "medium" | "low" }
  ],
  "marketStandard": string[], // clauses that match Indian market-standard (1x non-participating, weighted-average broad-based anti-dilution, standard drag with super-majority)
  "nonStandard": string[], // clauses that are unusually founder-adverse OR investor-friendly
  "negotiationLevers": string[], // 4-6 concrete asks the founder can push back on
  "questionsForInvestor": string[] // 3-5 questions to ask before signing
}

Guidelines:
- Indian context: Companies Act 2013, typical Series A/seed norms in India, SEBI AIF regulations, FEMA where applicable.
- Red-flag anything like: full-ratchet anti-dilution, multiple / participating liquidation preferences, unilateral board-control veto rights, broad "material adverse change" outs, aggressive drag-along at low majority, no founder vesting carve-out for already-served time.
- For valuation fields: quote exactly as stated ("₹100 Cr post-money", "$50M post-money"). If missing, set to null.
- Be concrete: quote exact language in redFlags.detail when available.
- Return valid JSON. No code fences.`;

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
          content: `Here is the term sheet. Analyze it and return the JSON.\n\n---\n\n${input.termSheetText}\n\n---`,
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
          where: { slug: "term-sheet-decoder" },
        });
        if (tool) {
          await prisma.toolCompletion.create({
            data: {
              toolId: tool.id,
              leadId: input.leadId,
              inputData: {
                termSheetTextLen: input.termSheetText.length,
              } as unknown as object,
              outputData: analysis as object,
            },
          });
          await prisma.tool.update({
            where: { id: tool.id },
            data: { totalCompletions: { increment: 1 } },
          });
        }
      } catch (err) {
        // eslint-disable-next-line no-console
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
    // eslint-disable-next-line no-console
    console.error("[term-sheet] error:", err);
    return NextResponse.json({ ok: false, error: "Server error" }, { status: 500 });
  }
}
