"use client";
import { useEffect, useRef, useState } from "react";

export default function Carousel({ children }: { children: React.ReactNode }) {
  const track = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const upd = () => {
      setAtStart(el.scrollLeft < 4);
      setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 4);
    };
    upd();
    el.addEventListener("scroll", upd, { passive: true });
    addEventListener("resize", upd);
    return () => { el.removeEventListener("scroll", upd); removeEventListener("resize", upd); };
  }, []);

  const step = (dir: number) => {
    const el = track.current;
    const card = el?.querySelector(".proj");
    el?.scrollBy({ left: dir * ((card?.getBoundingClientRect().width ?? 400) + 18), behavior: "smooth" });
  };

  return (
    <div>
      <div className="car-head">
        <button className="arrow" type="button" aria-label="Previous project" disabled={atStart} onClick={() => step(-1)}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 6l-6 6 6 6" /></svg>
        </button>
        <button className="arrow" type="button" aria-label="Next project" disabled={atEnd} onClick={() => step(1)}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 6l6 6-6 6" /></svg>
        </button>
      </div>
      <div className="track" ref={track}>{children}</div>
    </div>
  );
}
