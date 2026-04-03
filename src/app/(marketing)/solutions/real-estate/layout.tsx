import { generatePageMetadata } from "@/lib/seo";

export const metadata = generatePageMetadata({
  title: "Real Estate Compliance — Stamp Duty, RERA & Property Document Analysis",
  description:
    "Automated stamp duty calculations across 28 Indian states, RERA compliance detection, sale deed and lease analysis, and AI contract generation for property documents.",
  path: "/solutions/real-estate",
  keywords: [
    "real estate compliance India",
    "stamp duty calculator India",
    "RERA compliance software",
    "sale deed analysis",
    "property document review AI",
    "lease agreement analysis",
  ],
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
