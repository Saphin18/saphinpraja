import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import {
  ArrowRight,
  CalendarCheck,
  Check,
  Clock,
  Instagram,
  MapPin,
  Phone,
  ShieldCheck,
  Sparkles,
  Star,
} from "lucide-react";
import { DemoBanner, demoHead } from "@/components/demo-banner";

export const Route = createFileRoute("/demos/salon")({
  head: () => {
    const base = demoHead(
      "/demos/salon",
      "Glow Studio — Salon Booking Website Demo",
      "Sample salon website by Saphin Praja: services with prices, stylist profiles, gallery, reviews, and online appointment booking.",
    );
    return {
      ...base,
      links: [
        ...base.links,
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;0,700;1,500;1,600&display=swap",
        },
      ],
    };
  },
  component: Salon,
});

const IMG = "/demos/salon";

const heroSlides = [
  { img: "facial-glow", label: "Hydrating Facial" },
  { img: "bridal-mehendi", label: "Bridal Mehendi" },
  { img: "haircut", label: "Precision Cuts" },
  { img: "massage", label: "Relaxing Massage" },
];

type Service = {
  id: string;
  name: string;
  desc: string;
  time: string;
  price: number;
  img: string;
  group: string;
};

const services: Service[] = [
  {
    id: "cut",
    name: "Haircut & Styling",
    desc: "Consultation, wash, cut, and blow-dry finish.",
    time: "45 min",
    price: 800,
    img: "haircut",
    group: "Hair",
  },
  {
    id: "colour",
    name: "Hair Colour (Global)",
    desc: "Ammonia-free colour with a gloss treatment.",
    time: "2 hr",
    price: 4500,
    img: "salon-products",
    group: "Hair",
  },
  {
    id: "keratin",
    name: "Keratin Treatment",
    desc: "Smooth, frizz-free hair for up to 4 months.",
    time: "3 hr",
    price: 7500,
    img: "blow-dry",
    group: "Hair",
  },
  {
    id: "facial",
    name: "Hydrating Facial",
    desc: "Deep cleanse, mask, and serum for glowing skin.",
    time: "60 min",
    price: 2200,
    img: "skincare",
    group: "Skin",
  },
  {
    id: "massage",
    name: "Aroma Massage",
    desc: "Full-body massage with warm herbal oils.",
    time: "60 min",
    price: 2800,
    img: "massage",
    group: "Skin",
  },
  {
    id: "nails",
    name: "Manicure & Pedicure",
    desc: "Shaping, cuticle care, and polish of your choice.",
    time: "75 min",
    price: 1800,
    img: "nail-polish",
    group: "Nails",
  },
  {
    id: "mehendi",
    name: "Mehendi — Both Hands",
    desc: "Hand-drawn designs with natural henna.",
    time: "90 min",
    price: 2500,
    img: "mehendi-hands",
    group: "Bridal",
  },
  {
    id: "bridal",
    name: "Bridal Makeup",
    desc: "Trial session, HD makeup, hair, and draping.",
    time: "3 hr",
    price: 15000,
    img: "bridal-mehendi",
    group: "Bridal",
  },
];

const groups = ["All", "Hair", "Skin", "Nails", "Bridal"];

const team = [
  {
    name: "Shirahoshi",
    role: "Senior Stylist",
    years: "9 years",
    img: "haircut",
    skills: "Cuts · Blow-dry · Keratin",
  },
  {
    name: "Otama",
    role: "Colour Specialist",
    years: "7 years",
    img: "blow-dry",
    skills: "Global colour · Balayage",
  },
  {
    name: "Hiyori",
    role: "Bridal & Makeup Artist",
    years: "11 years",
    img: "mehendi-hands",
    skills: "Bridal · Mehendi · HD makeup",
  },
];

const gallery = ["updo", "bridal-mehendi", "nail-art", "spa-stones", "makeup-palette"];

const reviews = [
  {
    name: "Nico Robin",
    text: "Calm, clean, and quietly brilliant. The hydrating facial left my skin glowing for a week. I'll be back with a good book.",
    service: "Hydrating Facial",
  },
  {
    name: "Boa Hancock",
    text: "Naturally, I only trust the very best with my hair. Shirahoshi passed the test. Everyone stared on my way out — as they should.",
    service: "Haircut & Styling",
  },
  {
    name: "Nefertari Vivi",
    text: "Hiyori did my bridal makeup and mehendi. It lasted all day through dancing and tears. Truly royal treatment.",
    service: "Bridal Makeup",
  },
];

const times = ["10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"];
// Pretend some slots are taken so the calendar feels real.
const takenFor = (dayIndex: number) =>
  new Set([times[(dayIndex * 2) % times.length], times[(dayIndex * 5 + 3) % times.length]]);

const rs = (n: number) => `Rs ${n.toLocaleString("en-IN")}`;

type Day = { key: string; weekday: string; date: number; month: string };

function nextDays(n: number): Day[] {
  const out: Day[] = [];
  const d = new Date();
  for (let i = 0; i < n; i++) {
    const x = new Date(d.getFullYear(), d.getMonth(), d.getDate() + i);
    out.push({
      key: x.toISOString().slice(0, 10),
      weekday:
        i === 0
          ? "Today"
          : i === 1
            ? "Tomorrow"
            : x.toLocaleDateString("en-US", { weekday: "short" }),
      date: x.getDate(),
      month: x.toLocaleDateString("en-US", { month: "short" }),
    });
  }
  return out;
}

const SLIDE_MS = 4500;

function Salon() {
  const [slide, setSlide] = useState(0);
  const [group, setGroup] = useState("All");
  const [serviceId, setServiceId] = useState("facial");
  const [stylist, setStylist] = useState("Any stylist");
  const [days, setDays] = useState<Day[]>([]);
  const [dayIndex, setDayIndex] = useState(0);
  const [time, setTime] = useState<string | null>(null);
  const [booked, setBooked] = useState<string | null>(null);

  // Dates are built on the client so server and browser agree on "today".
  useEffect(() => setDays(nextDays(7)), []);

  useEffect(() => {
    const t = window.setTimeout(() => setSlide((s) => (s + 1) % heroSlides.length), SLIDE_MS);
    return () => window.clearTimeout(t);
  }, [slide]);

  const service = services.find((s) => s.id === serviceId)!;
  const visible = group === "All" ? services : services.filter((s) => s.group === group);
  const taken = takenFor(dayIndex);

  function choose(id: string) {
    setServiceId(id);
    setBooked(null);
    document.getElementById("book")?.scrollIntoView({ behavior: "smooth" });
  }

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const day = days[dayIndex];
    const name = String(new FormData(e.currentTarget).get("name") ?? "");
    setBooked(
      `${name ? `${name}, your` : "Your"} ${service.name} with ${stylist.toLowerCase() === "any stylist" ? "the first available stylist" : stylist} is booked for ${day.weekday === "Today" || day.weekday === "Tomorrow" ? day.weekday.toLowerCase() : `${day.weekday} ${day.date} ${day.month}`} at ${time}.`,
    );
    e.currentTarget.reset();
    setTime(null);
  }

  return (
    <div className="sln min-h-screen bg-[#f7f4ef] font-sans text-[#1f2a24]">
      <style>{`
        .sln h1, .sln h2, .sln h3, .sln-serif { font-family: "Cormorant Garamond", Georgia, serif; letter-spacing: -0.01em; }
        @keyframes sln-rise { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: none; } }
        .sln-rise { animation: sln-rise 0.8s cubic-bezier(.2,.7,.2,1) both; }
        @keyframes sln-float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
        .sln-float { animation: sln-float 5s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) { .sln-rise, .sln-float { animation: none !important; } }
      `}</style>

      <DemoBanner />

      <header className="sticky top-0 z-40 border-b border-[#1f2a24]/10 bg-[#f7f4ef]/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <span className="sln-serif flex items-center gap-2 text-2xl font-semibold">
            <Sparkles className="h-5 w-5 text-[#b08d57]" />
            Glow Studio
          </span>
          <nav className="hidden gap-8 text-sm text-[#1f2a24]/70 md:flex">
            <a href="#services" className="hover:text-[#1f2a24]">
              Services
            </a>
            <a href="#team" className="hover:text-[#1f2a24]">
              Team
            </a>
            <a href="#gallery" className="hover:text-[#1f2a24]">
              Gallery
            </a>
            <a href="#reviews" className="hover:text-[#1f2a24]">
              Reviews
            </a>
          </nav>
          <a
            href="#book"
            className="rounded-full bg-[#2f4a3c] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#1f3329]"
          >
            Book now
          </a>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute -left-32 top-10 h-96 w-96 rounded-full bg-[#e8d9c0]/60 blur-3xl" />
        <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-6 py-14 md:grid-cols-[1.05fr_1fr] md:py-20">
          <div>
            <p className="sln-rise text-sm font-medium uppercase tracking-[0.3em] text-[#b08d57]">
              Hair · Skin · Nails · Bridal
            </p>
            <h1
              className="sln-rise mt-5 text-6xl font-semibold leading-[0.95] md:text-8xl"
              style={{ animationDelay: "100ms" }}
            >
              Feel like <em className="text-[#2f4a3c]">yourself,</em> only more.
            </h1>
            <p
              className="sln-rise mt-6 max-w-md text-lg text-[#1f2a24]/70"
              style={{ animationDelay: "200ms" }}
            >
              A calm, beautiful salon in Manahari. Expert stylists, premium products, and the
              easiest online booking in town.
            </p>
            <div className="sln-rise mt-9 flex flex-wrap gap-3" style={{ animationDelay: "300ms" }}>
              <a
                href="#book"
                className="group inline-flex items-center gap-2 rounded-full bg-[#2f4a3c] px-7 py-3.5 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5"
              >
                Book an appointment
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </a>
              <a
                href="#services"
                className="inline-flex items-center rounded-full border border-[#1f2a24]/20 px-7 py-3.5 text-sm font-semibold transition-colors hover:border-[#1f2a24]"
              >
                View prices
              </a>
            </div>
            <div className="mt-10 flex flex-wrap items-center gap-6 text-sm text-[#1f2a24]/70">
              <span className="flex items-center gap-2">
                <Star className="h-4 w-4 fill-[#b08d57] text-[#b08d57]" /> 4.9 · 850+ reviews
              </span>
              <span className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-[#2f4a3c]" /> Hygiene certified
              </span>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-md">
            <div className="relative aspect-[4/5] overflow-hidden rounded-t-[999px] rounded-b-[2rem] bg-[#e8d9c0] shadow-2xl">
              {heroSlides.map((s, i) => (
                <img
                  key={s.img}
                  src={`${IMG}/${s.img}.webp`}
                  alt={s.label}
                  loading={i === 0 ? "eager" : "lazy"}
                  className={`absolute inset-0 h-full w-full object-cover transition-all duration-[1200ms] ease-out ${
                    i === slide ? "scale-100 opacity-100" : "scale-110 opacity-0"
                  }`}
                />
              ))}
              <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/50 to-transparent" />
              <p
                key={slide}
                className="sln-rise sln-serif absolute bottom-6 left-0 right-0 text-center text-2xl italic text-white"
              >
                {heroSlides[slide].label}
              </p>
            </div>
            <div className="sln-float absolute -left-6 top-16 hidden rounded-2xl bg-white p-4 shadow-xl sm:block">
              <p className="flex items-center gap-2 text-xs font-medium text-[#1f2a24]/60">
                <CalendarCheck className="h-4 w-4 text-[#2f4a3c]" /> Next available
              </p>
              <p className="mt-1 font-semibold">Today, 3:00 PM</p>
            </div>
            <div
              className="sln-float absolute -right-4 bottom-20 hidden rounded-2xl bg-[#2f4a3c] p-4 text-white shadow-xl sm:block"
              style={{ animationDelay: "1.5s" }}
            >
              <p className="sln-serif text-3xl font-semibold">12k+</p>
              <p className="text-xs text-white/70">Happy clients</p>
            </div>
            <div className="mt-5 flex justify-center gap-2">
              {heroSlides.map((s, i) => (
                <button
                  key={s.img}
                  type="button"
                  onClick={() => setSlide(i)}
                  aria-label={`Show ${s.label}`}
                  className={`h-1.5 rounded-full transition-all ${i === slide ? "w-8 bg-[#2f4a3c]" : "w-3 bg-[#1f2a24]/20"}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="bg-white py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.3em] text-[#b08d57]">
                Menu & prices
              </p>
              <h2 className="mt-3 text-5xl font-semibold">Our services</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {groups.map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setGroup(g)}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                    group === g
                      ? "bg-[#2f4a3c] text-white"
                      : "bg-[#f7f4ef] text-[#1f2a24]/70 hover:bg-[#e8d9c0]"
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>
          <div key={group} className="sln-rise mt-12 grid gap-5 md:grid-cols-2">
            {visible.map((s) => (
              <article
                key={s.id}
                className="group flex items-center gap-5 rounded-3xl border border-[#1f2a24]/10 p-4 transition-all hover:border-[#b08d57]/50 hover:shadow-lg"
              >
                <div className="h-28 w-28 shrink-0 overflow-hidden rounded-2xl">
                  <img
                    src={`${IMG}/${s.img}-sm.webp`}
                    alt={s.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline justify-between gap-3">
                    <h3 className="text-2xl font-semibold leading-tight">{s.name}</h3>
                    <span className="whitespace-nowrap font-semibold text-[#2f4a3c]">
                      {rs(s.price)}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-[#1f2a24]/60">{s.desc}</p>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-xs text-[#1f2a24]/50">
                      <Clock className="h-3.5 w-3.5" /> {s.time}
                    </span>
                    <button
                      type="button"
                      onClick={() => choose(s.id)}
                      className="text-sm font-semibold text-[#b08d57] hover:text-[#2f4a3c]"
                    >
                      Book →
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Interior / promise */}
      <section className="relative overflow-hidden bg-[#1f2a24] text-white">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-24 md:grid-cols-2">
          <div className="order-2 md:order-1">
            <p className="text-sm font-medium uppercase tracking-[0.3em] text-[#d8bd8a]">
              The Glow promise
            </p>
            <h2 className="mt-3 text-5xl font-semibold">Your hour of calm.</h2>
            <ul className="mt-8 space-y-4 text-white/80">
              {[
                "Tools sterilised after every client",
                "Premium, cruelty-free products only",
                "On time, every time — or your next service is 10% off",
                "Free consultation before any colour or bridal booking",
              ].map((t) => (
                <li key={t} className="flex gap-3">
                  <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[#d8bd8a] text-[#1f2a24]">
                    <Check className="h-3 w-3" />
                  </span>
                  {t}
                </li>
              ))}
            </ul>
          </div>
          <div className="order-1 grid grid-cols-2 gap-4 md:order-2">
            <img
              src={`${IMG}/interior-sm.webp`}
              alt="Inside Glow Studio"
              loading="lazy"
              className="aspect-[3/4] w-full rounded-3xl object-cover"
            />
            <img
              src={`${IMG}/spa-towels-sm.webp`}
              alt="Fresh towels and spa stones"
              loading="lazy"
              className="mt-12 aspect-[3/4] w-full rounded-3xl object-cover"
            />
          </div>
        </div>
      </section>

      {/* Team */}
      <section id="team" className="mx-auto max-w-6xl px-6 py-24">
        <div className="text-center">
          <p className="text-sm font-medium uppercase tracking-[0.3em] text-[#b08d57]">The team</p>
          <h2 className="mt-3 text-5xl font-semibold">Meet your stylists</h2>
        </div>
        <div className="mt-14 grid gap-8 md:grid-cols-3">
          {team.map((t) => (
            <article key={t.name} className="group text-center">
              <div className="mx-auto aspect-[3/4] overflow-hidden rounded-t-[999px] rounded-b-3xl">
                <img
                  src={`${IMG}/${t.img}-sm.webp`}
                  alt={`${t.name}'s work`}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>
              <h3 className="mt-5 text-3xl font-semibold">{t.name}</h3>
              <p className="text-sm font-medium text-[#b08d57]">
                {t.role} · {t.years}
              </p>
              <p className="mt-1 text-sm text-[#1f2a24]/60">{t.skills}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Gallery */}
      <section id="gallery" className="bg-white py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.3em] text-[#b08d57]">
                Gallery
              </p>
              <h2 className="mt-3 text-5xl font-semibold">Recent looks</h2>
            </div>
            <span className="flex items-center gap-2 text-sm text-[#1f2a24]/60">
              <Instagram className="h-4 w-4" /> @glowstudio.np
            </span>
          </div>
          <div className="mt-12 grid auto-rows-[200px] grid-cols-2 gap-4 md:grid-cols-3">
            {gallery.map((g, i) => (
              <div
                key={g}
                className={`group overflow-hidden rounded-3xl ${i === 1 ? "row-span-2" : ""}`}
              >
                <img
                  src={`${IMG}/${g}${i === 1 ? "" : "-sm"}.webp`}
                  alt=""
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section id="reviews" className="mx-auto max-w-6xl px-6 py-24">
        <div className="text-center">
          <p className="text-sm font-medium uppercase tracking-[0.3em] text-[#b08d57]">Reviews</p>
          <h2 className="mt-3 text-5xl font-semibold">Kind words</h2>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {reviews.map((r) => (
            <figure key={r.name} className="rounded-3xl bg-white p-8 shadow-sm">
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-[#b08d57] text-[#b08d57]" />
                ))}
              </div>
              <blockquote className="sln-serif mt-4 text-xl italic leading-snug">
                “{r.text}”
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-full bg-[#2f4a3c] font-semibold text-white">
                  {r.name[0]}
                </span>
                <span>
                  <span className="block font-semibold">{r.name}</span>
                  <span className="text-xs text-[#1f2a24]/50">{r.service}</span>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* Booking */}
      <section id="book" className="scroll-mt-16 bg-[#2f4a3c] text-white">
        <div className="mx-auto grid max-w-6xl gap-12 px-6 py-24 md:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.3em] text-[#d8bd8a]">
              Book online
            </p>
            <h2 className="mt-3 text-5xl font-semibold">Reserve your spot.</h2>
            <p className="mt-4 text-white/70">
              Pick a service, choose a time, and you're done. We'll send a reminder on WhatsApp the
              day before.
            </p>
            <div className="mt-10 space-y-5 text-sm">
              <p className="flex gap-3">
                <MapPin className="h-5 w-5 shrink-0 text-[#d8bd8a]" /> Main Road, Manahari,
                Makwanpur
              </p>
              <p className="flex gap-3">
                <Clock className="h-5 w-5 shrink-0 text-[#d8bd8a]" /> Sun – Fri, 10:00 AM – 7:00 PM
              </p>
              <p className="flex gap-3">
                <Phone className="h-5 w-5 shrink-0 text-[#d8bd8a]" /> 98XX-XXXXXX
              </p>
            </div>
          </div>

          <div className="rounded-[2rem] bg-white p-6 text-[#1f2a24] shadow-2xl md:p-8">
            {booked ? (
              <div className="sln-rise flex flex-col items-center py-10 text-center">
                <div className="grid h-16 w-16 place-items-center rounded-full bg-[#2f4a3c]/10 text-[#2f4a3c]">
                  <CalendarCheck className="h-8 w-8" />
                </div>
                <h3 className="mt-6 text-4xl font-semibold">You're booked!</h3>
                <p className="mt-3 max-w-sm text-[#1f2a24]/70">{booked}</p>
                <p className="mt-2 text-xs text-[#1f2a24]/50">
                  (On a real site, the salon would get this booking by WhatsApp or email.)
                </p>
                <button
                  type="button"
                  onClick={() => setBooked(null)}
                  className="mt-8 rounded-full border border-[#1f2a24]/20 px-6 py-2.5 text-sm font-medium hover:border-[#1f2a24]"
                >
                  Book another
                </button>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="space-y-6">
                <div>
                  <p className="mb-2 text-sm font-semibold">1. Service</p>
                  <select
                    value={serviceId}
                    onChange={(e) => setServiceId(e.target.value)}
                    className="w-full rounded-xl border border-[#1f2a24]/15 bg-[#f7f4ef] px-4 py-3 text-sm outline-none focus:border-[#2f4a3c]"
                  >
                    {services.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} — {rs(s.price)} · {s.time}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <p className="mb-2 text-sm font-semibold">2. Stylist</p>
                  <div className="flex flex-wrap gap-2">
                    {["Any stylist", ...team.map((t) => t.name)].map((n) => (
                      <button
                        key={n}
                        type="button"
                        onClick={() => setStylist(n)}
                        className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                          stylist === n
                            ? "bg-[#2f4a3c] text-white"
                            : "bg-[#f7f4ef] hover:bg-[#e8d9c0]"
                        }`}
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="mb-2 text-sm font-semibold">3. Date</p>
                  <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
                    {days.map((d, i) => (
                      <button
                        key={d.key}
                        type="button"
                        onClick={() => {
                          setDayIndex(i);
                          setTime(null);
                        }}
                        className={`flex w-16 shrink-0 flex-col items-center rounded-2xl py-2.5 text-xs transition-colors ${
                          dayIndex === i
                            ? "bg-[#2f4a3c] text-white"
                            : "bg-[#f7f4ef] hover:bg-[#e8d9c0]"
                        }`}
                      >
                        <span className="opacity-70">{d.weekday}</span>
                        <span className="sln-serif text-2xl font-semibold leading-tight">
                          {d.date}
                        </span>
                        <span className="opacity-70">{d.month}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="mb-2 text-sm font-semibold">4. Time</p>
                  <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
                    {times.map((t) => {
                      const off = taken.has(t);
                      return (
                        <button
                          key={t}
                          type="button"
                          disabled={off}
                          onClick={() => setTime(t)}
                          className={`rounded-xl py-2.5 text-sm font-medium transition-colors ${
                            off
                              ? "cursor-not-allowed bg-[#f7f4ef] text-[#1f2a24]/25 line-through"
                              : time === t
                                ? "bg-[#2f4a3c] text-white"
                                : "border border-[#1f2a24]/15 hover:border-[#2f4a3c]"
                          }`}
                        >
                          {t}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <input
                    required
                    name="name"
                    placeholder="Your name"
                    autoComplete="name"
                    className="rounded-xl border border-[#1f2a24]/15 bg-[#f7f4ef] px-4 py-3 text-sm outline-none focus:border-[#2f4a3c]"
                  />
                  <input
                    required
                    name="phone"
                    type="tel"
                    placeholder="Phone number"
                    autoComplete="tel"
                    className="rounded-xl border border-[#1f2a24]/15 bg-[#f7f4ef] px-4 py-3 text-sm outline-none focus:border-[#2f4a3c]"
                  />
                </div>

                <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[#1f2a24]/10 pt-5">
                  <div className="text-sm">
                    <p className="font-semibold">{service.name}</p>
                    <p className="text-[#1f2a24]/60">
                      {rs(service.price)} · {service.time}
                      {time && days[dayIndex] ? ` · ${days[dayIndex].weekday} ${time}` : ""}
                    </p>
                  </div>
                  <button
                    type="submit"
                    disabled={!time}
                    className="rounded-full bg-[#2f4a3c] px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-[#1f3329] disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {time ? "Confirm booking" : "Pick a time"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>

      <footer className="bg-[#1f2a24] py-10 text-center text-sm text-white/50">
        <p className="sln-serif text-2xl text-white">Glow Studio</p>
        <p className="mt-2">Manahari, Makwanpur · © {new Date().getFullYear()} (demo)</p>
      </footer>
    </div>
  );
}
