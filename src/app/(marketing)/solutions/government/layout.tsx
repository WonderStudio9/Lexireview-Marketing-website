import { generatePageMetadata } from "@/lib/seo";

export const metadata = generatePageMetadata({
  title: "Government & PSU Contract Review — e-Office, CAG Reports & Audit Trails",
  description:
    "Direct e-Office integration, CAG-standard compliance reports, chain-hashed SHA-256 audit trails, and tamper-proof records for government departments and PSUs.",
  path: "/solutions/government",
  keywords: [
    "government contract review India",
    "e-Office integration",
    "CAG compliance software",
    "PSU contract analysis",
    "government audit trail",
    "tender document analysis",
  ],
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
