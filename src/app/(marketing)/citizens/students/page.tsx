"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  GraduationCap,
  FileText,
  AlertCircle,
  Briefcase,
  BookOpen,
  ShieldCheck,
  Sparkles,
  ScrollText,
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
    title: "Your first offer letter is a contract",
    desc: "Most freshers sign without reading. The terms you accept — bond, non-compete, IP, notice — follow you through every future job. Five minutes of scrutiny saves five years of regret.",
    icon: FileText,
  },
  {
    title: "‘Bond’ clauses you don’t have to fear",
    desc: "Employment bonds are enforceable only to the extent of genuine training cost. Post-termination non-competes are void under Section 27 of the Indian Contract Act, 1872.",
    icon: AlertCircle,
  },
  {
    title: "Internship contracts with no protection",
    desc: "Unpaid or underpaid internships are common, but you still have rights — IP assignment only to the extent agreed, no exploitation beyond the defined scope.",
    icon: BookOpen,
  },
  {
    title: "Salary structure math that freshers never learn",
    desc: "CTC vs in-hand, PF deductions, gratuity accrual, probation pay cuts. Understanding these makes the difference between a ‘good offer’ and a good life.",
    icon: Briefcase,
  },
];

const tools = [
  {
    title: "Offer Letter Decoder",
    desc: "Upload your offer letter. Get a plain-English breakdown of bond, probation, notice, non-compete, IP and retention — with what to ask HR before you sign.",
    icon: FileText,
    href: "/tools/offer-letter-decoder",
  },
];

const guides = [
  {
    title: "Your First Offer Letter: The 10-Minute Checklist",
    desc: "The 14 clauses every Indian fresher must understand before signing — with sample counter-questions.",
    href: "/blog/first-offer-letter-checklist-india",
    tag: "Fresher 101",
  },
  {
    title: "Service Bonds in India: What’s Enforceable and What Isn’t",
    desc: "Genuine training costs are recoverable. Penalty-style bonds generally aren’t. A plain-English breakdown with sample language.",
    href: "/blog/service-bond-india-enforceable",
    tag: "Bonds",
  },
  {
    title: "Internship Agreements: Your Rights as an Indian Intern",
    desc: "Stipend, scope, IP, duration, conversion to PPO, and what to refuse.",
    href: "/blog/internship-agreement-india-rights",
    tag: "Internships",
  },
  {
    title: "CTC vs In-Hand: The Fresher’s Salary Structure Guide",
    desc: "Decode basic, HRA, special allowance, PF, gratuity, and bonuses. A worked example with numbers.",
    href: "/blog/ctc-vs-inhand-fresher-india",
    tag: "Money",
  },
];

const faqs = [
  {
    question: "Can my first employer enforce a 2-year bond?",
    answer:
      "Only to the extent of actual and demonstrable training cost. Courts have struck down bonds where the ‘penalty’ is punitive rather than compensatory. Read the bond clause carefully — most are negotiable, and in practice many are not enforced in court.",
  },
  {
    question: "Should I negotiate my first offer?",
    answer:
      "Yes, within reason. Freshers often over-accept because they’re afraid the offer will be withdrawn. In fact, recruiters expect some questions. The highest-leverage asks are joining date, reporting structure, work location, and bond conditions.",
  },
  {
    question: "What does ‘PPO’ mean on an internship?",
    answer:
      "Pre-Placement Offer — a full-time offer given at the end of a successful internship. A PPO is a fresh contract, distinct from the internship, and its terms (package, notice, bond) are fully negotiable.",
  },
  {
    question: "Is my stipend taxable?",
    answer:
      "Stipends are generally exempt if the amount is a scholarship to meet the cost of education (Section 10(16) of the Income Tax Act, 1961). A stipend paid as compensation for work (i.e., an internship paycheck) is taxable, though it’s typically below the basic exemption limit.",
  },
  {
    question: "Can I refuse to sign an offer letter after accepting verbally?",
    answer:
      "Verbal acceptance does not create a binding employment contract until the offer is signed and you join. You can withdraw anytime before that. After joining, standard notice period applies. Notify the employer in writing to stay professional.",
  },
];

export default function StudentsLandingPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: "https://lexireview.in" }, { "@type": "ListItem", position: 2, name: "For Citizens", item: "https://lexireview.in/citizens" }, { "@type": "ListItem", position: 3, name: "Students", item: "https://lexireview.in/citizens/students" }] }) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.question, acceptedAnswer: { "@type": "Answer", text: f.answer } })) }) }} />

      <section className="relative pt-32 pb-16 sm:pt-40 sm:pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 aurora-bg opacity-60" />
        <div className="absolute inset-0 grain" />
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 12, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.5 }} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue-200 bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider mb-6">
            <GraduationCap size={14} /> Students & First-Time Employees
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }} className="text-4xl sm:text-5xl lg:text-6xl font-heading font-black tracking-[-0.03em] text-foreground mb-6">
            Your first offer letter,{" "}
            <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">decoded</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }} className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Free tools and plain-English guides for Indian students, freshers and first-time employees. Bond, non-compete, IP, notice — explained before you sign.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.5 }} className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
            <Link href="#tools" className="group bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold py-3.5 px-8 rounded-2xl shadow-lg hover:shadow-xl transition-all inline-flex items-center gap-2">
              Decode My Offer <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/contact" className="text-foreground hover:text-blue-700 font-semibold transition-colors inline-flex items-center gap-2">Talk to a Lawyer <ArrowRight size={14} /></Link>
          </motion.div>
        </div>
      </section>

      <section className="py-20 sm:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={viewport} className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-heading font-black text-foreground tracking-tight mb-3">Four mistakes freshers make in their first job</h2>
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
        <div className="max-w-3xl mx-auto">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={viewport} className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-4">Tools for you</div>
            <h2 className="text-3xl sm:text-4xl font-heading font-black text-foreground tracking-tight mb-3">The one tool every fresher needs</h2>
          </motion.div>
          <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={viewport} className="grid grid-cols-1 gap-5">
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
            <h2 className="text-3xl sm:text-4xl font-heading font-black text-foreground tracking-tight mb-3">Guides every fresher should read</h2>
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
            <LeadForm source="ORGANIC_LANDING" icp="STUDENT" heading="Fresher & student updates in your inbox" subheading="Weekly briefing on offers, internships, campus law, bonds and career-day legal tactics." ctaLabel="Subscribe free" successMessage="You’re subscribed. First edition this week." />
          </motion.div>
        </div>
      </section>

      <FAQSection items={faqs} subtitle="The questions freshers ask before their first signature." />

      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div variants={scaleReveal} initial="hidden" whileInView="visible" viewport={viewport} className="relative rounded-[2rem] overflow-hidden bg-gradient-to-br from-blue-700 to-blue-900 text-center px-6 py-14 sm:py-20">
            <div className="absolute top-[-40%] left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-white/10 rounded-full blur-[100px] pointer-events-none" />
            <div className="relative z-10 max-w-2xl mx-auto space-y-6">
              <Sparkles size={36} className="text-white/90 mx-auto" />
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-black text-white tracking-tight">Start strong. Stay informed.</h2>
              <p className="text-base sm:text-lg text-blue-100">Your first offer, decoded in minutes. Free, always.</p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <Link href="/tools/offer-letter-decoder" className="group bg-white text-blue-800 text-base font-bold py-3.5 px-8 rounded-2xl shadow-lg hover:shadow-xl transition-all inline-flex items-center gap-2">Decode My Offer <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" /></Link>
                <Link href="/contact" className="text-white/90 hover:text-white font-semibold transition-colors inline-flex items-center gap-2">Talk to a lawyer <ArrowRight size={14} /></Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
