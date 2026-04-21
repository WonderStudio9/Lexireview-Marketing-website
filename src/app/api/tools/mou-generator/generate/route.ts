import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { generateMou } from "@/lib/tools/generators/mou";

const partySchema = z.object({
  name: z.string().min(1),
  designation: z.string().min(1),
  organization: z.string().min(1),
});

const schema = z.object({
  mouType: z.enum([
    "Co-founder",
    "Advisor",
    "Business Partnership",
    "Channel Partner",
  ]),
  parties: z.array(partySchema).min(2).max(6),
  purpose: z.string().min(5),
  termMonths: z.number().int().positive().max(240),
  consideration: z.enum(["equity", "cash", "both", "none"]),
  considerationDetails: z.string().optional(),
  includeConfidentiality: z.boolean(),
  includeExclusivity: z.boolean(),
  governingState: z.string().min(1),
  leadId: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const input = schema.parse(json);
    const result = generateMou(input);

    if (input.leadId) {
      try {
        const tool = await prisma.tool.findUnique({
          where: { slug: "mou-generator" },
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
    console.error("[mou] error:", err);
    return NextResponse.json({ ok: false, error: "Server error" }, { status: 500 });
  }
}
