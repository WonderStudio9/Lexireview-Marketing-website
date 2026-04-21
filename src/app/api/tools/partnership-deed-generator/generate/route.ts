import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { generatePartnershipDeed } from "@/lib/tools/generators/partnership-deed";

const partnerSchema = z.object({
  name: z.string().min(1),
  address: z.string().min(1),
  pan: z.string().optional(),
  profitSharePct: z.number().nonnegative().max(100),
  capitalContribution: z.number().int().nonnegative(),
});

const schema = z.object({
  firmName: z.string().min(1),
  businessNature: z.string().min(3),
  state: z.string().min(1),
  city: z.string().min(1),
  partners: z.array(partnerSchema).min(2).max(5),
  bankName: z.string().min(1),
  duration: z.enum(["Fixed Term", "At Will"]),
  fixedTermYears: z.number().int().positive().max(99).optional(),
  commencementDate: z.string().min(1),
  leadId: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const input = schema.parse(json);

    const result = generatePartnershipDeed(input);

    if (input.leadId) {
      try {
        const tool = await prisma.tool.findUnique({
          where: { slug: "partnership-deed-generator" },
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
    console.error("[partnership-deed] error:", err);
    return NextResponse.json(
      { ok: false, error: "Server error" },
      { status: 500 }
    );
  }
}
