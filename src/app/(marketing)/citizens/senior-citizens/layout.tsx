import { generatePageMetadata } from "@/lib/seo";

export const metadata = generatePageMetadata({
  title: "Will, Gift Deed & Power of Attorney — Senior Citizens India",
  description:
    "Free will drafter, gift deed and Power of Attorney generators for Indian senior citizens. Maintenance Act remedies, succession planning, plain English.",
  path: "/citizens/senior-citizens",
  keywords: [
    "will drafter India",
    "gift deed generator",
    "senior citizen rights India",
    "Maintenance of Parents Act",
    "succession planning India",
  ],
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
