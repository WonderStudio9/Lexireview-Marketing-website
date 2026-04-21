import type { LeadICP, LeadSource, LeadTier } from "@prisma/client";

/**
 * Infer a Lead's tier based on its ICP classification.
 */
export function icpToTier(icp: LeadICP): LeadTier {
  const citizenICPs: LeadICP[] = [
    "TENANT_LANDLORD",
    "HOME_BUYER",
    "EMPLOYEE",
    "FREELANCER",
    "MSME_OWNER",
    "CONTENT_CREATOR",
    "STARTUP_FOUNDER_EARLY",
    "NRI",
    "CONSUMER_DISPUTE",
    "SENIOR_CITIZEN",
    "STUDENT",
    "COUPLE",
    "FARMER",
  ];
  const smbICPs: LeadICP[] = [
    "SOLO_LAWYER",
    "SMALL_LAW_FIRM",
    "STARTUP_FOUNDER",
    "SME_OWNER",
    "CA_TAX_CONSULTANT",
    "HR_CONSULTANT",
    "FRACTIONAL_GC",
  ];
  const midICPs: LeadICP[] = [
    "MID_TIER_LAW_FIRM",
    "IN_HOUSE_LEGAL_TEAM",
    "MID_NBFC",
    "RE_DEVELOPER",
    "INSURANCE_COMPANY",
    "PE_VC_FIRM",
    "PROCUREMENT_HEAD",
  ];
  const enterpriseICPs: LeadICP[] = [
    "TIER1_LAW_FIRM",
    "LISTED_COMPANY",
    "LARGE_NBFC",
    "LARGE_BANK",
    "FINTECH_UNICORN",
    "BIG4_CONSULTING",
    "MNC_INDIA_OPS",
  ];
  const govICPs: LeadICP[] = [
    "CENTRAL_GOVT",
    "STATE_GOVT",
    "PSU",
    "REGULATOR",
    "COURT_TRIBUNAL",
  ];

  if (citizenICPs.includes(icp)) return "CITIZEN";
  if (smbICPs.includes(icp)) return "SMB";
  if (midICPs.includes(icp)) return "MID_MARKET";
  if (enterpriseICPs.includes(icp)) return "ENTERPRISE";
  if (govICPs.includes(icp)) return "GOVERNMENT";
  return "SMB"; // Safe fallback
}

/**
 * Classify the ICP from the first-touch URL pattern.
 * Used when the client doesn't provide an explicit ICP.
 */
export function classifyICPFromUrl(url: string | null | undefined): LeadICP {
  if (!url) return "UNKNOWN";
  const path = url.toLowerCase();

  // Citizens hub mappings
  if (path.includes("/citizens/tenants") || path.includes("rent-agreement")) return "TENANT_LANDLORD";
  if (path.includes("/citizens/home-buyers") || path.includes("rera")) return "HOME_BUYER";
  if (path.includes("/citizens/employees") || path.includes("offer-letter") || path.includes("employment-agreement")) return "EMPLOYEE";
  if (path.includes("/citizens/freelancers") || path.includes("freelancer-contract")) return "FREELANCER";
  if (path.includes("/citizens/msme") || path.includes("msme-")) return "MSME_OWNER";
  if (path.includes("/citizens/content-creators")) return "CONTENT_CREATOR";
  if (path.includes("/citizens/startup-founders")) return "STARTUP_FOUNDER_EARLY";
  if (path.includes("/citizens/nri")) return "NRI";
  if (path.includes("/citizens/consumers") || path.includes("consumer-complaint")) return "CONSUMER_DISPUTE";
  if (path.includes("/citizens/senior-citizens")) return "SENIOR_CITIZEN";
  if (path.includes("/citizens/students")) return "STUDENT";
  if (path.includes("/citizens/couples")) return "COUPLE";
  if (path.includes("/citizens/farmers")) return "FARMER";

  // Solutions pages (B2B)
  if (path.includes("/solutions/solo-lawyers")) return "SOLO_LAWYER";
  if (path.includes("/solutions/startups")) return "STARTUP_FOUNDER";
  if (path.includes("/solutions/law-firms")) return "TIER1_LAW_FIRM";
  if (path.includes("/solutions/real-estate")) return "RE_DEVELOPER";
  if (path.includes("/solutions/nbfc")) return "MID_NBFC";
  if (path.includes("/solutions/banking")) return "LARGE_BANK";
  if (path.includes("/solutions/legal-firms")) return "MID_TIER_LAW_FIRM";
  if (path.includes("/solutions/government")) return "CENTRAL_GOVT";

  // Tool-based classification (for when the page is a tool)
  if (path.includes("rent-agreement") || path.includes("stamp-duty")) return "TENANT_LANDLORD";
  if (path.includes("nda-generator")) return "STARTUP_FOUNDER";
  if (path.includes("offer-letter")) return "EMPLOYEE";

  return "UNKNOWN";
}

/**
 * Parse source from URL parameters and referrer.
 */
export function inferSource(
  firstTouchUrl: string | null | undefined,
  utmSource: string | null | undefined,
  utmMedium: string | null | undefined,
  referrer: string | null | undefined,
): LeadSource {
  // Explicit UTM takes precedence
  if (utmSource) {
    const src = utmSource.toLowerCase();
    if (src === "google" && utmMedium === "cpc") return "PAID_GOOGLE";
    if (src === "linkedin" && utmMedium === "cpc") return "PAID_LINKEDIN";
    if (src === "meta" || src === "facebook") return "PAID_META";
    if (src === "linkedin") return "SOCIAL_LINKEDIN";
    if (src === "quora") return "SOCIAL_QUORA";
    if (src === "reddit") return "SOCIAL_REDDIT";
    if (src === "medium") return "SOCIAL_MEDIUM";
    if (src === "twitter" || src === "x") return "SOCIAL_X";
    if (src === "outbound-email") return "OUTBOUND_EMAIL";
    if (src === "outbound-linkedin") return "OUTBOUND_LINKEDIN";
    if (src === "referral") return "REFERRAL";
    if (src === "event") return "EVENT";
  }

  // Infer from URL path
  const url = firstTouchUrl?.toLowerCase() || "";
  if (url.includes("/blog/")) return "ORGANIC_BLOG";
  if (url.includes("/tools/")) return "ORGANIC_TOOL";
  if (url.includes("/citizens/") || url.includes("/solutions/")) return "ORGANIC_LANDING";

  // Infer from referrer
  const ref = referrer?.toLowerCase() || "";
  if (ref.includes("google.")) return "ORGANIC_BLOG";
  if (ref.includes("linkedin.com")) return "SOCIAL_LINKEDIN";
  if (ref.includes("quora.com")) return "SOCIAL_QUORA";
  if (ref.includes("reddit.com")) return "SOCIAL_REDDIT";
  if (ref.includes("medium.com")) return "SOCIAL_MEDIUM";
  if (ref.includes("twitter.com") || ref.includes("x.com")) return "SOCIAL_X";

  if (!referrer && !firstTouchUrl) return "DIRECT";
  return "UNKNOWN";
}
