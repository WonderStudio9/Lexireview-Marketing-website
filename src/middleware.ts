import { NextRequest, NextResponse } from "next/server";

/**
 * Middleware guards the `/forge/*` dashboard and `/api/*` (auth-required)
 * endpoints. Unauthenticated visitors to /forge are redirected to login.
 */

const PROTECTED_API_PREFIXES = [
  "/api/content",
  "/api/leads",
  "/api/agents",
  "/api/seo",
  "/api/cron",
  "/api/deals",
  "/api/accounts",
  "/api/contacts",
  "/api/campaigns",
  "/api/attribution",
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("lexiforge_token")?.value;

  // Allow login page + auth endpoint through
  if (pathname === "/forge/login" || pathname === "/api/auth") {
    return NextResponse.next();
  }

  // /forge/* (except /forge/login) requires auth
  if (pathname.startsWith("/forge")) {
    if (!token) {
      const loginUrl = new URL("/forge/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  // Protect specific API prefixes (cron uses ?secret= instead of cookie)
  const isProtectedApi = PROTECTED_API_PREFIXES.some((p) => pathname.startsWith(p));
  if (isProtectedApi && pathname !== "/api/cron/outreach") {
    // API routes handle their own auth via isAuthenticated(); middleware just lets them through
    // but we could short-circuit here if desired.
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/forge/:path*", "/api/:path*"],
};
