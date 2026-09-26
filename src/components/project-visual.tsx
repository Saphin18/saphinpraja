export type VisualKind = "bars" | "line" | "alerts" | "chat";

/** Small decorative illustration shown at the top of each project card. Uses currentColor. */
export function ProjectVisual({ kind }: { kind: VisualKind }) {
  if (kind === "bars") {
    const h = [40, 65, 50, 80, 60, 95, 75, 88];
    return (
      <div className="flex h-24 items-end gap-2">
        {h.map((v, i) => (
          <div
            key={i}
            className="flex-1 rounded-t-md bg-current"
            style={{ height: `${v}%`, opacity: 0.3 + i * 0.09 }}
          />
        ))}
      </div>
    );
  }
  if (kind === "line") {
    const d = "M0 60 L25 52 L50 58 L75 40 L100 44 L125 28 L150 34 L175 18 L200 22";
    return (
      <svg viewBox="0 0 200 80" className="h-24 w-full" preserveAspectRatio="none" aria-hidden>
        <path d={`${d} L200 80 L0 80 Z`} fill="currentColor" opacity="0.12" />
        <path
          d={d}
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  if (kind === "alerts") {
    return (
      <div className="flex h-24 flex-col justify-center gap-2">
        {["r/remittance — new mention", "Competitor price thread", "Semantic match: 0.91"].map(
          (t, i) => (
            <div
              key={t}
              className="flex items-center gap-2 rounded-lg bg-current/10 px-3 py-1.5 text-xs"
              style={{ marginLeft: i * 12 }}
            >
              <span className="h-2 w-2 shrink-0 rounded-full bg-current" />
              <span className="truncate text-foreground/75">{t}</span>
            </div>
          ),
        )}
      </div>
    );
  }
  return (
    <div className="flex h-24 flex-col justify-center gap-2 text-xs">
      <div className="max-w-[75%] self-start rounded-2xl rounded-bl-sm bg-current/10 px-3 py-1.5 text-foreground/80">
        Long day… I feel a bit low today.
      </div>
      <div className="max-w-[75%] self-end rounded-2xl rounded-br-sm bg-current px-3 py-1.5">
        <span className="text-background">I'm here for you. Want to talk about it? 💛</span>
      </div>
      <div className="flex gap-1 self-start px-2">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="h-1.5 w-1.5 rounded-full bg-current"
            style={{ opacity: 0.4 + i * 0.2 }}
          />
        ))}
      </div>
    </div>
  );
}
