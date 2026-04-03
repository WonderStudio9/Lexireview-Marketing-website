import { generatePageMetadata } from "@/lib/seo";

export const metadata = generatePageMetadata({
  title: "Features — AI Contract Review, Generation & Compliance",
  description:
    "6 parallel AI analysis engines, contract generation wizard, LexiBrain regulatory intelligence, Quick Triage, batch processing, and compliance certificates. Built for Indian law.",
  path: "/features",
  keywords: [
    "AI contract review features",
    "contract analysis software India",
    "legal compliance automation",
    "LexiBrain regulatory intelligence",
    "contract generation wizard",
    "batch contract processing",
    "compliance certificates India",
  ],
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
