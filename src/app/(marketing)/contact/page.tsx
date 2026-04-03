"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Send,
  Mail,
  Phone,
  MapPin,
  ArrowRight,
  MessageSquare,
} from "lucide-react";
import { fadeUp, stagger, itemFadeUp, viewport } from "@/lib/motion";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

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
            <MessageSquare size={14} className="text-gold-500" /> Get in Touch
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl sm:text-5xl lg:text-6xl font-heading font-black tracking-[-0.03em] text-foreground mb-6"
          >
            Let&apos;s <span className="text-gradient-navy">talk</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-lg sm:text-xl text-muted-foreground max-w-xl mx-auto"
          >
            Whether you need a demo, have a question, or want to discuss
            enterprise pricing — we&apos;re here.
          </motion.p>
        </div>
      </section>

      {/* Contact Form + Info */}
      <section className="pb-20 sm:pb-28 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
            {/* Form */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={viewport}
              className="lg:col-span-3"
            >
              <div className="bg-card rounded-2xl border border-border p-6 sm:p-8 shadow-elevated">
                {submitted ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-500 flex items-center justify-center mx-auto mb-6">
                      <Send size={28} />
                    </div>
                    <h3 className="text-2xl font-heading font-bold text-foreground mb-3">
                      Message sent!
                    </h3>
                    <p className="text-muted-foreground max-w-sm mx-auto">
                      We&apos;ll get back to you within 24 hours. In the
                      meantime, feel free to explore our platform.
                    </p>
                    <a
                      href="https://app.lexireview.in"
                      className="inline-flex items-center gap-2 mt-6 bg-navy-900 text-white px-6 py-3 rounded-xl font-bold text-sm"
                    >
                      Try LexiReview Free <ArrowRight size={14} />
                    </a>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-foreground mb-1.5">
                          Full Name
                        </label>
                        <input
                          type="text"
                          required
                          className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500/20 focus:border-navy-500 transition-all"
                          placeholder="Your name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-foreground mb-1.5">
                          Work Email
                        </label>
                        <input
                          type="email"
                          required
                          className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500/20 focus:border-navy-500 transition-all"
                          placeholder="you@company.com"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-foreground mb-1.5">
                          Company
                        </label>
                        <input
                          type="text"
                          className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500/20 focus:border-navy-500 transition-all"
                          placeholder="Company name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-foreground mb-1.5">
                          Interest
                        </label>
                        <select className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500/20 focus:border-navy-500 transition-all">
                          <option>Book a Demo</option>
                          <option>Enterprise Pricing</option>
                          <option>Partnership</option>
                          <option>General Question</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-foreground mb-1.5">
                        Message
                      </label>
                      <textarea
                        rows={4}
                        required
                        className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500/20 focus:border-navy-500 transition-all resize-none"
                        placeholder="Tell us about your needs..."
                      />
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.02, y: -1 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      className="group w-full bg-navy-900 text-white py-3.5 rounded-xl font-bold text-sm transition-colors hover:bg-navy-800 flex items-center justify-center gap-2"
                    >
                      Send Message
                      <Send
                        size={14}
                        className="group-hover:translate-x-0.5 transition-transform"
                      />
                    </motion.button>
                  </form>
                )}
              </div>
            </motion.div>

            {/* Contact Info */}
            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="visible"
              viewport={viewport}
              className="lg:col-span-2 space-y-6"
            >
              {[
                {
                  icon: Mail,
                  title: "Email",
                  detail: "contact@lexireview.in",
                  href: "mailto:contact@lexireview.in",
                },
                {
                  icon: Phone,
                  title: "Sales",
                  detail: "sales@lexireview.in",
                  href: "mailto:sales@lexireview.in",
                },
                {
                  icon: MapPin,
                  title: "Office",
                  detail: "India",
                  href: null,
                },
              ].map((item, i) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={i}
                    variants={itemFadeUp}
                    className="bg-card rounded-2xl border border-border p-5 card-3d"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-navy-50 text-navy-600 flex items-center justify-center shrink-0">
                        <Icon size={18} />
                      </div>
                      <div>
                        <h3 className="font-heading font-bold text-sm text-foreground">
                          {item.title}
                        </h3>
                        {item.href ? (
                          <a
                            href={item.href}
                            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                          >
                            {item.detail}
                          </a>
                        ) : (
                          <p className="text-sm text-muted-foreground">
                            {item.detail}
                          </p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}

              <motion.div
                variants={itemFadeUp}
                className="bg-navy-900 rounded-2xl p-6 text-white"
              >
                <h3 className="font-heading font-bold text-lg mb-2">
                  Book a Live Demo
                </h3>
                <p className="text-navy-300 text-sm mb-4 leading-relaxed">
                  See LexiReview analyze a real contract in under 60 seconds.
                  Our team will walk you through every feature.
                </p>
                <a
                  href="https://app.lexireview.in"
                  className="inline-flex items-center gap-2 bg-gold-500 text-navy-900 px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-gold-400 transition-colors"
                >
                  Schedule Demo <ArrowRight size={14} />
                </a>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}
