import { generatePageMetadata } from "@/lib/seo";

export const metadata = generatePageMetadata({
  title: "Consumer Complaint & RTI Drafter — Indian Consumer Rights",
  description:
    "Free consumer forum complaint and RTI application drafters. File on e-Daakhil, claim refunds and defective product relief under the Consumer Protection Act, 2019.",
  path: "/citizens/consumers",
  keywords: [
    "consumer complaint India",
    "e-Daakhil complaint",
    "RTI application drafter",
    "CCPA India",
    "refund legal help India",
  ],
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
