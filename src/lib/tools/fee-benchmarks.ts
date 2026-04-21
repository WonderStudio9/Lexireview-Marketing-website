import type {
  CityTier,
  PracticeArea,
  FeeAnalyzerInput,
  FeeAnalyzerOutput,
} from "./types";

/**
 * Fee benchmark dataset — hourly rates in INR.
 *
 * Ranges are informed estimates based on publicly reported 2024-26 Indian
 * legal market data (Bar Association surveys, Legally India, Asia Law,
 * anecdotal firm reports). These are meant for directional benchmarking
 * only — see the disclaimer returned by analyzeFee().
 *
 * Structure:
 *   PracticeArea → CityTier → experience bucket → { p25, p50, p75 }
 *
 * Experience buckets:
 *   0-3   = Junior (years 0-3)
 *   4-7   = Mid (years 4-7)
 *   8-15  = Senior (years 8-15)
 *   16+   = Principal / Partner (16+ years)
 */

type ExperienceBucket = "0-3" | "4-7" | "8-15" | "16+";

interface Triple {
  p25: number;
  p50: number;
  p75: number;
}

type CityRates = Record<ExperienceBucket, Triple>;
type PracticeRates = Record<CityTier, CityRates>;

// Base table built around "Litigation" in Tier 2. Other practice areas /
// tiers are multipliers applied to this base to keep the numbers
// internally consistent.
const LITIGATION_TIER2: CityRates = {
  "0-3": { p25: 600, p50: 1000, p75: 1600 },
  "4-7": { p25: 1500, p50: 2200, p75: 3200 },
  "8-15": { p25: 2800, p50: 4000, p75: 6000 },
  "16+": { p25: 5000, p50: 7500, p75: 11000 },
};

// Multipliers by city tier (vs Tier 2).
const CITY_MULTIPLIER: Record<CityTier, number> = {
  Metro: 3.0, // Mumbai / Delhi-NCR / Bengaluru
  "Tier 1": 2.0, // Hyderabad / Pune / Chennai / Kolkata / Ahmedabad
  "Tier 2": 1.0, // Jaipur / Lucknow / Chandigarh / Kochi / Indore
  "Tier 3": 0.55, // smaller cities, district HQs
};

// Multipliers by practice area (vs Litigation).
// Corporate/IP/Tax command a significant premium; Family/Criminal/Labor
// tend to run at or below litigation rates in the Indian market.
const PRACTICE_MULTIPLIER: Record<PracticeArea, number> = {
  Corporate: 2.2,
  IP: 2.0,
  Tax: 1.9,
  "Real Estate": 1.3,
  Litigation: 1.0,
  Labor: 0.9,
  Family: 0.8,
  Criminal: 0.85,
  Other: 1.0,
};

function bucketFor(years: number): ExperienceBucket {
  if (years <= 3) return "0-3";
  if (years <= 7) return "4-7";
  if (years <= 15) return "8-15";
  return "16+";
}

function lookupBase(cityTier: CityTier, bucket: ExperienceBucket): Triple {
  const tier2 = LITIGATION_TIER2[bucket];
  const mult = CITY_MULTIPLIER[cityTier];
  return {
    p25: Math.round(tier2.p25 * mult),
    p50: Math.round(tier2.p50 * mult),
    p75: Math.round(tier2.p75 * mult),
  };
}

function applyPractice(t: Triple, practiceArea: PracticeArea): Triple {
  const m = PRACTICE_MULTIPLIER[practiceArea] ?? 1;
  return {
    p25: Math.round((t.p25 * m) / 50) * 50,
    p50: Math.round((t.p50 * m) / 50) * 50,
    p75: Math.round((t.p75 * m) / 50) * 50,
  };
}

export function getBenchmark(
  practiceArea: PracticeArea,
  cityTier: CityTier,
  yearsExperience: number
): Triple {
  const bucket = bucketFor(yearsExperience);
  const base = lookupBase(cityTier, bucket);
  return applyPractice(base, practiceArea);
}

export function analyzeFee(input: FeeAnalyzerInput): FeeAnalyzerOutput {
  const {
    yearsExperience,
    practiceArea,
    cityTier,
    currentHourlyRate,
    currentRetainer,
    activeMatters,
  } = input;

  const benchmark = getBenchmark(practiceArea, cityTier, yearsExperience);

  // Determine quartile position.
  let yourPosition: FeeAnalyzerOutput["yourPosition"];
  if (currentHourlyRate < benchmark.p25) yourPosition = "Below p25";
  else if (currentHourlyRate < benchmark.p50) yourPosition = "p25-p50";
  else if (currentHourlyRate < benchmark.p75) yourPosition = "p50-p75";
  else yourPosition = "Above p75";

  // Annual potential estimate — assume ~1,600 billable hours/yr for
  // conservative solos, 1,800 median, 2,100 aggressive.
  const conservativeHours = 1600;
  const medianHours = 1800;
  const aggressiveHours = 2100;

  const annualPotential = {
    conservative: Math.round(benchmark.p25 * conservativeHours),
    median: Math.round(benchmark.p50 * medianHours),
    aggressive: Math.round(benchmark.p75 * aggressiveHours),
  };

  // Recommendations
  const recommendations: string[] = [];

  if (yourPosition === "Below p25") {
    const delta = Math.round(((benchmark.p50 - currentHourlyRate) / currentHourlyRate) * 100);
    recommendations.push(
      `You are charging below the 25th percentile for your segment. A targeted rate review could bring you closer to the median (~${delta}% uplift).`
    );
    recommendations.push(
      "Benchmark your 3 highest-value clients first — raising rates there has the biggest cash impact."
    );
  } else if (yourPosition === "p25-p50") {
    recommendations.push(
      "You're in the lower half of the market. A 15-20% rate review at annual renewal is typical and well-supported."
    );
  } else if (yourPosition === "p50-p75") {
    recommendations.push(
      "You are priced at or above the median. Focus on billing efficiency and repeat-matter retainers rather than further rate hikes."
    );
  } else {
    recommendations.push(
      "You are priced at the top of your segment. Protect this by investing in brand, published thought-leadership and selective matter acceptance."
    );
  }

  if (activeMatters >= 25) {
    recommendations.push(
      `With ${activeMatters} active matters, you may be undercapacity-priced. Consider raising rates and/or introducing a matter-intake gate.`
    );
  } else if (activeMatters <= 5) {
    recommendations.push(
      "Active matter count is low — focus on acquisition channels (referrals, content, SEO) before rate changes."
    );
  }

  if (currentRetainer > 0 && currentRetainer < benchmark.p50 * 10) {
    recommendations.push(
      `Your retainer (₹${currentRetainer.toLocaleString("en-IN")}) is low relative to your hourly benchmark. A 10–15 hour minimum retainer of roughly ₹${(benchmark.p50 * 12).toLocaleString("en-IN")} is typical.`
    );
  }

  const segment = `${practiceArea} · ${cityTier} · ${bucketFor(yearsExperience)} yrs`;

  const disclaimer =
    "Benchmarks are directional estimates compiled from publicly reported 2024-26 Indian legal market data (Bar Association surveys, Legally India, Asia Law, anecdotal firm reports). Real rates vary widely by client quality, firm brand and individual reputation. Treat this as a starting point, not a pricing oracle.";

  return {
    benchmark,
    yourPosition,
    annualPotential,
    recommendations,
    disclaimer,
    metadata: {
      generatedAt: new Date().toISOString(),
      segment,
    },
  };
}
