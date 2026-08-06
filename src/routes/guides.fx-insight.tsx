import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

export const Route = createFileRoute("/guides/fx-insight")({
  head: () => ({
    meta: [
      { title: "Building FX-Insight: Daily FX Market Data Automation" },
      {
        name: "description",
        content:
          "A technical walkthrough of FX-Insight, a Python script that pulls live FX, gold, oil, and index data from TradingView plus FII/DII flows from Moneycontrol and NSDL, and appends it to a tracked Excel workbook with Slack and Drive delivery.",
      },
      {
        property: "og:title",
        content: "Building FX-Insight: Daily FX Market Data Automation",
      },
      {
        property: "og:description",
        content:
          "How I automated daily FX, commodity, index, and FII/DII data collection into an Excel workbook using TradingView websockets, openpyxl, Slack, and Google Drive.",
      },
      { property: "og:type", content: "article" },
      {
        property: "og:url",
        content: "https://saphinpraja.com.np/guides/fx-insight",
      },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      {
        rel: "canonical",
        href: "https://saphinpraja.com.np/guides/fx-insight",
      },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "TechArticle",
          headline: "Building FX-Insight: Daily FX Market Data Automation",
          author: { "@type": "Person", name: "Saphin Praja" },
          description:
            "How I automated daily FX, commodity, index, and FII/DII data collection into an Excel workbook using TradingView websockets, openpyxl, Slack, and Google Drive.",
          url: "https://saphinpraja.com.np/guides/fx-insight",
          mainEntityOfPage: "https://saphinpraja.com.np/guides/fx-insight",
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
              Building FX-Insight: Daily FX Market Data Automation
            </h1>
            <p className="text-lg text-muted-foreground">
              A technical walkthrough of FX-Insight, a script I run daily to pull live FX,
              commodity, and index prices alongside FII/DII flow data into a single Excel
              workbook — the same kind of scheduled fetch-and-alert shape as my other automation
              projects, pointed at market data instead of payments or Reddit posts.
            </p>
          </header>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold">What FX-Insight does</h2>
            <p className="text-muted-foreground">
              Every run, the script opens a fresh TradingView websocket session for each tracked
              symbol — the dollar index, major FX pairs, oil, gold, NIFTY, SENSEX, NASDAQ-100, and
              the S&P 500 — pulls the last few daily candles, and works out which one is the most
              recently{" "}
              <em>completed</em> session rather than whatever bar happens to be forming right now.
              In parallel it scrapes FII/DII (foreign and domestic institutional investor) flow
              data from Moneycontrol, with NSE and NSDL as fallback and supplementary sources. Once
              everything is collected, it appends one new row per sheet to a tracked{" "}
              <code className="rounded bg-secondary px-1.5 py-0.5 text-sm">
                Forex_Insights.xlsx
              </code>{" "}
              workbook, formats the cells, uploads the file to Drive, and posts a summary to Slack.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold">
              The hard part: knowing which candle is actually closed
            </h2>
            <p className="text-muted-foreground">
              TradingView streams daily candles stamped at their <em>open</em> time in each
              exchange's own reference timezone, and different markets close at different UTC
              hours — FX/oil/gold roll at the New York close, India at NSE close, US indices at
              the NYSE close, all of it shifting an hour with daylight saving. Naively taking "the
              latest candle" risks grabbing a bar that's still forming. The script instead computes
              a per-market UTC cutoff hour, filters out any candle whose session hasn't closed yet,
              and only then takes the last one:
            </p>
            <pre className="overflow-x-auto rounded-lg border border-border bg-card p-4 text-sm">
              {`def session_close_utc_hour(market: str) -> int:
    """Return the UTC hour after which a market's daily bar is complete."""
    summer = _dst_active()
    if market in ("FX", "OIL", "GOLD"):
        return 21 if summer else 22
    if market == "INDIA":
        return 10
    if market == "US":
        return 20 if summer else 21
    return 21


def last_completed_candles(key, ordered):
    market = SYMBOL_MARKET.get(key, "FX")
    close_hour = session_close_utc_hour(market)
    now_utc = datetime.utcnow()
    cutoff = now_utc.replace(hour=close_hour, minute=0, second=0, microsecond=0)
    if now_utc < cutoff:
        cutoff -= timedelta(days=1)
    complete = [c for c in ordered if datetime.utcfromtimestamp(c["ts"]) < cutoff]
    if not complete:
        complete = ordered
    return complete[-1], complete[-2] if len(complete) > 1 else complete[-1]`}
            </pre>
            <p className="text-muted-foreground">
              A companion function,{" "}
              <code className="rounded bg-secondary px-1.5 py-0.5 text-sm">
                market_tz_offset
              </code>
              , converts each candle's UTC open timestamp back to the exchange-local calendar date
              — nudging FX/oil/gold forward to the next UTC midnight, shifting India by +5:30, and
              adjusting US by the EDT/EST offset — so every sheet is labelled with the date a
              trader would actually recognize, not a UTC date that's off by one depending on the
              market.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold">
              Fetching 20+ symbols concurrently without getting rate-limited
            </h2>
            <p className="text-muted-foreground">
              Each symbol gets its own websocket thread, staggered by a small launch delay so
              TradingView doesn't see a burst of simultaneous connections. If a symbol comes back
              with an HTTP 429, the fetch retries with linear backoff up to a fixed retry count
              before giving up and logging a failure — the run still completes and writes whatever
              data it did manage to collect rather than failing the whole script over one flaky
              symbol.
            </p>
            <pre className="overflow-x-auto rounded-lg border border-border bg-card p-4 text-sm">
              {`def fetch_all_symbols() -> None:
    threads = []
    for key, symbol in SYMBOLS.items():
        thread = threading.Thread(target=fetch_tradingview_symbol, args=(key, symbol), daemon=True)
        thread.start()
        threads.append(thread)
        time.sleep(LAUNCH_DELAY)
    for thread in threads:
        thread.join(timeout=60)

# inside fetch_tradingview_symbol, on a 429:
if attempt <= MAX_RETRIES:
    wait = RETRY_DELAY * attempt
    time.sleep(wait)
    fetch_tradingview_symbol(key, tv_symbol, attempt + 1)`}
            </pre>
            <p className="text-muted-foreground">
              A shared{" "}
              <code className="rounded bg-secondary px-1.5 py-0.5 text-sm">AppState</code>{" "}
              dataclass, guarded by a lock, collects results as each thread finishes — so writes
              from concurrent symbols never race against each other.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold">FII/DII flows: three sources, one fallback chain</h2>
            <p className="text-muted-foreground">
              Institutional flow data is scraped rather than pulled from a clean API, so the script
              treats it defensively: Moneycontrol's widget is the primary source for cash and F&O
              FII/DII nets, with NSE's public endpoint as a fallback if that scrape fails. Separately,
              NSDL's FPI report supplies the equity/debt breakdown that neither of the other two
              expose. Each source is wrapped in its own try/except so one broken scraper doesn't
              take down the others:
            </p>
            <pre className="overflow-x-auto rounded-lg border border-border bg-card p-4 text-sm">
              {`try:
    moneycontrol = fetch_moneycontrol_fii()
    state.fii.update(moneycontrol)
except OSError as exc:
    print(f"  WARN Moneycontrol FII widget failed: {exc}")
    try:
        nse = fetch_nse_cash_fii()
        state.fii.update(nse)
    except OSError as fallback_exc:
        print(f"  WARN NSE FII fallback failed: {fallback_exc}")

try:
    sebi = fetch_nsdl_fpi_sebi()
    state.fii["equity"] = sebi.get("equity")
    state.fii["debt"] = sebi.get("debt")
except OSError as exc:
    print(f"  WARN NSDL FPI (EQUITY/DEBT) failed: {exc}")`}
            </pre>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold">Writing to Excel without breaking the workbook</h2>
            <p className="text-muted-foreground">
              The workbook is a living file that gets appended to on every run, so the script has
              to find the next empty row rather than overwrite anything, apply consistent number
              formats and borders, and color each cell green or red based on whether the instrument
              closed up or down from its open:
            </p>
            <pre className="overflow-x-auto rounded-lg border border-border bg-card p-4 text-sm">
              {`def next_append_row(worksheet: Worksheet) -> int:
    """Return the next empty row after the last populated row in column A."""
    last_row = 1
    for row in worksheet.iter_rows(min_row=2, max_col=1, values_only=False):
        if row[0].value is not None:
            last_row = row[0].row
    return last_row + 1


def direction_fill(close, open_value):
    if open_value is None or close is None:
        return None
    return UP_FILL if close >= open_value else DOWN_FILL


def apply_cell(cell, value, is_pct=False, fill=None, number_format=None):
    cell.value = value
    cell.font = BODY_FONT
    cell.border = thin_border()
    cell.alignment = Alignment(horizontal="center", vertical="center")
    if fill:
        cell.fill = fill
    if number_format:
        cell.number_format = number_format
    elif is_pct and isinstance(value, (int, float)):
        cell.number_format = "+0.00%;-0.00%;0.00%"`}
            </pre>
            <p className="text-muted-foreground">
              Four sheets get their own append function —{" "}
              <code className="rounded bg-secondary px-1.5 py-0.5 text-sm">DXY</code>,{" "}
              <code className="rounded bg-secondary px-1.5 py-0.5 text-sm">USDINR</code>{" "}
              (which also carries the FII/DII and gold/oil columns),{" "}
              <code className="rounded bg-secondary px-1.5 py-0.5 text-sm">Indian_Stock</code>,
              and <code className="rounded bg-secondary px-1.5 py-0.5 text-sm">US_Indices</code> —
              each writing a timestamp, open/close pairs, and a computed change percent, with
              column layouts stable enough that a one-time migration function was needed when
              NDX/SPX moved from the Indian_Stock sheet to their own.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold">Delivery: Drive and Slack</h2>
            <p className="text-muted-foreground">
              Once the workbook is saved, the run finishes by uploading it to Google Drive so the
              latest version is always available outside the machine running the script, then
              posting a summary to Slack so the day's numbers show up without anyone opening the
              file:
            </p>
            <pre className="overflow-x-auto rounded-lg border border-border bg-card p-4 text-sm">
              {`workbook.save(EXCEL_FILE)
upload_to_drive()
send_slack_summary(state)`}
            </pre>
            <p className="text-muted-foreground">
              Splitting these into their own{" "}
              <code className="rounded bg-secondary px-1.5 py-0.5 text-sm">drive_uploader</code>{" "}
              and{" "}
              <code className="rounded bg-secondary px-1.5 py-0.5 text-sm">notifier</code> modules
              keeps the main script focused on fetch-and-write, and means either delivery channel
              can be swapped or disabled without touching the data logic.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold">Where this connects to my work</h2>
            <p className="text-muted-foreground">
              FX-Insight runs the same loop as the other automations on my{" "}
              <Link to="/" className="text-accent underline-offset-4 hover:underline">
                portfolio home
              </Link>
              : fetch on a schedule, normalize and validate the data, write it somewhere durable,
              and alert Slack. Here the data source is TradingView and institutional flow scrapes
              instead of Reddit or payments records, but the shape — concurrent fetch with retries,
              defensive fallbacks per source, and a clean append into a tracked file — is the same
              pattern applied to market data.
            </p>
          </section>

          <footer className="border-t border-border/60 pt-8">
            <p className="text-sm text-muted-foreground">
              Written by Saphin Praja — data analyst working in fintech. If you're hiring or want
              to talk through a market data pipeline,{" "}
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
