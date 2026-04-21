import { NextRequest, NextResponse } from "next/server";
import { verifyCredentials, verifyPassword, signToken } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  const { username, password } = body as { username?: string; password?: string };

  if (!password) {
    return NextResponse.json({ error: "Password required" }, { status: 400 });
  }

  // Accept either credentials-based (username + password) or legacy (password only)
  let valid = false;
  if (username) {
    valid = await verifyCredentials(username, password);
  } else {
    valid = await verifyPassword(password);
  }

  if (!valid) {
    return NextResponse.json({ error: "Invalid username or password" }, { status: 401 });
  }

  const token = signToken({
    role: "admin",
    username: username?.trim().toLowerCase() || "admin",
    iat: Date.now(),
  });

  const response = NextResponse.json({ success: true });
  response.cookies.set("lexiforge_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
  });

  return response;
}

/**
 * DELETE /api/auth — logout (clear cookie).
 */
export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.delete("lexiforge_token");
  return response;
}
