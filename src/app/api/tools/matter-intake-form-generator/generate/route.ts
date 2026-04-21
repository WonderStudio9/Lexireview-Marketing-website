import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { generateMatterIntakeForm } from "@/lib/tools/generators/matter-intake";
import { PRACTICE_AREAS, BILLING_MODELS } from "@/lib/tools/types";

const schema = z.object({
  practiceArea: z.enum(PRACTICE_AREAS),
  firmName: z.string().min(1),
  lawyerName: z.string().min(1),
  state: z.string().min(1),
  billingModel: z.enum(BILLING_MODELS),
  includeConflictChecks: z.boolean(),
  includeKyc: z.boolean(),
  leadId: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const input = schema.parse(json);

    const result = generateMatterIntakeForm(input);

    if (input.leadId) {
      try {
        const tool = await prisma.tool.findUnique({
          where: { slug: "matter-intake-form-generator" },
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
    console.error("[matter-intake] error:", err);
    return NextResponse.json(
      { ok: false, error: "Server error" },
      { status: 500 }
    );
  }
}
