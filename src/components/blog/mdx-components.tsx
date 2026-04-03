import { cn } from "@/lib/utils";
import { Link as LinkIcon, Info, AlertTriangle, Lightbulb, ArrowRight } from "lucide-react";
import { APP_URL } from "@/lib/seo";

// ── Heading with anchor link ────────────────────────────────────────────────

function createHeading(level: 1 | 2 | 3 | 4 | 5 | 6) {
  const Tag = `h${level}` as const;
  const sizes: Record<number, string> = {
    1: "text-3xl sm:text-4xl font-bold mt-10 mb-4",
    2: "text-2xl sm:text-3xl font-bold mt-8 mb-3",
    3: "text-xl sm:text-2xl font-semibold mt-6 mb-2",
    4: "text-lg sm:text-xl font-semibold mt-5 mb-2",
    5: "text-base font-semibold mt-4 mb-1",
    6: "text-sm font-semibold mt-4 mb-1",
  };

  function Heading({ children, ...props }: React.ComponentProps<"h1">) {
    const id =
      props.id ??
      (typeof children === "string"
        ? children
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "")
        : undefined);

    return (
      <Tag
        id={id}
        className={cn("group scroll-mt-24 text-foreground", sizes[level])}
        {...props}
      >
        {children}
        {id && (
          <a
            href={`#${id}`}
            className="ml-2 inline-block text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100"
            aria-label={`Link to ${typeof children === "string" ? children : "section"}`}
          >
            <LinkIcon className="size-4" />
          </a>
        )}
      </Tag>
    );
  }

  Heading.displayName = `Heading${level}`;
  return Heading;
}

// ── Callout / Alert ─────────────────────────────────────────────────────────

type CalloutVariant = "info" | "warning" | "tip";

const calloutConfig: Record<
  CalloutVariant,
  { icon: typeof Info; border: string; bg: string; iconColor: string }
> = {
  info: {
    icon: Info,
    border: "border-blue-300 dark:border-blue-700",
    bg: "bg-blue-50 dark:bg-blue-950/30",
    iconColor: "text-blue-600 dark:text-blue-400",
  },
  warning: {
    icon: AlertTriangle,
    border: "border-amber-300 dark:border-amber-700",
    bg: "bg-amber-50 dark:bg-amber-950/30",
    iconColor: "text-amber-600 dark:text-amber-400",
  },
  tip: {
    icon: Lightbulb,
    border: "border-emerald-300 dark:border-emerald-700",
    bg: "bg-emerald-50 dark:bg-emerald-950/30",
    iconColor: "text-emerald-600 dark:text-emerald-400",
  },
};

function Callout({
  variant = "info",
  title,
  children,
}: {
  variant?: CalloutVariant;
  title?: string;
  children: React.ReactNode;
}) {
  const config = calloutConfig[variant];
  const Icon = config.icon;

  return (
    <div
      className={cn(
        "my-6 flex gap-3 rounded-lg border-l-4 p-4",
        config.border,
        config.bg
      )}
    >
      <Icon className={cn("mt-0.5 size-5 shrink-0", config.iconColor)} />
      <div className="min-w-0">
        {title && (
          <p className="mb-1 font-semibold text-foreground">{title}</p>
        )}
        <div className="text-sm text-foreground/80 [&>p]:mb-2 [&>p:last-child]:mb-0">
          {children}
        </div>
      </div>
    </div>
  );
}

// ── Key Takeaway box ────────────────────────────────────────────────────────

function KeyTakeaway({ children }: { children: React.ReactNode }) {
  return (
    <div className="my-6 rounded-xl border-2 border-primary/30 bg-primary/5 p-5">
      <p className="mb-2 text-xs font-bold uppercase tracking-wider text-primary">
        Key Takeaway
      </p>
      <div className="text-base font-medium leading-relaxed text-foreground [&>p]:mb-2 [&>p:last-child]:mb-0">
        {children}
      </div>
    </div>
  );
}

// ── FAQ Item ────────────────────────────────────────────────────────────────

function FAQItem({
  question,
  children,
}: {
  question: string;
  children: React.ReactNode;
}) {
  return (
    <details className="group my-3 rounded-lg border border-foreground/10 bg-card">
      <summary className="flex cursor-pointer items-center justify-between px-4 py-3 font-medium text-foreground transition-colors hover:text-primary">
        {question}
        <span className="ml-2 text-muted-foreground transition-transform group-open:rotate-180">
          &#9662;
        </span>
      </summary>
      <div className="border-t border-foreground/10 px-4 py-3 text-sm text-muted-foreground [&>p]:mb-2 [&>p:last-child]:mb-0">
        {children}
      </div>
    </details>
  );
}

// ── Inline CTA ──────────────────────────────────────────────────────────────

function InlineCTA({
  label = "Try LexiReview Free",
  href = `${APP_URL}/signup`,
}: {
  label?: string;
  href?: string;
}) {
  return (
    <a
      href={href}
      className="my-4 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
    >
      {label}
      <ArrowRight className="size-4" />
    </a>
  );
}

// ── Code block ──────────────────────────────────────────────────────────────

function CodeBlock({ children, className, ...props }: React.ComponentProps<"code">) {
  const isInline = !className;

  if (isInline) {
    return (
      <code
        className="rounded bg-muted px-1.5 py-0.5 text-sm font-mono text-foreground"
        {...props}
      >
        {children}
      </code>
    );
  }

  return (
    <code
      className={cn("block text-sm", className)}
      {...props}
    >
      {children}
    </code>
  );
}

function Pre({ children, ...props }: React.ComponentProps<"pre">) {
  return (
    <pre
      className="my-6 overflow-x-auto rounded-lg border border-foreground/10 bg-muted p-4 text-sm leading-relaxed"
      {...props}
    >
      {children}
    </pre>
  );
}

// ── Styled table ────────────────────────────────────────────────────────────

function Table({ children, ...props }: React.ComponentProps<"table">) {
  return (
    <div className="my-6 overflow-x-auto rounded-lg border border-foreground/10">
      <table className="w-full text-sm" {...props}>
        {children}
      </table>
    </div>
  );
}

function Thead({ children, ...props }: React.ComponentProps<"thead">) {
  return (
    <thead className="border-b border-foreground/10 bg-muted/50" {...props}>
      {children}
    </thead>
  );
}

function Th({ children, ...props }: React.ComponentProps<"th">) {
  return (
    <th
      className="px-4 py-2.5 text-left font-semibold text-foreground"
      {...props}
    >
      {children}
    </th>
  );
}

function Td({ children, ...props }: React.ComponentProps<"td">) {
  return (
    <td
      className="border-t border-foreground/5 px-4 py-2.5 text-muted-foreground"
      {...props}
    >
      {children}
    </td>
  );
}

// ── Paragraph & list styling ────────────────────────────────────────────────

function P({ children, ...props }: React.ComponentProps<"p">) {
  return (
    <p className="mb-4 leading-7 text-foreground/85" {...props}>
      {children}
    </p>
  );
}

function Ul({ children, ...props }: React.ComponentProps<"ul">) {
  return (
    <ul className="my-4 ml-6 list-disc space-y-1 text-foreground/85 marker:text-primary/50" {...props}>
      {children}
    </ul>
  );
}

function Ol({ children, ...props }: React.ComponentProps<"ol">) {
  return (
    <ol className="my-4 ml-6 list-decimal space-y-1 text-foreground/85 marker:text-primary/50" {...props}>
      {children}
    </ol>
  );
}

function Li({ children, ...props }: React.ComponentProps<"li">) {
  return (
    <li className="leading-7" {...props}>
      {children}
    </li>
  );
}

function Blockquote({ children, ...props }: React.ComponentProps<"blockquote">) {
  return (
    <blockquote
      className="my-6 border-l-4 border-primary/40 pl-4 italic text-muted-foreground"
      {...props}
    >
      {children}
    </blockquote>
  );
}

function Hr(props: React.ComponentProps<"hr">) {
  return <hr className="my-8 border-foreground/10" {...props} />;
}

function Anchor({ children, ...props }: React.ComponentProps<"a">) {
  return (
    <a
      className="font-medium text-primary underline underline-offset-4 hover:text-primary/80"
      {...props}
    >
      {children}
    </a>
  );
}

// ── Exported components map ─────────────────────────────────────────────────

export const mdxComponents = {
  h1: createHeading(1),
  h2: createHeading(2),
  h3: createHeading(3),
  h4: createHeading(4),
  h5: createHeading(5),
  h6: createHeading(6),
  p: P,
  a: Anchor,
  ul: Ul,
  ol: Ol,
  li: Li,
  blockquote: Blockquote,
  hr: Hr,
  code: CodeBlock,
  pre: Pre,
  table: Table,
  thead: Thead,
  th: Th,
  td: Td,
  Callout,
  KeyTakeaway,
  FAQItem,
  InlineCTA,
};
