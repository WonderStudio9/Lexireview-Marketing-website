"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Home as HomeIcon,
  FileSignature,
  Calculator,
  Receipt,
  ShieldCheck,
  Sparkles,
  AlertCircle,
  IndianRupee,
  ScrollText,
  KeyRound,
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
    title: "Security deposits taken hostage",
    desc: "Two months of rent locked in, no receipt, no clear return timeline. Most deposit disputes never reach the rent controller because tenants do not know their rights.",
    icon: IndianRupee,
  },
  {
    title: "Unregistered rent agreements",
    desc: "An 11-month leave-and-licence without registration is inadmissible as evidence in most states. If your landlord tries to evict you on 24 hours notice, the paper is worthless.",
    icon: ScrollText,
  },
  {
    title: "HRA rejected for missing receipts",
    desc: "Employers now demand PAN-linked rental receipts for HRA above ₹1 lakh/year. A WhatsApp screenshot of a bank transfer will not pass tax scrutiny under Section 10(13A).",
    icon: Receipt,
  },
  {
    title: "Arbitrary rent hikes and eviction threats",
    desc: "Rent Control Acts (and their state replacements) cap hikes, require notice, and restrict grounds for eviction. Most tenants never read the statute that protects them.",
    icon: AlertCircle,
  },
];

const tools = [
  {
    title: "Rent Agreement Generator",
    desc: "State-specific rent agreement in 90 seconds. Covers deposit, notice, maintenance, lock-in and dispute resolution. Stamp duty and e-stamp ready.",
    icon: FileSignature,
    href: "/tools/rent-agreement-generator",
  },
  {
    title: "Stamp Duty Calculator",
    desc: "Instant stamp duty computation across all 28 states and UTs. Works for leave-and-licence, rent, gift, sale, partnership and more.",
    icon: Calculator,
    href: "/tools/stamp-duty-calculator",
  },
  {
    title: "Rental Receipt Generator",
    desc: "PAN-linked, HRA-ready rental receipts with landlord details, period, amount and signatures. Download monthly or yearly bundles.",
    icon: Receipt,
    href: "/tools/rental-receipt-generator",
  },
];

const guides = [
  {
    title: "Rent Agreement Must-Haves: A Checklist for Indian Tenants",
    desc: "The 14 clauses every rent agreement needs, from stamp duty to notice period, written for tenants, not landlords.",
    href: "/blog/rent-agreement-checklist-india",
    tag: "Tenants 101",
  },
  {
    title: "Leave and Licence vs Rent Agreement: Which One Protects You",
    desc: "The legal difference matters for eviction, registration and stamp duty. A plain-English breakdown with state-specific nuance.",
    href: "/blog/leave-licence-vs-rent-agreement-india",
    tag: "Legal basics",
  },
  {
    title: "How to Claim HRA With Rent Receipts in 2026",
    desc: "Section 10(13A), PAN threshold, landlord pitfalls and what the tax department actually asks for when they audit.",
    href: "/blog/hra-rent-receipts-guide-india",
    tag: "Tax",
  },
  {
    title: "Security Deposit Law in India: What Landlords Cannot Do",
    desc: "State caps on deposits, return timelines, legal remedies if your landlord refuses to refund.",
    href: "/blog/security-deposit-law-india",
    tag: "Disputes",
  },
];

const faqs = [
  {
    question: "Is a rent agreement on plain paper legally valid in India?",
    answer:
      "An unregistered rent agreement on plain paper is not void, but it has limited evidentiary value and cannot be used for leases over 11 months. Proper stamp duty and, where applicable, registration under the Registration Act, 1908 are essential for enforceability.",
  },
  {
    question: "What stamp duty applies to a rent agreement?",
    answer:
      "Stamp duty varies by state. In Maharashtra, leave-and-licence for residential property attracts 0.25% of the total rent plus deposit. In Karnataka, it is typically 0.5%. Delhi uses a slab system. Use our stamp duty calculator for your exact state and amount.",
  },
  {
    question: "Can a landlord increase rent mid-lease?",
    answer:
      "Only if the agreement explicitly allows it. Rent Control Acts in most states cap annual hikes, and new state rental laws (such as the Model Tenancy Act, 2021) require written notice. Verbal increases without notice are not enforceable.",
  },
  {
    question: "What is the maximum security deposit a landlord can take?",
    answer:
      "The Model Tenancy Act, 2021 caps residential deposits at two months of rent and commercial at six months. Several states have adopted these limits. Maharashtra and Karnataka still allow higher amounts by contract, but arbitrary forfeiture is actionable.",
  },
  {
    question: "How do I get my security deposit back if the landlord refuses?",
    answer:
      "Send a written demand. If unresolved, file before the Rent Controller or the civil court. Under the Model Tenancy Act, a tenant is entitled to interest on wrongfully withheld deposits. Many states also allow consumer forum complaints for deficient service.",
  },
];

export default function TenantsLandingPage() {
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
              { "@type": "ListItem", position: 3, name: "Tenants & Landlords", item: "https://lexireview.in/citizens/tenants" },
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
            <HomeIcon size={14} /> Tenants & Landlords
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl sm:text-5xl lg:text-6xl font-heading font-black tracking-[-0.03em] text-foreground mb-6"
          >
            Never sign a{" "}
            <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              bad rent agreement
            </span>{" "}
            again
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
          >
            Free, state-specific rent agreement, stamp duty calculator and HRA-ready rental
            receipts — for every tenant and landlord in India. Lawyer-verified. No signup required.
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
              Generate a Rent Agreement
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
              The four problems every Indian tenant runs into
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              The law is on your side more often than you think. Most disputes lose because the
              paper trail is missing.
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

      {/* Tools */}
      <section id="tools" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            className="text-center mb-14"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-4">
              Tools for you
            </div>
            <h2 className="text-3xl sm:text-4xl font-heading font-black text-foreground tracking-tight mb-3">
              Three free tools, built for Indian rentals
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              All state-specific. All lawyer-verified. No signup required to download a draft.
            </p>
          </motion.div>
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            className="grid grid-cols-1 md:grid-cols-3 gap-5"
          >
            {tools.map((t) => {
              const Icon = t.icon;
              return (
                <motion.div key={t.title} variants={itemScale}>
                  <Link
                    href={t.href}
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

      {/* Guides */}
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
              Guides every Indian tenant should read
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Short, plain-English, written by Indian lawyers.
            </p>
          </motion.div>
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            className="grid grid-cols-1 md:grid-cols-2 gap-5"
          >
            {guides.map((g) => (
              <motion.div key={g.title} variants={itemFadeUp}>
                <Link
                  href={g.href}
                  className="group block h-full bg-card rounded-2xl border border-border p-6 hover:border-blue-400 transition-colors"
                >
                  <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-[10px] font-bold uppercase tracking-wider mb-4">
                    {g.tag}
                  </div>
                  <h3 className="font-heading font-bold text-lg text-foreground mb-2">
                    {g.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-3">
                    {g.desc}
                  </p>
                  <span className="text-blue-700 text-sm font-semibold inline-flex items-center gap-1.5 group-hover:gap-2 transition-all">
                    Read the guide <ArrowRight size={14} />
                  </span>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Lead capture */}
      <section className="py-20 sm:py-24 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-3xl mx-auto">
          <motion.div
            variants={scaleReveal}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
          >
            <LeadForm
              source="ORGANIC_LANDING"
              icp="TENANT_LANDLORD"
              heading="Get tenant & landlord updates"
              subheading="One email a week on rent control changes, stamp duty updates, eviction caselaw and new state rental rules. State-specific, not spam."
              ctaLabel="Subscribe free"
              successMessage="You’re subscribed. Watch for our next edition on rental law."
            />
          </motion.div>
        </div>
      </section>

      {/* FAQ */}
      <FAQSection
        items={faqs}
        subtitle="The questions tenants and landlords ask us every week."
      />

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
              <KeyRound size={36} className="text-white/90 mx-auto" />
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-black text-white tracking-tight">
                Your rental, on your terms.
              </h2>
              <p className="text-base sm:text-lg text-blue-100">
                Generate a rent agreement, calculate stamp duty and download HRA-ready receipts —
                all free, all in under five minutes.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <Link
                  href="/tools/rent-agreement-generator"
                  className="group bg-white text-blue-800 text-base font-bold py-3.5 px-8 rounded-2xl shadow-lg hover:shadow-xl transition-all inline-flex items-center gap-2"
                >
                  Start with a Rent Agreement
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
