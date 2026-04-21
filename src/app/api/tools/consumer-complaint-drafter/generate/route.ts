import { NextResponse } from "next/server";
import { z } from "zod";
import { generateConsumerComplaint } from "@/lib/tools/generators/consumer-complaint";
import { prisma } from "@/lib/db";

const schema = z.object({
  complaintType: z.enum([
    "Product defect",
    "Service deficiency",
    "Fraud",
    "E-commerce issue",
    "Banking",
    "Insurance",
    "Other",
  ]),
  company: z.object({
    name: z.string().min(1),
    address: z.string().min(1),
  }),
  complainant: z.object({
    name: z.string().min(1),
    address: z.string().min(1),
    phone: z.string().min(1),
    email: z.string().email(),
  }),
  transactionDate: z.string().min(1),
  amountInvolved: z.number().int().nonnegative(),
  issueDescription: z.string().min(10),
  stepsTaken: z.array(z.string()),
  compensationSought: z.string().min(5),
  leadId: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const input = schema.parse(json);

    const result = generateConsumerComplaint(input);

    if (input.leadId) {
      try {
        const tool = await prisma.tool.findUnique({
          where: { slug: "consumer-complaint-drafter" },
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
    console.error("[complaint] error:", err);
    return NextResponse.json(
      { ok: false, error: "Server error" },
      { status: 500 }
    );
  }
}
