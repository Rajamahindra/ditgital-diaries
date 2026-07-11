"use client";

import { useState } from "react";
import { MapPin } from "lucide-react";
import { useBuilderStore } from "@/lib/store";

interface Props { data: Record<string, unknown>; sectionId?: string; }

export function MapPreview({ data, sectionId }: Props) {
  const { updateSection, selectedSectionId } = useBuilderStore();
  const id = sectionId ?? selectedSectionId ?? "";
  const update = (key: string, v: string) => { if (id) updateSection(id, { [key]: v }); };

  const address = (data.address as string) || "";
  const embedUrl = (data.embedUrl as string) || "";
  const [editingAddress, setEditingAddress] = useState(false);
  const [editingEmbed, setEditingEmbed] = useState(false);

  return (
    <div className="px-5 py-4">
      <p className="text-xs text-gray-400 dark:text-white/30 font-medium mb-3 uppercase tracking-wider">
        Location
      </p>

      {/* Map preview or placeholder */}
      {embedUrl ? (
        <iframe
          src={embedUrl}
          className="w-full h-40 rounded-xl border border-gray-100 dark:border-white/10"
          loading="lazy"
          title="Location map"
        />
      ) : (
        <div
          className="w-full h-40 rounded-xl bg-gray-100 dark:bg-white/5 border-2 border-dashed border-gray-200 dark:border-white/10 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-indigo-400 transition-colors group"
          onClick={() => setEditingEmbed(true)}
          title="Click to add Google Maps embed URL"
        >
          <MapPin className="w-8 h-8 text-gray-300 dark:text-white/20 group-hover:text-indigo-400 transition-colors" />
          <p className="text-gray-400 dark:text-white/30 text-xs group-hover:text-indigo-400 transition-colors">
            {address || "Click to add map"}
          </p>
        </div>
      )}

      {/* Editable embed URL */}
      <div className="mt-2">
        <span className="text-xs text-gray-400 dark:text-white/30 block mb-1">Maps embed URL:</span>
        {editingEmbed ? (
          <input
            autoFocus
            value={embedUrl}
            placeholder="https://maps.google.com/maps?..."
            onChange={(e) => update("embedUrl", e.target.value)}
            onBlur={() => setEditingEmbed(false)}
            onKeyDown={(e) => { if (e.key === "Enter") setEditingEmbed(false); }}
            className="w-full text-xs rounded-lg px-2 py-1.5 outline-none border border-indigo-300 bg-gray-50 dark:bg-white/5 text-gray-700 dark:text-white"
          />
        ) : (
          <span
            onClick={() => setEditingEmbed(true)}
            className="block text-xs cursor-text text-gray-400 dark:text-white/30 truncate px-2 py-1.5 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-colors border border-transparent hover:border-indigo-200 dark:hover:border-indigo-500/30"
            title="Click to set embed URL"
          >
            {embedUrl || <span className="opacity-40 italic">paste Google Maps embed URL…</span>}
          </span>
        )}
      </div>

      {/* Editable address label */}
      <div className="mt-1.5">
        <span className="text-xs text-gray-400 dark:text-white/30 block mb-1">Address label:</span>
        {editingAddress ? (
          <input
            autoFocus
            value={address}
            placeholder="123 Main St, City"
            onChange={(e) => update("address", e.target.value)}
            onBlur={() => setEditingAddress(false)}
            onKeyDown={(e) => { if (e.key === "Enter") setEditingAddress(false); }}
            className="w-full text-xs rounded-lg px-2 py-1.5 outline-none border border-indigo-300 bg-gray-50 dark:bg-white/5 text-gray-700 dark:text-white"
          />
        ) : (
          <span
            onClick={() => setEditingAddress(true)}
            className="block text-xs cursor-text text-gray-600 dark:text-white/60 px-2 py-1.5 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-colors border border-transparent hover:border-indigo-200 dark:hover:border-indigo-500/30"
            title="Click to edit address"
          >
            {address || <span className="opacity-40 italic">click to add address…</span>}
          </span>
        )}
      </div>
    </div>
  );
}
