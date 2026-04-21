import { NextResponse } from "next/server";
import { z } from "zod";
import { computeStampDuty } from "@/lib/tools/stamp-duty-rates";
import { prisma } from "@/lib/db";

const schema = z.object({
  state: z.string().min(1),
  transactionType: z.enum([
    "Sale Deed",
    "Gift Deed",
    "Lease",
    "Mortgage",
    "Conveyance",
    "Development Agreement",
  ]),
  propertyValue: z.number().int().positive(),
  propertyType: z.enum(["Residential", "Commercial", "Agricultural"]),
  buyerGender: z.enum(["Male", "Female", "Joint"]),
  city: z.string().min(1),
  leadId: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const input = schema.parse(json);

    const result = computeStampDuty(input);

    if (input.leadId) {
      try {
        const tool = await prisma.tool.findUnique({
          where: { slug: "stamp-duty-calculator" },
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
    console.error("[stamp-duty] error:", err);
    return NextResponse.json(
      { ok: false, error: "Server error" },
      { status: 500 }
    );
  }
}
