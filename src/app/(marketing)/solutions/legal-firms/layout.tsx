import { generatePageMetadata } from "@/lib/seo";

export const metadata = generatePageMetadata({
  title: "Law Firm Contract Review — AI Triage, Playbooks & White-Label",
  description:
    "Review 3x more contracts per associate. 45-second Quick Triage, custom client playbooks, matter workspaces, precedent search, and white-label reports for Indian law firms.",
  path: "/solutions/legal-firms",
  keywords: [
    "law firm contract review AI",
    "legal tech India law firms",
    "contract triage software",
    "white label legal reports",
    "matter management India",
    "legal playbook automation",
  ],
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
