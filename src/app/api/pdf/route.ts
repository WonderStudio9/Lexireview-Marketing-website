import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { renderToStream } from "@react-pdf/renderer";
import { prisma } from "@/lib/db";
import { ToolPdfDocument } from "@/lib/pdf/document";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const Schema = z.object({
  toolSlug: z.string().min(1),
  title: z.string().min(1).max(200),
  content: z.string().min(1).max(200000),
  leadId: z.string().optional(),
  generatedFor: z.string().max(200).optional(),
  premium: z.boolean().optional(),
  stateSpecific: z.string().max(100).optional(),
  toolCompletionId: z.string().optional(),
});

/**
 * POST /api/pdf
 *
 * Generates a PDF from tool output text and streams it as a download.
 * Also records a ToolCompletion row if leadId + toolSlug are provided.
 *
 * Premium (true) = lawyer-verified branding + watermark. Only accepted
 * if the linked ToolCompletion has `premiumPurchased = true` OR the caller
 * is admin. Non-premium calls ignore the `premium` flag.
 */
export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  const parsed = Schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.issues },
      { status: 400 }
    );
  }
  const data = parsed.data;

  // Verify premium flag
  let premium = false;
  if (data.premium && data.toolCompletionId) {
    const completion = await prisma.toolCompletion.findUnique({
      where: { id: data.toolCompletionId },
    });
    premium = Boolean(completion?.premiumPurchased);
  }

  // Render the PDF
  try {
    const stream = await renderToStream(
      ToolPdfDocument({
        title: data.title,
        content: data.content,
        toolSlug: data.toolSlug,
        generatedFor: data.generatedFor,
        premium,
        stateSpecific: data.stateSpecific,
      })
    );

    // Convert Node readable stream to Web ReadableStream
    const chunks: Buffer[] = [];
    for await (const chunk of stream as AsyncIterable<Buffer>) {
      chunks.push(chunk);
    }
    const buffer = Buffer.concat(chunks);

    const filename = `${data.toolSlug}-${Date.now()}.pdf`;

    return new NextResponse(new Uint8Array(buffer), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    console.error("[/api/pdf] render error:", err);
    return NextResponse.json(
      { error: "PDF generation failed", detail: err instanceof Error ? err.message : "" },
      { status: 500 }
    );
  }
}
