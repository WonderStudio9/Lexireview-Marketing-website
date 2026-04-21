import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { generateReraCompliance } from "@/lib/tools/generators/rera-compliance";

const schema = z.object({
  state: z.string().min(1),
  projectType: z.enum(["Residential", "Commercial", "Mixed-use"]),
  projectAreaSqft: z.number().int().positive(),
  plotCount: z.number().int().nonnegative(),
  registrationStatus: z.enum([
    "Registered",
    "Pending",
    "Not Registered",
    "Exempt",
  ]),
  carpetAreaDisclosed: z.boolean(),
  builtUpAreaDisclosed: z.boolean(),
  escrowAccount: z.boolean(),
  websitePublished: z.boolean(),
  seventyPctEscrowCompliant: z.boolean(),
  quarterlyUpdatesFiled: z.boolean(),
  leadId: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const input = schema.parse(json);

    const result = generateReraCompliance(input);

    if (input.leadId) {
      try {
        const tool = await prisma.tool.findUnique({
          where: { slug: "rera-compliance-checker" },
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
    console.error("[rera-compliance] error:", err);
    return NextResponse.json(
      { ok: false, error: "Server error" },
      { status: 500 }
    );
  }
}
