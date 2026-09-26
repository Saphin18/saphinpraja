import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";

export type MobileMenuItem =
  { label: string; href: string } | { label: string; to: "/" | "/services" };

/** Hamburger menu shown below the md breakpoint, where the desktop nav is hidden. */
export function MobileMenu({
  items,
  cta,
}: {
  items: MobileMenuItem[];
  cta?: { label: string; href: string; onClick?: () => void };
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const linkCls =
    "block rounded-lg px-4 py-3 text-base font-medium text-foreground transition-colors hover:bg-secondary";

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-label={open ? "Close menu" : "Open menu"}
        className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border/65 bg-card text-foreground"
      >
        {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 top-16 z-40 bg-black/20" onClick={() => setOpen(false)} />
          <nav className="absolute inset-x-0 top-16 z-50 border-b border-border bg-background p-3 shadow-xl">
            {items.map((it) =>
              "to" in it ? (
                <Link key={it.label} to={it.to} onClick={() => setOpen(false)} className={linkCls}>
                  {it.label}
                </Link>
              ) : (
                <a key={it.label} href={it.href} onClick={() => setOpen(false)} className={linkCls}>
                  {it.label}
                </a>
              ),
            )}
            {cta && (
              <a
                href={cta.href}
                onClick={() => {
                  cta.onClick?.();
                  setOpen(false);
                }}
                className="mt-2 block rounded-lg bg-slate-900 px-4 py-3 text-center text-base font-semibold text-white dark:bg-teal-300 dark:text-slate-950"
              >
                {cta.label}
              </a>
            )}
          </nav>
        </>
      )}
    </div>
  );
}
