import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { generatePageMetadata, SITE_NAME } from "@/lib/seo";
import { BlogCard } from "@/components/blog/blog-card";
import readingTime from "reading-time";

export const dynamic = "force-dynamic";

export const metadata: Metadata = generatePageMetadata({
  title: `${SITE_NAME} Blog | Indian Legal Tech & Contract Management Insights`,
  description:
    "Expert insights on Indian contract management, RBI compliance, DPDP Act, AI-powered legal review, and CLM best practices for legal teams in India.",
  path: "/blog",
  keywords: [
    "Indian legal tech blog",
    "contract management insights",
    "RBI compliance",
    "DPDP Act",
    "AI contract review",
    "CLM India",
  ],
});

const CLUSTERS = [
  "RBI Compliance",
  "DPDP Act",
  "AI Contract Review",
  "Financial Services CLM",
  "ICA Compliance",
  "Comparisons",
] as const;

const POSTS_PER_PAGE = 12;

interface BlogPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const params = await searchParams;
  const clusterFilter = typeof params.cluster === "string" ? params.cluster : undefined;
  const currentPage = Math.max(1, parseInt(typeof params.page === "string" ? params.page : "1", 10) || 1);

  const where = clusterFilter
    ? { brief: { cluster: clusterFilter } }
    : {};

  const [posts, totalCount] = await Promise.all([
    prisma.publishedContent.findMany({
      where,
      include: { brief: { select: { cluster: true, keywords: true } } },
      orderBy: { publishedAt: "desc" },
      skip: (currentPage - 1) * POSTS_PER_PAGE,
      take: POSTS_PER_PAGE,
    }),
    prisma.publishedContent.count({ where }),
  ]);

  const totalPages = Math.ceil(totalCount / POSTS_PER_PAGE);

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          LexiReview Blog
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Indian Legal Tech &amp; Contract Management Insights
        </p>
      </div>

      {/* Cluster filters */}
      <div className="mb-8 flex flex-wrap gap-2">
        <Link
          href="/blog"
          className={`rounded-full border px-3 py-1 text-sm font-medium transition-colors ${
            !clusterFilter
              ? "border-primary bg-primary text-primary-foreground"
              : "border-foreground/10 text-muted-foreground hover:border-primary/30 hover:text-foreground"
          }`}
        >
          All
        </Link>
        {CLUSTERS.map((cluster) => (
          <Link
            key={cluster}
            href={`/blog?cluster=${encodeURIComponent(cluster)}`}
            className={`rounded-full border px-3 py-1 text-sm font-medium transition-colors ${
              clusterFilter === cluster
                ? "border-primary bg-primary text-primary-foreground"
                : "border-foreground/10 text-muted-foreground hover:border-primary/30 hover:text-foreground"
            }`}
          >
            {cluster}
          </Link>
        ))}
      </div>

      {/* Posts grid */}
      {posts.length === 0 ? (
        <div className="py-20 text-center">
          <p className="text-lg text-muted-foreground">No posts found.</p>
          {clusterFilter && (
            <Link
              href="/blog"
              className="mt-4 inline-block text-sm font-medium text-primary hover:underline"
            >
              View all posts
            </Link>
          )}
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => {
            const bodyText = post.bodyMdx.replace(/[#*`>\[\]()_~\-]/g, "");
            const excerpt =
              bodyText.length > 155
                ? bodyText.slice(0, 155).trimEnd() + "..."
                : bodyText;
            const stats = readingTime(post.bodyMdx);

            return (
              <BlogCard
                key={post.id}
                slug={post.slug}
                title={post.title}
                excerpt={excerpt}
                cluster={post.brief.cluster}
                publishedAt={post.publishedAt.toISOString()}
                readingTime={stats.text}
              />
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <nav
          aria-label="Blog pagination"
          className="mt-12 flex items-center justify-center gap-2"
        >
          {currentPage > 1 && (
            <Link
              href={`/blog?${new URLSearchParams({
                ...(clusterFilter ? { cluster: clusterFilter } : {}),
                page: String(currentPage - 1),
              })}`}
              className="rounded-lg border border-foreground/10 px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:border-primary/30 hover:text-foreground"
            >
              Previous
            </Link>
          )}

          {Array.from({ length: totalPages }, (_, i) => i + 1).map(
            (pageNum) => (
              <Link
                key={pageNum}
                href={`/blog?${new URLSearchParams({
                  ...(clusterFilter ? { cluster: clusterFilter } : {}),
                  page: String(pageNum),
                })}`}
                className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                  pageNum === currentPage
                    ? "bg-primary text-primary-foreground"
                    : "border border-foreground/10 text-muted-foreground hover:border-primary/30 hover:text-foreground"
                }`}
              >
                {pageNum}
              </Link>
            )
          )}

          {currentPage < totalPages && (
            <Link
              href={`/blog?${new URLSearchParams({
                ...(clusterFilter ? { cluster: clusterFilter } : {}),
                page: String(currentPage + 1),
              })}`}
              className="rounded-lg border border-foreground/10 px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:border-primary/30 hover:text-foreground"
            >
              Next
            </Link>
          )}
        </nav>
      )}
    </main>
  );
}
