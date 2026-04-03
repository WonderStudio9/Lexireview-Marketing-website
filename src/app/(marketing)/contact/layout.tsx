import { generatePageMetadata } from "@/lib/seo";

export const metadata = generatePageMetadata({
  title: "Contact Sales & Book a Demo",
  description:
    "Get in touch with LexiReview. Book a personalized demo of AI-powered contract review for Indian law. Contact our sales team for enterprise pricing.",
  path: "/contact",
  keywords: [
    "contact LexiReview",
    "book demo contract review",
    "legal AI demo India",
    "enterprise legal tech contact",
  ],
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
