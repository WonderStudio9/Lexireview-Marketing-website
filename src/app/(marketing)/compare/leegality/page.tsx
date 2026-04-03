"use client";

import { ComparePage } from "@/components/marketing/compare-page";
import { Scale } from "lucide-react";

export default function LeegalityComparePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://lexireview.in" },
          { "@type": "ListItem", position: 2, name: "Compare", item: "https://lexireview.in/compare" },
          { "@type": "ListItem", position: 3, name: "Leegality", item: "https://lexireview.in/compare/leegality" },
        ]
      }) }} />
      <ComparePage
        badgeIcon={Scale}
      badge="Comparison"
      competitor="Leegality"
      headline="LexiReview vs Leegality:"
      headlineAccent="Beyond e-signatures"
      subtitle="Leegality excels at digital signatures and document execution. LexiReview goes deeper — 6 parallel AI analysis engines, autonomous regulatory monitoring with LexiBrain, contract generation, compliance certificates, and the full contract lifecycle before and after signing."
      advantages={[
        {
          title: "AI-Powered Contract Analysis",
          desc: "LexiReview analyzes every clause for risk, compliance, and missing provisions. Leegality focuses on signing and stamping, not contract intelligence.",
        },
        {
          title: "Regulatory Compliance Engine",
          desc: "Automated checks against RBI, SEBI, DPDP, RERA, and ICA. Leegality doesn't offer regulatory compliance verification.",
        },
        {
          title: "Pre-Signing Risk Assessment",
          desc: "Understand your risks before signing. LexiReview provides risk scores and recommendations; Leegality handles post-decision execution.",
        },
        {
          title: "Contract Intelligence, Not Just Execution",
          desc: "Ask questions, detect missing clauses, get compliance certificates, search Indian case law precedents, and monitor regulatory changes autonomously. LexiReview is the brain; Leegality is the pen.",
        },
      ]}
      features={[
        { name: "AI Risk Scoring", lexi: "yes", competitor: "no" },
        { name: "Missing Clause Detection", lexi: "yes", competitor: "no" },
        { name: "Indian Law Compliance", lexi: "yes", competitor: "no" },
        { name: "AI Contract Chat", lexi: "yes", competitor: "no" },
        { name: "E-Signature (Aadhaar/DSC)", lexi: "no", competitor: "yes" },
        { name: "Stamp Paper Procurement", lexi: "no", competitor: "yes" },
        { name: "Stamp Duty Calculator", lexi: "yes", competitor: "partial" },
        { name: "Compliance Certificates", lexi: "yes", competitor: "no" },
        { name: "Quick Triage Mode", lexi: "yes", competitor: "no" },
        { name: "Batch Processing", lexi: "yes", competitor: "no" },
        { name: "Custom Playbooks", lexi: "yes", competitor: "no" },
        { name: "API Access", lexi: "yes", competitor: "yes" },
        { name: "Document Templates", lexi: "partial", competitor: "yes" },
        { name: "Audit Trail", lexi: "yes", competitor: "yes" },
        { name: "Contract Generation Wizard", lexi: "yes", competitor: "no" },
        { name: "Precedent Search", lexi: "yes", competitor: "no" },
      ]}
        ctaHeadline="Analyze before you sign"
      />
    </>
  );
}
