"use client";
import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { CLARITY_ID, GA_ID, META_PIXEL_ID, captureSource, sourceLabel, track } from "@/lib/analytics";

/**
 * Loads Google Analytics 4, the Meta Pixel and Microsoft Clarity, and tracks:
 * - scroll depth (25 / 50 / 75 / 90 / 100%)
 * - which sections were seen (questions, work, pricing, flow, services, contact)
 * - clicks on anything with data-track="name" (plus data-track-* extra details)
 * - outbound clicks (Instagram, Figma, email)
 * - project carousel use and case study page views
 * - time on page milestones (30s, 60s, 3min) as a sign of real interest
 */
export default function Analytics() {
  const pathname = usePathname();
  const first = useRef(true);

  // Remember where the visitor came from (ad, Google, Instagram, direct…)
  useEffect(() => { captureSource(); }, []);

  // Page views on client-side navigation (first load is sent by the scripts themselves)
  useEffect(() => {
    if (first.current) { first.current = false; return; }
    try { window.fbq?.("track", "PageView"); } catch {}
    try { if (GA_ID) window.gtag?.("event", "page_view", { page_path: pathname, page_location: location.href }); } catch {}
  }, [pathname]);

  // Case study views
  useEffect(() => {
    const m = pathname.match(/^\/work\/([^/]+)/);
    if (m) track("project_view", { project: m[1], content_name: m[1], source: sourceLabel() });
  }, [pathname]);

  // Scroll depth + section views + engaged time, reset on every page
  useEffect(() => {
    const marks = [25, 50, 75, 90, 100];
    const hit = new Set<number>();
    let queued = false;
    const onScroll = () => {
      // at most once per frame, and stop listening once every mark is reached
      if (queued || hit.size === marks.length) return;
      queued = true;
      requestAnimationFrame(() => { queued = false; check(); });
    };
    const check = () => {
      const h = document.documentElement.scrollHeight - innerHeight;
      if (h <= 0) return;
      const pct = Math.round((scrollY / h) * 100);
      for (const m of marks) {
        if (pct >= m && !hit.has(m)) {
          hit.add(m);
          track("scroll_depth", { percent: m, page: pathname });
          if (m === 100) track("scrolled_to_bottom", { page: pathname });
        }
      }
    };
    addEventListener("scroll", onScroll, { passive: true });

    const seen = new Set<string>();
    const io = "IntersectionObserver" in window ? new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        const id = (e.target as HTMLElement).id;
        if (e.isIntersecting && id && !seen.has(id)) {
          seen.add(id);
          track("section_view", { section: id, page: pathname });
        }
      });
    }, { threshold: 0, rootMargin: "-45% 0px -45% 0px" }) : null; // counts a section once it crosses the middle of the screen
    document.querySelectorAll("section[id]").forEach((s) => io?.observe(s));

    const timers = [30, 60, 180].map((sec) => setTimeout(() => {
      if (document.visibilityState === "visible") track("engaged_time", { seconds: sec, page: pathname });
    }, sec * 1000));

    return () => { removeEventListener("scroll", onScroll); io?.disconnect(); timers.forEach(clearTimeout); };
  }, [pathname]);

  // Click tracking: data-track buttons, outbound links, carousel arrows
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const el = e.target as HTMLElement;
      const tagged = el.closest<HTMLElement>("[data-track]");
      if (tagged) {
        const extra: Record<string, string> = {};
        Object.entries(tagged.dataset).forEach(([k, v]) => {
          if (k.startsWith("track") && k !== "track" && v) extra[k.replace(/^track/, "").toLowerCase()] = v;
        });
        track(tagged.dataset.track!, { ...extra, page: location.pathname });
      }
      const a = el.closest<HTMLAnchorElement>("a[href]");
      if (a && !tagged) {
        const href = a.getAttribute("href") || "";
        if (href.includes("instagram.com")) track("instagram_click", { location: where(a) });
        else if (href.includes("figma.com")) track("figma_click", { location: where(a) });
        else if (href.startsWith("mailto:")) track("email_click", { location: where(a) });
        else if (href.startsWith("tel:")) track("phone_click", { location: where(a) });
        else if (href.includes("wa.me")) track("whatsapp_click", { location: where(a) });
        else if (href.startsWith("/work/")) track("project_click", { project: href.split("/")[2], location: where(a) });
      }
      if (el.closest(".car-head .arrow")) track("projects_carousel", { direction: el.closest('[aria-label^="Next"]') ? "next" : "previous" });
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  return (
    <>
      {GA_ID && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
          <Script id="ga4" strategy="afterInteractive">{`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            window.gtag = gtag;
            gtag('js', new Date());
            gtag('config', '${GA_ID}');
          `}</Script>
        </>
      )}
      {META_PIXEL_ID && (
        <Script id="meta-pixel" strategy="afterInteractive">{`
          !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
          n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
          document,'script','https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '${META_PIXEL_ID}');
          fbq('track', 'PageView');
        `}</Script>
      )}
      {CLARITY_ID && (
        <Script id="ms-clarity" strategy="afterInteractive">{`
          (function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
          t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
          y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
          })(window, document, "clarity", "script", "${CLARITY_ID}");
        `}</Script>
      )}
    </>
  );
}

// Which part of the page a click came from, e.g. "nav", "hero", "pricing", "footer"
export function where(el: Element): string {
  if (el.closest("nav")) return "nav";
  if (el.closest(".status")) return "status_pill";
  if (el.closest(".hero")) return "hero";
  if (el.closest(".foot")) return "footer";
  if (el.closest(".case-cta")) return "case_study_cta";
  if (el.closest(".case-hero")) return "case_study";
  return el.closest("section[id]")?.id || "page";
}
