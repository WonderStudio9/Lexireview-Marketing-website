import { generatePageMetadata } from "@/lib/seo";

export const metadata = generatePageMetadata({
  title: "RERA Compliance & Contract AI for Real Estate Developers — 28 States Covered",
  description:
    "RERA-first contract intelligence for Indian real estate developers. Builder-buyer analysis, stamp duty across 28 states + UTs, RERA penalty calculator, agreement-to-sell and tripartite generators.",
  path: "/solutions/real-estate",
  keywords: [
    "RERA compliance software India",
    "real estate developer contract AI",
    "builder buyer agreement analyzer",
    "stamp duty calculator real estate",
    "RERA penalty calculator",
    "tripartite agreement generator",
    "agreement to sell generator",
    "CREDAI NAREDCO legal tech",
  ],
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
