import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Briefcase,
  Database,
  Download,
  Github,
  Globe,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Send,
  Sparkles,
} from "lucide-react";
import { useReveal } from "@/hooks/use-reveal";
import { ThemeToggle } from "@/components/theme-toggle";
import { PortfolioChat } from "@/components/portfolio-chat";
import { ProjectVisual, type VisualKind } from "@/components/project-visual";

export const Route = createFileRoute("/")({
  component: Portfolio,
  head: () => ({
    links: [{ rel: "canonical", href: "https://saphinpraja.com.np/" }],
    meta: [{ property: "og:url", content: "https://saphinpraja.com.np/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Person",
          name: "Saphin Praja",
          jobTitle: "Data Analyst",
          url: "https://saphinpraja.com.np/",
          image: "https://saphinpraja.com.np/og-image.png",
          email: "mailto:prajasaphin18@gmail.com",
          description:
            "Junior data analyst in Nepal with fintech experience at Xuno, building automation, dashboards, and monitoring tools with SQL, Python, and Power BI.",
          address: {
            "@type": "PostalAddress",
            addressLocality: "Kathmandu",
            addressCountry: "Nepal",
          },
          mainEntityOfPage: "https://saphinpraja.com.np/",
          worksFor: {
            "@type": "Organization",
            name: "Xuno",
          },
          knowsAbout: ["SQL", "Python", "Power BI", "Excel", "Data Analysis", "Fintech"],
          sameAs: [
            "https://www.linkedin.com/in/saphinpraja/",
            "https://github.com/Saphin18",
            "https://www.instagram.com/twilightsaphin/",
          ],
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "Saphin Praja Portfolio",
          url: "https://saphinpraja.com.np/",
          description:
            "Saphin Praja is a junior data analyst with fintech experience at Xuno, building automation, dashboards, and monitoring tools with SQL, Python, and Power BI.",
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "CreativeWork",
          name: "FX Insights Automation",
          creator: { "@type": "Person", name: "Saphin Praja" },
          about: "Automated FX rate and market index reporting pipeline",
          keywords: "Python, Google Drive API, Slack API, automation, fintech",
          url: "https://github.com/Saphin18/fx-market-insights",
          description:
            "Python script that runs daily at 3 PM, pulling FX rates, commodity prices, and market index data. Saves structured JSON to Google Drive and posts a formatted summary to Slack automatically.",
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "CreativeWork",
          name: "Reddit Competitor & Remittance Monitor",
          creator: { "@type": "Person", name: "Saphin Praja" },
          about: "Automated Reddit monitoring for competitor and remittance discussion",
          keywords: "Python, Slack API, monitoring, NLP, fintech",
          url: "https://github.com/Saphin18/reddit-brand-monitor",
          description:
            "Monitoring script that scans Reddit every 15 minutes for remittance and competitor-related discussion using keyword and semantic matching, then auto-alerts a Slack channel.",
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "CreativeWork",
          name: "Saphin AI",
          creator: { "@type": "Person", name: "Saphin Praja" },
          about: "Privacy-first AI companion app for Android",
          keywords: "Expo, React Native, TypeScript, FastAPI, Supabase, Groq",
          url: "https://github.com/Saphin18/ai-companion",
          description:
            'A warm, privacy-first AI companion app for Android that you can talk to like a friend — it listens, supports, and motivates you. Built as a genuine, non-manipulative companion with no streaks, no guilt-tripping, and no "you haven\'t opened me in 3 days" notifications.',
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "CreativeWork",
          name: "Daily Reporting Automation",
          creator: { "@type": "Person", name: "Saphin Praja" },
          about: "End-to-end BI pipeline for daily sales reporting",
          keywords: "Python, Mixpanel API, Google Sheets API, Slack API, Matplotlib",
          url: "https://github.com/Saphin18/daily-reporting-automation",
          description:
            "End-to-end BI pipeline that pulls Mixpanel analytics, generates 8 dark-themed dashboards from sales data, writes to Google Sheets via API, and posts a consolidated daily report with images to Slack — replacing 45 minutes of manual work.",
        }),
      },
    ],
  }),
});

const nav = [
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "skills", label: "Toolkit" },
  { id: "contact", label: "Contact" },
];

const RESUME = "/Saphin_Praja_Resume.pdf";

const projects: {
  title: string;
  desc: string;
  impact: string;
  tags: string[];
  url: string;
  visual: VisualKind;
}[] = [
  {
    title: "Daily Reporting Automation",
    desc: "End-to-end BI pipeline: pulls Mixpanel analytics, generates 8 dark-themed dashboards, writes to Google Sheets, and posts one consolidated daily report with images to Slack.",
    impact: "Replaced 45 min of manual work daily",
    tags: ["Python", "Mixpanel API", "Google Sheets API", "Slack API", "Matplotlib"],
    url: "https://github.com/Saphin18/daily-reporting-automation",
    visual: "bars",
  },
  {
    title: "FX Insights Automation",
    desc: "Runs every day at 3 PM, pulling FX rates, commodity prices, and market indices. Saves structured JSON to Google Drive and posts a formatted summary to Slack.",
    impact: "Runs daily, zero manual steps",
    tags: ["Python", "Google Drive API", "Slack API"],
    url: "https://github.com/Saphin18/fx-market-insights",
    visual: "line",
  },
  {
    title: "Reddit Competitor & Remittance Monitor",
    desc: "Scans Reddit every 15 minutes for remittance and competitor discussion using keyword and semantic matching, then alerts a Slack channel automatically.",
    impact: "Alerts the team in Slack within minutes",
    tags: ["Python", "NLP", "Slack API"],
    url: "https://github.com/Saphin18/reddit-brand-monitor",
    visual: "alerts",
  },
  {
    title: "Saphin AI",
    desc: 'A warm, privacy-first AI companion for Android you can talk to like a friend — it listens, supports, and motivates you. No streaks, no guilt-tripping, no "you haven\'t opened me in 3 days" notifications.',
    impact: "A kind, supportive friend — always there to listen",
    tags: ["Expo", "React Native", "TypeScript", "FastAPI", "Supabase", "Groq"],
    url: "https://github.com/Saphin18/ai-companion",
    visual: "chat",
  },
];

const experience = [
  {
    title: "Xuno · Data Analyst",
    duration: "Feb 2026 – Present",
    bullets: [
      "Moved from a marketing-focused internship into a full data analyst role after picking up SQL and Python.",
      "Built business analytics dashboards in Metabase, used by the team to track daily and weekly performance.",
      "Write Python scripts and Jupyter notebooks to clean and analyze data, turning raw numbers into insights.",
      "Query and report on data from Mixpanel, CleverTap, Meta Business Suite, and internal company sources.",
      "Perform RFM segmentation and build customer profiles for each segment.",
    ],
  },
  {
    title: "Xuno · Digital Marketing & Data Analysis Intern",
    duration: "Oct 2025 – Jan 2026",
    bullets: [
      "Started out reporting on marketing performance — Mixpanel, CleverTap, Meta Business Suite.",
      "Ran competitor and influencer research to track market activity and positioning.",
      "Got curious about the data behind the marketing numbers, which led to learning SQL and Python and eventually moving into the data analyst role above.",
    ],
  },
];

const toolkit = [
  "SQL",
  "Python",
  "Power BI",
  "Excel",
  "Jupyter",
  "Metabase",
  "Mixpanel",
  "CleverTap",
  "Slack API",
  "Google Drive API",
  "Google Sheets API",
  "Matplotlib",
];
const domain = [
  "Fintech analytics",
  "RFM segmentation",
  "Customer profiling",
  "Automated reporting",
];

const demos = [
  { to: "/demos/restaurant" as const, name: "Restaurant", img: "/demos/previews/restaurant.webp" },
  { to: "/demos/shop" as const, name: "Online shop", img: "/demos/previews/shop.webp" },
  { to: "/demos/salon" as const, name: "Salon booking", img: "/demos/previews/salon.webp" },
];

// Shared class strings so light (clean) and dark (data) themes stay in sync.
const eyebrow = "text-sm font-semibold uppercase tracking-widest text-teal-600 dark:text-teal-300";
const btnPrimary =
  "group inline-flex items-center gap-2 rounded-lg bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-teal-700 dark:bg-teal-300 dark:text-slate-950 dark:hover:bg-teal-200";
const btnGhost =
  "inline-flex items-center gap-2 rounded-lg border border-border bg-card px-6 py-3 text-sm font-semibold transition-colors hover:border-foreground dark:bg-transparent dark:hover:border-teal-300/60 dark:hover:bg-white/5";
const card =
  "rounded-3xl border border-border bg-card shadow-card dark:bg-gradient-to-b dark:from-white/[0.04] dark:to-transparent dark:shadow-none";

function trackResume() {
  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    window.gtag("event", "download_resume", { event_category: "engagement" });
  }
}

function Portfolio() {
  useReveal();
  const [active, setActive] = useState("about");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [formOpen, setFormOpen] = useState(false);

  useEffect(() => {
    const sections = nav.map((n) => document.getElementById(n.id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-40% 0px -55% 0px" },
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    // Honeypot check: if website is filled, silently discard spam
    const website = String(formData.get("website") ?? "");
    if (website) {
      setStatus("sent");
      form.reset();
      setTimeout(() => setStatus("idle"), 4000);
      return;
    }

    const payload = {
      name: String(formData.get("name") ?? ""),
      email: String(formData.get("email") ?? ""),
      message: String(formData.get("message") ?? ""),
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
        window.gtag("event", "contact_form_submit", { event_category: "engagement" });
      }
      setStatus("sent");
      form.reset();
      setTimeout(() => setStatus("idle"), 4000);
    } catch (error) {
      setStatus("error");
      setErrorMessage(error instanceof Error ? error.message : "Unable to send your message.");
      setTimeout(() => setStatus("idle"), 5000);
    }
  }

  const inputCls =
    "w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm outline-none transition-colors focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20";

  return (
    <div className="min-h-screen bg-[#f8fafc] text-foreground dark:bg-[#070b12]">
      <style>{`
        .dark .pf-grid { background-image: linear-gradient(rgba(94,234,212,.06) 1px, transparent 1px), linear-gradient(90deg, rgba(94,234,212,.06) 1px, transparent 1px); background-size: 48px 48px; }
      `}</style>

      <header className="sticky top-0 z-50 border-b border-border/60 bg-white/80 backdrop-blur-md dark:bg-[#070b12]/80">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <a href="#top" className="font-display text-lg font-bold tracking-tight">
            Saphin<span className="text-teal-600 dark:text-teal-300">.</span>
          </a>
          <nav className="hidden items-center gap-1 md:flex">
            {nav.map((n) => (
              <a
                key={n.id}
                href={`#${n.id}`}
                className={`rounded-md px-3 py-2 text-sm transition-colors hover:text-foreground ${
                  active === n.id ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                {n.label}
              </a>
            ))}
            <Link
              to="/services"
              className="rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Services
            </Link>
          </nav>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <a
              href="#contact"
              onClick={() => setFormOpen(true)}
              className="hidden rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-teal-700 md:inline-flex dark:bg-teal-300 dark:text-slate-950 dark:hover:bg-teal-200"
            >
              Hire me
            </a>
          </div>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section id="top" className="pf-grid relative overflow-hidden">
          <div className="pointer-events-none absolute -right-20 -top-20 h-[520px] w-[520px] rounded-full bg-teal-100/70 blur-3xl dark:hidden" />
          <div className="pointer-events-none absolute left-1/2 top-0 hidden h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-teal-500/10 blur-3xl dark:block" />
          <div className="relative mx-auto grid max-w-6xl items-center gap-14 px-6 py-16 md:grid-cols-[1.15fr_1fr] md:py-24">
            <div>
              <p className="hidden font-mono text-sm text-teal-300 dark:block">
                &gt; SELECT * FROM saphin WHERE role = 'data_analyst';
              </p>
              <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 dark:mt-5 dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-300">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500 dark:bg-emerald-400" />
                Open to freelance projects · Websites & apps
              </span>
              <h1 className="mt-6">
                {/* Name + role live inside the h1 so search engines still see them */}
                <span className="block text-sm font-semibold uppercase tracking-[0.2em] text-teal-600 dark:text-teal-300">
                  Saphin Praja · Data Analyst · Kathmandu
                </span>
                <span className="mt-4 block text-5xl font-bold leading-[1.05] tracking-tight md:text-6xl">
                  I find the{" "}
                  <em className="bg-gradient-to-r from-teal-600 to-teal-500 bg-clip-text text-transparent dark:from-teal-300 dark:via-cyan-300 dark:to-sky-400 pr-1">
                    story
                  </em>{" "}
                  in your numbers.
                </span>
              </h1>
              <p className="mt-6 max-w-lg text-lg text-muted-foreground">
                SQL, Python, and Power BI at Xuno — dashboards, visualisations, and automations that
                save hours. Plus beautiful websites and apps for Nepali businesses.
              </p>
              <div className="mt-9 flex flex-wrap gap-3">
                <a href="#projects" className={btnPrimary}>
                  See my work
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </a>
                <a
                  href={RESUME}
                  download="Saphin_Praja_Resume.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={trackResume}
                  className={btnGhost}
                >
                  <Download className="h-4 w-4" /> Resume
                </a>
              </div>
              <div className="mt-8 flex flex-wrap items-center gap-5 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4" /> Kathmandu, Nepal
                </span>
                <a
                  href="https://www.linkedin.com/in/saphinpraja/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-foreground"
                >
                  LinkedIn
                </a>
                <a
                  href="https://github.com/Saphin18"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-foreground"
                >
                  GitHub
                </a>
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-sm">
              <div className="absolute -inset-3 rotate-3 rounded-[2rem] bg-gradient-to-br from-teal-400 to-sky-500 opacity-80 dark:opacity-60 dark:shadow-[0_0_80px_-10px_rgba(94,234,212,0.6)]" />
              <img
                src="/images/saphin-portrait.webp"
                alt="Saphin Praja, data analyst in Kathmandu"
                width={553}
                height={691}
                className="relative aspect-[4/5] w-full rounded-[2rem] object-cover shadow-2xl"
              />
              <div className="absolute -left-6 top-10 rounded-2xl border border-border bg-card p-4 shadow-xl sm:-left-10 dark:bg-[#0f1623]/95 dark:backdrop-blur">
                <p className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Briefcase className="h-3.5 w-3.5 text-teal-600 dark:text-teal-300" /> Currently
                </p>
                <p className="mt-0.5 text-sm font-semibold">Data Analyst @ Xuno</p>
              </div>
            </div>
          </div>
        </section>

        {/* About */}
        <section id="about" className="border-y border-border/60 bg-white dark:bg-transparent">
          <div className="mx-auto grid max-w-6xl gap-12 px-6 py-24 md:grid-cols-[1fr_1.5fr]">
            <div className="reveal">
              <p className={eyebrow}>About</p>
              <h2 className="mt-2 text-4xl font-bold tracking-tight">
                A year in fintech, a lot of queries later.
              </h2>
            </div>
            <div className="reveal space-y-6 text-lg leading-relaxed text-muted-foreground">
              <p>
                I'm a data analyst based in Kathmandu, Nepal, with a year of hands-on work in
                fintech. Day to day I pull data out of SQL, clean it in Python, and turn it into
                dashboards people actually open.
              </p>
              <p>
                Most of my work is extracting and analysing data, building automations, and turning
                the results into dashboards and visualisations — reporting that runs on a schedule
                so no one has to ask for it twice.
              </p>
            </div>
          </div>
        </section>

        {/* Experience */}
        <section id="experience" className="mx-auto max-w-6xl px-6 py-24">
          <div className="reveal mb-12">
            <p className={eyebrow}>Experience</p>
            <h2 className="mt-2 text-4xl font-bold tracking-tight">Where I've worked</h2>
          </div>
          <div className="reveal relative space-y-8 pl-8 md:pl-12">
            <div className="absolute left-2 top-2 h-full w-px bg-border md:left-4" />
            {experience.map((job) => (
              <div key={job.title + job.duration} className="relative">
                <div className="absolute -left-[29px] top-9 h-3 w-3 rounded-full bg-teal-500 ring-4 ring-[#f8fafc] md:-left-[37px] dark:bg-teal-300 dark:ring-[#070b12]" />
                <div className={`${card} p-8`}>
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h3 className="text-xl font-bold">{job.title}</h3>
                    <span className="text-sm text-muted-foreground">{job.duration}</span>
                  </div>
                  <ul className="mt-6 space-y-3 text-muted-foreground">
                    {job.bullets.map((b) => (
                      <li key={b} className="flex gap-3">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-teal-500 dark:bg-teal-300" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Projects */}
        <section id="projects" className="border-y border-border/60 bg-white dark:bg-transparent">
          <div className="mx-auto max-w-6xl px-6 py-24">
            <div className="reveal mb-12">
              <p className={eyebrow}>Selected work</p>
              <h2 className="mt-2 text-4xl font-bold tracking-tight">Projects with real impact</h2>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              {projects.map((p) => (
                <a
                  key={p.title}
                  href={p.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`View ${p.title} project on GitHub`}
                  className={`reveal group flex flex-col p-6 transition-all hover:-translate-y-1 hover:border-teal-300 hover:shadow-xl rounded-3xl border border-border bg-[#f8fafc] dark:bg-gradient-to-b dark:from-white/[0.04] dark:to-transparent dark:bg-transparent dark:hover:border-teal-300/40`}
                >
                  <div className="rounded-2xl border border-border/60 bg-white p-4 text-teal-600 shadow-sm dark:border-white/5 dark:bg-[#0f1623] dark:text-teal-300">
                    <ProjectVisual kind={p.visual} />
                  </div>
                  <h3 className="mt-6 flex items-start justify-between gap-3 text-lg font-bold">
                    {p.title}
                    <ArrowUpRight className="h-5 w-5 shrink-0 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </h3>
                  <p className="mt-2 flex-1 text-sm text-muted-foreground">{p.desc}</p>
                  <p className="mt-4 flex items-center gap-1.5 text-sm font-semibold text-teal-700 dark:text-teal-300">
                    <Sparkles className="h-4 w-4" /> {p.impact}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {p.tags.map((t) => (
                      <span
                        key={t}
                        className="rounded-md border border-border bg-white px-2 py-1 font-mono text-[11px] text-muted-foreground dark:border-transparent dark:bg-white/5 dark:text-slate-300"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </a>
              ))}
            </div>

            <div className="reveal mt-10 grid gap-6 md:grid-cols-2">
              {[
                {
                  to: "/guides/saphin-ai" as const,
                  title: "Building Saphin AI: an AI companion app",
                  desc: "The architecture behind Saphin AI — a swappable AI provider layer, JWT/JWKS auth, two-tier memory, and a hybrid approach to proactive notifications.",
                },
                {
                  to: "/guides/fx-insight" as const,
                  title: "Building FX-Insight: daily FX market data automation",
                  desc: "A technical walkthrough of the script behind FX Insights Automation — TradingView websockets, FII/DII scraping, and Excel, Slack, and Drive delivery.",
                },
              ].map((g) => (
                <Link key={g.to} to={g.to} className={`group p-7 ${card}`}>
                  <p className={eyebrow}>Guide</p>
                  <h3 className="mt-2 text-xl font-bold">{g.title}</h3>
                  <p className="mt-2 text-muted-foreground">{g.desc}</p>
                  <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-teal-700 dark:text-teal-300">
                    Read the guide
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Toolkit + websites */}
        <section id="skills" className="mx-auto grid max-w-6xl gap-6 px-6 py-24 md:grid-cols-2">
          <div className={`reveal p-8 ${card}`}>
            <Database className="h-7 w-7 text-teal-600 dark:text-teal-300" />
            <h2 className="mt-5 text-2xl font-bold">Toolkit</h2>
            <div className="mt-6 flex flex-wrap gap-2">
              {toolkit.map((t) => (
                <span
                  key={t}
                  className="rounded-lg border border-border bg-background px-3 py-1.5 font-mono text-sm dark:bg-white/[0.03]"
                >
                  {t}
                </span>
              ))}
            </div>
            <p className="mt-8 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Domain
            </p>
            <p className="mt-2 text-muted-foreground">{domain.join(" · ")}</p>
          </div>
          <div className={`reveal flex flex-col p-8 ${card}`}>
            <Globe className="h-7 w-7 text-teal-600 dark:text-teal-300" />
            <h2 className="mt-5 text-2xl font-bold leading-tight">
              Need a website?{" "}
              <em className="block text-teal-600 dark:text-teal-300">I build those too.</em>
            </h2>
            <p className="mt-2 text-muted-foreground">
              I can build websites and apps for your Nepali business — restaurants, shops, salons,
              and more. Fast, mobile-friendly, and easy to manage. Try a demo:
            </p>
            <div className="mt-6 grid grid-cols-3 gap-3">
              {demos.map((d) => (
                <Link
                  key={d.to}
                  to={d.to}
                  aria-label={`${d.name} demo website`}
                  className="group overflow-hidden rounded-xl border border-border"
                >
                  <img
                    src={d.img}
                    alt={`${d.name} demo`}
                    loading="lazy"
                    className="aspect-[4/3] w-full object-cover object-top transition-transform duration-700 group-hover:scale-110"
                  />
                </Link>
              ))}
            </div>
            <Link
              to="/services"
              className="mt-auto inline-flex items-center gap-1 pt-6 text-sm font-semibold text-teal-700 hover:underline dark:text-teal-300"
            >
              Services & prices <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </section>

        {/* Contact */}
        <section id="contact" className="scroll-mt-20 px-6 py-24">
          <div className="reveal mx-auto max-w-6xl">
            <div className="flex flex-wrap items-center justify-between gap-8 rounded-3xl bg-gradient-to-r from-teal-600 to-sky-600 p-8 text-white shadow-xl md:p-10 dark:from-teal-500/90 dark:to-sky-600/90 dark:shadow-[0_20px_80px_-20px_rgba(94,234,212,0.45)]">
              <div>
                <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
                  Let's work together.
                </h2>
                <p className="mt-2 text-teal-50">
                  Hiring for a data role, or need a website? I reply within a day.
                </p>
                <div className="mt-5 flex gap-2">
                  {[
                    {
                      icon: Linkedin,
                      href: "https://www.linkedin.com/in/saphinpraja/",
                      label: "LinkedIn",
                    },
                    { icon: Github, href: "https://github.com/Saphin18", label: "GitHub" },
                    {
                      icon: Instagram,
                      href: "https://www.instagram.com/twilightsaphin/",
                      label: "Instagram",
                    },
                  ].map(({ icon: Icon, href, label }) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={label}
                      className="grid h-10 w-10 place-items-center rounded-lg border border-white/30 transition-colors hover:bg-white/15"
                    >
                      <Icon className="h-4 w-4" />
                    </a>
                  ))}
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => setFormOpen((o) => !o)}
                  aria-expanded={formOpen}
                  aria-controls="contact-form"
                  className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition-transform hover:-translate-y-0.5"
                >
                  <Send className="h-4 w-4" />
                  {formOpen ? "Close form" : "Send a message"}
                </button>
                <a
                  href="mailto:prajasaphin18@gmail.com"
                  className="inline-flex items-center gap-2 rounded-lg border border-white/40 px-6 py-3 text-sm font-semibold transition-colors hover:bg-white/15"
                >
                  <Mail className="h-4 w-4" /> prajasaphin18@gmail.com
                </a>
              </div>
            </div>

            <div
              className={`grid transition-all duration-500 ease-out ${
                formOpen ? "mt-6 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <div className="overflow-hidden">
                <form
                  id="contact-form"
                  onSubmit={onSubmit}
                  className={`space-y-4 p-8 ${card}`}
                  inert={!formOpen}
                >
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="contact-name" className="mb-1.5 block text-sm font-medium">
                        Name
                      </label>
                      <input
                        required
                        id="contact-name"
                        name="name"
                        maxLength={100}
                        className={inputCls}
                      />
                    </div>
                    <div>
                      <label htmlFor="contact-email" className="mb-1.5 block text-sm font-medium">
                        Email
                      </label>
                      <input
                        required
                        type="email"
                        id="contact-email"
                        name="email"
                        maxLength={255}
                        className={inputCls}
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="contact-message" className="mb-1.5 block text-sm font-medium">
                      Message
                    </label>
                    <textarea
                      required
                      id="contact-message"
                      name="message"
                      rows={5}
                      maxLength={1000}
                      placeholder="A role, a project, a website — tell me a little about it."
                      className={`${inputCls} resize-none`}
                    />
                  </div>
                  {/* Honeypot field — hidden from users, bots fill it in */}
                  <div
                    aria-hidden="true"
                    className="absolute left-[-9999px] h-0 w-0 overflow-hidden"
                  >
                    <label htmlFor="contact-website">Website</label>
                    <input
                      id="contact-website"
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
                    disabled={status === "sending"}
                    className={`${btnPrimary} w-full justify-center disabled:opacity-70`}
                  >
                    {status === "sending"
                      ? "Sending…"
                      : status === "sent"
                        ? "Thanks — I'll be in touch"
                        : "Send message"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>
      <PortfolioChat />

      <footer className="border-t border-border/60">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-6 py-8 text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Saphin Praja · Kathmandu, Nepal</p>
          <p>Built with React, TanStack Start, and a lot of SQL.</p>
        </div>
      </footer>
    </div>
  );
}
