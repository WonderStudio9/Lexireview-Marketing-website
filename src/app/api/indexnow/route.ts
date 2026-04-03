import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";

const INDEXNOW_KEY = "8109ea36b0b5669da5e71c1161b30154";
const SITE_HOST = "lexireview.in";

export async function POST(request: NextRequest) {
  const authed = await isAuthenticated();
  if (!authed) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const urls: string[] = body.urls || [];

  if (urls.length === 0) {
    return NextResponse.json({ error: "No URLs provided" }, { status: 400 });
  }

  const payload = {
    host: SITE_HOST,
    key: INDEXNOW_KEY,
    keyLocation: `https://${SITE_HOST}/${INDEXNOW_KEY}.txt`,
    urlList: urls,
  };

  const results: Record<string, string> = {};

  // Submit to IndexNow endpoints (Bing, Yandex, Seznam, Naver)
  const endpoints = [
    "https://api.indexnow.org/indexnow",
    "https://www.bing.com/indexnow",
    "https://yandex.com/indexnow",
  ];

  for (const endpoint of endpoints) {
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=utf-8" },
        body: JSON.stringify(payload),
      });
      results[endpoint] = `${res.status} ${res.statusText}`;
    } catch (err) {
      results[endpoint] = `Error: ${err instanceof Error ? err.message : "unknown"}`;
    }
  }

  return NextResponse.json({
    submitted: urls.length,
    results,
  });
}
