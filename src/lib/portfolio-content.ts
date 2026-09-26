import type { VisualKind } from "@/components/project-visual";

// Everything on the portfolio page that can be edited from /admin.
// DEFAULT_CONTENT is the built-in copy: the page falls back to it whenever the database
// can't be reached, so the site never shows an error because of the admin feature.

export type Project = {
  title: string;
  desc: string;
  impact: string;
  tags: string[];
  url: string;
  visual: VisualKind;
};

export type Job = {
  title: string;
  duration: string;
  bullets: string[];
};

export type PortfolioContent = {
  badge: string;
  tagline: string;
  headlineBefore: string;
  headlineHighlight: string;
  headlineAfter: string;
  intro: string;
  currentRole: string;
  aboutHeading: string;
  aboutParagraphs: string[];
  experience: Job[];
  projects: Project[];
  toolkit: string[];
  domain: string[];
};

export const VISUALS: { id: VisualKind; label: string }[] = [
  { id: "bars", label: "Bar chart" },
  { id: "line", label: "Line chart" },
  { id: "alerts", label: "Alerts" },
  { id: "chat", label: "Chat" },
];

export const DEFAULT_CONTENT: PortfolioContent = {
  badge: "Open to freelance projects · Websites & apps",
  tagline: "Saphin Praja · Data Analyst · Kathmandu",
  headlineBefore: "I find the",
  headlineHighlight: "story",
  headlineAfter: "in your numbers.",
  intro:
    "SQL, Python, and Power BI at Xuno — dashboards, visualisations, and automations that save hours. Plus beautiful websites and apps for Nepali businesses.",
  currentRole: "Data Analyst @ Xuno",
  aboutHeading: "A year in fintech, a lot of queries later.",
  aboutParagraphs: [
    "I'm a data analyst based in Kathmandu, Nepal, with a year of hands-on work in fintech. Day to day I pull data out of SQL, clean it in Python, and turn it into dashboards people actually open.",
    "Most of my work is extracting and analysing data, building automations, and turning the results into dashboards and visualisations — reporting that runs on a schedule so no one has to ask for it twice.",
  ],
  experience: [
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
  ],
  projects: [
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
  ],
  toolkit: [
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
  ],
  domain: ["Fintech analytics", "RFM segmentation", "Customer profiling", "Automated reporting"],
};

// Saved content comes from the database, so check every field and fall back to the
// built-in copy for anything missing or malformed instead of letting the page crash.
const str = (v: unknown, fallback: string) => (typeof v === "string" ? v : fallback);
const strList = (v: unknown, fallback: string[]) =>
  Array.isArray(v) && v.every((x) => typeof x === "string") ? (v as string[]) : fallback;
const isVisual = (v: unknown): v is VisualKind => VISUALS.some((x) => x.id === v);

export function normalizeContent(raw: unknown): PortfolioContent {
  const d = DEFAULT_CONTENT;
  if (!raw || typeof raw !== "object") return d;
  const r = raw as Record<string, unknown>;

  const projects = Array.isArray(r.projects)
    ? r.projects
        .filter((p): p is Record<string, unknown> => !!p && typeof p === "object")
        .map((p) => ({
          title: str(p.title, ""),
          desc: str(p.desc, ""),
          impact: str(p.impact, ""),
          tags: strList(p.tags, []),
          url: str(p.url, ""),
          visual: isVisual(p.visual) ? p.visual : "bars",
        }))
    : d.projects;

  const experience = Array.isArray(r.experience)
    ? r.experience
        .filter((j): j is Record<string, unknown> => !!j && typeof j === "object")
        .map((j) => ({
          title: str(j.title, ""),
          duration: str(j.duration, ""),
          bullets: strList(j.bullets, []),
        }))
    : d.experience;

  return {
    badge: str(r.badge, d.badge),
    tagline: str(r.tagline, d.tagline),
    headlineBefore: str(r.headlineBefore, d.headlineBefore),
    headlineHighlight: str(r.headlineHighlight, d.headlineHighlight),
    headlineAfter: str(r.headlineAfter, d.headlineAfter),
    intro: str(r.intro, d.intro),
    currentRole: str(r.currentRole, d.currentRole),
    aboutHeading: str(r.aboutHeading, d.aboutHeading),
    aboutParagraphs: strList(r.aboutParagraphs, d.aboutParagraphs),
    experience,
    projects,
    toolkit: strList(r.toolkit, d.toolkit),
    domain: strList(r.domain, d.domain),
  };
}
