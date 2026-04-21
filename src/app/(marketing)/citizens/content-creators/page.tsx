"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Video,
  FilePlus,
  AlertCircle,
  ShieldCheck,
  Copyright,
  Layers,
  Megaphone,
  Sparkles,
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
    title: "Brand deals with silent exclusivity",
    desc: "A single sponsored reel often bars creators from competitor categories for 6–12 months. Most contracts make this invisible, tucked inside ‘category exclusivity’.",
    icon: Layers,
  },
  {
    title: "IP assignments that take your content",
    desc: "Default brand contracts often grab perpetual, worldwide IP on content you created. Without a carve-out, you cannot repost your own work on your own feed.",
    icon: Copyright,
  },
  {
    title: "ASCI disclosure and liability traps",
    desc: "Under the ASCI Influencer Guidelines and CCPA, undisclosed partnerships can trigger penalties on creators. Some contracts shift this entirely to you.",
    icon: AlertCircle,
  },
  {
    title: "NDAs signed before the pitch",
    desc: "Brands push one-way NDAs that bind you while giving them no reciprocal protection. Framework leaks, rate transparency, portfolio reuse — all quietly restricted.",
    icon: ShieldCheck,
  },
];

const tools = [
  {
    title: "NDA Generator",
    desc: "Mutual or one-way NDA for creator pitches, brand briefs and agency conversations. Lawyer-verified, aligned to Section 10 of the ICA.",
    icon: FilePlus,
    href: "/tools/nda-generator",
  },
];

const guides = [
  {
    title: "ASCI Guidelines for Influencers: What Changed in 2026",
    desc: "Mandatory #ad disclosures, platform-specific rules, and what the CCPA can penalise creators for.",
    href: "/blog/asci-influencer-guidelines-india",
    tag: "Disclosure",
  },
  {
    title: "Brand Deal Contract Red Flags for Indian Creators",
    desc: "Exclusivity, moral rights, indemnity, kill fees and term — the eight clauses worth negotiating hard.",
    href: "/blog/brand-deal-red-flags-creators-india",
    tag: "Contracts",
  },
  {
    title: "Copyright vs Moral Rights: Why You Can’t Fully Transfer",
    desc: "Sections 57 and 19 of the Copyright Act, 1957 give creators moral rights that survive assignment. What brands can and cannot take.",
    href: "/blog/copyright-moral-rights-creators-india",
    tag: "IP",
  },
  {
    title: "GST for Creators: Threshold, Invoicing, Cross-Border",
    desc: "When ₹20 lakh / ₹10 lakh thresholds apply, when exports qualify as zero-rated, and how to invoice foreign brands.",
    href: "/blog/gst-creators-india",
    tag: "Tax",
  },
];

const faqs = [
  {
    question: "Do I own the content I post on social platforms?",
    answer:
      "You own the underlying copyright. Most platforms (Instagram, YouTube, X) take a broad non-exclusive licence to host, display and distribute. This does not transfer ownership. You can still commercialise and republish.",
  },
  {
    question: "Are ASCI guidelines legally binding on creators?",
    answer:
      "ASCI is a self-regulatory body, but its guidelines are recognised by the CCPA and MIB. Non-compliance (for example, missing #ad disclosures) can trigger CCPA action against both the brand and the creator, with penalties under the Consumer Protection Act, 2019.",
  },
  {
    question: "How long can a brand enforce ‘category exclusivity’?",
    answer:
      "Reasonable and time-limited exclusivity (30–180 days) is typically enforceable. Unlimited or disproportionately long exclusivity may be struck down as restraint of trade. Always specify the exact category, channels and duration.",
  },
  {
    question: "Do I need to register as a business to take brand deals?",
    answer:
      "No, not initially. You can invoice as a sole proprietor under your PAN. GST registration is required once you cross the ₹20 lakh threshold (₹10 lakh in special category states) or supply to buyers in other states for certain services.",
  },
  {
    question: "What should my kill-fee clause look like?",
    answer:
      "A kill fee is a fee payable if the brand terminates or shelves content after you’ve produced it. 50% on scripting/shoot completion, 100% if the final deliverable is approved but not published, is the common Indian creator-economy standard.",
  },
];

export default function ContentCreatorsLandingPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: "https://lexireview.in" }, { "@type": "ListItem", position: 2, name: "For Citizens", item: "https://lexireview.in/citizens" }, { "@type": "ListItem", position: 3, name: "Content Creators", item: "https://lexireview.in/citizens/content-creators" }] }) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.question, acceptedAnswer: { "@type": "Answer", text: f.answer } })) }) }} />

      <section className="relative pt-32 pb-16 sm:pt-40 sm:pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 aurora-bg opacity-60" />
        <div className="absolute inset-0 grain" />
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 12, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.5 }} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue-200 bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider mb-6">
            <Video size={14} /> Content Creators & Influencers
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }} className="text-4xl sm:text-5xl lg:text-6xl font-heading font-black tracking-[-0.03em] text-foreground mb-6">
            Your audience is yours.{" "}
            <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">Keep it that way.</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }} className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Free NDA generator and brand-deal playbooks for Indian creators and influencers. ASCI-aligned, IP-friendly, negotiation-ready.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.5 }} className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
            <Link href="#tools" className="group bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold py-3.5 px-8 rounded-2xl shadow-lg hover:shadow-xl transition-all inline-flex items-center gap-2">
              Generate an NDA <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/contact" className="text-foreground hover:text-blue-700 font-semibold transition-colors inline-flex items-center gap-2">Talk to a Lawyer <ArrowRight size={14} /></Link>
          </motion.div>
        </div>
      </section>

      <section className="py-20 sm:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={viewport} className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-heading font-black text-foreground tracking-tight mb-3">Four traps in every brand deal contract</h2>
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
            <h2 className="text-3xl sm:text-4xl font-heading font-black text-foreground tracking-tight mb-3">Free tools for Indian creators</h2>
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
            <h2 className="text-3xl sm:text-4xl font-heading font-black text-foreground tracking-tight mb-3">Guides every Indian creator should read</h2>
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
            <LeadForm source="ORGANIC_LANDING" icp="CONTENT_CREATOR" heading="Creator-law updates in your inbox" subheading="Weekly briefing on ASCI, brand-deal caselaw, IP, GST and platform policy — for Indian creators." ctaLabel="Subscribe free" successMessage="You’re subscribed. First edition drops this week." />
          </motion.div>
        </div>
      </section>

      <FAQSection items={faqs} subtitle="The questions creators bring us before every sponsored post." />

      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div variants={scaleReveal} initial="hidden" whileInView="visible" viewport={viewport} className="relative rounded-[2rem] overflow-hidden bg-gradient-to-br from-blue-700 to-blue-900 text-center px-6 py-14 sm:py-20">
            <div className="absolute top-[-40%] left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-white/10 rounded-full blur-[100px] pointer-events-none" />
            <div className="relative z-10 max-w-2xl mx-auto space-y-6">
              <Megaphone size={36} className="text-white/90 mx-auto" />
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-black text-white tracking-tight">Your voice, your terms.</h2>
              <p className="text-base sm:text-lg text-blue-100">Generate an NDA, review a brand contract, and keep more of your IP — free, always.</p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <Link href="/tools/nda-generator" className="group bg-white text-blue-800 text-base font-bold py-3.5 px-8 rounded-2xl shadow-lg hover:shadow-xl transition-all inline-flex items-center gap-2">Generate an NDA <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" /></Link>
                <Link href="/contact" className="text-white/90 hover:text-white font-semibold transition-colors inline-flex items-center gap-2">Talk to a lawyer <ArrowRight size={14} /></Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
