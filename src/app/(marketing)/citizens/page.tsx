"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Home as HomeIcon,
  Briefcase,
  Building2,
  Palette,
  Store,
  Video,
  Rocket,
  Plane,
  ShoppingBag,
  Heart,
  GraduationCap,
  Users,
  Sprout,
  ShieldCheck,
  Sparkles,
  FileText,
  Calculator,
  FileSignature,
  FilePlus,
  MessageSquareWarning,
  BadgeCheck,
  Scale,
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

const segments = [
  {
    slug: "tenants",
    title: "Tenants & Renters",
    desc: "Rent agreements, security deposits, eviction rights.",
    icon: HomeIcon,
    accent: "from-blue-500 to-blue-700",
  },
  {
    slug: "employees",
    title: "Employees",
    desc: "Offer letters, NDAs, non-competes, PF & gratuity.",
    icon: Briefcase,
    accent: "from-indigo-500 to-blue-700",
  },
  {
    slug: "home-buyers",
    title: "Home Buyers",
    desc: "Builder-buyer agreements, stamp duty, RERA checks.",
    icon: Building2,
    accent: "from-sky-500 to-blue-700",
  },
  {
    slug: "freelancers",
    title: "Freelancers",
    desc: "Client SOWs, IP ownership, payment clauses.",
    icon: Palette,
    accent: "from-blue-500 to-indigo-700",
  },
  {
    slug: "msme-owners",
    title: "MSME Owners",
    desc: "Vendor MSAs, GST disputes, MSME Act remedies.",
    icon: Store,
    accent: "from-blue-600 to-blue-800",
  },
  {
    slug: "content-creators",
    title: "Content Creators",
    desc: "Brand deal contracts, copyright, platform TOS.",
    icon: Video,
    accent: "from-blue-500 to-indigo-600",
  },
  {
    slug: "startup-founders",
    title: "Startup Founders",
    desc: "Founders agreements, cap tables, ESOPs.",
    icon: Rocket,
    accent: "from-indigo-600 to-blue-700",
  },
  {
    slug: "nris",
    title: "NRIs",
    desc: "PoA, FEMA, NRI property and succession.",
    icon: Plane,
    accent: "from-sky-500 to-indigo-700",
  },
  {
    slug: "consumers",
    title: "Consumers",
    desc: "Refund rights, consumer forum complaints.",
    icon: ShoppingBag,
    accent: "from-blue-500 to-blue-700",
  },
  {
    slug: "senior-citizens",
    title: "Senior Citizens",
    desc: "Wills, succession, Maintenance Act support.",
    icon: Heart,
    accent: "from-blue-600 to-indigo-700",
  },
  {
    slug: "students",
    title: "Students",
    desc: "Admission contracts, internship agreements, hostel rules.",
    icon: GraduationCap,
    accent: "from-indigo-500 to-blue-700",
  },
  {
    slug: "couples",
    title: "Couples",
    desc: "Pre-nup style agreements, registration, divorce basics.",
    icon: Users,
    accent: "from-sky-500 to-blue-700",
  },
  {
    slug: "farmers",
    title: "Farmers",
    desc: "Crop leases, APMC contracts, farmer producer orgs.",
    icon: Sprout,
    accent: "from-blue-500 to-indigo-700",
  },
];

const heroTools = [
  {
    title: "Rent Agreement Generator",
    desc: "State-specific rent agreement in 90 seconds. Stamp duty + e-stamp ready.",
    icon: FileSignature,
  },
  {
    title: "Stamp Duty Calculator",
    desc: "Instant computation across 28 states + UTs. Sale, lease, gift, partnership.",
    icon: Calculator,
  },
  {
    title: "Offer Letter Decoder",
    desc: "Upload your offer letter and see what your non-compete really means.",
    icon: FileText,
  },
  {
    title: "NDA Generator",
    desc: "Mutual or one-way, lawyer-verified, aligned to the ICA.",
    icon: FilePlus,
  },
  {
    title: "Consumer Complaint Drafter",
    desc: "Draft a consumer forum complaint in minutes. e-Daakhil ready.",
    icon: MessageSquareWarning,
  },
];

const trustSignals = [
  {
    title: "Free forever",
    desc: "All citizen tools are free. No credit card, no trial traps. We make money from businesses and law firms.",
    icon: Sparkles,
  },
  {
    title: "State-specific",
    desc: "Tools adapt to Maharashtra, Karnataka, Delhi, Tamil Nadu and every other state. Stamp duty and registration rules change; our tools keep up.",
    icon: ShieldCheck,
  },
  {
    title: "Lawyer-verified options",
    desc: "Every template is reviewed by practicing Indian advocates. Need a second pair of eyes? Book a verified lawyer in one click.",
    icon: BadgeCheck,
  },
];

const faqs = [
  {
    question: "Are these legal tools really free?",
    answer:
      "Yes. Every citizen tool on LexiReview is free to use with no hidden fees or forced signups. We fund it through our paid products for businesses, law firms and NBFCs.",
  },
  {
    question: "Are the templates lawyer-verified?",
    answer:
      "Every template has been drafted or reviewed by practicing Indian lawyers and updated against the latest statutes. You can also book a one-hour lawyer review if your matter is complex.",
  },
  {
    question: "Do your tools cover all Indian states?",
    answer:
      "Yes. Our stamp duty calculator, rent agreement generator and registration flows cover all 28 states and UTs. Tools highlight when state-specific amendments apply.",
  },
  {
    question: "Do I need to create an account to use these tools?",
    answer:
      "Most tools work without an account. We only ask for email if you want to save a draft, download a PDF with your details pre-filled, or receive legal updates.",
  },
  {
    question: "Is my data safe?",
    answer:
      "Yes. LexiReview is built to DPDP Act standards, data is encrypted in transit and at rest, and Indian data is stored in Indian data centres. We never sell personal data.",
  },
  {
    question: "What if my problem is beyond a template?",
    answer:
      "Use the ‘Talk to a Lawyer’ button on any tool. You’ll be matched with a verified advocate who handles your problem type and state, usually within 24 hours.",
  },
];

export default function CitizensPage() {
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
              { "@type": "ListItem", position: 2, name: "For Citizens", item: "https://lexireview.in/citizens" },
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
            <Sparkles size={14} /> For every Indian citizen
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl sm:text-5xl lg:text-6xl font-heading font-black tracking-[-0.03em] text-foreground mb-6"
          >
            Legal help for every{" "}
            <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              Indian citizen
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
          >
            Free, lawyer-verified tools and templates for renters, employees, home buyers, founders,
            NRIs, consumers and more. Built for Indian law, state by state.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8"
          >
            <Link
              href="#tools"
              className="group bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold py-3.5 px-8 rounded-2xl shadow-lg hover:shadow-xl transition-all inline-flex items-center gap-2"
            >
              Browse Free Tools
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/contact"
              className="text-foreground hover:text-blue-700 font-semibold transition-colors inline-flex items-center gap-2"
            >
              Talk to a Lawyer <ArrowRight size={14} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Segments grid */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-heading font-black text-foreground tracking-tight mb-3">
              Find tools for your situation
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              13 citizen segments. Pick yours — we’ll show you exactly the templates, calculators,
              and lawyer help you need.
            </p>
          </motion.div>
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
          >
            {segments.map((s) => {
              const Icon = s.icon;
              return (
                <motion.div key={s.slug} variants={itemScale}>
                  <Link
                    href="#"
                    data-citizen-slug={s.slug}
                    className="group block h-full bg-card rounded-2xl border border-border/80 p-6 card-3d overflow-hidden hover:border-blue-400 transition-colors"
                  >
                    <div
                      className={`w-11 h-11 rounded-xl bg-gradient-to-br ${s.accent} text-white flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform duration-300`}
                    >
                      <Icon size={20} />
                    </div>
                    <h3 className="font-heading font-bold text-base text-foreground mb-1.5">
                      {s.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed mb-3">
                      {s.desc}
                    </p>
                    <span className="text-blue-700 text-sm font-semibold inline-flex items-center gap-1.5 group-hover:gap-2 transition-all">
                      Explore <ArrowRight size={14} />
                    </span>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Featured tools */}
      <section id="tools" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            className="text-center mb-14"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-4">
              Most used
            </div>
            <h2 className="text-3xl sm:text-4xl font-heading font-black text-foreground tracking-tight mb-3">
              Five hero tools, free forever
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              The tools thousands of Indians use every week. No login required.
            </p>
          </motion.div>
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {heroTools.map((t) => {
              const Icon = t.icon;
              return (
                <motion.div
                  key={t.title}
                  variants={itemFadeUp}
                  className="group relative bg-card rounded-2xl border border-border p-6 hover:border-blue-400 transition-colors overflow-hidden"
                >
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-blue-700 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 text-white flex items-center justify-center mb-4 shadow-sm">
                    <Icon size={20} />
                  </div>
                  <h3 className="font-heading font-bold text-lg text-foreground mb-2">
                    {t.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                    {t.desc}
                  </p>
                  <Link
                    href="#"
                    className="text-blue-700 text-sm font-bold inline-flex items-center gap-1.5 group-hover:gap-2 transition-all"
                  >
                    Use free <ArrowRight size={14} />
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Why LexiReview */}
      <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-heading font-black text-foreground tracking-tight mb-3">
              Why citizens trust LexiReview
            </h2>
          </motion.div>
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            className="grid grid-cols-1 md:grid-cols-3 gap-5"
          >
            {trustSignals.map((t) => {
              const Icon = t.icon;
              return (
                <motion.div
                  key={t.title}
                  variants={itemScale}
                  className="bg-card rounded-2xl border border-border p-7 text-center"
                >
                  <div className="inline-flex w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 text-white items-center justify-center mb-5 shadow-sm">
                    <Icon size={24} />
                  </div>
                  <h3 className="font-heading font-bold text-lg text-foreground mb-2">
                    {t.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {t.desc}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Lead capture */}
      <section className="py-20 sm:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <motion.div
            variants={scaleReveal}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
          >
            <LeadForm
              source="ORGANIC_LANDING"
              icp="CITIZEN"
              heading="Get legal tips in your inbox"
              subheading="One email a week. Know your rights before you sign. State-specific updates on rent, work, property, consumer and family law."
              ctaLabel="Subscribe free"
              successMessage="You’re subscribed. Watch your inbox for the first edition this week."
            />
          </motion.div>
        </div>
      </section>

      {/* FAQ */}
      <FAQSection
        items={faqs}
        subtitle="Everything people ask before they use our tools."
      />

      {/* CTA bar */}
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
                Legal clarity, without the legal bill.
              </h2>
              <p className="text-base sm:text-lg text-blue-100">
                Browse 40+ free tools, or get matched with a verified Indian advocate in under 24
                hours.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <Link
                  href="#tools"
                  className="group bg-white text-blue-800 text-base font-bold py-3.5 px-8 rounded-2xl shadow-lg hover:shadow-xl transition-all inline-flex items-center gap-2"
                >
                  Start with a free tool
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/contact"
                  className="text-white/90 hover:text-white font-semibold transition-colors inline-flex items-center gap-2"
                >
                  Talk to a lawyer <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
