"use client";

import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, Loader2 } from "lucide-react";

interface LeadFormProps {
  source: string;
  icp: string;
  heading?: string;
  subheading?: string;
  ctaLabel?: string;
  placeholder?: string;
  successMessage?: string;
  variant?: "inline" | "card" | "dark";
  showNameField?: boolean;
}

export function LeadForm({
  source,
  icp,
  heading,
  subheading,
  ctaLabel = "Get it free",
  placeholder = "you@company.com",
  successMessage = "Check your inbox. We just sent you a link.",
  variant = "card",
  showNameField = false,
}: LeadFormProps) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle",
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");
    setErrorMessage(null);
    try {
      const firstTouchUrl =
        typeof window !== "undefined" ? window.location.href : "";
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          name: name || undefined,
          source,
          icp,
          firstTouchUrl,
        }),
      });
      if (!res.ok) {
        throw new Error(`Request failed: ${res.status}`);
      }
      setStatus("success");
      setEmail("");
      setName("");
    } catch (err) {
      setStatus("error");
      setErrorMessage(
        err instanceof Error ? err.message : "Something went wrong. Please try again.",
      );
    }
  };

  const isDark = variant === "dark";
  const wrapperClass =
    variant === "inline"
      ? ""
      : isDark
        ? "rounded-3xl bg-navy-900 text-white p-8 sm:p-10 shadow-elevated"
        : "rounded-3xl bg-white border border-border shadow-premium p-8 sm:p-10";

  return (
    <div className={wrapperClass}>
      {heading && (
        <h3
          className={`font-heading font-black text-2xl sm:text-3xl tracking-tight mb-3 ${
            isDark ? "text-white" : "text-foreground"
          }`}
        >
          {heading}
        </h3>
      )}
      {subheading && (
        <p
          className={`text-base leading-relaxed mb-6 ${
            isDark ? "text-navy-200" : "text-muted-foreground"
          }`}
        >
          {subheading}
        </p>
      )}

      {status === "success" ? (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className={`flex items-start gap-3 rounded-xl p-4 ${
            isDark ? "bg-white/10 text-white" : "bg-emerald-50 text-emerald-800"
          }`}
        >
          <CheckCircle2
            size={20}
            className={isDark ? "text-emerald-300 shrink-0 mt-0.5" : "text-emerald-600 shrink-0 mt-0.5"}
          />
          <div className="text-sm font-medium">{successMessage}</div>
        </motion.div>
      ) : (
        <form onSubmit={onSubmit} className="space-y-3">
          {showNameField && (
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className={`w-full h-12 rounded-xl px-4 text-sm font-medium outline-none transition-colors border ${
                isDark
                  ? "bg-white/10 border-white/20 text-white placeholder-white/60 focus:border-white/40"
                  : "bg-white border-border text-foreground placeholder-muted-foreground focus:border-blue-500"
              }`}
            />
          )}
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={placeholder}
              className={`flex-1 h-12 rounded-xl px-4 text-sm font-medium outline-none transition-colors border ${
                isDark
                  ? "bg-white/10 border-white/20 text-white placeholder-white/60 focus:border-white/40"
                  : "bg-white border-border text-foreground placeholder-muted-foreground focus:border-blue-500"
              }`}
            />
            <motion.button
              type="submit"
              disabled={status === "loading"}
              whileHover={{ scale: status === "loading" ? 1 : 1.02 }}
              whileTap={{ scale: status === "loading" ? 1 : 0.98 }}
              className={`h-12 px-6 rounded-xl font-bold text-sm inline-flex items-center justify-center gap-2 transition-all disabled:opacity-70 disabled:cursor-not-allowed ${
                isDark
                  ? "bg-white text-navy-900 hover:bg-white/90"
                  : "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg hover:shadow-xl"
              }`}
            >
              {status === "loading" ? (
                <>
                  <Loader2 size={16} className="animate-spin" /> Sending...
                </>
              ) : (
                <>
                  {ctaLabel}
                  <ArrowRight size={16} />
                </>
              )}
            </motion.button>
          </div>
          {status === "error" && (
            <p className={`text-xs font-medium ${isDark ? "text-red-300" : "text-red-600"}`}>
              {errorMessage ?? "Couldn’t submit. Please try again."}
            </p>
          )}
          <p className={`text-xs ${isDark ? "text-white/60" : "text-muted-foreground"}`}>
            By subscribing you agree to our privacy policy. No spam, unsubscribe anytime.
          </p>
        </form>
      )}
    </div>
  );
}
