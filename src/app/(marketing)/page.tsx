"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  motion,
  AnimatePresence,
  useInView,
  useMotionValue,
  useTransform,
  animate,
} from "framer-motion";
import {
  ArrowRight,
  ShieldCheck,
  ShieldAlert,
  FileText,
  Scale,
  Lock,
  Zap,
  AlertTriangle,
  AlertOctagon,
  FileWarning,
  MessageSquare,
  Building2,
  Landmark,
  Briefcase,
  Home,
  Target,
  Users,
  Sparkles,
  Eye,
  Shield,
  GanttChart,
  Upload,
  FileSearch,
  CheckCircle2,
  Clock,
  BarChart3,
  Layers,
  Award,
  ChevronDown,
  ArrowUpRight,
} from "lucide-react";
import {
  fadeUp,
  fadeUpFast,
  scaleReveal,
  stagger,
  staggerSlow,
  itemFadeUp,
  itemScale,
  itemSlideRight,
  heroHeadline,
  heroWord,
  heroSubtext,
  heroCTA,
  heroCard,
  float,
  tabContentIn,
  viewport,
  viewportEager,
} from "@/lib/motion";

// ── Utilities ───────────────────────────────────────────────────────────────

function AnimatedCounter({
  target,
  suffix = "",
  decimals = 0,
}: {
  target: number;
  suffix?: string;
  decimals?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const mv = useMotionValue(0);
  const display = useTransform(mv, (v) =>
    decimals > 0 ? v.toFixed(decimals) : Math.round(v).toLocaleString("en-IN")
  );
  const inView = useInView(ref, { once: true, margin: "-40px" });

  useEffect(() => {
    if (inView) animate(mv, target, { duration: 2.2, ease: [0.16, 1, 0.3, 1] });
  }, [inView, mv, target]);

  return (
    <span ref={ref}>
      <motion.span>{display}</motion.span>
      {suffix}
    </span>
  );
}

function useMousePosition(ref: React.RefObject<HTMLElement | null>) {
  const [pos, setPos] = useState({ x: -200, y: -200 });
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const handler = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    };
    el.addEventListener("mousemove", handler);
    return () => el.removeEventListener("mousemove", handler);
  }, [ref]);
  return pos;
}

// ── FAQ Data (for JSON-LD schema) ───────────────────────────────────────────

const faqs = [
  {
    question: "What types of contracts does LexiReview support?",
    answer:
      "LexiReview supports all types of commercial contracts including loan agreements, service agreements, employment contracts, NDAs, vendor agreements, lease deeds, sale agreements, builder-buyer agreements, MoUs, tender documents, and more. Our AI models are specifically trained on Indian contract formats and legal terminology.",
  },
  {
    question: "How does LexiReview ensure regulatory compliance?",
    answer:
      "We maintain continuously updated rule engines for ICA (Indian Contract Act), RBI master directions, SEBI regulations, DPDP Act provisions, RERA guidelines, and state-wise Stamp Acts across all 28 states. LexiBrain, our autonomous AI pipeline, monitors government sources 24/7 and auto-updates compliance rules so your team never falls behind.",
  },
  {
    question: "Is my contract data secure?",
    answer:
      "Absolutely. LexiReview uses bank-grade encryption at rest and in transit, chain-hashed audit trails with SHA-256 checksums for tamper-proof records, role-based access control, SSO via SAML 2.0 and OIDC, and two-factor authentication. We never use your contract data to train our models.",
  },
  {
    question: "What is Quick Triage and does it cost credits?",
    answer:
      "Quick Triage is our instant risk screening tool that delivers a go/no-go assessment in under 2 seconds using deterministic pattern-matching. It does not consume AI credits, making it perfect for high-volume screening before committing to a full AI-powered deep analysis.",
  },
  {
    question: "Can LexiReview generate contracts, not just review them?",
    answer:
      "Yes. LexiReview covers the full contract lifecycle. Our AI Contract Generation Wizard walks you through a 6-step flow — from selecting contract type and template, to an interactive AI chat that asks context-specific questions, to preview and generation. You can also use the Scratch Editor, clone existing contracts, or fix issues found during a review.",
  },
  {
    question: "Can LexiReview integrate with our existing systems?",
    answer:
      "Yes. LexiReview offers REST APIs, webhook integrations with HMAC signature verification, SSO via SAML 2.0 and OIDC, and direct e-Office integration for government departments. API keys can be generated from the dashboard for programmatic access.",
  },
  {
    question: "What is the pricing model?",
    answer:
      "LexiReview offers monthly subscription plans starting from a free trial (3 reviews) to Enterprise (unlimited). We also offer pay-as-you-go credits starting at ₹99 for Quick Triage. All plans include a 30-day money-back guarantee, and the free trial requires no credit card.",
  },
];

// ── Main Page ───────────────────────────────────────────────────────────────

export default function MarketingPage() {
  return (
    <>
      {/* FAQ Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqs.map((faq) => ({
              "@type": "Question",
              name: faq.question,
              acceptedAnswer: { "@type": "Answer", text: faq.answer },
            })),
          }),
        }}
      />
      <HeroSection />
      <LogoMarquee />
      <SocialProof />
      <FeaturesSection />
      <IndustrySection />
      <ProductDemo />
      <HowItWorks />
      <FinalCTA />
      <FAQSection />
    </>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// 1. HERO
// ═══════════════════════════════════════════════════════════════════════════

function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouse = useMousePosition(containerRef);

  const words1 = ["Your", "contracts,"];
  const words2 = ["understood in", "seconds."];

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex items-center pt-24 pb-16 sm:pt-28 sm:pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden"
    >
      {/* Ambient mesh */}
      <div className="absolute inset-0 aurora-bg opacity-60" />
      <div className="absolute inset-0 grain" />

      {/* Floating orbs */}
      <motion.div
        variants={float(8, 20)}
        animate="animate"
        className="absolute top-32 left-[10%] w-72 h-72 bg-gold-200/30 rounded-full blur-[80px]"
      />
      <motion.div
        variants={float(10, 16)}
        animate="animate"
        className="absolute bottom-20 right-[5%] w-96 h-96 bg-navy-200/30 rounded-full blur-[100px]"
      />
      <motion.div
        variants={float(7, 12)}
        animate="animate"
        className="absolute top-[60%] left-[50%] w-64 h-64 bg-emerald-200/20 rounded-full blur-[80px]"
      />

      <div className="relative z-10 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
        {/* LEFT — Copy */}
        <div className="lg:col-span-6 space-y-8 text-center lg:text-left">
          {/* Pill badge */}
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-gold-200 bg-gold-50/80 text-gold-700 text-xs font-bold uppercase tracking-wider backdrop-blur-sm"
          >
            <Sparkles size={14} className="text-gold-500" /> Built for Indian
            Regulatory Compliance
          </motion.div>

          {/* Headline — cinematic word reveal */}
          <div className="perspective-2000">
            <motion.h1
              variants={heroHeadline}
              initial="hidden"
              animate="visible"
              className="text-[2.75rem] sm:text-5xl lg:text-6xl xl:text-[4.25rem] font-heading font-black tracking-[-0.03em] leading-[1.05]"
            >
              <span className="block">
                {words1.map((w, i) => (
                  <motion.span
                    key={i}
                    variants={heroWord}
                    className="inline-block mr-3 text-foreground"
                  >
                    {w}
                  </motion.span>
                ))}
              </span>
              <span className="block mt-1">
                {words2.map((w, i) => (
                  <motion.span
                    key={i}
                    variants={heroWord}
                    className="inline-block mr-3 text-gradient-navy"
                  >
                    {w}
                  </motion.span>
                ))}
              </span>
            </motion.h1>
          </div>

          {/* Subheadline */}
          <motion.p
            variants={heroSubtext}
            initial="hidden"
            animate="visible"
            className="text-lg sm:text-xl text-muted-foreground font-medium max-w-lg mx-auto lg:mx-0 leading-relaxed"
          >
            Upload any contract. Get AI-powered risk scores, missing clause detection, and Indian law compliance in 45 seconds. From triage to review, generation to signing, vaulting to compliance.
          </motion.p>

          {/* CTA cluster */}
          <motion.div
            variants={heroCTA}
            initial="hidden"
            animate="visible"
            className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start"
          >
            <motion.a
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
              href="https://app.lexireview.in/signup"
              className="group relative bg-navy-900 text-white text-lg font-bold py-4 px-8 sm:px-10 rounded-2xl glow-navy overflow-hidden w-full sm:w-auto text-center"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.08] to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              <span className="relative flex items-center justify-center gap-2">
                Start Free Trial
                <ArrowRight
                  size={20}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </span>
            </motion.a>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Lock size={13} /> Bank-grade encrypted
              </span>
              <span className="hidden sm:block">·</span>
              <span className="hidden sm:block">No credit card</span>
            </div>
          </motion.div>

          {/* Trust strip */}
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="visible"
            className="flex flex-wrap gap-2.5 justify-center lg:justify-start pt-2"
          >
            {[
              { icon: <Shield size={13} />, text: "SOC 2 Ready" },
              { icon: <Scale size={13} />, text: "Indian Contract Act" },
              { icon: <Users size={13} />, text: "150+ Legal Teams" },
              { icon: <Eye size={13} />, text: "98.5% Accuracy" },
            ].map((t, i) => (
              <motion.div
                key={i}
                variants={itemFadeUp}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/60 backdrop-blur-sm border border-border/60 text-xs font-medium text-muted-foreground"
              >
                {t.icon} {t.text}
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* RIGHT — Interactive 3D contract card */}
        <div className="lg:col-span-6 relative flex justify-center lg:justify-end">
          <motion.div
            variants={heroCard}
            initial="hidden"
            animate="visible"
            className="relative w-full max-w-[460px]"
            style={{
              transform: `perspective(1200px) rotateY(${(mouse.x - 230) * 0.008}deg) rotateX(${(mouse.y - 300) * -0.008}deg)`,
              transition: "transform 0.1s ease-out",
            }}
          >
            {/* Card glow */}
            <div className="absolute -inset-4 bg-gradient-to-br from-gold-300/20 via-transparent to-navy-300/20 rounded-[2.5rem] blur-xl opacity-60" />

            <div className="relative bg-card/95 backdrop-blur-xl rounded-[2rem] shadow-elevated border border-border/80 p-6 sm:p-7">
              {/* Floating badge */}
              <motion.div
                variants={float(4, 10)}
                animate="animate"
                className="absolute -top-5 -right-5 bg-gradient-to-br from-gold-400 to-gold-500 text-navy-900 p-3.5 rounded-2xl shadow-lg z-30 ring-4 ring-background"
              >
                <ShieldCheck size={28} />
              </motion.div>

              {/* File header */}
              <div className="flex items-center gap-3 border-b border-border/60 pb-4 mb-4">
                <div className="h-11 w-11 bg-red-50 rounded-xl flex items-center justify-center text-red-500 ring-1 ring-red-100">
                  <FileText size={22} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-foreground text-sm truncate">
                    Vendor_Agreement_v2.pdf
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-medium">
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
                    </span>
                    Analysis Complete · 24 pages
                  </div>
                </div>
              </div>

              {/* Score bar */}
              <div className="bg-navy-900 rounded-xl p-4 mb-4 flex items-center gap-4">
                <div className="relative w-16 h-16 shrink-0">
                  <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="rgba(255,255,255,0.1)"
                      strokeWidth="8"
                    />
                    <motion.circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="#f59e0b"
                      strokeWidth="8"
                      strokeLinecap="round"
                      strokeDasharray={251}
                      initial={{ strokeDashoffset: 251 }}
                      animate={{ strokeDashoffset: 251 - (251 * 42) / 100 }}
                      transition={{
                        duration: 1.8,
                        ease: [0.16, 1, 0.3, 1],
                        delay: 1.2,
                      }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-lg font-black text-white">
                      <AnimatedCounter target={42} />
                    </span>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-navy-400 mb-0.5">
                    Safety Score
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-amber-400 font-bold text-sm flex items-center gap-1">
                      <AlertTriangle size={14} /> Needs Review
                    </span>
                  </div>
                  <div className="flex gap-3 mt-2 text-[10px] text-navy-400">
                    <span>
                      <span className="text-red-400 font-bold">5</span> Critical
                    </span>
                    <span>
                      <span className="text-amber-400 font-bold">3</span>{" "}
                      Warning
                    </span>
                    <span>
                      <span className="text-emerald-400 font-bold">8</span> Safe
                    </span>
                  </div>
                </div>
              </div>

              {/* Issues */}
              <motion.div
                variants={staggerSlow}
                initial="hidden"
                animate="visible"
                className="space-y-2.5"
              >
                {[
                  {
                    color: "red",
                    icon: AlertOctagon,
                    title: "Uncapped Liability",
                    desc: "Clause 12.3 — indefinite indemnity exposure",
                  },
                  {
                    color: "amber",
                    icon: AlertTriangle,
                    title: "Missing Exit Clause",
                    desc: "No 30-day termination for convenience",
                  },
                  {
                    color: "gold",
                    icon: FileWarning,
                    title: "Non-Compete Overreach",
                    desc: "May violate Section 27 of Contract Act",
                  },
                ].map((issue, i) => (
                  <motion.div
                    key={i}
                    variants={itemSlideRight}
                    className={`p-3 rounded-xl border cursor-default transition-all hover:shadow-sm ${
                      issue.color === "red"
                        ? "bg-red-50/80 border-red-100 hover:border-red-200"
                        : ""
                    } ${
                      issue.color === "amber"
                        ? "bg-amber-50/80 border-amber-100 hover:border-amber-200"
                        : ""
                    } ${
                      issue.color === "gold"
                        ? "bg-gold-50/80 border-gold-100 hover:border-gold-200"
                        : ""
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      <issue.icon
                        size={16}
                        className={`shrink-0 mt-0.5 ${
                          issue.color === "red" ? "text-red-500" : ""
                        } ${issue.color === "amber" ? "text-amber-500" : ""} ${
                          issue.color === "gold" ? "text-gold-500" : ""
                        }`}
                      />
                      <div>
                        <div className="font-bold text-foreground text-sm leading-tight">
                          {issue.title}
                        </div>
                        <p className="text-muted-foreground text-xs mt-0.5">
                          {issue.desc}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// 2. LOGO MARQUEE
// ═══════════════════════════════════════════════════════════════════════════

function LogoMarquee() {
  const industries = [
    "NBFC Partners",
    "Top-20 Law Firms",
    "Real Estate Groups",
    "Government Departments",
    "Insurance Companies",
    "Fintech Startups",
    "Manufacturing",
    "Healthcare",
  ];

  return (
    <div className="py-8 border-y border-border/60 bg-muted/30 overflow-hidden">
      <p className="text-center text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground mb-5">
        Trusted across industries
      </p>
      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-muted/30 to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-muted/30 to-transparent z-10" />
        <div className="flex animate-marquee whitespace-nowrap">
          {[...industries, ...industries].map((name, i) => (
            <div
              key={i}
              className="flex items-center gap-3 mx-8 text-muted-foreground/60 hover:text-muted-foreground transition-colors"
            >
              <div className="w-8 h-8 rounded-lg bg-border/50 flex items-center justify-center">
                <Building2 size={16} />
              </div>
              <span className="text-sm font-semibold tracking-wide">
                {name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// 3. SOCIAL PROOF
// ═══════════════════════════════════════════════════════════════════════════

function SocialProof() {
  const stats = [
    {
      value: 2500,
      suffix: "+",
      label: "Contracts Analyzed",
      icon: <FileText size={22} />,
    },
    {
      value: 150,
      suffix: "+",
      label: "Legal Teams",
      icon: <Users size={22} />,
    },
    {
      value: 98.5,
      suffix: "%",
      label: "Detection Accuracy",
      decimals: 1,
      icon: <Target size={22} />,
    },
    {
      value: 45,
      suffix: "s",
      label: "Avg Analysis Time",
      icon: <Clock size={22} />,
    },
  ];

  const testimonials = [
    {
      quote:
        "LexiReview caught a liability clause our team missed in a 47-page vendor agreement. That one catch saved us significant exposure.",
      author: "Senior Legal Counsel",
      company: "Leading NBFC",
    },
    {
      quote:
        "We triage 30+ contracts a week now. What used to take our associates 2 hours per contract takes 3 minutes.",
      author: "Managing Partner",
      company: "Top-20 Law Firm",
    },
    {
      quote:
        "The compliance certificate feature alone justified the subscription. Our audit team loves the automated reports.",
      author: "Head of Legal",
      company: "Real Estate Developer",
    },
  ];

  const [active, setActive] = useState(0);
  useEffect(() => {
    const t = setInterval(
      () => setActive((p) => (p + 1) % testimonials.length),
      5000
    );
    return () => clearInterval(t);
  }, [testimonials.length]);

  return (
    <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Stat cards */}
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-20"
        >
          {stats.map((s, i) => (
            <motion.div
              key={i}
              variants={itemScale}
              className="relative bg-card rounded-2xl border border-border p-6 text-center card-3d group"
            >
              <div className="w-12 h-12 rounded-xl bg-navy-50 text-navy-600 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                {s.icon}
              </div>
              <div className="text-3xl sm:text-4xl font-heading font-black text-foreground tracking-tight">
                <AnimatedCounter
                  target={s.value}
                  suffix={s.suffix}
                  decimals={s.decimals || 0}
                />
              </div>
              <div className="text-sm text-muted-foreground font-medium mt-1">
                {s.label}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Testimonials */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          className="max-w-3xl mx-auto"
        >
          <p className="text-center text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground mb-8">
            What legal professionals say
          </p>
          <div className="relative min-h-[160px] sm:min-h-[140px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 20, filter: "blur(4px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -20, filter: "blur(4px)" }}
                transition={{ duration: 0.5 }}
                className="text-center"
              >
                <blockquote className="text-xl sm:text-2xl font-heading font-semibold text-foreground leading-relaxed">
                  &ldquo;{testimonials[active].quote}&rdquo;
                </blockquote>
                <p className="mt-6 text-sm text-muted-foreground font-medium">
                  — {testimonials[active].author},{" "}
                  <span className="text-foreground font-semibold">
                    {testimonials[active].company}
                  </span>
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
          <div className="flex justify-center gap-2 mt-6">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                aria-label={`Testimonial ${i + 1}`}
                className={`h-2 rounded-full transition-all duration-500 ${
                  i === active
                    ? "bg-navy-800 w-8"
                    : "bg-border w-2 hover:bg-navy-300"
                }`}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// 4. FEATURES — interactive spotlight grid
// ═══════════════════════════════════════════════════════════════════════════

function FeaturesSection() {
  const gridRef = useRef<HTMLDivElement>(null);
  const mouse = useMousePosition(gridRef);

  const features = [
    {
      title: "AI Risk Scoring",
      desc: "Every clause color-coded by severity. 0-100 safety score in seconds, not hours.",
      icon: ShieldAlert,
      accent: "from-red-500 to-orange-500",
    },
    {
      title: "Missing Clause Detection",
      desc: "Lexi flags what's NOT in your contract — the clauses you didn't know were missing.",
      icon: FileWarning,
      accent: "from-amber-500 to-yellow-500",
    },
    {
      title: "Indian Law Compliance",
      desc: "ICA, Stamp Act, SEBI, RBI — every regulation checked automatically.",
      icon: Scale,
      accent: "from-gold-500 to-gold-600",
    },
    {
      title: "Chat with Your Contract",
      desc: "Ask Lexi anything. 'What's the penalty clause?' Instant, cited answers.",
      icon: MessageSquare,
      accent: "from-navy-500 to-navy-700",
    },
    {
      title: "Quick Triage",
      desc: "Go or no-go in 45 seconds. Screen contracts before deep-diving.",
      icon: Zap,
      accent: "from-emerald-500 to-teal-500",
    },
    {
      title: "Clause Library",
      desc: "Pre-approved clause templates for every contract type. Maintain consistency across your org.",
      icon: Layers,
      accent: "from-gold-500 to-gold-700",
    },
    {
      title: "Batch Processing",
      desc: "100 legacy contracts overnight. Lexi works while you sleep.",
      icon: GanttChart,
      accent: "from-indigo-500 to-purple-500",
    },
    {
      title: "Compliance Certificates",
      desc: "Audit-ready reports. One click. Your compliance team will thank you.",
      icon: Award,
      accent: "from-emerald-500 to-green-600",
    },
  ];

  return (
    <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-7xl mx-auto">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-muted/50 text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">
            <GanttChart size={14} /> Platform Capabilities
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-black text-foreground tracking-tight mb-4">
            Everything you need. Nothing you don&apos;t.
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
            From 45-second triage to deep clause-by-clause analysis — one
            platform for every contract.
          </p>
        </motion.div>

        <motion.div
          ref={gridRef}
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
          style={
            {
              "--mouse-x": `${mouse.x}px`,
              "--mouse-y": `${mouse.y}px`,
            } as React.CSSProperties
          }
        >
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <motion.div
                key={i}
                variants={itemScale}
                className="group relative bg-card rounded-2xl border border-border/80 p-6 card-highlight card-3d cursor-default overflow-hidden"
              >
                {/* Gradient accent on hover */}
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
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// 5. INDUSTRY SECTION — tabbed layout
// ═══════════════════════════════════════════════════════════════════════════

const industries = [
  {
    id: "nbfc",
    label: "NBFCs & Banks",
    icon: Landmark,
    headline: "Scale contract review across your lending operations",
    pain: "Loan agreements pile up. Vendor contracts slip through. Compliance deadlines loom.",
    solution:
      "Automate ICA and SEBI checks across every agreement. Flag non-compliant clauses before they become audit findings.",
    features: [
      "RBI/SEBI compliance checks",
      "Loan agreement analysis",
      "Vendor risk scoring",
      "Batch processing for legacy contracts",
    ],
    stat: { value: "40%", label: "faster loan documentation review" },
    color: "from-navy-600 to-navy-800",
    href: "/solutions/nbfc",
  },
  {
    id: "law",
    label: "Law Firms",
    icon: Briefcase,
    headline: "Bill for strategy, not for reading",
    pain: "Associates spend hours reading contracts that could be triaged in minutes.",
    solution:
      "Quick triage in 45 seconds. Custom playbooks per client. White-label reports with your branding.",
    features: [
      "45-second Quick Triage",
      "Per-client playbooks",
      "White-label PDF reports",
      "Matter workspace management",
    ],
    stat: { value: "3x", label: "more contracts per associate per day" },
    color: "from-gold-500 to-gold-700",
    href: "/solutions/legal-firms",
  },
  {
    id: "realestate",
    label: "Real Estate",
    icon: Home,
    headline: "Every sale deed. Every lease. Zero surprises.",
    pain: "Stamp duty varies by state. Registration requirements differ. Hidden clauses cost crores.",
    solution:
      "Automated stamp duty calculations, state-wise compliance, and registration guidance for every property document.",
    features: [
      "Stamp duty calculator (all states)",
      "Sale deed & lease analysis",
      "JDA/MOA risk detection",
      "Registration guidance",
    ],
    stat: { value: "28", label: "state stamp acts covered" },
    color: "from-emerald-500 to-emerald-700",
    href: "/solutions/real-estate",
  },
  {
    id: "govt",
    label: "Government",
    icon: Shield,
    headline: "Digitize legal review for the public sector",
    pain: "Tender documents, MoUs, and inter-departmental agreements pile up. CAG audits demand exhaustive documentation. Manual processes create bottlenecks.",
    solution:
      "e-Office integration, CAG-standard compliance reports, chain-hashed audit trails, and compliance certificates with human co-signature workflow.",
    features: [
      "e-Office integration",
      "CAG-standard reports",
      "Chain-hashed audit trails",
      "Compliance certificates",
    ],
    stat: { value: "5+", label: "government departments deployed" },
    color: "from-indigo-600 to-purple-700",
    href: "/solutions/government",
  },
  {
    id: "banking",
    label: "Banking",
    icon: Building2,
    headline: "Digitize legal review for banking operations",
    pain: "Complex banking contracts, ICA guidelines, and RBI circulars need continuous compliance tracking.",
    solution:
      "Full ICA compliance automation. RBI master direction checks. DPDP data processing agreement templates.",
    features: [
      "ICA compliance automation",
      "RBI circular tracking",
      "DPDP DPA templates",
      "Audit trail generation",
    ],
    stat: { value: "5+", label: "major banks deployed" },
    color: "from-navy-700 to-navy-900",
    href: "/solutions/banking",
  },
];

function IndustrySection() {
  const [activeId, setActiveId] = useState("nbfc");
  const active = industries.find((ind) => ind.id === activeId)!;
  const ActiveIcon = active.icon;

  return (
    <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-navy-900 text-white relative overflow-hidden">
      {/* Background orbs */}
      <motion.div
        variants={float(12, 20)}
        animate="animate"
        className="absolute top-0 right-0 w-[500px] h-[500px] bg-gold-500/5 rounded-full blur-[120px]"
      />
      <motion.div
        variants={float(10, 15)}
        animate="animate"
        className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-navy-400/10 rounded-full blur-[100px]"
      />

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-xs font-bold uppercase tracking-wider text-navy-300 mb-4">
            <Target size={14} /> Industry Solutions
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-black tracking-tight mb-4">
            Built for{" "}
            <span className="text-gradient-gold">your industry</span>
          </h2>
          <p className="text-lg text-navy-300 max-w-xl mx-auto">
            Whether you&apos;re a solo practitioner or a large enterprise, Lexi
            adapts to your workflow.
          </p>
        </motion.div>

        {/* Tab bar */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex gap-1 p-1 bg-white/5 rounded-xl border border-white/10 overflow-x-auto">
            {industries.map((ind) => {
              const Icon = ind.icon;
              return (
                <button
                  key={ind.id}
                  onClick={() => setActiveId(ind.id)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold whitespace-nowrap transition-all ${
                    activeId === ind.id
                      ? "bg-white text-navy-900 shadow-lg"
                      : "text-navy-300 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Icon size={16} />{" "}
                  <span className="hidden sm:inline">{ind.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeId}
            variants={tabContentIn}
            initial="initial"
            animate="animate"
            exit="exit"
            className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center"
          >
            {/* Left — copy */}
            <div className="space-y-6">
              <h3 className="text-2xl sm:text-3xl font-heading font-bold">
                {active.headline}
              </h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-bold text-red-400 uppercase tracking-wider mb-1">
                    The Problem
                  </p>
                  <p className="text-navy-200 leading-relaxed">{active.pain}</p>
                </div>
                <div>
                  <p className="text-sm font-bold text-emerald-400 uppercase tracking-wider mb-1">
                    The Solution
                  </p>
                  <p className="text-navy-200 leading-relaxed">
                    {active.solution}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                {active.features.map((f) => (
                  <div
                    key={f}
                    className="flex items-center gap-2 text-sm text-navy-200"
                  >
                    <CheckCircle2
                      size={14}
                      className="text-emerald-400 shrink-0"
                    />{" "}
                    {f}
                  </div>
                ))}
              </div>
              <Link
                href={active.href}
                className="inline-flex items-center gap-2 text-gold-400 font-bold text-sm hover:text-gold-300 transition-colors"
              >
                Learn more about {active.label}
                <ArrowRight size={14} />
              </Link>
            </div>

            {/* Right — stat card */}
            <div className="flex justify-center">
              <div
                className={`relative w-full max-w-sm bg-gradient-to-br ${active.color} rounded-3xl p-8 sm:p-10 text-center shadow-2xl`}
              >
                <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center mx-auto mb-6">
                  <ActiveIcon size={32} />
                </div>
                <div className="text-5xl sm:text-6xl font-heading font-black mb-2">
                  {active.stat.value}
                </div>
                <div className="text-sm text-white/70 font-medium">
                  {active.stat.label}
                </div>
                <div className="mt-8 pt-6 border-t border-white/10">
                  <p className="text-xs text-white/50 uppercase tracking-wider font-bold">
                    {active.label}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// 6. PRODUCT DEMO
// ═══════════════════════════════════════════════════════════════════════════

function ProductDemo() {
  const [tab, setTab] = useState("risk");

  const tabs = [
    { id: "risk", label: "Risk Analysis", icon: ShieldAlert },
    { id: "missing", label: "Missing Clauses", icon: FileWarning },
    { id: "compliance", label: "Compliance", icon: Scale },
    { id: "ai", label: "AI Chat", icon: MessageSquare },
  ];

  const content: Record<string, React.ReactNode> = {
    risk: (
      <div className="space-y-4">
        <div className="flex items-center gap-5">
          <div className="relative w-20 h-20 shrink-0">
            <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
              <circle cx="50" cy="50" r="40" fill="none" stroke="#d9e2ec" strokeWidth="7" />
              <motion.circle
                cx="50" cy="50" r="40" fill="none" stroke="#ef4444" strokeWidth="7"
                strokeLinecap="round" strokeDasharray={251}
                initial={{ strokeDashoffset: 251 }}
                animate={{ strokeDashoffset: 251 - (251 * 45) / 100 }}
                transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xl font-black text-foreground">
                <AnimatedCounter target={45} />
              </span>
            </div>
          </div>
          <div>
            <div className="text-red-500 font-bold text-xs uppercase tracking-wider">High Risk Detected</div>
            <p className="text-muted-foreground text-sm mt-1">5 critical issues across 12 clauses require immediate review.</p>
          </div>
        </div>
        {[
          { severity: "Critical", text: "Uncapped indemnity in Clause 12.3", color: "bg-red-50 border-red-100 text-red-800" },
          { severity: "High", text: "Unilateral amendment rights in Clause 7.1", color: "bg-red-50 border-red-100 text-red-700" },
          { severity: "Medium", text: "Ambiguous IP assignment in Clause 15", color: "bg-amber-50 border-amber-100 text-amber-700" },
        ].map((item, i) => (
          <div key={i} className={`p-3 rounded-lg border text-sm ${item.color}`}>
            <span className="font-bold">{item.severity}:</span> {item.text}
          </div>
        ))}
      </div>
    ),
    missing: (
      <div className="space-y-3">
        {["Termination for Convenience", "Data Protection / Privacy", "Force Majeure", "Dispute Resolution (Arbitration)"].map((c, i) => (
          <div key={i} className="flex items-start gap-3 p-3 bg-amber-50/80 border border-amber-100 rounded-lg">
            <FileWarning size={16} className="text-amber-500 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-sm text-foreground">{c}</div>
              <p className="text-xs text-muted-foreground mt-0.5">Standard clause for this contract type — not found in document.</p>
            </div>
          </div>
        ))}
      </div>
    ),
    compliance: (
      <div className="space-y-3">
        {[
          { name: "Indian Contract Act, 1872", status: "warn", detail: "Section 15 — consent review needed" },
          { name: "Stamp Act", status: "pass", detail: "Stamp duty correctly assessed" },
          { name: "SEBI Regulations", status: "pass", detail: "All clauses compliant" },
          { name: "RBI Guidelines", status: "fail", detail: "KYC clause missing" },
          { name: "DPDP Act, 2023", status: "warn", detail: "Consent mechanism needs update" },
          { name: "RERA Compliance", status: "pass", detail: "Builder-buyer terms compliant" },
        ].map((item, i) => (
          <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-border bg-card">
            <div className="flex items-center gap-2.5">
              {item.status === "pass" && <CheckCircle2 size={16} className="text-emerald-500" />}
              {item.status === "warn" && <AlertTriangle size={16} className="text-amber-500" />}
              {item.status === "fail" && <AlertOctagon size={16} className="text-red-500" />}
              <span className="font-semibold text-sm">{item.name}</span>
            </div>
            <span className={`text-xs font-medium ${item.status === "pass" ? "text-emerald-600" : item.status === "warn" ? "text-amber-600" : "text-red-600"}`}>
              {item.detail}
            </span>
          </div>
        ))}
      </div>
    ),
    ai: (
      <div className="space-y-3">
        <div className="flex gap-3">
          <div className="w-7 h-7 rounded-full bg-navy-100 flex items-center justify-center shrink-0 text-navy-600">
            <Users size={14} />
          </div>
          <div className="bg-muted rounded-xl rounded-tl-sm px-4 py-2.5 text-sm">
            What is the termination notice period?
          </div>
        </div>
        <div className="flex gap-3">
          <div className="w-7 h-7 rounded-full bg-gold-100 flex items-center justify-center shrink-0">
            <Sparkles size={14} className="text-gold-600" />
          </div>
          <div className="bg-gold-50 border border-gold-100 rounded-xl rounded-tl-sm px-4 py-2.5 text-sm space-y-2">
            <p>Based on my analysis of this agreement:</p>
            <p className="font-semibold">The contract does not specify a termination notice period.</p>
            <p>
              This is flagged as a{" "}
              <span className="text-red-600 font-semibold">missing clause</span>. Standard practice is 30-60 days written notice.
            </p>
            <p className="text-xs text-muted-foreground mt-1">Reference: Clause 14 (Termination), Page 8</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground pl-10">
          <Sparkles size={12} className="text-gold-500" />
          Powered by Lexi AI with full contract context
        </div>
      </div>
    ),
  };

  return (
    <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-muted/50 text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">
            <Eye size={14} /> Live Preview
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-black text-foreground tracking-tight mb-4">
            See exactly what Lexi delivers
          </h2>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Real analysis output. This is what every contract review looks like.
          </p>
        </motion.div>

        <motion.div
          variants={scaleReveal}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          className="bg-card rounded-2xl sm:rounded-3xl border border-border shadow-elevated overflow-hidden max-w-5xl mx-auto"
        >
          <div className="flex flex-col md:flex-row">
            {/* Sidebar */}
            <div className="bg-navy-900 p-6 sm:p-7 w-full md:w-[260px] text-white shrink-0">
              <div className="text-navy-400 text-[10px] font-bold uppercase tracking-widest mb-3">
                Contract Analysis
              </div>
              <div className="font-bold mb-0.5">
                Vendor_Agreement_v2.pdf
              </div>
              <div className="text-navy-400 text-xs mb-6">
                24 pages · 2 min ago
              </div>
              <div className="space-y-2.5 mb-6">
                {[
                  { label: "Critical Issues", count: "5", color: "bg-red-500/20 text-red-400" },
                  { label: "Missing Clauses", count: "4", color: "bg-amber-500/20 text-amber-400" },
                  { label: "Recommendations", count: "6", color: "bg-gold-500/20 text-gold-400" },
                ].map((s) => (
                  <div key={s.label} className="flex items-center justify-between text-sm">
                    <span className="text-navy-300">{s.label}</span>
                    <span className={`font-bold px-2 py-0.5 rounded text-xs ${s.color}`}>{s.count}</span>
                  </div>
                ))}
              </div>
              <motion.a
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                href="https://app.lexireview.in/signup"
                className="block w-full py-2.5 bg-gold-500 hover:bg-gold-400 text-navy-900 rounded-xl font-bold text-sm transition-colors text-center"
              >
                Try It Yourself <ArrowUpRight size={14} className="inline ml-1" />
              </motion.a>
            </div>

            {/* Main */}
            <div className="p-6 sm:p-7 flex-1 min-w-0">
              <div className="flex gap-1 mb-5 overflow-x-auto pb-1">
                {tabs.map((t) => {
                  const Icon = t.icon;
                  return (
                    <button
                      key={t.id}
                      onClick={() => setTab(t.id)}
                      className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-all ${
                        tab === t.id
                          ? "bg-navy-900 text-white shadow-sm"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted"
                      }`}
                    >
                      <Icon size={14} /> {t.label}
                    </button>
                  );
                })}
              </div>
              <AnimatePresence mode="wait">
                <motion.div
                  key={tab}
                  variants={tabContentIn}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                >
                  {content[tab]}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// 7. HOW IT WORKS
// ═══════════════════════════════════════════════════════════════════════════

function HowItWorks() {
  const steps = [
    {
      num: "01",
      title: "Upload Your Contract",
      desc: "Drag & drop any PDF or Word document. Bank-grade encrypted from the moment it leaves your device.",
      icon: Upload,
      color: "from-navy-600 to-navy-800",
    },
    {
      num: "02",
      title: "Lexi Reads & Analyzes",
      desc: "AI reads every clause, maps the structure, checks against Indian law, and scores risks. ~45 seconds.",
      icon: FileSearch,
      color: "from-gold-500 to-gold-700",
    },
    {
      num: "03",
      title: "Review, Chat & Export",
      desc: "Interactive dashboard with risk scores, compliance status, AI chat, and exportable PDF reports.",
      icon: CheckCircle2,
      color: "from-emerald-500 to-emerald-700",
    },
  ];

  return (
    <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-muted/50 text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">
            <Zap size={14} /> Simple Process
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-black text-foreground tracking-tight mb-4">
            Three steps to peace of mind
          </h2>
          <p className="text-lg text-muted-foreground">
            Upload. Analyze. Act. It really is that simple.
          </p>
        </motion.div>

        <motion.div
          variants={staggerSlow}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 relative"
        >
          {/* Desktop connector */}
          <div className="hidden md:block absolute top-12 left-[20%] right-[20%] h-[2px] bg-gradient-to-r from-navy-200 via-gold-200 to-emerald-200" />

          {steps.map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={i}
                variants={itemFadeUp}
                className="relative flex flex-col items-center text-center"
              >
                <div
                  className={`relative w-24 h-24 rounded-2xl bg-gradient-to-br ${s.color} text-white flex items-center justify-center mb-6 shadow-lg`}
                >
                  <Icon size={32} />
                  <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-background border-2 border-border text-foreground text-xs font-black flex items-center justify-center shadow-sm">
                    {s.num}
                  </div>
                </div>
                <h3 className="text-xl font-heading font-bold text-foreground mb-3">
                  {s.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
                  {s.desc}
                </p>
              </motion.div>
            );
          })}
        </motion.div>

        {/* CTA */}
        <motion.div
          variants={fadeUpFast}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          className="text-center mt-14"
        >
          <motion.a
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.97 }}
            href="https://app.lexireview.in/signup"
            className="group inline-flex items-center bg-navy-900 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transition-shadow"
          >
            Try It Now — Free
            <ArrowRight
              size={18}
              className="ml-2 group-hover:translate-x-1 transition-transform"
            />
          </motion.a>
          <p className="text-sm text-muted-foreground mt-3">
            No credit card required
          </p>
        </motion.div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// 8. FINAL CTA
// ═══════════════════════════════════════════════════════════════════════════

function FinalCTA() {
  return (
    <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          variants={scaleReveal}
          initial="hidden"
          whileInView="visible"
          viewport={viewportEager}
          className="relative rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden bg-navy-900 text-center px-6 py-16 sm:py-20"
        >
          {/* Glow orbs */}
          <div className="absolute top-[-40%] left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-gold-500/15 rounded-full blur-[100px] pointer-events-none" />
          <motion.div
            variants={float(5, 15)}
            animate="animate"
            className="absolute top-8 left-10 text-navy-700/30"
          >
            <ShieldCheck size={48} />
          </motion.div>
          <motion.div
            variants={float(4, 10)}
            animate="animate"
            className="absolute bottom-10 right-14 text-navy-700/30"
          >
            <FileText size={40} />
          </motion.div>
          <motion.div
            variants={float(6, 12)}
            animate="animate"
            className="absolute top-16 right-24 text-navy-700/20"
          >
            <Scale size={36} />
          </motion.div>

          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-heading font-black text-white tracking-tight leading-[1]">
              Stop reviewing contracts{" "}
              <span className="text-gradient-gold">manually.</span>
            </h2>
            <p className="text-lg text-navy-300 font-medium max-w-lg mx-auto">
              Join hundreds of legal teams protecting their contracts with
              AI-powered analysis built for Indian law.
            </p>
            <div className="flex flex-col items-center gap-4 pt-2">
              <motion.a
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                href="https://app.lexireview.in/signup"
                className="group bg-white text-navy-900 text-lg font-bold py-4 px-10 rounded-2xl shadow-lg hover:shadow-xl transition-all inline-flex items-center"
              >
                Start Your Free Trial
                <ArrowRight
                  size={20}
                  className="ml-2 group-hover:translate-x-1 transition-transform"
                />
              </motion.a>
              <p className="text-navy-400 text-sm">
                3 free reviews · No credit card · 45 second setup
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// 9. FAQ SECTION
// ═══════════════════════════════════════════════════════════════════════════

function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          className="text-center mb-14"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-black text-foreground tracking-tight mb-4">
            Frequently asked questions
          </h2>
          <p className="text-lg text-muted-foreground">
            Everything you need to know about LexiReview.
          </p>
        </motion.div>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          className="max-w-3xl mx-auto space-y-3"
        >
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              variants={itemFadeUp}
              className="rounded-2xl border border-border bg-card overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="flex w-full items-center justify-between gap-4 p-5 text-left"
              >
                <span className="text-sm font-semibold text-foreground">
                  {faq.question}
                </span>
                <ChevronDown
                  className={`h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-300 ${
                    openIndex === i ? "rotate-180" : ""
                  }`}
                />
              </button>
              <AnimatePresence>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-5 text-sm leading-relaxed text-muted-foreground">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
