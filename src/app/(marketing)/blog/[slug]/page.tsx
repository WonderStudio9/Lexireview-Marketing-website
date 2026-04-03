import type { Metadata, ResolvingMetadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import readingTime from "reading-time";

export const dynamic = "force-dynamic";
import { ChevronRight, Calendar, Clock, User } from "lucide-react";

import { prisma } from "@/lib/db";
import {
  generatePageMetadata,
  generateArticleSchema,
  generateFAQSchema,
  generateBreadcrumbSchema,
  generateOrganizationSchema,
  SITE_URL,
  SITE_NAME,
  type FAQItem,
} from "@/lib/seo";
import { mdxComponents } from "@/components/blog/mdx-components";
import { TableOfContents, type TOCHeading } from "@/components/blog/table-of-contents";
import { BlogCard } from "@/components/blog/blog-card";
import { CTABanner } from "@/components/blog/cta-banner";

// ── Types ────────────────────────────────────────────────────────────────────

type Props = {
  params: Promise<{ slug: string }>;
};

// ── Heading extraction ──────────────────────────────────────────────────────

function extractHeadings(mdx: string): TOCHeading[] {
  const headingRegex = /^(#{2,4})\s+(.+)$/gm;
  const headings: TOCHeading[] = [];
  let match;

  while ((match = headingRegex.exec(mdx)) !== null) {
    const level = match[1].length;
    const text = match[2].replace(/[*`\[\]()]/g, "").trim();
    const id = text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    headings.push({ id, text, level });
  }

  return headings;
}

// ── FAQ extraction (from MDX FAQItem components) ────────────────────────────

function extractFAQs(mdx: string): FAQItem[] {
  const faqRegex = /<FAQItem\s+question="([^"]+)"[^>]*>([\s\S]*?)<\/FAQItem>/g;
  const faqs: FAQItem[] = [];
  let match;

  while ((match = faqRegex.exec(mdx)) !== null) {
    faqs.push({
      question: match[1],
      answer: match[2].replace(/<[^>]+>/g, "").trim(),
    });
  }

  return faqs;
}

// ── Metadata ────────────────────────────────────────────────────────────────

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { slug } = await params;

  const post = await prisma.publishedContent.findUnique({
    where: { slug },
    include: { brief: { select: { cluster: true, keywords: true } } },
  });

  if (!post) {
    return generatePageMetadata({
      title: "Post Not Found | " + SITE_NAME,
      description: "The requested blog post could not be found.",
      path: `/blog/${slug}`,
      noIndex: true,
    });
  }

  return generatePageMetadata({
    title: post.metaTitle || post.title,
    description:
      post.metaDesc ||
      post.bodyMdx.replace(/[#*`>\[\]()_~\-]/g, "").slice(0, 155).trimEnd(),
    path: `/blog/${slug}`,
    ogImage: post.ogImage || undefined,
    ogType: "article",
    publishedTime: post.publishedAt.toISOString(),
    modifiedTime: post.updatedAt.toISOString(),
    keywords: post.brief.keywords,
    authors: ["LexiReview Editorial Team"],
  });
}

// ── Page component ──────────────────────────────────────────────────────────

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;

  const post = await prisma.publishedContent.findUnique({
    where: { slug },
    include: { brief: { select: { cluster: true, keywords: true } } },
  });

  if (!post) {
    notFound();
  }

  const headings = extractHeadings(post.bodyMdx);
  const faqs = extractFAQs(post.bodyMdx);
  const stats = readingTime(post.bodyMdx);

  const formattedDate = post.publishedAt.toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Fetch related posts (same cluster, excluding current)
  const relatedPosts = await prisma.publishedContent.findMany({
    where: {
      brief: { cluster: post.brief.cluster },
      slug: { not: slug },
    },
    include: { brief: { select: { cluster: true } } },
    orderBy: { publishedAt: "desc" },
    take: 3,
  });

  // Extract first paragraph for key takeaway
  const firstParagraph = post.bodyMdx
    .split("\n")
    .find((line) => line.trim() && !line.startsWith("#") && !line.startsWith("<"));

  // Build JSON-LD schemas
  const articleSchema = generateArticleSchema({
    title: post.metaTitle || post.title,
    description:
      post.metaDesc ||
      post.bodyMdx.replace(/[#*`>\[\]()_~\-]/g, "").slice(0, 155).trimEnd(),
    slug: post.slug,
    publishedAt: post.publishedAt.toISOString(),
    updatedAt: post.updatedAt.toISOString(),
    ogImage: post.ogImage || undefined,
  });

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", href: "/" },
    { name: "Blog", href: "/blog" },
    { name: post.title, href: `/blog/${slug}` },
  ]);

  const orgSchema = generateOrganizationSchema();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const schemas: any[] = [articleSchema, breadcrumbSchema, orgSchema];
  if (faqs.length > 0) {
    schemas.push(generateFAQSchema(faqs));
  }

  return (
    <>
      {/* JSON-LD structured data */}
      {schemas.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}

      <main className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex items-center gap-1 text-sm text-muted-foreground">
            <li>
              <Link href="/" className="hover:text-foreground transition-colors">
                Home
              </Link>
            </li>
            <li>
              <ChevronRight className="size-3.5" />
            </li>
            <li>
              <Link href="/blog" className="hover:text-foreground transition-colors">
                Blog
              </Link>
            </li>
            <li>
              <ChevronRight className="size-3.5" />
            </li>
            <li className="truncate text-foreground font-medium">{post.title}</li>
          </ol>
        </nav>

        <div className="flex gap-10">
          {/* Main content */}
          <article className="min-w-0 flex-1">
            {/* Post header */}
            <header className="mb-8">
              {/* Cluster badge */}
              <Link
                href={`/blog?cluster=${encodeURIComponent(post.brief.cluster)}`}
                className="mb-3 inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary hover:bg-primary/20 transition-colors"
              >
                {post.brief.cluster}
              </Link>

              <h1 className="mb-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
                {post.title}
              </h1>

              {/* Meta info */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-1.5">
                  <User className="size-4" />
                  LexiReview Editorial Team
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Calendar className="size-4" />
                  {formattedDate}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="size-4" />
                  {stats.text}
                </span>
              </div>
            </header>

            {/* Key Takeaway */}
            {firstParagraph && (
              <div className="mb-8 rounded-xl border-2 border-primary/30 bg-primary/5 p-5">
                <p className="mb-1 text-xs font-bold uppercase tracking-wider text-primary">
                  Key Takeaway
                </p>
                <p className="text-base font-medium leading-relaxed text-foreground">
                  {firstParagraph.replace(/[#*`>\[\]()_~\-]/g, "").trim()}
                </p>
              </div>
            )}

            {/* MDX body */}
            <div className="prose-wrapper">
              <MDXRemote
                source={post.bodyMdx}
                components={mdxComponents}
              />
            </div>

            {/* Author info box */}
            <div className="mt-12 flex items-start gap-4 rounded-xl border border-foreground/10 bg-card p-5">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-lg">
                LR
              </div>
              <div>
                <p className="font-semibold text-foreground">
                  LexiReview Editorial Team
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Our editorial team comprises legal tech experts, compliance
                  specialists, and AI researchers focused on transforming
                  contract management for Indian businesses.
                </p>
              </div>
            </div>

            {/* Related posts */}
            {relatedPosts.length > 0 && (
              <section className="mt-12">
                <h2 className="mb-6 text-2xl font-bold text-foreground">
                  Related Articles
                </h2>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {relatedPosts.map((related) => {
                    const bodyText = related.bodyMdx.replace(
                      /[#*`>\[\]()_~\-]/g,
                      ""
                    );
                    const excerpt =
                      bodyText.length > 155
                        ? bodyText.slice(0, 155).trimEnd() + "..."
                        : bodyText;
                    const relatedStats = readingTime(related.bodyMdx);

                    return (
                      <BlogCard
                        key={related.id}
                        slug={related.slug}
                        title={related.title}
                        excerpt={excerpt}
                        cluster={related.brief.cluster}
                        publishedAt={related.publishedAt.toISOString()}
                        readingTime={relatedStats.text}
                      />
                    );
                  })}
                </div>
              </section>
            )}

            {/* CTA Banner */}
            <CTABanner />
          </article>

          {/* TOC sidebar (desktop only) */}
          {headings.length > 0 && (
            <aside className="hidden w-64 shrink-0 lg:block">
              <TableOfContents headings={headings} />
            </aside>
          )}
        </div>
      </main>
    </>
  );
}
