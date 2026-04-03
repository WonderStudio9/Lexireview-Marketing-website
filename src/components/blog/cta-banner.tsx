import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { APP_URL } from "@/lib/seo";

interface CTABannerProps {
  heading?: string;
  description?: string;
  primaryLabel?: string;
  primaryHref?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
}

export function CTABanner({
  heading = "Ready to automate your contract workflows?",
  description = "Join leading Indian legal teams using LexiReview to streamline compliance, reduce risk, and close contracts faster.",
  primaryLabel = "Start Free Trial",
  primaryHref = `${APP_URL}/signup`,
  secondaryLabel = "Book a Demo",
  secondaryHref = "/contact",
}: CTABannerProps) {
  return (
    <section className="mt-12 rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/20 px-6 py-10 text-center sm:px-10">
      <h2 className="mb-3 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
        {heading}
      </h2>
      <p className="mx-auto mb-6 max-w-xl text-muted-foreground">
        {description}
      </p>
      <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
        <Link
          href={primaryHref}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          {primaryLabel}
          <ArrowRight className="size-4" />
        </Link>
        <Link
          href={secondaryHref}
          className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
        >
          {secondaryLabel}
        </Link>
      </div>
    </section>
  );
}
