const corsHeaders = {
  "Access-Control-Allow-Origin": "https://saphinpraja.lovable.app",
  "Access-Control-Allow-Headers": "content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const json = (body: Record<string, unknown>, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\n/g, "<br/>");

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (request.method !== "POST") return json({ error: "Method not allowed" }, 405);

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return json({ error: "Invalid request" }, 400);
  }

  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim() : "";
  const message = typeof body.message === "string" ? body.message.trim() : "";
  const website = typeof body.website === "string" ? body.website : "";
  const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  if (!name || name.length > 100 || !validEmail || email.length > 255 || !message || message.length > 1000) {
    return json({ error: "Please complete all fields with valid information." }, 400);
  }

  // Honeypot: return success so automated submissions are silently discarded.
  if (website) return json({ ok: true });

  const resendApiKey = Deno.env.get("RESEND_API_KEY");
  if (!resendApiKey) {
    console.error("RESEND_API_KEY is not configured");
    return json({ error: "Email service is not configured." }, 500);
  }

  const safeName = name.replace(/[<>]/g, "");
  const safeEmail = email.replace(/[<>]/g, "");
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${resendApiKey}`,
      "Content-Type": "application/json",
      "User-Agent": "saphinpraja-contact-form/1.0",
    },
    body: JSON.stringify({
      from: Deno.env.get("CONTACT_FROM_EMAIL") ?? "Portfolio Contact <onboarding@resend.dev>",
      to: ["prajasaphin18@gmail.com"],
      reply_to: safeEmail,
      subject: `New portfolio contact from ${safeName}`,
      html: `<div style="font-family:Arial,sans-serif"><h2>New contact form submission</h2><p><strong>Name:</strong> ${safeName}</p><p><strong>Email:</strong> ${safeEmail}</p><p><strong>Message:</strong></p><p>${escapeHtml(message)}</p></div>`,
    }),
  });

  if (!response.ok) {
    console.error(`Resend send failed [${response.status}]: ${await response.text()}`);
    const error =
      response.status === 401 || response.status === 403
        ? "Resend rejected the API key or sender domain."
        : "Email delivery failed. Please try again shortly.";
    return json({ error }, 502);
  }

  return json({ ok: true });
});
