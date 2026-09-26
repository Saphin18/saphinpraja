import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  Check,
  LayoutTemplate,
  LifeBuoy,
  Mail,
  MessageCircle,
  Search,
  ShoppingBag,
  Smartphone,
} from "lucide-react";
import { useReveal } from "@/hooks/use-reveal";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// Country code 977 + number, no + or spaces
const WHATSAPP_NUMBER = "9779821858674";
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
  "Hi Saphin, I'd like a website for my business.",
)}`;

const PAGE_URL = "https://saphinpraja.com.np/services";
const TITLE = "Website Design for Small Businesses in Nepal — Saphin Praja";
const DESCRIPTION =
  "Fast, mobile-friendly websites, online stores, and sales dashboards for restaurants, shops, and service businesses in Kathmandu and across Nepal.";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:url", content: PAGE_URL },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESCRIPTION },
    ],
    links: [{ rel: "canonical", href: PAGE_URL }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ProfessionalService",
          name: "Saphin Praja — Web Design & Data Dashboards",
          url: PAGE_URL,
          description: DESCRIPTION,
          areaServed: "Nepal",
          address: {
            "@type": "PostalAddress",
            addressLocality: "Kathmandu",
            addressCountry: "Nepal",
          },
          founder: { "@type": "Person", name: "Saphin Praja" },
        }),
      },
    ],
  }),
  component: Services,
});

const services = [
  {
    icon: LayoutTemplate,
    title: "Business websites",
    desc: "A clean, modern site that tells customers who you are, what you offer, and how to reach you.",
  },
  {
    icon: ShoppingBag,
    title: "Online stores",
    desc: "Product pages, a cart, and ordering through WhatsApp or eSewa / Khalti so you can start selling online.",
  },
  {
    icon: Smartphone,
    title: "Mobile-first design",
    desc: "Most of your customers are on their phones. Every site is built for small screens first.",
  },
  {
    icon: Search,
    title: "Google visibility",
    desc: "Basic SEO and Google Business Profile setup so people nearby can find you when they search.",
  },
  {
    icon: BarChart3,
    title: "Sales dashboards",
    desc: "See your orders, best sellers, and busy days in one simple dashboard — built from the data you already have.",
  },
  {
    icon: LifeBuoy,
    title: "Updates & support",
    desc: "Menu changed? New product? Send a message and it gets updated — no need to learn any software.",
  },
];

const demos = [
  {
    to: "/demos/restaurant" as const,
    kind: "Restaurant",
    name: "Himalayan Thakali Kitchen",
    desc: "Dish slideshow, photo menu, gallery, reviews, map, and order-on-WhatsApp buttons.",
    preview: "/demos/previews/restaurant.webp",
    url: "saphinpraja.com.np/demos/restaurant",
  },
  {
    to: "/demos/shop" as const,
    kind: "Online shop",
    name: "Dhaka & Co.",
    desc: "Featured products, category filters, a working cart, and eSewa / Khalti / COD checkout.",
    preview: "/demos/previews/shop.webp",
    url: "saphinpraja.com.np/demos/shop",
  },
  {
    to: "/demos/salon" as const,
    kind: "Service business",
    name: "Glow Studio",
    desc: "Services with prices, stylist profiles, gallery, and online booking with date and time slots.",
    preview: "/demos/previews/salon.webp",
    url: "saphinpraja.com.np/demos/salon",
  },
];

const steps = [
  {
    title: "Free call",
    desc: "We talk about your business, your customers, and what the site needs to do.",
  },
  {
    title: "Design",
    desc: "You get a first version to review within a few days. Changes are included.",
  },
  {
    title: "Launch",
    desc: "Your site goes live on your own domain, set up on Google and ready to share.",
  },
  {
    title: "Support",
    desc: "One month of free edits after launch, then simple monthly support if you want it.",
  },
];

const packages = [
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
  },
];

const faqs = [
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
];

function Services() {
  useReveal();
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    // Honeypot check: if website is filled, silently discard spam
    if (String(formData.get("website") ?? "")) {
      setStatus("sent");
      form.reset();
      return;
    }

    const business = String(formData.get("business") ?? "");
    const phone = String(formData.get("phone") ?? "").trim();
    const payload = {
      name: String(formData.get("name") ?? ""),
      email: String(formData.get("email") ?? ""),
      message: `[Website enquiry — ${business}]\nPhone: ${phone || "not given"}\n\n${String(formData.get("message") ?? "")}`,
    };

    setStatus("sending");
    setErrorMessage("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => null)) as { error?: string } | null;
        throw new Error(body?.error ?? "Unable to send your message.");
      }
      if (typeof window !== "undefined" && typeof window.gtag === "function") {
        window.gtag("event", "services_enquiry_submit", { event_category: "engagement" });
      }
      setStatus("sent");
      form.reset();
    } catch (error) {
      setStatus("error");
      setErrorMessage(error instanceof Error ? error.message : "Unable to send your message.");
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Link to="/" className="font-display text-lg font-bold tracking-tight">
            Saphin<span className="text-accent">.</span>
          </Link>
          <nav className="hidden items-center gap-1 md:flex">
            {[
              ["#services", "Services"],
              ["#work", "Work"],
              ["#process", "Process"],
              ["#pricing", "Pricing"],
              ["#faq", "FAQ"],
            ].map(([href, label]) => (
              <a
                key={href}
                href={href}
                className="rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <a
              href="#quote"
              className="hidden rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-transform hover:-translate-y-0.5 md:inline-flex"
            >
              Get a quote
            </a>
          </div>
        </div>
      </header>

      <main>
        <section className="bg-hero">
          <div className="mx-auto max-w-6xl px-6 py-24 md:py-32">
            <Link
              to="/"
              className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to portfolio
            </Link>
            <div className="max-w-3xl">
              <p className="mb-4 text-sm font-medium uppercase tracking-widest text-accent">
                Websites for small businesses in Nepal
              </p>
              <h1 className="text-5xl font-bold leading-[1.05] md:text-7xl">
                Get your business online — and see what's working.
              </h1>
              <p className="mt-6 max-w-xl text-lg text-muted-foreground">
                I build fast, mobile-friendly websites for restaurants, shops, and service
                businesses. And because I'm a data analyst, I can also show you your sales in a
                simple dashboard.
              </p>
              <div className="mt-10 flex flex-wrap gap-3">
                <a
                  href="#quote"
                  className="group inline-flex items-center gap-2 rounded-md bg-primary px-5 py-3 text-sm font-medium text-primary-foreground shadow-card transition-transform hover:-translate-y-0.5"
                >
                  Book a free call
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </a>
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-md bg-[#25D366] px-5 py-3 text-sm font-medium text-white transition-transform hover:-translate-y-0.5"
                >
                  <MessageCircle className="h-4 w-4" />
                  Chat on WhatsApp
                </a>
                <a
                  href="#work"
                  className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-5 py-3 text-sm font-medium transition-colors hover:border-accent"
                >
                  See sample sites
                </a>
              </div>
            </div>
          </div>
        </section>

        <section id="services" className="border-y border-border/60 bg-secondary/40">
          <div className="mx-auto max-w-6xl px-6 py-24">
            <div className="reveal mb-12">
              <p className="text-sm font-medium uppercase tracking-widest text-accent">Services</p>
              <h2 className="mt-2 text-3xl font-bold md:text-4xl">How I can help</h2>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {services.map(({ icon: Icon, title, desc }) => (
                <div
                  key={title}
                  className="reveal rounded-2xl border border-border bg-card p-7 shadow-card transition-all hover:-translate-y-1 hover:border-accent/60"
                >
                  <div className="grid h-11 w-11 place-items-center rounded-lg bg-secondary text-accent">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-5 text-lg font-bold">{title}</h3>
                  <p className="mt-2 text-muted-foreground">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="work" className="mx-auto max-w-6xl px-6 py-24">
          <div className="reveal mb-12 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-sm font-medium uppercase tracking-widest text-accent">
                Sample work
              </p>
              <h2 className="mt-2 text-3xl font-bold md:text-4xl">Try a demo site</h2>
            </div>
            <p className="max-w-md text-muted-foreground">
              These are sample sites for made-up businesses, so you can click around and see what
              yours could look like.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {demos.map((d) => (
              <Link
                key={d.to}
                to={d.to}
                className="reveal group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-card transition-all hover:-translate-y-1 hover:border-accent/60 hover:shadow-glow"
              >
                <div className="border-b border-border bg-secondary/60 p-3 pb-0">
                  <div className="flex items-center gap-1.5 px-1 pb-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-red-400/80" />
                    <span className="h-2.5 w-2.5 rounded-full bg-amber-400/80" />
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
                    <span className="ml-2 truncate rounded-md bg-background/80 px-2 py-0.5 text-[10px] text-muted-foreground">
                      {d.url}
                    </span>
                  </div>
                  <div className="relative aspect-[16/10] overflow-hidden rounded-t-lg">
                    <img
                      src={d.preview}
                      alt={`Preview of the ${d.name} demo website`}
                      loading="lazy"
                      className="h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                    />
                    <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-neutral-900 shadow">
                      {d.kind}
                    </span>
                  </div>
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="text-lg font-bold">{d.name}</h3>
                  <p className="mt-2 flex-1 text-muted-foreground">{d.desc}</p>
                  <span className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-accent">
                    Open demo
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section id="process" className="border-y border-border/60 bg-secondary/40">
          <div className="mx-auto max-w-6xl px-6 py-24">
            <div className="reveal mb-12">
              <p className="text-sm font-medium uppercase tracking-widest text-accent">Process</p>
              <h2 className="mt-2 text-3xl font-bold md:text-4xl">From idea to live site</h2>
            </div>
            <ol className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {steps.map((s, i) => (
                <li
                  key={s.title}
                  className="reveal rounded-2xl border border-border bg-card p-7 shadow-card"
                >
                  <span className="font-display text-3xl font-bold text-accent">0{i + 1}</span>
                  <h3 className="mt-3 text-lg font-bold">{s.title}</h3>
                  <p className="mt-2 text-muted-foreground">{s.desc}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section id="pricing" className="mx-auto max-w-6xl px-6 py-24">
          <div className="reveal mb-12">
            <p className="text-sm font-medium uppercase tracking-widest text-accent">Pricing</p>
            <h2 className="mt-2 text-3xl font-bold md:text-4xl">Simple packages</h2>
            <p className="mt-3 max-w-xl text-muted-foreground">
              Starting prices. Domain and hosting are billed at cost — often free for .com.np
              domains.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {packages.map((p) => (
              <div
                key={p.name}
                className={`reveal flex flex-col rounded-2xl border bg-card p-8 shadow-card ${
                  p.featured ? "border-accent shadow-glow" : "border-border"
                }`}
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold">{p.name}</h3>
                  {p.featured && (
                    <span className="rounded-full bg-accent px-3 py-1 text-xs font-medium text-accent-foreground">
                      Most popular
                    </span>
                  )}
                </div>
                <p className="mt-4">
                  <span className="text-sm text-muted-foreground">from </span>
                  <span className="font-display text-3xl font-bold">{p.price}</span>
                </p>
                <p className="mt-2 text-muted-foreground">{p.blurb}</p>
                <ul className="mt-6 flex-1 space-y-3">
                  {p.features.map((f) => (
                    <li key={f} className="flex gap-3 text-sm">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                      {f}
                    </li>
                  ))}
                </ul>
                <a
                  href="#quote"
                  className={`mt-8 inline-flex justify-center rounded-md px-5 py-3 text-sm font-medium transition-transform hover:-translate-y-0.5 ${
                    p.featured
                      ? "bg-primary text-primary-foreground"
                      : "border border-border bg-background hover:border-accent"
                  }`}
                >
                  Choose {p.name}
                </a>
              </div>
            ))}
          </div>
        </section>

        <section id="faq" className="mx-auto max-w-3xl px-6 py-24">
          <div className="reveal mb-10">
            <p className="text-sm font-medium uppercase tracking-widest text-accent">FAQ</p>
            <h2 className="mt-2 text-3xl font-bold md:text-4xl">Common questions</h2>
          </div>
          <Accordion type="single" collapsible className="reveal">
            {faqs.map((f, i) => (
              <AccordionItem key={f.q} value={`faq-${i}`}>
                <AccordionTrigger className="text-left text-base font-semibold">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>

        <section id="quote" className="border-t border-border/60 bg-secondary/40">
          <div className="mx-auto grid max-w-6xl gap-12 px-6 py-24 md:grid-cols-[1fr_1.2fr]">
            <div className="reveal">
              <p className="text-sm font-medium uppercase tracking-widest text-accent">
                Get a quote
              </p>
              <h2 className="mt-2 text-3xl font-bold md:text-4xl">Let's build your site.</h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Tell me a little about your business. I'll reply within a day with ideas and a price
                — no obligation.
              </p>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 flex w-fit items-center gap-2 rounded-md bg-[#25D366] px-5 py-3 text-sm font-medium text-white transition-transform hover:-translate-y-0.5"
              >
                <MessageCircle className="h-4 w-4" />
                Prefer WhatsApp? Message me
              </a>
              <a
                href="mailto:prajasaphin18@gmail.com"
                className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-accent hover:underline"
              >
                <Mail className="h-4 w-4" />
                prajasaphin18@gmail.com
              </a>
            </div>

            <form
              onSubmit={onSubmit}
              className="reveal space-y-4 rounded-2xl border border-border bg-card p-8 shadow-card"
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="quote-name" className="mb-1.5 block text-sm font-medium">
                    Name
                  </label>
                  <input
                    required
                    id="quote-name"
                    name="name"
                    maxLength={100}
                    className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm outline-none transition-colors focus:border-accent focus:ring-2 focus:ring-accent/20"
                  />
                </div>
                <div>
                  <label htmlFor="quote-email" className="mb-1.5 block text-sm font-medium">
                    Email
                  </label>
                  <input
                    required
                    type="email"
                    id="quote-email"
                    name="email"
                    maxLength={255}
                    className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm outline-none transition-colors focus:border-accent focus:ring-2 focus:ring-accent/20"
                  />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="quote-phone" className="mb-1.5 block text-sm font-medium">
                    Phone / WhatsApp{" "}
                    <span className="font-normal text-muted-foreground">(optional)</span>
                  </label>
                  <input
                    type="tel"
                    id="quote-phone"
                    name="phone"
                    inputMode="tel"
                    autoComplete="tel"
                    placeholder="98XXXXXXXX"
                    maxLength={20}
                    pattern="[0-9+\-\s]{7,20}"
                    title="Numbers only, e.g. 98XXXXXXXX"
                    className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm outline-none transition-colors focus:border-accent focus:ring-2 focus:ring-accent/20"
                  />
                </div>
                <div>
                  <label htmlFor="quote-business" className="mb-1.5 block text-sm font-medium">
                    Type of business
                  </label>
                  <select
                    id="quote-business"
                    name="business"
                    className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm outline-none transition-colors focus:border-accent focus:ring-2 focus:ring-accent/20"
                  >
                    <option>Restaurant / Café</option>
                    <option>Shop / Online store</option>
                    <option>Salon / Clinic / Gym</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>
              <div>
                <label htmlFor="quote-message" className="mb-1.5 block text-sm font-medium">
                  What do you need?
                </label>
                <textarea
                  required
                  id="quote-message"
                  name="message"
                  rows={5}
                  maxLength={900}
                  className="w-full resize-none rounded-lg border border-input bg-background px-4 py-2.5 text-sm outline-none transition-colors focus:border-accent focus:ring-2 focus:ring-accent/20"
                />
              </div>
              {/* Honeypot field — hidden from users, bots fill it in */}
              <div aria-hidden="true" className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
                <label htmlFor="quote-website">Website</label>
                <input
                  id="quote-website"
                  name="website"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                />
              </div>
              {status === "error" && (
                <p className="text-sm text-destructive" role="alert">
                  {errorMessage} Please try again or email me directly.
                </p>
              )}
              <button
                type="submit"
                disabled={status === "sending" || status === "sent"}
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition-transform hover:-translate-y-0.5 disabled:opacity-70"
              >
                {status === "sending"
                  ? "Sending…"
                  : status === "sent"
                    ? "Thanks — I'll reply within a day"
                    : "Request a quote"}
              </button>
            </form>
          </div>
        </section>
      </main>

      <a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="fixed bottom-5 right-5 z-50 grid h-14 w-14 place-items-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-105"
      >
        <MessageCircle className="h-6 w-6" />
      </a>

      <footer className="border-t border-border/60">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-6 py-8 text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Saphin Praja · Kathmandu, Nepal</p>
          <Link to="/" className="hover:text-foreground">
            View my data analyst portfolio
          </Link>
        </div>
      </footer>
    </div>
  );
}
