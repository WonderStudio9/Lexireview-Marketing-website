import { generatePageMetadata } from "@/lib/seo";

export const metadata = generatePageMetadata({
  title: "NBFC Contract Compliance — RBI, SEBI & ICA Automation",
  description:
    "Automate RBI master direction checks, SEBI regulation verification, and ICA compliance across all lending contracts. Batch process 100+ agreements overnight. Purpose-built for NBFCs.",
  path: "/solutions/nbfc",
  keywords: [
    "NBFC compliance automation",
    "RBI compliance software",
    "NBFC contract review",
    "loan agreement compliance",
    "SEBI regulation check",
    "NBFC audit software India",
  ],
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
