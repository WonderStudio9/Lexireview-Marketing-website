"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Plane,
  FileSignature,
  Gift,
  Building2,
  AlertCircle,
  Globe2,
  ShieldCheck,
  Stamp,
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
    title: "Property transactions you can’t attend in person",
    desc: "Sale, mortgage, lease, registration — all require physical presence unless covered by a properly executed and apostilled Power of Attorney. Most NRIs get the POA wrong the first time.",
    icon: Building2,
  },
  {
    title: "Gift and succession paperwork that invites scrutiny",
    desc: "Gifts between relatives carry tax exemption under Section 56(2)(x), but a poorly drafted gift deed or missing stamp duty can turn the transfer into a taxable event and litigation ten years later.",
    icon: Gift,
  },
  {
    title: "FEMA compliance on every rupee",
    desc: "Repatriation, acquisition and sale of Indian assets by NRIs are governed by the Foreign Exchange Management Act, 1999 and RBI regulations. Violations attract civil and criminal liability.",
    icon: AlertCircle,
  },
  {
    title: "Apostille, notarisation and the Indian consulate",
    desc: "A POA executed abroad must be apostilled (Hague Convention countries) or attested by the Indian consulate (others), then adjudicated for stamp duty in India. Miss a step, lose the document.",
    icon: Stamp,
  },
];

const tools = [
  {
    title: "Power of Attorney Generator",
    desc: "Special or general POA, state-specific stamping, NRI-ready with apostille guidance. Covers sale, lease, litigation, banking and representation.",
    icon: FileSignature,
    href: "/tools/power-of-attorney-generator",
  },
  {
    title: "Gift Deed Generator",
    desc: "Gift of immovable and movable property under the Transfer of Property Act, 1882. Relative-exemption aware, stamp duty by state.",
    icon: Gift,
    href: "/tools/gift-deed-generator",
  },
];

const guides = [
  {
    title: "NRI Power of Attorney: A 10-Step Checklist",
    desc: "From drafting to apostille to Indian stamping — everything an NRI must do to make a POA actually work in India.",
    href: "/blog/nri-power-of-attorney-india",
    tag: "POA",
  },
  {
    title: "NRI Property Sale in India: FEMA, TDS and Repatriation",
    desc: "Section 195 TDS, Schedule III repatriation limits, Form 15CA/CB and capital gains — in one walkthrough.",
    href: "/blog/nri-property-sale-fema-tds",
    tag: "FEMA",
  },
  {
    title: "Succession Planning for NRIs: Will vs Nomination vs Gift",
    desc: "Which instrument protects which asset class, and how Indian Succession Act, 1925 interacts with country-of-residence law.",
    href: "/blog/nri-succession-planning-india",
    tag: "Succession",
  },
  {
    title: "NRE, NRO and FCNR Accounts: Legal Differences",
    desc: "Repatriability, taxability, joint holding rules and the documents banks actually need for account opening and closure.",
    href: "/blog/nre-nro-fcnr-legal-differences",
    tag: "Banking",
  },
];

const faqs = [
  {
    question: "Do I need to apostille my Power of Attorney?",
    answer:
      "If the POA is executed in a Hague Apostille Convention country, it must be apostilled and then stamped in India (typically within three months to avoid penalty). Non-Hague countries require Indian consulate attestation. In both cases, Indian stamp duty adjudication is the final step.",
  },
  {
    question: "Can I sell inherited property in India as an NRI?",
    answer:
      "Yes. NRIs can sell inherited residential and commercial property to residents, other NRIs or OCIs. Agricultural land, plantation property and farmhouses have restrictions. TDS under Section 195 applies at 20%+ for long-term gains on the sale.",
  },
  {
    question: "What is the stamp duty on a gift deed between relatives?",
    answer:
      "Most states charge concessional stamp duty on gift deeds between blood relatives — typically ₹200–₹500 plus registration, compared to 5–7% for non-relatives. Maharashtra, Karnataka and Delhi all offer this concession; exact amounts vary by state.",
  },
  {
    question: "How do I repatriate sale proceeds of inherited property?",
    answer:
      "Up to USD 1 million per financial year per individual under RBI’s Liberalised Remittance Scheme and Schedule III of FEMA (Current Account Transactions) Rules, 2000. You need Form 15CA/CB, the sale deed, proof of inheritance and PAN.",
  },
  {
    question: "Is a POA executed abroad valid in India?",
    answer:
      "Only if it complies with the Registration Act, 1908, the Indian Stamp Act, 1899 (as amended by the state), and has been apostilled or consular-attested and, where immovable property is involved, registered in the relevant sub-registrar’s office within the statutory period.",
  },
];

export default function NRILandingPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: "https://lexireview.in" }, { "@type": "ListItem", position: 2, name: "For Citizens", item: "https://lexireview.in/citizens" }, { "@type": "ListItem", position: 3, name: "NRIs", item: "https://lexireview.in/citizens/nri" }] }) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.question, acceptedAnswer: { "@type": "Answer", text: f.answer } })) }) }} />

      <section className="relative pt-32 pb-16 sm:pt-40 sm:pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 aurora-bg opacity-60" />
        <div className="absolute inset-0 grain" />
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 12, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.5 }} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue-200 bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider mb-6">
            <Plane size={14} /> NRIs
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }} className="text-4xl sm:text-5xl lg:text-6xl font-heading font-black tracking-[-0.03em] text-foreground mb-6">
            India paperwork, done{" "}
            <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">from anywhere</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }} className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Free Power of Attorney and Gift Deed generators for NRIs. Apostille-ready, state-stamp-compliant, FEMA-aware — so you don’t have to fly in for every signature.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.5 }} className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
            <Link href="#tools" className="group bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold py-3.5 px-8 rounded-2xl shadow-lg hover:shadow-xl transition-all inline-flex items-center gap-2">
              Generate a POA <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/contact" className="text-foreground hover:text-blue-700 font-semibold transition-colors inline-flex items-center gap-2">Talk to an NRI Specialist <ArrowRight size={14} /></Link>
          </motion.div>
        </div>
      </section>

      <section className="py-20 sm:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={viewport} className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-heading font-black text-foreground tracking-tight mb-3">Four problems every NRI with Indian assets hits</h2>
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
            <h2 className="text-3xl sm:text-4xl font-heading font-black text-foreground tracking-tight mb-3">Two free tools for NRIs</h2>
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
            <h2 className="text-3xl sm:text-4xl font-heading font-black text-foreground tracking-tight mb-3">Guides every NRI should read</h2>
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
            <LeadForm source="ORGANIC_LANDING" icp="NRI" heading="NRI-law updates in your inbox" subheading="Weekly briefing on FEMA, NRI taxation, property laws and succession. Plain English, Indian law, global audience." ctaLabel="Subscribe free" successMessage="You’re subscribed. First edition ships this week." />
          </motion.div>
        </div>
      </section>

      <FAQSection items={faqs} subtitle="The questions NRIs ask before signing anything for India." />

      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div variants={scaleReveal} initial="hidden" whileInView="visible" viewport={viewport} className="relative rounded-[2rem] overflow-hidden bg-gradient-to-br from-blue-700 to-blue-900 text-center px-6 py-14 sm:py-20">
            <div className="absolute top-[-40%] left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-white/10 rounded-full blur-[100px] pointer-events-none" />
            <div className="relative z-10 max-w-2xl mx-auto space-y-6">
              <Globe2 size={36} className="text-white/90 mx-auto" />
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-black text-white tracking-tight">India paperwork, without the flight.</h2>
              <p className="text-base sm:text-lg text-blue-100">Draft a POA, execute a gift deed, manage Indian property — from anywhere in the world.</p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <Link href="/tools/power-of-attorney-generator" className="group bg-white text-blue-800 text-base font-bold py-3.5 px-8 rounded-2xl shadow-lg hover:shadow-xl transition-all inline-flex items-center gap-2">Generate a POA <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" /></Link>
                <Link href="/contact" className="text-white/90 hover:text-white font-semibold transition-colors inline-flex items-center gap-2">Talk to a lawyer <ArrowRight size={14} /></Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
