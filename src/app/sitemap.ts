import type { MetadataRoute } from "next";
import { prisma } from "@/lib/db";
import { SITE_URL } from "@/lib/seo";
import { allStateSlugs } from "@/lib/pseo/slugs";

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

  // Programmatic SEO: state × topic (stamp-duty + rent-agreement × 36 states/UTs)
  const PSEO_RELEASED = new Date("2026-04-22T00:00:00Z");
  const pseoPages: MetadataRoute.Sitemap = allStateSlugs().flatMap(({ slug }) => [
    {
      url: `${SITE_URL}/stamp-duty/${slug}`,
      lastModified: PSEO_RELEASED,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/rent-agreement/${slug}`,
      lastModified: PSEO_RELEASED,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    },
  ]);

  // Citizens sub-hubs (13 segments)
  const CITIZEN_SEGMENTS = [
    "tenants",
    "home-buyers",
    "employees",
    "freelancers",
    "msme-owners",
    "content-creators",
    "startup-founders",
    "nri",
    "consumers",
    "senior-citizens",
    "students",
    "couples",
    "farmers",
  ];
  const citizensPages: MetadataRoute.Sitemap = CITIZEN_SEGMENTS.map((seg) => ({
    url: `${SITE_URL}/citizens/${seg}`,
    lastModified: PSEO_RELEASED,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  // Hindi hub
  const hindiPages: MetadataRoute.Sitemap = [
    {
      url: `${SITE_URL}/hindi`,
      lastModified: PSEO_RELEASED,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
  ];

  // Trust / security page
  const trustPages: MetadataRoute.Sitemap = [
    {
      url: `${SITE_URL}/trust`,
      lastModified: PSEO_RELEASED,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
  ];

  // Lead magnets
  const magnetPages: MetadataRoute.Sitemap = [
    {
      url: `${SITE_URL}/lead-magnets/solo-lawyer-playbook`,
      lastModified: PSEO_RELEASED,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/lead-magnets/founder-legal-checklist`,
      lastModified: PSEO_RELEASED,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/lead-magnets/rera-compliance-handbook`,
      lastModified: PSEO_RELEASED,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    },
  ];

  return [
    ...staticPages,
    ...blogPages,
    ...pseoPages,
    ...citizensPages,
    ...magnetPages,
    ...hindiPages,
    ...trustPages,
  ];
}
