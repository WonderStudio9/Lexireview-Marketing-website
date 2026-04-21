// Helper to POST to /api/lead from client-side tool flows.
// The /api/lead route is being built separately; this just calls it.

export interface CaptureLeadParams {
  email: string;
  icp: string;
  source: string;
  firstTouchUrl: string;
  sourceDetail?: string;
  firstName?: string;
  phone?: string;
}

export interface CaptureLeadResult {
  leadId: string;
}

export async function captureLead(
  params: CaptureLeadParams
): Promise<CaptureLeadResult> {
  const res = await fetch("/api/lead", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });

  if (!res.ok) {
    // Soft-fail: still let the user see the tool output.
    // Lead capture should never block UX.
    const text = await res.text().catch(() => "");
    throw new Error(`Lead capture failed (${res.status}): ${text || "Unknown"}`);
  }

  const data = (await res.json()) as Partial<CaptureLeadResult>;
  return { leadId: data.leadId ?? "" };
}
