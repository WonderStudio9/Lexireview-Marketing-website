"use client";

import * as React from "react";
import { Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { downloadPdf } from "@/lib/pdf/download";

interface DownloadPdfButtonProps {
  toolSlug: string;
  title: string;
  /** Plain text content to render into the PDF */
  content: string;
  /** Optional: if the user is premium, enables watermark + verified seal */
  premium?: boolean;
  leadId?: string;
  generatedFor?: string;
  stateSpecific?: string;
  toolCompletionId?: string;
  size?: "sm" | "default" | "lg";
  variant?: "outline" | "default";
  label?: string;
}

/**
 * Single-click PDF download for any tool output. Drop into any result page.
 * Uses the /api/pdf endpoint which streams a rendered PDF.
 */
export function DownloadPdfButton({
  toolSlug,
  title,
  content,
  premium = false,
  leadId,
  generatedFor,
  stateSpecific,
  toolCompletionId,
  size = "sm",
  variant = "outline",
  label,
}: DownloadPdfButtonProps) {
  const [loading, setLoading] = React.useState(false);

  async function handleClick() {
    setLoading(true);
    const ok = await downloadPdf({
      toolSlug,
      title,
      content,
      leadId,
      generatedFor,
      stateSpecific,
      premium,
      toolCompletionId,
    });
    setLoading(false);
    if (!ok) toast.error("PDF download failed. Try again.");
    else toast.success("PDF downloaded");
  }

  return (
    <Button
      type="button"
      onClick={handleClick}
      disabled={loading || !content}
      size={size}
      variant={variant}
      className={size === "sm" ? "h-9" : ""}
    >
      {loading ? (
        <Loader2 size={14} className="animate-spin" />
      ) : (
        <>
          <Download size={14} /> {label || "Download PDF"}
        </>
      )}
    </Button>
  );
}
