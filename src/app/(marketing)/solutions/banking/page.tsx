"use client";

import { SolutionPage } from "@/components/marketing/solution-page";
import {
  Building2,
  ShieldAlert,
  Scale,
  Lock,
  Award,
} from "lucide-react";

export default function BankingPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://lexireview.in" },
          { "@type": "ListItem", position: 2, name: "Solutions", item: "https://lexireview.in/solutions" },
          { "@type": "ListItem", position: 3, name: "Banking", item: "https://lexireview.in/solutions/banking" },
        ]
      }) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: [
          { "@type": "Question", name: "How does LexiReview handle ICA compliance for banking contracts?", acceptedAnswer: { "@type": "Answer", text: "LexiReview automates Indian Contract Act (ICA) Section 10-30 compliance checks on every banking contract, providing clause-level recommendations and flagging non-compliant provisions automatically." }},
          { "@type": "Question", name: "Does LexiReview support DPDP Act compliance for banks?", acceptedAnswer: { "@type": "Answer", text: "Yes. LexiReview validates data protection clauses, consent mechanisms, breach notification requirements, and user rights provisions against the Digital Personal Data Protection (DPDP) Act for all banking agreements." }},
          { "@type": "Question", name: "Can LexiReview generate audit trails for RBI inspections?", acceptedAnswer: { "@type": "Answer", text: "Yes. LexiReview provides chain-hashed audit trails with SHA-256 checksums and blockchain-style hash chaining. One-click compliance certificates can be generated for RBI inspections and internal audits." }},
        ]
      }) }} />
      <SolutionPage
        badge="Banking Solutions"
      badgeIcon={Building2}
      headline="Digitize legal review for"
      headlineAccent="banking operations"
      subtitle="Full ICA compliance automation, RBI master direction checks, DPDP data processing agreement validation, and chain-hashed audit trails — built for India's banking compliance requirements."
      stats={[
        { value: "5+", label: "Major banks deployed" },
        { value: "10K+", label: "Contracts processed" },
        { value: "99.2%", label: "Compliance accuracy" },
        { value: "60%", label: "Review time reduction" },
      ]}
      pain={[
        {
          title: "Complex Regulatory Landscape",
          desc: "ICA guidelines, RBI circulars, SEBI regulations, and DPDP Act provisions — banking contracts must comply with multiple regulatory frameworks simultaneously.",
        },
        {
          title: "DPDP Compliance Gap",
          desc: "Data processing agreements, consent clauses, and privacy provisions need urgent review across all existing contracts to meet DPDP Act requirements.",
        },
        {
          title: "Inter-bank Agreement Complexity",
          desc: "IBA model agreements, syndication documents, and consortium lending contracts require specialized review capabilities.",
        },
        {
          title: "Audit & Governance Burden",
          desc: "RBI inspections and internal audits require comprehensive documentation of contract compliance. Manual processes create gaps.",
        },
      ]}
      features={[
        {
          title: "ICA Compliance Automation",
          desc: "Automated checks against the Indian Contract Act provisions with specific clause-level recommendations.",
          icon: Scale,
          accent: "from-gold-500 to-gold-600",
        },
        {
          title: "RBI Circular Tracking",
          desc: "Real-time monitoring and compliance checking against the latest RBI master directions and circulars.",
          icon: ShieldAlert,
          accent: "from-red-500 to-orange-500",
        },
        {
          title: "DPDP DPA Templates",
          desc: "Automated DPDP Act compliance checking — validates data protection clauses, consent mechanisms, breach notification requirements, and user rights provisions.",
          icon: Lock,
          accent: "from-navy-500 to-navy-700",
        },
        {
          title: "Audit Trail Generation",
          desc: "Chain-hashed audit trails with SHA-256 checksums and blockchain-style hash chaining. One-click compliance certificates for RBI inspections and internal audits.",
          icon: Award,
          accent: "from-emerald-500 to-teal-500",
        },
      ]}
      checklist={[
        "ICA Section 10-30 compliance",
        "RBI master direction checks",
        "DPDP Act compliance review",
        "SEBI regulation verification",
        "KYC/AML clause analysis",
        "Data localization requirements",
        "Inter-bank agreement review",
        "Syndication document analysis",
        "Compliance certificate generation",
        "Full audit trail export",
      ]}
      ctaHeadline="Modernize your banking compliance"
      ctaSubtext="See how LexiReview automates contract compliance for India's leading banks."
        color="from-navy-700 to-navy-900"
      />
    </>
  );
}
