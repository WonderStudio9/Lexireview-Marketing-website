"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Building2,
  Calculator,
  FileSearch,
  ShieldCheck,
  AlertCircle,
  Clock,
  IndianRupee,
  FileWarning,
  HomeIcon,
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
    title: "140-page builder-buyer agreements you never read",
    desc: "Possession delays, force majeure, indexation, carpet vs super area — all buried deep. Most buyers sign without reading and lose leverage the day they pay.",
    icon: FileWarning,
  },
  {
    title: "Stamp duty shocks at registration",
    desc: "What the broker quoted and what the sub-registrar demands rarely match. Stamp duty + registration + GST on under-construction flats can exceed 12% of cost.",
    icon: IndianRupee,
  },
  {
    title: "RERA registration mismatches",
    desc: "Many projects quote a RERA number that does not match the tower, phase, or carpet area sold. By the time the buyer discovers it, the advance is already paid.",
    icon: AlertCircle,
  },
  {
    title: "Possession delays without penalty",
    desc: "Builders insert force majeure clauses that excuse every delay. Section 18 of the RERA Act entitles buyers to interest, but only if the agreement does not override it.",
    icon: Clock,
  },
];

const tools = [
  {
    title: "Real-Estate Stamp Duty Calculator",
    desc: "State-specific stamp duty, registration and cess on sale deeds, agreements to sell, gift deeds and partnership deeds. Covers all 28 states and UTs.",
    icon: Calculator,
    href: "/tools/real-estate-stamp-duty-calculator",
  },
  {
    title: "Builder-Buyer Agreement Analyzer",
    desc: "Upload your agreement. Get red flags on possession, force majeure, penalty, refund and indexation clauses — with what to negotiate before you sign.",
    icon: FileSearch,
    href: "/tools/builder-buyer-agreement-analyzer",
  },
];

const guides = [
  {
    title: "10 Red Flags in a Builder-Buyer Agreement",
    desc: "The clauses that favour the developer and how to push back, from force majeure definitions to delayed-possession formulas.",
    href: "/blog/builder-buyer-agreement-red-flags",
    tag: "Buyer due-diligence",
  },
  {
    title: "RERA Act Explained for First-Time Home Buyers",
    desc: "A plain-English walk-through of Sections 11, 13, 18 and 19 — what the builder owes you and how to claim it.",
    href: "/blog/rera-act-first-time-buyers-india",
    tag: "RERA",
  },
  {
    title: "Under-Construction vs Ready-to-Move: The Legal Trade-Offs",
    desc: "GST, stamp duty, possession risk and RERA coverage differ sharply. A decision framework with numbers.",
    href: "/blog/under-construction-vs-ready-to-move-india",
    tag: "Decision guide",
  },
  {
    title: "Home Loan vs Builder Agreement: Clauses That Must Match",
    desc: "If your tripartite agreement does not match the builder agreement, your disbursement can stall mid-construction.",
    href: "/blog/home-loan-builder-agreement-alignment",
    tag: "Financing",
  },
];

const faqs = [
  {
    question: "What does RERA registration actually guarantee?",
    answer:
      "A RERA-registered project means the builder has filed project plans, commitments and timelines with the state authority, is subject to escrow rules on 70% of buyer funds (Section 4(2)(l)(D)), and must compensate for delays under Section 18. It does not guarantee quality — that is still governed by the contract and consumer law.",
  },
  {
    question: "What stamp duty do I pay on an under-construction flat?",
    answer:
      "You pay stamp duty on the agreement for sale (typically 5–7% depending on state), then a nominal sum on the sale deed at registration. Several states also charge registration fees separately. Our calculator shows the exact breakdown for your state and slab.",
  },
  {
    question: "Can I back out of a home purchase if the builder delays possession?",
    answer:
      "Yes. Section 18 of RERA allows a buyer to withdraw and claim a full refund with interest if the builder fails to hand over possession by the agreed date. Alternatively, you can continue and claim interest for every month of delay at the prescribed rate (SBI MCLR + 2%).",
  },
  {
    question: "Should I get an agreement-to-sell registered or just stamped?",
    answer:
      "In states like Maharashtra and Karnataka, agreement-to-sell registration is mandatory under Section 17 of the Registration Act, 1908 for any immovable property transaction above ₹100. Unregistered agreements are inadmissible as evidence of title.",
  },
  {
    question: "Is GST payable on resale flats?",
    answer:
      "No. GST applies only to under-construction flats (currently 5% without ITC, 1% for affordable housing). Ready-to-move-in or resale flats are exempt from GST. You still pay stamp duty and registration regardless.",
  },
];

export default function HomeBuyersLandingPage() {
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
              { "@type": "ListItem", position: 3, name: "Home Buyers", item: "https://lexireview.in/citizens/home-buyers" },
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
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue-200 bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider mb-6"
          >
            <Building2 size={14} /> Home Buyers
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl sm:text-5xl lg:text-6xl font-heading font-black tracking-[-0.03em] text-foreground mb-6"
          >
            The home of your dreams,{" "}
            <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              on fair paper
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
          >
            Free AI review of your builder-buyer agreement and an instant, state-specific stamp
            duty calculator. Catch the clauses that cost lakhs — before you sign.
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
              Analyze My Agreement
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

      <section className="py-20 sm:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={viewport} className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-heading font-black text-foreground tracking-tight mb-3">
              What most buyers don’t see until after they sign
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              The biggest financial decision of your life deserves ten extra minutes of scrutiny.
            </p>
          </motion.div>
          <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={viewport} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {pains.map((p) => {
              const Icon = p.icon;
              return (
                <motion.div key={p.title} variants={itemFadeUp} className="flex gap-4 bg-card rounded-2xl border border-border p-6">
                  <div className="w-11 h-11 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0">
                    <Icon size={20} />
                  </div>
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
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-4">
              Tools for you
            </div>
            <h2 className="text-3xl sm:text-4xl font-heading font-black text-foreground tracking-tight mb-3">
              Two free tools for Indian home buyers
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">State-specific. RERA-aware. No signup.</p>
          </motion.div>
          <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={viewport} className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {tools.map((t) => {
              const Icon = t.icon;
              return (
                <motion.div key={t.title} variants={itemScale}>
                  <Link href={t.href} className="group block h-full bg-card rounded-2xl border border-border p-6 hover:border-blue-400 transition-colors">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 text-white flex items-center justify-center mb-4 shadow-sm">
                      <Icon size={20} />
                    </div>
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
            <h2 className="text-3xl sm:text-4xl font-heading font-black text-foreground tracking-tight mb-3">
              Guides every home buyer should read
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">Short, Indian-law-specific, written by real-estate lawyers.</p>
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
            <LeadForm
              source="ORGANIC_LANDING"
              icp="HOME_BUYER"
              heading="Home-buying updates in your inbox"
              subheading="Weekly briefings on RERA orders, stamp duty changes and builder-buyer caselaw. State-specific, no spam."
              ctaLabel="Subscribe free"
              successMessage="You’re subscribed. First edition lands this week."
            />
          </motion.div>
        </div>
      </section>

      <FAQSection items={faqs} subtitle="The questions home buyers ask before the cheque clears." />

      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div variants={scaleReveal} initial="hidden" whileInView="visible" viewport={viewport} className="relative rounded-[2rem] overflow-hidden bg-gradient-to-br from-blue-700 to-blue-900 text-center px-6 py-14 sm:py-20">
            <div className="absolute top-[-40%] left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-white/10 rounded-full blur-[100px] pointer-events-none" />
            <div className="relative z-10 max-w-2xl mx-auto space-y-6">
              <HomeIcon size={36} className="text-white/90 mx-auto" />
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-black text-white tracking-tight">A home, not a headache.</h2>
              <p className="text-base sm:text-lg text-blue-100">Analyze your agreement, compute stamp duty, and get matched with a property lawyer — all in one place.</p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <Link href="/tools/builder-buyer-agreement-analyzer" className="group bg-white text-blue-800 text-base font-bold py-3.5 px-8 rounded-2xl shadow-lg hover:shadow-xl transition-all inline-flex items-center gap-2">
                  Analyze My Agreement
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
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
