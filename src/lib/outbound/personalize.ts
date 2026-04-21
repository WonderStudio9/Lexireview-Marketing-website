/**
 * Claude-powered cold email personalization.
 *
 * Replaces {{firstLine}} in a template body with a 1-2 sentence opener that
 * references the prospect's account + role context. In stub mode (no
 * ANTHROPIC_API_KEY) returns a sensible generic opener.
 *
 * Other placeholders supported at fill time: {{firstName}}, {{lastName}},
 * {{company}}, {{title}}, {{city}}.
 */
import Anthropic from "@anthropic-ai/sdk";

const MODEL = "claude-sonnet-4-5-20250929";

export interface PersonalizeAccountContext {
  name: string;
  industry?: string | null;
  subIndustry?: string | null;
  city?: string | null;
  state?: string | null;
  tier?: string | null;
  icp?: string | null;
  website?: string | null;
  linkedinUrl?: string | null;
  enrichmentData?: unknown;
}

export interface PersonalizeContactContext {
  firstName: string;
  lastName?: string | null;
  title?: string | null;
  seniority?: string | null;
  department?: string | null;
  linkedinUrl?: string | null;
}

export interface PersonalizeInput {
  template: string;
  subject?: string;
  account: PersonalizeAccountContext;
  contact: PersonalizeContactContext;
}

export interface PersonalizeResult {
  subject?: string;
  body: string;
  firstLine: string;
  stubbed?: boolean;
}

let _anthropic: Anthropic | null = null;

function getAnthropic(): Anthropic | null {
  if (_anthropic) return _anthropic;
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) return null;
  _anthropic = new Anthropic({ apiKey: key });
  return _anthropic;
}

function fillPlaceholders(
  str: string,
  contact: PersonalizeContactContext,
  account: PersonalizeAccountContext,
  firstLine: string,
): string {
  return str
    .replaceAll("{{firstName}}", contact.firstName)
    .replaceAll("{{lastName}}", contact.lastName ?? "")
    .replaceAll("{{company}}", account.name)
    .replaceAll("{{title}}", contact.title ?? "")
    .replaceAll("{{city}}", account.city ?? "")
    .replaceAll("{{firstLine}}", firstLine);
}

/** Generic stub opener — used when Anthropic key is missing or call fails. */
function genericFirstLine(
  contact: PersonalizeContactContext,
  account: PersonalizeAccountContext,
): string {
  const role = contact.title ? contact.title : "your work";
  const industry = account.industry ?? "your sector";
  return `I was researching ${account.name} and spotted how ${role} at a ${industry} shop often juggles contract review alongside everything else.`;
}

export async function personalizeEmail(
  input: PersonalizeInput,
): Promise<PersonalizeResult> {
  const client = getAnthropic();

  // Stub path
  if (!client) {
    const fallback = genericFirstLine(input.contact, input.account);
    return {
      subject: input.subject
        ? fillPlaceholders(input.subject, input.contact, input.account, fallback)
        : undefined,
      body: fillPlaceholders(input.template, input.contact, input.account, fallback),
      firstLine: fallback,
      stubbed: true,
    };
  }

  const prompt = [
    `You are writing the first line of a cold email to a prospect.`,
    `Write exactly 1 to 2 sentences, under 40 words. No greeting, no sign-off.`,
    `Reference something specific about the account or role. Do not make up facts.`,
    `Tone: peer-to-peer, warm, low-pressure. Indian legal market context.`,
    ``,
    `PROSPECT:`,
    `- Name: ${input.contact.firstName} ${input.contact.lastName ?? ""}`.trim(),
    `- Title: ${input.contact.title ?? "(unknown)"}`,
    `- Department: ${input.contact.department ?? "(unknown)"}`,
    ``,
    `COMPANY:`,
    `- Name: ${input.account.name}`,
    `- Industry: ${input.account.industry ?? "(unknown)"}${input.account.subIndustry ? ` / ${input.account.subIndustry}` : ""}`,
    `- Location: ${[input.account.city, input.account.state].filter(Boolean).join(", ") || "(unknown)"}`,
    `- Tier/ICP: ${input.account.tier ?? ""} ${input.account.icp ?? ""}`.trim(),
    input.account.enrichmentData
      ? `- Context: ${JSON.stringify(input.account.enrichmentData).slice(0, 400)}`
      : null,
    ``,
    `Return ONLY the 1-2 sentence opener, nothing else.`,
  ]
    .filter(Boolean)
    .join("\n");

  try {
    const response = await client.messages.create({
      model: MODEL,
      max_tokens: 200,
      messages: [{ role: "user", content: prompt }],
    });
    const text = response.content
      .map((c) => (c.type === "text" ? c.text : ""))
      .join("\n")
      .trim();
    const firstLine = text || genericFirstLine(input.contact, input.account);
    return {
      subject: input.subject
        ? fillPlaceholders(input.subject, input.contact, input.account, firstLine)
        : undefined,
      body: fillPlaceholders(input.template, input.contact, input.account, firstLine),
      firstLine,
    };
  } catch (err) {
    console.error("[outbound/personalize] Claude call failed", err);
    const fallback = genericFirstLine(input.contact, input.account);
    return {
      subject: input.subject
        ? fillPlaceholders(input.subject, input.contact, input.account, fallback)
        : undefined,
      body: fillPlaceholders(input.template, input.contact, input.account, fallback),
      firstLine: fallback,
      stubbed: true,
    };
  }
}
