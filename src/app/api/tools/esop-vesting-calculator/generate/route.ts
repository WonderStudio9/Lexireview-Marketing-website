import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { generateEsop } from "@/lib/tools/generators/esop";

const schema = z.object({
  granteeName: z.string().min(1),
  totalOptions: z.number().int().positive(),
  strikePriceInr: z.number().nonnegative(),
  vestingFrequency: z.enum(["monthly", "quarterly", "annual"]),
  vestingYears: z.number().int().positive().max(10),
  cliffMonths: z.number().int().nonnegative().max(36),
  grantDate: z.string().min(1),
  esopType: z.enum(["ISO", "NSO", "Indian ESOP"]),
  companyName: z.string().min(1),
  leadId: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const input = schema.parse(json);
    const result = generateEsop(input);

    if (input.leadId) {
      try {
        const tool = await prisma.tool.findUnique({
          where: { slug: "esop-vesting-calculator" },
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
    console.error("[esop] error:", err);
    return NextResponse.json({ ok: false, error: "Server error" }, { status: 500 });
  }
}
