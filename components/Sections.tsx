import Link from "next/link";
import Image from "next/image";
import { faqs, packages, flow, projects, site, type Project } from "@/lib/data";
import Carousel from "./Carousel";
import Logo from "./Logo";
import { services } from "@/lib/services";

export function Giant({ word, dir = 1 }: { word: string; dir?: 1 | -1 }) {
  return (
    <div className="giant" aria-hidden="true">
      <span className="t" data-dir={dir}>{Array(5).fill(word).join(" ")}</span>
    </div>
  );
}

/* ---------- Questions (scrolling columns) ---------- */
function QCard({ f, hidden }: { f: (typeof faqs)[number]; hidden?: boolean }) {
  return (
    <div className="rv" aria-hidden={hidden || undefined}>
      <div className="who">{f.q}</div>
      <p className="ans">{f.a}</p>
      <div className="tags">{f.t.map((t) => <span className="tg" key={t}>{t}</span>)}</div>
    </div>
  );
}

function QCol({ items, className }: { items: typeof faqs; className?: string }) {
  // Each column loops its own cards twice for a seamless vertical marquee.
  return (
    <div className={`col ${className ?? ""}`}>
      <div className="run">
        {items.map((f) => <QCard f={f} key={f.q} />)}
        {items.map((f) => <QCard f={f} key={f.q + "-2"} hidden />)}
      </div>
    </div>
  );
}

export function Questions() {
  return (
    <section id="questions">
      <Giant word="QUESTIONS" dir={1} />
      <div className="wrap">
        <h2 className="chapter-sub">What founders ask before they build.</h2>
        <div className="reviews">
          <div className="cols">
            <QCol items={faqs.slice(0, 3)} />
            <QCol items={faqs.slice(3, 6)} />
            <QCol items={faqs.slice(6, 9)} />
            <QCol items={faqs} className="m" />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Projects ---------- */
function ProjectCard({ p }: { p: Project }) {
  return (
    <article className={`proj p-${p.theme}`}>
      <div className="art">
        {p.cover.length > 1 ? (
          <div className="duo">
            <div className="ph a"><Image src={p.cover[0]} alt={`${p.name} app screen`} width={360} height={780} /></div>
            <div className="ph b"><Image src={p.cover[1]} alt={`${p.name} app second screen`} width={360} height={780} /></div>
          </div>
        ) : (
          <div className="ph"><Image src={p.cover[0]} alt={`${p.name} app home screen`} width={360} height={780} /></div>
        )}
      </div>
      <div className="tags">{p.tags.map((t) => <span className="tg" key={t}>{t}</span>)}</div>
      <h3>{p.name}</h3>
      <p>{p.summary}</p>
      <Link className="more" href={`/work/${p.slug}`}>View project →</Link>
    </article>
  );
}

export function Projects() {
  return (
    <section id="work">
      <Giant word="PROJECTS" dir={-1} />
      <div className="wrap">
        <h2 className="chapter-sub">Our best work. Designed and shipped.</h2>
        <Carousel>
          {projects.map((p) => <ProjectCard p={p} key={p.slug} />)}
          <article className="proj p-you">
            <div className="art" aria-hidden="true">+</div>
            <div className="tags">{["Apps", "Web", "Cloud", "AI"].map((t) => <span className="tg" key={t}>{t}</span>)}</div>
            <h3>Your project</h3>
            <p>Have an idea? It could be the next product on this list.</p>
            <button className="more" type="button" data-book="project_card_your_project">Start a project →</button>
          </article>
        </Carousel>
      </div>
    </section>
  );
}

/* ---------- Packages ---------- */
export function Packages() {
  return (
    <section id="pricing">
      <Giant word="PACKAGES" dir={1} />
      <div className="wrap">
        <h2 className="chapter-sub">Clear scope. Fixed price. No surprises.</h2>
        <div className="packs">
          {packages.map((k) => (
            <div className={`pack ${k.highlight ? "mid" : ""}`} key={k.name}>
              <div className="name"><b>{k.name}</b> package</div>
              <div className="price">{k.price}</div>
              <p className="for"><b>{k.forBold}</b> {k.forText}</p>
              <ul>{k.items.map((i) => <li key={i}>{i}</li>)}</ul>
              <p className="fine">{k.fine[0]}<br />{k.fine[1]}</p>
              <button className={`pill ${k.highlight ? "pill-solid" : "pill-line"}`} type="button" data-book={`package_${k.name.toLowerCase()}`}>Book a call</button>
            </div>
          ))}
        </div>
        <p className="packs-note">
          Final price depends on your features, platforms and integrations. You get a written scope and a fixed quote after
          the free call, and the quote you approve is the price you pay.{" "}
          <Link href="/services/app-development-cost" className="u">How app pricing works →</Link>
        </p>
      </div>
    </section>
  );
}

/* ---------- Flow ---------- */
export function Flow() {
  return (
    <section id="flow">
      <Giant word="FLOW" dir={-1} />
      <div className="wrap">
        <h2 className="chapter-sub">From idea to app store. How we work.</h2>
        <div className="flow" id="flowList">
          <div className="fill" id="flowFill" />
          {flow.map((s) => (
            <div className="step" key={s.title}>
              <h3>{s.title}</h3>
              <div>
                <p className="txt">{s.text}</p>
                <div className="chips">{s.chips.map((c) => <span key={c}>{c}</span>)}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- Services ---------- */
const Ic = ({ d }: { d: React.ReactNode }) => (
  <span className="ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">{d}</svg></span>
);

export function Services() {
  return (
    <section id="services">
      <Giant word="SERVICES" dir={1} />
      <div className="wrap">
        <h2 className="chapter-sub">Apps, web, cloud and AI. One team.</h2>
        <div className="bento">
          <div className="svc">
            <div className="vis">
              <svg width="150" height="110" viewBox="0 0 150 110" aria-hidden="true">
                <rect className="wire" x="34" y="6" width="42" height="80" rx="9" /><rect className="wire" x="74" y="22" width="42" height="80" rx="9" />
                <rect className="wire" x="42" y="16" width="26" height="4" rx="2" /><rect className="wire" x="82" y="32" width="26" height="4" rx="2" />
                <text x="38" y="104" fill="#7a7a80" fontSize="9" fontFamily="monospace">iOS</text>
                <text x="96" y="110" fill="#7a7a80" fontSize="9" fontFamily="monospace">Android</text>
              </svg>
            </div>
            <h3><Ic d={<rect x="6" y="2" width="12" height="20" rx="3" />} />Mobile Apps</h3>
            <p>iOS and Android apps from one codebase, ready for both stores.</p>
            <Link className="more-link" href="/services/mobile-app-development">Mobile app development →</Link>
          </div>
          <div className="svc">
            <div className="vis">
              <svg width="210" height="110" viewBox="0 0 210 110" aria-hidden="true">
                <rect className="wire" x="2" y="2" width="206" height="106" rx="8" /><circle cx="14" cy="13" r="2.5" fill="#5a5a60" /><circle cx="23" cy="13" r="2.5" fill="#5a5a60" />
                <rect className="wire" x="14" y="30" width="56" height="42" rx="3" /><rect className="wire" x="77" y="30" width="56" height="42" rx="3" /><rect className="wire" x="140" y="30" width="56" height="42" rx="3" />
                <text x="20" y="48" fill="#aaa" fontSize="10">68%</text><text x="83" y="48" fill="#aaa" fontSize="10">54%</text><text x="146" y="48" fill="#aaa" fontSize="10">89%</text>
                <rect x="20" y="60" width="34" height="2" fill="#777" /><rect x="83" y="60" width="26" height="2" fill="#777" /><rect x="146" y="60" width="40" height="2" fill="#777" />
              </svg>
            </div>
            <h3><Ic d={<><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" /></>} />Web Applications</h3>
            <p>Websites, dashboards and portals that work on every screen.</p>
            <Link className="more-link" href="/services/website-development">Website development →</Link>
          </div>
          <div className="svc">
            <div className="vis">
              <svg width="170" height="110" viewBox="0 0 170 110" aria-hidden="true">
                <rect className="wire" x="20" y="10" width="130" height="24" rx="5" /><rect className="wire" x="20" y="43" width="130" height="24" rx="5" /><rect className="wire" x="20" y="76" width="130" height="24" rx="5" />
                <circle cx="34" cy="22" r="3" fill="#3DDC6B" /><circle cx="34" cy="55" r="3" fill="#3DDC6B" /><circle cx="34" cy="88" r="3" fill="#3DDC6B" />
                <rect x="46" y="20" width="50" height="4" rx="2" fill="#5a5a60" /><rect x="46" y="53" width="38" height="4" rx="2" fill="#5a5a60" /><rect x="46" y="86" width="58" height="4" rx="2" fill="#5a5a60" />
              </svg>
            </div>
            <h3><Ic d={<path d="M7 18a5 5 0 1 1 1-9.9A6 6 0 0 1 19 10a4 4 0 0 1-1 8z" />} />Cloud &amp; Backend</h3>
            <p>APIs, databases, payments and hosting that grow with your users.</p>
          </div>
          <div className="svc wide">
            <div>
              <h3><Ic d={<><path d="M12 3v3M12 18v3M3 12h3M18 12h3M6 6l2 2M16 16l2 2M6 18l2-2M16 8l2-2" /><circle cx="12" cy="12" r="3" /></>} />AI Integrations</h3>
              <p>Chat assistants, smart search and automation built into your product, so AI does real work for your users.</p>
              <div className="tags"><span className="tg">Chatbots</span><span className="tg">Smart search</span><span className="tg">Automation</span></div>
            </div>
            <div className="term" aria-hidden="true">
              <div className="bar">● ● ●  assistant.ts</div>
              <div className="body">
                <span>task&nbsp;&nbsp;&nbsp;<b>summarise orders</b></span>
                <span>tools&nbsp;&nbsp;<b>search · db · email</b></span>
                <span>status <b>streaming…</b></span>
                <span>&gt; <b>Today: 142 orders, top item …</b> <i className="cur" /></span>
              </div>
            </div>
          </div>
          <div className="svc wide">
            <div>
              <h3><Ic d={<><rect x="3" y="3" width="18" height="18" rx="3" /><path d="M3 9h18M9 21V9" /></>} />UI/UX Design</h3>
              <p>Research, wireframes and clickable Figma prototypes, designed to turn visitors into customers.</p>
              <div className="tags"><span className="tg">Figma</span><span className="tg">Prototypes</span><span className="tg">Design systems</span></div>
              <Link className="more-link" href="/services/ui-ux-design">UI/UX design →</Link>
            </div>
            <div className="vis">
              <svg width="230" height="130" viewBox="0 0 230 130" aria-hidden="true">
                <rect className="wire" x="2" y="2" width="226" height="126" rx="8" />
                <circle cx="12" cy="11" r="2" fill="#5a5a60" /><circle cx="19" cy="11" r="2" fill="#5a5a60" /><circle cx="26" cy="11" r="2" fill="#5a5a60" />
                <rect x="14" y="24" width="30" height="5" rx="2.5" fill="#5a5a60" /><rect x="120" y="24" width="20" height="5" rx="2.5" fill="#444" /><rect x="146" y="24" width="20" height="5" rx="2.5" fill="#444" />
                <rect className="wire" x="176" y="20" width="40" height="13" rx="6.5" /><rect className="wire" x="14" y="44" width="202" height="72" rx="6" />
                <rect x="60" y="62" width="110" height="7" rx="3.5" fill="#666" /><rect x="78" y="76" width="74" height="5" rx="2.5" fill="#444" />
                <rect className="wire" x="70" y="92" width="40" height="13" rx="6.5" /><rect className="wire" x="120" y="92" width="40" height="13" rx="6.5" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Closing + footer ---------- */
export function Contact() {
  return (
    <section id="contact" className="close">
      <div className="wrap">
        <h2 className="big">BUILD WITH US</h2>
        <p className="lead">Your idea is worth building. Let&apos;s build it right.</p>
        <p className="body">Tell us about it on a free call. We&apos;ll come back with a clear scope, timeline and quote. No pressure, no jargon.</p>
        <button className="pill pill-line" type="button" data-book="contact_section">Let&apos;s Build!</button>
        <div className="contact-list">
          <a href={`mailto:${site.email}`}>{site.email}</a>
          <a href={`tel:${site.phone.replace(/\s/g, "")}`}>{site.phone}</a>
          <a href={site.instagram} target="_blank" rel="noopener">{site.instagramHandle}</a>
        </div>
      </div>
      <Footer />
    </section>
  );
}

export function Footer() {
  return (
    <div className="foot wrap">
      <div className="grain" aria-hidden="true" />
      <div className="row">
        <div>
          <div className="brand"><Logo />LeadCapp</div>
          <div className="copy">© {new Date().getFullYear()} {site.legalName}. App &amp; website development in Kerala, India.</div>
          <nav className="foot-links" aria-label="Footer">
            {services.map((x) => <Link key={x.slug} href={`/services/${x.slug}`}>{x.h1}</Link>)}
            {projects.map((p) => <Link key={p.slug} href={`/work/${p.slug}`}>{p.name}</Link>)}
          </nav>
        </div>
        <div className="join">
          <b>Want to work at LeadCapp?</b>
          <a href={site.instagram} target="_blank" rel="noopener">Let&apos;s Connect!</a>
        </div>
      </div>
    </div>
  );
}
