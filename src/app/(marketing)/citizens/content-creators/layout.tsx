import { generatePageMetadata } from "@/lib/seo";

export const metadata = generatePageMetadata({
  title: "Brand Deal Contracts & NDAs — Content Creators and Influencers India",
  description:
    "Free NDA generator and contract templates for Indian creators and influencers. ASCI guidelines, brand deal negotiation, IP and exclusivity.",
  path: "/citizens/content-creators",
  keywords: [
    "influencer brand deal contract India",
    "NDA for creators",
    "ASCI influencer guidelines",
    "creator IP ownership",
    "brand collaboration agreement",
  ],
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
