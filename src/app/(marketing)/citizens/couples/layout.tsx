import { generatePageMetadata } from "@/lib/seo";

export const metadata = generatePageMetadata({
  title: "Pre-Nup, Marriage Registration & Divorce Basics — Couples in India",
  description:
    "Plain-English legal help for Indian couples: pre-nup style agreements, marriage registration, mutual-consent divorce, maintenance and custody.",
  path: "/citizens/couples",
  keywords: [
    "prenup India",
    "marriage registration India",
    "mutual consent divorce",
    "maintenance spouse India",
    "family law India",
  ],
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
