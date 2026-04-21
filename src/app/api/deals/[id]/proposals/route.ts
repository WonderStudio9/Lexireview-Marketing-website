import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { prisma } from "@/lib/db";
import { isAuthenticated } from "@/lib/auth";

const MODEL = "claude-sonnet-4-5-20250929";

/**
 * POST /api/deals/[id]/proposals
 *
 * Generates a professional sales proposal for the deal using Claude.
 * Auto-versions: previous highest version + 1.
 * If ANTHROPIC_API_KEY missing, returns a stub proposal.
 */
export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const authed = await isAuthenticated();
  if (!authed) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;

  const deal = await prisma.deal.findUnique({
    where: { id },
    include: { account: true, primaryLead: true },
  });
  if (!deal) return NextResponse.json({ error: "Deal not found" }, { status: 404 });

  const latest = await prisma.dealProposal.findFirst({
    where: { dealId: id },
    orderBy: { version: "desc" },
  });
  const nextVersion = (latest?.version ?? 0) + 1;

  let content: string;

  if (process.env.ANTHROPIC_API_KEY) {
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    const system = `You are a senior sales engineer at LexiReview, India's AI contract intelligence platform. Write a concise, professional sales proposal in markdown. Target length: 600-900 words. Sections: (1) Executive Summary, (2) Business Case for ${deal.account.name}, (3) Proposed Scope & Pricing, (4) Implementation Timeline, (5) Success Metrics, (6) Next Steps. Use Indian English spelling. Reference Indian law context where relevant (ICA, DPDP, RBI, SEBI). Propose the current deal value ₹${deal.valueINR.toLocaleString("en-IN")}. End with a clear call-to-action for the ${deal.stage} stage.`;

    const userPrompt = `Generate proposal v${nextVersion} for:

Deal: ${deal.name}
Account: ${deal.account.name} (${deal.account.tier}, ${deal.account.industry || "unknown industry"})
ICP: ${deal.account.icp}
Primary contact: ${deal.primaryLead?.email || "TBD"}
Value: ₹${deal.valueINR.toLocaleString("en-IN")}
Probability: ${deal.probability}%
Current stage: ${deal.stage}
Expected close: ${deal.expectedCloseDate?.toDateString() || "TBD"}`;

    try {
      const msg = await client.messages.create({
        model: MODEL,
        max_tokens: 3000,
        system,
        messages: [{ role: "user", content: userPrompt }],
      });
      content = msg.content
        .map((c) => (c.type === "text" ? c.text : ""))
        .join("\n")
        .trim();
    } catch (err) {
      console.error("[proposals] Claude error:", err);
      content = stubProposal(deal);
    }
  } else {
    content = stubProposal(deal);
  }

  const proposal = await prisma.dealProposal.create({
    data: {
      dealId: id,
      version: nextVersion,
      content,
    },
  });

  return NextResponse.json(proposal, { status: 201 });
}

function stubProposal(deal: {
  name: string;
  account: { name: string };
  valueINR: number;
  stage: string;
}) {
  return `# Proposal: ${deal.name}

## Executive Summary

LexiReview proposes an engagement with ${deal.account.name} covering AI-powered contract review, template management, and compliance workflow.

## Commercial terms

- **Engagement value:** ₹${deal.valueINR.toLocaleString("en-IN")}
- **Current stage:** ${deal.stage}

## Next steps

1. Technical walkthrough session
2. Security review
3. POC scope definition
4. Commercial contract

---

_This proposal was generated in stub mode (Claude API not configured). Request Claude-generated proposals by setting ANTHROPIC_API_KEY._
`;
}
