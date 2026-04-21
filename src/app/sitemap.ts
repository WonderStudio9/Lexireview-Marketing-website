import type { MetadataRoute } from "next";
import { prisma } from "@/lib/db";
import { SITE_URL } from "@/lib/seo";

export const dynamic = "force-dynamic";

// Fixed release dates — stable lastmod signals trust to Google.
// Bump these ONLY when the page's actual content changes.
const STATIC_PAGE_RELEASED = new Date("2026-03-15T00:00:00Z");
const SOLUTIONS_PAGE_RELEASED = new Date("2026-03-20T00:00:00Z");
const COMPARE_PAGE_RELEASED = new Date("2026-03-22T00:00:00Z");
const LEGAL_PAGE_RELEASED = new Date("2026-03-10T00:00:00Z");

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Try to find the most recent blog publishedAt for the /blog index lastmod
  let blogIndexLastMod: Date = new Date("2026-03-25T00:00:00Z");

  // Published blog posts (graceful fallback if DB unavailable)
  let blogPages: MetadataRoute.Sitemap = [];
  try {
    const posts = await prisma.publishedContent.findMany({
      select: { slug: true, updatedAt: true, publishedAt: true },
      orderBy: { publishedAt: "desc" },
    });

    if (posts.length > 0 && posts[0].publishedAt) {
      blogIndexLastMod = posts[0].publishedAt;
    }

    blogPages = posts.map((post) => ({
      url: `${SITE_URL}/blog/${post.slug}`,
      // Prefer publishedAt over updatedAt — it's stable and accurate.
      lastModified: post.publishedAt || post.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }));
  } catch {
    // DB not available during build — return static pages only
  }

  // Static pages with stable lastmod dates (not `new Date()`)
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: STATIC_PAGE_RELEASED,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/features`,
      lastModified: STATIC_PAGE_RELEASED,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/pricing`,
      lastModified: STATIC_PAGE_RELEASED,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/contact`,
      lastModified: STATIC_PAGE_RELEASED,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/resources`,
      lastModified: STATIC_PAGE_RELEASED,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/blog`,
      lastModified: blogIndexLastMod,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    // Solutions pages
    {
      url: `${SITE_URL}/solutions/nbfc`,
      lastModified: SOLUTIONS_PAGE_RELEASED,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/solutions/banking`,
      lastModified: SOLUTIONS_PAGE_RELEASED,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/solutions/legal-firms`,
      lastModified: SOLUTIONS_PAGE_RELEASED,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/solutions/real-estate`,
      lastModified: SOLUTIONS_PAGE_RELEASED,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    // Compare pages
    {
      url: `${SITE_URL}/compare/spotdraft`,
      lastModified: COMPARE_PAGE_RELEASED,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/compare/leegality`,
      lastModified: COMPARE_PAGE_RELEASED,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/compare/provakil`,
      lastModified: COMPARE_PAGE_RELEASED,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    // Legal pages
    {
      url: `${SITE_URL}/privacy`,
      lastModified: LEGAL_PAGE_RELEASED,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${SITE_URL}/terms`,
      lastModified: LEGAL_PAGE_RELEASED,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${SITE_URL}/security`,
      lastModified: LEGAL_PAGE_RELEASED,
      changeFrequency: "yearly",
      priority: 0.4,
    },
    {
      url: `${SITE_URL}/dpdp-compliance`,
      lastModified: LEGAL_PAGE_RELEASED,
      changeFrequency: "yearly",
      priority: 0.4,
    },
  ];

  return [...staticPages, ...blogPages];
}
