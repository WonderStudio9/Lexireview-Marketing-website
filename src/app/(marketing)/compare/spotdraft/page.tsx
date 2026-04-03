"use client";

import { ComparePage } from "@/components/marketing/compare-page";
import { Scale } from "lucide-react";

export default function SpotDraftComparePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://lexireview.in" },
          { "@type": "ListItem", position: 2, name: "Compare", item: "https://lexireview.in/compare" },
          { "@type": "ListItem", position: 3, name: "SpotDraft", item: "https://lexireview.in/compare/spotdraft" },
        ]
      }) }} />
      <ComparePage
        badgeIcon={Scale}
      badge="Comparison"
      competitor="SpotDraft"
      headline="LexiReview vs SpotDraft:"
      headlineAccent="Built for Indian law"
      subtitle="SpotDraft is a solid CLM platform for contract drafting and workflow. But LexiReview goes deeper — 6 parallel AI analysis engines, Indian regulatory compliance (ICA, RBI, DPDP, RERA), autonomous regulatory monitoring with LexiBrain, chain-hashed audit trails, and e-Office government integration."
      advantages={[
        {
          title: "Indian Regulatory Intelligence",
          desc: "LexiReview checks every contract against ICA, RBI, SEBI, DPDP, and RERA. SpotDraft offers generic CLM without Indian-specific compliance engines.",
        },
        {
          title: "AI Risk Scoring (0-100)",
          desc: "Get a quantified safety score for every contract with clause-level severity ratings. SpotDraft focuses on workflow, not risk intelligence.",
        },
        {
          title: "45-Second Quick Triage",
          desc: "Screen contracts in seconds before committing to a full review. SpotDraft doesn't offer a triage mode for rapid contract screening.",
        },
        {
          title: "Full Lifecycle, Not Just Drafting",
          desc: "LexiReview covers triage, review, generation, signing, vaulting, and compliance monitoring. Plus LexiBrain autonomously monitors eGazette and RBI circulars to keep your rules current.",
        },
      ]}
      features={[
        { name: "AI Risk Scoring", lexi: "yes", competitor: "no" },
        { name: "Indian Law Compliance (ICA/RBI)", lexi: "yes", competitor: "no" },
        { name: "DPDP Act Compliance", lexi: "yes", competitor: "no" },
        { name: "Missing Clause Detection", lexi: "yes", competitor: "partial" },
        { name: "Quick Triage Mode", lexi: "yes", competitor: "no" },
        { name: "AI Contract Chat", lexi: "yes", competitor: "partial" },
        { name: "Stamp Duty Calculator", lexi: "yes", competitor: "no" },
        { name: "Contract Drafting", lexi: "partial", competitor: "yes" },
        { name: "E-Signature Integration", lexi: "partial", competitor: "yes" },
        { name: "Workflow Automation", lexi: "yes", competitor: "yes" },
        { name: "Compliance Certificates", lexi: "yes", competitor: "no" },
        { name: "Custom Playbooks", lexi: "yes", competitor: "partial" },
        { name: "Batch Processing", lexi: "yes", competitor: "no" },
        { name: "White-Label Reports", lexi: "yes", competitor: "no" },
        { name: "e-Office Integration", lexi: "yes", competitor: "no" },
        { name: "Chain-Hashed Audit Trail", lexi: "yes", competitor: "no" },
      ]}
        ctaHeadline="Ready to switch to Indian-first compliance?"
      />
    </>
  );
}
