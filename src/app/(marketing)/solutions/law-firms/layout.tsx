import { generatePageMetadata } from "@/lib/seo";

export const metadata = generatePageMetadata({
  title: "Contract Intelligence for India’s Leading Law Firms — Enterprise AI & White-Label",
  description:
    "Scale contract ops across 50+ lawyers. 6 parallel AI engines, Matter Workspaces, Playbooks, white-label client portals, precedent search and SOC 2 / DPDP compliance for India’s top firms.",
  path: "/solutions/law-firms",
  keywords: [
    "enterprise contract AI India",
    "law firm software India",
    "Tier 1 law firm contract intelligence",
    "white-label legal tech India",
    "matter workspaces",
    "SOC 2 legal software India",
    "DPDP compliant legal AI",
  ],
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
