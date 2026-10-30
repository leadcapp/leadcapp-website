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
    const ctx = cv.getContext("2d", { alpha: false });
    if (!ctx) return;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    // The waves are soft blurs, so drawing them at ~40% resolution looks the same
    // but costs ~6x less work. This matters on Windows laptops with 125–150% scaling.
    const RES = 0.4;
    const FRAME_MS = 1000 / 30; // 30 fps is plenty for slow-moving waves
    const t0 = performance.now();
    let W = 0, H = 0, raf = 0, last = 0, visible = true;

    const size = () => {
      const r = cv.getBoundingClientRect();
      W = r.width; H = r.height;
      cv.width = Math.max(1, Math.round(W * RES)); cv.height = Math.max(1, Math.round(H * RES));
      ctx.setTransform(RES, 0, 0, RES, 0, 0);
      paint(performance.now());
    };

    const paint = (now: number) => {
      const t = now - t0;
      const g = ctx.createRadialGradient(W * 0.62, H * 0.28, 0, W * 0.62, H * 0.28, Math.max(W, H) * 0.8);
      g.addColorStop(0, "#2b2b2d"); g.addColorStop(0.55, "#161617"); g.addColorStop(1, "#101010");
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
      const bands = W < 720 ? mobileBands : desktopBands;
      bands.forEach((b, i) => {
        ctx.beginPath();
        for (let x = -40; x <= W + 40; x += 24) {
          const u = x / W;
          const y = H * (b.y + b.a * Math.sin(u * Math.PI * b.f + t * b.s * 6 + i) * Math.cos(u * 1.3 - t * b.s * 3));
          if (x === -40) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        ctx.lineWidth = Math.max(2, H * b.w);
        ctx.strokeStyle = `rgba(235,238,248,${b.o})`;
        // blur radius is in canvas pixels, so scale it down with the resolution
        ctx.filter = `blur(${Math.max(4, H * b.w * 0.45 * RES)}px)`;
        ctx.stroke();
      });
      ctx.filter = "none";
      // Dark glow behind the headline so the text always stays readable.
      const tx = W * 0.5, ty = Math.min(H * 0.3, 420), tr = Math.max(W * 0.6, 420);
      const shade = ctx.createRadialGradient(tx, ty, 0, tx, ty, tr);
      shade.addColorStop(0, "rgba(16,16,16,0.82)"); shade.addColorStop(0.55, "rgba(16,16,16,0.45)"); shade.addColorStop(1, "rgba(16,16,16,0)");
      ctx.fillStyle = shade; ctx.fillRect(0, 0, W, H);
    };

    const loop = (now: number) => {
      if (now - last >= FRAME_MS) { last = now; paint(now); }
      raf = requestAnimationFrame(loop);
    };
    const start = () => { cancelAnimationFrame(raf); if (!reduce && visible && !document.hidden) raf = requestAnimationFrame(loop); };
    const stop = () => cancelAnimationFrame(raf);

    // Only animate while the hero is on screen and the tab is visible.
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible) start(); else stop(); });
    io.observe(cv);
    const onVis = () => (document.hidden ? stop() : start());

    size();
    addEventListener("resize", size);
    document.addEventListener("visibilitychange", onVis);
    if (reduce) paint(t0 + 4000); else start();
    return () => {
      stop();
      io.disconnect();
      removeEventListener("resize", size);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  return <canvas id="waves" ref={ref} aria-hidden="true" />;
}
