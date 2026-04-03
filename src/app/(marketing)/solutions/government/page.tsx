"use client";

import { SolutionPage } from "@/components/marketing/solution-page";
import {
  Landmark,
  ShieldAlert,
  Scale,
  Lock,
  FileCheck,
} from "lucide-react";

export default function GovernmentPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://lexireview.in" },
          { "@type": "ListItem", position: 2, name: "Solutions", item: "https://lexireview.in/solutions" },
          { "@type": "ListItem", position: 3, name: "Government", item: "https://lexireview.in/solutions/government" },
        ]
      }) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: [
          { "@type": "Question", name: "Does LexiReview integrate with e-Office?", acceptedAnswer: { "@type": "Answer", text: "Yes. LexiReview directly integrates with India's e-Office (eFile) platform. You can fetch pending files by department, submit reviews, and sync analysis back to official records." }},
          { "@type": "Question", name: "Can LexiReview generate CAG-standard compliance reports?", acceptedAnswer: { "@type": "Answer", text: "Yes. LexiReview generates compliance reports in Standard, CAG-standard, and Department-level formats. Reports can be exported as JSON or CSV for government audit requirements." }},
          { "@type": "Question", name: "How does LexiReview ensure tamper-proof audit trails for government?", acceptedAnswer: { "@type": "Answer", text: "LexiReview records every action with SHA-256 checksums and blockchain-style hash chaining, creating tamper-proof records suitable for CAG audits and RTI compliance." }},
        ]
      }) }} />
      <SolutionPage
        badge="Government & PSU Solutions"
      badgeIcon={Landmark}
      headline="Digitize legal review for"
      headlineAccent="the public sector"
      subtitle="Direct e-Office integration, CAG-standard compliance reports, chain-hashed audit trails, and tamper-proof records — purpose-built for government departments and public sector undertakings."
      stats={[
        { value: "5+", label: "Government departments deployed" },
        { value: "CAG", label: "Standard compliance reports" },
        { value: "SHA-256", label: "Chain-hashed audit trails" },
        { value: "45s", label: "Average analysis time" },
      ]}
      pain={[
        {
          title: "Manual Tender Review Bottlenecks",
          desc: "Tender documents, MoUs, and inter-departmental agreements require review but manual processes create bottlenecks. Digital India demands digital legal workflows.",
        },
        {
          title: "CAG Audit Compliance Burden",
          desc: "Comptroller and Auditor General audits require exhaustive documentation of every contract decision. Manual record-keeping creates gaps and risks audit findings.",
        },
        {
          title: "Cross-Department Inconsistency",
          desc: "Each department applies different review standards. No standardized process for contract risk assessment across ministries and PSUs.",
        },
        {
          title: "Paper-Heavy Workflows",
          desc: "Despite e-Office adoption, legal review still relies on manual reading and physical file movement. Integration between digital office systems and legal analysis is missing.",
        },
      ]}
      features={[
        {
          title: "e-Office Integration",
          desc: "Direct integration with India's e-Office (eFile) platform. Fetch pending files by department, submit reviews, and sync analysis back to official records.",
          icon: FileCheck,
          accent: "from-indigo-500 to-purple-600",
        },
        {
          title: "CAG-Standard Reports",
          desc: "Generate compliance reports in Standard, CAG-standard, and Department-level formats. Export as JSON or CSV for government audit requirements.",
          icon: Scale,
          accent: "from-gold-500 to-gold-600",
        },
        {
          title: "Chain-Hashed Audit Trail",
          desc: "Every action recorded with SHA-256 checksums and blockchain-style hash chaining. Tamper-proof records suitable for CAG audits and RTI compliance.",
          icon: Lock,
          accent: "from-navy-500 to-navy-700",
        },
        {
          title: "Compliance Certificates",
          desc: "Generate audit-ready PDF compliance certificates with human co-signature workflow. Standard, Detailed, or Regulatory formats available.",
          icon: ShieldAlert,
          accent: "from-emerald-500 to-teal-500",
        },
      ]}
      checklist={[
        "e-Office (eFile) integration",
        "CAG-standard compliance reports",
        "Chain-hashed audit trails (SHA-256)",
        "Tender document analysis",
        "MoU standardization review",
        "Department-level reporting",
        "Compliance certificates with co-signature",
        "IP tracking and user agent logging",
        "Full audit log export",
        "On-premise deployment option",
      ]}
      ctaHeadline="Modernize government contract review"
      ctaSubtext="See how LexiReview integrates with e-Office to bring AI-powered contract intelligence to the public sector."
        color="from-indigo-600 to-purple-700"
      />
    </>
  );
}
