import { generatePageMetadata } from "@/lib/seo";

export const metadata = generatePageMetadata({
  title: "Offer Letter Decoder, Notice Period & Gratuity — Employees in India",
  description:
    "Free tools for Indian employees: AI offer letter decoder, notice period rules checker, gratuity calculator, salary structure analyzer. Know what you’re signing before you sign.",
  path: "/citizens/employees",
  keywords: [
    "offer letter decoder India",
    "notice period rules India",
    "gratuity calculator",
    "salary structure analyzer",
    "employment contract review",
    "non-compete India legal",
  ],
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
