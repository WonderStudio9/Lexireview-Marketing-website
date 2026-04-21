"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  Gauge,
  Cpu,
  Search,
  ClipboardCheck,
  Layers,
  UserRoundCheck,
  Clock,
  Wallet,
  FileBox,
  Wand2,
  FileSignature,
  FilePlus2,
  ListChecks,
  Timer,
  Calculator,
  Sparkles,
  Quote,
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
    title: "Time pressure",
    desc: "You’re the partner, associate, paralegal and billing clerk. Reviewing a 40-page MSA takes a whole afternoon.",
    icon: Clock,
  },
  {
    title: "Client pricing",
    desc: "Hourly rates scare off SMEs. Fixed fees eat your margin. You need a way to deliver big-firm quality at solo prices.",
    icon: Wallet,
  },
  {
    title: "Admin overhead",
    desc: "Matter files, intake forms, retainers, timesheets — the chores that should take an hour take a day.",
    icon: FileBox,
  },
  {
    title: "Tech complexity",
    desc: "Enterprise tools need an IT team. You need something that works in minutes, not a six-month rollout.",
    icon: Cpu,
  },
];

const features = [
  {
    title: "Quick Triage",
    desc: "Instant go/no-go in under 2 seconds, zero credits. Know if a contract is worth deep review.",
    icon: Gauge,
    accent: "from-blue-500 to-blue-700",
  },
  {
    title: "6 AI engines",
    desc: "Risk, citations, template comparison, recommendations, overview and custom — all running in parallel.",
    icon: Cpu,
    accent: "from-indigo-500 to-blue-700",
  },
  {
    title: "Precedent Search",
    desc: "Supreme Court, High Courts, NCLAT, NCDRC, RERA and DRT judgments, cited with one click.",
    icon: Search,
    accent: "from-sky-500 to-blue-700",
  },
  {
    title: "Playbooks",
    desc: "Your house positions and fallback clauses applied automatically on every review.",
    icon: ClipboardCheck,
    accent: "from-blue-600 to-indigo-700",
  },
  {
    title: "Matter management",
    desc: "Organise every contract, note, deadline and document by matter. Searchable, shareable, secure.",
    icon: Layers,
    accent: "from-blue-500 to-blue-800",
  },
  {
    title: "Client onboarding",
    desc: "White-labelled intake forms, e-sign retainer agreements, client portal for document upload.",
    icon: UserRoundCheck,
    accent: "from-indigo-600 to-blue-700",
  },
];

const freeTools = [
  {
    title: "Matter Intake Form Generator",
    desc: "Build a branded intake form in minutes.",
    icon: ListChecks,
  },
  {
    title: "Retainer Agreement Generator",
    desc: "BCI-compliant retainer drafts with fee structures.",
    icon: FileSignature,
  },
  {
    title: "Client Onboarding Checklist",
    desc: "Never miss KYC, conflicts or engagement steps.",
    icon: CheckCircle2,
  },
  {
    title: "Time Tracking Template",
    desc: "Per-matter, per-task billing-ready sheet.",
    icon: Timer,
  },
  {
    title: "Fee Structure Analyzer",
    desc: "Benchmark your rates against the market — contested, uncontested, corporate, litigation.",
    icon: Calculator,
  },
];

const testimonials = [
  {
    quote:
      "What used to be a full afternoon of contract review is now 45 seconds. I take on 3x more briefs without burning out.",
    name: "Adv. R. Menon",
    role: "Solo Practice, Bengaluru",
  },
  {
    quote:
      "My clients think I have an army behind me. It’s just me and LexiReview. The playbooks alone saved my first year.",
    name: "Adv. Priya S.",
    role: "Dispute Resolution, Mumbai",
  },
  {
    quote:
      "The retainer generator and intake forms made my admin go from chaotic to boring — which is exactly what I wanted.",
    name: "Adv. K. Reddy",
    role: "Commercial Practice, Hyderabad",
  },
];

const faqs = [
  {
    question: "Is LexiReview really built for a single lawyer?",
    answer:
      "Yes. The Starter plan at ₹4,999/month is optimised for solo practitioners and firms up to 3 seats. No minimum seats, no annual contracts, and no enterprise rollout overhead.",
  },
  {
    question: "How is this different from a generic legal drafting tool?",
    answer:
      "LexiReview is built on Indian law — ICA, DPDP, RBI, SEBI, RERA and stamp acts across 28 states. Every template, playbook and AI engine is tuned for Indian courts, not US common law.",
  },
  {
    question: "Do I need to upload client data to your servers?",
    answer:
      "All data is encrypted in transit and at rest, stored in Indian data centres, and protected under the DPDP Act. Deletion is one-click. You retain full IP over your documents and playbooks.",
  },
  {
    question: "Can I use my own fallback clauses?",
    answer:
      "Yes — that’s what Playbooks are for. Define your positions once and LexiReview applies them to every review, including counterparty markups.",
  },
  {
    question: "Is there a trial?",
    answer:
      "Yes. Start free with 3 full reviews, zero credit card. Upgrade only when you see the value.",
  },
];

export default function SoloLawyersPage() {
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
              { "@type": "ListItem", position: 3, name: "Solo Lawyers", item: "https://lexireview.in/solutions/solo-lawyers" },
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
            <Sparkles size={14} /> For solo & small firms
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl sm:text-5xl lg:text-6xl font-heading font-black tracking-[-0.03em] text-foreground mb-6"
          >
            Build your solo practice with{" "}
            <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              AI
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
          >
            45-second contract review plus practice management tools built for firms of 1–10 lawyers.
            Big-firm output, solo-practice economics.
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

      {/* Problem */}
      <section className="py-20 sm:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-heading font-black text-foreground tracking-tight mb-3">
              Four problems every solo lawyer knows
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Running a practice alone means wearing every hat. LexiReview takes back the hours.
            </p>
          </motion.div>
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            {pains.map((p) => {
              const Icon = p.icon;
              return (
                <motion.div
                  key={p.title}
                  variants={itemFadeUp}
                  className="flex gap-4 bg-card rounded-2xl border border-border p-6"
                >
                  <div className="w-11 h-11 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0">
                    <Icon size={20} />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-foreground mb-1">
                      {p.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {p.desc}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Solution / Features */}
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
              Six capabilities, one subscription
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Everything you need to run a modern, profitable solo practice — no IT team required.
            </p>
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
                  className="group relative bg-card rounded-2xl border border-border p-6 overflow-hidden hover:border-blue-400 transition-colors"
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

      {/* Free tools */}
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
              Free tools
            </div>
            <h2 className="text-3xl sm:text-4xl font-heading font-black text-foreground tracking-tight mb-3">
              Free tools for solo practice
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Start with any of these. No card, no login — just useful.
            </p>
          </motion.div>
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
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
                    <h3 className="font-heading font-bold text-base text-foreground mb-1.5">
                      {t.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed mb-3">
                      {t.desc}
                    </p>
                    <span className="text-blue-700 text-sm font-semibold inline-flex items-center gap-1.5 group-hover:gap-2 transition-all">
                      Use free <ArrowRight size={14} />
                    </span>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 sm:py-24 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-4xl mx-auto">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            className="text-center mb-10"
          >
            <h2 className="text-3xl sm:text-4xl font-heading font-black text-foreground tracking-tight mb-3">
              Pricing built for solo economics
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Starter is the sweet spot for most solo lawyers and small firms. Upgrade any time.
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
              Best for solo
            </div>
            <div className="p-8 sm:p-10">
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-8">
                <div>
                  <div className="text-xs uppercase tracking-wider text-blue-700 font-bold mb-2">
                    Starter
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-heading font-black text-foreground">
                      ₹4,999
                    </span>
                    <span className="text-muted-foreground font-medium">/ month</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    25 reviews/month, 3 users, all playbooks, Quick Triage, API.
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
                  "25 contract reviews per month",
                  "3 user seats",
                  "All out-of-the-box playbooks",
                  "Quick Triage (unlimited)",
                  "Precedent search (SC, HC, NCLAT)",
                  "API access",
                  "Matter management",
                  "Priority chat support",
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
                  The Solo Lawyer’s Practice Management Playbook
                </h2>
                <p className="text-muted-foreground">
                  60 pages on client intake, matter ops, pricing, retainer drafting, court-day
                  workflows and automation — written with practicing Indian advocates.
                </p>
              </div>
              <div className="md:col-span-3">
                <LeadForm
                  source="ORGANIC_LANDING"
                  icp="SOLO_LAWYER"
                  heading="Get the 60-page playbook"
                  subheading="Delivered straight to your inbox. Free, no strings attached."
                  ctaLabel="Email me the PDF"
                  successMessage="PDF sent. Check your inbox — and your spam folder just in case."
                />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
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
              Solo lawyers who made the switch
            </h2>
          </motion.div>
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            className="grid grid-cols-1 md:grid-cols-3 gap-5"
          >
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                variants={itemFadeUp}
                className="bg-card rounded-2xl border border-border p-7"
              >
                <Quote size={24} className="text-blue-500 mb-4" />
                <p className="text-foreground leading-relaxed mb-5">{t.quote}</p>
                <div>
                  <div className="font-heading font-bold text-sm text-foreground">
                    {t.name}
                  </div>
                  <div className="text-xs text-muted-foreground">{t.role}</div>
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
              <Wand2 size={36} className="text-white/90 mx-auto" />
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-black text-white tracking-tight">
                Solo, not alone.
              </h2>
              <p className="text-base sm:text-lg text-blue-100">
                Spin up LexiReview in under 5 minutes. Keep 100% of your practice, add 10× of the
                leverage.
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
