import { NextResponse } from "next/server";
import { z } from "zod";
import Anthropic from "@anthropic-ai/sdk";
import { prisma } from "@/lib/db";

const schema = z.object({
  offerText: z.string().min(50).max(20000),
  leadId: z.string().optional(),
});

const SYSTEM_PROMPT = `You are a senior Indian employment lawyer assisting a candidate who just received an offer letter.

Analyze the offer letter and return a STRICT JSON object with this schema (no markdown, no prose outside JSON):

{
  "summary": string, // 2-3 sentence plain-English summary
  "compensation": {
    "ctc": string | null, // total CTC as printed ("₹18,00,000 p.a.") or null if not found
    "inHandEstimate": string | null, // realistic monthly in-hand estimate after tax (approx)
    "breakdown": [ { "label": string, "amount": string, "notes": string | null } ]
  },
  "redFlags": [ { "title": string, "detail": string, "severity": "high" | "medium" | "low" } ],
  "standardClauses": string[], // clauses that look normal/standard in India
  "nonStandardClauses": string[], // clauses that are unusual or aggressive
  "negotiationTips": string[], // 3-6 actionable negotiation levers
  "questionsForHr": string[] // 3-6 questions candidate should ask HR before signing
}

Guidelines:
- Focus on Indian context: notice period, non-compete enforceability (Section 27 ICA), bond clauses, garden leave, joining bonus clawback, PF, gratuity, ESOP vesting.
- Flag anything >2 months notice period, bond amounts >₹2L, non-solicits >24 months, unilateral change clauses, arbitration clauses forcing travel.
- Be concrete: quote exact language in redFlags.detail when you can.
- If something is missing from the text, say so in questionsForHr.
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
          content: `Here is the offer letter. Analyze it and return the JSON.\n\n---\n\n${input.offerText}\n\n---`,
        },
      ],
    });

    const textBlock = msg.content.find((c) => c.type === "text");
    if (!textBlock || textBlock.type !== "text") {
      throw new Error("Unexpected response from Claude");
    }

    const raw = textBlock.text.trim();
    // Tolerate accidental code-fence wrapping
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
          where: { slug: "offer-letter-decoder" },
        });
        if (tool) {
          await prisma.toolCompletion.create({
            data: {
              toolId: tool.id,
              leadId: input.leadId,
              inputData: {
                offerTextLen: input.offerText.length,
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
    console.error("[offer-letter] error:", err);
    return NextResponse.json(
      { ok: false, error: "Server error" },
      { status: 500 }
    );
  }
}
