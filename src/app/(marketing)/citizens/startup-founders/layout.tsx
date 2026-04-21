import { generatePageMetadata } from "@/lib/seo";

export const metadata = generatePageMetadata({
  title: "Founders Agreement & ESOP Calculator — Early-Stage Indian Startups",
  description:
    "Free founders agreement generator and ESOP vesting calculator for Indian pre-seed and seed-stage startups. Cap table clean, vesting right, IP assigned.",
  path: "/citizens/startup-founders",
  keywords: [
    "founders agreement India",
    "ESOP vesting calculator India",
    "startup legal India",
    "pre-seed founders legal",
    "co-founder equity split",
  ],
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
