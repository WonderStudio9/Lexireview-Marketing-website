import type { ReactNode } from "react";
import { ShieldCheck, Lock, IndianRupee } from "lucide-react";

interface ToolLayoutProps {
  eyebrow?: string;
  title: string;
  subtitle: string;
  children: ReactNode;
  badges?: { label: string; value: string }[];
}

export function ToolLayout({
  eyebrow = "Free Tool",
  title,
  subtitle,
  children,
  badges,
}: ToolLayoutProps) {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-700 to-blue-900 px-4 pt-24 pb-16 text-white sm:px-6 sm:pt-32 sm:pb-20 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <span className="mb-4 inline-flex items-center rounded-full border border-white/25 bg-white/10 px-3 py-1 text-[11px] font-bold tracking-wider uppercase">
            {eyebrow}
          </span>
          <h1 className="font-heading text-3xl leading-tight font-bold sm:text-4xl md:text-5xl">
            {title}
          </h1>
          <p className="mt-4 max-w-2xl text-base text-blue-100 sm:text-lg">
            {subtitle}
          </p>

          <div className="mt-8 flex flex-wrap gap-3 text-xs text-blue-50">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1.5">
              <ShieldCheck size={14} /> Indian law aware
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1.5">
              <Lock size={14} /> Your data stays private
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1.5">
              <IndianRupee size={14} /> 100% Free
            </span>
          </div>

          {badges && badges.length > 0 ? (
            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {badges.map((b) => (
                <div
                  key={b.label}
                  className="rounded-lg border border-white/15 bg-white/5 px-3 py-2"
                >
                  <div className="font-heading text-lg font-bold text-white">
                    {b.value}
                  </div>
                  <div className="text-[11px] text-blue-100">{b.label}</div>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </section>

      {/* Main content */}
      <section className="px-4 py-10 sm:px-6 sm:py-16 lg:px-8">
        <div className="mx-auto max-w-5xl">{children}</div>
      </section>

      {/* Trust strip */}
      <section className="border-t border-slate-200 bg-white px-4 py-8 text-center text-xs text-slate-500 sm:px-6 lg:px-8">
        <p className="mx-auto max-w-2xl">
          This tool generates an informational template. It is not legal advice.
          For matters involving disputes or significant value, please consult a
          qualified Indian advocate.
        </p>
      </section>
    </div>
  );
}
