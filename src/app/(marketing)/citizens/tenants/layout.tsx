import { generatePageMetadata } from "@/lib/seo";

export const metadata = generatePageMetadata({
  title: "Free Rent Agreement, Stamp Duty & Rental Receipts — Tenants & Landlords India",
  description:
    "Free, state-specific rent agreement generator, stamp duty calculator and rental receipts for Indian tenants and landlords. Lawyer-verified templates for Maharashtra, Karnataka, Delhi and every other state.",
  path: "/citizens/tenants",
  keywords: [
    "rent agreement India",
    "rental agreement generator",
    "stamp duty rent agreement",
    "rental receipt for HRA",
    "tenant rights India",
    "landlord rights India",
    "leave and licence Maharashtra",
  ],
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
