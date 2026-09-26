import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useState, type FormEvent, type ReactNode } from "react";
import type { Session } from "@supabase/supabase-js";
import {
  ArrowDown,
  ArrowUp,
  ExternalLink,
  History,
  Inbox,
  LogOut,
  Mail,
  Plus,
  RotateCcw,
  Trash2,
} from "lucide-react";
import { getSupabase, supabaseConfigured } from "@/lib/supabase";
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

type Tab = "intro" | "projects" | "experience" | "messages" | "history";

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

function AdminAuth() {
  const [session, setSession] = useState<Session | null | undefined>(undefined);

  useEffect(() => {
    const supabase = getSupabase();
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data } = supabase.auth.onAuthStateChange((_event, s) => setSession(s));
    return () => data.subscription.unsubscribe();
  }, []);

  if (session === undefined) return <Shell>Loading…</Shell>;
  if (!session) return <Login />;
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
  return <Dashboard email={session.user.email ?? ""} />;
}

function Login() {
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
      </form>
    </Shell>
  );
}

// ---------------------------------------------------------------- dashboard

// Trim text and drop empty list items and untitled cards before saving.
function clean(c: PortfolioContent): PortfolioContent {
  const t = (s: string) => s.trim();
  const list = (xs: string[]) => xs.map(t).filter(Boolean);
  return {
    ...c,
    badge: t(c.badge),
    tagline: t(c.tagline),
    headlineBefore: t(c.headlineBefore),
    headlineHighlight: t(c.headlineHighlight),
    headlineAfter: t(c.headlineAfter),
    intro: t(c.intro),
    currentRole: t(c.currentRole),
    aboutHeading: t(c.aboutHeading),
    aboutParagraphs: list(c.aboutParagraphs),
    toolkit: list(c.toolkit),
    domain: list(c.domain),
    experience: c.experience
      .map((j) => ({ title: t(j.title), duration: t(j.duration), bullets: list(j.bullets) }))
      .filter((j) => j.title),
    projects: c.projects
      .map((p) => ({
        ...p,
        title: t(p.title),
        desc: t(p.desc),
        impact: t(p.impact),
        url: t(p.url),
        tags: list(p.tags),
      }))
      .filter((p) => p.title),
  };
}

function Dashboard({ email }: { email: string }) {
  const supabase = getSupabase();
  const [tab, setTab] = useState<Tab>("intro");
  const [saved, setSaved] = useState<PortfolioContent | null>(null);
  const [draft, setDraft] = useState<PortfolioContent | null>(null);
  const [neverSaved, setNeverSaved] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState<{ kind: "ok" | "error"; text: string } | null>(null);
  // Bumped when the draft is replaced wholesale, so list inputs reset their text.
  const [version, setVersion] = useState(0);
  const [unread, setUnread] = useState(0);

  const load = useCallback(async () => {
    setLoadError("");
    const { data, error } = await supabase
      .from("site_content")
      .select("data")
      .eq("id", "portfolio")
      .maybeSingle();
    if (error) {
      setLoadError(`Couldn't load your content: ${error.message}`);
      return;
    }
    const content = data ? normalizeContent(data.data) : DEFAULT_CONTENT;
    setNeverSaved(!data);
    setSaved(content);
    setDraft(content);
    setVersion((v) => v + 1);
  }, [supabase]);

  const loadUnread = useCallback(async () => {
    const { count } = await supabase
      .from("contact_messages")
      .select("id", { count: "exact", head: true })
      .eq("is_read", false);
    setUnread(count ?? 0);
  }, [supabase]);

  useEffect(() => {
    load();
    loadUnread();
  }, [load, loadUnread]);

  const dirty = useMemo(
    () => !!draft && !!saved && JSON.stringify(draft) !== JSON.stringify(saved),
    [draft, saved],
  );

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
    if (!draft) return;
    const content = clean(draft);
    setSaving(true);
    const { error } = await supabase
      .from("site_content")
      .upsert({ id: "portfolio", data: content, updated_at: new Date().toISOString() });
    setSaving(false);
    if (error) {
      setNotice({ kind: "error", text: `Not saved: ${error.message}` });
      return;
    }
    setSaved(content);
    setDraft(content);
    setVersion((v) => v + 1);
    setNeverSaved(false);
    setNotice({ kind: "ok", text: "Saved. Your portfolio shows the changes now." });
  }

  function discard() {
    setDraft(saved);
    setVersion((v) => v + 1);
  }

  function restore(content: PortfolioContent) {
    setDraft(content);
    setVersion((v) => v + 1);
    setTab("intro");
    setNotice({ kind: "ok", text: "Old version loaded. Check it, then click Save changes." });
  }

  const update = (patch: Partial<PortfolioContent>) =>
    setDraft((d) => (d ? { ...d, ...patch } : d));

  const tabs: { id: Tab; label: string; badge?: number }[] = [
    { id: "intro", label: "Intro & about" },
    { id: "projects", label: "Projects" },
    { id: "experience", label: "Experience & skills" },
    { id: "messages", label: "Messages", badge: unread },
    { id: "history", label: "History" },
  ];

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
      {loadError && (
        <p role="alert" className="mt-4 text-sm text-destructive">
          {loadError}{" "}
          <button className="underline" onClick={load}>
            Try again
          </button>
        </p>
      )}
      {neverSaved && draft && tab !== "messages" && tab !== "history" && (
        <p className="mt-4 rounded-lg border border-border bg-muted/40 px-4 py-2 text-sm text-muted-foreground">
          Showing the text that's built into your site. Your first save stores it in the database.
        </p>
      )}

      <div className="mt-6 pb-28">
        {tab === "messages" ? (
          <Messages onUnreadChange={loadUnread} />
        ) : tab === "history" ? (
          <HistoryList onRestore={restore} />
        ) : !draft ? (
          !loadError && <p className="text-muted-foreground">Loading your content…</p>
        ) : tab === "intro" ? (
          <IntroEditor key={version} c={draft} update={update} />
        ) : tab === "projects" ? (
          <ProjectsEditor
            key={version}
            projects={draft.projects}
            set={(projects) => update({ projects })}
          />
        ) : (
          <ExperienceEditor key={version} c={draft} update={update} />
        )}
      </div>

      {dirty && (
        <div className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background/95 backdrop-blur">
          <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-between gap-3 px-4 py-3">
            <p className="text-sm font-medium">You have unsaved changes.</p>
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

function HistoryList({ onRestore }: { onRestore: (c: PortfolioContent) => void }) {
  const supabase = getSupabase();
  const [rows, setRows] = useState<{ id: number; saved_at: string; data: unknown }[] | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    supabase
      .from("site_content_history")
      .select("id, saved_at, data")
      .eq("content_id", "portfolio")
      .order("id", { ascending: false })
      .limit(30)
      .then(({ data, error }) => {
        if (error) setError(`Couldn't load history: ${error.message}`);
        else setRows(data);
      });
  }, [supabase]);

  if (error) return <p className="text-sm text-destructive">{error}</p>;
  if (!rows) return <p className="text-muted-foreground">Loading history…</p>;
  if (!rows.length) {
    return (
      <div className={`${card} text-center text-muted-foreground`}>
        <History className="mx-auto h-8 w-8" />
        <p className="mt-2">
          No earlier versions yet. Each time you save, the previous version is kept here.
        </p>
      </div>
    );
  }
  return (
    <div className="grid gap-2">
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
          <button className={btnGhost} onClick={() => onRestore(normalizeContent(r.data))}>
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
