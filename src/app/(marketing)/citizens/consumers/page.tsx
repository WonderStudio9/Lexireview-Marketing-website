"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  ShoppingBag,
  MessageSquareWarning,
  FileSearch,
  AlertCircle,
  ShieldCheck,
  Receipt,
  Scale,
  Gavel,
} from "lucide-react";
import {
  fadeUp,
  scaleReveal,
  stagger,
  itemFadeUp,
  itemScale,
  viewport,
} from "@/lib/motion";
import { LeadForm } from "@/components/marketing/lead-form";
import { FAQSection } from "@/components/marketing/faq-section";

const pains = [
  {
    title: "Refunds stuck in ‘support loop’",
    desc: "Twenty emails, three escalations, zero resolution. The Consumer Protection Act, 2019 gives you a formal, low-cost forum — but only if you draft the complaint properly.",
    icon: Receipt,
  },
  {
    title: "Defective products, no replacement",
    desc: "Section 2(10) of the CPA defines ‘defect’ broadly. You are entitled to replacement, repair, or refund plus damages, but the seller has no incentive to tell you.",
    icon: AlertCircle,
  },
  {
    title: "Services paid for, never delivered",
    desc: "Deficient service — from travel to telecom to OTT subscriptions — is actionable. The District Commission handles claims up to ₹50 lakh with a nominal fee.",
    icon: MessageSquareWarning,
  },
  {
    title: "Public authorities that don’t answer",
    desc: "A poorly drafted RTI gets rejected on technicalities. A properly drafted RTI under the Right to Information Act, 2005 gets a response within 30 days by law.",
    icon: FileSearch,
  },
];

const tools = [
  {
    title: "Consumer Complaint Drafter",
    desc: "Draft a consumer forum complaint in minutes. Covers deficient service, defective goods, misleading advertising, unfair trade practice. e-Daakhil ready.",
    icon: MessageSquareWarning,
    href: "/tools/consumer-complaint-drafter",
  },
  {
    title: "RTI Application Drafter",
    desc: "Generate a precise RTI application under the Right to Information Act, 2005. Covers the 12 categories courts recognise, appeal language built-in.",
    icon: FileSearch,
    href: "/tools/rti-application-drafter",
  },
];

const guides = [
  {
    title: "How to File a Consumer Complaint on e-Daakhil (Step by Step)",
    desc: "From jurisdiction to fees to evidence filing, the exact workflow on the National Consumer Helpline’s e-Daakhil portal.",
    href: "/blog/e-daakhil-consumer-complaint-india",
    tag: "How-to",
  },
  {
    title: "Consumer Protection Act, 2019: What’s New",
    desc: "Product liability, CCPA powers, mediation, e-commerce rules and enhanced pecuniary limits — the changes that matter for everyday disputes.",
    href: "/blog/consumer-protection-act-2019-india",
    tag: "The law",
  },
  {
    title: "RTI Success Playbook: How to Draft for a Response",
    desc: "The 10 patterns that separate answered RTIs from rejected ones — with sample language.",
    href: "/blog/rti-drafting-playbook-india",
    tag: "RTI",
  },
  {
    title: "Airline, Bank and Telecom Refunds: The Sector Playbooks",
    desc: "Which ombudsman, which forum, and which escalation actually moves — by sector, in India.",
    href: "/blog/consumer-refund-sector-playbooks-india",
    tag: "Playbooks",
  },
];

const faqs = [
  {
    question: "What is the pecuniary limit for a District Consumer Commission?",
    answer:
      "Under the Consumer Protection Act, 2019, District Commissions handle complaints where the consideration paid does not exceed ₹50 lakh. State Commissions handle ₹50 lakh to ₹2 crore, and the National Commission handles above ₹2 crore. These limits were revised upwards from the 1986 Act.",
  },
  {
    question: "Do I need a lawyer to file a consumer complaint?",
    answer:
      "No. Consumer forums are designed to be consumer-friendly and you can appear in person. Most filings succeed on the strength of documented communication, proof of purchase, and a well-drafted complaint. Our drafter generates all three components.",
  },
  {
    question: "What is the court fee for filing a consumer complaint?",
    answer:
      "Nominal. Under the Consumer Protection (Consumer Commissions) Rules, 2020, fees range from ₹100 (for complaints up to ₹5 lakh) to a few thousand rupees for higher-value complaints. e-Daakhil processes payments online.",
  },
  {
    question: "How long does the RTI process take?",
    answer:
      "The Public Information Officer (PIO) must respond within 30 days (48 hours if life or liberty is involved). If the information is not provided, you can file a first appeal within 30 days, and a second appeal with the Information Commission within 90 days thereafter.",
  },
  {
    question: "Can I file an RTI anonymously?",
    answer:
      "No. The RTI applicant must disclose identity and contact details. However, the reason for seeking information generally cannot be asked by the PIO, except in very narrow circumstances (Section 6(2) RTI Act).",
  },
];

export default function ConsumersLandingPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: "https://lexireview.in" }, { "@type": "ListItem", position: 2, name: "For Citizens", item: "https://lexireview.in/citizens" }, { "@type": "ListItem", position: 3, name: "Consumers", item: "https://lexireview.in/citizens/consumers" }] }) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.question, acceptedAnswer: { "@type": "Answer", text: f.answer } })) }) }} />

      <section className="relative pt-32 pb-16 sm:pt-40 sm:pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 aurora-bg opacity-60" />
        <div className="absolute inset-0 grain" />
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 12, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.5 }} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue-200 bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider mb-6">
            <ShoppingBag size={14} /> Consumer Disputes
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }} className="text-4xl sm:text-5xl lg:text-6xl font-heading font-black tracking-[-0.03em] text-foreground mb-6">
            Your refund.{" "}
            <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">On paper.</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }} className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Free consumer complaint and RTI drafters. File on e-Daakhil in minutes. The Consumer Protection Act is on your side — we make it usable.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.5 }} className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
            <Link href="#tools" className="group bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold py-3.5 px-8 rounded-2xl shadow-lg hover:shadow-xl transition-all inline-flex items-center gap-2">
              Draft a Complaint <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/contact" className="text-foreground hover:text-blue-700 font-semibold transition-colors inline-flex items-center gap-2">Talk to a Lawyer <ArrowRight size={14} /></Link>
          </motion.div>
        </div>
      </section>

      <section className="py-20 sm:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={viewport} className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-heading font-black text-foreground tracking-tight mb-3">Four situations where the law is already on your side</h2>
          </motion.div>
          <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={viewport} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {pains.map((p) => {
              const Icon = p.icon;
              return (
                <motion.div key={p.title} variants={itemFadeUp} className="flex gap-4 bg-card rounded-2xl border border-border p-6">
                  <div className="w-11 h-11 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0"><Icon size={20} /></div>
                  <div>
                    <h3 className="font-heading font-bold text-foreground mb-1">{p.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{p.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      <section id="tools" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={viewport} className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-4">Tools for you</div>
            <h2 className="text-3xl sm:text-4xl font-heading font-black text-foreground tracking-tight mb-3">Two free tools that actually move the needle</h2>
          </motion.div>
          <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={viewport} className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {tools.map((t) => {
              const Icon = t.icon;
              return (
                <motion.div key={t.title} variants={itemScale}>
                  <Link href={t.href} className="group block h-full bg-card rounded-2xl border border-border p-6 hover:border-blue-400 transition-colors">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 text-white flex items-center justify-center mb-4 shadow-sm"><Icon size={20} /></div>
                    <h3 className="font-heading font-bold text-base text-foreground mb-1.5">{t.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed mb-3">{t.desc}</p>
                    <span className="text-blue-700 text-sm font-semibold inline-flex items-center gap-1.5 group-hover:gap-2 transition-all">Use free <ArrowRight size={14} /></span>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      <section className="py-20 sm:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={viewport} className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-heading font-black text-foreground tracking-tight mb-3">Guides every Indian consumer should read</h2>
          </motion.div>
          <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={viewport} className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {guides.map((g) => (
              <motion.div key={g.title} variants={itemFadeUp}>
                <Link href={g.href} className="group block h-full bg-card rounded-2xl border border-border p-6 hover:border-blue-400 transition-colors">
                  <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-[10px] font-bold uppercase tracking-wider mb-4">{g.tag}</div>
                  <h3 className="font-heading font-bold text-lg text-foreground mb-2">{g.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-3">{g.desc}</p>
                  <span className="text-blue-700 text-sm font-semibold inline-flex items-center gap-1.5 group-hover:gap-2 transition-all">Read the guide <ArrowRight size={14} /></span>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="py-20 sm:py-24 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-3xl mx-auto">
          <motion.div variants={scaleReveal} initial="hidden" whileInView="visible" viewport={viewport}>
            <LeadForm source="ORGANIC_LANDING" icp="CONSUMER_DISPUTE" heading="Consumer-law updates in your inbox" subheading="Weekly briefing on CPA caselaw, sector ombudsmen, e-Daakhil tips and the patterns that actually win." ctaLabel="Subscribe free" successMessage="You’re subscribed. First edition this week." />
          </motion.div>
        </div>
      </section>

      <FAQSection items={faqs} subtitle="The questions consumers ask every time a refund doesn’t come." />

      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div variants={scaleReveal} initial="hidden" whileInView="visible" viewport={viewport} className="relative rounded-[2rem] overflow-hidden bg-gradient-to-br from-blue-700 to-blue-900 text-center px-6 py-14 sm:py-20">
            <div className="absolute top-[-40%] left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-white/10 rounded-full blur-[100px] pointer-events-none" />
            <div className="relative z-10 max-w-2xl mx-auto space-y-6">
              <Scale size={36} className="text-white/90 mx-auto" />
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-black text-white tracking-tight">Not your fault. Your remedy.</h2>
              <p className="text-base sm:text-lg text-blue-100">Draft and file, straight to e-Daakhil. Get matched to a consumer-law specialist in under 24 hours.</p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <Link href="/tools/consumer-complaint-drafter" className="group bg-white text-blue-800 text-base font-bold py-3.5 px-8 rounded-2xl shadow-lg hover:shadow-xl transition-all inline-flex items-center gap-2">Draft a Complaint <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" /></Link>
                <Link href="/contact" className="text-white/90 hover:text-white font-semibold transition-colors inline-flex items-center gap-2">Talk to a lawyer <ArrowRight size={14} /></Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
