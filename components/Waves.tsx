"use client";
import { useEffect, useRef } from "react";

// Soft, slow-moving silk waves behind the hero.
// Desktop: soft bands that sit low, under the headline. Mobile: fewer, fainter, slower.
const desktopBands = [
  { y: 0.58, a: 0.07, f: 1.1, s: 0.00008, w: 0.30, o: 0.07 },
  { y: 0.70, a: 0.08, f: 0.8, s: 0.00006, w: 0.36, o: 0.06 },
  { y: 0.52, a: 0.05, f: 1.6, s: 0.0001, w: 0.08, o: 0.10 },
  { y: 0.80, a: 0.06, f: 0.9, s: 0.00007, w: 0.26, o: 0.05 },
];
const mobileBands = [
  { y: 0.68, a: 0.05, f: 0.9, s: 0.00005, w: 0.22, o: 0.06 },
  { y: 0.80, a: 0.05, f: 0.7, s: 0.00004, w: 0.26, o: 0.05 },
];

export default function Waves() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(devicePixelRatio || 1, 2);
    const t0 = performance.now();
    let W = 0, H = 0, raf = 0;

    const size = () => {
      const r = cv.getBoundingClientRect();
      W = r.width; H = r.height;
      cv.width = W * dpr; cv.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = (now: number) => {
      const t = now - t0;
      ctx.clearRect(0, 0, W, H);
      const g = ctx.createRadialGradient(W * 0.62, H * 0.28, 0, W * 0.62, H * 0.28, Math.max(W, H) * 0.8);
      g.addColorStop(0, "#2b2b2d"); g.addColorStop(0.55, "#161617"); g.addColorStop(1, "#101010");
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
      const bands = W < 720 ? mobileBands : desktopBands;
      bands.forEach((b, i) => {
        ctx.beginPath();
        for (let x = -40; x <= W + 40; x += 16) {
          const u = x / W;
          const y = H * (b.y + b.a * Math.sin(u * Math.PI * b.f + t * b.s * 6 + i) * Math.cos(u * 1.3 - t * b.s * 3));
          if (x === -40) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        ctx.lineWidth = Math.max(2, H * b.w);
        ctx.strokeStyle = `rgba(235,238,248,${b.o})`;
        ctx.filter = `blur(${Math.max(10, H * b.w * 0.45)}px)`;
        ctx.stroke();
      });
      ctx.filter = "none";
      // Dark glow behind the headline so the text always stays readable.
      const tx = W * 0.5, ty = Math.min(H * 0.3, 420), tr = Math.max(W * 0.6, 420);
      const shade = ctx.createRadialGradient(tx, ty, 0, tx, ty, tr);
      shade.addColorStop(0, "rgba(16,16,16,0.82)"); shade.addColorStop(0.55, "rgba(16,16,16,0.45)"); shade.addColorStop(1, "rgba(16,16,16,0)");
      ctx.fillStyle = shade; ctx.fillRect(0, 0, W, H);
      if (!reduce && !document.hidden) raf = requestAnimationFrame(draw);
    };

    const onVis = () => { if (!document.hidden && !reduce) { cancelAnimationFrame(raf); raf = requestAnimationFrame(draw); } };
    size();
    addEventListener("resize", size);
    document.addEventListener("visibilitychange", onVis);
    if (reduce) draw(t0 + 4000); else raf = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf);
      removeEventListener("resize", size);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  return <canvas id="waves" ref={ref} aria-hidden="true" />;
}
