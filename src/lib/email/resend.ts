import { Resend } from "resend";

/**
 * Resend client singleton.
 *
 * Returns null if RESEND_API_KEY is not set (dev / pre-credential state).
 * Callers must handle the null case and fall back to logging.
 */
let _client: Resend | null = null;

export function getResend(): Resend | null {
  if (_client) return _client;
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  _client = new Resend(key);
  return _client;
}

export const FROM_EMAIL = process.env.FROM_EMAIL || "hello@lexireview.in";
export const FROM_NAME = process.env.FROM_NAME || "LexiReview";
export const REPLY_TO = process.env.REPLY_TO || "founder@lexireview.in";
