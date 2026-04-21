import type { LeadICP, LeadSource, LeadTier } from "@prisma/client";

/**
 * Compute a Lead's ICP fit score (0-100) based on classification quality.
 * Higher = better fit, more likely to convert.
 */
export function computeIcpFitScore(icp: LeadICP, tier: LeadTier): number {
  if (icp === "UNKNOWN") return 10; // Anonymous, minimal signal
  if (tier === "ENTERPRISE") return 90;
  if (tier === "MID_MARKET") return 75;
  if (tier === "SMB") return 55;
  if (tier === "CITIZEN") return 30; // Lower buying power, high volume
  if (tier === "GOVERNMENT") return 85; // Strategic value
  return 40;
}

/**
 * Compute an intent score (0-100) from engagement signals.
 */
export function computeIntentScore(source: LeadSource, hasCompletedTool: boolean): number {
  let score = 20; // Baseline for captured leads

  // Source quality bonus
  const highIntent: LeadSource[] = ["OUTBOUND_EMAIL", "OUTBOUND_LINKEDIN", "REFERRAL", "EVENT"];
  const midIntent: LeadSource[] = ["ORGANIC_TOOL", "PAID_GOOGLE", "PAID_LINKEDIN"];
  const lowIntent: LeadSource[] = ["ORGANIC_BLOG", "SOCIAL_QUORA", "SOCIAL_REDDIT"];

  if (highIntent.includes(source)) score += 40;
  else if (midIntent.includes(source)) score += 25;
  else if (lowIntent.includes(source)) score += 10;

  // Tool completion is a strong intent signal
  if (hasCompletedTool) score += 20;

  return Math.min(100, score);
}

/**
 * Sum of ICP fit, intent, and engagement scores (0-300 total).
 */
export function computeTotalScore(
  icpFit: number,
  intent: number,
  engagement: number,
): number {
  return Math.min(300, icpFit + intent + engagement);
}

/**
 * Classify a lead as MQL / SQL based on total score.
 */
export function stageFromScore(score: number): "MQL" | "SQL" | null {
  if (score >= 180) return "SQL";
  if (score >= 100) return "MQL";
  return null;
}
