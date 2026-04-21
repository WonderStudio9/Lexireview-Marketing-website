import type { Metadata } from "next";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: {
    default: "Free Legal Tools | LexiReview",
    template: "%s | LexiReview Tools",
  },
  description:
    "Free, Indian-law-aware legal tools for citizens — rent agreement, stamp duty, offer letter decoder, NDA, consumer complaint.",
};

export default function ToolsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <Toaster position="top-center" richColors />
    </>
  );
}
