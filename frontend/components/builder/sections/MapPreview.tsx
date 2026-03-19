"use client";

import { MapPin } from "lucide-react";

interface Props {
  data: Record<string, unknown>;
}

export function MapPreview({ data }: Props) {
  const address = (data.address as string) || "";
  const embedUrl = (data.embedUrl as string) || "";

  return (
    <div className="px-5 py-4">
      <p className="text-xs text-gray-400 dark:text-white/30 font-medium mb-3 uppercase tracking-wider">
        Location
      </p>
      {embedUrl ? (
        <iframe
          src={embedUrl}
          className="w-full h-40 rounded-xl border border-gray-100 dark:border-white/10"
          loading="lazy"
          title="Location map"
        />
      ) : (
        <div className="w-full h-40 rounded-xl bg-gray-100 dark:bg-white/5 border border-gray-100 dark:border-white/10 flex flex-col items-center justify-center gap-2">
          <MapPin className="w-8 h-8 text-gray-300 dark:text-white/20" />
          <p className="text-gray-400 dark:text-white/30 text-xs">
            {address || "Add your location"}
          </p>
        </div>
      )}
    </div>
  );
}
