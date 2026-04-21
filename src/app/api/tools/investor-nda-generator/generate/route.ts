import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { generateInvestorNda } from "@/lib/tools/generators/investor-nda";

const schema = z.object({
  companyName: z.string().min(1),
  incorporationState: z.string().min(1),
  investorName: z.string().min(1),
  investorType: z.enum(["VC", "Angel", "Corporate", "PE"]),
  purpose: z.enum(["Fundraising", "M&A", "Partnership Discussion"]),
  durationYears: z.number().int().positive().max(10),
  includeNonSolicitation: z.boolean(),
  includeNonDisparagement: z.boolean(),
  governingState: z.string().min(1),
  leadId: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const input = schema.parse(json);
    const result = generateInvestorNda(input);

    if (input.leadId) {
      try {
        const tool = await prisma.tool.findUnique({
          where: { slug: "investor-nda-generator" },
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
    console.error("[investor-nda] error:", err);
    return NextResponse.json({ ok: false, error: "Server error" }, { status: 500 });
  }
}
