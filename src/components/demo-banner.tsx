import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

// Thin bar on top of every demo site so visitors know it's a sample, not a real business.
export function DemoBanner() {
  return (
    <div className="bg-neutral-950 text-neutral-200">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 px-6 py-2 text-xs">
        <p>Sample website for a fictional business — designed & built by Saphin Praja.</p>
        <Link
          to="/services"
          className="inline-flex items-center gap-1.5 font-medium text-white hover:underline"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Want one like this?
        </Link>
      </div>
    </div>
  );
}

export function demoHead(path: string, title: string, description: string) {
  const url = `https://saphinpraja.com.np${path}`;
  return {
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:url", content: url },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
    ],
    links: [{ rel: "canonical", href: url }],
  };
}
