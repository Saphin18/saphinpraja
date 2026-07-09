import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import {
  Database,
  Code2,
  FileSpreadsheet,
  BarChart3,
  NotebookPen,
  Github,
  Linkedin,
  Mail,
  Instagram,
  Download,
  ArrowRight,
} from "lucide-react";
import { useReveal } from "@/hooks/use-reveal";
import { ThemeToggle } from "@/components/theme-toggle";


export const Route = createFileRoute("/")({
  component: Portfolio,
  head: () => ({
    links: [{ rel: "canonical", href: "https://saphinpraja.lovable.app/" }],
    meta: [{ property: "og:url", content: "https://saphinpraja.lovable.app/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Person",
          name: "Saphin Praja",
          jobTitle: "Data Analyst",
          url: "https://saphinpraja.lovable.app/",
          sameAs: [
            "https://www.linkedin.com/in/saphin-praja/",
            "https://github.com/Saphin18",
            "https://www.instagram.com/saphin.twilight/",
          ],
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "Saphin Praja Portfolio",
          url: "https://saphinpraja.lovable.app/",
          description:
            "Portfolio of Saphin Praja, a junior data analyst with fintech experience. SQL, Python, Power BI.",
        }),
      },
    ],
  }),
});

const nav = [
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "skills", label: "Skills" },
  { id: "contact", label: "Contact" },
];

const skillIcons = [
  { icon: Database, label: "SQL" },
  { icon: Code2, label: "Python" },
  { icon: FileSpreadsheet, label: "Excel" },
  { icon: BarChart3, label: "Power BI" },
  { icon: NotebookPen, label: "Jupyter" },
];

const projects = [
  {
    title: "FX Insights Automation",
    desc: "Python script that runs daily at 3 PM, pulling FX rates, commodity prices, and market index data. Saves structured JSON to Google Drive and posts a formatted summary to Slack automatically.",
    tags: ["Python", "Google Drive API", "Slack API"],
  },
  {
    title: "Reddit Competitor & Remittance Monitor",
    desc: "Monitoring script that scans Reddit every 15 minutes for remittance and competitor-related discussion using keyword and semantic matching, then auto-alerts a Slack channel.",
    tags: ["Python", "Slack API"],
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

const technical = ["SQL", "Python", "Excel", "Power BI", "Data Visualization", "Jupyter"];
const domain = ["Fintech Analytics", "Customer Profiling", "Research", "Reporting"];

function Portfolio() {
  useReveal();
  const [active, setActive] = useState("about");
  const [sent, setSent] = useState(false);

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

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSent(true);
    (e.currentTarget as HTMLFormElement).reset();
    setTimeout(() => setSent(false), 4000);
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <a href="#top" className="font-display text-lg font-bold tracking-tight">
            Saphin<span className="text-accent">.</span>
          </a>
          <nav className="hidden items-center gap-1 md:flex">
            {nav.map((n) => (
              <a
                key={n.id}
                href={`#${n.id}`}
                className={`rounded-md px-3 py-2 text-sm transition-colors hover:text-foreground ${active === n.id ? "text-foreground" : "text-muted-foreground"
                  }`}
              >
                {n.label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <a
              href="#contact"
              className="hidden rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-transform hover:-translate-y-0.5 md:inline-flex"
            >
              Get in touch
            </a>
          </div>
        </div>
      </header>

      <main>
        <section id="top" className="bg-hero">
          <div className="mx-auto max-w-6xl px-6 py-24 md:py-32">
            <div className="max-w-3xl">
              <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground">
                <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                Available for junior analyst roles
              </p>
              <h1 className="text-5xl font-bold leading-[1.05] md:text-7xl">Saphin Praja — Data Analyst</h1>
              <p className="mt-4 text-xl text-muted-foreground md:text-2xl">
                Data Analyst · <span className="text-foreground">SQL</span> ·{" "}
                <span className="text-foreground">Python</span> ·{" "}
                <span className="text-foreground">Power BI</span>
              </p>
              <p className="mt-6 max-w-xl text-lg text-muted-foreground">
                Turning fintech data into actionable insights.
              </p>
              <div className="mt-10 flex flex-wrap gap-3">
                <a
                  href="#projects"
                  className="group inline-flex items-center gap-2 rounded-md bg-primary px-5 py-3 text-sm font-medium text-primary-foreground shadow-card transition-transform hover:-translate-y-0.5"
                >
                  View projects
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </a>
                <a
                  href="/Saphin_Praja_Resume.pdf"
                  download="Saphin_Praja_Resume.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-5 py-3 text-sm font-medium transition-colors hover:border-accent hover:text-accent"
                >
                  <Download className="h-4 w-4" />
                  Download resume
                </a>
                <a
                  href="#contact"
                  className="inline-flex items-center gap-2 rounded-md px-5 py-3 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                >
                  Contact me
                </a>
              </div>
            </div>
          </div>
        </section>

        <section id="about" className="mx-auto max-w-6xl px-6 py-24">
          <div className="grid gap-12 md:grid-cols-[1fr_1.5fr]">
            <div className="reveal">
              <p className="text-sm font-medium uppercase tracking-widest text-accent">About</p>
              <h2 className="mt-2 text-3xl font-bold md:text-4xl">
                A year in fintech, a lot of queries later.
              </h2>
            </div>
            <div className="reveal space-y-6">
              <p className="text-lg leading-relaxed text-muted-foreground">
                I'm a junior data analyst with a year of hands-on work in fintech. Day to day I pull data out of SQL, clean it in Python, and turn it into Power BI dashboards people actually open.
              </p>
              <p className="text-lg leading-relaxed text-muted-foreground">
                Most of my work has been customer profiling, quick research questions from the business, and reporting that runs on a schedule so no one has to ask for it twice.
              </p>
              <div className="flex flex-wrap gap-3 pt-2">
                {skillIcons.map(({ icon: Icon, label }) => (
                  <div
                    key={label}
                    className="flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2.5 text-sm shadow-card transition-transform hover:-translate-y-0.5"
                  >
                    <Icon className="h-4 w-4 text-accent" />
                    <span className="font-medium">{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="experience" className="border-y border-border/60 bg-secondary/40">
          <div className="mx-auto max-w-6xl px-6 py-24">
            <div className="reveal mb-12">
              <p className="text-sm font-medium uppercase tracking-widest text-accent">Experience</p>
              <h2 className="mt-2 text-3xl font-bold md:text-4xl">Where I've worked</h2>
            </div>
            <div className="reveal relative space-y-8 pl-8 md:pl-12">
              <div className="absolute left-2 top-2 h-full w-px bg-border md:left-4" />
              {experience.map((job, idx) => (
                <div key={job.title + job.duration} className="relative">
                  <div
                    className="absolute top-2 h-3 w-3 rounded-full bg-accent ring-4 ring-background"
                    style={{ left: idx === 0 ? "-29px" : "-29px" }}
                  />
                  <div className="rounded-2xl border border-border bg-card p-8 shadow-card md:-ml-0">
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <h3 className="text-xl font-bold">{job.title}</h3>
                      <span className="text-sm text-muted-foreground">{job.duration}</span>
                    </div>
                    <ul className="mt-6 space-y-3 text-muted-foreground">
                      {job.bullets.map((b) => (
                        <li key={b} className="flex gap-3">
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="projects" className="mx-auto max-w-6xl px-6 py-24">
          <div className="reveal mb-12 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-sm font-medium uppercase tracking-widest text-accent">Projects</p>
              <h2 className="mt-2 text-3xl font-bold md:text-4xl">Things I've built</h2>
            </div>
            <p className="max-w-md text-muted-foreground">
              A mix of work projects and things I made to answer my own questions.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            {projects.map((p) => (
              <article
                key={p.title}
                className="reveal group relative flex flex-col rounded-2xl border border-border bg-card p-7 shadow-card transition-all hover:-translate-y-1 hover:border-accent/60 hover:shadow-glow"
              >
                <h3 className="text-xl font-bold">{p.title}</h3>
                <p className="mt-3 flex-1 text-muted-foreground">{p.desc}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {p.tags.map((t) => (
                    <span
                      key={t}
                      className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground"
                    >
                      {t}
                    </span>
                  ))}
                </div>
                <p className="mt-6 text-sm font-medium text-muted-foreground">
                  Built at Xuno — details on request
                </p>
              </article>
            ))}
          </div>
          <div className="reveal mt-10 rounded-2xl border border-border bg-card p-6 shadow-card sm:p-8">
            <p className="text-sm font-medium uppercase tracking-widest text-accent">Guide</p>
            <h3 className="mt-2 text-xl font-bold">Building an AML transaction monitoring script</h3>
            <p className="mt-2 text-muted-foreground">
              A technical walkthrough of the same monitoring shape as my Reddit project, applied to payments data — rules, SQL, and Slack alerts.
            </p>
            <Link
              to="/guides/aml-transaction-monitoring"
              className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-accent hover:underline"
            >
              Read the guide
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>

        <section id="skills" className="border-y border-border/60 bg-secondary/40">
          <div className="mx-auto max-w-6xl px-6 py-24">
            <div className="reveal mb-12">
              <p className="text-sm font-medium uppercase tracking-widest text-accent">Skills</p>
              <h2 className="mt-2 text-3xl font-bold md:text-4xl">What I work with</h2>
            </div>
            <div className="grid gap-8 md:grid-cols-2">
              <div className="reveal rounded-2xl border border-border bg-card p-8 shadow-card">
                <h3 className="mb-5 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  Technical
                </h3>
                <div className="flex flex-wrap gap-2">
                  {technical.map((s) => (
                    <span
                      key={s}
                      className="rounded-lg border border-border bg-background px-3.5 py-2 text-sm font-medium transition-colors hover:border-accent hover:text-accent"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
              <div className="reveal rounded-2xl border border-border bg-card p-8 shadow-card">
                <h3 className="mb-5 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  Domain
                </h3>
                <div className="flex flex-wrap gap-2">
                  {domain.map((s) => (
                    <span
                      key={s}
                      className="rounded-lg border border-border bg-background px-3.5 py-2 text-sm font-medium transition-colors hover:text-gold"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="contact" className="mx-auto max-w-6xl px-6 py-24">
          <div className="grid gap-12 md:grid-cols-[1fr_1.2fr]">
            <div className="reveal">
              <p className="text-sm font-medium uppercase tracking-widest text-accent">Contact</p>
              <h2 className="mt-2 text-3xl font-bold md:text-4xl">Say hi.</h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Send a note about a role, a project, or a question. I read everything and reply within a day or two.
              </p>
              <div className="mt-8 flex gap-3">
                {[
                  { icon: Linkedin, href: "https://www.linkedin.com/in/saphinpraja/", label: "LinkedIn" },
                  { icon: Github, href: "https://github.com/Saphin18", label: "GitHub" },
                  { icon: Instagram, href: "https://www.instagram.com/saphin.twilight/", label: "Instagram" },
                  { icon: Mail, href: "mailto:hello@saphinpraja.com", label: "Email" },
                ].map(({ icon: Icon, href, label }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="grid h-11 w-11 place-items-center rounded-lg border border-border bg-card transition-all hover:-translate-y-0.5 hover:border-accent hover:text-accent"
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                ))}
              </div>
            </div>

            <form
              onSubmit={onSubmit}
              className="reveal space-y-4 rounded-2xl border border-border bg-card p-8 shadow-card"
            >
              <div>
                <label htmlFor="contact-name" className="mb-1.5 block text-sm font-medium">Name</label>
                <input
                  required
                  id="contact-name"
                  name="name"
                  maxLength={100}
                  className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm outline-none transition-colors focus:border-accent focus:ring-2 focus:ring-accent/20"
                />
              </div>
              <div>
                <label htmlFor="contact-email" className="mb-1.5 block text-sm font-medium">Email</label>
                <input
                  required
                  type="email"
                  id="contact-email"
                  name="email"
                  maxLength={255}
                  className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm outline-none transition-colors focus:border-accent focus:ring-2 focus:ring-accent/20"
                />
              </div>
              <div>
                <label htmlFor="contact-message" className="mb-1.5 block text-sm font-medium">Message</label>
                <textarea
                  required
                  id="contact-message"
                  name="message"
                  rows={5}
                  maxLength={1000}
                  className="w-full resize-none rounded-lg border border-input bg-background px-4 py-2.5 text-sm outline-none transition-colors focus:border-accent focus:ring-2 focus:ring-accent/20"
                />
              </div>
              <button
                type="submit"
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition-transform hover:-translate-y-0.5"
              >
                {sent ? "Thanks — I'll be in touch" : "Send message"}
              </button>
            </form>
          </div>
        </section>
      </main>

      <footer className="border-t border-border/60">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-6 py-8 text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Saphin Praja</p>
          <p>Built with React, TanStack Start, and a lot of SQL.</p>
        </div>
      </footer>
    </div>
  );
}
