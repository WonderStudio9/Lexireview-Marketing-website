/**
 * Utilities to convert state names to URL slugs and back.
 * Used by programmatic SEO routes like /stamp-duty/[state].
 */
import { STAMP_DUTY_RATES } from "@/lib/tools/stamp-duty-rates";

export function stateToSlug(state: string): string {
  return state
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function slugToState(slug: string): string | null {
  const target = slug.toLowerCase();
  for (const state of Object.keys(STAMP_DUTY_RATES)) {
    if (stateToSlug(state) === target) return state;
  }
  return null;
}

export function allStateSlugs(): { state: string; slug: string }[] {
  return Object.keys(STAMP_DUTY_RATES).map((state) => ({
    state,
    slug: stateToSlug(state),
  }));
}
