"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Palette,
  FileSignature,
  FilePlus,
  IndianRupee,
  AlertCircle,
  Gavel,
  Layers,
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
    title: "Payment delays and no recourse",
    desc: "Clients miss invoices, push back on scope, cite ‘one-more-round’ revisions. Without a written scope and milestone clause, recovery is a civil suit nobody can afford.",
    icon: IndianRupee,
  },
  {
    title: "IP you no longer own",
    desc: "A default contract often gives the client everything you create, forever, worldwide. Your portfolio, your reusable assets, your case studies — all gone unless you carve them out.",
    icon: Layers,
  },
  {
    title: "Liability and indemnity traps",
    desc: "‘Unlimited liability’ and ‘gross negligence’ clauses transfer enterprise-level risk to a solo freelancer. Most Indian freelancers sign without reading.",
    icon: AlertCircle,
  },
  {
    title: "No NDA before the pitch",
    desc: "Sharing your proposal, framework or creative deck without an NDA means a prospective client can use your idea with someone cheaper. Copyright is not enough for ideas.",
    icon: ShieldCheck,
  },
];

const tools = [
  {
    title: "Freelancer Contract (Simple)",
    desc: "90-second freelance SOW with scope, milestones, IP, payment terms, revision limits and termination. Indian Contract Act aligned.",
    icon: FileSignature,
    href: "/tools/freelancer-contract-simple",
  },
  {
    title: "NDA Generator",
    desc: "Mutual or one-way NDA, lawyer-verified, aligned to Section 10 of the ICA. Download as Word or PDF, e-sign ready.",
    icon: FilePlus,
    href: "/tools/nda-generator",
  },
];

const guides = [
  {
    title: "Freelancer Contract Clauses That Save You Lakhs",
    desc: "Scope creep, payment triggers, IP carve-outs, kill fees and termination for convenience — the seven clauses every Indian freelancer must have.",
    href: "/blog/freelancer-contract-clauses-india",
    tag: "Contracts",
  },
  {
    title: "Tax for Freelancers in India: 44ADA vs 44AD vs Books",
    desc: "Presumptive taxation, GST registration threshold, TDS Section 194J and quarterly advance tax — in plain English.",
    href: "/blog/freelancer-tax-india-guide",
    tag: "Tax",
  },
  {
    title: "How to Enforce a Freelance Invoice When a Client Ghosts",
    desc: "Legal notice, MSMED Act remedies, Section 138 NI Act for bounced cheques, online consumer forums — the real recovery stack.",
    href: "/blog/freelance-invoice-recovery-india",
    tag: "Payments",
  },
  {
    title: "NDA vs MSA vs SOW: Which Contract You Actually Need",
    desc: "A decision framework for Indian freelancers with templates and a comparison table.",
    href: "/blog/nda-msa-sow-freelance-india",
    tag: "Contracts",
  },
];

const faqs = [
  {
    question: "Do I need to register as a business to freelance in India?",
    answer:
      "No. You can freelance under your own name as a sole proprietor. GST registration is required only if your turnover crosses the relevant threshold (₹20 lakh for services in most states, ₹10 lakh for special category states). Professional tax applies in some states.",
  },
  {
    question: "Who owns the IP in my freelance work?",
    answer:
      "Under the Copyright Act, 1957, the author (you) is the first owner unless you assign IP in writing. Most client contracts include an assignment clause for deliverables. You can and should carve out pre-existing IP, reusable frameworks, and portfolio rights.",
  },
  {
    question: "What if a client refuses to pay my invoice?",
    answer:
      "Send a formal legal notice under the Indian Contract Act, 1872 and Section 8 of the MSMED Act, 2006 (if you are an MSME-registered freelancer, which gives interest + expedited recovery). You can also file on the MSME Samadhaan portal or, for lower amounts, approach the consumer forum or small-causes court.",
  },
  {
    question: "Are freelance non-competes enforceable in India?",
    answer:
      "Post-engagement non-competes are void under Section 27 of the Indian Contract Act. Confidentiality and non-solicit of client staff are usually enforceable. Exclusive dealings during the engagement are fine.",
  },
  {
    question: "Is an NDA alone enough protection before a pitch?",
    answer:
      "An NDA protects confidential information. Ideas are not protectable as such, but the specific expression, frameworks, datasets and processes you share are. Combine an NDA with marking documents ‘confidential’ and keeping an audit trail of what you shared.",
  },
];

export default function FreelancersLandingPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: "https://lexireview.in" }, { "@type": "ListItem", position: 2, name: "For Citizens", item: "https://lexireview.in/citizens" }, { "@type": "ListItem", position: 3, name: "Freelancers", item: "https://lexireview.in/citizens/freelancers" }] }) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.question, acceptedAnswer: { "@type": "Answer", text: f.answer } })) }) }} />

      <section className="relative pt-32 pb-16 sm:pt-40 sm:pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 aurora-bg opacity-60" />
        <div className="absolute inset-0 grain" />
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 12, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.5 }} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue-200 bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider mb-6">
            <Palette size={14} /> Freelancers & Gig Workers
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }} className="text-4xl sm:text-5xl lg:text-6xl font-heading font-black tracking-[-0.03em] text-foreground mb-6">
            Get paid.{" "}
            <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">Keep your IP.</span>{" "}
            Ship more.
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }} className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Free, lawyer-verified freelance contracts and NDAs for Indian creators, developers, consultants and designers. IP carve-outs, milestone payments, kill fees — all covered.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.5 }} className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
            <Link href="#tools" className="group bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold py-3.5 px-8 rounded-2xl shadow-lg hover:shadow-xl transition-all inline-flex items-center gap-2">
              Generate a Freelance Contract <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/contact" className="text-foreground hover:text-blue-700 font-semibold transition-colors inline-flex items-center gap-2">Talk to a Lawyer <ArrowRight size={14} /></Link>
          </motion.div>
        </div>
      </section>

      <section className="py-20 sm:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={viewport} className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-heading font-black text-foreground tracking-tight mb-3">Four problems every Indian freelancer runs into</h2>
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
            <h2 className="text-3xl sm:text-4xl font-heading font-black text-foreground tracking-tight mb-3">Two free tools for Indian freelancers</h2>
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
            <h2 className="text-3xl sm:text-4xl font-heading font-black text-foreground tracking-tight mb-3">Guides every Indian freelancer should read</h2>
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
            <LeadForm source="ORGANIC_LANDING" icp="FREELANCER" heading="Freelance-law updates in your inbox" subheading="One email a week on contracts, tax, GST, and payment recovery — written for Indian freelancers." ctaLabel="Subscribe free" successMessage="You’re subscribed. First edition ships this week." />
          </motion.div>
        </div>
      </section>

      <FAQSection items={faqs} subtitle="The questions freelancers bring to us every week." />

      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div variants={scaleReveal} initial="hidden" whileInView="visible" viewport={viewport} className="relative rounded-[2rem] overflow-hidden bg-gradient-to-br from-blue-700 to-blue-900 text-center px-6 py-14 sm:py-20">
            <div className="absolute top-[-40%] left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-white/10 rounded-full blur-[100px] pointer-events-none" />
            <div className="relative z-10 max-w-2xl mx-auto space-y-6">
              <Gavel size={36} className="text-white/90 mx-auto" />
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-black text-white tracking-tight">Ship more. Chase less.</h2>
              <p className="text-base sm:text-lg text-blue-100">Generate airtight contracts and NDAs in under five minutes — free, forever.</p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <Link href="/tools/freelancer-contract-simple" className="group bg-white text-blue-800 text-base font-bold py-3.5 px-8 rounded-2xl shadow-lg hover:shadow-xl transition-all inline-flex items-center gap-2">Generate a Contract <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" /></Link>
                <Link href="/contact" className="text-white/90 hover:text-white font-semibold transition-colors inline-flex items-center gap-2">Talk to a lawyer <ArrowRight size={14} /></Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
