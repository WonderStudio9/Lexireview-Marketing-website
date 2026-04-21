import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { generateFoundersAgreement } from "@/lib/tools/generators/founders-agreement";

const founderSchema = z.object({
  name: z.string().min(1),
  pan: z.string().optional(),
  role: z.string().min(1),
  equityPct: z.number().min(0).max(100),
  vestingYears: z.number().int().positive().max(10),
});

const schema = z.object({
  companyName: z.string().min(1),
  stateOfIncorporation: z.string().min(1),
  founders: z.array(founderSchema).min(2).max(5),
  vestingYears: z.number().int().positive().max(10),
  cliffMonths: z.number().int().nonnegative().max(36),
  includeIpAssignment: z.boolean(),
  includeNonCompete: z.boolean(),
  exitScenarios: z.object({
    death: z.boolean(),
    disability: z.boolean(),
    terminationForCause: z.boolean(),
    voluntary: z.boolean(),
  }),
  leadId: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const input = schema.parse(json);
    const result = generateFoundersAgreement(input);

    if (input.leadId) {
      try {
        const tool = await prisma.tool.findUnique({
          where: { slug: "founders-agreement-generator" },
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
    console.error("[founders-agreement] error:", err);
    return NextResponse.json({ ok: false, error: "Server error" }, { status: 500 });
  }
}
