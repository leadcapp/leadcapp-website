import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { projects, site } from "@/lib/data";
import { services, serviceBySlug } from "@/lib/services";
import { Footer } from "@/components/Sections";
import JsonLd from "@/components/JsonLd";

type Params = { slug: string };

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const s = serviceBySlug(slug);
  if (!s) return {};
  return {
    title: { absolute: `${s.title} | LeadCapp` },
    description: s.description,
    alternates: { canonical: `/services/${s.slug}` },
    openGraph: { title: s.title, description: s.description, url: `${site.url}/services/${s.slug}`, type: "website" },
  };
}

export default async function ServicePage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const s = serviceBySlug(slug);
  if (!s) notFound();
  const related = s.related.map((r) => projects.find((p) => p.slug === r)).filter((p) => p !== undefined);
  const others = services.filter((x) => x.slug !== s.slug);
  const url = `${site.url}/services/${s.slug}`;

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "@id": `${url}#service`,
        name: s.h1,
        serviceType: s.serviceType,
        description: s.description,
        url,
        provider: { "@id": `${site.url}/#org` },
        areaServed: [{ "@type": "City", name: "Malappuram" }, { "@type": "State", name: "Kerala" }, { "@type": "Country", name: "India" }],
        offers: { "@type": "Offer", priceCurrency: "INR", price: "30000", description: "MVP package, starting price" },
      },
      {
        "@type": "FAQPage",
        "@id": `${url}#faq`,
        mainEntity: s.faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: site.url },
          { "@type": "ListItem", position: 2, name: s.h1, item: url },
        ],
      },
    ],
  };

  return (
    <>
      <JsonLd data={schema} />
      <section className="case-hero svc-hero">
        <div className="wrap">
          <nav className="back" aria-label="Breadcrumb"><Link href="/">LeadCapp</Link> / <Link href="/#services">Services</Link></nav>
          <div className="case-copy svc-copy">
            <div className="tags"><span className="tg">{s.kicker}</span></div>
            <h1>{s.h1}</h1>
            <p className="case-sum">{s.intro}</p>
            <div className="row-btns svc-ctas">
              <button className="pill pill-solid" type="button" data-book={`service_${s.slug}`}>Book a Free Strategy Call</button>
              <Link className="pill pill-text" href="/#pricing">See packages →</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="case-body">
        <div className="wrap">
          <div className="svc-sections">
            {s.sections.map((x) => (
              <div className="case-two svc-row" key={x.h}>
                <h2>{x.h}</h2>
                <p>{x.p}</p>
              </div>
            ))}
          </div>

          <h2 className="case-h">What you get</h2>
          <div className="case-feats svc-feats">
            {s.includes.map((f) => (
              <div className="pack" key={f.title}><h3>{f.title}</h3><p>{f.text}</p></div>
            ))}
          </div>

          {related.length > 0 && (
            <>
              <h2 className="case-h">Apps we&apos;ve designed and built</h2>
              <div className="svc-work">
                {related.map((p) => (
                  <Link className={`svc-proj p-${p.theme}`} href={`/work/${p.slug}`} key={p.slug}>
                    <div className="cph"><Image src={p.cover[0]} alt={`${p.name} app home screen`} width={360} height={780} /></div>
                    <div>
                      <h3>{p.name}</h3>
                      <p>{p.summary}</p>
                      <span className="svc-more">View case study →</span>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          )}

          <h2 className="case-h">Questions</h2>
          <div className="svc-faq">
            {s.faqs.map((f) => (
              <details key={f.q}>
                <summary><h3>{f.q}</h3></summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>

          <div className="case-cta">
            <h2>Let&apos;s talk about your idea</h2>
            <p>Book a free call and get a clear scope, timeline and fixed quote.</p>
            <div className="row-btns">
              <button className="pill pill-solid" type="button" data-book={`service_${s.slug}_cta`}>Book a Free Strategy Call</button>
              <a className="pill pill-line" href={`https://wa.me/${site.whatsapp}`} target="_blank" rel="noopener">WhatsApp us</a>
            </div>
          </div>

          <nav className="svc-others" aria-label="More services">
            <h2 className="case-h">More from LeadCapp</h2>
            <ul>
              {others.map((o) => (
                <li key={o.slug}><Link href={`/services/${o.slug}`}>{o.h1} →</Link></li>
              ))}
            </ul>
          </nav>
        </div>
        <Footer />
      </section>
    </>
  );
}
