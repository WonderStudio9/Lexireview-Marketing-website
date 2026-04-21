import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { generateRetainerAgreement } from "@/lib/tools/generators/retainer-agreement";
import { RETAINER_TYPES } from "@/lib/tools/types";

const schema = z.object({
  retainerType: z.enum(RETAINER_TYPES),
  firmName: z.string().min(1),
  lawyerName: z.string().min(1),
  lawyerAddress: z.string().min(1),
  barCouncilNumber: z.string().optional(),
  clientName: z.string().min(1),
  clientAddress: z.string().min(1),
  matterDescription: z.string().min(1),
  hourlyRate: z.number().int().nonnegative(),
  retainerAmount: z.number().int().nonnegative(),
  billingCycle: z.enum(["Monthly", "Quarterly", "Milestone"]),
  includedServices: z.string().min(1),
  exclusions: z.string().min(1),
  governingState: z.string().min(1),
  includeBciCompliance: z.boolean(),
  leadId: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const input = schema.parse(json);

    const result = generateRetainerAgreement(input);

    if (input.leadId) {
      try {
        const tool = await prisma.tool.findUnique({
          where: { slug: "retainer-agreement-generator" },
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
    console.error("[retainer-agreement] error:", err);
    return NextResponse.json(
      { ok: false, error: "Server error" },
      { status: 500 }
    );
  }
}
