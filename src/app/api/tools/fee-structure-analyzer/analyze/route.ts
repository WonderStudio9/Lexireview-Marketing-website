import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { analyzeFee } from "@/lib/tools/fee-benchmarks";
import { PRACTICE_AREAS, CITY_TIERS } from "@/lib/tools/types";

const schema = z.object({
  yearsExperience: z.number().int().min(0).max(40),
  practiceArea: z.enum(PRACTICE_AREAS),
  cityTier: z.enum(CITY_TIERS),
  currentHourlyRate: z.number().int().nonnegative(),
  currentRetainer: z.number().int().nonnegative(),
  activeMatters: z.number().int().nonnegative(),
  leadId: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const input = schema.parse(json);

    const result = analyzeFee(input);

    if (input.leadId) {
      try {
        const tool = await prisma.tool.findUnique({
          where: { slug: "fee-structure-analyzer" },
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
    console.error("[fee-analyzer] error:", err);
    return NextResponse.json(
      { ok: false, error: "Server error" },
      { status: 500 }
    );
  }
}
