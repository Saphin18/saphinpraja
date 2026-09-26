import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

// Pitch links can personalise a demo for a real business:
//   /demos/salon?n=Sita+Beauty+Parlour&a=Hetauda&p=9812345678
// n = business name, a = area/address, p = phone (used for the WhatsApp button).
export type DemoSearch = { n?: string; a?: string; p?: string | number };

export function validateDemoSearch(search: Record<string, unknown>): DemoSearch {
  // The router JSON-parses query values, so a phone number arrives as a number. Keep it one,
  // or the router rewrites the URL to p="98..." with quotes.
  const pick = (v: unknown) => {
    if (typeof v !== "string" && typeof v !== "number") return undefined;
    const s = String(v).trim().slice(0, 60);
    return s || undefined;
  };
  const p = typeof search.p === "number" ? search.p : pick(search.p);
  return { n: pick(search.n), a: pick(search.a), p };
}

export type DemoBusiness = {
  personalised: boolean;
  name: string;
  area: string;
  address: string;
  phone: string;
  // WhatsApp chat link when a phone is given, otherwise the page's own contact section.
  whatsapp: string;
  mapSrc: string;
};

export function demoBusiness(
  search: DemoSearch,
  defaults: { name: string; area: string; address: string },
  fallbackHref: string,
): DemoBusiness {
  const area = search.a ?? defaults.area;
  const phone = search.p === undefined ? undefined : String(search.p);
  const digits = (phone ?? "").replace(/\D/g, "");
  const intl = digits.length === 10 ? `977${digits}` : digits;
  return {
    personalised: Boolean(search.n),
    name: search.n ?? defaults.name,
    area,
    address: search.a ?? defaults.address,
    phone: phone ?? "98XX-XXXXXX",
    whatsapp: intl ? `https://wa.me/${intl}` : fallbackHref,
    mapSrc: `https://www.google.com/maps?q=${encodeURIComponent(`${area}, Nepal`)}&output=embed`,
  };
}

// Thin bar on top of every demo site so visitors know it's a sample, not a real business.
export function DemoBanner({ forName }: { forName?: string }) {
  return (
    <div className="bg-neutral-950 text-neutral-200">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 px-6 py-2 text-xs">
        <p>
          {forName
            ? `A free website preview for ${forName}, made by Saphin Praja. Photos and prices are placeholders.`
            : "Sample website for a fictional business — designed & built by Saphin Praja."}
        </p>
        <Link
          to="/services"
          className="inline-flex items-center gap-1.5 font-medium text-white hover:underline"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          {forName ? "Get this website" : "Want one like this?"}
        </Link>
      </div>
    </div>
  );
}

export function demoHead(path: string, title: string, description: string, forName?: string) {
  const url = `https://saphinpraja.com.np${path}`;
  // A personalised link shows the business's own name in the WhatsApp/Facebook link preview.
  if (forName) {
    title = `${forName} — Website Preview`;
    description = `A free website preview made for ${forName} by Saphin Praja.`;
  }
  return {
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:url", content: url },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
      ...(forName ? [{ name: "robots", content: "noindex" }] : []),
    ],
    links: [{ rel: "canonical", href: url }],
  };
}
