import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { generateRentalReceipt } from "@/lib/tools/generators/rental-receipt";

const schema = z.object({
  tenantName: z.string().min(1),
  tenantAddress: z.string().optional(),
  landlordName: z.string().min(1),
  landlordAddress: z.string().min(1),
  landlordPan: z.string().optional(),
  propertyAddress: z.string().min(1),
  monthYear: z.string().min(1),
  amount: z.number().positive(),
  paymentMode: z.enum(["Cash", "Bank Transfer", "UPI", "Cheque"]),
  paymentDate: z.string().min(1),
  leadId: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const input = schema.parse(json);

    const result = generateRentalReceipt(input);

    if (input.leadId) {
      try {
        const tool = await prisma.tool.findUnique({
          where: { slug: "rental-receipt-generator" },
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
    console.error("[rental-receipt] error:", err);
    return NextResponse.json(
      { ok: false, error: "Server error" },
      { status: 500 }
    );
  }
}
