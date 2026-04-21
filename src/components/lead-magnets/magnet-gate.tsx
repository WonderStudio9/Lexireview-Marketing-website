"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Download, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { captureLead } from "@/lib/tools/capture-lead";

const schema = z.object({
  email: z.string().email("Please enter a valid email"),
  firstName: z.string().min(1, "First name is required"),
});

type FormValues = z.infer<typeof schema>;

interface MagnetGateProps {
  magnetSlug: string;
  icp: string;
  title: string;
  description: string;
  previewBullets: string[];
  pages: number;
  onUnlocked: () => void;
}

export function MagnetGate({
  magnetSlug,
  icp,
  title,
  description,
  previewBullets,
  pages,
  onUnlocked,
}: MagnetGateProps) {
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  async function onSubmit(values: FormValues) {
    setSubmitting(true);
    setError(null);
    try {
      const result = await captureLead({
        email: values.email,
        firstName: values.firstName,
        icp,
        source: "ORGANIC_LANDING",
        firstTouchUrl:
          typeof window !== "undefined" ? window.location.href : "",
        sourceDetail: `lead-magnet:${magnetSlug}`,
      });
      if (!result.leadId) throw new Error("Capture failed");

      // Record the magnet download
      await fetch("/api/lead-magnets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leadId: result.leadId, slug: magnetSlug }),
      }).catch(() => {
        // Non-blocking
      });

      // Set localStorage so refresh doesn't re-gate
      try {
        localStorage.setItem(`magnet:${magnetSlug}`, "unlocked");
      } catch {
        // ignore
      }

      onUnlocked();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save your email");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-xl mx-auto rounded-2xl bg-white ring-1 ring-slate-200 shadow-lg p-8 sm:p-10">
      <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-3 py-1 rounded-full mb-4">
        <Download size={14} /> {pages}-Page Guide — Free
      </div>
      <h2 className="text-2xl sm:text-3xl font-heading font-black text-slate-900 mb-3 tracking-tight">
        {title}
      </h2>
      <p className="text-slate-600 mb-6 leading-relaxed">{description}</p>

      {previewBullets.length > 0 && (
        <>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">
            What's inside
          </p>
          <ul className="space-y-2 mb-8 text-sm text-slate-700">
            {previewBullets.map((b, i) => (
              <li key={i} className="flex gap-2">
                <span className="mt-1 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-blue-600" />
                {b}
              </li>
            ))}
          </ul>
        </>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="text-xs font-medium text-slate-700 mb-1 block">
            First name
          </label>
          <Input
            {...register("firstName")}
            placeholder="Priya"
            className="h-11"
          />
          {errors.firstName && (
            <p className="mt-1 text-xs text-red-600">
              {errors.firstName.message}
            </p>
          )}
        </div>
        <div>
          <label className="text-xs font-medium text-slate-700 mb-1 block">
            Work email
          </label>
          <Input
            {...register("email")}
            type="email"
            placeholder="priya@yourfirm.in"
            className="h-11"
          />
          {errors.email && (
            <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>
          )}
        </div>

        {error && (
          <p className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-md p-3">
            {error}
          </p>
        )}

        <Button
          type="submit"
          disabled={submitting}
          className="w-full h-11 bg-blue-700 hover:bg-blue-800 text-white font-semibold"
        >
          {submitting ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <>
              <Mail size={16} /> Unlock the guide
            </>
          )}
        </Button>

        <p className="text-[11px] text-slate-500 text-center">
          No spam. Unsubscribe anytime. Your email stays with us — never shared.
        </p>
      </form>
    </div>
  );
}
