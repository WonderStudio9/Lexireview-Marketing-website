/**
 * Client-side page view tracking helper.
 * Call trackPageView() on mount + on route change in marketing pages.
 */

function getOrCreateAnonymousId(): string {
  if (typeof window === "undefined") return "";
  const KEY = "lxr_aid";
  let id = localStorage.getItem(KEY);
  if (!id) {
    id = `v_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
    try {
      localStorage.setItem(KEY, id);
    } catch {
      // localStorage may be blocked — fall back to per-session ID
    }
  }
  return id;
}

interface TrackPageViewParams {
  leadEmail?: string;
}

export function trackPageView(params: TrackPageViewParams = {}): void {
  if (typeof window === "undefined") return;

  const anonymousId = getOrCreateAnonymousId();
  if (!anonymousId) return;

  const search = new URLSearchParams(window.location.search);

  const payload = {
    anonymousId,
    path: window.location.pathname + window.location.search,
    title: document.title,
    referrer: document.referrer || undefined,
    utmSource: search.get("utm_source") || undefined,
    utmMedium: search.get("utm_medium") || undefined,
    utmCampaign: search.get("utm_campaign") || undefined,
    leadEmail: params.leadEmail,
  };

  // Fire-and-forget; use sendBeacon when possible for reliability on page unload
  if (navigator.sendBeacon) {
    const blob = new Blob([JSON.stringify(payload)], { type: "application/json" });
    navigator.sendBeacon("/api/track", blob);
  } else {
    fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      keepalive: true,
    }).catch(() => {});
  }
}

export function getAnonymousId(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("lxr_aid");
}
