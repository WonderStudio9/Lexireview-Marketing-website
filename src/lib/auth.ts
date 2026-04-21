import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET || "lexiforge-secret-change-me";

/**
 * Hardcoded credentials (fallback when ADMIN_USERNAME/ADMIN_PASSWORD not set).
 * Override via env vars for production security.
 */
const HARDCODED_USERNAME = "admin";
const HARDCODED_PASSWORD = "LexiForge@2026";

function getAdminUsername(): string {
  return process.env.ADMIN_USERNAME || HARDCODED_USERNAME;
}

function getAdminPassword(): string {
  return process.env.ADMIN_PASSWORD || HARDCODED_PASSWORD;
}

/**
 * Legacy API (password only) — kept for backward compatibility.
 */
export async function verifyPassword(password: string): Promise<boolean> {
  const stored = getAdminPassword();
  if (stored.startsWith("$2")) return bcrypt.compare(password, stored);
  return password === stored;
}

/**
 * Username + password verification (new API).
 */
export async function verifyCredentials(
  username: string,
  password: string,
): Promise<boolean> {
  const storedUser = getAdminUsername();
  if (username.trim().toLowerCase() !== storedUser.toLowerCase()) return false;
  return verifyPassword(password);
}

export function signToken(payload: Record<string, unknown>): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string): Record<string, unknown> | null {
  try {
    return jwt.verify(token, JWT_SECRET) as Record<string, unknown>;
  } catch {
    return null;
  }
}

export async function getSession(): Promise<Record<string, unknown> | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("lexiforge_token")?.value;
  if (!token) return null;
  return verifyToken(token);
}

export async function isAuthenticated(): Promise<boolean> {
  const session = await getSession();
  return session !== null;
}
