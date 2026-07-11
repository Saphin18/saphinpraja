import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const schema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(255),
  message: z.string().trim().min(1).max(1000),
  // Honeypot: must be empty
  website: z.string().max(0).optional().or(z.literal("")),
});

export const Route = createFileRoute("/api/contact")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let body: unknown;
        try {
          body = await request.json();
        } catch {
          return Response.json({ error: "Invalid JSON" }, { status: 400 });
        }

        const parsed = schema.safeParse(body);
        if (!parsed.success) {
          return Response.json({ error: "Invalid input" }, { status: 400 });
        }

        // Honeypot triggered — pretend success, don't send.
        if (parsed.data.website && parsed.data.website.length > 0) {
          return Response.json({ ok: true });
        }

        const LOVABLE_API_KEY = process.env.LOVABLE_API_KEY;
        const RESEND_API_KEY = process.env.RESEND_API_KEY;
        if (!LOVABLE_API_KEY || !RESEND_API_KEY) {
          return Response.json({ error: "Email not configured" }, { status: 500 });
        }

        const { name, email, message } = parsed.data;
        const safeName = name.replace(/[<>]/g, "");
        const safeEmail = email.replace(/[<>]/g, "");
        const safeMessage = message
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;")
          .replace(/\n/g, "<br/>");

        try {
          const res = await fetch("https://connector-gateway.lovable.dev/resend/emails", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${LOVABLE_API_KEY}`,
              "X-Connection-Api-Key": RESEND_API_KEY,
            },
            body: JSON.stringify({
              from: "Portfolio Contact <onboarding@resend.dev>",
              to: ["prajasaphin18@gmail.com"],
              reply_to: email,
              subject: `New portfolio contact from ${safeName}`,
              html: `<div style="font-family:Arial,sans-serif">
                <h2>New contact form submission</h2>
                <p><strong>Name:</strong> ${safeName}</p>
                <p><strong>Email:</strong> ${safeEmail}</p>
                <p><strong>Message:</strong></p>
                <p>${safeMessage}</p>
              </div>`,
            }),
          });

          if (!res.ok) {
            const errText = await res.text();
            console.error(`Resend send failed [${res.status}]: ${errText}`);
            return Response.json({ error: "Failed to send" }, { status: 502 });
          }

          return Response.json({ ok: true });
        } catch (err) {
          console.error("Contact form send error", err);
          return Response.json({ error: "Failed to send" }, { status: 500 });
        }
      },
    },
  },
});
