import Hero from "@/components/Hero";
import { Questions, Projects, Packages, Flow, Services, Contact } from "@/components/Sections";
import JsonLd from "@/components/JsonLd";
import { faqs, packages, site } from "@/lib/data";

// Structured data for the home page: the questions section as an FAQ, and the packages as offers.
const homeJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "FAQPage",
      "@id": `${site.url}/#faq`,
      mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
    },
    {
      "@type": "OfferCatalog",
      "@id": `${site.url}/#packages`,
      name: "App and website development packages",
      itemListElement: packages.map((k) => {
        const price = k.price.match(/[\d,]+/)?.[0]?.replace(/,/g, "");
        return {
          "@type": "Offer",
          name: `${k.name} package`,
          description: `${k.forBold} ${k.forText}`,
          seller: { "@id": `${site.url}/#org` },
          ...(price ? { priceSpecification: { "@type": "PriceSpecification", minPrice: Number(price), priceCurrency: "INR" } } : {}),
        };
      }),
    },
  ],
};

export default function Home() {
  return (
    <>
      <JsonLd data={homeJsonLd} />
      <Hero />
      <Questions />
      <Projects />
      <Packages />
      <Flow />
      <Services />
      <Contact />
    </>
  );
}
