"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  type LucideIcon,
} from "lucide-react";
import {
  fadeUp,
  scaleReveal,
  stagger,
  itemFadeUp,
  itemScale,
  viewport,
} from "@/lib/motion";

interface Feature {
  title: string;
  desc: string;
  icon: LucideIcon;
  accent: string;
}

interface SolutionPageProps {
  badge: string;
  badgeIcon: LucideIcon;
  headline: string;
  headlineAccent: string;
  subtitle: string;
  pain: { title: string; desc: string }[];
  features: Feature[];
  stats: { value: string; label: string }[];
  checklist: string[];
  ctaHeadline: string;
  ctaSubtext: string;
  color: string;
}

export function SolutionPage(props: SolutionPageProps) {
  const BadgeIcon = props.badgeIcon;

  return (
    <>
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
            <BadgeIcon size={14} className="text-gold-500" /> {props.badge}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl sm:text-5xl lg:text-6xl font-heading font-black tracking-[-0.03em] text-foreground mb-6"
          >
            {props.headline}{" "}
            <span className="text-gradient-navy">{props.headlineAccent}</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
          >
            {props.subtitle}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8"
          >
            <motion.a
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
              href="https://app.lexireview.in"
              className="group bg-navy-900 text-white font-bold py-3.5 px-8 rounded-2xl glow-navy inline-flex items-center gap-2"
            >
              Start Free Trial
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </motion.a>
            <Link
              href="/contact"
              className="text-muted-foreground hover:text-foreground font-semibold transition-colors inline-flex items-center gap-2"
            >
              Book a Demo <ArrowRight size={14} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 border-y border-border/60 bg-muted/30">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          className="max-w-5xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {props.stats.map((s, i) => (
            <motion.div key={i} variants={itemScale} className="text-center">
              <div className="text-3xl sm:text-4xl font-heading font-black text-foreground">
                {s.value}
              </div>
              <div className="text-sm text-muted-foreground font-medium mt-1">
                {s.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Pain Points */}
      <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            className="text-center mb-14"
          >
            <h2 className="text-3xl sm:text-4xl font-heading font-black text-foreground tracking-tight mb-4">
              The challenges you face
            </h2>
          </motion.div>
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-4xl mx-auto"
          >
            {props.pain.map((p, i) => (
              <motion.div
                key={i}
                variants={itemFadeUp}
                className="bg-red-50/60 border border-red-100 rounded-2xl p-5"
              >
                <h3 className="font-heading font-bold text-foreground mb-2">
                  {p.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {p.desc}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features */}
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
              How LexiReview helps
            </h2>
          </motion.div>
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
          >
            {props.features.map((f, i) => {
              const Icon = f.icon;
              return (
                <motion.div
                  key={i}
                  variants={itemScale}
                  className="group bg-card rounded-2xl border border-border/80 p-6 card-3d overflow-hidden"
                >
                  <div
                    className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${f.accent} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                  />
                  <div
                    className={`w-11 h-11 rounded-xl bg-gradient-to-br ${f.accent} text-white flex items-center justify-center mb-5 shadow-sm group-hover:scale-110 transition-transform duration-300`}
                  >
                    <Icon size={20} />
                  </div>
                  <h3 className="font-heading font-bold text-base text-foreground mb-2">
                    {f.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {f.desc}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Checklist */}
      <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            className="text-center mb-10"
          >
            <h2 className="text-3xl sm:text-4xl font-heading font-black text-foreground tracking-tight mb-4">
              What you get
            </h2>
          </motion.div>
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            className="grid grid-cols-1 sm:grid-cols-2 gap-3"
          >
            {props.checklist.map((item, i) => (
              <motion.div
                key={i}
                variants={itemFadeUp}
                className="flex items-center gap-3 bg-card rounded-xl border border-border p-4"
              >
                <CheckCircle2 size={18} className="text-emerald-500 shrink-0" />
                <span className="text-sm font-medium text-foreground">
                  {item}
                </span>
              </motion.div>
            ))}
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
                {props.ctaHeadline}
              </h2>
              <p className="text-lg text-navy-300 font-medium">
                {props.ctaSubtext}
              </p>
              <motion.a
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                href="https://app.lexireview.in"
                className="group bg-white text-navy-900 text-lg font-bold py-4 px-10 rounded-2xl shadow-lg hover:shadow-xl transition-all inline-flex items-center"
              >
                Start Free Trial
                <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </motion.a>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
