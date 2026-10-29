// All website content lives here. Edit text, prices and projects in this file.

export const site = {
  name: "LeadCapp",
  legalName: "LeadCapp Software Solutions",
  url: "https://www.leadcapp.com",
  // Must match the Google Business Profile exactly (same wording everywhere helps local ranking).
  streetAddress: "567, Kunnummal, Middle Hill, Up Hill",
  city: "Malappuram",
  region: "Kerala",
  postalCode: "676505",
  geo: { lat: 11.045338, lng: 76.076052 },
  mapsUrl: "https://maps.app.goo.gl/uAv2jPjm4oBP7Ld4A",
  hoursText: "Mon–Sat, 10 AM – 7 PM",
  email: "leadcapp@gmail.com",
  phone: "+91 96562 49938",
  whatsapp: "919656249938", // country code + number, no + or spaces
  instagram: "https://www.instagram.com/leadcapp_/",
  instagramHandle: "@leadcapp_",
  tagline: "Building powerful software for tomorrow.",
  description:
    "LeadCapp designs, builds and launches mobile apps, web platforms, cloud systems and AI features for startups and growing businesses in India.",
};

export const booking = {
  // Call start times in India time (24h). Sundays are closed.
  hours: [10, 11, 12, 14, 15, 16, 17, 18],
  daysAhead: 45,
  closedWeekdays: [0], // 0 = Sunday
};

export type Project = {
  slug: string;
  name: string;
  tags: string[];
  summary: string;
  theme: "cravitty" | "purvaj" | "quick";
  cover: string[]; // 1 or 2 screens shown on the card
  client: string;
  location: string;
  services: string[];
  problem: string;
  solution: string;
  features: { title: string; text: string }[];
  screens: { src: string; caption: string }[];
  figma?: string;
};

export const projects: Project[] = [
  {
    slug: "cravitty",
    name: "Cravitty",
    tags: ["Mobile app", "UI/UX", "Food & dining"],
    summary:
      "A food deals app for Kerala. Restaurants post time-limited offers, customers grab them before they run out and earn reward coins.",
    theme: "cravitty",
    cover: ["/work/cravitty-home.webp"],
    client: "Cravitty",
    location: "Kozhikode, Kerala",
    services: ["Product design", "UI/UX", "Prototype", "Mobile app"],
    problem:
      "Restaurants had unsold food at the end of the day and no quick way to reach nearby customers with a limited offer.",
    solution:
      "Two apps in one: restaurants publish time-limited deals with a set quantity, and customers nearby see them with a live countdown, distance and price drop.",
    features: [
      { title: "Hot deals ending soon", text: "Live countdowns and stock left on every deal, sorted by distance." },
      { title: "Restaurant sign-in", text: "A separate login for restaurants to post offers and track redemptions." },
      { title: "Reward coins", text: "Customers earn coins on every order and spend them on future deals." },
    ],
    screens: [{ src: "/work/cravitty-home.webp", caption: "Home: hot deals ending soon" }],
    figma: "https://www.figma.com/proto/9CwAKjNCvrD8WHE8RAJpp0/Cravitty?node-id=16-794&starting-point-node-id=16%3A794",
  },
  {
    slug: "purvaj",
    name: "PURVAJ",
    tags: ["Mobile app", "Bookings", "Payments"],
    summary:
      "A booking app for ancestral rituals. Families find verified pandits at sacred tirths like Gaya, pick a ritual and time slot, and pay online.",
    theme: "purvaj",
    cover: ["/work/purvaj-home.webp", "/work/purvaj-find.webp"],
    client: "PURVAJ.com",
    location: "Gaya, Bihar",
    services: ["Product design", "UI/UX", "Booking flow", "Payments"],
    problem:
      "Families travelling to Gaya and other tirths struggled to find a trusted pandit, agree a time and know the cost in advance.",
    solution:
      "A clear booking app with verified pandit profiles, ritual-by-ritual booking, a date and time picker, and secure online payment with booking history.",
    features: [
      { title: "Verified pandits", text: "Profiles with experience, rituals performed, languages and serving locations." },
      { title: "Book in three steps", text: "Pick a date and time, add details, choose the ritual. Done." },
      { title: "Payments and history", text: "UPI and card payments with clear success, failure and retry states." },
    ],
    screens: [
      { src: "/work/purvaj-home.webp", caption: "Home with popular rituals" },
      { src: "/work/purvaj-find.webp", caption: "Find a pandit" },
      { src: "/work/purvaj-pandit.webp", caption: "Pandit profile" },
      { src: "/work/purvaj-book.webp", caption: "Pick a date and time" },
      { src: "/work/purvaj-bookings.webp", caption: "My bookings" },
      { src: "/work/purvaj-paid.webp", caption: "Payment successful" },
    ],
  },
  {
    slug: "quick-supermarket",
    name: "Quick Supermarket",
    tags: ["Mobile app", "E-commerce", "Grocery"],
    summary:
      "A grocery delivery app for Malappuram. Customers browse categories, festive offers and best sellers, then get everything delivered to their door.",
    theme: "quick",
    cover: ["/work/quick-home.webp"],
    client: "Quick Supermarkets",
    location: "Perinthalmanna, Malappuram",
    services: ["Product design", "UI/UX", "E-commerce flow"],
    problem:
      "A local supermarket wanted to take orders online and compete with big delivery apps without losing its local feel.",
    solution:
      "A fast grocery app with location-based delivery, festive offers, best sellers, combo deals and a full category catalogue.",
    features: [
      { title: "Deliver to your address", text: "Location permission and saved addresses for quick checkout." },
      { title: "Festive finds and combos", text: "Seasonal offers and combo deals on the home screen." },
      { title: "Full catalogue", text: "Categories from groceries to household, personal care and snacks." },
    ],
    screens: [{ src: "/work/quick-home.webp", caption: "Home: festive finds and best sellers" }],
    figma: "https://www.figma.com/design/Nz20d83wuD6SwNRokn6Jv5/Quick-Supermarket-Grocery-App",
  },
];

export const faqs = [
  { q: "How much does an app cost?", a: "An MVP starts from ₹30,000. Bigger apps with iOS, admin panels and payments start from ₹75,000. You get a fixed quote after a free call.", t: ["Pricing"] },
  { q: "How long will it take?", a: "Most MVPs launch in 3 to 5 weeks. Larger products take 6 to 10 weeks. You get a timeline before we start.", t: ["Timeline"] },
  { q: "Do I own the code?", a: "Yes. After the final payment, the source code, designs and app store accounts are fully yours.", t: ["Ownership"] },
  { q: "Can I see the design before you build?", a: "Yes. We design every screen in Figma and share a clickable prototype. Development starts only after you approve it.", t: ["Design", "Figma"] },
  { q: "Will my app work on iPhone and Android?", a: "Yes. We build from one codebase for both, and publish to the App Store and Play Store for you.", t: ["iOS", "Android"] },
  { q: "What happens after launch?", a: "Your first month of support is free. After that, monthly plans cover fixes, monitoring and new features.", t: ["Support"] },
  { q: "Can you add payments and UPI?", a: "Yes. We integrate Razorpay, UPI, cards and wallets, with receipts and refunds handled properly.", t: ["Payments"] },
  { q: "I only have an idea. Is that enough?", a: "Yes. On the free call we help you shape the idea into features, screens and a clear first version.", t: ["Getting started"] },
  { q: "How will I know what's happening?", a: "You get weekly updates and demos on your own phone, plus one WhatsApp group with the team.", t: ["Process"] },
];

export const packages = [
  {
    name: "MVP",
    price: "from ₹30,000",
    forBold: "For first-time founders",
    forText: "who want a working first version in front of real users quickly.",
    items: ["Core features of your idea", "Android app or web app", "Secure login", "Simple admin panel", "Launch support"],
    fine: ["Typical timeline · 3–5 weeks", "Support from ₹3,000/mo · first month free"],
    highlight: false,
  },
  {
    name: "Growth",
    price: "from ₹75,000",
    forBold: "For growing businesses",
    forText: "ready to build a product customers will use every day.",
    items: ["Everything in MVP", "Android + iOS + admin web", "Customer, staff and admin roles", "Payments and notifications", "AI features where they help"],
    fine: ["Typical timeline · 6–10 weeks", "Support from ₹6,000/mo · first month free"],
    highlight: true,
  },
  {
    name: "Scale",
    price: "Custom quote",
    forBold: "For established companies",
    forText: "digitising operations or building a large platform.",
    items: ["Everything in Growth", "Multi-vendor or marketplace setups", "Custom AI and automation", "Integrations with your systems", "Cloud built for high traffic"],
    fine: ["Typical timeline · 10+ weeks", "Priced from your requirements"],
    highlight: false,
  },
];

export const flow = [
  { title: "Discovery", text: "A free call to understand your idea, your users and your goals. You get a written scope and timeline before any code is written.", chips: ["Free call", "Scope document", "Timeline"] },
  { title: "Proposal", text: "A fixed quote with clear milestones. An advance confirms your start date, and you know the full cost from day one.", chips: ["Fixed price", "Milestones", "Start date"] },
  { title: "UI/UX Design", text: "We design every screen in Figma and share a clickable prototype. You approve the design before development begins.", chips: ["Figma screens", "User flows", "Prototype", "Your approval"] },
  { title: "Development", text: "We build the app, web platform and backend, with weekly updates and demos so you always see real progress.", chips: ["Mobile", "Web", "Cloud", "Weekly demos"] },
  { title: "Launch", text: "We publish to the App Store and Play Store, set up hosting and domains, and stay with you through go-live.", chips: ["App Store", "Play Store", "Hosting", "Go-live"] },
  { title: "Handover", text: "You own the code and the product. We hand over everything with documentation and a support window after launch.", chips: ["Full ownership", "Source code", "Documentation"] },
  { title: "Support", text: "Our work continues after launch. Monthly support covers fixes, monitoring and new features as your users grow.", chips: ["Bug fixes", "Monitoring", "New features"] },
];
