"use client";

import { SolutionPage } from "@/components/marketing/solution-page";
import {
  Briefcase,
  Zap,
  Layers,
  FileCheck,
  MessageSquare,
} from "lucide-react";

export default function LegalFirmsPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://lexireview.in" },
          { "@type": "ListItem", position: 2, name: "Solutions", item: "https://lexireview.in/solutions" },
          { "@type": "ListItem", position: 3, name: "Legal Firms", item: "https://lexireview.in/solutions/legal-firms" },
        ]
      }) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: [
          { "@type": "Question", name: "How fast is LexiReview's Quick Triage for law firms?", acceptedAnswer: { "@type": "Answer", text: "LexiReview's Quick Triage screens any contract in under 45 seconds with an instant go/no-go decision. It uses deterministic pattern-matching with zero AI credits consumed, making it perfect for high-volume law firm practices." }},
          { "@type": "Question", name: "Can law firms create custom review playbooks per client?", acceptedAnswer: { "@type": "Answer", text: "Yes. LexiReview lets firms create custom playbooks with specific rules, focus areas, severity settings, and jurisdiction notes per client or practice area, with full usage tracking." }},
          { "@type": "Question", name: "Does LexiReview offer white-label reports for law firms?", acceptedAnswer: { "@type": "Answer", text: "Yes. LexiReview provides full white-label branding including custom logo, brand colors, custom domain, email branding, and report headers. Law firms can resell LexiReview under their own brand." }},
        ]
      }) }} />
      <SolutionPage
        badge="Law Firm Solutions"
      badgeIcon={Briefcase}
      headline="Bill for strategy,"
      headlineAccent="not for reading"
      subtitle="Quick triage in 45 seconds. Custom playbooks per client. Matter workspaces for case management. Precedent search across Supreme Court and High Courts. White-label reports with your branding."
      stats={[
        { value: "3x", label: "More contracts per associate" },
        { value: "45s", label: "Quick triage time" },
        { value: "200+", label: "Law firms onboarded" },
        { value: "70%", label: "Review time saved" },
      ]}
      pain={[
        {
          title: "Associate Productivity Crisis",
          desc: "Associates spend 60% of their time on repetitive clause-by-clause review instead of high-value advisory work.",
        },
        {
          title: "Inconsistent Quality",
          desc: "Different associates apply different standards. There's no standardized review process across practice areas or clients.",
        },
        {
          title: "Client Pressure on Fees",
          desc: "Clients demand faster turnaround and lower fees. Manual review can't scale without proportional cost increases.",
        },
        {
          title: "Knowledge Silos",
          desc: "Institutional knowledge about client preferences, clause standards, and negotiation patterns lives in individual heads, not systems.",
        },
      ]}
      features={[
        {
          title: "45-Second Quick Triage",
          desc: "Screen contracts instantly. Go or no-go decisions before committing to a deep review. Perfect for high-volume practices.",
          icon: Zap,
          accent: "from-emerald-500 to-teal-500",
        },
        {
          title: "Per-Client Playbooks",
          desc: "Create custom review playbooks with specific rules, focus areas, severity settings, and jurisdiction notes. Build playbooks per client or practice area with usage tracking.",
          icon: Layers,
          accent: "from-gold-500 to-gold-700",
        },
        {
          title: "White-Label Reports",
          desc: "Full white-label branding — custom logo, brand colors, custom domain, email branding, and report headers. Enable your firm to resell LexiReview under your own brand.",
          icon: FileCheck,
          accent: "from-navy-500 to-navy-700",
        },
        {
          title: "AI Contract Chat",
          desc: "Associates can ask Lexi anything about a contract and get instant, cited answers with clause references.",
          icon: MessageSquare,
          accent: "from-indigo-500 to-purple-500",
        },
      ]}
      checklist={[
        "45-second Quick Triage mode",
        "Custom client playbooks",
        "White-label PDF reports",
        "Matter workspace management",
        "AI contract Q&A chat",
        "Precedent search (Supreme Court, High Courts)",
        "Template deviation analysis",
        "Team collaboration features",
        "Batch contract processing",
        "Analytics & reporting dashboard",
      ]}
      ctaHeadline="Empower your associates with AI"
      ctaSubtext="Upload a contract and see how LexiReview transforms your firm's review workflow."
        color="from-gold-500 to-gold-700"
      />
    </>
  );
}
