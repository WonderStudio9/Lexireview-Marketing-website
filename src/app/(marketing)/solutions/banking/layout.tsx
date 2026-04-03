import { generatePageMetadata } from "@/lib/seo";

export const metadata = generatePageMetadata({
  title: "Banking Contract Compliance — ICA, RBI & DPDP Automation",
  description:
    "Full ICA compliance automation, RBI master direction checks, DPDP Act validation, and chain-hashed audit trails for Indian banking operations.",
  path: "/solutions/banking",
  keywords: [
    "banking compliance software India",
    "ICA compliance automation",
    "RBI circular tracking",
    "DPDP compliance banking",
    "bank contract review AI",
    "banking audit trail",
  ],
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
