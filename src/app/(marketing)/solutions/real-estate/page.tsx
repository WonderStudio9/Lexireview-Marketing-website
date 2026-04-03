"use client";

import { SolutionPage } from "@/components/marketing/solution-page";
import {
  Home,
  ShieldAlert,
  Scale,
  Stamp,
  FileCheck,
} from "lucide-react";

export default function RealEstatePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://lexireview.in" },
          { "@type": "ListItem", position: 2, name: "Solutions", item: "https://lexireview.in/solutions" },
          { "@type": "ListItem", position: 3, name: "Real Estate", item: "https://lexireview.in/solutions/real-estate" },
        ]
      }) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: [
          { "@type": "Question", name: "Does LexiReview calculate stamp duty across all Indian states?", acceptedAnswer: { "@type": "Answer", text: "Yes. LexiReview's stamp duty calculator covers all 28 Indian state stamp acts, all major instrument types (Lease, Sale, Partnership), with adequacy checking and rate calculations in INR." }},
          { "@type": "Question", name: "How does LexiReview handle RERA compliance for real estate?", acceptedAnswer: { "@type": "Answer", text: "LexiReview automatically checks builder-buyer agreements, allotment letters, and possession documents against state RERA rules, flagging non-compliant clauses and missing provisions." }},
          { "@type": "Question", name: "Can LexiReview analyze sale deeds and lease agreements?", acceptedAnswer: { "@type": "Answer", text: "Yes. LexiReview provides AI-powered risk analysis for sale deeds, lease agreements, rent agreements, leave & license documents, JDAs, and MOAs, identifying hidden risks before they become disputes." }},
        ]
      }) }} />
      <SolutionPage
        badge="Real Estate Solutions"
      badgeIcon={Home}
      headline="Every sale deed. Every lease."
      headlineAccent="Zero surprises."
      subtitle="Automated stamp duty calculations across 28 states, RERA compliance detection, sale deed and lease analysis, and AI-powered contract generation for property documents."
      stats={[
        { value: "28", label: "State stamp acts covered" },
        { value: "50+", label: "Real estate clients" },
        { value: "15K+", label: "Property docs reviewed" },
        { value: "99%", label: "Stamp duty accuracy" },
      ]}
      pain={[
        {
          title: "State-Wise Stamp Duty Complexity",
          desc: "Stamp duty rates vary by state, property type, and transaction value. Manual computation is error-prone and time-consuming.",
        },
        {
          title: "RERA Compliance Gaps",
          desc: "Builder-buyer agreements must comply with state RERA rules. Non-compliant agreements expose developers to penalties and project delays.",
        },
        {
          title: "Hidden Clause Risks",
          desc: "Sale deeds, lease agreements, and JDAs contain clauses that can cost crores if missed. Manual review misses critical provisions.",
        },
        {
          title: "Registration Requirements",
          desc: "Registration requirements differ by state and document type. Missing registration deadlines has legal consequences.",
        },
      ]}
      features={[
        {
          title: "Stamp Duty Calculator",
          desc: "Automated stamp duty computation covering 28 state stamp acts, all major instrument types (Lease, Sale, Partnership), with adequacy checking and rate calculations in INR.",
          icon: Stamp,
          accent: "from-gold-500 to-gold-600",
        },
        {
          title: "RERA Compliance Engine",
          desc: "Automated checks against state RERA rules for builder-buyer agreements, allotment letters, and possession documents.",
          icon: Scale,
          accent: "from-emerald-500 to-emerald-700",
        },
        {
          title: "Sale Deed & Lease Analysis",
          desc: "AI-powered risk analysis for sale deeds, lease agreements, rent agreements, and leave & license documents.",
          icon: FileCheck,
          accent: "from-navy-500 to-navy-700",
        },
        {
          title: "JDA/MOA Risk Detection",
          desc: "Identify hidden risks in Joint Development Agreements, MOAs, and collaboration agreements before they become disputes.",
          icon: ShieldAlert,
          accent: "from-red-500 to-orange-500",
        },
      ]}
      checklist={[
        "Stamp duty computation (all states)",
        "RERA compliance verification",
        "Sale deed risk analysis",
        "Lease agreement review",
        "JDA clause detection",
        "Registration guidance",
        "Builder-buyer agreement checks",
        "AI contract generation for property docs",
        "Pre-built templates (Sale Deed, Lease, L&L)",
        "Compliance certificate generation",
      ]}
      ctaHeadline="Protect every property transaction"
      ctaSubtext="Upload your first property document and get an instant AI-powered risk analysis."
        color="from-emerald-500 to-emerald-700"
      />
    </>
  );
}
