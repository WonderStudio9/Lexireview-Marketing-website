"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Home,
  ShieldCheck,
  Scale,
  Stamp,
  FileCheck,
  AlertTriangle,
  FileSignature,
  Users,
  MapPin,
  Building2,
  Quote,
  BadgeCheck,
  CheckCircle2,
  FilePlus2,
  Calculator,
  BookOpen,
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

const reraTools = [
  {
    title: "RERA Compliance Checker",
    desc: "Scan any builder-buyer or project document against the RERA Act + state rules. Instant pass/fail with citations.",
    icon: ShieldCheck,
  },
  {
    title: "Builder-Buyer Agreement Analyzer",
    desc: "Clause-by-clause risk analysis of BBAs, flagging one-sided, non-RERA-compliant and possession-delay clauses.",
    icon: FileCheck,
  },
  {
    title: "Real Estate Stamp Duty Calculator",
    desc: "All 28 states and UTs. Sale, lease, gift, development, JDA and tripartite instruments.",
    icon: Calculator,
  },
  {
    title: "RERA Penalty Calculator",
    desc: "Estimate Section 59–61 penalties, delay interest and compounding exposure before they hit.",
    icon: AlertTriangle,
  },
  {
    title: "Agreement-to-Sell Generator",
    desc: "RERA-registered, stamp-duty-ready ATS drafts tailored to your project, state and inventory.",
    icon: FileSignature,
  },
  {
    title: "Tripartite Agreement Generator",
    desc: "Builder-buyer-bank tripartites with home loan, construction linkage and possession clauses.",
    icon: Users,
  },
];

const pains = [
  {
    title: "RERA exposure on every delay",
    desc: "Possession delays, plan deviations and advertising errors trigger Section 61 penalties and buyer compensation claims. You can’t monitor every clause manually.",
  },
  {
    title: "State-wise complexity",
    desc: "Rules differ between Maharashtra, Karnataka, Tamil Nadu, UP and every other authority. Your agreements need to bend to each state.",
  },
  {
    title: "Stamp duty accuracy",
    desc: "Miscalculating stamp duty on a large deal costs crores — and under-stamping is a criminal offence.",
  },
  {
    title: "Client SLA pressure",
    desc: "Home buyers demand fast, transparent documentation. Your legal cycle times become a sales issue.",
  },
];

const features = [
  {
    title: "28-state RERA engine",
    desc: "Central RERA Act + every notified state rule, updated as authorities publish amendments.",
    icon: Scale,
    accent: "from-blue-500 to-blue-700",
  },
  {
    title: "Possession risk radar",
    desc: "Flag every possession, interest, refund and carpet-area clause before it becomes a buyer claim.",
    icon: AlertTriangle,
    accent: "from-indigo-500 to-blue-700",
  },
  {
    title: "Stamp duty automation",
    desc: "28 state stamp acts, all major instrument types, adequacy checking and e-stamp readiness.",
    icon: Stamp,
    accent: "from-sky-500 to-blue-700",
  },
  {
    title: "Project document vault",
    desc: "Agreements, RERA approvals, amendments, CC/OC filings — all versioned and audit-trailed.",
    icon: Building2,
    accent: "from-blue-600 to-indigo-700",
  },
  {
    title: "Contract generation wizard",
    desc: "ATS, sale deed, lease, JDA, tripartite — drafted from your project data, not Word templates.",
    icon: FileSignature,
    accent: "from-blue-500 to-blue-800",
  },
  {
    title: "RERA filings assistance",
    desc: "Quarterly progress reports, amendments, and defect liability clauses auto-filled and compliance-checked.",
    icon: FileCheck,
    accent: "from-indigo-600 to-blue-700",
  },
];

const stateCoverage = [
  "Maharashtra",
  "Karnataka",
  "Tamil Nadu",
  "Delhi NCR",
  "Uttar Pradesh",
  "Gujarat",
  "Telangana",
  "Andhra Pradesh",
  "West Bengal",
  "Haryana",
  "Punjab",
  "Rajasthan",
  "Madhya Pradesh",
  "Kerala",
  "Odisha",
  "Assam",
];

const caseStudies = [
  {
    title: "Bengaluru developer eliminates RERA penalty exposure",
    metric: "₹4.2Cr",
    metricLabel: "Penalty exposure avoided",
    quote:
      "We caught 14 non-compliant clauses across active BBAs before our next RERA audit. One clean pass saved us an eight-figure fight.",
    author: "VP Legal, Tier-2 developer",
  },
  {
    title: "Mumbai Tier-1 developer cuts ATS cycle time 70%",
    metric: "70%",
    metricLabel: "Faster ATS turnaround",
    quote:
      "Buyers now get RERA-registered ATS drafts the same day they book. It’s become a selling point.",
    author: "Head of Sales Ops",
  },
  {
    title: "NCR JV partner standardises tripartite templates",
    metric: "100%",
    metricLabel: "Bank-panel compliance",
    quote:
      "LexiReview generated tripartite drafts accepted by HDFC, SBI and ICICI without a single redline.",
    author: "Project Counsel",
  },
];

const faqs = [
  {
    question: "Does LexiReview cover every state RERA authority?",
    answer:
      "Yes. We track all notified state RERA rules across 28 states and union territories and apply the correct rule set based on the project’s location and authority registration.",
  },
  {
    question: "How accurate is the stamp duty calculator for large deals?",
    answer:
      "99% accuracy across 28 state stamp acts. We support sale, lease, gift, partnership, development, tripartite and JDA instruments with adequacy checks.",
  },
  {
    question: "Can LexiReview be used by CREDAI or NAREDCO members?",
    answer:
      "Yes. We have special programs for CREDAI and NAREDCO member developers — ask us about member pricing and onboarding.",
  },
  {
    question: "What about builder-buyer agreements already in circulation?",
    answer:
      "Use batch processing to review hundreds of signed or in-force BBAs overnight. Aggregated risk reports highlight non-compliant clauses and remediation recommendations.",
  },
  {
    question: "Do you integrate with CRMs and ERP systems?",
    answer:
      "Yes. We integrate with leading real estate CRMs (Sell.Do, Propacity, Accelerate), Tally, and ERPs. APIs and webhooks are available for custom stacks.",
  },
  {
    question: "How is data residency handled?",
    answer:
      "All project and buyer data is stored exclusively in Indian data centres and processed under a DPDP-aligned DPA. Enterprise plans include private VPC deployment.",
  },
  {
    question: "Can I generate tripartite agreements with my banking panel?",
    answer:
      "Yes. Our Tripartite Agreement Generator supports major lenders (HDFC, SBI, ICICI, Axis, Bank of Baroda, LIC HFL) with project-specific construction-linkage and possession clauses.",
  },
];

export default function RealEstatePage() {
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
              { "@type": "ListItem", position: 3, name: "Real Estate", item: "https://lexireview.in/solutions/real-estate" },
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
            <Home size={14} /> RERA-first, for developers
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl sm:text-5xl lg:text-6xl font-heading font-black tracking-[-0.03em] text-foreground mb-6"
          >
            RERA compliance,{" "}
            <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              on every clause, every state
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
          >
            RERA-focused contract intelligence for Indian developers. Builder-buyer analysis,
            stamp duty across 28 states + UTs, penalty calculators and one-click document
            generation.
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
              Start Free Trial
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

      {/* RERA tools */}
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
              <ShieldCheck size={14} /> RERA toolkit
            </div>
            <h2 className="text-3xl sm:text-4xl font-heading font-black text-foreground tracking-tight mb-3">
              Six tools every developer needs
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Purpose-built for India’s real estate operators. Use a tool in minutes or sign up for
              the full platform.
            </p>
          </motion.div>
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {reraTools.map((t) => {
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
                    <h3 className="font-heading font-bold text-base text-foreground mb-2">
                      {t.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed mb-3">
                      {t.desc}
                    </p>
                    <span className="text-blue-700 text-sm font-bold inline-flex items-center gap-1.5 group-hover:gap-2 transition-all">
                      Open tool <ArrowRight size={14} />
                    </span>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Pain points */}
      <section className="py-20 sm:py-24 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-heading font-black text-foreground tracking-tight mb-3">
              The RERA risk surface keeps growing
            </h2>
          </motion.div>
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            {pains.map((p) => (
              <motion.div
                key={p.title}
                variants={itemFadeUp}
                className="bg-red-50/60 border border-red-100 rounded-2xl p-6"
              >
                <h3 className="font-heading font-bold text-foreground mb-2">
                  {p.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {p.desc}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            className="text-center mb-14"
          >
            <h2 className="text-3xl sm:text-4xl font-heading font-black text-foreground tracking-tight mb-3">
              What you get with LexiReview
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

      {/* State coverage */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-muted/30 border-y border-border/60">
        <div className="max-w-5xl mx-auto">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            className="text-center mb-8"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wider mb-4">
              <MapPin size={14} /> Nationwide
            </div>
            <h2 className="text-2xl sm:text-3xl font-heading font-black text-foreground tracking-tight mb-2">
              Every state, every union territory
            </h2>
            <p className="text-muted-foreground">
              28 states + UTs covered for RERA rules, stamp duty and registration requirements.
            </p>
          </motion.div>
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            className="flex flex-wrap justify-center gap-2"
          >
            {stateCoverage.map((s) => (
              <motion.span
                key={s}
                variants={itemFadeUp}
                className="inline-flex items-center gap-1.5 bg-card border border-border rounded-full px-3.5 py-1.5 text-xs font-semibold text-foreground"
              >
                <CheckCircle2 size={12} className="text-emerald-500" /> {s}
              </motion.span>
            ))}
            <span className="inline-flex items-center gap-1.5 bg-blue-50 border border-blue-200 rounded-full px-3.5 py-1.5 text-xs font-semibold text-blue-700">
              + 12 more
            </span>
          </motion.div>
        </div>
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
              Built for developer volumes
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Business tier is the sweet spot for active developers running multiple projects.
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
              Best for developers
            </div>
            <div className="p-8 sm:p-10">
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-8">
                <div>
                  <div className="text-xs uppercase tracking-wider text-blue-700 font-bold mb-2">
                    Business
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-heading font-black text-foreground">
                      ₹34,999
                    </span>
                    <span className="text-muted-foreground font-medium">/ month</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    500 reviews/month, 50 users, Matter Workspaces, white-label reports, RERA
                    toolkit.
                  </p>
                </div>
                <Link
                  href="https://app.lexireview.in/signup"
                  className="group bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold py-3.5 px-7 rounded-2xl shadow-lg hover:shadow-xl transition-all inline-flex items-center gap-2"
                >
                  Get Started
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  "500 contract reviews per month",
                  "50 user seats",
                  "All RERA tools included",
                  "Stamp duty across 28 states + UTs",
                  "Matter Workspaces",
                  "White-label client reports",
                  "Batch processing",
                  "Account manager + priority support",
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

      {/* Association callout */}
      <section className="py-14 px-4 sm:px-6 lg:px-8 bg-muted/30 border-y border-border/60">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left"
        >
          <div className="flex items-center gap-4">
            <BadgeCheck size={28} className="text-blue-700" />
            <div>
              <div className="font-heading font-bold text-lg text-foreground">
                Programs for CREDAI & NAREDCO members
              </div>
              <p className="text-sm text-muted-foreground">
                Member pricing, joint onboarding sessions and RERA playbooks co-developed with
                industry counsel.
              </p>
            </div>
          </div>
          <Link
            href="/contact"
            className="shrink-0 bg-navy-900 text-white font-bold py-3 px-6 rounded-2xl shadow-lg hover:shadow-xl transition-all inline-flex items-center gap-2"
          >
            Talk to our real estate team <ArrowRight size={14} />
          </Link>
        </motion.div>
      </section>

      {/* Lead magnet */}
      <section className="py-20 sm:py-24 px-4 sm:px-6 lg:px-8">
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
                  The Complete RERA Compliance Handbook for Developers
                </h2>
                <p className="text-muted-foreground">
                  90 pages. State-wise RERA rules, BBA drafting standards, common penalties, and
                  the exact workflow top developers use to stay audit-ready.
                </p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <BookOpen size={14} /> 90 pages · 28 states · 40+ sample clauses
                </div>
              </div>
              <div className="md:col-span-3">
                <LeadForm
                  source="ORGANIC_LANDING"
                  icp="REAL_ESTATE"
                  heading="Send me the handbook"
                  subheading="Free, no strings. Straight to your inbox."
                  ctaLabel="Email me the PDF"
                  successMessage="Check your inbox. Share it with your project counsel team."
                />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Case studies */}
      <section className="py-20 sm:py-24 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-heading font-black text-foreground tracking-tight mb-3">
              How developers are using LexiReview
            </h2>
          </motion.div>
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            className="grid grid-cols-1 md:grid-cols-3 gap-5"
          >
            {caseStudies.map((c) => (
              <motion.div
                key={c.title}
                variants={itemFadeUp}
                className="bg-card rounded-2xl border border-border p-7"
              >
                <div className="text-3xl font-heading font-black text-blue-700">
                  {c.metric}
                </div>
                <div className="text-xs text-muted-foreground mb-5">
                  {c.metricLabel}
                </div>
                <h3 className="font-heading font-bold text-base text-foreground mb-3">
                  {c.title}
                </h3>
                <Quote size={20} className="text-blue-500 mb-2" />
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                  {c.quote}
                </p>
                <div className="text-xs font-heading font-bold text-foreground">
                  {c.author}
                </div>
              </motion.div>
            ))}
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
                Every project. Every clause. RERA-clean.
              </h2>
              <p className="text-base sm:text-lg text-blue-100">
                Upload a BBA and see your RERA exposure in 45 seconds. Free trial, no card.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <Link
                  href="https://app.lexireview.in/signup"
                  className="group bg-white text-blue-800 text-base font-bold py-3.5 px-8 rounded-2xl shadow-lg hover:shadow-xl transition-all inline-flex items-center gap-2"
                >
                  Start Free Trial
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
