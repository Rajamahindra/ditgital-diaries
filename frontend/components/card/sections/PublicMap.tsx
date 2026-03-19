"use client";

import { MapPin } from "lucide-react";

interface Props { data: Record<string, unknown>; }

export function PublicMap({ data }: Props) {
  const address = (data.address as string) || "";
  const embedUrl = (data.embedUrl as string) || "";

  return (
    <div className="px-5 py-4">
      <p className="text-xs font-semibold uppercase tracking-wider opacity-40 mb-3">Location</p>
      {embedUrl ? (
        <iframe src={embedUrl} className="w-full h-44 rounded-2xl border border-black/10" loading="lazy" title="Map" />
      ) : address ? (
        <a
          href={`https://maps.google.com/?q=${encodeURIComponent(address)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 p-4 rounded-2xl bg-black/5 dark:bg-white/5 hover:bg-black/10 transition-all"
        >
          <MapPin className="w-5 h-5 text-red-500 flex-shrink-0" />
          <span className="text-sm">{address}</span>
        </a>
      ) : null}
    </div>
  );
}
