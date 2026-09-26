// Everything on the /services page that can be edited from /admin. Like the portfolio,
// DEFAULT_SERVICES is the built-in copy the page falls back to if the database can't be reached.

export type Package = {
  name: string;
  price: string;
  blurb: string;
  features: string[];
  featured: boolean;
};

export type Faq = { q: string; a: string };

export type ServicesContent = {
  // Country code + number, digits only, e.g. 9779821858674.
  whatsappNumber: string;
  packages: Package[];
  faqs: Faq[];
};

export const DEFAULT_SERVICES: ServicesContent = {
  whatsappNumber: "9779821858674",
  packages: [
    {
      name: "Starter",
      price: "Rs 12,000",
      blurb: "For a business that needs to be online, fast.",
      features: [
        "One-page website",
        "Mobile-friendly",
        "WhatsApp & call buttons",
        "Google Maps location",
        "Delivered in 5 days",
      ],
      featured: false,
    },
    {
      name: "Business",
      price: "Rs 25,000",
      blurb: "For restaurants, clinics, salons, and service businesses.",
      features: [
        "Up to 5 pages",
        "Menu / services & price list",
        "Contact or booking form",
        "Google Business Profile setup",
        "Basic SEO",
      ],
      featured: true,
    },
    {
      name: "Online Store",
      price: "Rs 45,000",
      blurb: "For shops ready to take orders online.",
      features: [
        "Product catalogue",
        "Cart & order form",
        "eSewa / Khalti or WhatsApp ordering",
        "Simple sales dashboard",
        "Everything in Business",
      ],
      featured: false,
    },
  ],
  faqs: [
    {
      q: "Do I need to buy a domain and hosting?",
      a: "I'll help you set it up. A .com.np domain is free for Nepali businesses, and hosting for a small site is often free or very cheap. You only pay what it actually costs.",
    },
    {
      q: "How long does it take?",
      a: "A Starter site is usually ready in 5 days. Business and Online Store sites take 1–3 weeks, depending on how quickly you can send photos and text.",
    },
    {
      q: "Can I update the website myself?",
      a: "You don't have to. Send me a message on WhatsApp with the new price, photo, or menu and I'll update it. If you'd rather do it yourself, I can set that up too.",
    },
    {
      q: "How do I pay?",
      a: "50% to start and 50% when the site is ready and you're happy with it. eSewa, Khalti, or bank transfer are all fine.",
    },
    {
      q: "What if I don't like the design?",
      a: "You see the first version before anything goes live, and changes are included. We keep adjusting until it feels right for your business.",
    },
    {
      q: "Do you only work with businesses in Kathmandu?",
      a: "No. Most of the work happens online, so I can build a site for a business anywhere in Nepal.",
    },
  ],
};

// A local 10-digit mobile number gets Nepal's 977 prefix; anything else keeps its digits.
export function normalizeWhatsapp(input: string): string {
  const digits = input.replace(/\D/g, "");
  return digits.length === 10 ? `977${digits}` : digits;
}

// Shown as +977 9821858674.
export function formatWhatsapp(number: string): string {
  return number.startsWith("977") ? `+977 ${number.slice(3)}` : `+${number}`;
}

const str = (v: unknown, fallback: string) => (typeof v === "string" ? v : fallback);

export function normalizeServices(raw: unknown): ServicesContent {
  const d = DEFAULT_SERVICES;
  if (!raw || typeof raw !== "object") return d;
  const r = raw as Record<string, unknown>;
  const objects = (v: unknown) =>
    Array.isArray(v)
      ? v.filter((x): x is Record<string, unknown> => !!x && typeof x === "object")
      : null;

  const packages = objects(r.packages);
  const faqs = objects(r.faqs);
  const whatsapp = normalizeWhatsapp(str(r.whatsappNumber, ""));

  return {
    whatsappNumber: whatsapp.length >= 10 ? whatsapp : d.whatsappNumber,
    packages: packages
      ? packages.map((p) => ({
          name: str(p.name, ""),
          price: str(p.price, ""),
          blurb: str(p.blurb, ""),
          features: Array.isArray(p.features)
            ? p.features.filter((f): f is string => typeof f === "string")
            : [],
          featured: p.featured === true,
        }))
      : d.packages,
    faqs: faqs ? faqs.map((f) => ({ q: str(f.q, ""), a: str(f.a, "") })) : d.faqs,
  };
}
