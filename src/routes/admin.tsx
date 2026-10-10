import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useState, type FormEvent, type ReactNode } from "react";
import type { Session } from "@supabase/supabase-js";
import {
  ArrowDown,
  ArrowUp,
  ExternalLink,
  History,
  Inbox,
  KeyRound,
  LogOut,
  Mail,
  Plus,
  RotateCcw,
  ShieldCheck,
  Trash2,
} from "lucide-react";
import { getSupabase, supabaseConfigured, type ContentId } from "@/lib/supabase";
import {
  DEFAULT_SERVICES,
  formatWhatsapp,
  normalizeServices,
  normalizeWhatsapp,
  type Faq,
  type Package,
  type ServicesContent,
} from "@/lib/services-content";
import {
  DEFAULT_CONTENT,
  normalizeContent,
  VISUALS,
  type Job,
  type PortfolioContent,
  type Project,
} from "@/lib/portfolio-content";

export const Route = createFileRoute("/admin")({
  // Login lives in the browser, so there's nothing useful to render on the server.
  ssr: false,
  head: () => ({
    meta: [{ title: "Admin — Saphin Praja" }, { name: "robots", content: "noindex, nofollow" }],
  }),
  component: Admin,
});

const ADMIN_EMAIL = "prajasaphin18@gmail.com";

// On admin.saphinpraja.com.np, "/" redirects back here, so link to the main site instead.
const SITE_HOME =
  typeof window !== "undefined" && window.location.hostname.startsWith("admin.")
    ? "https://saphinpraja.com.np/"
    : "/";

const inputCls =
  "w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none transition-colors focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20";
const btn =
  "inline-flex items-center justify-center gap-1.5 rounded-lg px-3.5 py-2 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50 [&_svg]:h-4 [&_svg]:w-4";
const btnPrimary = `${btn} bg-slate-900 text-white hover:bg-teal-700 dark:bg-teal-300 dark:text-slate-950 dark:hover:bg-teal-200`;
const btnGhost = `${btn} border border-border bg-card hover:border-foreground`;
const card = "rounded-2xl border border-border bg-card p-5 shadow-sm";

type Tab = "intro" | "projects" | "experience" | "services" | "messages" | "history" | "security";

type Notice = { kind: "ok" | "error"; text: string } | null;

type Message = {
  id: string;
  created_at: string;
  name: string;
  email: string;
  message: string;
  source: string;
  is_read: boolean;
};

function Admin() {
  if (!supabaseConfigured) return <SetupNeeded />;
  return <AdminAuth />;
}

// ---------------------------------------------------------------- auth

// Sign-in screens: normal login, "forgot password", and the "choose a new password"
// screen the reset email links back to.
type AuthView = "login" | "forgot";

// Where the reset email should send you back to. Supabase only honours URLs listed under
// Authentication -> URL Configuration, so keep that list in sync with the sites you use.
const resetRedirect = () => `${window.location.origin}${window.location.pathname}`;

// Long enough that guessing is hopeless, short enough to still be typed by hand.
const MIN_PASSWORD = 12;

function passwordProblem(pw: string, confirm: string): string {
  if (pw.length < MIN_PASSWORD) return `Use at least ${MIN_PASSWORD} characters.`;
  if (pw.toLowerCase().includes("saphin")) return "Don't use your name in the password.";
  if (ADMIN_EMAIL.startsWith(pw.toLowerCase())) return "Don't use your email as the password.";
  if (pw !== confirm) return "The two passwords don't match.";
  return "";
}

// Supabase reports a bad or expired link in the URL fragment rather than as a failed call.
function linkError(): string {
  if (typeof window === "undefined") return "";
  const hash = new URLSearchParams(window.location.hash.replace(/^#/, ""));
  if (!hash.get("error")) return "";
  return hash.get("error_code") === "otp_expired"
    ? "That reset link has expired. Request a new one below."
    : (hash.get("error_description") ?? "That reset link isn't valid any more.").replace(
        /\+/g,
        " ",
      );
}

function AdminAuth() {
  const [session, setSession] = useState<Session | null | undefined>(undefined);
  // True once the browser opens a link from a reset email. The visitor then holds a real
  // session, but has to pick a new password before reaching the dashboard.
  const [recovery, setRecovery] = useState(
    () => typeof window !== "undefined" && window.location.hash.includes("type=recovery"),
  );

  useEffect(() => {
    const supabase = getSupabase();
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data } = supabase.auth.onAuthStateChange((event, s) => {
      if (event === "PASSWORD_RECOVERY") setRecovery(true);
      setSession(s);
    });
    return () => data.subscription.unsubscribe();
  }, []);

  if (session === undefined) return <Shell>Loading…</Shell>;
  if (!session) return <SignedOut />;
  if (session.user.email?.toLowerCase() !== ADMIN_EMAIL) {
    return (
      <Shell>
        <div className={`${card} max-w-md`}>
          <h1 className="text-xl font-bold">This account can't edit the portfolio</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            You're signed in as {session.user.email}. Only the site owner's account can make
            changes.
          </p>
          <button className={`${btnGhost} mt-4`} onClick={() => getSupabase().auth.signOut()}>
            <LogOut /> Sign out
          </button>
        </div>
      </Shell>
    );
  }
  if (recovery) return <ChooseNewPassword onDone={() => setRecovery(false)} />;
  return <Dashboard email={session.user.email ?? ""} />;
}

function SignedOut() {
  const [view, setView] = useState<AuthView>("login");
  // An expired or already-used reset link lands here, so say so instead of silently
  // showing an empty sign-in form.
  const [notice, setNotice] = useState(linkError);

  return view === "login" ? (
    <Login
      notice={notice}
      onForgot={() => {
        setNotice("");
        setView("forgot");
      }}
    />
  ) : (
    <ForgotPassword onBack={() => setView("login")} />
  );
}

function Login({ notice, onForgot }: { notice: string; onForgot: () => void }) {
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setBusy(true);
    setError("");
    const { error } = await getSupabase().auth.signInWithPassword({
      email: String(form.get("email") ?? "").trim(),
      password: String(form.get("password") ?? ""),
    });
    setBusy(false);
    if (error) {
      setError(
        error.message === "Invalid login credentials"
          ? "Wrong email or password."
          : `Couldn't sign in: ${error.message}`,
      );
    }
  }

  return (
    <Shell>
      <form onSubmit={onSubmit} className={`${card} mx-auto mt-10 w-full max-w-sm space-y-4`}>
        <div>
          <h1 className="text-2xl font-bold">Portfolio admin</h1>
          <p className="mt-1 text-sm text-muted-foreground">Sign in to edit your portfolio.</p>
        </div>
        {notice && (
          <p
            role="status"
            className="rounded-lg border border-border bg-muted/40 px-3 py-2 text-sm"
          >
            {notice}
          </p>
        )}
        <label className="block space-y-1.5 text-sm font-medium">
          <span>Email</span>
          <input name="email" type="email" required autoComplete="username" className={inputCls} />
        </label>
        <label className="block space-y-1.5 text-sm font-medium">
          <span>Password</span>
          <input
            name="password"
            type="password"
            required
            autoComplete="current-password"
            className={inputCls}
          />
        </label>
        {error && (
          <p role="alert" className="text-sm text-destructive">
            {error}
          </p>
        )}
        <button type="submit" disabled={busy} className={`${btnPrimary} w-full`}>
          {busy ? "Signing in…" : "Sign in"}
        </button>
        <button
          type="button"
          onClick={onForgot}
          className="text-sm text-muted-foreground underline hover:text-foreground"
        >
          Forgot your password?
        </button>
      </form>
    </Shell>
  );
}

function ForgotPassword({ onBack }: { onBack: () => void }) {
  const [state, setState] = useState<"ask" | "sent">("ask");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const email = String(new FormData(e.currentTarget).get("email") ?? "")
      .trim()
      .toLowerCase();
    setBusy(true);
    setError("");
    // Only the owner's address ever gets an email. Any other address still sees the same
    // confirmation below, so this form can't be used to probe for accounts or to send mail
    // to strangers.
    if (email === ADMIN_EMAIL) {
      const { error } = await getSupabase().auth.resetPasswordForEmail(email, {
        redirectTo: resetRedirect(),
      });
      if (error) {
        setBusy(false);
        setError(
          error.status === 429
            ? "Too many requests. Wait a minute, then try again."
            : `Couldn't send the email: ${error.message}`,
        );
        return;
      }
    }
    setBusy(false);
    setState("sent");
  }

  if (state === "sent") {
    return (
      <Shell>
        <div className={`${card} mx-auto mt-10 w-full max-w-sm`}>
          <h1 className="text-xl font-bold">Check your email</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            If that address belongs to the site owner, a reset link is on its way. It works once and
            expires in an hour — look in spam if it hasn't arrived in a few minutes.
          </p>
          <button className={`${btnGhost} mt-4`} onClick={onBack}>
            Back to sign in
          </button>
        </div>
      </Shell>
    );
  }

  return (
    <Shell>
      <form onSubmit={onSubmit} className={`${card} mx-auto mt-10 w-full max-w-sm space-y-4`}>
        <div>
          <h1 className="text-2xl font-bold">Reset your password</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Enter your admin email and we'll send you a link to choose a new password.
          </p>
        </div>
        <label className="block space-y-1.5 text-sm font-medium">
          <span>Email</span>
          <input
            name="email"
            type="email"
            required
            autoFocus
            autoComplete="username"
            className={inputCls}
          />
        </label>
        {error && (
          <p role="alert" className="text-sm text-destructive">
            {error}
          </p>
        )}
        <button type="submit" disabled={busy} className={`${btnPrimary} w-full`}>
          <Mail /> {busy ? "Sending…" : "Send reset link"}
        </button>
        <button
          type="button"
          onClick={onBack}
          className="text-sm text-muted-foreground underline hover:text-foreground"
        >
          Back to sign in
        </button>
      </form>
    </Shell>
  );
}

// Shown right after a reset link is opened. The session is already valid at this point, so
// the only job left is to set a password and clear the token out of the URL.
function ChooseNewPassword({ onDone }: { onDone: () => void }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const pw = String(form.get("password") ?? "");
    const problem = passwordProblem(pw, String(form.get("confirm") ?? ""));
    if (problem) {
      setError(problem);
      return;
    }

    setBusy(true);
    setError("");
    const { error } = await getSupabase().auth.updateUser({ password: pw });
    setBusy(false);
    if (error) {
      setError(`Couldn't save the new password: ${error.message}`);
      return;
    }
    // Drop the recovery token from the address bar so the link can't be reused or shared.
    window.history.replaceState(null, "", window.location.pathname);
    onDone();
  }

  return (
    <Shell>
      <form onSubmit={onSubmit} className={`${card} mx-auto mt-10 w-full max-w-sm space-y-4`}>
        <div>
          <h1 className="text-2xl font-bold">Choose a new password</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            At least {MIN_PASSWORD} characters. A password manager is the easiest way to keep it.
          </p>
        </div>
        <label className="block space-y-1.5 text-sm font-medium">
          <span>New password</span>
          <input
            name="password"
            type="password"
            required
            autoFocus
            minLength={MIN_PASSWORD}
            autoComplete="new-password"
            className={inputCls}
          />
        </label>
        <label className="block space-y-1.5 text-sm font-medium">
          <span>Repeat new password</span>
          <input
            name="confirm"
            type="password"
            required
            minLength={MIN_PASSWORD}
            autoComplete="new-password"
            className={inputCls}
          />
        </label>
        {error && (
          <p role="alert" className="text-sm text-destructive">
            {error}
          </p>
        )}
        <button type="submit" disabled={busy} className={`${btnPrimary} w-full`}>
          {busy ? "Saving…" : "Save password and continue"}
        </button>
      </form>
    </Shell>
  );
}

// ---------------------------------------------------------------- dashboard

const trim = (s: string) => s.trim();
const trimList = (xs: string[]) => xs.map(trim).filter(Boolean);

// Trim text and drop empty list items and untitled cards before saving.
function cleanPortfolio(c: PortfolioContent): PortfolioContent {
  return {
    ...c,
    badge: trim(c.badge),
    tagline: trim(c.tagline),
    headlineBefore: trim(c.headlineBefore),
    headlineHighlight: trim(c.headlineHighlight),
    headlineAfter: trim(c.headlineAfter),
    intro: trim(c.intro),
    currentRole: trim(c.currentRole),
    aboutHeading: trim(c.aboutHeading),
    aboutParagraphs: trimList(c.aboutParagraphs),
    toolkit: trimList(c.toolkit),
    domain: trimList(c.domain),
    experience: c.experience
      .map((j) => ({
        title: trim(j.title),
        duration: trim(j.duration),
        bullets: trimList(j.bullets),
      }))
      .filter((j) => j.title),
    projects: c.projects
      .map((p) => ({
        ...p,
        title: trim(p.title),
        desc: trim(p.desc),
        impact: trim(p.impact),
        url: trim(p.url),
        tags: trimList(p.tags),
      }))
      .filter((p) => p.title),
  };
}

function cleanServices(s: ServicesContent): ServicesContent {
  return {
    whatsappNumber: normalizeWhatsapp(s.whatsappNumber),
    packages: s.packages
      .map((p) => ({
        ...p,
        name: trim(p.name),
        price: trim(p.price),
        blurb: trim(p.blurb),
        features: trimList(p.features),
      }))
      .filter((p) => p.name),
    faqs: s.faqs.map((f) => ({ q: trim(f.q), a: trim(f.a) })).filter((f) => f.q && f.a),
  };
}

// One editable page's content: what's saved in the database and the unsaved draft.
function useSiteDoc<T>(id: ContentId, normalize: (raw: unknown) => T, defaults: T) {
  const supabase = getSupabase();
  const [saved, setSaved] = useState<T | null>(null);
  const [draft, setDraft] = useState<T | null>(null);
  const [neverSaved, setNeverSaved] = useState(false);
  const [loadError, setLoadError] = useState("");
  // Bumped when the draft is replaced wholesale, so list inputs reset their text.
  const [version, setVersion] = useState(0);

  const load = useCallback(async () => {
    setLoadError("");
    const { data, error } = await supabase
      .from("site_content")
      .select("data")
      .eq("id", id)
      .maybeSingle();
    if (error) {
      setLoadError(`Couldn't load your content: ${error.message}`);
      return;
    }
    const content = data ? normalize(data.data) : defaults;
    setNeverSaved(!data);
    setSaved(content);
    setDraft(content);
    setVersion((v) => v + 1);
  }, [supabase, id, normalize, defaults]);

  useEffect(() => {
    load();
  }, [load]);

  const dirty = useMemo(
    () => !!draft && !!saved && JSON.stringify(draft) !== JSON.stringify(saved),
    [draft, saved],
  );

  // Resolves an error message, or null when saved.
  async function save(clean: (c: T) => T): Promise<string | null> {
    if (!draft) return null;
    const content = clean(draft);
    const { error } = await supabase
      .from("site_content")
      .upsert({ id, data: content, updated_at: new Date().toISOString() });
    if (error) return error.message;
    setSaved(content);
    setDraft(content);
    setVersion((v) => v + 1);
    setNeverSaved(false);
    return null;
  }

  function replace(content: T) {
    setDraft(content);
    setVersion((v) => v + 1);
  }

  const update = (patch: Partial<T>) => setDraft((d) => (d ? { ...d, ...patch } : d));

  return { draft, saved, dirty, neverSaved, loadError, version, load, save, replace, update };
}

function Dashboard({ email }: { email: string }) {
  const supabase = getSupabase();
  const [tab, setTab] = useState<Tab>("intro");
  const portfolio = useSiteDoc("portfolio", normalizeContent, DEFAULT_CONTENT);
  const services = useSiteDoc("services", normalizeServices, DEFAULT_SERVICES);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState<Notice>(null);
  const [unread, setUnread] = useState(0);

  const loadUnread = useCallback(async () => {
    const { count } = await supabase
      .from("contact_messages")
      .select("id", { count: "exact", head: true })
      .eq("is_read", false);
    setUnread(count ?? 0);
  }, [supabase]);

  useEffect(() => {
    loadUnread();
  }, [loadUnread]);

  const dirty = portfolio.dirty || services.dirty;

  // Warn before leaving the page with unsaved edits.
  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  useEffect(() => {
    if (!notice) return;
    const t = setTimeout(() => setNotice(null), 4000);
    return () => clearTimeout(t);
  }, [notice]);

  async function save() {
    setSaving(true);
    const errors = [
      portfolio.dirty ? await portfolio.save(cleanPortfolio) : null,
      services.dirty ? await services.save(cleanServices) : null,
    ].filter(Boolean);
    setSaving(false);
    setNotice(
      errors.length
        ? { kind: "error", text: `Not saved: ${errors.join("; ")}` }
        : { kind: "ok", text: "Saved. Your site shows the changes now." },
    );
  }

  function discard() {
    if (portfolio.dirty && portfolio.saved) portfolio.replace(portfolio.saved);
    if (services.dirty && services.saved) services.replace(services.saved);
  }

  function restore(id: ContentId, raw: unknown) {
    if (id === "services") {
      services.replace(normalizeServices(raw));
      setTab("services");
    } else {
      portfolio.replace(normalizeContent(raw));
      setTab("intro");
    }
    setNotice({ kind: "ok", text: "Old version loaded. Check it, then click Save changes." });
  }

  const tabs: { id: Tab; label: string; badge?: number }[] = [
    { id: "intro", label: "Intro & about" },
    { id: "projects", label: "Projects" },
    { id: "experience", label: "Experience & skills" },
    { id: "services", label: "Services & prices" },
    { id: "messages", label: "Messages", badge: unread },
    { id: "history", label: "History" },
    { id: "security", label: "Security" },
  ];

  // Which page's content the current tab edits (none for Messages and History).
  const doc =
    tab === "services"
      ? services
      : tab === "messages" || tab === "history" || tab === "security"
        ? null
        : portfolio;

  return (
    <Shell wide>
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Portfolio admin</h1>
          <p className="text-sm text-muted-foreground">Signed in as {email}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <a href={SITE_HOME} target="_blank" rel="noopener noreferrer" className={btnGhost}>
            <ExternalLink /> View site
          </a>
          <button className={btnGhost} onClick={() => supabase.auth.signOut()}>
            <LogOut /> Sign out
          </button>
        </div>
      </header>

      <nav className="mt-6 flex flex-wrap gap-1.5" aria-label="Sections">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            aria-current={tab === t.id ? "page" : undefined}
            className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${
              tab === t.id
                ? "bg-slate-900 text-white dark:bg-teal-300 dark:text-slate-950"
                : "border border-border bg-card text-muted-foreground hover:text-foreground"
            }`}
          >
            {t.label}
            {!!t.badge && (
              <span className="ml-1.5 rounded-full bg-teal-600 px-1.5 text-xs text-white">
                {t.badge}
              </span>
            )}
          </button>
        ))}
      </nav>

      {notice && (
        <p
          role="status"
          className={`mt-4 rounded-lg border px-4 py-2 text-sm ${
            notice.kind === "ok"
              ? "border-teal-500/40 bg-teal-500/10"
              : "border-destructive/40 bg-destructive/10 text-destructive"
          }`}
        >
          {notice.text}
        </p>
      )}
      {doc?.loadError && (
        <p role="alert" className="mt-4 text-sm text-destructive">
          {doc.loadError}{" "}
          <button className="underline" onClick={doc.load}>
            Try again
          </button>
        </p>
      )}
      {doc?.neverSaved && doc.draft && (
        <p className="mt-4 rounded-lg border border-border bg-muted/40 px-4 py-2 text-sm text-muted-foreground">
          Showing the text that's built into your site. Your first save stores it in the database.
        </p>
      )}

      <div className="mt-6 pb-28">
        {tab === "messages" ? (
          <Messages onUnreadChange={loadUnread} />
        ) : tab === "security" ? (
          <SecurityTab email={email} />
        ) : tab === "history" ? (
          <HistoryList onRestore={restore} />
        ) : !doc?.draft ? (
          !doc?.loadError && <p className="text-muted-foreground">Loading your content…</p>
        ) : tab === "services" ? (
          services.draft && (
            <ServicesEditor key={services.version} s={services.draft} update={services.update} />
          )
        ) : !portfolio.draft ? null : tab === "intro" ? (
          <IntroEditor key={portfolio.version} c={portfolio.draft} update={portfolio.update} />
        ) : tab === "projects" ? (
          <ProjectsEditor
            key={portfolio.version}
            projects={portfolio.draft.projects}
            set={(projects) => portfolio.update({ projects })}
          />
        ) : (
          <ExperienceEditor key={portfolio.version} c={portfolio.draft} update={portfolio.update} />
        )}
      </div>

      {dirty && (
        <div className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background/95 backdrop-blur">
          <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-between gap-3 px-4 py-3">
            <p className="text-sm font-medium">
              You have unsaved changes
              {portfolio.dirty && services.dirty
                ? " to your portfolio and services."
                : services.dirty
                  ? " to your services page."
                  : " to your portfolio."}
            </p>
            <div className="flex gap-2">
              <button className={btnGhost} onClick={discard} disabled={saving}>
                Discard
              </button>
              <button className={btnPrimary} onClick={save} disabled={saving}>
                {saving ? "Saving…" : "Save changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </Shell>
  );
}

// ---------------------------------------------------------------- editors

function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <label className="block space-y-1.5">
      <span className="text-sm font-semibold">{label}</span>
      {children}
      {hint && <span className="block text-xs text-muted-foreground">{hint}</span>}
    </label>
  );
}

// A textarea that edits a list of strings. Keeps the raw text while typing so empty lines
// and half-typed items don't jump around; `split` decides what separates items.
function ListInput({
  value,
  onChange,
  split,
  join,
  rows = 4,
  placeholder,
}: {
  value: string[];
  onChange: (v: string[]) => void;
  split: RegExp;
  join: string;
  rows?: number;
  placeholder?: string;
}) {
  const [text, setText] = useState(() => value.join(join));
  const Tag = rows === 1 ? "input" : "textarea";
  return (
    <Tag
      className={`${inputCls} ${rows > 1 ? "resize-y leading-relaxed" : ""}`}
      rows={rows > 1 ? rows : undefined}
      value={text}
      placeholder={placeholder}
      onChange={(e: { target: { value: string } }) => {
        setText(e.target.value);
        onChange(
          e.target.value
            .split(split)
            .map((s) => s.trim())
            .filter(Boolean),
        );
      }}
    />
  );
}

function IntroEditor({
  c,
  update,
}: {
  c: PortfolioContent;
  update: (p: Partial<PortfolioContent>) => void;
}) {
  return (
    <div className="grid gap-6">
      <section className={`${card} grid gap-4`}>
        <h2 className="text-lg font-bold">Top of the page</h2>
        <Field label="Badge" hint="The small green pill above your name.">
          <input
            className={inputCls}
            value={c.badge}
            onChange={(e) => update({ badge: e.target.value })}
          />
        </Field>
        <Field label="Name line" hint="Small text above the big headline.">
          <input
            className={inputCls}
            value={c.tagline}
            onChange={(e) => update({ tagline: e.target.value })}
          />
        </Field>
        <div>
          <span className="text-sm font-semibold">Headline</span>
          <div className="mt-1.5 grid gap-2 sm:grid-cols-3">
            <input
              aria-label="Headline start"
              className={inputCls}
              value={c.headlineBefore}
              onChange={(e) => update({ headlineBefore: e.target.value })}
            />
            <input
              aria-label="Highlighted word"
              className={`${inputCls} font-semibold text-teal-700 dark:text-teal-300`}
              value={c.headlineHighlight}
              onChange={(e) => update({ headlineHighlight: e.target.value })}
            />
            <input
              aria-label="Headline end"
              className={inputCls}
              value={c.headlineAfter}
              onChange={(e) => update({ headlineAfter: e.target.value })}
            />
          </div>
          <p className="mt-1.5 text-xs text-muted-foreground">
            Start · <span className="text-teal-700 dark:text-teal-300">highlighted word</span> ·
            end. Shows as: “{c.headlineBefore} <em>{c.headlineHighlight}</em> {c.headlineAfter}”
          </p>
        </div>
        <Field label="Intro">
          <textarea
            className={`${inputCls} resize-y`}
            rows={3}
            value={c.intro}
            onChange={(e) => update({ intro: e.target.value })}
          />
        </Field>
        <Field label="“Currently” card" hint="The small card on your photo.">
          <input
            className={inputCls}
            value={c.currentRole}
            onChange={(e) => update({ currentRole: e.target.value })}
          />
        </Field>
      </section>

      <PhotoEditor photoUrl={c.photoUrl} set={(photoUrl) => update({ photoUrl })} />
      <ResumeEditor resumeUrl={c.resumeUrl} set={(resumeUrl) => update({ resumeUrl })} />

      <section className={`${card} grid gap-4`}>
        <h2 className="text-lg font-bold">About</h2>
        <Field label="Heading">
          <input
            className={inputCls}
            value={c.aboutHeading}
            onChange={(e) => update({ aboutHeading: e.target.value })}
          />
        </Field>
        <Field label="Paragraphs" hint="Leave an empty line between paragraphs.">
          <ListInput
            value={c.aboutParagraphs}
            onChange={(aboutParagraphs) => update({ aboutParagraphs })}
            split={/\n\s*\n/}
            join={"\n\n"}
            rows={8}
          />
        </Field>
      </section>
    </div>
  );
}

// Shrinks a photo in the browser before upload (max 1000px, WebP) so the page stays fast.
async function shrinkImage(file: File): Promise<Blob> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, 1000 / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext("2d")!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, "image/webp", 0.85),
  );
  if (blob && blob.type === "image/webp") return blob;
  // Browsers without WebP encoding fall back to JPEG.
  return new Promise((resolve, reject) =>
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error("Couldn't read that image."))),
      "image/jpeg",
      0.85,
    ),
  );
}

function PhotoEditor({ photoUrl, set }: { photoUrl: string; set: (url: string) => void }) {
  const [status, setStatus] = useState<{ kind: "busy" | "error"; text: string } | null>(null);

  async function onFile(file: File | undefined) {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setStatus({ kind: "error", text: "Pick a photo (JPG, PNG or WebP)." });
      return;
    }
    setStatus({ kind: "busy", text: "Uploading…" });
    try {
      const blob = await shrinkImage(file);
      const ext = blob.type === "image/webp" ? "webp" : "jpg";
      const path = `portrait-${Date.now()}.${ext}`;
      const supabase = getSupabase();
      const { error } = await supabase.storage
        .from("portfolio")
        .upload(path, blob, { contentType: blob.type, cacheControl: "31536000" });
      if (error) throw error;
      set(supabase.storage.from("portfolio").getPublicUrl(path).data.publicUrl);
      setStatus(null);
    } catch (err) {
      setStatus({
        kind: "error",
        text: `Upload failed: ${err instanceof Error ? err.message : "please try again."}`,
      });
    }
  }

  return (
    <section className={`${card} grid gap-4`}>
      <h2 className="text-lg font-bold">Your photo</h2>
      <div className="flex flex-wrap items-start gap-5">
        <img
          src={photoUrl}
          alt="Current portfolio photo"
          className="aspect-[4/5] w-32 rounded-2xl border border-border object-cover"
        />
        <div className="grid max-w-sm gap-2 text-sm">
          <p className="text-muted-foreground">
            Shown in a tall frame (4:5), cropped from the middle. A portrait photo with your face
            near the centre looks best.
          </p>
          <label className={`${btnGhost} cursor-pointer justify-self-start`}>
            {status?.kind === "busy" ? status.text : "Upload new photo"}
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="sr-only"
              disabled={status?.kind === "busy"}
              onChange={(e) => {
                onFile(e.target.files?.[0]);
                e.target.value = "";
              }}
            />
          </label>
          {photoUrl !== DEFAULT_CONTENT.photoUrl && (
            <button
              type="button"
              className="justify-self-start text-xs text-muted-foreground underline"
              onClick={() => set(DEFAULT_CONTENT.photoUrl)}
            >
              Use the original photo
            </button>
          )}
          {status?.kind === "error" && (
            <p role="alert" className="text-destructive">
              {status.text}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

function ResumeEditor({ resumeUrl, set }: { resumeUrl: string; set: (url: string) => void }) {
  const [status, setStatus] = useState<{ kind: "busy" | "error"; text: string } | null>(null);

  async function onFile(file: File | undefined) {
    if (!file) return;
    if (file.type !== "application/pdf") {
      setStatus({ kind: "error", text: "Pick a PDF file." });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setStatus({
        kind: "error",
        text: "That PDF is over 5 MB. Export a smaller one and try again.",
      });
      return;
    }
    setStatus({ kind: "busy", text: "Uploading…" });
    try {
      const path = `resume-${Date.now()}.pdf`;
      const supabase = getSupabase();
      const { error } = await supabase.storage
        .from("portfolio")
        .upload(path, file, { contentType: "application/pdf", cacheControl: "31536000" });
      if (error) throw error;
      // download= makes the browser save it as Saphin_Praja_Resume.pdf.
      set(
        supabase.storage
          .from("portfolio")
          .getPublicUrl(path, { download: "Saphin_Praja_Resume.pdf" }).data.publicUrl,
      );
      setStatus(null);
    } catch (err) {
      setStatus({
        kind: "error",
        text: `Upload failed: ${err instanceof Error ? err.message : "please try again."}`,
      });
    }
  }

  const isOriginal = resumeUrl === DEFAULT_CONTENT.resumeUrl;
  return (
    <section className={`${card} grid gap-3`}>
      <h2 className="text-lg font-bold">Resume</h2>
      <p className="text-sm text-muted-foreground">
        The file people get from the “Resume” button.{" "}
        {isOriginal
          ? "Currently the original resume built into the site."
          : "Currently a resume you uploaded."}{" "}
        <a href={resumeUrl} target="_blank" rel="noopener noreferrer" className="underline">
          Open it
        </a>
      </p>
      <div className="flex flex-wrap items-center gap-3">
        <label className={`${btnGhost} cursor-pointer`}>
          {status?.kind === "busy" ? status.text : "Upload new resume (PDF)"}
          <input
            type="file"
            accept="application/pdf"
            className="sr-only"
            disabled={status?.kind === "busy"}
            onChange={(e) => {
              onFile(e.target.files?.[0]);
              e.target.value = "";
            }}
          />
        </label>
        {!isOriginal && (
          <button
            type="button"
            className="text-xs text-muted-foreground underline"
            onClick={() => set(DEFAULT_CONTENT.resumeUrl)}
          >
            Use the original resume
          </button>
        )}
      </div>
      {status?.kind === "error" && (
        <p role="alert" className="text-sm text-destructive">
          {status.text}
        </p>
      )}
    </section>
  );
}

// Move, remove and confirm-remove controls shared by project and job cards.
function CardControls({
  index,
  count,
  move,
  remove,
}: {
  index: number;
  count: number;
  move: (from: number, to: number) => void;
  remove: () => void;
}) {
  const [armed, setArmed] = useState(false);
  useEffect(() => {
    if (!armed) return;
    const t = setTimeout(() => setArmed(false), 3000);
    return () => clearTimeout(t);
  }, [armed]);
  return (
    <div className="flex gap-1.5">
      <button
        className={btnGhost}
        onClick={() => move(index, index - 1)}
        disabled={index === 0}
        aria-label="Move up"
      >
        <ArrowUp />
      </button>
      <button
        className={btnGhost}
        onClick={() => move(index, index + 1)}
        disabled={index === count - 1}
        aria-label="Move down"
      >
        <ArrowDown />
      </button>
      <button
        className={`${btn} ${armed ? "bg-destructive text-white" : "border border-border text-destructive"}`}
        onClick={() => (armed ? remove() : setArmed(true))}
      >
        <Trash2 /> {armed ? "Click again to remove" : "Remove"}
      </button>
    </div>
  );
}

function moveItem<T>(list: T[], from: number, to: number): T[] {
  if (to < 0 || to >= list.length) return list;
  const next = [...list];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
}

function ProjectsEditor({ projects, set }: { projects: Project[]; set: (p: Project[]) => void }) {
  // Stable keys so moving cards doesn't mix up their typed text.
  const [keys, setKeys] = useState(() => projects.map((_, i) => i));
  const [nextKey, setNextKey] = useState(projects.length);
  const edit = (i: number, patch: Partial<Project>) =>
    set(projects.map((p, j) => (j === i ? { ...p, ...patch } : p)));
  const move = (from: number, to: number) => {
    set(moveItem(projects, from, to));
    setKeys((k) => moveItem(k, from, to));
  };

  return (
    <div className="grid gap-5">
      <p className="text-sm text-muted-foreground">
        Shown in this order on your site. Cards without a title aren't saved.
      </p>
      {projects.map((p, i) => (
        <section key={keys[i]} className={`${card} grid gap-4`}>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="font-bold">
              {i + 1}. {p.title || "New project"}
            </h2>
            <CardControls
              index={i}
              count={projects.length}
              move={move}
              remove={() => {
                set(projects.filter((_, j) => j !== i));
                setKeys((k) => k.filter((_, j) => j !== i));
              }}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Title">
              <input
                className={inputCls}
                value={p.title}
                onChange={(e) => edit(i, { title: e.target.value })}
              />
            </Field>
            <Field
              label="Link"
              hint={
                p.url && !/^https?:\/\//.test(p.url)
                  ? "Links should start with https://"
                  : undefined
              }
            >
              <input
                className={inputCls}
                value={p.url}
                placeholder="https://github.com/…"
                onChange={(e) => edit(i, { url: e.target.value })}
              />
            </Field>
          </div>
          <Field label="Description">
            <textarea
              className={`${inputCls} resize-y`}
              rows={3}
              value={p.desc}
              onChange={(e) => edit(i, { desc: e.target.value })}
            />
          </Field>
          <div className="grid gap-4 sm:grid-cols-[2fr_1fr]">
            <Field label="Result" hint="The highlighted line, e.g. “Saves 45 minutes a day”.">
              <input
                className={inputCls}
                value={p.impact}
                onChange={(e) => edit(i, { impact: e.target.value })}
              />
            </Field>
            <Field label="Picture">
              <select
                className={inputCls}
                value={p.visual}
                onChange={(e) => edit(i, { visual: e.target.value as Project["visual"] })}
              >
                {VISUALS.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.label}
                  </option>
                ))}
              </select>
            </Field>
          </div>
          <Field label="Tags" hint="Separate with commas.">
            <ListInput
              value={p.tags}
              onChange={(tags) => edit(i, { tags })}
              split={/,/}
              join=", "
              rows={1}
            />
          </Field>
        </section>
      ))}
      <button
        className={`${btnGhost} justify-self-start`}
        onClick={() => {
          set([
            ...projects,
            { title: "", desc: "", impact: "", tags: [], url: "", visual: "bars" },
          ]);
          setKeys((k) => [...k, nextKey]);
          setNextKey((n) => n + 1);
        }}
      >
        <Plus /> Add project
      </button>
    </div>
  );
}

function ExperienceEditor({
  c,
  update,
}: {
  c: PortfolioContent;
  update: (p: Partial<PortfolioContent>) => void;
}) {
  const jobs = c.experience;
  const [keys, setKeys] = useState(() => jobs.map((_, i) => i));
  const [nextKey, setNextKey] = useState(jobs.length);
  const set = (experience: Job[]) => update({ experience });
  const edit = (i: number, patch: Partial<Job>) =>
    set(jobs.map((j, k) => (k === i ? { ...j, ...patch } : j)));

  return (
    <div className="grid gap-5">
      <h2 className="text-lg font-bold">Experience</h2>
      {jobs.map((job, i) => (
        <section key={keys[i]} className={`${card} grid gap-4`}>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="font-bold">{job.title || "New job"}</h3>
            <CardControls
              index={i}
              count={jobs.length}
              move={(from, to) => {
                set(moveItem(jobs, from, to));
                setKeys((k) => moveItem(k, from, to));
              }}
              remove={() => {
                set(jobs.filter((_, k) => k !== i));
                setKeys((k) => k.filter((_, j) => j !== i));
              }}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-[2fr_1fr]">
            <Field label="Company · role">
              <input
                className={inputCls}
                value={job.title}
                onChange={(e) => edit(i, { title: e.target.value })}
              />
            </Field>
            <Field label="Dates">
              <input
                className={inputCls}
                value={job.duration}
                placeholder="Feb 2026 – Present"
                onChange={(e) => edit(i, { duration: e.target.value })}
              />
            </Field>
          </div>
          <Field label="What you did" hint="One point per line.">
            <ListInput
              value={job.bullets}
              onChange={(bullets) => edit(i, { bullets })}
              split={/\n/}
              join={"\n"}
              rows={5}
            />
          </Field>
        </section>
      ))}
      <button
        className={`${btnGhost} justify-self-start`}
        onClick={() => {
          set([{ title: "", duration: "", bullets: [] }, ...jobs]);
          setKeys((k) => [nextKey, ...k]);
          setNextKey((n) => n + 1);
        }}
      >
        <Plus /> Add job at the top
      </button>

      <section className={`${card} mt-4 grid gap-4`}>
        <h2 className="text-lg font-bold">Toolkit</h2>
        <Field label="Tools" hint="Separate with commas.">
          <ListInput
            value={c.toolkit}
            onChange={(toolkit) => update({ toolkit })}
            split={/,/}
            join=", "
            rows={3}
          />
        </Field>
        <Field label="Domain" hint="Separate with commas.">
          <ListInput
            value={c.domain}
            onChange={(domain) => update({ domain })}
            split={/,/}
            join=", "
            rows={2}
          />
        </Field>
      </section>
    </div>
  );
}

// ---------------------------------------------------------------- services

// Stable React keys for a reorderable list, so moving cards doesn't mix up their typed text.
function useListKeys(length: number) {
  const [keys, setKeys] = useState(() => Array.from({ length }, (_, i) => i));
  const [next, setNext] = useState(length);
  return {
    keys,
    move: (from: number, to: number) => setKeys((k) => moveItem(k, from, to)),
    remove: (i: number) => setKeys((k) => k.filter((_, j) => j !== i)),
    add: () => {
      setKeys((k) => [...k, next]);
      setNext((n) => n + 1);
    },
  };
}

function ServicesEditor({
  s,
  update,
}: {
  s: ServicesContent;
  update: (p: Partial<ServicesContent>) => void;
}) {
  const pkgKeys = useListKeys(s.packages.length);
  const faqKeys = useListKeys(s.faqs.length);
  const setPackages = (packages: Package[]) => update({ packages });
  const setFaqs = (faqs: Faq[]) => update({ faqs });
  const editPkg = (i: number, patch: Partial<Package>) =>
    setPackages(s.packages.map((p, j) => (j === i ? { ...p, ...patch } : p)));
  const editFaq = (i: number, patch: Partial<Faq>) =>
    setFaqs(s.faqs.map((f, j) => (j === i ? { ...f, ...patch } : f)));
  const whatsapp = normalizeWhatsapp(s.whatsappNumber);

  return (
    <div className="grid gap-6">
      <section className={`${card} grid gap-4`}>
        <h2 className="text-lg font-bold">WhatsApp</h2>
        <Field
          label="WhatsApp number"
          hint={
            whatsapp.length >= 12
              ? `Every WhatsApp button on the services page opens a chat with ${formatWhatsapp(whatsapp)}.`
              : "Type your 10-digit mobile number, e.g. 9821858674."
          }
        >
          <input
            className={`${inputCls} font-mono`}
            inputMode="tel"
            value={s.whatsappNumber}
            onChange={(e) => update({ whatsappNumber: e.target.value })}
          />
        </Field>
      </section>

      <h2 className="text-lg font-bold">Packages</h2>
      <p className="-mt-4 text-sm text-muted-foreground">
        Shown side by side on the services page, in this order. The chat assistant quotes these
        prices too.
      </p>
      {s.packages.map((p, i) => (
        <section key={pkgKeys.keys[i]} className={`${card} grid gap-4`}>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="font-bold">
              {p.name || "New package"}
              {p.featured && (
                <span className="ml-2 rounded-full bg-teal-600 px-2 py-0.5 text-xs text-white">
                  Most popular
                </span>
              )}
            </h3>
            <CardControls
              index={i}
              count={s.packages.length}
              move={(from, to) => {
                setPackages(moveItem(s.packages, from, to));
                pkgKeys.move(from, to);
              }}
              remove={() => {
                setPackages(s.packages.filter((_, j) => j !== i));
                pkgKeys.remove(i);
              }}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Name">
              <input
                className={inputCls}
                value={p.name}
                onChange={(e) => editPkg(i, { name: e.target.value })}
              />
            </Field>
            <Field label="Price" hint="Shown after “from”, e.g. Rs 12,000.">
              <input
                className={inputCls}
                value={p.price}
                onChange={(e) => editPkg(i, { price: e.target.value })}
              />
            </Field>
          </div>
          <Field label="Who it's for">
            <input
              className={inputCls}
              value={p.blurb}
              onChange={(e) => editPkg(i, { blurb: e.target.value })}
            />
          </Field>
          <Field label="What's included" hint="One item per line.">
            <ListInput
              value={p.features}
              onChange={(features) => editPkg(i, { features })}
              split={/\n/}
              join={"\n"}
              rows={5}
            />
          </Field>
          <label className="flex items-center gap-2 text-sm font-medium">
            <input
              type="checkbox"
              checked={p.featured}
              onChange={(e) =>
                // Only one package carries the "Most popular" badge.
                setPackages(
                  s.packages.map((x, j) => ({
                    ...x,
                    featured: j === i ? e.target.checked : false,
                  })),
                )
              }
            />
            Mark as “Most popular”
          </label>
        </section>
      ))}
      <button
        className={`${btnGhost} justify-self-start`}
        onClick={() => {
          setPackages([
            ...s.packages,
            { name: "", price: "", blurb: "", features: [], featured: false },
          ]);
          pkgKeys.add();
        }}
      >
        <Plus /> Add package
      </button>

      <h2 className="mt-4 text-lg font-bold">Common questions</h2>
      {s.faqs.map((f, i) => (
        <section key={faqKeys.keys[i]} className={`${card} grid gap-4`}>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="font-bold">{f.q || "New question"}</h3>
            <CardControls
              index={i}
              count={s.faqs.length}
              move={(from, to) => {
                setFaqs(moveItem(s.faqs, from, to));
                faqKeys.move(from, to);
              }}
              remove={() => {
                setFaqs(s.faqs.filter((_, j) => j !== i));
                faqKeys.remove(i);
              }}
            />
          </div>
          <Field label="Question">
            <input
              className={inputCls}
              value={f.q}
              onChange={(e) => editFaq(i, { q: e.target.value })}
            />
          </Field>
          <Field label="Answer">
            <textarea
              className={`${inputCls} resize-y`}
              rows={3}
              value={f.a}
              onChange={(e) => editFaq(i, { a: e.target.value })}
            />
          </Field>
        </section>
      ))}
      <button
        className={`${btnGhost} justify-self-start`}
        onClick={() => {
          setFaqs([...s.faqs, { q: "", a: "" }]);
          faqKeys.add();
        }}
      >
        <Plus /> Add question
      </button>
    </div>
  );
}

// ---------------------------------------------------------------- messages

function Messages({ onUnreadChange }: { onUnreadChange: () => void }) {
  const supabase = getSupabase();
  const [messages, setMessages] = useState<Message[] | null>(null);
  const [error, setError] = useState("");
  const [open, setOpen] = useState<string | null>(null);
  const [armed, setArmed] = useState<string | null>(null);

  const load = useCallback(async () => {
    const { data, error } = await supabase
      .from("contact_messages")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(200);
    if (error) setError(`Couldn't load messages: ${error.message}`);
    else setMessages(data as Message[]);
  }, [supabase]);

  useEffect(() => {
    load();
  }, [load]);

  async function toggle(m: Message) {
    setOpen(open === m.id ? null : m.id);
    if (!m.is_read) {
      setMessages((ms) => ms?.map((x) => (x.id === m.id ? { ...x, is_read: true } : x)) ?? ms);
      await supabase.from("contact_messages").update({ is_read: true }).eq("id", m.id);
      onUnreadChange();
    }
  }

  async function remove(id: string) {
    if (armed !== id) {
      setArmed(id);
      setTimeout(() => setArmed((a) => (a === id ? null : a)), 3000);
      return;
    }
    const { error } = await supabase.from("contact_messages").delete().eq("id", id);
    if (error) {
      setError(`Couldn't delete: ${error.message}`);
      return;
    }
    setMessages((ms) => ms?.filter((m) => m.id !== id) ?? ms);
    onUnreadChange();
  }

  if (error) return <p className="text-sm text-destructive">{error}</p>;
  if (!messages) return <p className="text-muted-foreground">Loading messages…</p>;
  if (!messages.length) {
    return (
      <div className={`${card} text-center text-muted-foreground`}>
        <Inbox className="mx-auto h-8 w-8" />
        <p className="mt-2">
          No messages yet. New contact and quote form messages will show up here.
        </p>
      </div>
    );
  }

  return (
    <ul className="grid gap-2">
      {messages.map((m) => (
        <li key={m.id} className={`${card} p-0`}>
          <button
            className="flex w-full flex-wrap items-center justify-between gap-2 px-5 py-4 text-left"
            onClick={() => toggle(m)}
            aria-expanded={open === m.id}
          >
            <span className="flex min-w-0 items-center gap-2">
              {!m.is_read && (
                <span className="h-2 w-2 shrink-0 rounded-full bg-teal-500" aria-label="Unread" />
              )}
              <span className={`truncate ${m.is_read ? "" : "font-bold"}`}>{m.name}</span>
              <span className="rounded-md border border-border px-1.5 text-xs text-muted-foreground">
                {m.source === "services" ? "Website quote" : "Portfolio"}
              </span>
            </span>
            <span className="text-xs text-muted-foreground">
              {new Date(m.created_at).toLocaleString("en-GB", {
                day: "numeric",
                month: "short",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </button>
          {open === m.id && (
            <div className="border-t border-border px-5 py-4">
              <p className="text-sm text-muted-foreground">{m.email}</p>
              <p className="mt-3 whitespace-pre-wrap break-words">{m.message}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <a
                  className={btnPrimary}
                  href={`mailto:${m.email}?subject=${encodeURIComponent("Re: your message")}`}
                >
                  <Mail /> Reply by email
                </a>
                <button
                  className={`${btn} ${armed === m.id ? "bg-destructive text-white" : "border border-border text-destructive"}`}
                  onClick={() => remove(m.id)}
                >
                  <Trash2 /> {armed === m.id ? "Click again to delete" : "Delete"}
                </button>
              </div>
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}

// ---------------------------------------------------------------- history

function HistoryList({ onRestore }: { onRestore: (id: ContentId, data: unknown) => void }) {
  const supabase = getSupabase();
  const [page, setPage] = useState<ContentId>("portfolio");
  const [rows, setRows] = useState<{ id: number; saved_at: string; data: unknown }[] | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    setRows(null);
    setError("");
    supabase
      .from("site_content_history")
      .select("id, saved_at, data")
      .eq("content_id", page)
      .order("id", { ascending: false })
      .limit(30)
      .then(({ data, error }) => {
        if (error) setError(`Couldn't load history: ${error.message}`);
        else setRows(data);
      });
  }, [supabase, page]);

  const picker = (
    <div className="mb-4 flex gap-1.5" role="group" aria-label="Which page">
      {(
        [
          ["portfolio", "Portfolio"],
          ["services", "Services & prices"],
        ] as const
      ).map(([id, label]) => (
        <button
          key={id}
          onClick={() => setPage(id)}
          aria-pressed={page === id}
          className={`rounded-lg px-3 py-1.5 text-sm font-semibold ${
            page === id ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );

  if (error) return <p className="text-sm text-destructive">{error}</p>;
  if (!rows)
    return (
      <>
        {picker}
        <p className="text-muted-foreground">Loading history…</p>
      </>
    );
  if (!rows.length) {
    return (
      <div className={`${card} text-center text-muted-foreground`}>
        {picker}
        <History className="mx-auto h-8 w-8" />
        <p className="mt-2">
          No earlier versions yet. Each time you save, the previous version is kept here.
        </p>
      </div>
    );
  }
  return (
    <div className="grid gap-2">
      {picker}
      <p className="text-sm text-muted-foreground">
        Your last {rows.length} saved versions. Restoring loads one into the editor; nothing changes
        on your site until you click Save changes.
      </p>
      {rows.map((r) => (
        <div
          key={r.id}
          className={`${card} flex flex-wrap items-center justify-between gap-2 py-3`}
        >
          <span>
            Version from{" "}
            {new Date(r.saved_at).toLocaleString("en-GB", {
              day: "numeric",
              month: "short",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
          <button className={btnGhost} onClick={() => onRestore(page, r.data)}>
            <RotateCcw /> Restore
          </button>
        </div>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------- layout

function Shell({ children, wide }: { children: ReactNode; wide?: boolean }) {
  return (
    <div className="min-h-screen bg-[#f8fafc] text-foreground dark:bg-[#070b12]">
      <div className={`mx-auto px-4 py-8 ${wide ? "max-w-4xl" : "max-w-xl"}`}>
        <a href={SITE_HOME} className="text-sm font-bold">
          Saphin<span className="text-teal-600 dark:text-teal-300">.</span>
        </a>
        <div className="mt-6">{children}</div>
      </div>
    </div>
  );
}

function SetupNeeded() {
  return (
    <Shell>
      <div className={card}>
        <h1 className="text-xl font-bold">Admin isn't connected yet</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Add your Supabase project URL and anon key in <code>src/lib/supabase.ts</code>, and run{" "}
          <code>docs/admin-setup.sql</code> in Supabase. Until then, your portfolio uses its
          built-in text.
        </p>
      </div>
    </Shell>
  );
}

// ---------------------------------------------------------------- security

// Change the admin password, and drop every signed-in device. Useful after logging in on
// a borrowed laptop, or any time the password might have been seen.
function SecurityTab({ email }: { email: string }) {
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<Notice>(null);
  const [signingOutAll, setSigningOutAll] = useState(false);

  async function changePassword(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formEl = e.currentTarget;
    const form = new FormData(formEl);
    const current = String(form.get("current") ?? "");
    const pw = String(form.get("password") ?? "");
    const problem = passwordProblem(pw, String(form.get("confirm") ?? ""));
    if (problem) {
      setNotice({ kind: "error", text: problem });
      return;
    }
    if (pw === current) {
      setNotice({ kind: "error", text: "That's the password you already have." });
      return;
    }

    setBusy(true);
    setNotice(null);
    const supabase = getSupabase();
    // Prove the person at the keyboard knows the current password, so an unattended open
    // tab can't be used to take the account over.
    const { error: reauth } = await supabase.auth.signInWithPassword({
      email,
      password: current,
    });
    if (reauth) {
      setBusy(false);
      setNotice({ kind: "error", text: "Your current password isn't right." });
      return;
    }
    const { error } = await supabase.auth.updateUser({ password: pw });
    setBusy(false);
    if (error) {
      setNotice({ kind: "error", text: `Couldn't change it: ${error.message}` });
      return;
    }
    formEl.reset();
    setNotice({ kind: "ok", text: "Password changed. Save the new one in your password manager." });
  }

  async function signOutEverywhere() {
    setSigningOutAll(true);
    // Ends this session too, which is the point: every device starts again from the
    // sign-in screen.
    const { error } = await getSupabase().auth.signOut({ scope: "global" });
    if (error) {
      setSigningOutAll(false);
      setNotice({ kind: "error", text: `Couldn't sign out everywhere: ${error.message}` });
    }
  }

  return (
    <div className="space-y-5">
      {notice && (
        <p
          role="status"
          className={`rounded-lg border px-4 py-2 text-sm ${
            notice.kind === "ok"
              ? "border-teal-500/40 bg-teal-500/10"
              : "border-destructive/40 bg-destructive/10 text-destructive"
          }`}
        >
          {notice.text}
        </p>
      )}

      <form onSubmit={changePassword} className={`${card} max-w-md space-y-4`}>
        <div>
          <h2 className="flex items-center gap-2 text-lg font-bold">
            <KeyRound className="h-4 w-4" /> Change your password
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            At least {MIN_PASSWORD} characters. You'll need your current one to confirm it's you.
          </p>
        </div>
        <label className="block space-y-1.5 text-sm font-medium">
          <span>Current password</span>
          <input
            name="current"
            type="password"
            required
            autoComplete="current-password"
            className={inputCls}
          />
        </label>
        <label className="block space-y-1.5 text-sm font-medium">
          <span>New password</span>
          <input
            name="password"
            type="password"
            required
            minLength={MIN_PASSWORD}
            autoComplete="new-password"
            className={inputCls}
          />
        </label>
        <label className="block space-y-1.5 text-sm font-medium">
          <span>Repeat new password</span>
          <input
            name="confirm"
            type="password"
            required
            minLength={MIN_PASSWORD}
            autoComplete="new-password"
            className={inputCls}
          />
        </label>
        <button type="submit" disabled={busy} className={btnPrimary}>
          {busy ? "Changing…" : "Change password"}
        </button>
      </form>

      <div className={`${card} max-w-md`}>
        <h2 className="flex items-center gap-2 text-lg font-bold">
          <ShieldCheck className="h-4 w-4" /> Signed-in devices
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Signs you out of this admin page on every phone, laptop and browser. Do this if you signed
          in somewhere you don't control.
        </p>
        <button className={`${btnGhost} mt-4`} disabled={signingOutAll} onClick={signOutEverywhere}>
          <LogOut /> {signingOutAll ? "Signing out…" : "Sign out everywhere"}
        </button>
      </div>

      <div className={`${card} max-w-md`}>
        <h2 className="text-lg font-bold">Locked out?</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Only <strong>{ADMIN_EMAIL}</strong> can edit this site, and reset links go to that inbox
          alone. If you ever lose the inbox too, set a new password straight from your Supabase
          project under Authentication → Users.
        </p>
      </div>
    </div>
  );
}
