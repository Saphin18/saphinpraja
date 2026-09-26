import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  Leaf,
  MapPin,
  MessageCircle,
  Phone,
  Star,
  Truck,
  UtensilsCrossed,
} from "lucide-react";
import { DemoBanner, demoBusiness, demoHead, validateDemoSearch } from "@/components/demo-banner";

export const Route = createFileRoute("/demos/restaurant")({
  validateSearch: validateDemoSearch,
  head: ({ match }) => {
    const base = demoHead(
      "/demos/restaurant",
      "Himalayan Thakali Kitchen — Restaurant Website Demo",
      "Sample restaurant website by Saphin Praja: dish slideshow, photo menu, gallery, reviews, and WhatsApp ordering.",
      match.search.n,
    );
    return {
      ...base,
      links: [
        ...base.links,
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;1,600&display=swap",
        },
        { rel: "preload", as: "image", href: "/demos/restaurant/thakali-set.webp" },
      ],
    };
  },
  component: Restaurant,
});

const IMG = "/demos/restaurant";

const slides = [
  {
    img: "thakali-set",
    name: "Chicken Thakali Set",
    note: "Our signature — unlimited dal & rice",
    price: 650,
  },
  { img: "jhol-momo-red", name: "Jhol Momo", note: "Folded fresh every morning", price: 260 },
  {
    img: "chicken-chilli",
    name: "Chicken Chilli",
    note: "Smoky, spicy, and made to share",
    price: 420,
  },
  {
    img: "jhol-momo",
    name: "Sesame Jhol Momo",
    note: "A warm bowl for a cold Kathmandu evening",
    price: 280,
  },
];

const signatures = [
  {
    img: "mutton-thakali",
    name: "Mutton Thakali Set",
    desc: "Slow-cooked mutton, buckwheat dhido on request.",
    price: 850,
  },
  {
    img: "steam-momo",
    name: "Steam Chicken Momo",
    desc: "Ten pieces with our tomato-sesame achar.",
    price: 220,
  },
  {
    img: "momo-platter",
    name: "Momo Platter",
    desc: "Steam and kothey momo on banana leaf, with two achars.",
    price: 450,
  },
];

type Item = { name: string; desc: string; price: number; img?: string };

const menu: Record<string, Item[]> = {
  "Thakali Sets": [
    {
      name: "Veg Thakali Set",
      desc: "Rice, black lentil dal, seasonal greens, gundruk, achar, papad",
      price: 450,
      img: "veg-thakali",
    },
    {
      name: "Chicken Thakali Set",
      desc: "Our classic set with slow-cooked village chicken curry",
      price: 650,
      img: "chicken-thakali",
    },
    {
      name: "Mutton Thakali Set",
      desc: "Tender mutton curry, buckwheat dhido on request",
      price: 850,
      img: "mutton-thakali",
    },
  ],
  Momo: [
    {
      name: "Steam Chicken Momo",
      desc: "10 pieces with tomato-sesame achar",
      price: 220,
      img: "steam-momo",
    },
    {
      name: "Jhol Momo",
      desc: "Swimming in a tangy, spiced soup",
      price: 260,
      img: "jhol-momo-red",
    },
    {
      name: "Sesame Jhol Momo",
      desc: "Creamy sesame and timur broth",
      price: 280,
      img: "jhol-momo-bowl",
    },
    {
      name: "Momo Platter",
      desc: "Steam and kothey momo on banana leaf, with two achars",
      price: 450,
      img: "momo-platter",
    },
  ],
  "Snacks & Noodles": [
    {
      name: "Chicken Chilli",
      desc: "Wok-tossed with onion, capsicum, and green chilli",
      price: 420,
      img: "chicken-chilli",
    },
    {
      name: "Buff Chowmein",
      desc: "Hand-pulled noodles with vegetables",
      price: 240,
      img: "chowmein",
    },
    {
      name: "Sel Roti",
      desc: "Crispy rice-flour rings, fried fresh — perfect with chiya",
      price: 150,
      img: "sel-roti",
    },
  ],
  Drinks: [
    { name: "Masala Chiya", desc: "Milk tea with fresh ginger and cardamom", price: 60 },
    { name: "Lassi", desc: "Sweet or salted, made fresh", price: 150 },
    { name: "Fresh Lime Soda", desc: "Sweet, salted, or mixed", price: 120 },
  ],
};

const gallery = [
  "thakali-brass",
  "jhol-momo",
  "chowmein",
  "thakali-closeup",
  "steam-momo",
  "chicken-thakali",
];

const reviews = [
  {
    name: "Monkey D. Luffy",
    text: "MEAT!! The mutton set here is the best thing I've ever eaten. I asked for refills eleven times and they kept smiling!",
    when: "2 weeks ago",
  },
  {
    name: "Portgas D. Ace",
    text: "Came in hungry after a long journey — the jhol momo warmed me right up. Fell asleep at the table, but they didn't mind.",
    when: "1 month ago",
  },
  {
    name: "Sabo",
    text: "Brought my brothers here and there wasn't a single grain of rice left. Clean, cosy, and the chicken chilli is perfect.",
    when: "3 months ago",
  },
];

const SLIDE_MS = 5500;

function HeroSlider({ area, whatsapp }: { area: string; whatsapp: string }) {
  const [active, setActive] = useState(0);
  const [prev, setPrev] = useState(-1);
  const [paused, setPaused] = useState(false);

  // Keep the outgoing slide zoomed while it fades, so it doesn't snap back to scale 1.
  const go = useCallback((i: number) => {
    setActive((a) => {
      setPrev(a);
      return (i + slides.length) % slides.length;
    });
  }, []);

  useEffect(() => {
    if (paused) return;
    const t = window.setTimeout(() => go(active + 1), SLIDE_MS);
    return () => window.clearTimeout(t);
  }, [active, paused, go]);

  const current = slides[active];

  return (
    <section
      className="relative h-[92svh] min-h-[560px] overflow-hidden bg-stone-950 text-white"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-roledescription="carousel"
      aria-label="Our dishes"
    >
      {slides.map((s, i) => (
        <img
          key={s.img}
          src={`${IMG}/${s.img}.webp`}
          alt={s.name}
          loading={i === 0 ? "eager" : "lazy"}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-[1200ms] ease-out ${
            i === active
              ? "rst-kenburns opacity-100"
              : i === prev
                ? "rst-kenburns opacity-0"
                : "opacity-0"
          }`}
        />
      ))}
      <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-black/10" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/70 to-transparent" />

      <div className="relative mx-auto flex h-full max-w-6xl flex-col justify-center px-6 pb-24 pt-16 sm:pb-16">
        <p className="rst-rise flex items-center gap-2 text-sm font-medium uppercase tracking-[0.25em] text-amber-300">
          <MapPin className="h-4 w-4" /> {area}
        </p>
        <h1
          className="rst-rise mt-5 max-w-2xl text-5xl font-bold leading-[1.05] md:text-7xl"
          style={{ animationDelay: "120ms" }}
        >
          Home-style Thakali, <em className="text-amber-300">cooked the Mustang way.</em>
        </h1>
        <p
          className="rst-rise mt-6 max-w-lg text-lg text-stone-200"
          style={{ animationDelay: "240ms" }}
        >
          Unlimited refills of dal and rice, greens from our own farm, and momos folded fresh every
          morning.
        </p>
        <div className="rst-rise mt-10 flex flex-wrap gap-3" style={{ animationDelay: "360ms" }}>
          <a
            href="#menu"
            className="rounded-full bg-amber-400 px-7 py-3.5 text-sm font-semibold text-stone-950 transition-transform hover:-translate-y-0.5 hover:bg-amber-300"
          >
            See the menu
          </a>
          <a
            href={whatsapp}
            className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/5 px-7 py-3.5 text-sm font-semibold backdrop-blur transition-colors hover:bg-white/15"
          >
            <MessageCircle className="h-4 w-4" />
            Order on WhatsApp
          </a>
        </div>
      </div>

      {/* Current dish caption + controls */}
      <div className="absolute inset-x-0 bottom-8">
        <div className="mx-auto flex max-w-6xl flex-wrap items-end justify-between gap-6 px-6">
          <div
            key={current.img}
            className="rst-rise hidden max-w-xs rounded-2xl border border-white/15 bg-black/35 p-4 backdrop-blur-md sm:block"
          >
            <p className="text-xs uppercase tracking-widest text-amber-300">Now serving</p>
            <p className="rst-serif mt-1 text-xl font-semibold">{current.name}</p>
            <p className="text-sm text-stone-300">
              {current.note} ·{" "}
              <span className="whitespace-nowrap font-semibold text-white">Rs {current.price}</span>
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex gap-2">
              {slides.map((s, i) => (
                <button
                  key={s.img}
                  type="button"
                  onClick={() => go(i)}
                  aria-label={`Show ${s.name}`}
                  className="relative h-1.5 w-10 overflow-hidden rounded-full bg-white/25"
                >
                  {i === active && (
                    <span
                      key={`${active}-${paused}`}
                      className="rst-progress absolute inset-y-0 left-0 bg-amber-400"
                      style={{
                        animationDuration: `${SLIDE_MS}ms`,
                        animationPlayState: paused ? "paused" : "running",
                      }}
                    />
                  )}
                  {i < active && <span className="absolute inset-0 bg-white/70" />}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => go(active - 1)}
                aria-label="Previous dish"
                className="grid h-10 w-10 place-items-center rounded-full border border-white/30 transition-colors hover:bg-white/15"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={() => go(active + 1)}
                aria-label="Next dish"
                className="grid h-10 w-10 place-items-center rounded-full border border-white/30 transition-colors hover:bg-white/15"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Restaurant() {
  const biz = demoBusiness(
    Route.useSearch(),
    {
      name: "Himalayan Thakali Kitchen",
      area: "Manahari, Makwanpur",
      address: "Main Road, Manahari, Makwanpur",
    },
    "#visit",
  );
  const [tab, setTab] = useState("Thakali Sets");

  return (
    <div className="rst min-h-screen bg-[#fbf7f0] font-sans text-stone-900">
      <style>{`
        .rst h1, .rst h2, .rst h3, .rst-serif { font-family: "Playfair Display", Georgia, serif; letter-spacing: -0.01em; }
        @keyframes rst-kenburns { from { transform: scale(1); } to { transform: scale(1.12); } }
        .rst-kenburns { animation: rst-kenburns 12s ease-out forwards; }
        @keyframes rst-rise { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: none; } }
        .rst-rise { animation: rst-rise 0.8s cubic-bezier(.2,.7,.2,1) both; }
        @keyframes rst-progress { from { width: 0; } to { width: 100%; } }
        .rst-progress { animation-name: rst-progress; animation-timing-function: linear; animation-fill-mode: forwards; }
        @media (prefers-reduced-motion: reduce) {
          .rst-kenburns, .rst-rise, .rst-progress { animation: none !important; }
        }
      `}</style>

      <DemoBanner forName={biz.personalised ? biz.name : undefined} />

      <div className="relative">
        <header className="absolute inset-x-0 top-0 z-30">
          <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-6 text-white">
            <span className="rst-serif flex items-center gap-2 text-xl font-bold">
              <UtensilsCrossed className="h-5 w-5 text-amber-300" />
              {biz.personalised ? biz.name : "Himalayan Thakali"}
            </span>
            <nav className="hidden gap-8 text-sm text-stone-200 md:flex">
              <a href="#menu" className="hover:text-white">
                Menu
              </a>
              <a href="#story" className="hover:text-white">
                Our story
              </a>
              <a href="#gallery" className="hover:text-white">
                Gallery
              </a>
              <a href="#visit" className="hover:text-white">
                Visit
              </a>
            </nav>
            <a
              href="#visit"
              className="rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-stone-900 transition-colors hover:bg-amber-300"
            >
              Order now
            </a>
          </div>
        </header>
        <HeroSlider area={biz.area} whatsapp={biz.whatsapp} />
      </div>

      {/* Highlights */}
      <section className="border-b border-stone-200 bg-white">
        <div className="mx-auto grid max-w-6xl gap-6 px-6 py-8 sm:grid-cols-3">
          {[
            { icon: Star, title: "4.8 on Google", sub: "From 600+ reviews" },
            { icon: Leaf, title: "Farm-fresh greens", sub: "Grown on our own land" },
            { icon: Truck, title: "Free delivery", sub: "Within 3 km, 10 AM – 9 PM" },
          ].map(({ icon: Icon, title, sub }) => (
            <div key={title} className="flex items-center gap-4">
              <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-amber-100 text-orange-800">
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold">{title}</p>
                <p className="text-sm text-stone-500">{sub}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Signature dishes */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <div className="text-center">
          <p className="text-sm font-medium uppercase tracking-[0.25em] text-orange-700">
            Chef's favourites
          </p>
          <h2 className="mt-3 text-4xl font-bold md:text-5xl">Our signature dishes</h2>
        </div>
        <div className="mt-14 grid gap-8 md:grid-cols-3">
          {signatures.map((d) => (
            <article
              key={d.name}
              className="group overflow-hidden rounded-3xl bg-white shadow-sm transition-shadow hover:shadow-xl"
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={`${IMG}/${d.img}-sm.webp`}
                  alt={d.name}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>
              <div className="p-6">
                <div className="flex items-baseline justify-between gap-4">
                  <h3 className="text-xl font-semibold">{d.name}</h3>
                  <span className="font-semibold text-orange-700">Rs {d.price}</span>
                </div>
                <p className="mt-2 text-stone-600">{d.desc}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Menu */}
      <section id="menu" className="bg-white py-24">
        <div className="mx-auto max-w-4xl px-6">
          <div className="text-center">
            <p className="text-sm font-medium uppercase tracking-[0.25em] text-orange-700">
              Full menu
            </p>
            <h2 className="mt-3 text-4xl font-bold md:text-5xl">What we're cooking</h2>
            <p className="mt-3 text-stone-500">Prices in NPR, inclusive of VAT.</p>
          </div>
          <div className="mt-10 flex flex-wrap justify-center gap-2">
            {Object.keys(menu).map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setTab(c)}
                className={`rounded-full px-5 py-2 text-sm font-medium transition-colors ${
                  tab === c
                    ? "bg-stone-900 text-white"
                    : "bg-stone-100 text-stone-700 hover:bg-amber-100"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
          <ul key={tab} className="rst-rise mt-10 space-y-4">
            {menu[tab].map((item) => (
              <li
                key={item.name}
                className="flex items-center gap-5 rounded-2xl border border-stone-100 bg-[#fbf7f0] p-4"
              >
                {item.img ? (
                  <img
                    src={`${IMG}/${item.img}-sm.webp`}
                    alt={item.name}
                    loading="lazy"
                    className="h-20 w-20 shrink-0 rounded-xl object-cover"
                  />
                ) : (
                  <div className="grid h-20 w-20 shrink-0 place-items-center rounded-xl bg-amber-100 text-2xl">
                    ☕
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <h3 className="text-lg font-semibold">{item.name}</h3>
                  <p className="mt-0.5 text-sm text-stone-600">{item.desc}</p>
                </div>
                <span className="whitespace-nowrap font-semibold text-orange-700">
                  Rs {item.price}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Story */}
      <section id="story" className="bg-stone-950 text-stone-100">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-24 md:grid-cols-2">
          <div className="overflow-hidden rounded-3xl">
            <img
              src={`${IMG}/thakali-table-sm.webp`}
              alt="A Thakali set served family style"
              loading="lazy"
              className="aspect-[4/5] w-full object-cover"
            />
          </div>
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.25em] text-amber-300">
              Our story
            </p>
            <h2 className="mt-3 text-4xl font-bold md:text-5xl">A family kitchen from Marpha.</h2>
            <p className="mt-6 text-lg leading-relaxed text-stone-300">
              Our recipes come from our grandmother's kitchen in Marpha. We still dry our own
              gundruk, grind spices by hand, and cook dal slowly over a low flame — just like home.
            </p>
            <div className="mt-10 grid grid-cols-3 gap-6 border-t border-white/10 pt-8">
              {[
                ["2015", "Serving since"],
                ["40+", "Dishes daily"],
                ["3", "Generations"],
              ].map(([n, l]) => (
                <div key={l}>
                  <p className="rst-serif text-3xl font-bold text-amber-300">{n}</p>
                  <p className="mt-1 text-sm text-stone-400">{l}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section id="gallery" className="mx-auto max-w-6xl px-6 py-24">
        <div className="text-center">
          <p className="text-sm font-medium uppercase tracking-[0.25em] text-orange-700">Gallery</p>
          <h2 className="mt-3 text-4xl font-bold md:text-5xl">From our kitchen</h2>
        </div>
        <div className="mt-14 grid auto-rows-[180px] grid-cols-2 gap-4 md:auto-rows-[220px] md:grid-cols-4">
          {gallery.map((g, i) => (
            <div
              key={g}
              className={`group overflow-hidden rounded-2xl ${i === 0 ? "col-span-2 row-span-2" : ""} ${i === 3 ? "md:col-span-2" : ""}`}
            >
              <img
                src={`${IMG}/${g}${i === 0 ? "" : "-sm"}.webp`}
                alt=""
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
            </div>
          ))}
        </div>
      </section>

      {/* Reviews */}
      <section className="bg-amber-50 py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center">
            <p className="text-sm font-medium uppercase tracking-[0.25em] text-orange-700">
              Reviews
            </p>
            <h2 className="mt-3 text-4xl font-bold md:text-5xl">What our guests say</h2>
          </div>
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {reviews.map((r) => (
              <figure key={r.name} className="rounded-3xl bg-white p-8 shadow-sm">
                <div className="flex gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <blockquote className="mt-4 text-stone-700">“{r.text}”</blockquote>
                <figcaption className="mt-6 flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-orange-700 font-semibold text-white">
                    {r.name[0]}
                  </span>
                  <span>
                    <span className="block font-semibold">{r.name}</span>
                    <span className="text-xs text-stone-500">Google review · {r.when}</span>
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* Visit */}
      <section id="visit" className="mx-auto max-w-6xl px-6 py-24">
        <div className="grid gap-10 md:grid-cols-2">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.25em] text-orange-700">
              Visit or order
            </p>
            <h2 className="mt-3 text-4xl font-bold md:text-5xl">Come hungry.</h2>
            <div className="mt-10 space-y-6">
              {[
                { icon: MapPin, title: "Find us", lines: [biz.address] },
                { icon: Clock, title: "Opening hours", lines: ["Every day, 10:00 AM – 9:30 PM"] },
                {
                  icon: Phone,
                  title: "Call or WhatsApp",
                  lines: [`${biz.phone} · Free delivery within 3 km`],
                },
              ].map(({ icon: Icon, title, lines }) => (
                <div key={title} className="flex gap-4">
                  <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-amber-100 text-orange-800">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold" style={{ fontFamily: "inherit" }}>
                      {title}
                    </h3>
                    {lines.map((l) => (
                      <p key={l} className="text-stone-600">
                        {l}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <a
              href={biz.whatsapp}
              className="mt-10 inline-flex items-center gap-2 rounded-full bg-[#25D366] px-7 py-3.5 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5"
            >
              <MessageCircle className="h-4 w-4" />
              Order on WhatsApp
            </a>
          </div>
          <div className="min-h-[320px] overflow-hidden rounded-3xl border border-stone-200 shadow-sm">
            <iframe
              title={`Map to ${biz.name}`}
              src={biz.mapSrc}
              loading="lazy"
              className="h-full min-h-[320px] w-full"
            />
          </div>
        </div>
      </section>

      <footer className="bg-stone-950 py-10 text-center text-sm text-stone-400">
        <p className="rst-serif text-lg text-white">{biz.name}</p>
        <p className="mt-2">
          {biz.area} · © {new Date().getFullYear()} (demo)
        </p>
      </footer>
    </div>
  );
}
