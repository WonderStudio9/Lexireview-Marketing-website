import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { generateFreelancerContract } from "@/lib/tools/generators/freelancer-contract";

const milestoneSchema = z.object({
  description: z.string().min(1),
  amount: z.number().nonnegative(),
  dueDate: z.string().optional(),
});

const schema = z.object({
  freelancerName: z.string().min(1),
  freelancerAddress: z.string().min(1),
  freelancerPan: z.string().optional(),
  freelancerGstin: z.string().optional(),
  clientName: z.string().min(1),
  clientAddress: z.string().min(1),
  clientGstin: z.string().optional(),
  projectScope: z.string().min(5),
  deliverables: z.string().min(5),
  paymentType: z.enum(["Hourly", "Fixed Project", "Milestone"]),
  hourlyRate: z.number().nonnegative().optional(),
  fixedAmount: z.number().nonnegative().optional(),
  milestones: z.array(milestoneSchema).optional(),
  paymentTermDays: z.number().int().positive().max(180),
  ipAssignment: z.boolean(),
  confidentiality: z.boolean(),
  governingState: z.string().min(1),
  startDate: z.string().min(1),
  endDate: z.string().optional(),
  leadId: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const input = schema.parse(json);

    const result = generateFreelancerContract(input);

    if (input.leadId) {
      try {
        const tool = await prisma.tool.findUnique({
          where: { slug: "freelancer-contract-simple" },
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
    console.error("[freelancer-contract] error:", err);
    return NextResponse.json(
      { ok: false, error: "Server error" },
      { status: 500 }
    );
  }
}
