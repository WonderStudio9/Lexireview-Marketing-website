"use client";

import { SolutionPage } from "@/components/marketing/solution-page";
import {
  Landmark,
  ShieldAlert,
  FileCheck,
  Scale,
  Layers,
} from "lucide-react";

export default function NBFCPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://lexireview.in" },
          { "@type": "ListItem", position: 2, name: "Solutions", item: "https://lexireview.in/solutions" },
          { "@type": "ListItem", position: 3, name: "NBFC", item: "https://lexireview.in/solutions/nbfc" },
        ]
      }) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: [
          { "@type": "Question", name: "How does LexiReview help NBFCs with RBI compliance?", acceptedAnswer: { "@type": "Answer", text: "LexiReview automatically checks every contract against RBI master directions, circulars, and SEBI regulations. It monitors regulatory changes via LexiBrain and auto-updates compliance rules, so your lending contracts are always compliant." }},
          { "@type": "Question", name: "Can LexiReview process bulk loan agreements?", acceptedAnswer: { "@type": "Answer", text: "Yes. LexiReview's batch processing feature can process 100+ contracts overnight with aggregated risk scores, common issue identification, and batch export with summary statistics." }},
          { "@type": "Question", name: "Does LexiReview support vendor risk management for NBFCs?", acceptedAnswer: { "@type": "Answer", text: "Yes. LexiReview tracks vendor risk profiles with aggregated scores, trend indicators (improving/stable/deteriorating), linked contracts, and side-by-side vendor comparison for outsourcing guideline compliance." }},
        ]
      }) }} />
      <SolutionPage
        badge="NBFC Solutions"
      badgeIcon={Landmark}
      headline="Scale contract review across"
      headlineAccent="your lending operations"
      subtitle="Automated ICA, SEBI, and RBI compliance checks on every agreement. Regulatory alerts with RBI circular monitoring. Batch processing for 100+ contracts overnight. Vendor risk management with aggregated scoring."
      stats={[
        { value: "40%", label: "Faster loan documentation" },
        { value: "100+", label: "NBFCs trust LexiReview" },
        { value: "98.5%", label: "Compliance accuracy" },
        { value: "45s", label: "Average analysis time" },
      ]}
      pain={[
        {
          title: "RBI Compliance Complexity",
          desc: "RBI master directions evolve constantly. Keeping loan agreements compliant with the latest circulars is nearly impossible manually.",
        },
        {
          title: "Loan Agreement Volume",
          desc: "Thousands of borrower agreements, vendor contracts, and outsourcing deals need review. Legal teams can't keep up.",
        },
        {
          title: "Audit Risk Exposure",
          desc: "Non-compliant clauses discovered during audits lead to penalties, remediation costs, and reputational damage.",
        },
        {
          title: "Legacy Contract Backlog",
          desc: "Thousands of existing contracts haven't been reviewed against current regulations. The risk exposure is unknown.",
        },
      ]}
      features={[
        {
          title: "RBI Compliance Engine",
          desc: "Automated checks against RBI master directions, circulars, and guidelines for all lending contracts.",
          icon: Scale,
          accent: "from-gold-500 to-gold-600",
        },
        {
          title: "Loan Agreement Analysis",
          desc: "AI-powered review of loan covenants, security clauses, and borrower obligations against ICA standards.",
          icon: FileCheck,
          accent: "from-navy-500 to-navy-700",
        },
        {
          title: "Vendor Risk Management",
          desc: "Track vendor risk profiles with aggregated scores, trend indicators (improving/stable/deteriorating), linked contracts, and side-by-side vendor comparison.",
          icon: ShieldAlert,
          accent: "from-red-500 to-orange-500",
        },
        {
          title: "Batch Legacy Review",
          desc: "Process hundreds of existing contracts overnight. Get a portfolio-wide risk assessment in hours, not months.",
          icon: Layers,
          accent: "from-emerald-500 to-teal-500",
        },
      ]}
      checklist={[
        "RBI master direction compliance checks",
        "SEBI regulation verification",
        "ICA Section 27 analysis",
        "Loan covenant review",
        "Security clause detection",
        "KYC clause verification",
        "Outsourcing guideline compliance",
        "Stamp duty computation",
        "Regulatory alerts with RBI circular monitoring",
        "API integration for loan origination systems",
      ]}
      ctaHeadline="Protect your NBFC from compliance risk"
      ctaSubtext="Upload your first loan agreement and get a free AI-powered compliance analysis."
        color="from-navy-600 to-navy-800"
      />
    </>
  );
}
