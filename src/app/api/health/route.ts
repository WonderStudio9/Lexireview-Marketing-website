import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";

/**
 * Mask a secret — shows first 4 + last 2 chars, or empty string if not set.
 */
function mask(value: string | undefined): string {
  if (!value) return "";
  if (value.length <= 8) return "••••";
  return `${value.slice(0, 4)}...${value.slice(-2)}`;
}

type Integration = {
  name: string;
  description: string;
  envVar: string;
  configured: boolean;
  masked: string;
  extraChecks?: { label: string; ok: boolean }[];
};

/**
 * GET /api/health — returns configuration status for every third-party integration.
 * Admin-only. Never returns actual secret values.
 */
export async function GET() {
  const authed = await isAuthenticated();
  if (!authed) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const env = process.env;

  const integrations: Integration[] = [
    {
      name: "Resend",
      description: "Transactional email delivery",
      envVar: "RESEND_API_KEY",
      configured: Boolean(env.RESEND_API_KEY),
      masked: mask(env.RESEND_API_KEY),
    },
    {
      name: "Razorpay",
      description: "Payments & subscription billing",
      envVar: "RAZORPAY_KEY_ID",
      configured: Boolean(env.RAZORPAY_KEY_ID && env.RAZORPAY_KEY_SECRET),
      masked: mask(env.RAZORPAY_KEY_ID),
      extraChecks: [
        { label: "RAZORPAY_KEY_SECRET", ok: Boolean(env.RAZORPAY_KEY_SECRET) },
        { label: "RAZORPAY_WEBHOOK_SECRET", ok: Boolean(env.RAZORPAY_WEBHOOK_SECRET) },
      ],
    },
    {
      name: "SmartLead",
      description: "Cold email outreach automation",
      envVar: "SMARTLEAD_API_KEY",
      configured: Boolean(env.SMARTLEAD_API_KEY),
      masked: mask(env.SMARTLEAD_API_KEY),
    },
    {
      name: "Hunter.io",
      description: "Email finder & verifier",
      envVar: "HUNTER_API_KEY",
      configured: Boolean(env.HUNTER_API_KEY),
      masked: mask(env.HUNTER_API_KEY),
    },
    {
      name: "Apollo.io",
      description: "B2B contact & account data",
      envVar: "APOLLO_API_KEY",
      configured: Boolean(env.APOLLO_API_KEY),
      masked: mask(env.APOLLO_API_KEY),
    },
    {
      name: "Unipile",
      description: "LinkedIn automation",
      envVar: "UNIPILE_API_KEY",
      configured: Boolean(env.UNIPILE_API_KEY),
      masked: mask(env.UNIPILE_API_KEY),
    },
    {
      name: "RB2B",
      description: "Reverse IP lookup (anonymous visitors)",
      envVar: "RB2B_WEBHOOK_SECRET",
      configured: Boolean(env.RB2B_WEBHOOK_SECRET),
      masked: mask(env.RB2B_WEBHOOK_SECRET),
    },
    {
      name: "Slack Alerts",
      description: "Ops & pipeline notifications",
      envVar: "SLACK_WEBHOOK_URL",
      configured: Boolean(env.SLACK_WEBHOOK_URL),
      masked: mask(env.SLACK_WEBHOOK_URL),
    },
    {
      name: "Anthropic",
      description: "Claude — agent & content generation",
      envVar: "ANTHROPIC_API_KEY",
      configured: Boolean(env.ANTHROPIC_API_KEY),
      masked: mask(env.ANTHROPIC_API_KEY),
    },
  ];

  return NextResponse.json({ integrations });
}
