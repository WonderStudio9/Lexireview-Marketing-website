import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { generateWill } from "@/lib/tools/generators/will";

const witnessSchema = z.object({
  name: z.string().min(1),
  address: z.string().min(1),
});

const schema = z.object({
  testatorName: z.string().min(1),
  fatherName: z.string().min(1),
  age: z.number().int().min(18).max(130),
  address: z.string().min(1),
  religion: z.enum([
    "Hindu",
    "Muslim",
    "Christian",
    "Parsi",
    "Sikh",
    "Other",
  ]),
  assets: z
    .array(
      z.object({
        description: z.string().min(1),
        approxValue: z.number().int().nonnegative().optional(),
      })
    )
    .min(1),
  beneficiaries: z
    .array(
      z.object({
        name: z.string().min(1),
        relationship: z.string().min(1),
        sharePct: z.number().positive().max(100),
      })
    )
    .min(1),
  executorName: z.string().min(1),
  executorAddress: z.string().min(1),
  witnesses: z.tuple([witnessSchema, witnessSchema]),
  city: z.string().min(1),
  state: z.string().min(1),
  leadId: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const input = schema.parse(json);

    const result = generateWill(input);

    if (input.leadId) {
      try {
        const tool = await prisma.tool.findUnique({
          where: { slug: "will-drafter" },
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
    console.error("[will-drafter] error:", err);
    return NextResponse.json(
      { ok: false, error: "Server error" },
      { status: 500 }
    );
  }
}
