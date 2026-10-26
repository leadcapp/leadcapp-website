import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { projects } from "@/lib/data";
import { Footer } from "@/components/Sections";

type Params = { slug: string };

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const p = projects.find((x) => x.slug === slug);
  if (!p) return {};
  return { title: `${p.name} case study`, description: p.summary, alternates: { canonical: `/work/${p.slug}` }, openGraph: { title: `${p.name} · LeadCapp`, description: p.summary, images: [p.cover[0]] } };
}

export default async function CaseStudy({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const i = projects.findIndex((x) => x.slug === slug);
  if (i < 0) notFound();
  const p = projects[i];
  const next = projects[(i + 1) % projects.length];

  return (
    <>
      <section className={`case-hero p-${p.theme}`}>
        <div className="wrap">
          <Link className="back" href="/#work">← All projects</Link>
          <div className="case-top">
            <div className="case-copy">
              <div className="tags">{p.tags.map((t) => <span className="tg" key={t}>{t}</span>)}</div>
              <h1>{p.name}</h1>
              <p className="case-sum">{p.summary}</p>
              <dl className="case-meta">
                <div><dt>Client</dt><dd>{p.client}</dd></div>
                <div><dt>Location</dt><dd>{p.location}</dd></div>
                <div><dt>What we did</dt><dd>{p.services.join(", ")}</dd></div>
              </dl>
            </div>
            <div className="case-phones">
              {p.cover.map((src, k) => (
                <div className={`cph cph-${k}`} key={src}><Image src={src} alt={`${p.name} screen`} width={360} height={780} priority /></div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="case-body">
        <div className="wrap">
          <div className="case-two">
            <div><h2>The problem</h2><p>{p.problem}</p></div>
            <div><h2>What we built</h2><p>{p.solution}</p></div>
          </div>

          <div className="case-feats">
            {p.features.map((f) => (
              <div className="pack" key={f.title}><h3>{f.title}</h3><p>{f.text}</p></div>
            ))}
          </div>

          <h2 className="case-h">Screens</h2>
          <div className="case-screens">
            {p.screens.map((s) => (
              <figure key={s.src}>
                <div className="cph"><Image src={s.src} alt={s.caption} width={402} height={870} /></div>
                <figcaption>{s.caption}</figcaption>
              </figure>
            ))}
          </div>

          <div className="case-cta">
            <h2>Have an idea like this?</h2>
            <p>Book a free call and get a clear scope, timeline and quote.</p>
            <div className="row-btns">
              <button className="pill pill-solid" type="button" data-book={`case_study_${p.slug}`}>Book a Free Strategy Call</button>
              <Link className="pill pill-line" href={`/work/${next.slug}`}>Next: {next.name} →</Link>
            </div>
          </div>
        </div>
        <Footer />
      </section>
    </>
  );
}
