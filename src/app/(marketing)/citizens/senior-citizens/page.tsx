"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Heart,
  ScrollText,
  Gift,
  FileSignature,
  ShieldCheck,
  AlertCircle,
  HandHeart,
  Gavel,
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
    title: "Dying intestate: the default India gives you",
    desc: "Without a will, the Indian Succession Act, 1925 (or personal law) decides how your estate is distributed. Intended heirs are often excluded; genuine dependents left out.",
    icon: ScrollText,
  },
  {
    title: "Gift deeds that weren’t actually gifts",
    desc: "Transfers under coercion or without free consent can be set aside. The Senior Citizens Act, 2007 allows revocation of a transfer if the transferee fails to provide basic amenities.",
    icon: AlertCircle,
  },
  {
    title: "Power of Attorney misused",
    desc: "A broad general POA can authorise sale, mortgage and banking transactions. Without boundaries and revocation language, it becomes a blank cheque.",
    icon: FileSignature,
  },
  {
    title: "Maintenance not provided",
    desc: "Under the Maintenance and Welfare of Parents and Senior Citizens Act, 2007, parents have a statutory right to maintenance from children. Tribunals decide within 90 days. Few know this exists.",
    icon: HandHeart,
  },
];

const tools = [
  {
    title: "Will Drafter",
    desc: "Simple and privileged wills under the Indian Succession Act, 1925. Covers executor, bequests, residuary clause, minor guardianship and revocation. Two-witness ready.",
    icon: ScrollText,
    href: "/tools/will-drafter",
  },
  {
    title: "Gift Deed Generator",
    desc: "Gift deed under the Transfer of Property Act, 1882. Relative-exemption aware, state stamp duty computed, revocation-clause optional.",
    icon: Gift,
    href: "/tools/gift-deed-generator",
  },
  {
    title: "Power of Attorney Generator",
    desc: "Special POA for targeted tasks (banking, sale, litigation) or general POA with revocation safeguards. Stamped and executed correctly.",
    icon: FileSignature,
    href: "/tools/power-of-attorney-generator",
  },
];

const guides = [
  {
    title: "A Simple Will in India: Everything You Need",
    desc: "Executor, attesting witnesses, registration vs probate, mutation, and where to store the original — covered in 10 minutes.",
    href: "/blog/simple-will-india-guide",
    tag: "Wills",
  },
  {
    title: "Senior Citizens Act: Your Right to Maintenance",
    desc: "How the Maintenance Tribunal works, who can file, what orders look like, and timelines under the 2007 Act.",
    href: "/blog/senior-citizens-act-maintenance-india",
    tag: "Rights",
  },
  {
    title: "Gift vs Will: Which Protects You Better",
    desc: "Tax, control, reversibility, and the Senior Citizens Act revocation power — a decision framework.",
    href: "/blog/gift-vs-will-senior-citizens-india",
    tag: "Decision",
  },
  {
    title: "Revoking a Power of Attorney: The 4-Step Process",
    desc: "Written revocation, public notice, intimation to the agent, and registering the revocation where the original was registered.",
    href: "/blog/revoking-power-of-attorney-india",
    tag: "POA",
  },
];

const faqs = [
  {
    question: "Do I need to register my will?",
    answer:
      "Registration is optional under the Registration Act, 1908, but strongly recommended. A registered will is harder to challenge, and the sub-registrar keeps a certified copy. Even unregistered wills are valid if properly attested by two witnesses.",
  },
  {
    question: "Can I change my will later?",
    answer:
      "Yes. A will is a revocable document until the testator’s death. You can either execute a fresh will (which expressly revokes prior wills) or add a codicil. The last will in time, if valid, prevails.",
  },
  {
    question: "Can a gift deed be revoked?",
    answer:
      "A gift deed is generally irrevocable once accepted. Two exceptions: (1) the deed itself provides for revocation, or (2) the Senior Citizens Act, 2007 (Section 23) allows revocation if the transferee fails to provide basic amenities and the transfer was on the promise of such care.",
  },
  {
    question: "Who qualifies as a senior citizen under the 2007 Act?",
    answer:
      "Any Indian citizen aged 60 or above. ‘Parent’ under the Act includes biological, adoptive and step-parents, regardless of age. Children and, in some cases, relatives can be required to provide maintenance.",
  },
  {
    question: "How much maintenance can a senior citizen claim?",
    answer:
      "Under Section 9 of the Maintenance Act, tribunals can award up to ₹10,000 per month (this was the original cap; several states have notified higher state-specific amounts). Arrears from the date of application are also payable.",
  },
];

export default function SeniorCitizensLandingPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: "https://lexireview.in" }, { "@type": "ListItem", position: 2, name: "For Citizens", item: "https://lexireview.in/citizens" }, { "@type": "ListItem", position: 3, name: "Senior Citizens", item: "https://lexireview.in/citizens/senior-citizens" }] }) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.question, acceptedAnswer: { "@type": "Answer", text: f.answer } })) }) }} />

      <section className="relative pt-32 pb-16 sm:pt-40 sm:pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 aurora-bg opacity-60" />
        <div className="absolute inset-0 grain" />
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 12, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.5 }} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue-200 bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider mb-6">
            <Heart size={14} /> Senior Citizens
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }} className="text-4xl sm:text-5xl lg:text-6xl font-heading font-black tracking-[-0.03em] text-foreground mb-6">
            A life of care,{" "}
            <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">protected on paper</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }} className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Free will drafter, gift deed and Power of Attorney generators. Everything a senior citizen in India needs to protect a lifetime of work and secure the people who matter.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.5 }} className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
            <Link href="#tools" className="group bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold py-3.5 px-8 rounded-2xl shadow-lg hover:shadow-xl transition-all inline-flex items-center gap-2">
              Draft Your Will <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/contact" className="text-foreground hover:text-blue-700 font-semibold transition-colors inline-flex items-center gap-2">Talk to a Lawyer <ArrowRight size={14} /></Link>
          </motion.div>
        </div>
      </section>

      <section className="py-20 sm:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={viewport} className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-heading font-black text-foreground tracking-tight mb-3">Four problems every senior citizen deserves to solve</h2>
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
            <h2 className="text-3xl sm:text-4xl font-heading font-black text-foreground tracking-tight mb-3">Three free tools for senior citizens</h2>
          </motion.div>
          <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={viewport} className="grid grid-cols-1 md:grid-cols-3 gap-5">
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
            <h2 className="text-3xl sm:text-4xl font-heading font-black text-foreground tracking-tight mb-3">Guides for seniors and their families</h2>
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
            <LeadForm source="ORGANIC_LANDING" icp="SENIOR_CITIZEN" heading="Senior-citizen updates in your inbox" subheading="Monthly briefing on wills, succession, maintenance, property and rights — written for seniors in India." ctaLabel="Subscribe free" successMessage="You’re subscribed. First edition this month." />
          </motion.div>
        </div>
      </section>

      <FAQSection items={faqs} subtitle="The questions seniors and their children ask us." />

      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div variants={scaleReveal} initial="hidden" whileInView="visible" viewport={viewport} className="relative rounded-[2rem] overflow-hidden bg-gradient-to-br from-blue-700 to-blue-900 text-center px-6 py-14 sm:py-20">
            <div className="absolute top-[-40%] left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-white/10 rounded-full blur-[100px] pointer-events-none" />
            <div className="relative z-10 max-w-2xl mx-auto space-y-6">
              <ShieldCheck size={36} className="text-white/90 mx-auto" />
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-black text-white tracking-tight">Your lifetime, your terms.</h2>
              <p className="text-base sm:text-lg text-blue-100">Draft a will, execute a gift deed, or set up a careful Power of Attorney — free, lawyer-verified.</p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <Link href="/tools/will-drafter" className="group bg-white text-blue-800 text-base font-bold py-3.5 px-8 rounded-2xl shadow-lg hover:shadow-xl transition-all inline-flex items-center gap-2">Draft Your Will <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" /></Link>
                <Link href="/contact" className="text-white/90 hover:text-white font-semibold transition-colors inline-flex items-center gap-2">Talk to a lawyer <ArrowRight size={14} /></Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
