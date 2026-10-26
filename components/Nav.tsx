import Link from "next/link";
import { site } from "@/lib/data";
import Logo from "./Logo";

export default function Nav() {
  return (
    <nav className="nav" id="nav" aria-label="Main">
      <Link className="logo" href="/" aria-label="LeadCapp home">
        <span className="lc"><Logo /></span>
        <span className="word">LeadCapp</span>
      </Link>
      <div className="socials">
        <a href={site.instagram} target="_blank" rel="noopener" aria-label="Instagram">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r=".8" fill="currentColor" /></svg>
          <span className="lbl">Instagram</span>
        </a>
        <Link href="/#work" aria-label="Work">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="7" width="18" height="13" rx="2" /><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>
          <span className="lbl">Work</span>
        </Link>
        <a href={`mailto:${site.email}`} aria-label="Email">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></svg>
          <span className="lbl">Email</span>
        </a>
      </div>
      <button className="pill pill-solid" type="button" data-book="nav">Let&apos;s Build!</button>
    </nav>
  );
}

export function StatusPill() {
  return (
    <button className="status" type="button" data-book="status_pill">
      <i aria-hidden="true" />We are accepting projects!
    </button>
  );
}
