import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { generateStartupEmployment } from "@/lib/tools/generators/startup-employment";

const schema = z.object({
  companyName: z.string().min(1),
  companyAddress: z.string().min(1),
  employee: z.object({
    name: z.string().min(1),
    pan: z.string().optional(),
    designation: z.string().min(1),
    state: z.string().min(1),
  }),
  employmentType: z.enum(["Full-time", "Part-time", "Contract", "Intern"]),
  ctc: z.object({
    basic: z.number().nonnegative(),
    hra: z.number().nonnegative(),
    specialAllowance: z.number().nonnegative(),
    variable: z.number().nonnegative(),
    esopCount: z.number().nonnegative().optional(),
  }),
  joiningBonus: z.number().nonnegative(),
  joiningBonusClawbackMonths: z.number().int().nonnegative().max(36),
  noticePeriodDays: z.union([z.literal(30), z.literal(60), z.literal(90)]),
  includeNonCompete: z.boolean(),
  includeNonSolicitation: z.boolean(),
  includeIpAssignment: z.boolean(),
  gardenLeave: z.boolean(),
  joiningDate: z.string().min(1),
  leadId: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const input = schema.parse(json);
    const result = generateStartupEmployment(input);

    if (input.leadId) {
      try {
        const tool = await prisma.tool.findUnique({
          where: { slug: "startup-employment-contract" },
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
    console.error("[startup-employment] error:", err);
    return NextResponse.json({ ok: false, error: "Server error" }, { status: 500 });
  }
}
