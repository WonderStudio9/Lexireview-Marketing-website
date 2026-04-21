import { generatePageMetadata } from "@/lib/seo";

export const metadata = generatePageMetadata({
  title: "Crop Leases, APMC Contracts & FPO Guidance — Indian Farmers",
  description:
    "Plain-English legal help for Indian farmers: crop leases, APMC contracts, FPO formation, land records, MSP procurement and agri-disputes.",
  path: "/citizens/farmers",
  keywords: [
    "farmer legal help India",
    "crop lease contract India",
    "APMC Act",
    "farmer producer organization India",
    "MSP procurement legal",
    "agricultural land lease India",
  ],
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
