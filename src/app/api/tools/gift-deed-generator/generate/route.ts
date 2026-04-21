import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { generateGiftDeed } from "@/lib/tools/generators/gift-deed";

const schema = z.object({
  donorName: z.string().min(1),
  donorFather: z.string().min(1),
  donorAddress: z.string().min(1),
  donorPan: z.string().optional(),
  doneeName: z.string().min(1),
  doneeFather: z.string().min(1),
  doneeAddress: z.string().min(1),
  doneePan: z.string().optional(),
  relationship: z.enum([
    "Spouse",
    "Parent",
    "Child",
    "Sibling",
    "Grandparent",
    "Grandchild",
    "Other Blood Relative",
    "Non-Relative",
  ]),
  propertyType: z.enum(["Immovable", "Movable"]),
  propertyDescription: z.string().min(5),
  propertyValue: z.number().int().nonnegative(),
  state: z.string().min(1),
  city: z.string().min(1),
  leadId: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const input = schema.parse(json);

    const result = generateGiftDeed(input);

    if (input.leadId) {
      try {
        const tool = await prisma.tool.findUnique({
          where: { slug: "gift-deed-generator" },
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
    console.error("[gift-deed] error:", err);
    return NextResponse.json(
      { ok: false, error: "Server error" },
      { status: 500 }
    );
  }
}
