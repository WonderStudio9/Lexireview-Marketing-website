import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { generateCustomerMsa } from "@/lib/tools/generators/customer-msa";

const schema = z.object({
  vendor: z.object({
    name: z.string().min(1),
    address: z.string().min(1),
    state: z.string().min(1),
  }),
  customerType: z.enum(["SaaS", "Services", "Hybrid"]),
  paymentTerm: z.enum(["upfront", "monthly", "annual"]),
  sla: z.enum(["99.5%", "99.9%"]),
  dpdpApplicable: z.boolean(),
  liabilityCap: z.enum(["1x", "2x", "unlimited"]),
  governingState: z.string().min(1),
  includeArbitration: z.boolean(),
  leadId: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const input = schema.parse(json);
    const result = generateCustomerMsa(input);

    if (input.leadId) {
      try {
        const tool = await prisma.tool.findUnique({
          where: { slug: "customer-msa-generator" },
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
    console.error("[customer-msa] error:", err);
    return NextResponse.json({ ok: false, error: "Server error" }, { status: 500 });
  }
}
