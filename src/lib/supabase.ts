import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { DEFAULT_CONTENT, normalizeContent, type PortfolioContent } from "@/lib/portfolio-content";

// The portfolio's own Supabase project (personal account), used by /admin.
// Both values are public by design: the database's row-level security rules decide what
// anyone can read or change, and only the admin account can change anything.
// Fill these in from Supabase → Project Settings → API. While they're empty the site
// simply uses the built-in content and /admin explains what's missing.
export const SUPABASE_URL = "https://hmfddmvzwuhqslfgmdqo.supabase.co";
export const SUPABASE_ANON_KEY = "sb_publishable_dNtGRvCyFskk75nT-OajWA_H4Q_FpSX";

export const supabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

let client: SupabaseClient | null = null;

// Browser-only client for /admin (keeps the login session in localStorage).
export function getSupabase(): SupabaseClient {
  if (!supabaseConfigured) throw new Error("Supabase isn't set up yet.");
  client ??= createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  return client;
}

// New-style publishable keys (sb_publishable_…) go in the apikey header only; legacy anon
// keys are JWTs and are also sent as the bearer token.
const restHeaders = (): Record<string, string> =>
  SUPABASE_ANON_KEY.startsWith("eyJ")
    ? { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` }
    : { apikey: SUPABASE_ANON_KEY };

// Reads the saved portfolio content. Never throws: if the database is slow, down, or
// empty, the page gets the built-in content instead.
export async function fetchPortfolioContent(timeoutMs = 2500): Promise<PortfolioContent> {
  if (!supabaseConfigured) return DEFAULT_CONTENT;
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/site_content?id=eq.portfolio&select=data`, {
      headers: restHeaders(),
      signal: ctrl.signal,
    });
    if (!res.ok) return DEFAULT_CONTENT;
    const rows = (await res.json()) as { data: unknown }[];
    return rows[0] ? normalizeContent(rows[0].data) : DEFAULT_CONTENT;
  } catch {
    return DEFAULT_CONTENT;
  } finally {
    clearTimeout(timer);
  }
}

// Keeps a copy of a contact/quote form message for the /admin inbox. Best effort: the
// email is the main delivery, so a failure here is logged and ignored.
export async function saveContactMessage(msg: {
  name: string;
  email: string;
  message: string;
  source: string;
}) {
  if (!supabaseConfigured) return;
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/contact_messages`, {
      method: "POST",
      headers: { ...restHeaders(), "Content-Type": "application/json", Prefer: "return=minimal" },
      body: JSON.stringify(msg),
    });
    if (!res.ok) console.error("Saving contact message failed:", res.status, await res.text());
  } catch (err) {
    console.error("Saving contact message failed:", err);
  }
}
