"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Users,
  Heart,
  Scale,
  ShieldCheck,
  AlertCircle,
  ScrollText,
  FileText,
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
    title: "Pre-nup agreements in uncertain legal territory",
    desc: "Indian courts have not fully recognised pre-nups, but documented intentions on separate property, gifts and businesses still carry evidentiary weight in matrimonial disputes.",
    icon: ScrollText,
  },
  {
    title: "Marriage not registered",
    desc: "Registration under the Hindu Marriage Act, 1955, the Special Marriage Act, 1954 or state registration rules makes spousal rights enforceable. Unregistered marriages complicate every downstream claim.",
    icon: FileText,
  },
  {
    title: "Mutual-consent divorce, done wrong",
    desc: "Section 13B of the Hindu Marriage Act requires a six-month cooling-off (now often waived in clear cases). A poorly drafted petition adds months and costs.",
    icon: Scale,
  },
  {
    title: "Maintenance and custody disputes",
    desc: "Maintenance under Section 125 CrPC / Section 24 HMA, custody under the Guardians and Wards Act, 1890 — which remedy, which forum, which timeline matters deeply.",
    icon: AlertCircle,
  },
];

const guides = [
  {
    title: "Pre-Nuptial Agreements in India: Current State of the Law",
    desc: "What Indian courts have accepted, what they’ve rejected, and how to draft so the document has maximum evidentiary value.",
    href: "/blog/prenup-india-legal-status",
    tag: "Pre-nup",
  },
  {
    title: "Marriage Registration: Hindu, Special and State Acts",
    desc: "Which law applies, documents required, timeline, and where to register — a comparison table.",
    href: "/blog/marriage-registration-india",
    tag: "Registration",
  },
  {
    title: "Mutual Consent Divorce: The Step-by-Step Guide",
    desc: "Section 13B, the two motions, cooling-off waivers, settlement agreements, and realistic timelines by family court.",
    href: "/blog/mutual-consent-divorce-india",
    tag: "Divorce",
  },
  {
    title: "Spousal Maintenance in India: Section 125 vs HMA vs DV Act",
    desc: "Which remedy is fastest, which has wider scope, and why you might file under more than one.",
    href: "/blog/spousal-maintenance-india-remedies",
    tag: "Maintenance",
  },
];

const faqs = [
  {
    question: "Are pre-nuptial agreements enforceable in India?",
    answer:
      "Not squarely. Indian courts have historically viewed pre-nups as contrary to public policy, but recent decisions have begun to consider them as evidence of intent, particularly on separate property, business interests and gifts. A well-drafted agreement still has meaningful evidentiary value, especially in mutual-consent matters.",
  },
  {
    question: "Is marriage registration mandatory in India?",
    answer:
      "The Supreme Court in Seema v. Ashwani Kumar (2006) directed compulsory registration across all faiths. Most states have notified rules. Non-registration does not invalidate a valid marriage, but it complicates proof, immigration, and spousal benefits.",
  },
  {
    question: "How long does a mutual-consent divorce take?",
    answer:
      "Statutorily, the two-motion process under Section 13B of the Hindu Marriage Act, 1955 is designed to run over six months, but the Supreme Court in Amardeep Singh v. Harveen Kaur (2017) clarified that the cooling-off period can be waived where parties have genuinely lived apart and reached a settlement. Contested divorces take 2–5 years.",
  },
  {
    question: "Can a live-in partner claim maintenance?",
    answer:
      "Yes, if the relationship qualifies as ‘in the nature of marriage’ under the Protection of Women from Domestic Violence Act, 2005. The Supreme Court in D. Velusamy v. D. Patchaiammal (2010) laid down criteria including duration, public holding out, cohabitation and shared household.",
  },
  {
    question: "Who gets custody of children after divorce?",
    answer:
      "The welfare of the child is paramount under Section 17 of the Guardians and Wards Act, 1890 and the Hindu Minority and Guardianship Act, 1956. Courts generally favour the mother for children under five, but the final decision depends on upbringing, financial capacity, education and the child’s wishes (if old enough).",
  },
];

export default function CouplesLandingPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: "https://lexireview.in" }, { "@type": "ListItem", position: 2, name: "For Citizens", item: "https://lexireview.in/citizens" }, { "@type": "ListItem", position: 3, name: "Couples", item: "https://lexireview.in/citizens/couples" }] }) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.question, acceptedAnswer: { "@type": "Answer", text: f.answer } })) }) }} />

      <section className="relative pt-32 pb-16 sm:pt-40 sm:pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 aurora-bg opacity-60" />
        <div className="absolute inset-0 grain" />
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 12, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.5 }} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue-200 bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider mb-6">
            <Users size={14} /> Couples
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }} className="text-4xl sm:text-5xl lg:text-6xl font-heading font-black tracking-[-0.03em] text-foreground mb-6">
            Marriage, registration,{" "}
            <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">and everything after</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }} className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Plain-English legal help for Indian couples — pre-nup intent documents, marriage registration under Hindu, Special or state Acts, mutual-consent divorce, maintenance and custody.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.5 }} className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
            <Link href="#guides" className="group bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold py-3.5 px-8 rounded-2xl shadow-lg hover:shadow-xl transition-all inline-flex items-center gap-2">
              Read the Guides <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/contact" className="text-foreground hover:text-blue-700 font-semibold transition-colors inline-flex items-center gap-2">Talk to a Family Lawyer <ArrowRight size={14} /></Link>
          </motion.div>
        </div>
      </section>

      <section className="py-20 sm:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={viewport} className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-heading font-black text-foreground tracking-tight mb-3">Four things couples in India deserve clarity on</h2>
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
            <h2 className="text-3xl sm:text-4xl font-heading font-black text-foreground tracking-tight mb-3">We’re building tools just for couples</h2>
            <p className="text-muted-foreground text-base leading-relaxed">
              A marriage registration generator, intent-documentation templates, and mutual-consent divorce petition drafter are in lawyer review. Subscribe to be notified the day they launch.
            </p>
          </motion.div>
        </div>
      </section>

      <section id="guides" className="py-20 sm:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={viewport} className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-heading font-black text-foreground tracking-tight mb-3">Guides every Indian couple should read</h2>
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
            <LeadForm source="ORGANIC_LANDING" icp="COUPLE" heading="Family-law updates in your inbox" subheading="Monthly briefing on marriage, divorce, maintenance, custody and new family-court orders — plain English, Indian law." ctaLabel="Subscribe free" successMessage="You’re subscribed. First edition this month." />
          </motion.div>
        </div>
      </section>

      <FAQSection items={faqs} subtitle="The questions couples bring us in quiet conversations." />

      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div variants={scaleReveal} initial="hidden" whileInView="visible" viewport={viewport} className="relative rounded-[2rem] overflow-hidden bg-gradient-to-br from-blue-700 to-blue-900 text-center px-6 py-14 sm:py-20">
            <div className="absolute top-[-40%] left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-white/10 rounded-full blur-[100px] pointer-events-none" />
            <div className="relative z-10 max-w-2xl mx-auto space-y-6">
              <Heart size={36} className="text-white/90 mx-auto" />
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-black text-white tracking-tight">Clarity, on the record.</h2>
              <p className="text-base sm:text-lg text-blue-100">Get matched with a family lawyer who handles your situation and state — usually within 24 hours.</p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <Link href="/contact" className="group bg-white text-blue-800 text-base font-bold py-3.5 px-8 rounded-2xl shadow-lg hover:shadow-xl transition-all inline-flex items-center gap-2">Talk to a Family Lawyer <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" /></Link>
                <Link href="#guides" className="text-white/90 hover:text-white font-semibold transition-colors inline-flex items-center gap-2">Read the guides <ArrowRight size={14} /></Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
