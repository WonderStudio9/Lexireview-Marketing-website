import { NextResponse } from "next/server";
import { z } from "zod";
import { generateNda } from "@/lib/tools/generators/nda";
import { prisma } from "@/lib/db";

const schema = z.object({
  ndaType: z.enum(["Mutual", "One-Way", "Employee-Employer", "Investor", "Vendor"]),
  disclosingParty: z.object({
    name: z.string().min(1),
    address: z.string().min(1),
    entityType: z.string().min(1),
  }),
  receivingParty: z.object({
    name: z.string().min(1),
    address: z.string().min(1),
    entityType: z.string().min(1),
  }),
  purpose: z.string().min(5),
  durationYears: z.number().int().positive().max(20),
  governingState: z.string().min(1),
  includeNonCompete: z.boolean(),
  includeNonSolicitation: z.boolean(),
  leadId: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const input = schema.parse(json);

    const result = generateNda(input);

    if (input.leadId) {
      try {
        const tool = await prisma.tool.findUnique({
          where: { slug: "nda-generator" },
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
    console.error("[nda] error:", err);
    return NextResponse.json(
      { ok: false, error: "Server error" },
      { status: 500 }
    );
  }
}
