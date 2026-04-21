"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Store,
  FileSignature,
  IndianRupee,
  AlertCircle,
  Layers,
  Users,
  Handshake,
  ShieldCheck,
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
    title: "Delayed payments from large customers",
    desc: "Corporates routinely take 90–180 days to pay MSME invoices, even though Section 15 of the MSMED Act caps credit at 45 days and grants compound interest at three times bank rate.",
    icon: IndianRupee,
  },
  {
    title: "Handshake partnerships that fracture",
    desc: "Two friends start a firm with a WhatsApp agreement. Five years later, profit splits, exit routes and IP ownership become a six-figure legal dispute.",
    icon: Users,
  },
  {
    title: "Vendor MSAs that shift all risk to you",
    desc: "Large buyers push one-sided MSAs with unlimited liability, indemnity and audit rights. An MSME that signs ‘as is’ risks its entire equity capital.",
    icon: AlertCircle,
  },
  {
    title: "GST, registration and statutory compliance fog",
    desc: "Udyam registration, GST, professional tax, shops and establishment, PF, ESI — each with its own threshold. Most MSMEs lose benefits because paper is missing.",
    icon: Layers,
  },
];

const tools = [
  {
    title: "Partnership Deed Generator",
    desc: "90-second partnership deed under the Indian Partnership Act, 1932. Covers capital, profit share, authority, admission, retirement, dissolution and arbitration.",
    icon: FileSignature,
    href: "/tools/partnership-deed-generator",
  },
];

const guides = [
  {
    title: "MSMED Act: Delayed Payment Recovery in 45 Days",
    desc: "How Section 15–18 of the MSMED Act, 2006 gives MSMEs compound interest and a fast-track forum — with templates and the MSME Samadhaan workflow.",
    href: "/blog/msmed-act-delayed-payment-india",
    tag: "Recovery",
  },
  {
    title: "Partnership Deed vs LLP vs Private Limited: Which to Pick",
    desc: "A decision framework for Indian small-business owners: tax, liability, compliance and fundraising trade-offs.",
    href: "/blog/partnership-vs-llp-vs-pvtltd-india",
    tag: "Entity",
  },
  {
    title: "Red Flags in a Corporate Vendor MSA (for MSMEs)",
    desc: "The eight clauses in a typical buyer MSA that wipe out an MSME’s margin — and the fallbacks that negotiate.",
    href: "/blog/vendor-msa-red-flags-msme-india",
    tag: "Contracts",
  },
  {
    title: "Udyam Registration: What You Unlock",
    desc: "A 12-minute walkthrough of Udyam registration, eligibility thresholds, and the benefits (credit, tenders, MSMED remedies) that come with it.",
    href: "/blog/udyam-registration-benefits-india",
    tag: "Compliance",
  },
];

const faqs = [
  {
    question: "Is a partnership deed legally required?",
    answer:
      "Not for an unregistered partnership. However, under Section 69 of the Indian Partnership Act, 1932, an unregistered partnership cannot sue to enforce its rights. Registration requires a written deed, making it effectively essential for any commercial partnership.",
  },
  {
    question: "What is the fastest way to recover delayed payments from a buyer?",
    answer:
      "If you are Udyam-registered, file on the MSME Samadhaan portal under Section 18 of the MSMED Act, 2006. The matter goes to the MSME Facilitation Council which must resolve it in 90 days. The buyer also owes compound interest at three times the RBI bank rate from the due date.",
  },
  {
    question: "Can I convert my partnership firm into an LLP or Pvt Ltd later?",
    answer:
      "Yes. Partnership firms can be converted to LLPs under Part IX of the LLP Act or to private limited companies under Section 366 of the Companies Act, 2013. Both require a clean financial trail and unanimous partner consent.",
  },
  {
    question: "What stamp duty applies to a partnership deed?",
    answer:
      "Stamp duty on partnership deeds is set by state stamp legislation and typically ranges between ₹500 and ₹5,000 on the deed plus a percentage on capital introduced. Our stamp duty calculator computes the exact amount by state.",
  },
  {
    question: "Does my MSME contract need a dispute-resolution clause?",
    answer:
      "Yes. Default litigation in civil courts can take years. Specify arbitration under the Arbitration and Conciliation Act, 1996, seated in a named Indian city, with a sole arbitrator for disputes below a threshold. For buyer disputes under the MSMED Act, the Facilitation Council has primary jurisdiction.",
  },
];

export default function MsmeOwnersLandingPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: "https://lexireview.in" }, { "@type": "ListItem", position: 2, name: "For Citizens", item: "https://lexireview.in/citizens" }, { "@type": "ListItem", position: 3, name: "MSME Owners", item: "https://lexireview.in/citizens/msme-owners" }] }) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.question, acceptedAnswer: { "@type": "Answer", text: f.answer } })) }) }} />

      <section className="relative pt-32 pb-16 sm:pt-40 sm:pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 aurora-bg opacity-60" />
        <div className="absolute inset-0 grain" />
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 12, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.5 }} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue-200 bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider mb-6">
            <Store size={14} /> MSME Owners
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }} className="text-4xl sm:text-5xl lg:text-6xl font-heading font-black tracking-[-0.03em] text-foreground mb-6">
            Build your MSME on{" "}
            <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">paper that pays</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }} className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Free partnership deed, vendor-MSA playbooks, and the MSMED Act recovery toolkit — for Indian small-business owners who don’t want to live in court.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.5 }} className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
            <Link href="#tools" className="group bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold py-3.5 px-8 rounded-2xl shadow-lg hover:shadow-xl transition-all inline-flex items-center gap-2">
              Generate a Partnership Deed <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/contact" className="text-foreground hover:text-blue-700 font-semibold transition-colors inline-flex items-center gap-2">Talk to a Lawyer <ArrowRight size={14} /></Link>
          </motion.div>
        </div>
      </section>

      <section className="py-20 sm:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={viewport} className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-heading font-black text-foreground tracking-tight mb-3">Four problems every Indian MSME knows</h2>
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
            <h2 className="text-3xl sm:text-4xl font-heading font-black text-foreground tracking-tight mb-3">Start with a partnership deed that holds</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">Indian Partnership Act, 1932 aligned. Stamp duty calculated per state.</p>
          </motion.div>
          <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={viewport} className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-3xl mx-auto">
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
            <h2 className="text-3xl sm:text-4xl font-heading font-black text-foreground tracking-tight mb-3">Guides every Indian MSME owner should read</h2>
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
            <LeadForm source="ORGANIC_LANDING" icp="MSME_OWNER" heading="MSME-law updates in your inbox" subheading="Weekly briefing on MSMED remedies, Udyam changes, GST, vendor MSA caselaw and tender opportunities. For Indian small-business owners." ctaLabel="Subscribe free" successMessage="You’re subscribed. First edition lands this week." />
          </motion.div>
        </div>
      </section>

      <FAQSection items={faqs} subtitle="The questions MSME owners ask every week." />

      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div variants={scaleReveal} initial="hidden" whileInView="visible" viewport={viewport} className="relative rounded-[2rem] overflow-hidden bg-gradient-to-br from-blue-700 to-blue-900 text-center px-6 py-14 sm:py-20">
            <div className="absolute top-[-40%] left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-white/10 rounded-full blur-[100px] pointer-events-none" />
            <div className="relative z-10 max-w-2xl mx-auto space-y-6">
              <Handshake size={36} className="text-white/90 mx-auto" />
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-black text-white tracking-tight">Paper that pays.</h2>
              <p className="text-base sm:text-lg text-blue-100">A partnership deed, a vendor MSA review, and MSMED recovery — all in one place.</p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <Link href="/tools/partnership-deed-generator" className="group bg-white text-blue-800 text-base font-bold py-3.5 px-8 rounded-2xl shadow-lg hover:shadow-xl transition-all inline-flex items-center gap-2">Generate a Deed <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" /></Link>
                <Link href="/contact" className="text-white/90 hover:text-white font-semibold transition-colors inline-flex items-center gap-2">Talk to a lawyer <ArrowRight size={14} /></Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
