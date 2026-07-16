import { createFileRoute } from "@tanstack/react-router";
import { Resend } from "resend";

export const Route = createFileRoute("/api/contact")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = await request.json();
          const { name, email, message } = body;

          if (!name || !email || !message) {
            return new Response(
              JSON.stringify({ error: "Name, email, and message are required fields." }),
              {
                status: 400,
                headers: { "Content-Type": "application/json" },
              }
            );
          }

          const apiKey = process.env.RESEND_API_KEY;
          if (!apiKey) {
            console.error("RESEND_API_KEY environment variable is not defined");
            return new Response(
              JSON.stringify({
                error: "The email sending service is not properly configured. Please check backend environment variables.",
              }),
              {
                status: 500,
                headers: { "Content-Type": "application/json" },
              }
            );
          }

          const resend = new Resend(apiKey);
          const { data, error } = await resend.emails.send({
            from: "onboarding@resend.dev",
            to: "prajasaphin18@gmail.com",
            subject: `New contact form message from ${name}`,
            replyTo: email,
            text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
            html: `
              <div style="font-family: sans-serif; line-height: 1.5; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #eee; padding: 20px; border-radius: 8px;">
                <h2 style="color: #111; border-bottom: 1px solid #eee; padding-bottom: 10px;">New Contact Form Submission</h2>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
                <p><strong>Message:</strong></p>
                <div style="background-color: #f9f9f9; padding: 15px; border-radius: 4px; border-left: 4px solid #0070f3; font-style: italic; white-space: pre-wrap;">${message}</div>
              </div>
            `,
          });

          if (error) {
            console.error("Resend send email error:", error);
            return new Response(
              JSON.stringify({ error: error.message || "Failed to send email via Resend" }),
              {
                status: 400,
                headers: { "Content-Type": "application/json" },
              }
            );
          }

          return new Response(
            JSON.stringify({ success: true, messageId: data?.id }),
            {
              status: 200,
              headers: { "Content-Type": "application/json" },
            }
          );
        } catch (err: any) {
          console.error("Error processing contact form:", err);
          return new Response(
            JSON.stringify({ error: err?.message || "Internal server error" }),
            {
              status: 500,
              headers: { "Content-Type": "application/json" },
            }
          );
        }
      },
    },
  },
});
