import { generatePageMetadata } from "@/lib/seo";

export const metadata = generatePageMetadata({
  title: "Pricing — Plans Starting Free, Pay-As-You-Go Credits",
  description:
    "Start with 3 free contract reviews. Monthly plans from ₹4,999. Pay-as-you-go credits from ₹99. 30-day money-back guarantee. No credit card for free trial.",
  path: "/pricing",
  keywords: [
    "LexiReview pricing",
    "AI contract review pricing India",
    "legal tech pricing",
    "contract analysis cost",
    "affordable legal AI India",
  ],
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
