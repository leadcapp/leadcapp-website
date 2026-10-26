"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { booking, site } from "@/lib/data";
import { track, getSource, sourceLabel } from "@/lib/analytics";
import { where } from "./Analytics";

const MON = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const DAY = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
const DAYL = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const DAYMS = 864e5;

type Step = "pick" | "form" | "done";

function istNow() {
  const o: Record<string, number> = {};
  new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Kolkata", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hourCycle: "h23" })
    .formatToParts(new Date())
    .forEach((p) => { if (p.type !== "literal") o[p.type] = +p.value; });
  return o;
}
const ord = (n: number) => { const s = ["th", "st", "nd", "rd"], v = n % 100; return n + (s[(v - 20) % 10] || s[v] || s[0]); };
const dateLong = (t: number) => { const d = new Date(t); return `${DAYL[d.getUTCDay()]}, ${d.getUTCDate()} ${MON[d.getUTCMonth()].slice(0, 3)} ${d.getUTCFullYear()}`; };
const h12 = (h: number) => `${h % 12 || 12}:00 ${h < 12 ? "am" : "pm"}`;

export default function Booking() {
  const [open, setOpen] = useState(false);
  const [shown, setShown] = useState(false);
  const [step, setStep] = useState<Step>("pick");
  const [fmt24, setFmt24] = useState(false);
  const [sel, setSel] = useState<number | null>(null);
  const [view, setView] = useState<number>(0);
  const [slot, setSlot] = useState<{ t: number; h: number } | null>(null);
  const [err, setErr] = useState("");
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<{ sent: boolean; name: string; text: string } | null>(null);
  const lastFocus = useRef<HTMLElement | null>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);
  // For analytics: where the pop-up was opened from, and how far the visitor got.
  const openedFrom = useRef("unknown");
  const stepRef = useRef<Step>("pick");
  const openRef = useRef(false);
  const formStarted = useRef(false);
  stepRef.current = step;
  openRef.current = open;

  // Dates are handled as UTC midnights of the India calendar day.
  const cal = useMemo(() => {
    const N = istNow();
    const TODAY = Date.UTC(N.year, N.month - 1, N.day);
    const LAST = TODAY + booking.daysAhead * DAYMS;
    const hoursFor = (t: number) => {
      if (t < TODAY || t > LAST || booking.closedWeekdays.includes(new Date(t).getUTCDay())) return [];
      return booking.hours.filter((h) => t > TODAY || h > N.hour);
    };
    const avail = (t: number) => hoursFor(t).length > 0;
    const nextAvail = (t: number, dir: number) => {
      for (let i = 0; i < 60; i++) { t += dir * DAYMS; if (t < TODAY || t > LAST) return null; if (avail(t)) return t; }
      return null;
    };
    const first = avail(TODAY) ? TODAY : nextAvail(TODAY, 1);
    return { N, TODAY, LAST, hoursFor, avail, nextAvail, first };
    // recompute each time the modal opens so "today" stays current
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const choose = useCallback((t: number) => {
    setSel(t);
    const d = new Date(t);
    setView(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), 1));
  }, []);

  const openModal = useCallback((from: string) => {
    openedFrom.current = from;
    formStarted.current = false;
    track("booking_open", { location: from, source: sourceLabel() });
    lastFocus.current = document.activeElement as HTMLElement;
    setOpen(true);
    document.body.style.overflow = "hidden";
    requestAnimationFrame(() => { setShown(true); closeBtn.current?.focus(); });
  }, []);

  const close = useCallback(() => {
    if (!openRef.current) return;
    // Closed without finishing = dropped off at this step
    if (stepRef.current !== "done") track("booking_abandon", { step: stepRef.current === "pick" ? "choosing_time" : "filling_details", location: openedFrom.current });
    setShown(false);
    document.body.style.overflow = "";
    setTimeout(() => setOpen(false), 300);
    lastFocus.current?.focus?.();
  }, []);

  // Any element with data-book opens the modal.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const b = (e.target as HTMLElement).closest<HTMLElement>("[data-book]");
      if (b) { e.preventDefault(); openModal(b.dataset.book || where(b)); }
    };
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") close(); };
    document.addEventListener("click", onClick);
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("click", onClick); document.removeEventListener("keydown", onKey); };
  }, [openModal, close]);

  useEffect(() => {
    if (open && sel === null && cal.first !== null) choose(cal.first);
    if (open && step === "done") { setStep("pick"); setSlot(null); setResult(null); }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  if (!open) return null;

  const v = new Date(view), y = v.getUTCFullYear(), m = v.getUTCMonth();
  const lead = (new Date(Date.UTC(y, m, 1)).getUTCDay() + 6) % 7;
  const nDays = new Date(Date.UTC(y, m + 1, 0)).getUTCDate();
  const second = sel !== null ? cal.nextAvail(sel, 1) : null;
  const cols = sel !== null ? [sel, ...(second !== null ? [second] : [])] : [];
  const da = sel !== null ? new Date(sel) : null, db = second !== null ? new Date(second) : null;
  const tl = (h: number) => (fmt24 ? `${String(h).padStart(2, "0")}:00` : `${h % 12 || 12}:00${h < 12 ? "am" : "pm"}`);
  const picked = slot ? `${dateLong(slot.t)} at ${h12(slot.h)} IST` : "";

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const d = Object.fromEntries(f.entries()) as Record<string, string>;
    if (!d.name?.trim()) { setErr("Please add your name."); track("booking_form_error", { field: "name" }); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email || "")) { setErr("Please add a valid email so we can send the meeting link."); track("booking_form_error", { field: "email" }); return; }
    setErr(""); setSending(true);
    const text = `New call booking for LeadCapp\n\nWhen: ${picked}\nName: ${d.name}\nEmail: ${d.email}\nPhone: ${d.phone || "-"}\nProject: ${d.project}\nBudget: ${d.budget}\nCall on: ${d.mode}\n\nIdea:\n${d.message || "-"}`;
    let sent = false;
    try {
      const r = await fetch("/api/book", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...d, when: picked, source: sourceLabel(), sourceDetail: getSource(), openedFrom: openedFrom.current }) });
      const j = await r.json();
      sent = !!j.ok;
    } catch { sent = false; }
    setSending(false);
    setResult({ sent, name: d.name.trim().split(" ")[0], text });
    // The key conversion: a completed booking request
    track("generate_lead", { method: sent ? "email" : "whatsapp_handoff", project: d.project, budget: d.budget, call_on: d.mode, location: openedFrom.current, source: sourceLabel(), currency: "INR", value: 30000 });
    setStep("done");
  }

  const wa = result ? `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(result.text)}` : "#";

  return (
    <div className={`bk-back ${shown ? "open" : ""}`} role="dialog" aria-modal="true" aria-labelledby="bkTitle" onClick={(e) => { if (e.target === e.currentTarget) close(); }}>
      <div className="bk">
        <div className="bk-top">
          <h2 id="bkTitle">Let&apos;s Build!</h2>
          <button className="x" ref={closeBtn} type="button" aria-label="Close" onClick={close}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 6l12 12M18 6 6 18" /></svg>
          </button>
        </div>

        {step === "pick" && (
          <div className="bk-body">
            <div className="cal">
              <div className="cal-h">
                <b>{MON[m]} <span>{y}</span></b>
                <div className="nav-btns">
                  <button className="nb" type="button" aria-label="Previous month" disabled={Date.UTC(y, m, 1) <= Date.UTC(cal.N.year, cal.N.month - 1, 1)} onClick={() => setView(Date.UTC(y, m - 1, 1))}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 6l-6 6 6 6" /></svg>
                  </button>
                  <button className="nb" type="button" aria-label="Next month" disabled={Date.UTC(y, m + 1, 1) > cal.LAST} onClick={() => setView(Date.UTC(y, m + 1, 1))}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 6l6 6-6 6" /></svg>
                  </button>
                </div>
              </div>
              <div className="dow">{["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"].map((d) => <span key={d}>{d}</span>)}</div>
              <div className="days">
                {Array.from({ length: lead }).map((_, i) => <span key={"b" + i} />)}
                {Array.from({ length: nDays }).map((_, i) => {
                  const t = Date.UTC(y, m, i + 1);
                  const ok = cal.avail(t);
                  return (
                    <button key={t} type="button" disabled={!ok} aria-label={ok ? dateLong(t) : undefined}
                      className={`day ${ok ? "av" : ""} ${t === sel ? "sel" : ""} ${t === cal.TODAY ? "today" : ""}`}
                      onClick={() => { if (ok) { choose(t); track("booking_date_select", { weekday: DAYL[new Date(t).getUTCDay()] }); } }}>{i + 1}</button>
                  );
                })}
              </div>
              <p className="tz">30-minute call on Google Meet or phone. Times are in India time (IST). Sundays closed.</p>
            </div>

            <div className="slots">
              <div className="sl-h">
                <b>
                  {da && <>{MON[da.getUTCMonth()].slice(0, 3)} {da.getUTCDate()}{db && (db.getUTCMonth() === da.getUTCMonth() ? `–${db.getUTCDate()}` : ` – ${MON[db.getUTCMonth()].slice(0, 3)} ${db.getUTCDate()}`)}, <span>{da.getUTCFullYear()}</span></>}
                </b>
                <div className="nav-btns">
                  <button className="nb" type="button" aria-label="Previous days" disabled={sel === null || cal.nextAvail(sel, -1) === null} onClick={() => { const t = sel !== null && cal.nextAvail(sel, -1); if (t) choose(t); }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 6l-6 6 6 6" /></svg>
                  </button>
                  <button className="nb" type="button" aria-label="Next days" disabled={second === null} onClick={() => { if (second !== null) choose(second); }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 6l6 6-6 6" /></svg>
                  </button>
                </div>
                <div className="fmt" role="group" aria-label="Time format">
                  <button type="button" className={!fmt24 ? "on" : ""} onClick={() => setFmt24(false)}>12h</button>
                  <button type="button" className={fmt24 ? "on" : ""} onClick={() => setFmt24(true)}>24h</button>
                </div>
              </div>
              <div className="sl-cols">
                {cols.map((c, i) => {
                  const d = new Date(c);
                  return (
                    <div className="sl-col" key={c}>
                      <h4>{DAY[d.getUTCDay()]} {i === 0 ? <span className="pilld">{ord(d.getUTCDate())}</span> : ord(d.getUTCDate())}</h4>
                      <div className="sl-list">
                        {cal.hoursFor(c).map((h) => (
                          <button key={h} type="button" className="slot" onClick={() => { setSlot({ t: c, h }); setStep("form"); track("booking_time_select", { weekday: DAYL[new Date(c).getUTCDay()], hour: h, location: openedFrom.current }); }}>{tl(h)}</button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {step === "form" && (
          <form className="form" noValidate onSubmit={submit} onFocus={() => { if (!formStarted.current) { formStarted.current = true; track("booking_form_start", { location: openedFrom.current }); } }}>
            <div className="picked"><span>Your call: <b>{picked}</b></span><button type="button" onClick={() => setStep("pick")}>Change time</button></div>
            <div className="fgrid">
              <div className="f"><label htmlFor="bName">Your name</label><input id="bName" name="name" autoComplete="name" required autoFocus /></div>
              <div className="f"><label htmlFor="bEmail">Email</label><input id="bEmail" name="email" type="email" autoComplete="email" required /></div>
              <div className="f"><label htmlFor="bPhone">Phone / WhatsApp</label><input id="bPhone" name="phone" type="tel" autoComplete="tel" placeholder="+91" /></div>
              <div className="f"><label htmlFor="bType">What do you want to build?</label>
                <select id="bType" name="project">{["Mobile app", "Web app / website", "Mobile + web platform", "AI feature or automation", "UI/UX design only", "Not sure yet"].map((o) => <option key={o}>{o}</option>)}</select></div>
              <div className="f"><label htmlFor="bBudget">Budget</label>
                <select id="bBudget" name="budget">{["₹30,000 – ₹75,000 (MVP)", "₹75,000 – ₹2,00,000", "₹2,00,000+", "Not decided"].map((o) => <option key={o}>{o}</option>)}</select></div>
              <div className="f"><label htmlFor="bMode">Call on</label>
                <select id="bMode" name="mode">{["Google Meet", "Phone call", "WhatsApp call"].map((o) => <option key={o}>{o}</option>)}</select></div>
              <div className="f full"><label htmlFor="bMsg">Tell us about your idea</label><textarea id="bMsg" name="message" placeholder="A few lines about the idea, who it's for and any deadline." /></div>
              {/* spam trap: real visitors never see or fill this */}
              <input name="company" tabIndex={-1} autoComplete="off" aria-hidden="true" style={{ position: "absolute", left: "-9999px", width: 1, height: 1 }} />
            </div>
            <p className="err" role="alert">{err}</p>
            <button className="pill pill-solid" type="submit" disabled={sending}>{sending ? "Sending…" : "Confirm booking"}</button>
          </form>
        )}

        {step === "done" && result && (
          <div className="done">
            <h3>{result.sent ? "You're booked in" : "One last step"}</h3>
            <p>
              {result.sent
                ? `Thanks ${result.name}. We've received your request for ${picked} and sent a confirmation to your email. We'll share the meeting link shortly.`
                : `Tap below to send your booking for ${picked} to us on WhatsApp. We'll confirm it there.`}
            </p>
            <div className="acts">
              <a className={`pill ${result.sent ? "pill-line" : "pill-solid"}`} href={wa} target="_blank" rel="noopener" data-track="booking_whatsapp_click" data-track-sent={result.sent ? "yes" : "no"}>
                {result.sent ? "Also message us on WhatsApp" : "Send on WhatsApp"}
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
