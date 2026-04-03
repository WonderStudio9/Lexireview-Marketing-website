import { generatePageMetadata } from "@/lib/seo";

export const metadata = generatePageMetadata({
  title: "Resources — Guides, Checklists & Templates for Indian Legal Teams",
  description:
    "Free resources for Indian legal compliance: RBI checklist, DPDP Act audit guide, stamp duty reference, contract review playbook templates, and RERA compliance handbook.",
  path: "/resources",
  keywords: [
    "RBI compliance checklist",
    "DPDP Act guide",
    "Indian stamp duty reference",
    "contract review template",
    "RERA compliance handbook",
    "legal resources India",
  ],
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
