import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

export const Route = createFileRoute("/guides/saphin-ai")({
  head: () => ({
    meta: [
      { title: "Building Saphin AI: An AI Companion App" },
      {
        name: "description",
        content:
          "A technical walkthrough of Saphin AI, a mobile and web AI companion app — the AI provider abstraction layer, JWT/JWKS auth, two-tier memory, hybrid proactivity, and cross-platform architecture.",
      },
      {
        property: "og:title",
        content: "Building Saphin AI: An AI Companion App",
      },
      {
        property: "og:description",
        content:
          "How I architected Saphin AI: a swappable AI provider layer, Supabase auth via JWKS, a two-tier memory system, and a hybrid approach to proactive notifications.",
      },
      { property: "og:type", content: "article" },
      {
        property: "og:url",
        content: "https://saphinpraja.com.np/guides/saphin-ai",
      },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      {
        rel: "canonical",
        href: "https://saphinpraja.com.np/guides/saphin-ai",
      },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "TechArticle",
          headline: "Building Saphin AI: An AI Companion App",
          author: { "@type": "Person", name: "Saphin Praja" },
          description:
            "How I architected Saphin AI: a swappable AI provider layer, Supabase auth via JWKS, a two-tier memory system, and a hybrid approach to proactive notifications.",
          url: "https://saphinpraja.com.np/guides/saphin-ai",
          mainEntityOfPage: "https://saphinpraja.com.np/guides/saphin-ai",
        }),
      },
    ],
  }),
  component: Guide,
});

function Guide() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-3xl px-6 py-16 md:py-24">
        <div className="flex items-center justify-between">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to portfolio
          </Link>
          <ThemeToggle />
        </div>

        <article className="mt-8 space-y-6">
          <header className="space-y-4 border-b border-border/60 pb-8">
            <p className="text-sm font-medium uppercase tracking-widest text-accent">
              Guide · Product Engineering
            </p>
            <h1 className="text-4xl font-bold leading-tight md:text-5xl">
              Building Saphin AI: An AI Companion App
            </h1>
            <p className="text-lg text-muted-foreground">
              A look at the architecture behind Saphin AI, a mobile and web app that gives each
              user a warm, private AI companion. The interesting engineering problems weren't the
              chat itself — they were the decisions around it: how to keep the AI swappable, how
              to make the companion remember things without a vector database, and how to decide
              which features need a server push and which don't.
            </p>
          </header>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold">The shape of the system</h2>
            <p className="text-muted-foreground">
              The mobile app (Expo / React Native) and the web app (the same codebase, exported
              via Expo Web) never talk to the database or the AI provider directly — everything
              goes through a FastAPI backend. That single rule keeps secrets on the server, keeps
              business logic in one place, and means the client is, in a real sense, disposable:
              nothing about how memory works or how the AI is prompted lives in the app itself.
            </p>
            <p className="text-muted-foreground">
              Postgres (via Supabase) stores everything relational — users, chat sessions,
              messages, and later, memories, moods, reminders, and goals — and Supabase Auth
              handles login so the project never has to touch a raw password.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold">
              Decision one: put the AI behind an interface, not a vendor SDK
            </h2>
            <p className="text-muted-foreground">
              Every part of the app that needs a reply calls an internal{" "}
              <code className="rounded bg-secondary px-1.5 py-0.5 text-sm">AIProvider</code>{" "}
              interface — never a specific vendor's SDK. This paid for itself almost immediately:
              the first provider I tried required paid billing, the second returned a zero quota
              in my region, and the third worked. Because the chat code only ever spoke to the
              interface, switching providers was one new provider file plus one line in a factory
              function — nothing about sessions, memory, or the chat UI had to change. Any code
              that starts making decisions based on "which AI am I calling" is a sign the
              abstraction is leaking.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold">Auth: verifying tokens without a shared secret</h2>
            <p className="text-muted-foreground">
              Supabase signs auth tokens asymmetrically (ES256) and publishes its public keys at a
              JWKS endpoint, rather than using a static shared secret the backend checks against.
              The backend fetches and caches those public keys and verifies every request's token
              against them — with a small clock-skew allowance, since a backend server and an auth
              provider's clocks are never perfectly in sync, and a strict check will reject a
              freshly issued, perfectly valid token purely because it looks like it was "issued in
              the future" by a couple of seconds. The fetch itself also retries and, if the key
              server is briefly unreachable, keeps serving the last known keys rather than locking
              every user out — a slightly stale signing key is a better failure mode than a false
              "please log in again."
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold">
              Memory without a vector database
            </h2>
            <p className="text-muted-foreground">
              A companion that forgets everything between messages doesn't feel like a companion.
              The memory system has two tiers, deliberately kept simple:
            </p>
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex gap-3">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                <span>
                  <strong className="text-foreground">Short-term</strong> — the last stretch of
                  the current conversation is fed back to the model as real message history, so it
                  follows the thread naturally.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                <span>
                  <strong className="text-foreground">Long-term</strong> — after each turn, a
                  best-effort background call asks the model to extract durable facts ("has a dog
                  named Max") into a small table. Active facts are injected wholesale into the
                  system prompt on every future message.
                </span>
              </li>
            </ul>
            <p className="text-muted-foreground">
              No embeddings, no retrieval step — per-user memory stays small enough to inject in
              full, which keeps it fast, free, and easy to reason about. It's a conscious
              trade-off: it doesn't scale to thousands of facts per user, but it's a clean upgrade
              path later (swap the injection step for a retrieval query) rather than a rewrite.
              Every later AI-adjacent feature — mood detection, personality tone, a "responding"
              journal, daily check-in messages — copies this same shape: a best-effort side-call
              that never breaks the main chat if it fails.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold">
              Proactivity: three features, three different mechanisms
            </h2>
            <p className="text-muted-foreground">
              The most useful lesson from this project was resisting the urge to solve
              "proactivity" with one generic system. Three proactive features shipped together,
              each using whichever mechanism actually suited it:
            </p>
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex gap-3">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                <span>
                  <strong className="text-foreground">Daily check-in</strong> — a remote push
                  notification. An external scheduler calls a secret-guarded backend endpoint on a
                  short interval; the backend finds users whose chosen local time has arrived,
                  writes a fresh one-line message with the AI, and sends it via push. This needs to
                  be server-driven because the message itself is freshly generated.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                <span>
                  <strong className="text-foreground">Reminders</strong> — scheduled entirely
                  on-device. A remote push would make reminders <em>worse</em>, not better: local
                  scheduling fires at the exact second even if the server is asleep, with no
                  network round-trip in the way. The reminder is mirrored to the backend only so it
                  survives a reinstall and so the companion can reference it in conversation.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                <span>
                  <strong className="text-foreground">Goals</strong> — not a notification at all.
                  Active goals are folded into the same memory context injected into the system
                  prompt, so the companion can bring them up naturally without a single change to
                  the AI provider's interface.
                </span>
              </li>
            </ul>
            <p className="text-muted-foreground">
              Matching the mechanism to the feature — instead of forcing everything through one
              "notifications system" — kept each piece simple and made the non-negotiable product
              rule easy to enforce: proactive messages are opt-in, on the user's own schedule, with
              no streaks or guilt-based nudging.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold">
              Attachments on a text-only model, without changing its interface
            </h2>
            <p className="text-muted-foreground">
              Adding voice, image, and document support could easily have meant a rewrite of the
              chat pipeline. Instead, each attachment type is converted to text before it ever
              reaches the AI: a voice note is transcribed and the transcript{" "}
              <em>becomes</em> the chat message; an image is described by a vision-capable model
              and the description is folded into the same context block used for memory; a
              document is parsed with plain text-extraction, no AI involved, and injected the same
              way. The result is that the core{" "}
              <code className="rounded bg-secondary px-1.5 py-0.5 text-sm">
                generate_reply
              </code>{" "}
              function's signature never changed across the whole feature — attachments are just
              another source of text arriving through the same door as memory and goals.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold">One codebase, two platforms</h2>
            <p className="text-muted-foreground">
              The web version reuses the same React Native codebase via Expo Web rather than a
              separate frontend — the alternative was rebuilding every screen from scratch for
              marginal gain. Platform differences are handled with narrow, explicit checks rather
              than parallel code paths: biometric login and push-token registration are skipped on
              web since a browser doesn't need them; the mobile drawer becomes a permanent sidebar
              on wider screens; wallpaper images swap between portrait and landscape crops per
              platform. Each of these is a small conditional at the point of use, not a fork of the
              app — which is what makes a single codebase actually worth maintaining.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold">Where this connects to my work</h2>
            <p className="text-muted-foreground">
              Saphin AI is the largest project on my{" "}
              <Link to="/" className="text-accent underline-offset-4 hover:underline">
                portfolio home
              </Link>
              , and it's where the abstraction-first habits from my data and automation work
              carried over most directly: an AI provider that can be swapped in one file, a memory
              system that injects context instead of hand-wiring prompts, and proactive features
              that each use the simplest mechanism that actually fits — the same instinct behind
              keeping FX-Insight's data sources and Reddit monitor's alert channels independently
              swappable.
            </p>
          </section>

          <footer className="border-t border-border/60 pt-8">
            <p className="text-sm text-muted-foreground">
              Written by Saphin Praja — data analyst working in fintech, currently building AI
              products on the side. If you're hiring or want to talk through an AI product
              architecture,{" "}
              <Link
                to="/"
                hash="contact"
                className="text-accent underline-offset-4 hover:underline"
              >
                get in touch
              </Link>
              .
            </p>
          </footer>
        </article>
      </div>
    </main>
  );
}
