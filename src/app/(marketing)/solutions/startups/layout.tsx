import { generatePageMetadata } from "@/lib/seo";

export const metadata = generatePageMetadata({
  title: "Legal Ops for Startup Founders — Contracts, DPDP, ESOPs & Cap Table",
  description:
    "Legal that doesn’t slow you down. AI contract generation, DPDP compliance, investor docs, cap tables, ESOP tooling and free founder templates — built for pre-seed to Series A.",
  path: "/solutions/startups",
  keywords: [
    "startup legal India",
    "founders agreement generator",
    "ESOP vesting calculator India",
    "cap table tool India",
    "DPDP compliance for startups",
    "investor NDA template",
    "term sheet decoder India",
  ],
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
