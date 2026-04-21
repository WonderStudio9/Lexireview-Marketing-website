import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { generatePoa } from "@/lib/tools/generators/poa";

const schema = z.object({
  poaType: z.enum(["General", "Specific", "Durable"]),
  principalName: z.string().min(1),
  principalFather: z.string().min(1),
  principalAddress: z.string().min(1),
  principalIsNri: z.boolean(),
  attorneyName: z.string().min(1),
  attorneyFather: z.string().min(1),
  attorneyAddress: z.string().min(1),
  powers: z.array(z.string()).min(1),
  validityMonths: z.number().int().positive().max(600),
  state: z.string().min(1),
  city: z.string().min(1),
  leadId: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const input = schema.parse(json);

    // cast powers into the union type expected by the generator
    const result = generatePoa(input as Parameters<typeof generatePoa>[0]);

    if (input.leadId) {
      try {
        const tool = await prisma.tool.findUnique({
          where: { slug: "power-of-attorney-generator" },
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
    console.error("[poa] error:", err);
    return NextResponse.json(
      { ok: false, error: "Server error" },
      { status: 500 }
    );
  }
}
