import { MessageCircle, Send, X } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";

type ChatMessage = { role: "visitor" | "assistant"; text: string };

const messageLimit = 10;
const sessionKey = "portfolio-chat-message-count";

const quickQuestions = [
  {
    question: "What's your experience?",
    answer:
      "Saphin is a junior data analyst at Xuno. He moved from a digital marketing and data analysis internship into a full data analyst role, where he works with product, marketing, and internal business data.",
  },
  {
    question: "What tools do you know?",
    answer:
      "His core tools are SQL, Python, Excel, Power BI, Jupyter, and data visualization. He also works with Metabase, Mixpanel, CleverTap, Meta Business Suite, Google Drive API, and Slack API.",
  },
  {
    question: "What have you built?",
    answer:
      "He built an FX Insights Automation pipeline that gathers market data, saves structured results to Google Drive, and posts Slack summaries. He also built a Reddit competitor and remittance monitor that scans discussions and alerts Slack.",
  },
  {
    question: "How can I contact you?",
    answer:
      "You can use the contact form on this page, connect with Saphin on LinkedIn, or email hello@saphinpraja.com.",
  },
];

export function PortfolioChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [messageCount, setMessageCount] = useState(0);

  useEffect(() => {
    const savedCount = Number(sessionStorage.getItem(sessionKey) ?? "0");
    setMessageCount(Number.isFinite(savedCount) ? savedCount : 0);
  }, []);

  function addQuickAnswer(answer: string) {
    setMessages((current) => [...current, { role: "assistant", text: answer }]);
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const question = input.trim();
    if (!question || isSending) return;

    if (messageCount >= messageLimit) {
      setMessages((current) => [
        ...current,
        { role: "assistant", text: "You have reached this session's chat limit. Please contact Saphin directly for anything else." },
      ]);
      return;
    }

    const nextCount = messageCount + 1;
    setMessageCount(nextCount);
    sessionStorage.setItem(sessionKey, String(nextCount));
    setMessages((current) => [...current, { role: "visitor", text: question }]);
    setInput("");
    setIsSending(true);

    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      if (!supabaseUrl) throw new Error("Chat is not configured yet.");

      const response = await fetch(`${supabaseUrl}/functions/v1/portfolio-chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: question }),
      });
      const body = (await response.json().catch(() => null)) as { answer?: string; error?: string } | null;
      if (!response.ok || !body?.answer) throw new Error(body?.error ?? "I couldn't answer that right now.");
      setMessages((current) => [...current, { role: "assistant", text: body.answer }]);
    } catch (error) {
      setMessages((current) => [
        ...current,
        { role: "assistant", text: error instanceof Error ? error.message : "I couldn't answer that right now." },
      ]);
    } finally {
      setIsSending(false);
    }
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
              <p className="font-display text-sm font-bold">Ask about Saphin</p>
              <p className="text-xs text-muted-foreground">Portfolio assistant</p>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-background hover:text-foreground"
              aria-label="Close chat"
            >
              <X className="h-4 w-4" />
            </button>
          </header>

          <div className="flex-1 space-y-3 overflow-y-auto p-4">
            {messages.length === 0 && (
              <>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Hi! Ask a quick question, or type one below to learn about Saphin's background.
                </p>
                <div className="flex flex-wrap gap-2">
                  {quickQuestions.map(({ question, answer }) => (
                    <button
                      key={question}
                      type="button"
                      onClick={() => addQuickAnswer(answer)}
                      className="rounded-lg border border-border bg-background px-3 py-2 text-left text-xs font-medium transition-colors hover:border-accent hover:text-accent"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </>
            )}

            {messages.map((message, index) => (
              <p
                key={`${message.role}-${index}`}
                className={`w-fit max-w-[88%] whitespace-pre-wrap rounded-xl px-3 py-2 text-sm leading-relaxed ${
                  message.role === "visitor"
                    ? "ml-auto bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground"
                }`}
              >
                {message.text}
              </p>
            ))}
            {isSending && (
              <p className="w-fit rounded-xl bg-secondary px-3 py-2 text-sm text-muted-foreground" aria-live="polite">
                Typing<span className="animate-pulse">...</span>
              </p>
            )}
          </div>

          <form onSubmit={onSubmit} className="flex gap-2 border-t border-border p-3">
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              maxLength={500}
              disabled={isSending}
              placeholder="Ask about Saphin..."
              className="min-w-0 flex-1 rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none transition-colors focus:border-accent focus:ring-2 focus:ring-accent/20"
              aria-label="Ask a question"
            />
            <button
              type="submit"
              disabled={isSending || !input.trim()}
              className="grid h-9 w-9 place-items-center rounded-lg bg-primary text-primary-foreground transition-opacity disabled:opacity-50"
              aria-label="Send question"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
          <p className="px-3 pb-3 text-xs text-muted-foreground">{messageLimit - messageCount} AI messages left this session</p>
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
