import { generatePageMetadata } from "@/lib/seo";

export const metadata = generatePageMetadata({
  title: "Power of Attorney, Gift Deed & Property Tools — NRIs in India",
  description:
    "Free Power of Attorney and Gift Deed generators for NRIs. Manage property, succession, FEMA compliance and Indian transactions from anywhere.",
  path: "/citizens/nri",
  keywords: [
    "NRI power of attorney India",
    "NRI gift deed",
    "NRI property legal help",
    "FEMA compliance NRI",
    "apostille for India",
    "NRI succession India",
  ],
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
