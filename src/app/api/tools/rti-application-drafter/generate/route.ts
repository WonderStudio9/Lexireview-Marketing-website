import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { generateRtiApplication } from "@/lib/tools/generators/rti-application";

const schema = z.object({
  publicAuthorityName: z.string().min(1),
  publicAuthorityAddress: z.string().min(1),
  picoDesignation: z.string().optional(),
  informationSought: z.string().min(10),
  timePeriod: z.string().min(1),
  applicantName: z.string().min(1),
  applicantAddress: z.string().min(1),
  applicantPhone: z.string().min(1),
  applicantEmail: z.string().email(),
  isBplCategory: z.boolean(),
  deliveryMode: z.enum(["Email", "Post", "In-person"]),
  state: z.string().min(1),
  leadId: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const input = schema.parse(json);

    const result = generateRtiApplication(input);

    if (input.leadId) {
      try {
        const tool = await prisma.tool.findUnique({
          where: { slug: "rti-application-drafter" },
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
    console.error("[rti-application] error:", err);
    return NextResponse.json(
      { ok: false, error: "Server error" },
      { status: 500 }
    );
  }
}
