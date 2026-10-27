// Service landing pages at /services/<slug>. Each one targets what clients actually search on Google.
// Edit the text here; pages, sitemap entries and structured data update automatically.

export type Service = {
  slug: string;
  /** <title> — keep under ~60 characters, main search phrase first */
  title: string;
  /** Meta description — keep under ~155 characters */
  description: string;
  h1: string;
  kicker: string;
  intro: string;
  /** Name used in structured data (schema.org Service) */
  serviceType: string;
  sections: { h: string; p: string }[];
  includes: { title: string; text: string }[];
  related: string[]; // project slugs from lib/data.ts
  faqs: { q: string; a: string }[];
};

export const services: Service[] = [
  {
    slug: "mobile-app-development",
    title: "Mobile App Development in Malappuram, Kerala",
    description:
      "Android & iOS app development by a Malappuram-based team. Designed in Figma, one codebase, published to both stores. MVPs from ₹30,000.",
    h1: "Mobile app development in Malappuram, Kerala",
    kicker: "Android · iOS · one codebase",
    intro:
      "LeadCapp is a Malappuram-based team that designs and builds mobile apps for startups and businesses across Kerala and India. You get one app that runs on both Android and iPhone, designed screen by screen before any code is written, and published to the Play Store and App Store for you.",
    serviceType: "Mobile app development",
    sections: [
      {
        h: "Apps built for your business, not a template",
        p: "Food deals, grocery delivery, bookings, customer loyalty, staff tools: every app starts from how your customers and team actually work. We map the screens, agree the first version with you, and build only what moves the business forward.",
      },
      {
        h: "One codebase for Android and iPhone",
        p: "We build cross-platform, so a single codebase runs on both Android and iOS. That keeps the cost and timeline down, and every new feature reaches all your users at the same time. Layouts adapt to every screen size, from small Android phones to large iPhones and foldables.",
      },
      {
        h: "Payments, notifications and an admin panel included",
        p: "Most apps need more than screens. We set up secure login, Razorpay and UPI payments, push notifications, and a web admin panel where you manage orders, users and content without calling a developer.",
      },
    ],
    includes: [
      { title: "Figma design first", text: "Every screen designed and shared as a clickable prototype. Building starts after you approve it." },
      { title: "Android + iOS", text: "One codebase, published to the Play Store and App Store under your own accounts." },
      { title: "Admin panel", text: "A web dashboard to manage orders, users, offers and content." },
      { title: "Payments", text: "Razorpay, UPI, cards and wallets, with receipts and refunds." },
      { title: "You own it", text: "Source code, designs and store accounts are fully yours after the final payment." },
      { title: "Support after launch", text: "First month free, then monthly plans for fixes, monitoring and new features." },
    ],
    related: ["cravitty", "quick-supermarket", "purvaj"],
    faqs: [
      { q: "How much does it cost to build an app in Kerala?", a: "An MVP starts from ₹30,000. Apps for both Android and iOS with an admin panel and payments start from ₹75,000. You get a fixed quote after a free call." },
      { q: "How long does it take to build a mobile app?", a: "Most MVPs launch in 3 to 5 weeks. Larger apps with iOS, payments and several user roles take 6 to 10 weeks." },
      { q: "Will my app work on both Android and iPhone?", a: "Yes. We build from one codebase for both and publish to the Play Store and App Store for you." },
      { q: "Where is LeadCapp based?", a: "Our team is based in Malappuram, Kerala. We work with businesses across Malappuram, Kozhikode and the rest of Kerala, and with clients across India over calls, WhatsApp and weekly demos on your own phone." },
    ],
  },
  {
    slug: "website-development",
    title: "Website Development in Malappuram, Kerala",
    description:
      "Fast business websites, dashboards and web apps built with Next.js by a Malappuram-based team. SEO-ready, mobile-first, for clients across Kerala and India.",
    h1: "Website and web app development",
    kicker: "Websites · dashboards · portals",
    intro:
      "From a business website that brings in enquiries to a full web platform your team runs every day, LeadCapp's Malappuram-based team builds fast, mobile-first sites with Next.js, the same technology used by large product companies.",
    serviceType: "Website development",
    sections: [
      {
        h: "Websites that bring in enquiries",
        p: "A business website should do one job well: turn visitors into calls, bookings and orders. We design clear pages, add booking and WhatsApp buttons where people actually look, and set up analytics so you can see what's working.",
      },
      {
        h: "Web apps, dashboards and portals",
        p: "Customer portals, admin dashboards, booking systems, internal tools: if your team still runs on spreadsheets and WhatsApp messages, a web app can replace them with one place that everyone uses.",
      },
      {
        h: "Fast, secure and ready for Google",
        p: "Every site is built for speed on mobile, with clean page structure, metadata, a sitemap and structured data so Google understands your business. Hosting, domain and SSL are set up for you.",
      },
    ],
    includes: [
      { title: "Figma design", text: "Pages designed and approved before development." },
      { title: "Mobile-first", text: "Looks and works right on every phone, tablet and laptop." },
      { title: "SEO-ready", text: "Metadata, sitemap, structured data and Search Console setup." },
      { title: "Analytics", text: "Google Analytics, Meta Pixel and booking tracking built in." },
      { title: "Bookings and forms", text: "Booking calendars, enquiry forms and WhatsApp buttons." },
      { title: "Hosting handled", text: "Domain, SSL and hosting set up and handed over to you." },
    ],
    related: ["quick-supermarket", "purvaj"],
    faqs: [
      { q: "How much does a business website cost?", a: "Websites and web apps are part of our MVP package, starting from ₹30,000. Larger platforms with logins, payments and dashboards start from ₹75,000." },
      { q: "Will my website show up on Google?", a: "We build every site so Google can read it properly: fast pages, clear headings, a sitemap, structured data and Search Console set up. Rankings then depend on your content and competition." },
      { q: "Do you build websites for local businesses in Malappuram?", a: "Yes. We're based in Malappuram and build websites for shops, clinics, restaurants, schools and service businesses across the district and the rest of Kerala." },
      { q: "Can I edit the website myself?", a: "Yes. We can add an admin area or simple content editing so you can update text, prices and photos without a developer." },
    ],
  },
  {
    slug: "app-development-cost",
    title: "App Development Cost in India (2026 Guide)",
    description:
      "How much does an app cost in India? Real package prices from ₹30,000, what changes the price, and typical timelines. Fixed quotes from LeadCapp.",
    h1: "How much does an app cost in India?",
    kicker: "Pricing guide · 2026",
    intro:
      "The honest answer is that it depends on what the app needs to do. Here is how we price apps at LeadCapp, what pushes the cost up or down, and how to get a fixed quote you can plan around.",
    serviceType: "Mobile app development",
    sections: [
      {
        h: "MVP: from ₹30,000",
        p: "A first version with the core features of your idea, an Android app or web app, secure login, a simple admin panel and launch support. Typical timeline: 3 to 5 weeks. Best for founders who want real users testing the idea quickly.",
      },
      {
        h: "Growth: from ₹75,000",
        p: "Android and iOS apps plus an admin web panel, separate customer, staff and admin roles, payments, notifications and AI features where they help. Typical timeline: 6 to 10 weeks. Best for businesses building a product customers use every day.",
      },
      {
        h: "Scale: custom quote",
        p: "Marketplaces, multi-vendor platforms, custom AI and automation, integrations with your existing systems, and cloud infrastructure built for high traffic. Priced from your requirements, typically 10 weeks or more.",
      },
      {
        h: "What changes the price",
        p: "The number of screens and user roles, whether you need iOS as well as Android, payments and integrations, real-time features like live tracking or chat, and how much custom design is involved. Starting with a focused MVP and adding features after launch is usually the cheapest way to get to a great app.",
      },
      {
        h: "Running costs after launch",
        p: "Plan for Play Store and App Store developer accounts, hosting and any paid services the app uses, such as SMS or maps. Our support plans start from ₹3,000 a month, and your first month of support is free.",
      },
    ],
    includes: [
      { title: "Fixed quote", text: "The quote you approve is the price you pay. No surprise invoices." },
      { title: "Clear milestones", text: "Pay in stages tied to design, development and launch." },
      { title: "Design before code", text: "See and approve every screen before building starts." },
      { title: "You own everything", text: "Code, designs and store accounts are handed over to you." },
    ],
    related: ["cravitty", "quick-supermarket"],
    faqs: [
      { q: "What is the cheapest way to build an app?", a: "Start with an MVP that does one job well, launch it to real users, and add features based on what they use. Our MVP package starts from ₹30,000." },
      { q: "Why do app quotes vary so much between companies?", a: "Quotes differ in what's included: design, iOS, admin panels, payments, testing, store publishing and support. Ask for a written scope so you can compare like for like." },
      { q: "Do I pay everything upfront?", a: "No. An advance confirms your start date, and the rest is paid in milestones as design, development and launch are completed." },
      { q: "Are there monthly costs after launch?", a: "Yes: store developer accounts, hosting and any paid services the app uses. Optional support plans start from ₹3,000 a month, with the first month free." },
    ],
  },
  {
    slug: "ui-ux-design",
    title: "UI/UX Design & Figma Prototypes for Apps",
    description:
      "App and website UI/UX design in Figma: user flows, screens and clickable prototypes you can test before building. From LeadCapp, Malappuram.",
    h1: "UI/UX design and Figma prototypes",
    kicker: "Research · screens · prototypes",
    intro:
      "Good design is the difference between an app people try once and an app they keep. We design every screen in Figma and turn it into a clickable prototype you can tap through on your phone before a single line of code is written.",
    serviceType: "UI/UX design",
    sections: [
      {
        h: "See your app before you build it",
        p: "A clickable prototype lets you, your team and even early customers try the app and give feedback while changes are still cheap. Development starts only after you approve the design.",
      },
      {
        h: "Designed to turn visitors into customers",
        p: "We start from what your users need to do and remove every step that gets in the way: clear navigation, readable screens, obvious buttons and checkout flows that don't lose people halfway.",
      },
      {
        h: "Ready for developers",
        p: "Designs come with consistent components and a simple design system, so development is faster and the finished app looks exactly like what you approved. Already have a developer? We can design for them too.",
      },
    ],
    includes: [
      { title: "User flows", text: "How each type of user moves through the app, mapped out first." },
      { title: "Every screen in Figma", text: "Light, clean screens built on a consistent design system." },
      { title: "Clickable prototype", text: "Tap through the app on your phone before development." },
      { title: "Developer handover", text: "Components and specs ready for any development team." },
    ],
    related: ["purvaj", "cravitty", "quick-supermarket"],
    faqs: [
      { q: "Can you only design, without building the app?", a: "Yes. We can design the app in Figma and hand it over to your own developers." },
      { q: "How long does app design take?", a: "Most MVP designs take 1 to 2 weeks, including a round of changes after your feedback." },
      { q: "Will I get the Figma files?", a: "Yes. The Figma files and all design assets are yours." },
    ],
  },
];

export const serviceBySlug = (slug: string) => services.find((s) => s.slug === slug);
