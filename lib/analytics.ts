// One place for all website tracking.
// Sends events to Google Analytics 4 and (for Instagram/Facebook ads) the Meta Pixel.
// Both are switched on only when their IDs are set in Vercel:
//   NEXT_PUBLIC_GA_ID          e.g. G-XXXXXXXXXX
//   NEXT_PUBLIC_META_PIXEL_ID  e.g. 1234567890

type Params = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

export const GA_ID = process.env.NEXT_PUBLIC_GA_ID || "";
export const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID || "";

// Our event names → Meta's standard events, so Meta can optimise ads for them.
const META_STANDARD: Record<string, string> = {
  generate_lead: "Lead",
  whatsapp_click: "Contact",
  booking_open: "InitiateCheckout",
  project_view: "ViewContent",
};

// Extra signals worth sending to Meta for ad optimisation (the rest stay in Google Analytics only).
const META_CUSTOM = new Set(["scrolled_to_bottom", "booking_time_select", "booking_form_start", "engaged_time"]);

export function track(event: string, params: Params = {}) {
  if (typeof window === "undefined") return;
  const clean = Object.fromEntries(Object.entries(params).filter(([, v]) => v !== undefined && v !== ""));
  try {
    window.gtag?.("event", event, clean);
  } catch {}
  try {
    if (window.fbq) {
      const std = META_STANDARD[event];
      if (std) window.fbq("track", std, clean);
      else if (META_CUSTOM.has(event)) window.fbq("trackCustom", event, clean);
    }
  } catch {}
  if (process.env.NODE_ENV !== "production") console.debug("[track]", event, clean);
}

/* ---------- First-touch attribution: where did this visitor come from? ---------- */

const KEY = "lc_source";
export type Source = {
  utm_source?: string; utm_medium?: string; utm_campaign?: string; utm_content?: string; utm_term?: string;
  gclid?: string; fbclid?: string; referrer?: string; landing?: string; first_seen?: string;
};

export function captureSource() {
  if (typeof window === "undefined") return;
  try {
    const q = new URLSearchParams(location.search);
    const hasCampaign = ["utm_source", "gclid", "fbclid"].some((k) => q.get(k));
    const existing = localStorage.getItem(KEY);
    // Keep the first source we saw, unless this visit comes from a new ad/campaign.
    if (existing && !hasCampaign) return;
    const s: Source = {};
    ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "gclid", "fbclid"].forEach((k) => {
      const v = q.get(k);
      if (v) (s as Record<string, string>)[k] = v.slice(0, 120);
    });
    const ref = document.referrer && !document.referrer.includes(location.host) ? document.referrer : "";
    s.referrer = ref.slice(0, 200) || "direct";
    s.landing = location.pathname;
    s.first_seen = new Date().toISOString();
    localStorage.setItem(KEY, JSON.stringify(s));
  } catch {}
}

export function getSource(): Source {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "{}");
  } catch {
    return {};
  }
}

/** Short human label, e.g. "instagram / paid_social / diwali_offer" or "google.com" or "direct". */
export function sourceLabel(s: Source = getSource()) {
  if (s.utm_source) return [s.utm_source, s.utm_medium, s.utm_campaign].filter(Boolean).join(" / ");
  if (s.gclid) return "google ads";
  if (s.fbclid) return "facebook / instagram";
  if (s.referrer && s.referrer !== "direct") {
    try { return new URL(s.referrer).hostname.replace(/^www\./, ""); } catch { return s.referrer; }
  }
  return "direct";
}
