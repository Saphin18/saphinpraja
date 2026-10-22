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

// Which country a demo is pitched into: decides the dial code on the chat link, the
// country the map searches, and the shape of the placeholder phone number.
export type DemoLocale = {
  dialCode: string;
  nationalDigits: number;
  country: string;
  placeholderPhone: string;
};

export const NEPAL: DemoLocale = {
  dialCode: "977",
  nationalDigits: 10,
  country: "Nepal",
  placeholderPhone: "98XX-XXXXXX",
};

export const KOREA: DemoLocale = {
  dialCode: "82",
  nationalDigits: 10,
  country: "South Korea",
  placeholderPhone: "010-XXXX-XXXX",
};

// Local number to international, without the leading trunk zero Korean numbers carry
// (010-1234-5678 dials as +82 10 1234 5678). Anything we can't read confidently is
// passed through untouched rather than guessed at.
function toInternational(digits: string, locale: DemoLocale) {
  if (!digits) return "";
  if (digits.startsWith(locale.dialCode)) return digits;
  const national = digits.replace(/^0+/, "");
  return national.length === locale.nationalDigits ? `${locale.dialCode}${national}` : digits;
}

export type DemoBusiness = {
  personalised: boolean;
  name: string;
  area: string;
  address: string;
  phone: string;
  // WhatsApp chat link when a phone is given, otherwise the page's own contact section.
  whatsapp: string;
  tel: string;
  mapSrc: string;
};

export function demoBusiness(
  search: DemoSearch,
  defaults: { name: string; area: string; address: string },
  fallbackHref: string,
  locale: DemoLocale = NEPAL,
): DemoBusiness {
  const area = search.a ?? defaults.area;
  const phone = search.p === undefined ? undefined : String(search.p);
  const digits = (phone ?? "").replace(/\D/g, "");
  const intl = toInternational(digits, locale);
  return {
    personalised: Boolean(search.n),
    name: search.n ?? defaults.name,
    area,
    address: search.a ?? defaults.address,
    phone: phone ?? locale.placeholderPhone,
    whatsapp: intl ? `https://wa.me/${intl}` : fallbackHref,
    tel: intl ? `tel:+${intl}` : fallbackHref,
    mapSrc: `https://www.google.com/maps?q=${encodeURIComponent(`${area}, ${locale.country}`)}&output=embed`,
  };
}

// Thin bar on top of a demo that was opened from a pitch link, naming the business it was
// made for. Plain /demos/* links show nothing: the demo should look like a finished site.
export function DemoBanner({ forName }: { forName?: string }) {
  if (!forName) return null;
  return (
    <div className="bg-neutral-950 text-neutral-200">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 px-6 py-2 text-xs">
        <p>
          {`A free website preview for ${forName}, made by Saphin Praja. Photos and prices are placeholders.`}
        </p>
        <Link
          to="/services"
          className="inline-flex items-center gap-1.5 font-medium text-white hover:underline"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Get this website
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
