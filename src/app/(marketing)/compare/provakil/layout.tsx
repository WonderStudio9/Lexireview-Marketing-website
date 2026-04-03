import { generatePageMetadata } from "@/lib/seo";

export const metadata = generatePageMetadata({
  title: "LexiReview vs Provakil — Contracts, Not Cases",
  description:
    "Compare LexiReview and Provakil. Provakil focuses on litigation management; LexiReview is purpose-built for contract intelligence with AI risk scoring and Indian law compliance.",
  path: "/compare/provakil",
  keywords: [
    "LexiReview vs Provakil",
    "Provakil alternative",
    "contract management vs litigation",
    "Indian legal tech comparison",
    "Provakil competitor",
  ],
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
