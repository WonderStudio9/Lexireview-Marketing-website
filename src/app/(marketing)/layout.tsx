import type { Metadata } from "next";
import { Header } from "@/components/marketing/header";
import { Footer } from "@/components/marketing/footer";

export const metadata: Metadata = {
  title: {
    default: "LexiReview - AI Contract Management for Indian Law",
    template: "%s | LexiReview",
  },
  description:
    "AI-powered contract review and management platform built for Indian regulatory compliance. ICA, RBI, DPDP, RERA compliant.",
  openGraph: {
    title: "LexiReview - AI Contract Management for Indian Law",
    description:
      "AI-powered contract review and management platform built for Indian regulatory compliance.",
    url: "https://lexireview.in",
    siteName: "LexiReview",
    type: "website",
    locale: "en_IN",
    images: [{ url: "https://lexireview.in/logo-full.svg", width: 1200, height: 630, alt: "LexiReview" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "LexiReview - AI Contract Management for Indian Law",
    description: "AI-powered contract review built for Indian regulatory compliance.",
    images: ["https://lexireview.in/logo-full.svg"],
  },
};

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "LexiReview",
            legalName: "LexiDraft Technologies",
            url: "https://lexireview.in",
            logo: "https://lexireview.in/logo-icon.svg",
            description: "AI-powered contract lifecycle management platform built for Indian legal teams. Automate RBI compliance, DPDP Act adherence, and contract review workflows.",
            sameAs: [
              "https://www.linkedin.com/company/lexireview",
              "https://twitter.com/lexireview",
            ],
            contactPoint: {
              "@type": "ContactPoint",
              contactType: "sales",
              email: "sales@lexireview.in",
              availableLanguage: ["English", "Hindi"],
            },
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            name: "LexiReview",
            url: "https://app.lexireview.in",
            applicationCategory: "BusinessApplication",
            operatingSystem: "Web",
            description: "AI-powered contract review built for Indian law. Upload any contract, get risk scores, missing clause detection, and Indian law compliance in 45 seconds.",
            offers: [
              { "@type": "Offer", name: "Free Trial", price: "0", priceCurrency: "INR", description: "3 contract reviews free" },
              { "@type": "Offer", name: "Starter", price: "4999", priceCurrency: "INR", description: "25 reviews/month, 3 users" },
              { "@type": "Offer", name: "Professional", price: "14999", priceCurrency: "INR", description: "100 reviews/month, 10 users" },
              { "@type": "Offer", name: "Business", price: "34999", priceCurrency: "INR", description: "500 reviews/month, 50 users" },
            ],
            aggregateRating: {
              "@type": "AggregateRating",
              ratingValue: "4.8",
              ratingCount: "150",
              bestRating: "5",
            },
            featureList: "AI Risk Scoring, Missing Clause Detection, Indian Law Compliance, Quick Triage, Contract Generation, LexiCoPilot AI Chat, Batch Processing, Compliance Certificates, Regulatory Alerts, Precedent Search",
          }),
        }}
      />
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
