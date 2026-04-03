"use client";

import { ComparePage } from "@/components/marketing/compare-page";
import { Scale } from "lucide-react";

export default function ProvakilComparePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://lexireview.in" },
          { "@type": "ListItem", position: 2, name: "Compare", item: "https://lexireview.in/compare" },
          { "@type": "ListItem", position: 3, name: "Provakil", item: "https://lexireview.in/compare/provakil" },
        ]
      }) }} />
      <ComparePage
        badgeIcon={Scale}
      badge="Comparison"
      competitor="Provakil"
      headline="LexiReview vs Provakil:"
      headlineAccent="Contracts, not cases"
      subtitle="Provakil is a comprehensive legal operations platform for litigation and matter management. LexiReview is purpose-built for contract intelligence — 6 parallel AI analysis engines, autonomous regulatory monitoring, full contract lifecycle from triage to vault, and Indian law compliance automation."
      advantages={[
        {
          title: "Contract-First AI Intelligence",
          desc: "LexiReview is 100% focused on contract analysis with AI risk scoring, clause detection, and compliance checking. Provakil spreads across litigation, IP, and legal ops.",
        },
        {
          title: "45-Second Contract Triage",
          desc: "Screen any contract in seconds with our Quick Triage mode. Provakil doesn't offer rapid contract screening or AI-powered risk assessment.",
        },
        {
          title: "Regulatory Compliance Engine",
          desc: "Automated compliance checks against ICA, RBI, SEBI, DPDP, and RERA. Provakil doesn't offer contract-level regulatory verification.",
        },
        {
          title: "Interactive AI Analysis",
          desc: "Chat with your contract, get missing clause alerts, and receive compliance certificates. Purpose-built contract intelligence that goes beyond document management.",
        },
      ]}
      features={[
        { name: "AI Risk Scoring", lexi: "yes", competitor: "no" },
        { name: "Missing Clause Detection", lexi: "yes", competitor: "no" },
        { name: "Indian Law Compliance", lexi: "yes", competitor: "partial" },
        { name: "AI Contract Chat", lexi: "yes", competitor: "no" },
        { name: "Quick Triage Mode", lexi: "yes", competitor: "no" },
        { name: "Litigation Management", lexi: "no", competitor: "yes" },
        { name: "IP Portfolio Management", lexi: "no", competitor: "yes" },
        { name: "Matter Management", lexi: "no", competitor: "yes" },
        { name: "Contract Repository", lexi: "yes", competitor: "yes" },
        { name: "Compliance Certificates", lexi: "yes", competitor: "no" },
        { name: "Batch Processing", lexi: "yes", competitor: "no" },
        { name: "Custom Playbooks", lexi: "yes", competitor: "no" },
        { name: "Stamp Duty Calculator", lexi: "yes", competitor: "no" },
        { name: "White-Label Reports", lexi: "yes", competitor: "no" },
        { name: "e-Office Integration", lexi: "yes", competitor: "no" },
        { name: "Contract Generation", lexi: "yes", competitor: "no" },
      ]}
        ctaHeadline="Choose the contract intelligence leader"
      />
    </>
  );
}
