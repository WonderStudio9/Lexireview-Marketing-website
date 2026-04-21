import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { ArrowRight } from "lucide-react";

export interface ToolCardProps {
  href: string;
  title: string;
  description: string;
  icon: LucideIcon;
  badge?: string;
  icp?: string;
}

export function ToolCard({
  href,
  title,
  description,
  icon: Icon,
  badge,
  icp,
}: ToolCardProps) {
  return (
    <Link
      href={href}
      className="group relative block rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-1 hover:border-blue-300 hover:shadow-lg"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 text-white">
          <Icon size={20} />
        </div>
        {badge ? (
          <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold tracking-wider text-emerald-700 uppercase">
            {badge}
          </span>
        ) : null}
      </div>

      <h3 className="font-heading mt-4 text-lg font-semibold text-slate-900">
        {title}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-slate-600">
        {description}
      </p>

      <div className="mt-5 flex items-center justify-between text-sm">
        {icp ? (
          <span className="text-xs tracking-wide text-slate-400 uppercase">
            {icp}
          </span>
        ) : (
          <span />
        )}
        <span className="inline-flex items-center gap-1 font-medium text-blue-700 group-hover:gap-2 transition-all">
          Use tool <ArrowRight size={14} />
        </span>
      </div>
    </Link>
  );
}
