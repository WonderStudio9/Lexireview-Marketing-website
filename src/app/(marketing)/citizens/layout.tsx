import { generatePageMetadata } from "@/lib/seo";

export const metadata = generatePageMetadata({
  title: "Legal Help for Every Indian Citizen — Free Tools & Lawyer-Verified Templates",
  description:
    "Free, lawyer-verified legal tools for tenants, employees, home buyers, freelancers, MSME owners, founders, NRIs, consumers and more. State-specific, built for Indian law.",
  path: "/citizens",
  keywords: [
    "free legal tools India",
    "rent agreement generator",
    "stamp duty calculator",
    "offer letter decoder",
    "consumer complaint India",
    "legal help for citizens India",
    "lawyer verified templates India",
  ],
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
