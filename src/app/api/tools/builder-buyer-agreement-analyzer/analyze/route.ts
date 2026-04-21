import { NextResponse } from "next/server";
import { z } from "zod";
import Anthropic from "@anthropic-ai/sdk";
import { prisma } from "@/lib/db";

const schema = z.object({
  agreementText: z.string().min(200).max(30000),
  leadId: z.string().optional(),
});

const SYSTEM_PROMPT = `You are a senior Indian real-estate lawyer who reviews Builder-Buyer Agreements for allottees and home-buyers.

Analyze the agreement and return a STRICT JSON object with this schema (no markdown, no prose outside JSON):

{
  "summary": string, // 2-3 sentence plain-English summary
  "clausesIdentified": [
    { "label": string, "found": boolean, "notes": string | null }
    // include: Definition of carpet area, Payment schedule, Possession date, Delay penalty, Force majeure, Termination, Arbitration, Indemnity, Maintenance, Parking / common areas, Tax allocation, Nomination, Assignment, Escrow mechanism
  ],
  "section18Compliance": { "status": string, "detail": string }, // RERA § 18 — delay penalty / refund with interest
  "section13Compliance": { "status": string, "detail": string }, // RERA § 13 — no more than 10% advance before executing agreement for sale
  "section14Compliance": { "status": string, "detail": string }, // RERA § 14 — carpet-area definition + adherence to sanctioned plan
  "section19Compliance": { "status": string, "detail": string }, // RERA § 19 — allottee rights, common areas, occupancy certificate, tripartite arrangement
  "redFlags": [
    { "title": string, "detail": string, "severity": "high" | "medium" | "low" }
  ],
  "marketStandard": string[], // clauses aligned to Indian market-standard (fair delay clauses, MCLR+2% interest, bilateral arbitration)
  "nonStandard": string[], // one-sided / builder-favouring clauses that allottees can push back on
  "recommendations": string[], // 4-6 concrete fixes / additions
  "questionsForDeveloper": string[] // 3-5 questions to ask before signing
}

Indian context:
- RERA § 13: No more than 10% of cost as advance before execution of agreement for sale.
- RERA § 14(2): Deviations from sanctioned plans require two-thirds allottee consent. Structural defect liability is 5 years from possession.
- RERA § 18: Refund with interest (MCLR + 2%) if delayed; allottee may choose to stay with interest for every month of delay.
- RERA § 19: Allottee entitled to necessary documents, possession as per agreement, OC, and is obliged to pay instalments and form association.
- Section 11(5) of RERA and state-rules: All agreements with allottees must be in the model format prescribed by the state (MahaRERA Model Form, HRERA, TNRERA etc.).
- Red flags to watch: unilateral termination by builder, forfeiture of up to 20% earnest money, interest asymmetry (builder pays low %, buyer pays high %), unilateral changes to plans, super-area pricing, no escrow reference.
- Quote exact language in redFlags.detail where possible.
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
          content: `Here is the Builder-Buyer Agreement. Analyze it and return the JSON.\n\n---\n\n${input.agreementText}\n\n---`,
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
          where: { slug: "builder-buyer-agreement-analyzer" },
        });
        if (tool) {
          await prisma.toolCompletion.create({
            data: {
              toolId: tool.id,
              leadId: input.leadId,
              inputData: {
                agreementTextLen: input.agreementText.length,
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
    console.error("[builder-buyer-analyzer] error:", err);
    return NextResponse.json(
      { ok: false, error: "Server error" },
      { status: 500 }
    );
  }
}
