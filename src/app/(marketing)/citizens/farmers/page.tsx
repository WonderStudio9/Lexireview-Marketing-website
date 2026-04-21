"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Sprout,
  AlertCircle,
  Scale,
  Users,
  ScrollText,
  Leaf,
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
    title: "Verbal crop-lease arrangements that fall apart",
    desc: "Sharecropping and seasonal leases are common but rarely documented. When yields fail, inputs dispute or ownership is contested, there’s no paper trail.",
    icon: ScrollText,
  },
  {
    title: "APMC and private-trade contract confusion",
    desc: "The national farm laws were repealed in 2021, leaving a patchwork of state APMC Acts, mandi fees and private-trade rules. Farmers signing with traders often don’t know which law governs.",
    icon: Scale,
  },
  {
    title: "Land record and mutation disputes",
    desc: "Khatauni, Record of Rights, mutation — the documents that define ownership. Errors from decades ago still trigger litigation today. Correcting them requires patience and the right petition.",
    icon: AlertCircle,
  },
  {
    title: "FPO formation without the right structure",
    desc: "Farmer Producer Organisations under Section 581B of the Companies Act, 2013 unlock credit, tenders and policy benefits — but only if formation, bylaws and share classes are right from day one.",
    icon: Users,
  },
];

const guides = [
  {
    title: "Crop Lease Agreements: What a Written Contract Should Cover",
    desc: "Duration, share, input responsibility, yield-failure clauses, termination and dispute resolution — written for Indian agricultural practice.",
    href: "/blog/crop-lease-agreement-india",
    tag: "Contracts",
  },
  {
    title: "FPO Formation under Part IXA of the Companies Act",
    desc: "Producer company vs cooperative, minimum members, share structure, governance and the funding schemes FPOs unlock.",
    href: "/blog/fpo-formation-india",
    tag: "FPOs",
  },
  {
    title: "Land Records Correction: Mutation, Partition and Succession",
    desc: "How to correct Khatauni entries, record mutations after inheritance and trigger partition — by state, with templates.",
    href: "/blog/land-records-correction-india",
    tag: "Land records",
  },
  {
    title: "MSP, Mandis and Private Trade: Your Legal Options in 2026",
    desc: "What state APMC Acts require, how private trading works, and how to document sales outside the mandi.",
    href: "/blog/msp-mandi-private-trade-india",
    tag: "Markets",
  },
];

const faqs = [
  {
    question: "Do I need a written crop lease?",
    answer:
      "Strongly yes. While verbal leases are recognised in practice, they’re notoriously hard to prove in disputes over yield share, input cost, duration or termination. A written lease also helps the lessee claim crop loans and crop insurance in their own name.",
  },
  {
    question: "Can agricultural land be sold to non-agriculturists?",
    answer:
      "Rules vary sharply by state. Many states (for example Karnataka, Gujarat) have traditionally restricted agricultural land purchases to those with agricultural background, though several have liberalised these rules in recent years. Check the state Land Revenue Code and any recent amendments before any sale.",
  },
  {
    question: "What is a Farmer Producer Organisation (FPO) and how do I form one?",
    answer:
      "An FPO can be a producer company under Part IXA of the Companies Act, 2013 (which grew from Section 581A–581ZL of the 1956 Act preserved by Section 465(1) of the 2013 Act), a cooperative society, or a Section 8 company. Producer companies need at least 10 primary producers as members and elect a Board under the producer-company rules.",
  },
  {
    question: "What is the legal status of MSP procurement?",
    answer:
      "Minimum Support Price is set by the central government through the Commission for Agricultural Costs and Prices (CACP) and notified before each season. Procurement is effected through FCI and state agencies. MSP is not a statutory guarantee for all produce — it operates through procurement programmes, and not all crops in all states are covered.",
  },
  {
    question: "How is a land mutation recorded after succession?",
    answer:
      "An application is filed before the Tahsildar/Sub-Divisional Magistrate with the succession certificate, death certificate and consent of co-heirs. The Revenue Officer issues a notice, verifies and records mutation in the Khatauni. Timeframes range from 30–90 days depending on the state.",
  },
];

export default function FarmersLandingPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: "https://lexireview.in" }, { "@type": "ListItem", position: 2, name: "For Citizens", item: "https://lexireview.in/citizens" }, { "@type": "ListItem", position: 3, name: "Farmers", item: "https://lexireview.in/citizens/farmers" }] }) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.question, acceptedAnswer: { "@type": "Answer", text: f.answer } })) }) }} />

      <section className="relative pt-32 pb-16 sm:pt-40 sm:pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 aurora-bg opacity-60" />
        <div className="absolute inset-0 grain" />
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 12, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.5 }} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue-200 bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider mb-6">
            <Sprout size={14} /> Farmers & Agricultural Contracts
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }} className="text-4xl sm:text-5xl lg:text-6xl font-heading font-black tracking-[-0.03em] text-foreground mb-6">
            Paper for{" "}
            <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">the land</span>{" "}
            that feeds us
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }} className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Plain-English legal help for Indian farmers: crop leases, APMC and private-trade contracts, FPO formation, land records, and the disputes that need patient paperwork.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.5 }} className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
            <Link href="#guides" className="group bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold py-3.5 px-8 rounded-2xl shadow-lg hover:shadow-xl transition-all inline-flex items-center gap-2">
              Read the Guides <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/contact" className="text-foreground hover:text-blue-700 font-semibold transition-colors inline-flex items-center gap-2">Talk to a Lawyer <ArrowRight size={14} /></Link>
          </motion.div>
        </div>
      </section>

      <section className="py-20 sm:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={viewport} className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-heading font-black text-foreground tracking-tight mb-3">Four problems every Indian farmer hits eventually</h2>
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

      <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={viewport}>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wider mb-4">Tools coming soon</div>
            <h2 className="text-3xl sm:text-4xl font-heading font-black text-foreground tracking-tight mb-3">Farmer-specific tools in review</h2>
            <p className="text-muted-foreground text-base leading-relaxed">
              A crop-lease generator, FPO incorporation checklist, and land-mutation petition drafter are being built with agri-lawyers in Punjab, Maharashtra and Andhra. Subscribe below to be notified the day they launch.
            </p>
          </motion.div>
        </div>
      </section>

      <section id="guides" className="py-20 sm:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={viewport} className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-heading font-black text-foreground tracking-tight mb-3">Guides every Indian farmer should read</h2>
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
            <LeadForm source="ORGANIC_LANDING" icp="FARMER" heading="Agri-law updates in your inbox" subheading="Monthly briefing on APMC changes, MSP notifications, FPO schemes and land-record caselaw — plain English, state by state." ctaLabel="Subscribe free" successMessage="You’re subscribed. First edition ships this month." />
          </motion.div>
        </div>
      </section>

      <FAQSection items={faqs} subtitle="The questions farmers ask before a season begins." />

      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div variants={scaleReveal} initial="hidden" whileInView="visible" viewport={viewport} className="relative rounded-[2rem] overflow-hidden bg-gradient-to-br from-blue-700 to-blue-900 text-center px-6 py-14 sm:py-20">
            <div className="absolute top-[-40%] left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-white/10 rounded-full blur-[100px] pointer-events-none" />
            <div className="relative z-10 max-w-2xl mx-auto space-y-6">
              <Leaf size={36} className="text-white/90 mx-auto" />
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-black text-white tracking-tight">Work the land. Own the paper.</h2>
              <p className="text-base sm:text-lg text-blue-100">Get matched with an agricultural-law lawyer who knows your state, crop and market.</p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <Link href="/contact" className="group bg-white text-blue-800 text-base font-bold py-3.5 px-8 rounded-2xl shadow-lg hover:shadow-xl transition-all inline-flex items-center gap-2">Talk to a Lawyer <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" /></Link>
                <Link href="#guides" className="text-white/90 hover:text-white font-semibold transition-colors inline-flex items-center gap-2">Read the guides <ArrowRight size={14} /></Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
