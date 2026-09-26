import { createFileRoute } from "@tanstack/react-router";

// Portfolio AI assistant, powered by Groq (same setup as the GymFreak project).
// The browser only talks to this route; GROQ_API_KEY never leaves the server.
// The model answers ONLY from the fact sheet below, so keep it up to date.

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const DEFAULT_MODEL = "openai/gpt-oss-120b";
const MAX_QUESTION = 500; // characters a visitor may send in one message
const HISTORY_TURNS = 3; // earlier question+answer pairs sent along for context
const TIMEOUT_MS = 25_000;

const FACTS = `
ABOUT
- Saphin Praja is a data analyst based in Kathmandu, Nepal.
- Works at Xuno (a fintech / remittance company) as a Data Analyst since Feb 2026.
- Before that: Digital Marketing & Data Analysis Intern at Xuno, Oct 2025 – Jan 2026. Got curious about the data behind marketing numbers, learned SQL and Python, and moved into the data analyst role.
- Day to day: extracting and analysing data, building automations, and turning results into dashboards and visualisations; reporting that runs on a schedule.
- At Xuno: built Metabase dashboards used to track daily and weekly performance; writes Python scripts and Jupyter notebooks to clean and analyse data; queries and reports on Mixpanel, CleverTap, Meta Business Suite, and internal data; has done RFM segmentation and customer profiles.

TOOLKIT
SQL, Python, Power BI, Excel, Jupyter, Metabase, Mixpanel, CleverTap, Slack API, Google Drive API, Google Sheets API, Matplotlib. Also built apps with Expo, React Native, TypeScript, FastAPI, Supabase, Groq.

PROJECTS
1. Daily Reporting Automation — pulls Mixpanel analytics, generates 8 dashboards, writes to Google Sheets, and posts one consolidated daily report with images to Slack. Replaced about 45 minutes of manual work every day. Tools: Python, Mixpanel API, Google Sheets API, Slack API, Matplotlib. GitHub: https://github.com/Saphin18/daily-reporting-automation
2. FX Insights Automation — runs every day at 3 PM, pulls FX rates, commodity prices, and market indices, saves structured JSON to Google Drive, and posts a summary to Slack. Tools: Python, Google Drive API, Slack API. GitHub: https://github.com/Saphin18/fx-market-insights (guide on the site: /guides/fx-insight)
3. Reddit Competitor & Remittance Monitor — scans Reddit every 15 minutes for remittance and competitor discussion using keyword and semantic matching, and alerts a Slack channel. Tools: Python, NLP, Slack API. GitHub: https://github.com/Saphin18/reddit-brand-monitor
4. Saphin AI — a warm, privacy-first AI companion app for Android you can talk to like a friend; it listens, supports, and motivates you. No streaks, no guilt-tripping notifications. Tools: Expo, React Native, TypeScript, FastAPI, Supabase, Groq. GitHub: https://github.com/Saphin18/ai-companion (guide on the site: /guides/saphin-ai)

WEBSITES & APPS FOR BUSINESSES (freelance, alongside the Xuno job)
- Builds fast, mobile-friendly websites and apps for Nepali businesses: restaurants, shops, salons, clinics, and more. Can also add a simple sales dashboard, since he is a data analyst.
- Starting prices: Starter Rs 12,000 (one-page site, mobile-friendly, WhatsApp & call buttons, Google Maps, delivered in about 5 days); Business Rs 25,000 (up to 5 pages, menu/services & price list, contact or booking form, Google Business Profile setup, basic SEO); Online Store Rs 45,000 (product catalogue, cart & order form, eSewa / Khalti or WhatsApp ordering, simple sales dashboard). Domain and hosting are billed at cost.
- Process: free call → first design within a few days (changes included) → launch on your own domain → one month of free edits, then optional monthly support.
- Payment: 50% to start, 50% when the site is ready; eSewa, Khalti, or bank transfer.
- Works with businesses anywhere in Nepal.
- Sample demo sites (fictional businesses): restaurant /demos/restaurant, online shop /demos/shop, salon booking /demos/salon. Full details and quote form: /services

CONTACT
- Email: prajasaphin18@gmail.com
- WhatsApp: +977 9821858674
- LinkedIn: https://www.linkedin.com/in/saphinpraja/
- GitHub: https://github.com/Saphin18
- Or use the contact form on the homepage, or the quote form on /services.
`.trim();

const SYSTEM_PROMPT = `You are the friendly assistant on Saphin Praja's portfolio website (saphinpraja.com.np).
Visitors may be recruiters, people curious about his projects, or business owners who want a website or app.

Rules:
- Answer ONLY using the facts below. If something is not covered, say you don't know and suggest contacting Saphin directly (email or WhatsApp).
- Never invent numbers, prices, employers, dates, or skills.
- Keep answers short: 2–5 sentences, or a few short bullet lines. Plain text only, no markdown headings or bold.
- When sharing a page, write the full plain URL, e.g. https://saphinpraja.com.np/services. Never use markdown links like [text](url). Write the WhatsApp number as +977 9821858674.
- Be warm and professional. Refer to him as "Saphin".
- For website or app enquiries, mention the starting price that fits and invite them to the quote form on /services or WhatsApp.
- If asked about something unrelated to Saphin, his work, or his services, politely steer back.

FACTS:
${FACTS}`;

type Turn = { role: "user" | "assistant"; content: string };

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

/** Plain text for the chat bubble: drop markdown bold/heading markers. */
function tidy(text: string) {
  return text
    .replace(/\*\*|__/g, "")
    .split("\n")
    .map((line) =>
      line.trimStart().startsWith("#") ? line.replace(/^\s*#+\s*/, "") : line.trimEnd(),
    )
    .join("\n")
    .trim();
}

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const apiKey = process.env.GROQ_API_KEY;
        if (!apiKey) {
          console.error("GROQ_API_KEY environment variable is not defined");
          return json({ error: "The AI assistant is not switched on yet." }, 503);
        }

        let body: { question?: unknown; history?: unknown };
        try {
          body = await request.json();
        } catch {
          return json({ error: "Invalid request." }, 400);
        }

        const question = typeof body.question === "string" ? body.question.trim() : "";
        if (!question) return json({ error: "Please type a question." }, 400);
        if (question.length > MAX_QUESTION) {
          return json({ error: `Please keep questions under ${MAX_QUESTION} characters.` }, 400);
        }

        const history = (Array.isArray(body.history) ? body.history : [])
          .filter(
            (t): t is Turn =>
              !!t &&
              typeof t === "object" &&
              ((t as Turn).role === "user" || (t as Turn).role === "assistant") &&
              typeof (t as Turn).content === "string",
          )
          .slice(-HISTORY_TURNS * 2)
          .map((t) => ({ role: t.role, content: t.content.slice(0, 1500) }));

        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
        let res: Response;
        try {
          res = await fetch(GROQ_URL, {
            method: "POST",
            signal: controller.signal,
            headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
            body: JSON.stringify({
              model: process.env.GROQ_MODEL || DEFAULT_MODEL,
              messages: [
                { role: "system", content: SYSTEM_PROMPT },
                ...history,
                { role: "user", content: question },
              ],
              temperature: 0.3, // low = sticks closely to the facts
              max_tokens: 450,
            }),
          });
        } catch (err) {
          console.error("Groq request failed:", err);
          return json(
            { error: "The assistant could not be reached. Please try again in a moment." },
            502,
          );
        } finally {
          clearTimeout(timer);
        }

        if (res.status === 429) {
          return json(
            { error: "The assistant is busy right now. Please try again in a minute." },
            429,
          );
        }
        if (!res.ok) {
          console.error("Groq error", res.status, (await res.text()).slice(0, 300));
          return json({ error: "The assistant had a problem answering. Please try again." }, 502);
        }

        const data = (await res.json().catch(() => null)) as {
          choices?: { message?: { content?: string | null } }[];
        } | null;
        const reply = tidy(data?.choices?.[0]?.message?.content ?? "");
        if (!reply) {
          return json({ error: "The assistant had a problem answering. Please try again." }, 502);
        }
        return json({ reply });
      },
    },
  },
});
