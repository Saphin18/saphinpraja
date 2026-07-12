import { createFileRoute } from "@tanstack/react-router";

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\n/g, "<br/>");

const json = (body: Record<string, unknown>, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });

export const Route = createFileRoute("/api/contact")({
  server: {
    handlers: {
      POST: async ({ request }) => {
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

        if (
          !name ||
          name.length > 100 ||
          !validEmail ||
          email.length > 255 ||
          !message ||
          message.length > 1000
        ) {
          return json({ error: "Please complete all fields with valid information." }, 400);
        }

        // Honeypot: silently discard bot submissions.
        if (website) return json({ ok: true });

        const lovableApiKey = process.env.LOVABLE_API_KEY;
        const resendApiKey = process.env.RESEND_API_KEY;
        if (!lovableApiKey || !resendApiKey) {
          console.error("Contact form: missing LOVABLE_API_KEY or RESEND_API_KEY");
          return json({ error: "Email service is not configured." }, 500);
        }

        const safeName = name.replace(/[<>]/g, "");
        const safeEmail = email.replace(/[<>]/g, "");

        const response = await fetch("https://connector-gateway.lovable.dev/resend/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${lovableApiKey}`,
            "X-Connection-Api-Key": resendApiKey,
          },
          body: JSON.stringify({
            from: "Portfolio Contact <onboarding@resend.dev>",
            to: ["prajasaphin18@gmail.com"],
            reply_to: safeEmail,
            subject: `New portfolio contact from ${safeName}`,
            html: `<div style="font-family:Arial,sans-serif"><h2>New contact form submission</h2><p><strong>Name:</strong> ${safeName}</p><p><strong>Email:</strong> ${safeEmail}</p><p><strong>Message:</strong></p><p>${escapeHtml(message)}</p></div>`,
          }),
        });

        if (!response.ok) {
          const errorBody = await response.text();
          console.error(`Resend send failed [${response.status}]: ${errorBody}`);
          const error =
            response.status === 401 || response.status === 403
              ? "Resend rejected the API key or sender domain."
              : "Email delivery failed. Please try again shortly.";
          return json({ error }, 502);
        }

        return json({ ok: true });
      },
    },
  },
});
