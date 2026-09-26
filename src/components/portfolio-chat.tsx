import { MessageCircle, RotateCcw, Send, X } from "lucide-react";
import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";

type ChatMessage = { role: "user" | "assistant"; content: string; error?: boolean };

const starters = [
  "What's Saphin's experience?",
  "What has he built?",
  "Can he build a website for my business?",
  "How can I contact him?",
];

const MAX_QUESTION = 500;

// Turns URLs, site paths (/services), emails, and the +977 WhatsApp number into links.
const LINK_RE =
  /(https?:\/\/[^\s<>()]+)|((?<![\w/.])\/(?:services|demos\/(?:restaurant|shop|salon)|guides\/(?:saphin-ai|fx-insight))\b)|([\w.+-]+@[\w-]+\.[\w.-]+\w)|(\+977[\s-]?9\d{9})/g;

function Linkified({ text }: { text: string }) {
  const parts: ReactNode[] = [];
  let last = 0;
  for (const match of text.matchAll(LINK_RE)) {
    let raw = match[0];
    // Keep sentence punctuation outside the link: "…/services." → "/services" + "."
    const trail = raw.match(/[.,;:!?]+$/)?.[0] ?? "";
    if (trail) raw = raw.slice(0, -trail.length);
    const start = match.index ?? 0;
    parts.push(text.slice(last, start));

    const [, url, path, email, phone] = match;
    const href = url
      ? raw
      : path
        ? raw
        : email
          ? `mailto:${raw}`
          : `https://wa.me/${raw.replace(/\D/g, "")}`;
    const external = Boolean(url || phone);
    parts.push(
      <a
        key={start}
        href={href}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        className="break-all font-medium text-teal-700 underline underline-offset-2 hover:text-teal-900 dark:text-teal-300 dark:hover:text-teal-200"
      >
        {phone ? `${raw} (WhatsApp)` : raw}
      </a>,
      trail,
    );
    last = start + match[0].length;
  }
  parts.push(text.slice(last));
  return <>{parts}</>;
}

export function PortfolioChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  async function ask(question: string) {
    const q = question.trim();
    if (!q || loading) return;
    // Only real turns go back to the server as context — not error bubbles.
    const history = messages
      .filter((m) => !m.error)
      .map(({ role, content }) => ({ role, content }));
    setMessages((m) => [...m, { role: "user", content: q }]);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: q, history }),
      });
      const data = (await res.json().catch(() => null)) as {
        reply?: string;
        error?: string;
      } | null;
      if (!res.ok || !data?.reply) {
        throw new Error(data?.error ?? "Something went wrong. Please try again.");
      }
      setMessages((m) => [...m, { role: "assistant", content: data.reply! }]);
      if (typeof window !== "undefined" && typeof window.gtag === "function") {
        window.gtag("event", "portfolio_chat_question", { event_category: "engagement" });
      }
    } catch (err) {
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          content: err instanceof Error ? err.message : "Something went wrong. Please try again.",
          error: true,
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    void ask(input);
  }

  return (
    <div className="fixed bottom-6 right-6 z-[60] font-sans">
      {isOpen && (
        <section
          aria-label="Portfolio assistant"
          className="mb-3 flex h-[min(34rem,calc(100vh-8rem))] w-[min(24rem,calc(100vw-3rem))] flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-xl"
        >
          <header className="flex items-center justify-between border-b border-border bg-secondary/40 px-4 py-3">
            <div>
              <p className="flex items-center gap-2 font-display text-sm font-bold">
                Ask about Saphin
                <span className="rounded-full bg-teal-500/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-teal-700 dark:text-teal-300">
                  AI
                </span>
              </p>
              <p className="text-xs text-muted-foreground">Projects, experience, and services</p>
            </div>
            <div className="flex items-center gap-1">
              {messages.length > 0 && (
                <button
                  type="button"
                  onClick={() => setMessages([])}
                  className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-background hover:text-foreground"
                  aria-label="Start a new chat"
                  title="New chat"
                >
                  <RotateCcw className="h-4 w-4" />
                </button>
              )}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-background hover:text-foreground"
                aria-label="Close chat"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </header>

          <div ref={listRef} className="flex-1 space-y-3 overflow-y-auto p-4" aria-live="polite">
            {messages.length === 0 && (
              <>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Hi! 👋 I'm Saphin's AI assistant. Ask me anything about his work, projects, or
                  website services — or pick a question:
                </p>
                <div className="flex flex-wrap gap-2">
                  {starters.map((q) => (
                    <button
                      key={q}
                      type="button"
                      onClick={() => void ask(q)}
                      className="rounded-lg border border-border bg-background px-3 py-2 text-left text-xs font-medium transition-colors hover:border-accent hover:text-accent"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </>
            )}

            {messages.map((m, i) => (
              <p
                key={`${m.role}-${i}`}
                className={`w-fit max-w-[88%] whitespace-pre-wrap rounded-xl px-3 py-2 text-sm leading-relaxed ${
                  m.role === "user"
                    ? "ml-auto bg-primary text-primary-foreground"
                    : m.error
                      ? "border border-destructive/30 bg-destructive/10 text-destructive"
                      : "bg-secondary text-secondary-foreground"
                }`}
              >
                {m.role === "assistant" && !m.error ? <Linkified text={m.content} /> : m.content}
              </p>
            ))}

            {loading && (
              <div
                className="flex w-fit gap-1 rounded-xl bg-secondary px-3 py-3"
                aria-label="Assistant is typing"
              >
                {[0, 150, 300].map((d) => (
                  <span
                    key={d}
                    className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground"
                    style={{ animationDelay: `${d}ms` }}
                  />
                ))}
              </div>
            )}
          </div>

          <form onSubmit={onSubmit} className="flex items-center gap-2 border-t border-border p-3">
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              maxLength={MAX_QUESTION}
              placeholder="Type your question…"
              aria-label="Your question"
              className="min-w-0 flex-1 rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none transition-colors focus:border-accent focus:ring-2 focus:ring-accent/20"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-primary text-primary-foreground transition-opacity disabled:opacity-40"
              aria-label="Send"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </section>
      )}

      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        className="ml-auto grid h-14 w-14 place-items-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform hover:-translate-y-0.5"
        aria-label={isOpen ? "Close portfolio chat" : "Open portfolio chat"}
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </button>
    </div>
  );
}
