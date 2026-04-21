import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import {
  computeAttribution,
  getFunnelSummary,
  AttributionModel,
} from "@/lib/attribution/compute";

/**
 * GET /api/attribution — returns the funnel summary + optional per-lead drill-in.
 * Auth required.
 *
 * Query params:
 *   ?leadId=xxx — returns per-lead multi-touch attribution
 *   ?model=FIRST_TOUCH|LAST_TOUCH|LINEAR|TIME_DECAY|U_SHAPED — selects model for per-lead
 */
export async function GET(request: NextRequest) {
  const authed = await isAuthenticated();
  if (!authed) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const leadId = searchParams.get("leadId");
  const model = (searchParams.get("model") || "LAST_TOUCH") as AttributionModel;

  if (leadId) {
    const attribution = await computeAttribution(leadId, model);
    if (!attribution) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 });
    }
    return NextResponse.json(attribution);
  }

  const summary = await getFunnelSummary();
  return NextResponse.json(summary);
}
