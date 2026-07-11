const corsHeaders = {
  "Access-Control-Allow-Origin": "https://saphinpraja.lovable.app",
  "Access-Control-Allow-Headers": "content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const portfolioContext = `
You are the portfolio assistant for Saphin Praja, a junior data analyst.

Background:
- Saphin works at Xuno as a Data Analyst (February 2026 to present). He previously interned there in Digital Marketing and Data Analysis (October 2025 to January 2026).
- His work includes SQL queries, Python scripts and Jupyter notebooks, Power BI and Metabase dashboards, reporting, RFM segmentation, customer profiling, and analysis using Mixpanel, CleverTap, Meta Business Suite, and internal data sources.
- Skills: SQL, Python, Excel, Power BI, data visualization, Jupyter, fintech analytics, customer profiling, research, and reporting.
- Projects: FX Insights Automation collects FX rates, commodity prices, and market indices daily, saves JSON to Google Drive, and posts Slack summaries. Reddit Competitor & Remittance Monitor scans Reddit every 15 minutes using keyword and semantic matching and alerts Slack.
- Contact: LinkedIn is https://www.linkedin.com/in/saphinpraja/, GitHub is https://github.com/Saphin18, and email is hello@saphinpraja.com.

Answer only questions about Saphin's background, portfolio, skills, experience, projects, or how to contact him. Do not invent details. If asked about anything else, politely say you can only help with questions about Saphin's portfolio. Keep answers brief, friendly, and factual.
`;

const json = (body: Record<string, string>, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (request.method !== "POST") return json({ error: "Method not allowed" }, 405);

  let body: { message?: unknown };
  try {
    body = await request.json();
  } catch {
    return json({ error: "Invalid request" }, 400);
  }

  const message = typeof body.message === "string" ? body.message.trim() : "";
  if (!message || message.length > 500) return json({ error: "Please enter a question of up to 500 characters." }, 400);

  const apiKey = Deno.env.get("GEMINI_API_KEY");
  if (!apiKey) return json({ error: "Chat service is not configured yet." }, 500);

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: portfolioContext }] },
          contents: [{ role: "user", parts: [{ text: message }] }],
          generationConfig: { maxOutputTokens: 250, temperature: 0.3 },
        }),
      },
    );

    if (!response.ok) {
      console.error(`Gemini request failed [${response.status}]: ${await response.text()}`);
      return json({ error: "The portfolio assistant is unavailable right now." }, 502);
    }

    const data = await response.json();
    const answer = data.candidates?.[0]?.content?.parts?.map((part: { text?: string }) => part.text ?? "").join("").trim();
    if (!answer) return json({ error: "The portfolio assistant could not generate a reply." }, 502);
    return json({ answer });
  } catch (error) {
    console.error("Gemini request error", error);
    return json({ error: "The portfolio assistant is unavailable right now." }, 500);
  }
});
