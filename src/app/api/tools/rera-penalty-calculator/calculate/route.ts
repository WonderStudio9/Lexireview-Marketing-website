import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { generateReraPenalty } from "@/lib/tools/generators/rera-penalty";

const schema = z.object({
  violationType: z.enum([
    "Late Filing of Quarterly Updates",
    "Non-Registration",
    "False / Incorrect Disclosure",
    "Delayed Possession",
    "Misuse of Funds (70% Escrow)",
    "Continued Default",
  ]),
  projectCostInr: z.number().int().positive(),
  durationMonths: z.number().int().nonnegative().max(120),
  numberOfViolations: z.number().int().nonnegative().max(100),
  leadId: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const input = schema.parse(json);

    const result = generateReraPenalty(input);

    if (input.leadId) {
      try {
        const tool = await prisma.tool.findUnique({
          where: { slug: "rera-penalty-calculator" },
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
    console.error("[rera-penalty] error:", err);
    return NextResponse.json(
      { ok: false, error: "Server error" },
      { status: 500 }
    );
  }
}
