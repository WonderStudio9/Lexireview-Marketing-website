import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { generateCapTable } from "@/lib/tools/generators/cap-table";

const founderSchema = z.object({
  name: z.string().min(1),
  equityPct: z.number().min(0).max(100),
});

const schema = z.object({
  companyName: z.string().min(1),
  stage: z.enum(["pre-seed", "seed", "series A", "series B"]),
  founders: z.array(founderSchema).min(1).max(5),
  esopPoolPct: z.number().min(0).max(30),
  includePreferred: z.boolean(),
  angelInvestorCount: z.number().int().min(0).max(10),
  nextRoundSizeCr: z.number().nonnegative(),
  nextRoundValuationCr: z.number().positive(),
  leadId: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const input = schema.parse(json);
    const result = generateCapTable(input);

    if (input.leadId) {
      try {
        const tool = await prisma.tool.findUnique({
          where: { slug: "cap-table-template" },
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
    console.error("[cap-table] error:", err);
    return NextResponse.json({ ok: false, error: "Server error" }, { status: 500 });
  }
}
