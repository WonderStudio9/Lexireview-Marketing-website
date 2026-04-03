import { generatePageMetadata } from "@/lib/seo";

export const metadata = generatePageMetadata({
  title: "LexiReview vs Leegality — Beyond E-Signatures",
  description:
    "Compare LexiReview and Leegality. Leegality excels at e-signatures; LexiReview provides AI-powered contract analysis, risk scoring, and regulatory compliance before you sign.",
  path: "/compare/leegality",
  keywords: [
    "LexiReview vs Leegality",
    "Leegality alternative",
    "contract analysis vs e-signature",
    "Indian legal tech comparison",
    "Leegality competitor",
  ],
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
