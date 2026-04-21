import { generatePageMetadata } from "@/lib/seo";

export const metadata = generatePageMetadata({
  title: "Offer Letter Decoder & First-Job Tools — Students and Freshers India",
  description:
    "Free offer letter decoder and first-job legal help for Indian students and first-time employees. Internship contracts, PPO, bond and PF basics.",
  path: "/citizens/students",
  keywords: [
    "offer letter decoder student",
    "internship agreement India",
    "first job legal help India",
    "service bond India",
    "PPO offer letter",
  ],
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
