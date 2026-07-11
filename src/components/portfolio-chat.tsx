import { MessageCircle, X } from "lucide-react";
import { useState } from "react";

type ChatMessage = { role: "visitor" | "assistant"; text: string };

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

  function addQuickAnswer(answer: string) {
    setMessages((current) => [...current, { role: "assistant", text: answer }]);
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
                  Hi! Choose a question to learn about Saphin's background.
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
          </div>
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
