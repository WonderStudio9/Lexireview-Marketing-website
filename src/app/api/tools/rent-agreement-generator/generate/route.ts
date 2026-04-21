import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { generateRentAgreement } from "@/lib/tools/generators/rent-agreement";

const schema = z.object({
  state: z.string().min(1),
  city: z.string().min(1),
  propertyType: z.enum(["Residential", "Commercial"]),
  monthlyRent: z.number().int().positive(),
  securityDeposit: z.number().int().nonnegative(),
  rentalPeriodMonths: z.number().int().positive().max(120),
  lockInMonths: z.number().int().nonnegative().max(60),
  startDate: z.string().min(1),
  lessor: z.object({
    name: z.string().min(1),
    fatherName: z.string().min(1),
    address: z.string().min(1),
    pan: z.string().optional(),
  }),
  lessee: z.object({
    name: z.string().min(1),
    fatherName: z.string().min(1),
    address: z.string().min(1),
    pan: z.string().optional(),
  }),
  amenities: z.array(z.string()).default([]),
  leadId: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const input = schema.parse(json);

    const result = generateRentAgreement(input);

    // Persist the completion when a leadId is available.
    if (input.leadId) {
      try {
        const tool = await prisma.tool.findUnique({
          where: { slug: "rent-agreement-generator" },
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
    console.error("[rent-agreement] error:", err);
    return NextResponse.json(
      { ok: false, error: "Server error" },
      { status: 500 }
    );
  }
}
