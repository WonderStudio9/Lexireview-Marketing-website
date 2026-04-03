"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  FileText,
  Download,
  CheckCircle2,
  ArrowRight,
  BookOpen,
  Shield,
  Scale,
  Stamp,
  Layers,
} from "lucide-react";
import { fadeUp, stagger, itemFadeUp, scaleReveal, viewport } from "@/lib/motion";

const resources = [
  {
    title: "RBI Compliance Checklist for NBFCs",
    desc: "A comprehensive checklist covering RBI master directions, KYC requirements, and outsourcing guidelines for NBFC contracts.",
    type: "Checklist",
    icon: Shield,
    accent: "from-navy-600 to-navy-800",
  },
  {
    title: "DPDP Act Contract Audit Guide",
    desc: "Step-by-step guide to auditing your contracts for DPDP Act compliance. Includes DPA templates and consent clause examples.",
    type: "Guide",
    icon: Scale,
    accent: "from-gold-500 to-gold-700",
  },
  {
    title: "Indian Stamp Duty Quick Reference",
    desc: "State-wise stamp duty rates for all major document types. Updated for 2024-25 with e-stamping guidance.",
    type: "Reference",
    icon: Stamp,
    accent: "from-emerald-500 to-emerald-700",
  },
  {
    title: "Contract Review Playbook Template",
    desc: "Build your firm's contract review playbook with this customizable template. Includes clause libraries and risk frameworks.",
    type: "Template",
    icon: Layers,
    accent: "from-indigo-500 to-purple-500",
  },
  {
    title: "AI Contract Review ROI Calculator",
    desc: "Calculate how much time and money your team can save with AI-powered contract review. Includes industry benchmarks.",
    type: "Calculator",
    icon: FileText,
    accent: "from-red-500 to-orange-500",
  },
  {
    title: "RERA Compliance Handbook",
    desc: "Everything you need to know about RERA compliance for builder-buyer agreements, allotment letters, and sale deeds.",
    type: "Handbook",
    icon: BookOpen,
    accent: "from-amber-500 to-yellow-500",
  },
];

export default function ResourcesPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-16 sm:pt-40 sm:pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 aurora-bg opacity-60" />
        <div className="absolute inset-0 grain" />
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-gold-200 bg-gold-50/80 text-gold-700 text-xs font-bold uppercase tracking-wider mb-6"
          >
            <BookOpen size={14} className="text-gold-500" /> Resources
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl sm:text-5xl lg:text-6xl font-heading font-black tracking-[-0.03em] text-foreground mb-6"
          >
            Guides, templates &{" "}
            <span className="text-gradient-navy">checklists</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-lg sm:text-xl text-muted-foreground max-w-xl mx-auto"
          >
            Free resources to help your legal team navigate Indian contract
            management and regulatory compliance.
          </motion.p>
        </div>
      </section>

      {/* Resources Grid */}
      <section className="pb-20 sm:pb-28 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {resources.map((r, i) => {
              const Icon = r.icon;
              return (
                <motion.div
                  key={i}
                  variants={itemFadeUp}
                  className="group bg-card rounded-2xl border border-border p-6 card-3d overflow-hidden relative"
                >
                  <div
                    className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${r.accent} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                  />
                  <div className="flex items-center gap-2 mb-4">
                    <div
                      className={`w-10 h-10 rounded-xl bg-gradient-to-br ${r.accent} text-white flex items-center justify-center shadow-sm`}
                    >
                      <Icon size={18} />
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      {r.type}
                    </span>
                  </div>
                  <h3 className="font-heading font-bold text-foreground mb-2">
                    {r.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                    {r.desc}
                  </p>
                  <a
                    href="https://app.lexireview.in/signup"
                    className="inline-flex items-center gap-2 text-sm font-bold text-navy-700 hover:text-navy-900 transition-colors"
                  >
                    <Download size={14} /> Download Free
                  </a>
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
                Ready to automate your contract review?
              </h2>
              <p className="text-lg text-navy-300 font-medium">
                Try LexiReview free and see AI-powered contract intelligence in
                action.
              </p>
              <motion.a
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                href="https://app.lexireview.in/signup"
                className="group bg-white text-navy-900 text-lg font-bold py-4 px-10 rounded-2xl shadow-lg hover:shadow-xl transition-all inline-flex items-center"
              >
                Start Free Trial
                <ArrowRight
                  size={20}
                  className="ml-2 group-hover:translate-x-1 transition-transform"
                />
              </motion.a>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
