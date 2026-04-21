"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Briefcase,
  FileText,
  Clock,
  Calculator,
  Wallet,
  AlertCircle,
  Handshake,
  ShieldCheck,
  UserRoundCheck,
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
    title: "Offer letters you don’t fully understand",
    desc: "Non-compete, garden leave, clawback, retention bonus, variable pay fine print — all legal, all negotiable, most people sign blind.",
    icon: FileText,
  },
  {
    title: "Notice period surprises at exit",
    desc: "Your offer says 90 days. The sector average is 30. Your HR says you owe ‘buy-out’. Most of what they claim is not enforceable under Section 27 of the Indian Contract Act.",
    icon: Clock,
  },
  {
    title: "Opaque salary structures",
    desc: "CTC includes gratuity, notional PF, and ‘special allowance’ that never lands in your hand. The tax impact of structure choices differs by 8–15% in take-home.",
    icon: Wallet,
  },
  {
    title: "Gratuity and full-and-final disputes",
    desc: "Under the Payment of Gratuity Act, 1972, five years of continuous service earns gratuity within 30 days of exit. HR delays are common and actionable.",
    icon: AlertCircle,
  },
];

const tools = [
  {
    title: "Offer Letter Decoder",
    desc: "Upload your offer letter. Get red flags on non-compete, retention, notice, probation, and IP assignment — with what to negotiate before you sign.",
    icon: FileText,
    href: "/tools/offer-letter-decoder",
  },
  {
    title: "Notice Period Rules Checker",
    desc: "Check if the notice period in your contract is enforceable, typical for your sector and grade, and what buy-out rules apply in your state.",
    icon: Clock,
    href: "/tools/notice-period-rules-checker",
  },
  {
    title: "Gratuity Calculator",
    desc: "Compute gratuity under the Payment of Gratuity Act, 1972 — (15 × last drawn × years) ÷ 26. Cap applied, five-year minimum handled.",
    icon: Calculator,
    href: "/tools/gratuity-calculator",
  },
  {
    title: "Salary Structure Analyzer",
    desc: "Paste your salary structure. See tax optimisation, PF impact, gratuity accrual and take-home after each component.",
    icon: Wallet,
    href: "/tools/salary-structure-analyzer",
  },
];

const guides = [
  {
    title: "Non-Compete Clauses in Indian Employment: What Holds and What Doesn’t",
    desc: "Section 27 of the ICA makes post-termination restraints void, with limited exceptions. What employers try and what courts actually enforce.",
    href: "/blog/non-compete-india-employment",
    tag: "Contracts",
  },
  {
    title: "Notice Period Buy-Outs: Legal or a Bluff?",
    desc: "When an employer can recover notice period pay, when they can’t, and how to negotiate an early release without paying a paisa.",
    href: "/blog/notice-period-buyout-india",
    tag: "Exit",
  },
  {
    title: "New Wage Code 2026: What Changes in Your CTC",
    desc: "The Code on Wages, 2019 changes basic pay floor, PF calculation and gratuity math. What it means for your next offer.",
    href: "/blog/wage-code-india-ctc-impact",
    tag: "New law",
  },
  {
    title: "Full and Final Settlement: Your 30-Day Checklist",
    desc: "Gratuity, leave encashment, bonus, retention bonus recovery, tax certificate — what to demand and by when, under Indian law.",
    href: "/blog/full-final-settlement-india-checklist",
    tag: "Exit",
  },
];

const faqs = [
  {
    question: "Is a non-compete clause in my employment contract enforceable in India?",
    answer:
      "Post-termination non-compete clauses are generally void under Section 27 of the Indian Contract Act, 1872. Restraints during employment (including confidentiality and non-solicit of clients/employees) are usually enforceable. Indian courts rarely grant injunctions against an employee’s right to earn a livelihood elsewhere.",
  },
  {
    question: "Can my employer refuse to accept my resignation?",
    answer:
      "No. Resignation is a unilateral right. An employer cannot force continued service, and any ‘bond’ beyond training-cost recovery is unenforceable. The employer can, however, claim damages for breach of genuine notice obligations if the contract is valid.",
  },
  {
    question: "How is gratuity calculated?",
    answer:
      "Under Section 4 of the Payment of Gratuity Act, 1972, gratuity = (15 × last drawn monthly salary × years of continuous service) ÷ 26. You qualify after five years of continuous service (four years 240 days in some cases). The statutory cap is currently ₹20 lakh. Must be paid within 30 days of exit.",
  },
  {
    question: "What is a ‘joining bonus clawback’ and is it legal?",
    answer:
      "A clawback typically requires you to refund a signing bonus if you leave within 12–24 months. It is enforceable only if the amount is documented, not disproportionate, and the clause is clear. Courts have generally upheld pro-rated clawbacks and struck down punitive ones.",
  },
  {
    question: "Can my employer backdate my offer letter to change my notice period?",
    answer:
      "No. An offer letter is a contract. Any material change (including notice period) requires fresh consent and consideration. Unilateral changes communicated via email or revised letters without your signature are not binding.",
  },
];

export default function EmployeesLandingPage() {
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
              { "@type": "ListItem", position: 3, name: "Employees", item: "https://lexireview.in/citizens/employees" },
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

      <section className="relative pt-32 pb-16 sm:pt-40 sm:pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 aurora-bg opacity-60" />
        <div className="absolute inset-0 grain" />
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 12, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.5 }} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue-200 bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider mb-6">
            <Briefcase size={14} /> Employees & Job Seekers
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }} className="text-4xl sm:text-5xl lg:text-6xl font-heading font-black tracking-[-0.03em] text-foreground mb-6">
            Don’t sign your offer letter{" "}
            <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">blind</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }} className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Decode offer letters, check notice period rules, compute gratuity, and analyse salary
            structures — free, in plain English, built for Indian employment law.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.5 }} className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
            <Link href="#tools" className="group bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold py-3.5 px-8 rounded-2xl shadow-lg hover:shadow-xl transition-all inline-flex items-center gap-2">
              Decode My Offer
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/contact" className="text-foreground hover:text-blue-700 font-semibold transition-colors inline-flex items-center gap-2">Talk to an Employment Lawyer <ArrowRight size={14} /></Link>
          </motion.div>
        </div>
      </section>

      <section className="py-20 sm:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={viewport} className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-heading font-black text-foreground tracking-tight mb-3">Four traps inside every Indian offer letter</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">Most employees sign in 24 hours and spend years untangling what they agreed to.</p>
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
            <h2 className="text-3xl sm:text-4xl font-heading font-black text-foreground tracking-tight mb-3">Four free tools for Indian employees</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">From offer letter to exit — covered.</p>
          </motion.div>
          <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={viewport} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
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
            <h2 className="text-3xl sm:text-4xl font-heading font-black text-foreground tracking-tight mb-3">Guides every Indian employee should read</h2>
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
            <LeadForm source="ORGANIC_LANDING" icp="EMPLOYEE" heading="Career & employment-law updates" subheading="Weekly brief on wage codes, notice-period caselaw, PF/gratuity updates and offer-letter tactics. Written for Indian professionals." ctaLabel="Subscribe free" successMessage="You’re subscribed. First edition drops this week." />
          </motion.div>
        </div>
      </section>

      <FAQSection items={faqs} subtitle="The questions employees ask us every hiring cycle." />

      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div variants={scaleReveal} initial="hidden" whileInView="visible" viewport={viewport} className="relative rounded-[2rem] overflow-hidden bg-gradient-to-br from-blue-700 to-blue-900 text-center px-6 py-14 sm:py-20">
            <div className="absolute top-[-40%] left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-white/10 rounded-full blur-[100px] pointer-events-none" />
            <div className="relative z-10 max-w-2xl mx-auto space-y-6">
              <UserRoundCheck size={36} className="text-white/90 mx-auto" />
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-black text-white tracking-tight">Your career. Your leverage.</h2>
              <p className="text-base sm:text-lg text-blue-100">Know what your offer really says. Know what notice period you actually owe. Know what gratuity you’re owed on exit.</p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <Link href="/tools/offer-letter-decoder" className="group bg-white text-blue-800 text-base font-bold py-3.5 px-8 rounded-2xl shadow-lg hover:shadow-xl transition-all inline-flex items-center gap-2">
                  Decode My Offer <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link href="/contact" className="text-white/90 hover:text-white font-semibold transition-colors inline-flex items-center gap-2">Talk to a lawyer <ArrowRight size={14} /></Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
