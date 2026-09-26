import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import {
  ArrowRight,
  Check,
  HandHeart,
  MapPin,
  Minus,
  Plus,
  RotateCcw,
  ShoppingBag,
  Star,
  Truck,
  Wallet,
  X,
} from "lucide-react";
import { DemoBanner, demoBusiness, demoHead, validateDemoSearch } from "@/components/demo-banner";

export const Route = createFileRoute("/demos/shop")({
  validateSearch: validateDemoSearch,
  head: ({ match }) => {
    const base = demoHead(
      "/demos/shop",
      "Dhaka & Co. — Online Store Demo",
      "Sample e-commerce website by Saphin Praja: featured products, category filters, cart, and checkout with eSewa, Khalti, or cash on delivery.",
      match.search.n,
    );
    return {
      ...base,
      links: [
        ...base.links,
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&display=swap",
        },
      ],
    };
  },
  component: Shop,
});

const IMG = "/demos/shop";

type Product = {
  id: number;
  name: string;
  category: string;
  price: number;
  img: string;
  tag?: "Bestseller" | "New";
  maker: string;
};

const products: Product[] = [
  {
    id: 1,
    name: "Dhaka Topi — Classic",
    category: "Clothing",
    price: 950,
    img: "dhaka-topi",
    tag: "Bestseller",
    maker: "Palpa weavers",
  },
  {
    id: 2,
    name: "Dhaka Shawl — Maroon",
    category: "Clothing",
    price: 3200,
    img: "dhaka-shawl",
    maker: "Tehrathum co-op",
  },
  {
    id: 3,
    name: "Woollen Blanket Scarf",
    category: "Clothing",
    price: 2400,
    img: "wool-scarf",
    tag: "New",
    maker: "Jumla wool",
  },
  {
    id: 4,
    name: "Singing Bowl — Hand-hammered",
    category: "Home",
    price: 4200,
    img: "singing-bowl",
    tag: "Bestseller",
    maker: "Patan metalsmiths",
  },
  {
    id: 5,
    name: "Brass Water Pot (Karuwa)",
    category: "Home",
    price: 3600,
    img: "brass-pot",
    maker: "Patan metalsmiths",
  },
  {
    id: 6,
    name: "Clay Kulhad Cups — Set of 4",
    category: "Home",
    price: 850,
    img: "clay-cups",
    tag: "New",
    maker: "Thimi potters",
  },
  {
    id: 7,
    name: "Red Glass Chura",
    category: "Accessories",
    price: 650,
    img: "bangles",
    maker: "Kathmandu artisans",
  },
  {
    id: 8,
    name: "Handwoven Lidded Basket",
    category: "Accessories",
    price: 1800,
    img: "basket",
    maker: "Terai weavers",
  },
  {
    id: 9,
    name: "Ganesh Wall Mask",
    category: "Gifts",
    price: 1250,
    img: "ganesh-mask",
    maker: "Bhaktapur carvers",
  },
  {
    id: 10,
    name: "Wooden Kitchen Set",
    category: "Gifts",
    price: 1500,
    img: "wooden-utensils",
    maker: "Bhaktapur carvers",
  },
];

const featuredIds = [1, 4, 2, 9];
const featured = featuredIds.map((id) => products.find((p) => p.id === id)!);

const categoryTiles = [
  { name: "Clothing", img: "fabric-shelf", count: "Dhaka, wool & pashmina" },
  { name: "Home", img: "brass-antiques", count: "Brass, clay & singing bowls" },
  { name: "Accessories", img: "bangles", count: "Chura, baskets & bags" },
  { name: "Gifts", img: "souvenirs", count: "Masks, carvings & souvenirs" },
];

const categories = ["All", "Clothing", "Home", "Accessories", "Gifts"];

const reviews = [
  {
    name: "Roronoa Zoro",
    text: "Ordered a singing bowl and a dhaka topi. Got lost on the way to pick them up, so I'm glad they deliver.",
    product: "Singing Bowl",
  },
  {
    name: "Nami",
    text: "Great prices, fair to the makers, and free delivery over Rs 3,000. I checked the maths twice — it's a good deal.",
    product: "Dhaka Shawl",
  },
  {
    name: "Sanji",
    text: "The kulhad cups make my chiya taste even better. Beautiful, simple, and packed with real care.",
    product: "Clay Kulhad Cups",
  },
];

const FREE_DELIVERY = 3000;
const DELIVERY_FEE = 150;
const SLIDE_MS = 5000;

const rs = (n: number) => `Rs ${n.toLocaleString("en-IN")}`;

function Shop() {
  const biz = demoBusiness(
    Route.useSearch(),
    { name: "Dhaka & Co.", area: "Manahari, Makwanpur", address: "Main Road, Manahari, Makwanpur" },
    "#shop",
  );
  const [category, setCategory] = useState("All");
  const [cart, setCart] = useState<Record<number, number>>({});
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<"cart" | "checkout" | "done">("cart");
  const [justAdded, setJustAdded] = useState<number | null>(null);
  const [slide, setSlide] = useState(0);

  useEffect(() => {
    const t = window.setTimeout(() => setSlide((s) => (s + 1) % featured.length), SLIDE_MS);
    return () => window.clearTimeout(t);
  }, [slide]);

  useEffect(() => {
    if (justAdded === null) return;
    const t = window.setTimeout(() => setJustAdded(null), 1600);
    return () => window.clearTimeout(t);
  }, [justAdded]);

  const visible = category === "All" ? products : products.filter((p) => p.category === category);
  const lines = useMemo(
    () =>
      Object.entries(cart)
        .map(([id, qty]) => ({ product: products.find((p) => p.id === Number(id))!, qty }))
        .filter((l) => l.qty > 0),
    [cart],
  );
  const count = lines.reduce((n, l) => n + l.qty, 0);
  const subtotal = lines.reduce((n, l) => n + l.qty * l.product.price, 0);
  const delivery = subtotal === 0 || subtotal >= FREE_DELIVERY ? 0 : DELIVERY_FEE;
  const toFree = Math.max(0, FREE_DELIVERY - subtotal);

  function change(id: number, delta: number) {
    setCart((c) => ({ ...c, [id]: Math.max(0, (c[id] ?? 0) + delta) }));
  }

  function add(id: number) {
    if (step === "done") setStep("cart");
    change(id, 1);
    setJustAdded(id);
  }

  function pickCategory(c: string) {
    setCategory(c);
    document.getElementById("shop")?.scrollIntoView({ behavior: "smooth" });
  }

  function placeOrder(e: FormEvent) {
    e.preventDefault();
    setStep("done");
    setCart({});
  }

  const hero = featured[slide];

  return (
    <div className="shp min-h-screen bg-[#faf6f1] font-sans text-neutral-900">
      <style>{`
        .shp h1, .shp h2, .shp h3, .shp-serif { font-family: "Fraunces", Georgia, serif; letter-spacing: -0.015em; }
        @keyframes shp-rise { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: none; } }
        .shp-rise { animation: shp-rise 0.7s cubic-bezier(.2,.7,.2,1) both; }
        @keyframes shp-in { from { transform: translateX(100%); } to { transform: none; } }
        .shp-drawer { animation: shp-in 0.35s cubic-bezier(.2,.7,.2,1); }
        @media (prefers-reduced-motion: reduce) { .shp-rise, .shp-drawer { animation: none !important; } }
      `}</style>

      <DemoBanner forName={biz.personalised ? biz.name : undefined} />

      <div className="bg-rose-900 py-2 text-center text-xs font-medium text-rose-50">
        Free delivery all over Nepal on orders above {rs(FREE_DELIVERY)} · Cash on delivery
        available
      </div>

      <header className="sticky top-0 z-40 border-b border-neutral-200/70 bg-[#faf6f1]/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <span className="shp-serif text-2xl font-bold tracking-tight">
            {biz.personalised ? (
              biz.name
            ) : (
              <>
                Dhaka<span className="text-rose-700">&</span>Co.
              </>
            )}
          </span>
          <nav className="hidden gap-8 text-sm text-neutral-600 md:flex">
            <a href="#categories" className="hover:text-neutral-900">
              Categories
            </a>
            <a href="#shop" className="hover:text-neutral-900">
              Shop
            </a>
            <a href="#story" className="hover:text-neutral-900">
              Our makers
            </a>
            <a href="#reviews" className="hover:text-neutral-900">
              Reviews
            </a>
          </nav>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="relative inline-flex items-center gap-2 rounded-full bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-rose-800"
          >
            <ShoppingBag className="h-4 w-4" />
            Cart
            {count > 0 && (
              <span className="grid h-5 min-w-5 place-items-center rounded-full bg-amber-400 px-1 text-xs font-bold text-neutral-900">
                {count}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Hero with rotating featured products */}
      <section className="mx-auto grid max-w-6xl items-center gap-10 px-6 py-14 md:grid-cols-[1fr_1.1fr] md:py-20">
        <div>
          <p className="shp-rise text-sm font-medium uppercase tracking-[0.25em] text-rose-700">
            Handmade in Nepal
          </p>
          <h1
            className="shp-rise mt-4 text-5xl font-bold leading-[1.05] md:text-6xl"
            style={{ animationDelay: "100ms" }}
          >
            Dhaka, brass & crafts — <em className="text-rose-700">straight from the makers.</em>
          </h1>
          <p
            className="shp-rise mt-6 max-w-md text-lg text-neutral-600"
            style={{ animationDelay: "200ms" }}
          >
            Every piece is made by artisan families across Nepal. You pay a fair price, they get a
            fair share.
          </p>
          <div className="shp-rise mt-8 flex flex-wrap gap-3" style={{ animationDelay: "300ms" }}>
            <a
              href="#shop"
              className="group inline-flex items-center gap-2 rounded-full bg-rose-700 px-7 py-3.5 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5 hover:bg-rose-800"
            >
              Shop now
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </a>
            <a
              href="#story"
              className="inline-flex items-center rounded-full border border-neutral-300 px-7 py-3.5 text-sm font-semibold transition-colors hover:border-neutral-900"
            >
              Meet the makers
            </a>
          </div>
          <div className="mt-10 flex items-center gap-3 text-sm text-neutral-600">
            <div className="flex">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
              ))}
            </div>
            4.9 from 1,200+ happy customers
          </div>
        </div>

        <div className="relative">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-neutral-200 shadow-2xl sm:aspect-[5/5]">
            {featured.map((p, i) => (
              <img
                key={p.id}
                src={`${IMG}/${p.img}.webp`}
                alt={p.name}
                loading={i === 0 ? "eager" : "lazy"}
                className={`absolute inset-0 h-full w-full object-cover transition-all duration-[1100ms] ease-out ${
                  i === slide ? "scale-100 opacity-100" : "scale-105 opacity-0"
                }`}
              />
            ))}
            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/60 to-transparent" />
            <div
              key={hero.id}
              className="shp-rise absolute inset-x-5 bottom-5 flex items-end justify-between gap-4 rounded-2xl bg-white/95 p-4 shadow-lg backdrop-blur"
            >
              <div className="min-w-0">
                <p className="text-xs font-medium uppercase tracking-wider text-rose-700">
                  Featured · {hero.maker}
                </p>
                <p className="shp-serif mt-1 truncate text-lg font-semibold">{hero.name}</p>
                <p className="text-sm font-semibold text-neutral-700">{rs(hero.price)}</p>
              </div>
              <button
                type="button"
                onClick={() => add(hero.id)}
                className="shrink-0 rounded-full bg-neutral-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-rose-800"
              >
                {justAdded === hero.id ? "Added ✓" : "Add to cart"}
              </button>
            </div>
          </div>
          <div className="mt-4 flex justify-center gap-2">
            {featured.map((p, i) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setSlide(i)}
                aria-label={`Show ${p.name}`}
                className={`h-14 w-14 overflow-hidden rounded-xl border-2 transition-all ${
                  i === slide
                    ? "border-rose-700 opacity-100"
                    : "border-transparent opacity-60 hover:opacity-100"
                }`}
              >
                <img
                  src={`${IMG}/${p.img}-sm.webp`}
                  alt=""
                  className="h-full w-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Trust strip */}
      <section className="border-y border-neutral-200 bg-white">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-6 py-8 md:grid-cols-4">
          {[
            { icon: HandHeart, title: "100% handmade", sub: "By 40+ artisan families" },
            {
              icon: Truck,
              title: "Delivery all over Nepal",
              sub: `Free above ${rs(FREE_DELIVERY)}`,
            },
            { icon: Wallet, title: "eSewa, Khalti or COD", sub: "Pay the way you like" },
            { icon: RotateCcw, title: "7-day returns", sub: "No questions asked" },
          ].map(({ icon: Icon, title, sub }) => (
            <div key={title} className="flex items-center gap-3">
              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-rose-50 text-rose-700">
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold">{title}</p>
                <p className="text-xs text-neutral-500">{sub}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section id="categories" className="mx-auto max-w-6xl px-6 py-20">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.25em] text-rose-700">Browse</p>
            <h2 className="mt-2 text-4xl font-bold">Shop by category</h2>
          </div>
        </div>
        <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4">
          {categoryTiles.map((c) => (
            <button
              key={c.name}
              type="button"
              onClick={() => pickCategory(c.name)}
              className="group relative aspect-[3/4] overflow-hidden rounded-3xl text-left"
            >
              <img
                src={`${IMG}/${c.img}-sm.webp`}
                alt=""
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
              <div className="absolute inset-x-5 bottom-5 text-white">
                <p className="shp-serif text-2xl font-semibold">{c.name}</p>
                <p className="mt-1 text-xs text-white/80">{c.count}</p>
                <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium opacity-0 transition-opacity group-hover:opacity-100">
                  Shop now <ArrowRight className="h-4 w-4" />
                </span>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Products */}
      <section id="shop" className="scroll-mt-20 bg-white py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.25em] text-rose-700">
                The collection
              </p>
              <h2 className="mt-2 text-4xl font-bold">
                {category === "All" ? "All products" : category}
              </h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCategory(c)}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                    category === c
                      ? "bg-neutral-900 text-white"
                      : "bg-neutral-100 text-neutral-700 hover:bg-rose-50"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div
            key={category}
            className="shp-rise mt-10 grid grid-cols-2 gap-x-5 gap-y-10 lg:grid-cols-4"
          >
            {visible.map((p) => (
              <article key={p.id} className="group flex flex-col">
                <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-neutral-100">
                  <img
                    src={`${IMG}/${p.img}-sm.webp`}
                    alt={p.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  {p.tag && (
                    <span
                      className={`absolute left-3 top-3 rounded-full px-3 py-1 text-xs font-semibold ${
                        p.tag === "New"
                          ? "bg-emerald-600 text-white"
                          : "bg-amber-400 text-neutral-900"
                      }`}
                    >
                      {p.tag}
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => add(p.id)}
                    className="absolute inset-x-3 bottom-3 rounded-full bg-white/95 py-2.5 text-sm font-semibold shadow-lg transition-all hover:bg-neutral-900 hover:text-white md:translate-y-3 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100"
                  >
                    {justAdded === p.id ? (
                      <span className="inline-flex items-center gap-1">
                        <Check className="h-4 w-4" /> Added
                      </span>
                    ) : (
                      "Add to cart"
                    )}
                  </button>
                </div>
                <p className="mt-4 text-xs uppercase tracking-wider text-neutral-500">{p.maker}</p>
                <h3 className="mt-1 text-base font-semibold leading-snug">{p.name}</h3>
                <p className="mt-1 font-semibold text-rose-700">{rs(p.price)}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Story */}
      <section id="story" className="bg-rose-950 text-rose-50">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-24 md:grid-cols-2">
          <div className="grid grid-cols-2 gap-4">
            <img
              src={`${IMG}/doko-sm.webp`}
              alt="Bamboo doko baskets"
              loading="lazy"
              className="aspect-[3/4] w-full rounded-3xl object-cover"
            />
            <img
              src={`${IMG}/wooden-utensils-sm.webp`}
              alt="Hand-carved wooden utensils"
              loading="lazy"
              className="mt-12 aspect-[3/4] w-full rounded-3xl object-cover"
            />
          </div>
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.25em] text-amber-300">
              Our makers
            </p>
            <h2 className="mt-3 text-4xl font-bold md:text-5xl">Real people, real craft.</h2>
            <p className="mt-6 text-lg leading-relaxed text-rose-100/80">
              We work directly with weavers in Palpa, metalsmiths in Patan, and potters in Thimi. No
              middlemen — so every purchase keeps a centuries-old skill alive, and puts money in the
              hands of the family who made it.
            </p>
            <div className="mt-10 grid grid-cols-3 gap-6 border-t border-white/10 pt-8">
              {[
                ["40+", "Artisan families"],
                ["12", "Districts"],
                ["8,000+", "Orders delivered"],
              ].map(([n, l]) => (
                <div key={l}>
                  <p className="shp-serif text-3xl font-bold text-amber-300">{n}</p>
                  <p className="mt-1 text-sm text-rose-100/70">{l}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section id="reviews" className="mx-auto max-w-6xl px-6 py-24">
        <div className="text-center">
          <p className="text-sm font-medium uppercase tracking-[0.25em] text-rose-700">Reviews</p>
          <h2 className="mt-2 text-4xl font-bold">Loved by our customers</h2>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {reviews.map((r) => (
            <figure key={r.name} className="rounded-3xl border border-neutral-200 bg-white p-8">
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <blockquote className="mt-4 text-neutral-700">“{r.text}”</blockquote>
              <figcaption className="mt-6 flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-full bg-rose-700 font-semibold text-white">
                  {r.name[0]}
                </span>
                <span>
                  <span className="block font-semibold">{r.name}</span>
                  <span className="text-xs text-neutral-500">Verified buyer · {r.product}</span>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      <footer className="bg-neutral-950 text-neutral-400">
        <div className="mx-auto grid max-w-6xl gap-8 px-6 py-14 md:grid-cols-3">
          <div>
            <p className="shp-serif text-2xl font-bold text-white">
              {biz.personalised ? (
                biz.name
              ) : (
                <>
                  Dhaka<span className="text-rose-500">&</span>Co.
                </>
              )}
            </p>
            <p className="mt-3 text-sm">Handmade goods from artisan families across Nepal.</p>
          </div>
          <div className="text-sm">
            <p className="font-semibold text-white">Visit our store</p>
            <p className="mt-3 flex items-center gap-2">
              <MapPin className="h-4 w-4" /> {biz.address}
            </p>
            <p className="mt-1">Sun – Fri, 10:00 AM – 7:00 PM</p>
          </div>
          <div className="text-sm">
            <p className="font-semibold text-white">We accept</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {["eSewa", "Khalti", "Cash on delivery", "Bank transfer"].map((m) => (
                <span
                  key={m}
                  className="rounded-md border border-white/15 px-2.5 py-1 text-xs text-neutral-200"
                >
                  {m}
                </span>
              ))}
            </div>
          </div>
        </div>
        <p className="border-t border-white/10 py-6 text-center text-xs">
          © {new Date().getFullYear()} {biz.name} (demo)
        </p>
      </footer>

      {/* Cart drawer */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          <aside
            className="shp-drawer flex h-full w-full max-w-md flex-col bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
            aria-label="Shopping cart"
          >
            <div className="flex items-center justify-between border-b border-neutral-200 p-6">
              <h2 className="text-2xl font-bold">
                {step === "checkout" ? "Checkout" : step === "done" ? "Order placed" : "Your cart"}
              </h2>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close cart"
                className="rounded-full p-1 hover:bg-neutral-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {step === "done" ? (
              <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
                <div className="grid h-16 w-16 place-items-center rounded-full bg-emerald-100 text-emerald-700">
                  <Check className="h-8 w-8" />
                </div>
                <h3 className="mt-6 text-2xl font-bold">Thank you!</h3>
                <p className="mt-2 text-neutral-600">
                  On a real store, the shop would now get your order on WhatsApp or by email and
                  call you to confirm delivery.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setStep("cart");
                    setOpen(false);
                  }}
                  className="mt-8 rounded-full bg-neutral-900 px-6 py-3 text-sm font-medium text-white"
                >
                  Continue shopping
                </button>
              </div>
            ) : lines.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center p-8 text-center text-neutral-500">
                <ShoppingBag className="h-10 w-10 text-neutral-300" />
                <p className="mt-4">Your cart is empty.</p>
              </div>
            ) : step === "checkout" ? (
              <form onSubmit={placeOrder} className="flex flex-1 flex-col overflow-y-auto">
                <div className="flex-1 space-y-4 p-6">
                  {[
                    { id: "co-name", label: "Full name", type: "text", auto: "name" },
                    { id: "co-phone", label: "Phone number", type: "tel", auto: "tel" },
                    {
                      id: "co-address",
                      label: "Delivery address",
                      type: "text",
                      auto: "street-address",
                    },
                  ].map((f) => (
                    <div key={f.id}>
                      <label htmlFor={f.id} className="mb-1.5 block text-sm font-medium">
                        {f.label}
                      </label>
                      <input
                        required
                        id={f.id}
                        type={f.type}
                        autoComplete={f.auto}
                        className="w-full rounded-xl border border-neutral-300 px-4 py-2.5 text-sm outline-none focus:border-rose-700 focus:ring-2 focus:ring-rose-700/15"
                      />
                    </div>
                  ))}
                  <fieldset>
                    <legend className="mb-2 text-sm font-medium">Payment</legend>
                    <div className="grid grid-cols-3 gap-2">
                      {["eSewa", "Khalti", "Cash on delivery"].map((m, i) => (
                        <label
                          key={m}
                          className="flex cursor-pointer items-center justify-center rounded-xl border border-neutral-300 px-2 py-3 text-center text-xs font-medium has-[:checked]:border-rose-700 has-[:checked]:bg-rose-50 has-[:checked]:text-rose-800"
                        >
                          <input
                            type="radio"
                            name="pay"
                            value={m}
                            defaultChecked={i === 2}
                            className="sr-only"
                          />
                          {m}
                        </label>
                      ))}
                    </div>
                  </fieldset>
                </div>
                <div className="space-y-3 border-t border-neutral-200 p-6">
                  <div className="flex justify-between text-base font-bold">
                    <span>Total</span>
                    <span>{rs(subtotal + delivery)}</span>
                  </div>
                  <button
                    type="submit"
                    className="w-full rounded-full bg-rose-700 py-3.5 font-semibold text-white hover:bg-rose-800"
                  >
                    Place order
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep("cart")}
                    className="w-full text-sm text-neutral-500 hover:text-neutral-900"
                  >
                    ← Back to cart
                  </button>
                </div>
              </form>
            ) : (
              <>
                <div className="border-b border-neutral-100 px-6 py-4">
                  <p className="text-sm text-neutral-600">
                    {toFree > 0 ? (
                      <>
                        Add <span className="font-semibold text-neutral-900">{rs(toFree)}</span>{" "}
                        more for free delivery
                      </>
                    ) : (
                      <span className="font-medium text-emerald-700">
                        🎉 You've unlocked free delivery
                      </span>
                    )}
                  </p>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-neutral-100">
                    <div
                      className="h-full rounded-full bg-rose-700 transition-all duration-500"
                      style={{ width: `${Math.min(100, (subtotal / FREE_DELIVERY) * 100)}%` }}
                    />
                  </div>
                </div>
                <ul className="flex-1 divide-y divide-neutral-100 overflow-y-auto px-6">
                  {lines.map(({ product, qty }) => (
                    <li key={product.id} className="flex items-center gap-4 py-4">
                      <img
                        src={`${IMG}/${product.img}-sm.webp`}
                        alt=""
                        className="h-20 w-16 shrink-0 rounded-xl object-cover"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold">{product.name}</p>
                        <p className="text-sm text-neutral-500">{rs(product.price)}</p>
                      </div>
                      <div className="flex items-center gap-2 rounded-full border border-neutral-200 px-1.5 py-1">
                        <button
                          type="button"
                          onClick={() => change(product.id, -1)}
                          aria-label="Remove one"
                          className="rounded-full p-1 hover:bg-neutral-100"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="w-5 text-center text-sm">{qty}</span>
                        <button
                          type="button"
                          onClick={() => change(product.id, 1)}
                          aria-label="Add one"
                          className="rounded-full p-1 hover:bg-neutral-100"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
                <div className="space-y-2 border-t border-neutral-200 p-6 text-sm">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>{rs(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery</span>
                    <span>{delivery === 0 ? "Free" : rs(delivery)}</span>
                  </div>
                  <div className="flex justify-between pt-2 text-base font-bold">
                    <span>Total</span>
                    <span>{rs(subtotal + delivery)}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setStep("checkout")}
                    className="mt-4 w-full rounded-full bg-rose-700 py-3.5 font-semibold text-white hover:bg-rose-800"
                  >
                    Checkout
                  </button>
                </div>
              </>
            )}
          </aside>
        </div>
      )}

      {/* Mobile cart shortcut */}
      {count > 0 && !open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="shp-rise fixed inset-x-4 bottom-4 z-40 flex items-center justify-between rounded-full bg-neutral-900 px-6 py-4 text-sm font-semibold text-white shadow-2xl md:hidden"
        >
          <span className="inline-flex items-center gap-2">
            <ShoppingBag className="h-4 w-4" /> View cart ({count})
          </span>
          <span>{rs(subtotal)}</span>
        </button>
      )}
    </div>
  );
}
