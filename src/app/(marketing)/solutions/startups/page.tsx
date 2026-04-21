"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Rocket,
  FileSignature,
  ShieldCheck,
  Landmark,
  Users,
  Handshake,
  TrendingUp,
  Calculator,
  BookText,
  Scale,
  Briefcase,
  FileText,
  CheckCircle2,
  Sparkles,
  Quote,
  FilePlus2,
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

const features = [
  {
    title: "Contract Generation",
    desc: "6-step AI chat flow turns bullet points into a lawyer-ready contract in minutes.",
    icon: FileSignature,
    accent: "from-blue-500 to-blue-700",
  },
  {
    title: "DPDP compliance",
    desc: "Privacy policies, consent flows, DPA templates and DPDP readiness checks out of the box.",
    icon: ShieldCheck,
    accent: "from-indigo-500 to-blue-700",
  },
  {
    title: "Investor docs",
    desc: "NDAs, SAFE notes, term-sheet decoders, SSHA redlines — compare markups side by side.",
    icon: Landmark,
    accent: "from-sky-500 to-blue-700",
  },
  {
    title: "Employment contracts",
    desc: "Offer letters, appointment letters, consultant agreements with non-solicit and IP assignment.",
    icon: Users,
    accent: "from-blue-600 to-indigo-700",
  },
  {
    title: "Vendor MSA",
    desc: "Generate and review vendor master agreements, SaaS subscriptions and customer MSAs fast.",
    icon: Handshake,
    accent: "from-blue-500 to-blue-800",
  },
  {
    title: "ESOP tooling",
    desc: "Cap table ready ESOP pools, vesting schedules, exercise windows and grant letters.",
    icon: TrendingUp,
    accent: "from-indigo-600 to-blue-700",
  },
];

const freeTools = [
  { title: "Founders Agreement", desc: "Roles, equity, vesting, IP, exit.", icon: Users },
  { title: "ESOP Vesting Calculator", desc: "Cliff, vest, accelerators modelled in seconds.", icon: Calculator },
  { title: "MOU Generator", desc: "Friendly, enforceable MOUs for pilots & partnerships.", icon: FileText },
  { title: "Cap Table", desc: "Founder, SAFE, ESOP and priced round scenarios.", icon: TrendingUp },
  { title: "Term Sheet Decoder", desc: "See what that liq. pref. really costs at exit.", icon: BookText },
  { title: "Investor NDA", desc: "Mutual one-pager that VCs actually sign.", icon: FileSignature },
  { title: "Employment Contract Gen", desc: "Offer letters with IP & confidentiality.", icon: Briefcase },
  { title: "Customer MSA Gen", desc: "Tight MSAs that close enterprise pilots.", icon: Handshake },
];

const faqs = [
  {
    question: "Can LexiReview replace a full-time in-house counsel?",
    answer:
      "Not entirely — but it handles 70-80% of what founders need from a GC: contract generation, reviews, compliance, investor and employment paperwork. For the rest, we connect you with vetted startup lawyers on demand.",
  },
  {
    question: "Is there a plan for pre-seed or bootstrapped startups?",
    answer:
      "Yes. Our pre-seed program is ₹999/month for qualifying founders — includes 15 reviews, contract generation and core playbooks. Apply on the pricing page or via your accelerator.",
  },
  {
    question: "How do you handle DPDP Act readiness?",
    answer:
      "We ship a DPDP readiness checklist, consent flow templates, DPA templates, and automated checks on your vendor contracts. LexiReview itself is DPDP-compliant with Indian data residency.",
  },
  {
    question: "Do you support investor diligence?",
    answer:
      "Yes. Use Matter Workspaces to organise your data room, auto-redact PII, and generate a compliance certificate for investors. Most Series A founders save 30-40 hours on diligence prep.",
  },
  {
    question: "How fast can we get set up?",
    answer:
      "Under 10 minutes. Sign up, upload your first contract or use a template, and you’re live. No implementation team, no setup fees.",
  },
];

export default function StartupsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: "https://lexireview.in" },
              { "@type": "ListItem", position: 2, name: "Solutions", item: "https://lexireview.in/solutions" },
              { "@type": "ListItem", position: 3, name: "Startups", item: "https://lexireview.in/solutions/startups" },
            ],
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqs.map((f) => ({
              "@type": "Question",
              name: f.question,
              acceptedAnswer: { "@type": "Answer", text: f.answer },
            })),
          }),
        }}
      />

      {/* Hero */}
      <section className="relative pt-32 pb-16 sm:pt-40 sm:pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 aurora-bg opacity-60" />
        <div className="absolute inset-0 grain" />
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue-200 bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider mb-6"
          >
            <Rocket size={14} /> For founders, pre-seed to Series A
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl sm:text-5xl lg:text-6xl font-heading font-black tracking-[-0.03em] text-foreground mb-6"
          >
            Legal ops for founders,{" "}
            <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              not lawyers
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
          >
            Legal that doesn’t slow you down. Contracts, compliance, ESOPs and investor paperwork,
            all in one place — built for Indian startups.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8"
          >
            <Link
              href="https://app.lexireview.in/signup"
              className="group bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold py-3.5 px-8 rounded-2xl shadow-lg hover:shadow-xl transition-all inline-flex items-center gap-2"
            >
              Start Free
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/contact"
              className="text-foreground hover:text-blue-700 font-semibold transition-colors inline-flex items-center gap-2"
            >
              Book a Demo <ArrowRight size={14} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Problem */}
      <section className="py-20 sm:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
          >
            <h2 className="text-3xl sm:text-4xl font-heading font-black text-foreground tracking-tight mb-4">
              You don’t have a GC. You still need legal certainty.
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Early-stage founders are sandwiched between investor asks, customer contracts, hiring
              paperwork and DPDP compliance — with no time, no budget for a full-time in-house
              lawyer. LexiReview is the founder’s legal co-pilot: fast, affordable, Indian-law
              native.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            className="text-center mb-14"
          >
            <h2 className="text-3xl sm:text-4xl font-heading font-black text-foreground tracking-tight mb-3">
              Everything you need, none of the overhead
            </h2>
          </motion.div>
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {features.map((f) => {
              const Icon = f.icon;
              return (
                <motion.div
                  key={f.title}
                  variants={itemScale}
                  className="group relative bg-card rounded-2xl border border-border p-6 hover:border-blue-400 transition-colors"
                >
                  <div
                    className={`w-11 h-11 rounded-xl bg-gradient-to-br ${f.accent} text-white flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform duration-300`}
                  >
                    <Icon size={20} />
                  </div>
                  <h3 className="font-heading font-bold text-base text-foreground mb-2">
                    {f.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {f.desc}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Free founder tools */}
      <section className="py-20 sm:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-4">
              <Sparkles size={14} /> Free for founders
            </div>
            <h2 className="text-3xl sm:text-4xl font-heading font-black text-foreground tracking-tight mb-3">
              Eight tools every founder needs
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Generate, calculate, decode — no login, no fees.
            </p>
          </motion.div>
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
          >
            {freeTools.map((t) => {
              const Icon = t.icon;
              return (
                <motion.div key={t.title} variants={itemFadeUp}>
                  <Link
                    href="#"
                    data-tool={t.title.toLowerCase().replace(/\s+/g, "-")}
                    className="group block h-full bg-card rounded-2xl border border-border p-6 hover:border-blue-400 transition-colors"
                  >
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 text-white flex items-center justify-center mb-4 shadow-sm">
                      <Icon size={20} />
                    </div>
                    <h3 className="font-heading font-bold text-sm text-foreground mb-1.5">
                      {t.title}
                    </h3>
                    <p className="text-muted-foreground text-xs leading-relaxed mb-3">
                      {t.desc}
                    </p>
                    <span className="text-blue-700 text-xs font-bold inline-flex items-center gap-1.5 group-hover:gap-2 transition-all">
                      Use free <ArrowRight size={12} />
                    </span>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Accelerator credibility */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30 border-y border-border/60">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          className="max-w-5xl mx-auto text-center"
        >
          <p className="text-xs uppercase tracking-wider text-muted-foreground font-bold mb-5">
            Trusted by founders from
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
            {["Y Combinator", "Antler", "Sequoia Surge", "100X.VC", "Blume", "Accel"].map((logo) => (
              <div
                key={logo}
                className="font-heading font-black text-lg sm:text-xl text-foreground/60"
              >
                {logo}
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Pricing */}
      <section className="py-20 sm:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            className="text-center mb-10"
          >
            <h2 className="text-3xl sm:text-4xl font-heading font-black text-foreground tracking-tight mb-3">
              Pricing for founders, not law firms
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Pre-seed programme available for qualifying founders and accelerator portfolios.
            </p>
          </motion.div>
          <motion.div
            variants={scaleReveal}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            className="relative rounded-3xl bg-card border-2 border-blue-500 shadow-elevated overflow-hidden"
          >
            <div className="absolute top-0 right-0 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-xs font-bold uppercase tracking-wider px-4 py-1.5 rounded-bl-2xl">
              Pre-seed program
            </div>
            <div className="p-8 sm:p-10">
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-8">
                <div>
                  <div className="text-xs uppercase tracking-wider text-blue-700 font-bold mb-2">
                    Founder Starter
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-heading font-black text-foreground">
                      ₹999
                    </span>
                    <span className="text-muted-foreground font-medium">/ month</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    For eligible pre-seed founders. Upgrade any time as you raise.
                  </p>
                </div>
                <Link
                  href="https://app.lexireview.in/signup"
                  className="group bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold py-3.5 px-7 rounded-2xl shadow-lg hover:shadow-xl transition-all inline-flex items-center gap-2"
                >
                  Apply now
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  "15 contract reviews per month",
                  "2 founder seats",
                  "Contract generation wizard",
                  "Founders, ESOP, MSA, NDA templates",
                  "DPDP readiness checks",
                  "Cap table & ESOP tools",
                  "Term-sheet decoder",
                  "Email support",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                    <span className="text-sm text-foreground font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Lead magnet */}
      <section className="py-20 sm:py-24 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-4xl mx-auto">
          <motion.div
            variants={scaleReveal}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
          >
            <div className="grid md:grid-cols-5 gap-8 items-center">
              <div className="md:col-span-2 space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wider">
                  <FilePlus2 size={14} /> Free PDF
                </div>
                <h2 className="text-3xl font-heading font-black text-foreground tracking-tight">
                  The Founder’s Legal Checklist
                </h2>
                <p className="text-muted-foreground">
                  25 pages. Pre-seed to Series A. Incorporation, ESOPs, DPDP, investor diligence,
                  customer contracts — everything you shouldn’t forget.
                </p>
              </div>
              <div className="md:col-span-3">
                <LeadForm
                  source="ORGANIC_LANDING"
                  icp="STARTUP_FOUNDER"
                  heading="Send me the checklist"
                  subheading="25 pages, free, straight to your inbox."
                  ctaLabel="Email me the PDF"
                  successMessage="Sent! Open the email and start at ‘Pre-seed Day 0’."
                />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Case study teaser */}
      <section className="py-20 sm:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <motion.div
            variants={scaleReveal}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            className="relative rounded-3xl bg-card border border-border p-8 sm:p-12 overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="relative grid md:grid-cols-3 gap-8 items-center">
              <div className="md:col-span-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wider mb-4">
                  Case study
                </div>
                <h3 className="text-2xl sm:text-3xl font-heading font-black text-foreground mb-4">
                  Seed-stage SaaS closes Series A diligence 3 weeks faster
                </h3>
                <Quote size={24} className="text-blue-500 mb-3" />
                <p className="text-muted-foreground leading-relaxed mb-4">
                  “LexiReview became our de facto GC. Employment letters, customer MSAs, DPDP
                  policy and diligence packs — one place, one subscription. We closed our Series A
                  diligence three weeks ahead of plan.”
                </p>
                <div className="text-sm font-heading font-bold text-foreground">
                  Founder, Series A B2B SaaS
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-1 gap-4 text-center">
                <div className="bg-muted/40 rounded-2xl p-5">
                  <div className="text-3xl font-heading font-black text-blue-700">3w</div>
                  <div className="text-xs text-muted-foreground mt-1">Faster diligence</div>
                </div>
                <div className="bg-muted/40 rounded-2xl p-5">
                  <div className="text-3xl font-heading font-black text-blue-700">₹18L</div>
                  <div className="text-xs text-muted-foreground mt-1">Saved on legal fees</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ */}
      <FAQSection items={faqs} />

      {/* Final CTA */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            variants={scaleReveal}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            className="relative rounded-[2rem] overflow-hidden bg-gradient-to-br from-blue-700 to-blue-900 text-center px-6 py-14 sm:py-20"
          >
            <div className="absolute top-[-40%] left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-white/10 rounded-full blur-[100px] pointer-events-none" />
            <div className="relative z-10 max-w-2xl mx-auto space-y-6">
              <Scale size={36} className="text-white/90 mx-auto" />
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-black text-white tracking-tight">
                Ship fast. Stay clean.
              </h2>
              <p className="text-base sm:text-lg text-blue-100">
                Start free, wire up your DPDP policies in minutes, and keep shipping.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <Link
                  href="https://app.lexireview.in/signup"
                  className="group bg-white text-blue-800 text-base font-bold py-3.5 px-8 rounded-2xl shadow-lg hover:shadow-xl transition-all inline-flex items-center gap-2"
                >
                  Start Free
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/contact"
                  className="text-white/90 hover:text-white font-semibold transition-colors inline-flex items-center gap-2"
                >
                  Book a Demo <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
