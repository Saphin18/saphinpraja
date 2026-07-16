import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

export const Route = createFileRoute("/guides/aml-transaction-monitoring")({
  head: () => ({
    meta: [
      { title: "Building an AML Transaction Monitoring Script in Python & SQL" },
      {
        name: "description",
        content:
          "A practical guide to building a basic AML transaction monitoring script with Python and SQL — rules, thresholds, and alerting, drawn from real fintech data work.",
      },
      {
        property: "og:title",
        content: "Building an AML Transaction Monitoring Script in Python & SQL",
      },
      {
        property: "og:description",
        content:
          "A practical guide to building a basic AML transaction monitoring script with Python and SQL — rules, thresholds, and alerting.",
      },
      { property: "og:type", content: "article" },
      {
        property: "og:url",
        content: "https://saphinpraja.vercel.app/guides/aml-transaction-monitoring",
      },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      {
        rel: "canonical",
        href: "https://saphinpraja.vercel.app/guides/aml-transaction-monitoring",
      },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "TechArticle",
          headline: "Building an AML Transaction Monitoring Script in Python & SQL",
          author: { "@type": "Person", name: "Saphin Praja" },
          description:
            "A practical guide to building a basic AML transaction monitoring script with Python and SQL — rules, thresholds, and alerting.",
          url: "https://saphinpraja.vercel.app/guides/aml-transaction-monitoring",
          mainEntityOfPage: "https://saphinpraja.vercel.app/guides/aml-transaction-monitoring",
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
              Guide · Fintech
            </p>
            <h1 className="text-4xl font-bold leading-tight md:text-5xl">
              Building an AML Transaction Monitoring Script in Python & SQL
            </h1>
            <p className="text-lg text-muted-foreground">
              A practical walkthrough of how I'd approach a basic AML (anti-money-laundering)
              transaction monitoring script — the same shape as the Reddit competitor and remittance
              monitor I built at Xuno, but pointed at payments data.
            </p>
          </header>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold">What transaction monitoring actually does</h2>
            <p className="text-muted-foreground">
              At its core, transaction monitoring is a job that reads new transactions on a
              schedule, runs each one through a set of rules, and raises an alert when something
              looks off. The complicated products you see on vendor websites are mostly a nicer UI
              on top of that loop. If you can write SQL and a Python script, you can build the loop.
            </p>
            <p className="text-muted-foreground">
              The three pieces you need: a source of transactions (usually a database), a set of
              rules (thresholds, patterns, watchlists), and somewhere to send alerts (Slack, email,
              a case-management table).
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold">The rules you start with</h2>
            <p className="text-muted-foreground">
              Real AML programs cover dozens of typologies. For a first script, four rules cover
              most of what regulators expect to see and are easy to reason about:
            </p>
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex gap-3">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                <span>
                  <strong className="text-foreground">Large single transaction</strong> — anything
                  over a fixed threshold (e.g. $10,000).
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                <span>
                  <strong className="text-foreground">Structuring</strong> — several transactions
                  under the threshold that sum above it within a short window.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                <span>
                  <strong className="text-foreground">High-risk geography</strong> — sends to or
                  from countries on a sanctions or high-risk list.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                <span>
                  <strong className="text-foreground">Velocity</strong> — a user's transaction count
                  or volume spiking versus their own recent baseline.
                </span>
              </li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold">SQL for the heavy lifting</h2>
            <p className="text-muted-foreground">
              Push as much work into SQL as you can — it's faster and easier to audit than
              equivalent pandas. Structuring is a good example: a window function does the rolling
              sum per user cleanly.
            </p>
            <pre className="overflow-x-auto rounded-lg border border-border bg-card p-4 text-sm">
              {`-- Flag structuring: 24h rolling volume per user
SELECT
  user_id,
  transaction_id,
  amount,
  created_at,
  SUM(amount) OVER (
    PARTITION BY user_id
    ORDER BY created_at
    RANGE BETWEEN INTERVAL '24 hours' PRECEDING AND CURRENT ROW
  ) AS rolling_24h_volume
FROM transactions
WHERE created_at >= NOW() - INTERVAL '48 hours'
  AND amount < 10000
QUALIFY rolling_24h_volume >= 10000;`}
            </pre>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold">Python for the loop and the alerts</h2>
            <p className="text-muted-foreground">
              Python's job is to run the SQL, apply anything awkward to express in SQL (like fuzzy
              name matching against a watchlist), and push alerts out.
            </p>
            <pre className="overflow-x-auto rounded-lg border border-border bg-card p-4 text-sm">
              {`import os, requests, pandas as pd
from sqlalchemy import create_engine

engine = create_engine(os.environ["DATABASE_URL"])
SLACK = os.environ["SLACK_WEBHOOK_URL"]

def run_rule(name, sql):
    df = pd.read_sql(sql, engine)
    for _, row in df.iterrows():
        alert(name, row.to_dict())

def alert(rule, payload):
    requests.post(SLACK, json={
        "text": f":rotating_light: *{rule}* triggered\\n\`\`\`{payload}\`\`\`"
    })

if __name__ == "__main__":
    run_rule("large_transaction",
             "SELECT * FROM transactions WHERE amount >= 10000 "
             "AND created_at >= NOW() - INTERVAL '15 minutes'")
    run_rule("structuring", open("sql/structuring.sql").read())`}
            </pre>
            <p className="text-muted-foreground">
              Schedule this with cron, a workflow tool, or (my preference) a small scheduler service
              that also records every run — you'll want an audit trail the first time compliance
              asks whether a rule fired last Tuesday.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold">What to log, and why it matters</h2>
            <p className="text-muted-foreground">
              For each alert, write a row to an{" "}
              <code className="rounded bg-secondary px-1.5 py-0.5 text-sm">alerts</code> table with
              the rule name, the transaction and user IDs, a snapshot of the fields the rule
              evaluated, and the timestamp. This gives you two things for free: a queue analysts can
              work through, and a dataset you can measure precision on later to tune thresholds
              down.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold">Where this connects to my work</h2>
            <p className="text-muted-foreground">
              The Reddit competitor and remittance monitor on my{" "}
              <Link to="/" className="text-accent underline-offset-4 hover:underline">
                portfolio home
              </Link>{" "}
              has the same skeleton: pull new records on a schedule, apply keyword and semantic
              rules, alert Slack. Swap Reddit posts for payments and the keyword rules for AML
              typologies and you've built the first useful version of a transaction monitoring
              system.
            </p>
          </section>

          <footer className="border-t border-border/60 pt-8">
            <p className="text-sm text-muted-foreground">
              Written by Saphin Praja — data analyst working in fintech. If you're hiring or want to
              talk through a monitoring problem,{" "}
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
