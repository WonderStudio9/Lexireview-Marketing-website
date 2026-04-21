import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { generateTimeTrackingTemplate } from "@/lib/tools/generators/time-tracking";
import { PRACTICE_AREAS } from "@/lib/tools/types";

const schema = z.object({
  billingModel: z.enum(["Hourly", "Flat", "Mixed"]),
  baseHourlyRate: z.number().int().nonnegative(),
  practiceArea: z.enum(PRACTICE_AREAS),
  numLawyers: z.number().int().min(1).max(5),
  includeParalegal: z.boolean(),
  roundingRule: z.enum(["6-min", "15-min", "30-min"]),
  includeNonBillable: z.boolean(),
  leadId: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const input = schema.parse(json);

    const result = generateTimeTrackingTemplate(input);

    if (input.leadId) {
      try {
        const tool = await prisma.tool.findUnique({
          where: { slug: "time-tracking-template" },
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
    console.error("[time-tracking] error:", err);
    return NextResponse.json(
      { ok: false, error: "Server error" },
      { status: 500 }
    );
  }
}
