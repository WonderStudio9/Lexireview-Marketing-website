"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Building2,
  Cpu,
  Layers,
  ClipboardCheck,
  Palette,
  Search,
  Brain,
  ShieldCheck,
  Server,
  Globe2,
  Calculator,
  BookOpen,
  CalendarCheck,
  Download,
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
    title: "Contract ops at scale",
    desc: "Managing thousands of matters, counterparty redlines and clause libraries across 50+ lawyers without losing consistency or speed.",
  },
  {
    title: "Client SLAs",
    desc: "Tier-1 clients expect 24-48 hour turnarounds on complex redlines. Manual workflows won’t hit those numbers.",
  },
  {
    title: "Knowledge management",
    desc: "Precedent and know-how sit in partner inboxes, shared drives, and associate memory. You can’t scale what you can’t search.",
  },
  {
    title: "White-labelled client work",
    desc: "Your biggest clients want a branded portal — not another vendor logo splashed over their deals.",
  },
];

const features = [
  {
    title: "6 parallel AI engines",
    desc: "Risk, citations, template comparison, recommendations, overview and custom — running concurrently in under 45 seconds.",
    icon: Cpu,
    accent: "from-blue-500 to-blue-700",
  },
  {
    title: "Matter Workspaces",
    desc: "Every deal and litigation as a workspace: contracts, notes, deadlines, precedents and associates in one place.",
    icon: Layers,
    accent: "from-indigo-500 to-blue-700",
  },
  {
    title: "Playbooks",
    desc: "Codify partner preferences into enforced standards. Associates apply the firm’s house positions automatically.",
    icon: ClipboardCheck,
    accent: "from-sky-500 to-blue-700",
  },
  {
    title: "White-label client portals",
    desc: "Your brand, your domain. Deliver reports, dashboards and client-facing reviews under your firm’s identity.",
    icon: Palette,
    accent: "from-blue-600 to-indigo-700",
  },
  {
    title: "Precedent Search",
    desc: "Indexed search across Supreme Court, High Courts, NCLAT, NCDRC, RERA and DRT. Click through to cited authorities.",
    icon: Search,
    accent: "from-blue-500 to-blue-800",
  },
  {
    title: "Custom AI engines",
    desc: "Train LexiReview on your firm’s know-how, MSAs and templates. Outputs stay in your tenant, never in training data.",
    icon: Brain,
    accent: "from-indigo-600 to-blue-700",
  },
];

const security = [
  {
    title: "SOC 2 Type II",
    desc: "Audit in progress, controls already mapped to the AICPA Trust Services Criteria.",
    icon: ShieldCheck,
  },
  {
    title: "ISO 27001",
    desc: "Information Security Management System rollout on track for certification.",
    icon: ShieldCheck,
  },
  {
    title: "DPDP Processor DPA",
    desc: "Standard DPA aligned to the Digital Personal Data Protection Act, 2023.",
    icon: BookOpen,
  },
  {
    title: "India data residency",
    desc: "All firm data stored exclusively in Indian data centres. Optional VPC deployment.",
    icon: Server,
  },
];

const whitepapers = [
  {
    title: "AI Adoption in Big Law India",
    desc: "Benchmarks, rollout blueprints and associate upskilling plans from 20+ Tier-1 firms.",
  },
  {
    title: "White-Label Legal Tech for Multi-Location Firms",
    desc: "Deployment patterns, branding guardrails and client-retention impact across offices.",
  },
  {
    title: "Contract Ops at Scale",
    desc: "How leading firms cut redline turnaround by 62% without adding headcount.",
  },
];

const faqs = [
  {
    question: "How does LexiReview deploy for a 200-lawyer firm?",
    answer:
      "We deliver a dedicated tenant with SSO (Okta, Azure AD), role-based access, practice-group isolation and firm-wide playbooks. Typical rollout is 3-6 weeks, with white-glove onboarding and partner training.",
  },
  {
    question: "Can we bring our own model or stay in our VPC?",
    answer:
      "Yes. Enterprise deployments support private VPC hosting in India and bring-your-own-model configurations for sensitive matters. Data never leaves your environment for training.",
  },
  {
    question: "How is white-label billed?",
    answer:
      "Included in our Enterprise plan. You get custom domain, firm branding, report templates and client portals. Separate client tenants for confidentiality are supported.",
  },
  {
    question: "What does the security review look like?",
    answer:
      "We provide DPDP DPA, SOC 2 Type II progress reports, penetration test summaries, data flow diagrams, subprocessor list and evidence for your InfoSec and client due diligence.",
  },
  {
    question: "Do you integrate with iManage, NetDocuments or Lexis?",
    answer:
      "Yes. Integrations for iManage, NetDocuments, Microsoft 365, Lexis, Manupatra and SCC Online are available, plus REST APIs and webhooks for custom DMS setups.",
  },
];

export default function LawFirmsPage() {
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
              { "@type": "ListItem", position: 3, name: "Law Firms", item: "https://lexireview.in/solutions/law-firms" },
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
            <Building2 size={14} /> For tier-1 & mid-tier firms
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl sm:text-5xl lg:text-6xl font-heading font-black tracking-[-0.03em] text-foreground mb-6"
          >
            Contract intelligence for{" "}
            <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              India’s leading law firms
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
          >
            Scale, white-label and AI workflows purpose-built for 50+ lawyer teams. Enterprise
            security, India data residency, firm-first deployment.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8"
          >
            <Link
              href="/contact"
              className="group bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold py-3.5 px-8 rounded-2xl shadow-lg hover:shadow-xl transition-all inline-flex items-center gap-2"
            >
              Book a Strategic Demo
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="#roi"
              className="text-foreground hover:text-blue-700 font-semibold transition-colors inline-flex items-center gap-2"
            >
              <Download size={14} /> Download ROI Report
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Pains */}
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
              What partners keep telling us
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
                className="bg-card rounded-2xl border border-border p-6"
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
              Six enterprise-grade capabilities
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

      {/* Named account callout */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 border-y border-border/60 bg-muted/20">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          className="max-w-5xl mx-auto text-center"
        >
          <p className="text-xs uppercase tracking-wider text-muted-foreground font-bold mb-5">
            Trusted by India’s top law firms
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
            {[
              "Confidential Tier-1",
              "Mid-Tier Full-Service",
              "Boutique Disputes",
              "Corporate Advisory",
              "IP Specialists",
              "GC Network",
            ].map((logo) => (
              <div
                key={logo}
                className="font-heading font-bold text-sm sm:text-base text-foreground/50 uppercase tracking-wider"
              >
                {logo}
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Security */}
      <section className="py-20 sm:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-4">
              <ShieldCheck size={14} /> Security & compliance
            </div>
            <h2 className="text-3xl sm:text-4xl font-heading font-black text-foreground tracking-tight mb-3">
              Enterprise-grade security by default
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Built to satisfy your InfoSec, audit and client due-diligence teams.
            </p>
          </motion.div>
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
          >
            {security.map((s) => {
              const Icon = s.icon;
              return (
                <motion.div
                  key={s.title}
                  variants={itemScale}
                  className="bg-card rounded-2xl border border-border p-6 text-center"
                >
                  <div className="inline-flex w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 text-white items-center justify-center mb-4">
                    <Icon size={22} />
                  </div>
                  <h3 className="font-heading font-bold text-base text-foreground mb-2">
                    {s.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {s.desc}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ROI calculator teaser */}
      <section id="roi" className="py-20 sm:py-24 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-5xl mx-auto">
          <motion.div
            variants={scaleReveal}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            className="relative rounded-3xl bg-card border border-border p-8 sm:p-12 overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="relative grid md:grid-cols-2 gap-8 items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wider mb-4">
                  <Calculator size={14} /> ROI calculator
                </div>
                <h3 className="text-2xl sm:text-3xl font-heading font-black text-foreground mb-3">
                  See how much your firm saves
                </h3>
                <p className="text-muted-foreground mb-6">
                  Plug in your lawyer count, average review hours and utilisation. We’ll show your
                  projected turnaround, billable capacity recovered and annualised savings.
                </p>
                <Link
                  href="#roi"
                  className="group bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold py-3 px-6 rounded-2xl shadow-lg hover:shadow-xl transition-all inline-flex items-center gap-2"
                >
                  Open the ROI calculator
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-muted/40 rounded-2xl p-5 text-center">
                  <div className="text-3xl font-heading font-black text-blue-700">62%</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Faster redline turnaround
                  </div>
                </div>
                <div className="bg-muted/40 rounded-2xl p-5 text-center">
                  <div className="text-3xl font-heading font-black text-blue-700">3.4×</div>
                  <div className="text-xs text-muted-foreground mt-1">Associate leverage</div>
                </div>
                <div className="bg-muted/40 rounded-2xl p-5 text-center">
                  <div className="text-3xl font-heading font-black text-blue-700">₹2.1Cr</div>
                  <div className="text-xs text-muted-foreground mt-1">Annual savings (50 lawyers)</div>
                </div>
                <div className="bg-muted/40 rounded-2xl p-5 text-center">
                  <div className="text-3xl font-heading font-black text-blue-700">98.5%</div>
                  <div className="text-xs text-muted-foreground mt-1">Detection accuracy</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Whitepapers */}
      <section className="py-20 sm:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wider mb-4">
              <BookOpen size={14} /> Featured whitepapers
            </div>
            <h2 className="text-3xl sm:text-4xl font-heading font-black text-foreground tracking-tight mb-3">
              Read how leading firms are adopting AI
            </h2>
          </motion.div>
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            className="grid grid-cols-1 md:grid-cols-3 gap-5"
          >
            {whitepapers.map((w) => (
              <motion.div key={w.title} variants={itemFadeUp}>
                <Link
                  href="#"
                  className="group block h-full bg-card rounded-2xl border border-border p-6 hover:border-blue-400 transition-colors"
                >
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 text-white flex items-center justify-center mb-4 shadow-sm">
                    <BookOpen size={20} />
                  </div>
                  <h3 className="font-heading font-bold text-base text-foreground mb-2">
                    {w.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-3">
                    {w.desc}
                  </p>
                  <span className="text-blue-700 text-sm font-bold inline-flex items-center gap-1.5 group-hover:gap-2 transition-all">
                    Download <ArrowRight size={14} />
                  </span>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Case study */}
      <section className="py-20 sm:py-24 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-5xl mx-auto">
          <motion.div
            variants={scaleReveal}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            className="relative rounded-3xl bg-card border border-border p-8 sm:p-12 overflow-hidden"
          >
            <div className="relative grid md:grid-cols-3 gap-8 items-center">
              <div className="md:col-span-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wider mb-4">
                  Case study
                </div>
                <h3 className="text-2xl sm:text-3xl font-heading font-black text-foreground mb-4">
                  120-lawyer firm cuts M&A redline time by 58%
                </h3>
                <Quote size={24} className="text-blue-500 mb-3" />
                <p className="text-muted-foreground leading-relaxed mb-4">
                  “LexiReview’s playbooks enforced partner preferences across 40+ associates
                  overnight. We reclaimed senior bandwidth and closed deals three weeks faster on
                  average.”
                </p>
                <div className="text-sm font-heading font-bold text-foreground">
                  Head of Knowledge, Tier-1 firm (anonymised)
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-1 gap-4 text-center">
                <div className="bg-muted/40 rounded-2xl p-5">
                  <div className="text-3xl font-heading font-black text-blue-700">58%</div>
                  <div className="text-xs text-muted-foreground mt-1">Redline time saved</div>
                </div>
                <div className="bg-muted/40 rounded-2xl p-5">
                  <div className="text-3xl font-heading font-black text-blue-700">120</div>
                  <div className="text-xs text-muted-foreground mt-1">Lawyers onboarded</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Demo booking */}
      <section className="py-20 sm:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            variants={scaleReveal}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            className="grid md:grid-cols-5 gap-8 items-center"
          >
            <div className="md:col-span-2 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wider">
                <CalendarCheck size={14} /> Strategic demo
              </div>
              <h2 className="text-3xl font-heading font-black text-foreground tracking-tight">
                Book a 45-min strategic demo
              </h2>
              <p className="text-muted-foreground">
                Walk our solution architects through your practice. We’ll show you a tailored
                LexiReview deployment, ROI model and security pack.
              </p>
              <a
                href="https://cal.com/lexireview/strategic-demo"
                target="_blank"
                rel="noreferrer"
                className="group bg-navy-900 text-white font-bold py-3 px-6 rounded-2xl shadow-lg hover:shadow-xl transition-all inline-flex items-center gap-2"
              >
                Open Cal.com <ArrowRight size={16} />
              </a>
            </div>
            <div className="md:col-span-3">
              <LeadForm
                source="ORGANIC_LANDING"
                icp="LAW_FIRM"
                heading="Or email me the firm pack"
                subheading="Security docs, ROI report and deployment guide. Sent within a business hour."
                ctaLabel="Send me the pack"
                successMessage="Sent. Our firms team will reach out from sales@lexireview.in."
                showNameField
              />
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
            className="relative rounded-[2rem] overflow-hidden bg-gradient-to-br from-blue-800 to-blue-950 text-center px-6 py-14 sm:py-20"
          >
            <div className="absolute top-[-40%] left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-white/10 rounded-full blur-[100px] pointer-events-none" />
            <div className="relative z-10 max-w-2xl mx-auto space-y-6">
              <Globe2 size={36} className="text-white/90 mx-auto" />
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-black text-white tracking-tight">
                Your firm’s AI. Your brand. Your rules.
              </h2>
              <p className="text-base sm:text-lg text-blue-100">
                Talk to our firms team about a white-label rollout, private VPC deployment, or
                custom AI engines. Email{" "}
                <a href="mailto:sales@lexireview.in" className="underline">
                  sales@lexireview.in
                </a>{" "}
                or book a demo.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <Link
                  href="/contact"
                  className="group bg-white text-blue-900 text-base font-bold py-3.5 px-8 rounded-2xl shadow-lg hover:shadow-xl transition-all inline-flex items-center gap-2"
                >
                  Book a Strategic Demo
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <a
                  href="mailto:sales@lexireview.in"
                  className="text-white/90 hover:text-white font-semibold transition-colors inline-flex items-center gap-2"
                >
                  Email sales@lexireview.in <ArrowRight size={14} />
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
