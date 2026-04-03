import type { Metadata } from "next";
import { Urbanist, Poppins, Geist_Mono } from "next/font/google";
import "./globals.css";

const urbanist = Urbanist({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

const poppins = Poppins({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LexiReview - AI Contract Management for Indian Law",
  description:
    "AI-powered contract review built for Indian law. Upload any contract, get risk scores, missing clause detection, and compliance checks against ICA, RBI, DPDP, SEBI, RERA in 45 seconds.",
  metadataBase: new URL("https://lexireview.in"),
  alternates: {
    canonical: "https://lexireview.in",
  },
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },
  other: {
    "theme-color": "#102a43",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en-IN"
      className={`${urbanist.variable} ${poppins.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
