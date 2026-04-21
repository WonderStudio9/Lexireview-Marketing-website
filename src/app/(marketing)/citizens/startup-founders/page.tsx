"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Rocket,
  FileSignature,
  Calculator,
  Users,
  AlertCircle,
  Layers,
  Gavel,
  Sparkles,
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
    title: "Founders who never wrote it down",
    desc: "WhatsApp commitments on equity, roles and vesting. Eighteen months later, one co-founder disengages and walks with 33% of the company. Preventable, but only with paper at day one.",
    icon: Users,
  },
  {
    title: "Vesting as a ‘Series A problem’",
    desc: "Every institutional term sheet demands founder vesting. Retrofitting vesting after a term sheet is where term sheets die. Get four-year + one-year-cliff locked on day one.",
    icon: AlertCircle,
  },
  {
    title: "IP that sits with individual founders",
    desc: "The Copyright Act, 1957 and the Patents Act, 1970 treat the creator as the first owner. Without a written assignment, every line of code, logo or spec sits with the founder, not the company.",
    icon: Layers,
  },
  {
    title: "ESOP pools set up wrong",
    desc: "ESOPs issued under Section 62(1)(b) require a Board-approved scheme, ESOP pool sizing, valuation and grant letters. Most pre-seed founders discover this at the first institutional round.",
    icon: Gavel,
  },
];

const tools = [
  {
    title: "Founders Agreement Generator",
    desc: "Four-founder ready. Vesting, IP assignment, roles, decision rights, exit, reverse vesting and arbitration — aligned to the Companies Act, 2013 and the Indian Contract Act.",
    icon: FileSignature,
    href: "/tools/founders-agreement-generator",
  },
  {
    title: "ESOP Vesting Calculator",
    desc: "Four-year monthly vesting with one-year cliff, or custom schedules. Compute unvested, cliff-unmet and tax-liability-at-exercise per grant.",
    icon: Calculator,
    href: "/tools/esop-vesting-calculator",
  },
];

const guides = [
  {
    title: "Legal 101 for Pre-Seed Founders in India",
    desc: "The 12 legal foundations every pre-seed founder in India must get right before they spend a rupee on growth.",
    href: "/blog/legal-101-pre-seed-founders-india",
    tag: "Legal 101",
  },
  {
    title: "ESOP Grants, Vesting and Cliffs in Indian Startups",
    desc: "Pool sizing, grant letter drafting, acceleration mechanics, tax on exercise and sale — a founder’s full ESOP playbook.",
    href: "/blog/esop-grants-vesting-cliffs-indian-startups",
    tag: "ESOPs",
  },
  {
    title: "Term Sheet Red Flags Founders Should Walk Away From",
    desc: "Liquidation preference stacking, founder lockups, drag-along, anti-dilution — the clauses worth a ‘no’.",
    href: "/blog/term-sheet-red-flags-founders-walk-away",
    tag: "Fundraising",
  },
  {
    title: "IP Protection for Bootstrapped Founders in India",
    desc: "Trademarks, copyright, patents and trade secrets — cheap, essential, and often missed.",
    href: "/blog/ip-protection-bootstrapped-founders-india",
    tag: "IP",
  },
];

const faqs = [
  {
    question: "When should co-founders sign a founders’ agreement?",
    answer:
      "Before a single share is issued and before the first employee joins. The founders’ agreement is the most important document in the life of the company, covering equity split, vesting, IP, roles, and exit.",
  },
  {
    question: "What vesting schedule is market standard in Indian startups?",
    answer:
      "Four-year vesting with a one-year cliff, monthly vesting thereafter, mirroring the US market. Acceleration on double-trigger (change of control + termination without cause) is increasingly common.",
  },
  {
    question: "Can a Private Limited Company grant ESOPs?",
    answer:
      "Yes. Section 62(1)(b) of the Companies Act, 2013 allows ESOP issuance by Private and Public Limited Companies. LLPs and partnership firms cannot issue ESOPs — one reason institutional startups default to Pvt Ltd.",
  },
  {
    question: "Is a post-employment non-compete enforceable on a co-founder?",
    answer:
      "Post-termination non-compete clauses are void under Section 27 of the Indian Contract Act, 1872. Non-solicit (clients, employees) and confidentiality are usually enforceable. Many investors require these via the SHA separately.",
  },
  {
    question: "What’s a reasonable ESOP pool size at pre-seed?",
    answer:
      "Typically 7.5%–12.5% of fully diluted equity at pre-seed, expanding to 15%–20% by Series A. The pool is usually expanded to dilute existing shareholders before the institutional round.",
  },
];

export default function StartupFoundersLandingPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: "https://lexireview.in" }, { "@type": "ListItem", position: 2, name: "For Citizens", item: "https://lexireview.in/citizens" }, { "@type": "ListItem", position: 3, name: "Startup Founders", item: "https://lexireview.in/citizens/startup-founders" }] }) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.question, acceptedAnswer: { "@type": "Answer", text: f.answer } })) }) }} />

      <section className="relative pt-32 pb-16 sm:pt-40 sm:pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 aurora-bg opacity-60" />
        <div className="absolute inset-0 grain" />
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 12, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.5 }} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue-200 bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider mb-6">
            <Rocket size={14} /> Early-Stage Founders
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }} className="text-4xl sm:text-5xl lg:text-6xl font-heading font-black tracking-[-0.03em] text-foreground mb-6">
            Start right.{" "}
            <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">Scale clean.</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }} className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Free founders agreement generator and ESOP vesting calculator — for Indian pre-seed and seed-stage founders. Built to survive Series A diligence.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.5 }} className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
            <Link href="#tools" className="group bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold py-3.5 px-8 rounded-2xl shadow-lg hover:shadow-xl transition-all inline-flex items-center gap-2">
              Generate a Founders Agreement <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/contact" className="text-foreground hover:text-blue-700 font-semibold transition-colors inline-flex items-center gap-2">Talk to a Startup Lawyer <ArrowRight size={14} /></Link>
          </motion.div>
        </div>
      </section>

      <section className="py-20 sm:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={viewport} className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-heading font-black text-foreground tracking-tight mb-3">Four founder mistakes that kill the Series A</h2>
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
            <h2 className="text-3xl sm:text-4xl font-heading font-black text-foreground tracking-tight mb-3">Two free tools for Indian founders</h2>
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
            <h2 className="text-3xl sm:text-4xl font-heading font-black text-foreground tracking-tight mb-3">Guides every Indian founder should read</h2>
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
            <LeadForm source="ORGANIC_LANDING" icp="STARTUP_FOUNDER_EARLY" heading="Founder-law updates in your inbox" subheading="Weekly briefing on SHA/SSA, DPDP, employment codes, term-sheet trends and ESOP updates — for Indian founders." ctaLabel="Subscribe free" successMessage="You’re subscribed. First edition ships this week." />
          </motion.div>
        </div>
      </section>

      <FAQSection items={faqs} subtitle="The questions founders bring us before cap-table day." />

      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div variants={scaleReveal} initial="hidden" whileInView="visible" viewport={viewport} className="relative rounded-[2rem] overflow-hidden bg-gradient-to-br from-blue-700 to-blue-900 text-center px-6 py-14 sm:py-20">
            <div className="absolute top-[-40%] left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-white/10 rounded-full blur-[100px] pointer-events-none" />
            <div className="relative z-10 max-w-2xl mx-auto space-y-6">
              <Sparkles size={36} className="text-white/90 mx-auto" />
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-black text-white tracking-tight">Series-A-ready from day one.</h2>
              <p className="text-base sm:text-lg text-blue-100">Generate a founders agreement, compute vesting, and stay out of diligence hell.</p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <Link href="/tools/founders-agreement-generator" className="group bg-white text-blue-800 text-base font-bold py-3.5 px-8 rounded-2xl shadow-lg hover:shadow-xl transition-all inline-flex items-center gap-2">Generate a Founders Agreement <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" /></Link>
                <Link href="/contact" className="text-white/90 hover:text-white font-semibold transition-colors inline-flex items-center gap-2">Talk to a lawyer <ArrowRight size={14} /></Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
