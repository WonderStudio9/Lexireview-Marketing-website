import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { generateTripartiteAgreement } from "@/lib/tools/generators/tripartite-agreement";

const partySchema = z.object({
  name: z.string().min(1),
  address: z.string().min(1),
  contact: z.string().optional(),
});

const schema = z.object({
  builder: partySchema,
  buyer: partySchema,
  bank: partySchema,
  propertyDescription: z.string().min(1),
  propertyAddress: z.string().min(1),
  loanAmount: z.number().int().positive(),
  constructionStage: z.enum([
    "Pre-Construction",
    "Foundation",
    "Plinth",
    "Slabs",
    "Walls",
    "Finishing",
    "Ready to Move",
  ]),
  escrowMechanism: z.string().min(1),
  state: z.string().min(1),
  city: z.string().min(1),
  leadId: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const input = schema.parse(json);

    const result = generateTripartiteAgreement(input);

    if (input.leadId) {
      try {
        const tool = await prisma.tool.findUnique({
          where: { slug: "tripartite-agreement-generator" },
        });
        if (tool) {
          await prisma.toolCompletion.create({
            data: {
              toolId: tool.id,
              leadId: input.leadId,
              inputData: input as unknown as object,
              outputData: result as unknown as object,
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

    return NextResponse.json({ ok: true, ...result });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { ok: false, error: "Invalid input", issues: err.issues },
        { status: 400 }
      );
    }
    // eslint-disable-next-line no-console
    console.error("[tripartite-agreement] error:", err);
    return NextResponse.json(
      { ok: false, error: "Server error" },
      { status: 500 }
    );
  }
}
