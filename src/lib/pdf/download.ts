/**
 * Client-side helper to download a tool's output as a PDF.
 * All 34 tools call this from their result pages.
 */

export interface DownloadPdfParams {
  toolSlug: string;
  title: string;
  content: string;
  leadId?: string;
  generatedFor?: string;
  premium?: boolean;
  stateSpecific?: string;
  toolCompletionId?: string;
}

export async function downloadPdf(params: DownloadPdfParams): Promise<boolean> {
  try {
    const res = await fetch("/api/pdf", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      console.error("[downloadPdf] failed:", res.status, text);
      return false;
    }

    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${params.toolSlug}-${Date.now()}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);

    return true;
  } catch (err) {
    console.error("[downloadPdf] error:", err);
    return false;
  }
}
