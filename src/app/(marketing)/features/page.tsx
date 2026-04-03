"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ShieldAlert,
  FileWarning,
  Scale,
  MessageSquare,
  Zap,
  Layers,
  Award,
  GanttChart,
  ArrowRight,
  Brain,
  BookOpen,
  FileCheck,
  Bell,
  Workflow,
  Search,
  Lock,
  BarChart3,
  Stamp,
  Users,
  CheckCircle2,
} from "lucide-react";
import {
  fadeUp,
  stagger,
  itemFadeUp,
  itemScale,
  scaleReveal,
  viewport,
} from "@/lib/motion";

const coreFeatures = [
  {
    title: "6 Parallel AI Engines",
    desc: "Risk Assessment, Legal Citations, Template Comparison, Recommendations, Executive Overview, and Custom Analysis — all running simultaneously on every contract.",
    icon: ShieldAlert,
    accent: "from-red-500 to-orange-500",
  },
  {
    title: "Missing Clause Detection",
    desc: "AI flags clauses that should exist but don't — termination, data protection, force majeure, dispute resolution. The most eye-opening feature for prospects.",
    icon: FileWarning,
    accent: "from-amber-500 to-yellow-500",
  },
  {
    title: "Indian Law Compliance",
    desc: "Automated checks against ICA, Stamp Acts (28 states), SEBI, RBI, DPDP Act, and RERA. LexiBrain monitors eGazette and government sources 24/7 to keep rules current.",
    icon: Scale,
    accent: "from-gold-500 to-gold-600",
  },
  {
    title: "LexiCoPilot AI Chat",
    desc: "Ask anything about your contract — 'What's the penalty clause?' — and get instant, cited answers with page references. RAG-powered with vector embeddings.",
    icon: MessageSquare,
    accent: "from-navy-500 to-navy-700",
  },
  {
    title: "Quick Triage",
    desc: "Instant go/no-go in under 2 seconds. Deterministic pattern-matching — zero AI credits consumed. Perfect for high-volume contract screening.",
    icon: Zap,
    accent: "from-emerald-500 to-teal-500",
  },
  {
    title: "Contract Generation Wizard",
    desc: "6-step AI-powered flow: select type, choose template, enter parties, interactive AI Q&A chat, preview, and generate. Create professional contracts in minutes.",
    icon: Layers,
    accent: "from-gold-500 to-gold-700",
  },
  {
    title: "Batch Processing",
    desc: "Bulk upload and process 100+ contracts overnight. Aggregated risk scores, common issue identification, and batch export with summary statistics.",
    icon: GanttChart,
    accent: "from-indigo-500 to-purple-500",
  },
  {
    title: "Compliance Certificates",
    desc: "One-click audit-ready PDF certificates in Standard, Detailed, or Regulatory formats. Includes certificate audit trail and human co-signature workflow.",
    icon: Award,
    accent: "from-emerald-500 to-green-600",
  },
];

const additionalFeatures = [
  { icon: Brain, title: "LexiBrain Intelligence", desc: "Autonomous 4-stage AI pipeline monitoring eGazette, MeitY, and state departments for regulatory changes" },
  { icon: Search, title: "Precedent Search", desc: "Search Indian case law across Supreme Court, High Courts, NCLAT, NCDRC, RERA Tribunals, and DRT" },
  { icon: BookOpen, title: "Custom Playbooks", desc: "Build review playbooks per client, practice area, or industry with custom rules and severity settings" },
  { icon: FileCheck, title: "Template Deviation", desc: "Compare contracts against standard templates to identify every deviation, addition, and omission" },
  { icon: Bell, title: "Regulatory Alerts", desc: "Live feed of RBI, SEBI, MCA, RERA notifications with impact levels and auto-matching to your contracts" },
  { icon: Workflow, title: "e-Signing & Vault", desc: "End-to-end e-signature workflow with blockchain-style hash verification and searchable contract vault" },
  { icon: Lock, title: "Chain-Hashed Audit Trail", desc: "SHA-256 checksums with blockchain-style hash chaining — tamper-proof records for CAG audits" },
  { icon: Stamp, title: "Stamp Duty Calculator", desc: "Automated computation across all 28 Indian states with e-stamping guidance and adequacy checking" },
  { icon: BarChart3, title: "Vendor Risk Management", desc: "Track vendor risk profiles with aggregated scores, trend indicators, and side-by-side comparisons" },
  { icon: Users, title: "White-Label Branding", desc: "Custom logo, brand colors, domain, email branding, and report headers for enterprise reselling" },
];

export default function FeaturesPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://lexireview.in" },
          { "@type": "ListItem", position: 2, name: "Features", item: "https://lexireview.in/features" },
        ]
      }) }} />
      {/* Hero */}
      <section className="relative pt-32 pb-16 sm:pt-40 sm:pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 aurora-bg opacity-60" />
        <div className="absolute inset-0 grain" />
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-gold-200 bg-gold-50/80 text-gold-700 text-xs font-bold uppercase tracking-wider mb-6"
          >
            <GanttChart size={14} className="text-gold-500" /> Platform Capabilities
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl sm:text-5xl lg:text-6xl font-heading font-black tracking-[-0.03em] text-foreground mb-6"
          >
            Everything you need.{" "}
            <span className="text-gradient-navy">Nothing you don&apos;t.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
          >
            From 45-second triage to deep AI analysis, contract generation to e-signing, vaulting to compliance monitoring — the complete contract lifecycle for Indian law.
          </motion.p>
        </div>
      </section>

      {/* Core Features Grid */}
      <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
          >
            {coreFeatures.map((f, i) => {
              const Icon = f.icon;
              return (
                <motion.div
                  key={i}
                  variants={itemScale}
                  className="group relative bg-card rounded-2xl border border-border/80 p-6 card-3d cursor-default overflow-hidden"
                >
                  <div
                    className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${f.accent} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                  />
                  <div className="relative z-10">
                    <div
                      className={`w-11 h-11 rounded-xl bg-gradient-to-br ${f.accent} text-white flex items-center justify-center mb-5 shadow-sm group-hover:scale-110 group-hover:shadow-md transition-all duration-300`}
                    >
                      <Icon size={20} />
                    </div>
                    <h3 className="font-heading font-bold text-base text-foreground mb-2">
                      {f.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {f.desc}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Additional Features */}
      <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            className="text-center mb-14"
          >
            <h2 className="text-3xl sm:text-4xl font-heading font-black text-foreground tracking-tight mb-4">
              And so much more
            </h2>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              Enterprise capabilities purpose-built for Indian regulatory frameworks.
            </p>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4"
          >
            {additionalFeatures.map((f, i) => {
              const Icon = f.icon;
              return (
                <motion.div
                  key={i}
                  variants={itemFadeUp}
                  className="bg-card rounded-2xl border border-border p-5 card-3d"
                >
                  <div className="w-10 h-10 rounded-xl bg-navy-50 text-navy-600 flex items-center justify-center mb-3">
                    <Icon size={18} />
                  </div>
                  <h3 className="font-heading font-bold text-sm text-foreground mb-1">
                    {f.title}
                  </h3>
                  <p className="text-muted-foreground text-xs leading-relaxed">
                    {f.desc}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            variants={scaleReveal}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            className="relative rounded-[2rem] overflow-hidden bg-navy-900 text-center px-6 py-16 sm:py-20"
          >
            <div className="absolute top-[-40%] left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-gold-500/15 rounded-full blur-[100px] pointer-events-none" />
            <div className="relative z-10 max-w-2xl mx-auto space-y-6">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-black text-white tracking-tight">
                Ready to see it in action?
              </h2>
              <p className="text-lg text-navy-300 font-medium">
                Upload your first contract and get a free AI-powered analysis.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
                <motion.a
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  href="https://app.lexireview.in/signup"
                  className="group bg-white text-navy-900 text-lg font-bold py-4 px-10 rounded-2xl shadow-lg hover:shadow-xl transition-all inline-flex items-center"
                >
                  Start Free Trial
                  <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </motion.a>
                <Link
                  href="/contact"
                  className="text-navy-300 hover:text-white font-semibold transition-colors inline-flex items-center gap-2"
                >
                  Book a Demo <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
