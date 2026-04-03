import { generatePageMetadata } from "@/lib/seo";

export const metadata = generatePageMetadata({
  title: "LexiReview vs SpotDraft — Indian Law Compliance Comparison",
  description:
    "Compare LexiReview and SpotDraft for contract management. LexiReview offers 6 AI engines, Indian regulatory compliance (ICA, RBI, DPDP, RERA), and e-Office integration that SpotDraft lacks.",
  path: "/compare/spotdraft",
  keywords: [
    "LexiReview vs SpotDraft",
    "SpotDraft alternative India",
    "contract management comparison",
    "Indian law CLM",
    "SpotDraft competitor",
  ],
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
