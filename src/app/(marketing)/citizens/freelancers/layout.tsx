import { generatePageMetadata } from "@/lib/seo";

export const metadata = generatePageMetadata({
  title: "Freelancer Contracts & NDAs — Indian Freelancers and Gig Workers",
  description:
    "Free, lawyer-verified freelancer contract and NDA generators for Indian gig workers. Cover IP, payment, scope, indemnity and jurisdiction.",
  path: "/citizens/freelancers",
  keywords: [
    "freelancer contract India",
    "NDA generator India",
    "freelance IP ownership",
    "consulting agreement India",
    "gig worker legal help",
  ],
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
