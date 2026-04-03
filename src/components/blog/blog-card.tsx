import Link from "next/link";
import { Clock, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

export interface BlogCardProps {
  slug: string;
  title: string;
  excerpt: string;
  cluster: string;
  publishedAt: string;
  readingTime: string;
}

const CLUSTER_COLORS: Record<string, string> = {
  "RBI Compliance": "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  "DPDP Act": "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
  "AI Contract Review": "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300",
  "Financial Services CLM": "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
  "ICA Compliance": "bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300",
  Comparisons: "bg-slate-100 text-slate-800 dark:bg-slate-900/30 dark:text-slate-300",
};

export function BlogCard({
  slug,
  title,
  excerpt,
  cluster,
  publishedAt,
  readingTime,
}: BlogCardProps) {
  const formattedDate = new Date(publishedAt).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  const clusterColor =
    CLUSTER_COLORS[cluster] ??
    "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300";

  return (
    <Link href={`/blog/${slug}`} className="group block">
      <article
        className={cn(
          "flex h-full flex-col rounded-xl border border-foreground/10 bg-card p-5 transition-all",
          "hover:border-primary/30 hover:shadow-md"
        )}
      >
        {/* Cluster badge */}
        <span
          className={cn(
            "mb-3 inline-flex w-fit items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
            clusterColor
          )}
        >
          {cluster}
        </span>

        {/* Title */}
        <h2 className="mb-2 text-lg font-semibold leading-snug text-foreground group-hover:text-primary transition-colors line-clamp-2">
          {title}
        </h2>

        {/* Excerpt */}
        <p className="mb-4 flex-1 text-sm leading-relaxed text-muted-foreground line-clamp-3">
          {excerpt}
        </p>

        {/* Meta row */}
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <Calendar className="size-3.5" />
            {formattedDate}
          </span>
          <span className="inline-flex items-center gap-1">
            <Clock className="size-3.5" />
            {readingTime}
          </span>
        </div>
      </article>
    </Link>
  );
}
