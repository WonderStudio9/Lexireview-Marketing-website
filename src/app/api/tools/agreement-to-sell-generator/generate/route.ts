import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { generateAgreementToSell } from "@/lib/tools/generators/agreement-to-sell";

const partySchema = z.object({
  name: z.string().min(1),
  fatherName: z.string().min(1),
  address: z.string().min(1),
  pan: z.string().optional(),
});

const schema = z.object({
  seller: partySchema,
  buyer: partySchema,
  propertyPlotNo: z.string().min(1),
  propertyKhata: z.string().min(1),
  propertyBoundary: z.string().min(1),
  propertyAreaSqft: z.number().int().positive(),
  propertyAddress: z.string().min(1),
  considerationAmount: z.number().int().positive(),
  earnestMoney: z.number().int().nonnegative(),
  paymentSchedule: z.string().min(1),
  possessionDate: z.string().min(1),
  stampDutyResponsibility: z.enum(["Buyer", "Seller", "Shared (50:50)"]),
  registrationCommitment: z.boolean(),
  state: z.string().min(1),
  city: z.string().min(1),
  leadId: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const input = schema.parse(json);

    const result = generateAgreementToSell(input);

    if (input.leadId) {
      try {
        const tool = await prisma.tool.findUnique({
          where: { slug: "agreement-to-sell-generator" },
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
    console.error("[agreement-to-sell] error:", err);
    return NextResponse.json(
      { ok: false, error: "Server error" },
      { status: 500 }
    );
  }
}
