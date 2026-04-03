import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET || "lexiforge-secret-change-me";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin";

export async function verifyPassword(password: string): Promise<boolean> {
  if (ADMIN_PASSWORD.startsWith("$2")) {
    return bcrypt.compare(password, ADMIN_PASSWORD);
  }
  return password === ADMIN_PASSWORD;
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
