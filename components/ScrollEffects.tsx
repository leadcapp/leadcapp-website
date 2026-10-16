"use client";
import { useEffect } from "react";

// Compacts the nav, drifts the giant chapter words, and lights up the flow timeline on scroll.
export default function ScrollEffects() {
  useEffect(() => {
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const nav = document.getElementById("nav");
    let ticking = false;

    const frame = () => {
      const vh = innerHeight;
      nav?.classList.toggle("compact", scrollY > 120);

      if (!reduce) {
        document.querySelectorAll<HTMLElement>(".giant .t").forEach((g) => {
          const r = (g.parentNode as HTMLElement).getBoundingClientRect();
          const p = Math.max(0, Math.min(1, (vh - r.top) / (vh + r.height)));
          const dir = Number(g.dataset.dir || 1);
          g.style.transform = `translateX(${dir > 0 ? -(8 + p * 22) : -(30 - p * 22)}%)`;
        });
      }

      const flow = document.getElementById("flowList");
      const fill = document.getElementById("flowFill");
      if (flow && fill) {
        const fr = flow.getBoundingClientRect();
        const mid = vh * 0.55;
        fill.style.height = Math.max(0, Math.min(fr.height - 14, mid - fr.top)) + "px";
        flow.querySelectorAll<HTMLElement>(".step").forEach((s) =>
          s.classList.toggle("on", s.getBoundingClientRect().top < mid)
        );
      }
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(frame);
      }
    };
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("resize", frame);
    frame();
    return () => {
      removeEventListener("scroll", onScroll);
      removeEventListener("resize", frame);
    };
  }, []);
  return null;
}
