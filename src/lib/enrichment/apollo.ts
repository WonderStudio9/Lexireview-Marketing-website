/**
 * Apollo.io integration.
 *
 * Stub mode: returns null when APOLLO_API_KEY is not set.
 * Real mode: calls Apollo's People and Organizations Enrichment APIs.
 *
 * Use for firmographic enrichment (company size, revenue, industry) +
 * contact discovery (up to 100 contacts per org).
 */

export interface ApolloPerson {
  firstName?: string;
  lastName?: string;
  email?: string;
  title?: string;
  linkedin?: string;
  seniority?: string;
  department?: string;
  phone?: string;
  source: "apollo" | "stub";
}

export interface ApolloOrganization {
  name?: string;
  domain?: string;
  industry?: string;
  employees?: number;
  revenue?: string;
  foundedYear?: number;
  linkedin?: string;
  twitter?: string;
  headcount?: {
    total?: number;
    engineering?: number;
    sales?: number;
    legal?: number;
  };
  technologies?: string[];
  location?: {
    city?: string;
    state?: string;
    country?: string;
  };
  source: "apollo" | "stub";
}

export async function enrichOrganization(
  domain: string,
): Promise<ApolloOrganization | null> {
  const apiKey = process.env.APOLLO_API_KEY;
  if (!apiKey) {
    console.log(`[enrichment/apollo STUBBED] enrichOrganization domain=${domain}`);
    return null;
  }

  try {
    const res = await fetch("https://api.apollo.io/v1/organizations/enrich", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Api-Key": apiKey,
      },
      body: JSON.stringify({ domain }),
    });
    if (!res.ok) {
      console.error(`[apollo] ${res.status}`);
      return null;
    }
    const json = await res.json();
    const o = json.organization;
    if (!o) return null;
    return {
      name: o.name,
      domain: o.primary_domain,
      industry: o.industry,
      employees: o.estimated_num_employees,
      revenue: o.estimated_annual_revenue,
      foundedYear: o.founded_year,
      linkedin: o.linkedin_url,
      twitter: o.twitter_url,
      headcount: {
        total: o.estimated_num_employees,
        engineering: o.departmental_head_count?.engineering,
        sales: o.departmental_head_count?.sales,
        legal: o.departmental_head_count?.legal_affairs,
      },
      technologies: o.technologies,
      location: {
        city: o.city,
        state: o.state,
        country: o.country,
      },
      source: "apollo",
    };
  } catch (err) {
    console.error(`[apollo] error:`, err);
    return null;
  }
}

export async function findContactsInOrg(params: {
  domain: string;
  titles?: string[];
  seniority?: string[];
  limit?: number;
}): Promise<ApolloPerson[]> {
  const apiKey = process.env.APOLLO_API_KEY;
  if (!apiKey) {
    console.log(
      `[enrichment/apollo STUBBED] findContactsInOrg domain=${params.domain}`,
    );
    return [];
  }

  try {
    const res = await fetch("https://api.apollo.io/v1/mixed_people/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Api-Key": apiKey,
      },
      body: JSON.stringify({
        q_organization_domains: params.domain,
        person_titles: params.titles,
        person_seniorities: params.seniority,
        page: 1,
        per_page: params.limit || 25,
      }),
    });
    if (!res.ok) return [];
    const json = await res.json();
    return (json.people || []).map((p: Record<string, unknown>) => ({
      firstName: p.first_name as string,
      lastName: p.last_name as string,
      email: p.email as string,
      title: p.title as string,
      linkedin: p.linkedin_url as string,
      seniority: p.seniority as string,
      department: (p.departments as string[])?.[0],
      phone: (p.phone_numbers as { sanitized_number: string }[])?.[0]?.sanitized_number,
      source: "apollo" as const,
    }));
  } catch {
    return [];
  }
}
