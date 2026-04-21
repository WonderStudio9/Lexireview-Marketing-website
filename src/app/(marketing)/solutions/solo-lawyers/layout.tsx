import { generatePageMetadata } from "@/lib/seo";

export const metadata = generatePageMetadata({
  title: "AI Tools for Solo Lawyers & Small Firms — Practice Management + Contract Review",
  description:
    "Build your solo practice with 45-second AI contract review, matter management, precedent search and client onboarding tools. Purpose-built for 1-10 lawyer firms in India.",
  path: "/solutions/solo-lawyers",
  keywords: [
    "solo lawyer software India",
    "small law firm software",
    "AI contract review solo lawyer",
    "legal practice management India",
    "retainer agreement generator India",
    "matter management solo practice",
  ],
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
