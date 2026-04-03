"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  ArrowRight,
  BarChart3,
  Lock,
  ArrowUpRight,
} from "lucide-react";
import {
  fadeUp,
  tabContentIn,
  stagger,
  itemFadeUp,
  viewport,
} from "@/lib/motion";

const plans = [
  {
    name: "Free Trial",
    price: "0",
    period: "",
    reviews: "3/mo",
    features: [
      "3 Contract Reviews",
      "Basic Risk Analysis",
      "Risk Scoring 0-100",
      "Email Support",
    ],
    cta: "Start Free",
    recommended: false,
  },
  {
    name: "Starter",
    price: "4,999",
    period: "/mo",
    reviews: "25/mo",
    features: [
      "25 Reviews/mo",
      "All Playbooks",
      "Quick Triage",
      "API Access",
      "Chat Support",
      "3 Users",
    ],
    cta: "Get Started",
    recommended: false,
  },
  {
    name: "Professional",
    price: "14,999",
    period: "/mo",
    reviews: "100/mo",
    features: [
      "100 Reviews/mo",
      "Custom Playbooks",
      "Deep Analysis + Batch",
      "Full API Access",
      "Compliance Certificates",
      "Priority Support",
      "10 Users",
    ],
    cta: "Start Professional",
    recommended: true,
  },
  {
    name: "Business",
    price: "34,999",
    period: "/mo",
    reviews: "500/mo",
    features: [
      "500 Reviews/mo",
      "Everything in Pro",
      "Matter Workspaces",
      "White-Label Reports",
      "Webhooks",
      "Account Manager",
      "50 Users",
    ],
    cta: "Contact Sales",
    recommended: false,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    reviews: "Unlimited",
    features: [
      "Unlimited Reviews",
      "Everything in Business",
      "On-Premise Deploy",
      "Custom AI Training",
      "99.9% SLA",
      "Unlimited Users",
    ],
    cta: "Contact Sales",
    recommended: false,
  },
];

const credits = [
  { name: "Small Contract", detail: "1-10 pages", price: "299" },
  { name: "Medium Contract", detail: "11-30 pages", price: "499" },
  { name: "Large Contract", detail: "31-75 pages", price: "799" },
  { name: "Enterprise Contract", detail: "76+ pages", price: "1,499" },
  { name: "Quick Triage", detail: "Any size", price: "99" },
  { name: "Compliance Cert", detail: "Per certificate", price: "199" },
  { name: "Batch (10 contracts)", detail: "Bulk discount", price: "3,999" },
];

export default function PricingPage() {
  const [mode, setMode] = useState<"plans" | "credits">("plans");

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Product",
        name: "LexiReview",
        description: "AI-powered contract review platform for Indian law",
        brand: { "@type": "Brand", name: "LexiDraft Technologies" },
        offers: [
          { "@type": "Offer", name: "Free Trial", price: "0", priceCurrency: "INR", url: "https://app.lexireview.in", availability: "https://schema.org/InStock" },
          { "@type": "Offer", name: "Starter", price: "4999", priceCurrency: "INR", url: "https://app.lexireview.in", availability: "https://schema.org/InStock", priceValidUntil: "2026-12-31" },
          { "@type": "Offer", name: "Professional", price: "14999", priceCurrency: "INR", url: "https://app.lexireview.in", availability: "https://schema.org/InStock", priceValidUntil: "2026-12-31" },
          { "@type": "Offer", name: "Business", price: "34999", priceCurrency: "INR", url: "https://app.lexireview.in", availability: "https://schema.org/InStock", priceValidUntil: "2026-12-31" },
        ],
        aggregateRating: { "@type": "AggregateRating", ratingValue: "4.8", ratingCount: "150", bestRating: "5" },
      }) }} />
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
            <BarChart3 size={14} className="text-gold-500" /> Transparent Pricing
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl sm:text-5xl lg:text-6xl font-heading font-black tracking-[-0.03em] text-foreground mb-6"
          >
            Choose the plan that{" "}
            <span className="text-gradient-navy">protects your practice</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-lg sm:text-xl text-muted-foreground"
          >
            Start free. Scale when you&apos;re ready. Cancel anytime.
          </motion.p>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="pb-20 sm:pb-28 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Toggle */}
          <div className="flex justify-center mb-10">
            <div className="bg-card rounded-xl p-1 border border-border shadow-sm inline-flex">
              {(["plans", "credits"] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className={`px-6 py-2.5 rounded-lg font-bold text-sm transition-all ${
                    mode === m
                      ? "bg-navy-900 text-white shadow-md"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {m === "plans" ? "Monthly Plans" : "Pay As You Go"}
                </button>
              ))}
            </div>
          </div>

          <AnimatePresence mode="wait">
            {mode === "plans" && (
              <motion.div
                key="plans"
                variants={tabContentIn}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                  {plans.map((p) => (
                    <div
                      key={p.name}
                      className={`relative p-5 sm:p-6 rounded-2xl flex flex-col transition-all duration-300 hover:-translate-y-1 ${
                        p.recommended
                          ? "bg-navy-900 text-white shadow-xl ring-2 ring-gold-400 lg:scale-[1.04] z-10"
                          : "bg-card border border-border hover:shadow-card-hover card-3d"
                      }`}
                    >
                      {p.recommended && (
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gold-500 text-navy-900 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider">
                          Most Popular
                        </div>
                      )}
                      <h3 className="font-heading font-bold text-base mb-1">
                        {p.name}
                      </h3>
                      <div
                        className={`text-2xl font-black mb-0.5 ${
                          p.recommended ? "" : "text-foreground"
                        }`}
                      >
                        {p.price === "Custom" ? "Custom" : `₹${p.price}`}
                        {p.period && (
                          <span
                            className={`text-xs font-medium ${
                              p.recommended
                                ? "text-navy-400"
                                : "text-muted-foreground"
                            }`}
                          >
                            {p.period}
                          </span>
                        )}
                      </div>
                      <p
                        className={`text-xs mb-4 ${
                          p.recommended
                            ? "text-navy-300"
                            : "text-muted-foreground"
                        }`}
                      >
                        {p.reviews} reviews
                      </p>
                      <ul
                        className={`mb-5 space-y-1.5 text-xs flex-1 ${
                          p.recommended
                            ? "text-navy-200"
                            : "text-muted-foreground"
                        }`}
                      >
                        {p.features.map((f) => (
                          <li key={f} className="flex gap-1.5">
                            <CheckCircle2
                              size={13}
                              className={`shrink-0 mt-0.5 ${
                                p.recommended
                                  ? "text-gold-400"
                                  : "text-emerald-500"
                              }`}
                            />{" "}
                            {f}
                          </li>
                        ))}
                      </ul>
                      <a
                        href={
                          p.price === "Custom" || p.name === "Business"
                            ? "mailto:sales@lexireview.in"
                            : "https://app.lexireview.in"
                        }
                        className={`w-full py-2.5 rounded-xl font-bold text-sm transition-all text-center block ${
                          p.recommended
                            ? "bg-gold-500 text-navy-900 hover:bg-gold-400"
                            : "border-2 border-border hover:border-navy-800 hover:bg-navy-50"
                        }`}
                      >
                        {p.cta}
                      </a>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {mode === "credits" && (
              <motion.div
                key="credits"
                variants={tabContentIn}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
                  {credits.map((c, i) => (
                    <div
                      key={c.name}
                      className={`p-5 rounded-2xl bg-card border border-border hover:shadow-card-hover card-3d transition-all ${
                        i === 1 ? "ring-2 ring-gold-400" : ""
                      }`}
                    >
                      <h3 className="font-heading font-bold text-sm mb-0.5">
                        {c.name}
                      </h3>
                      <p className="text-xs text-muted-foreground mb-3">
                        {c.detail}
                      </p>
                      <div className="text-2xl font-black text-foreground mb-4">
                        ₹{c.price}
                        <span className="text-xs font-medium text-muted-foreground">
                          {" "}
                          one-time
                        </span>
                      </div>
                      <a
                        href="https://app.lexireview.in"
                        className="block w-full py-2 rounded-lg font-bold text-sm border-2 border-border hover:border-navy-800 hover:bg-navy-50 transition-colors text-center"
                      >
                        Buy Now
                      </a>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-10 flex flex-col items-center gap-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Lock size={14} className="text-emerald-500" />
              30-day money-back guarantee · No credit card for free trial ·
              Cancel anytime
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
