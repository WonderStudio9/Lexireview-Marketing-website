import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { calculateNoticePeriod } from "@/lib/tools/generators/notice-period";

const schema = z.object({
  state: z.string().min(1),
  employeeType: z.enum(["Permanent", "Probation", "Contract"]),
  tenureMonths: z.number().int().nonnegative().max(600),
  industry: z.enum([
    "IT / ITES",
    "Manufacturing",
    "Services",
    "BFSI",
    "Healthcare",
    "Retail",
    "Other",
  ]),
  contractClause: z.string().optional(),
  leadId: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const input = schema.parse(json);

    const result = calculateNoticePeriod(input);

    if (input.leadId) {
      try {
        const tool = await prisma.tool.findUnique({
          where: { slug: "notice-period-rules-checker" },
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
    console.error("[notice-period] error:", err);
    return NextResponse.json(
      { ok: false, error: "Server error" },
      { status: 500 }
    );
  }
}
