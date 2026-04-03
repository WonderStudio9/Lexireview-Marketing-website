"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  XCircle,
  MinusCircle,
  type LucideIcon,
} from "lucide-react";
import {
  fadeUp,
  scaleReveal,
  stagger,
  itemFadeUp,
  viewport,
} from "@/lib/motion";

type FeatureStatus = "yes" | "no" | "partial";

interface CompareFeature {
  name: string;
  lexi: FeatureStatus;
  competitor: FeatureStatus;
}

interface ComparePageProps {
  badgeIcon: LucideIcon;
  badge: string;
  competitor: string;
  headline: string;
  headlineAccent: string;
  subtitle: string;
  advantages: { title: string; desc: string }[];
  features: CompareFeature[];
  ctaHeadline: string;
}

function StatusIcon({ status }: { status: FeatureStatus }) {
  if (status === "yes")
    return <CheckCircle2 size={18} className="text-emerald-500" />;
  if (status === "no") return <XCircle size={18} className="text-red-400" />;
  return <MinusCircle size={18} className="text-amber-400" />;
}

export function ComparePage(props: ComparePageProps) {
  const BadgeIcon = props.badgeIcon;

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
            className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto"
          >
            {props.subtitle}
          </motion.p>
        </div>
      </section>

      {/* Key Advantages */}
      <section className="py-20 sm:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-heading font-black text-foreground tracking-tight">
              Why teams choose LexiReview
            </h2>
          </motion.div>
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            {props.advantages.map((a, i) => (
              <motion.div
                key={i}
                variants={itemFadeUp}
                className="bg-card rounded-2xl border border-border p-6 card-3d"
              >
                <div className="flex items-start gap-3">
                  <CheckCircle2
                    size={20}
                    className="text-emerald-500 shrink-0 mt-0.5"
                  />
                  <div>
                    <h3 className="font-heading font-bold text-foreground mb-1">
                      {a.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {a.desc}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-20 sm:py-24 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-4xl mx-auto">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-heading font-black text-foreground tracking-tight">
              Feature comparison
            </h2>
          </motion.div>

          <motion.div
            variants={scaleReveal}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            className="bg-card rounded-2xl border border-border shadow-elevated overflow-hidden"
          >
            {/* Header */}
            <div className="grid grid-cols-3 gap-4 px-6 py-4 border-b border-border bg-muted/50">
              <div className="font-heading font-bold text-sm text-muted-foreground">
                Feature
              </div>
              <div className="text-center font-heading font-bold text-sm text-foreground">
                LexiReview
              </div>
              <div className="text-center font-heading font-bold text-sm text-muted-foreground">
                {props.competitor}
              </div>
            </div>

            {/* Rows */}
            {props.features.map((f, i) => (
              <div
                key={i}
                className={`grid grid-cols-3 gap-4 px-6 py-3.5 text-sm ${
                  i !== props.features.length - 1 ? "border-b border-border/60" : ""
                }`}
              >
                <div className="font-medium text-foreground">{f.name}</div>
                <div className="flex justify-center">
                  <StatusIcon status={f.lexi} />
                </div>
                <div className="flex justify-center">
                  <StatusIcon status={f.competitor} />
                </div>
              </div>
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
                Start your free trial and see the difference for yourself.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
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
