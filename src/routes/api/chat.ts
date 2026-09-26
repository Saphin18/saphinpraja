import { createFileRoute } from "@tanstack/react-router";
import { fetchPortfolioContent, fetchServicesContent } from "@/lib/supabase";
import type { PortfolioContent } from "@/lib/portfolio-content";
import { formatWhatsapp, type ServicesContent } from "@/lib/services-content";

// Portfolio AI assistant, powered by Groq (same setup as the GymFreak project).
// The browser only talks to this route; GROQ_API_KEY never leaves the server.
// The model answers ONLY from the fact sheet built below.

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const DEFAULT_MODEL = "openai/gpt-oss-120b";
const MAX_QUESTION = 500; // characters a visitor may send in one message
const HISTORY_TURNS = 3; // earlier question+answer pairs sent along for context
const TIMEOUT_MS = 25_000;

// The facts come from the same content the pages show (edited in /admin), so the assistant
// never quotes old prices or projects. Anything not editable there is written in below.
function buildFacts(p: PortfolioContent, s: ServicesContent): string {
  const lines = (xs: string[]) => xs.map((x) => `- ${x}`).join("\n");
  return `
ABOUT
- ${p.tagline}. Currently: ${p.currentRole}.
${lines(p.aboutParagraphs)}

EXPERIENCE
${p.experience.map((j) => `${j.title} (${j.duration})\n${lines(j.bullets)}`).join("\n")}

TOOLKIT
${p.toolkit.join(", ")}. Domain: ${p.domain.join(", ")}.

PROJECTS
${p.projects
  .map(
    (x, i) =>
      `${i + 1}. ${x.title} — ${x.desc} Result: ${x.impact}. Tools: ${x.tags.join(", ")}.${x.url ? ` Link: ${x.url}` : ""}`,
  )
  .join("\n")}
Guides on the site: /guides/saphin-ai (how Saphin AI was built), /guides/fx-insight (how FX Insights Automation works).

WEBSITES & APPS FOR BUSINESSES (freelance, alongside his day job)
- Builds fast, mobile-friendly websites and apps for Nepali businesses: restaurants, shops, salons, clinics, and more. Can also add a simple sales dashboard, since he is a data analyst.
- Starting prices:
${s.packages.map((x) => `  - ${x.name}: from ${x.price}. ${x.blurb} Includes: ${x.features.join(", ")}.`).join("\n")}
- Domain and hosting are billed at cost.
- Process: free call → first design within a few days (changes included) → launch on your own domain → one month of free edits, then optional monthly support.
- Sample demo sites (fictional businesses): restaurant /demos/restaurant, online shop /demos/shop, salon booking /demos/salon. Full details and quote form: /services
- Common questions:
${s.faqs.map((f) => `  - Q: ${f.q} A: ${f.a}`).join("\n")}

CONTACT
- Email: prajasaphin18@gmail.com
- WhatsApp: ${formatWhatsapp(s.whatsappNumber)}
- LinkedIn: https://www.linkedin.com/in/saphinpraja/
- GitHub: https://github.com/Saphin18
- Or use the contact form on the homepage, or the quote form on /services.
`.trim();
}

function systemPrompt(p: PortfolioContent, s: ServicesContent): string {
  return `You are the friendly assistant on Saphin Praja's portfolio website (saphinpraja.com.np).
Visitors may be recruiters, people curious about his projects, or business owners who want a website or app.

Rules:
- Answer ONLY using the facts below. If something is not covered, say you don't know and suggest contacting Saphin directly (email or WhatsApp).
- Never invent numbers, prices, employers, dates, or skills.
- Keep answers short: 2–5 sentences, or a few short bullet lines. Plain text only, no markdown headings or bold.
- When sharing a page, write the full plain URL, e.g. https://saphinpraja.com.np/services. Never use markdown links like [text](url). Write the WhatsApp number as ${formatWhatsapp(s.whatsappNumber)}.
- Be warm and professional. Refer to him as "Saphin".
- For website or app enquiries, mention the starting price that fits and invite them to the quote form on /services or WhatsApp.
- If asked about something unrelated to Saphin, his work, or his services, politely steer back.

FACTS:
${buildFacts(p, s)}`;
}

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

        const [portfolio, services] = await Promise.all([
          fetchPortfolioContent(),
          fetchServicesContent(),
        ]);

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
                { role: "system", content: systemPrompt(portfolio, services) },
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
