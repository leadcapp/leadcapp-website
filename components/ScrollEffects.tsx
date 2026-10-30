"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

// Compacts the nav, drifts the giant chapter words, and lights up the flow timeline on scroll.
// Performance notes (these matter most on Windows laptops):
// - positions are measured once (and again only when the page size changes), never per frame
// - per-frame work only writes transforms/classes, so the browser never has to re-layout
// - the scrolling questions columns pause while off screen
export default function ScrollEffects() {
  // Re-run on every page change, because positions are cached per page
  const pathname = usePathname();
  useEffect(() => {
    const root = document.documentElement;
    // Windows-specific tweaks in CSS (e.g. no frosted-glass blur on fixed elements)
    const isWin = /Win/i.test((navigator as Navigator & { userAgentData?: { platform?: string } }).userAgentData?.platform || navigator.platform || navigator.userAgent);
    root.classList.toggle("win", isWin);

    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const nav = document.getElementById("nav");
    const flow = document.getElementById("flowList");
    const fill = document.getElementById("flowFill");

    type Giant = { el: HTMLElement; top: number; height: number; dir: number; last: string };
    let giants: Giant[] = [];
    let steps: { el: HTMLElement; top: number; on: boolean }[] = [];
    let flowTop = 0, flowHeight = 0, vh = innerHeight, compact = false, lastFill = -1;

    const pageTop = (el: Element) => el.getBoundingClientRect().top + scrollY;

    const measure = () => {
      vh = innerHeight;
      giants = Array.from(document.querySelectorAll<HTMLElement>(".giant .t")).map((el) => {
        const box = el.parentNode as HTMLElement;
        return { el, top: pageTop(box), height: box.offsetHeight, dir: Number(el.dataset.dir || 1), last: "" };
      });
      if (flow) {
        flowTop = pageTop(flow);
        flowHeight = flow.offsetHeight;
        steps = Array.from(flow.querySelectorAll<HTMLElement>(".step")).map((el) => ({ el, top: pageTop(el), on: el.classList.contains("on") }));
      }
      frame();
    };

    const frame = () => {
      const y = scrollY;
      const isCompact = y > 120;
      if (isCompact !== compact) { compact = isCompact; nav?.classList.toggle("compact", compact); }

      if (!reduce) {
        for (const g of giants) {
          const top = g.top - y;
          if (top > vh || top + g.height < 0) continue; // off screen: skip
          const p = Math.max(0, Math.min(1, (vh - top) / (vh + g.height)));
          const v = `translate3d(${(g.dir > 0 ? -(8 + p * 22) : -(30 - p * 22)).toFixed(2)}%,0,0)`;
          if (v !== g.last) { g.el.style.transform = v; g.last = v; }
        }
      }

      if (fill && flowHeight) {
        const mid = y + vh * 0.55;
        const scale = Math.max(0, Math.min(1, (mid - flowTop - 14) / Math.max(1, flowHeight - 14)));
        const s = Math.round(scale * 1000) / 1000;
        if (s !== lastFill) { fill.style.transform = `scaleY(${s})`; lastFill = s; }
        for (const st of steps) {
          const on = st.top < mid;
          if (on !== st.on) { st.on = on; st.el.classList.toggle("on", on); }
        }
      }
    };

    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(() => { ticking = false; frame(); });
      }
    };

    // Re-measure when the page size changes (images/fonts loading, window resize)
    let measureQueued = 0;
    const queueMeasure = () => { cancelAnimationFrame(measureQueued); measureQueued = requestAnimationFrame(measure); };
    const ro = new ResizeObserver(queueMeasure);
    ro.observe(document.body);

    // Pause the endless questions columns while they're not on screen
    const reviews = document.querySelector(".reviews");
    const io = reviews ? new IntersectionObserver(([e]) => reviews.classList.toggle("inview", e.isIntersecting), { rootMargin: "100px" }) : null;
    if (reviews) io!.observe(reviews);

    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("resize", queueMeasure);
    measure();
    return () => {
      removeEventListener("scroll", onScroll);
      removeEventListener("resize", queueMeasure);
      ro.disconnect();
      io?.disconnect();
      cancelAnimationFrame(measureQueued);
    };
  }, [pathname]);
  return null;
}
