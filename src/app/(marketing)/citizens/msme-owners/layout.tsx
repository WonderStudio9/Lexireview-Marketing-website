import { generatePageMetadata } from "@/lib/seo";

export const metadata = generatePageMetadata({
  title: "Partnership Deed, MSME Contracts & Vendor MSAs — MSME Owners India",
  description:
    "Free partnership deed generator and lawyer-verified contract templates for Indian MSME owners. MSMED Act remedies, delayed payment relief, vendor MSAs.",
  path: "/citizens/msme-owners",
  keywords: [
    "partnership deed generator India",
    "MSME contract templates",
    "MSMED Act delayed payment",
    "vendor MSA India",
    "small business legal help India",
  ],
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
