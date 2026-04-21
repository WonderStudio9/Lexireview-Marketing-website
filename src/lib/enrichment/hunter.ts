/**
 * Hunter.io integration.
 *
 * Stub mode: returns null when HUNTER_API_KEY is not set.
 * Real mode: calls Hunter's Email Finder and Domain Search APIs.
 *
 * Pricing (as of 2026):
 *   - $49/mo for 1,000 searches
 *   - Email verification is cheaper than full finder
 */

export interface HunterResult {
  email?: string;
  firstName?: string;
  lastName?: string;
  position?: string;
  seniority?: string;
  department?: string;
  linkedin?: string;
  twitter?: string;
  phoneNumber?: string;
  confidence?: number; // 0-100
  verification?: {
    status: "valid" | "invalid" | "accept_all" | "webmail" | "disposable" | "unknown";
    score: number;
  };
  source: "hunter" | "stub";
}

export async function findEmail(params: {
  domain: string;
  firstName?: string;
  lastName?: string;
}): Promise<HunterResult | null> {
  const apiKey = process.env.HUNTER_API_KEY;
  if (!apiKey) {
    console.log(
      `[enrichment/hunter STUBBED] findEmail domain=${params.domain} firstName=${params.firstName}`,
    );
    return null;
  }

  const url = new URL("https://api.hunter.io/v2/email-finder");
  url.searchParams.set("domain", params.domain);
  if (params.firstName) url.searchParams.set("first_name", params.firstName);
  if (params.lastName) url.searchParams.set("last_name", params.lastName);
  url.searchParams.set("api_key", apiKey);

  try {
    const res = await fetch(url);
    if (!res.ok) {
      console.error(`[hunter] ${res.status} ${res.statusText}`);
      return null;
    }
    const json = await res.json();
    const d = json.data;
    if (!d?.email) return null;
    return {
      email: d.email,
      firstName: d.first_name,
      lastName: d.last_name,
      position: d.position,
      seniority: d.seniority,
      department: d.department,
      linkedin: d.linkedin,
      twitter: d.twitter,
      phoneNumber: d.phone_number,
      confidence: d.score,
      verification: d.verification
        ? { status: d.verification.status, score: d.verification.score ?? d.score }
        : undefined,
      source: "hunter",
    };
  } catch (err) {
    console.error(`[hunter] error:`, err);
    return null;
  }
}

export async function verifyEmail(email: string): Promise<{
  valid: boolean;
  score: number;
  status: string;
} | null> {
  const apiKey = process.env.HUNTER_API_KEY;
  if (!apiKey) {
    console.log(`[enrichment/hunter STUBBED] verifyEmail ${email}`);
    return null;
  }

  const url = new URL("https://api.hunter.io/v2/email-verifier");
  url.searchParams.set("email", email);
  url.searchParams.set("api_key", apiKey);

  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const json = await res.json();
    return {
      valid: json.data?.status === "valid",
      score: json.data?.score ?? 0,
      status: json.data?.status ?? "unknown",
    };
  } catch {
    return null;
  }
}
