import type { Metadata } from "next";

// ── Constants ────────────────────────────────────────────────────────────────

export const SITE_URL = "https://lexireview.in";
export const APP_URL = "https://app.lexireview.in";
export const SITE_NAME = "LexiReview";
export const SITE_DESCRIPTION =
  "AI-powered contract lifecycle management platform built for Indian legal teams. Automate RBI compliance, DPDP Act adherence, and contract review workflows.";
export const OG_DEFAULTS = {
  type: "website" as const,
  locale: "en_IN",
  siteName: SITE_NAME,
  defaultImage: `${SITE_URL}/og-default.png`,
};

// ── Metadata helper ──────────────────────────────────────────────────────────

export interface PageMetadataInput {
  title: string;
  description: string;
  path?: string;
  ogImage?: string;
  ogType?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  authors?: string[];
  keywords?: string[];
  noIndex?: boolean;
}

export function generatePageMetadata({
  title,
  description,
  path = "",
  ogImage,
  ogType = "website",
  publishedTime,
  modifiedTime,
  authors,
  keywords,
  noIndex = false,
}: PageMetadataInput): Metadata {
  const url = `${SITE_URL}${path}`;
  const image = ogImage || OG_DEFAULTS.defaultImage;

  return {
    title,
    description,
    keywords,
    authors: authors?.map((name) => ({ name })),
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      locale: OG_DEFAULTS.locale,
      type: ogType,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      ...(publishedTime && { publishedTime }),
      ...(modifiedTime && { modifiedTime }),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
  };
}

// ── JSON-LD Schema helpers ──────────────────────────────────────────────────

export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    description: SITE_DESCRIPTION,
    sameAs: [
      "https://www.linkedin.com/company/lexireview",
      "https://twitter.com/lexireview",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      availableLanguage: ["English", "Hindi"],
    },
  };
}

export function generateSoftwareSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: SITE_NAME,
    url: APP_URL,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    description: SITE_DESCRIPTION,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "INR",
      description: "Free trial available",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      ratingCount: "150",
      bestRating: "5",
    },
  };
}

export interface ArticleSchemaInput {
  title: string;
  description: string;
  slug: string;
  publishedAt: string;
  updatedAt: string;
  ogImage?: string;
  authorName?: string;
}

export function generateArticleSchema({
  title,
  description,
  slug,
  publishedAt,
  updatedAt,
  ogImage,
  authorName = "LexiReview Editorial Team",
}: ArticleSchemaInput) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    url: `${SITE_URL}/blog/${slug}`,
    image: ogImage || OG_DEFAULTS.defaultImage,
    datePublished: publishedAt,
    dateModified: updatedAt,
    author: {
      "@type": "Person",
      name: authorName,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/logo.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE_URL}/blog/${slug}`,
    },
  };
}

export interface FAQItem {
  question: string;
  answer: string;
}

export function generateFAQSchema(faqs: FAQItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

export interface BreadcrumbItem {
  name: string;
  href: string;
}

export function generateBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${SITE_URL}${item.href}`,
    })),
  };
}
