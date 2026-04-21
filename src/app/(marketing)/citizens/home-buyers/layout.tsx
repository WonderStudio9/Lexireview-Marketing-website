import { generatePageMetadata } from "@/lib/seo";

export const metadata = generatePageMetadata({
  title: "Builder Buyer Agreement Review & Stamp Duty — Home Buyers India",
  description:
    "Free tools for Indian home buyers: real-estate stamp duty calculator, AI builder-buyer agreement analyzer, RERA checks. Find risky clauses before you sign.",
  path: "/citizens/home-buyers",
  keywords: [
    "builder buyer agreement review",
    "home buyer legal help India",
    "real estate stamp duty India",
    "RERA compliance check",
    "property agreement red flags",
    "under construction property agreement",
  ],
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
