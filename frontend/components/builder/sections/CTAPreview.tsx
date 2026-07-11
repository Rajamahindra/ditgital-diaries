"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { useBuilderStore } from "@/lib/store";

interface Props { data: Record<string, unknown>; sectionId?: string; }

export function CTAPreview({ data, sectionId }: Props) {
  const { layout, updateSection, selectedSectionId } = useBuilderStore();
  const { secondaryColor, accentColor } = layout.theme;
  const id = sectionId ?? selectedSectionId ?? "";
  const update = (key: string, v: unknown) => { if (id) updateSection(id, { [key]: v }); };

  const text = (data.text as string) || "Book Appointment";
  const url = (data.url as string) || "";
  const style = (data.style as string) || "primary";

  const [editingText, setEditingText] = useState(false);
  const [editingUrl, setEditingUrl] = useState(false);

  const btnStyle =
    style === "primary"
      ? { background: `linear-gradient(135deg, ${secondaryColor}, ${accentColor})`, color: "#FFFFFF" }
      : style === "outline"
      ? { border: `2px solid ${secondaryColor}`, color: secondaryColor, background: "transparent" }
      : { color: secondaryColor, background: "transparent" };

  return (
    <div className="px-5 py-4 space-y-2">
      {/* Editable button — click text to rename */}
      <div
        className="w-full py-3.5 rounded-2xl font-semibold text-sm transition-all flex items-center justify-center gap-2 hover:opacity-90"
        style={btnStyle}
      >
        {editingText ? (
          <input
            autoFocus
            value={text}
            onChange={(e) => update("text", e.target.value)}
            onBlur={() => setEditingText(false)}
            onKeyDown={(e) => { if (e.key === "Enter") setEditingText(false); }}
            className="bg-transparent outline-none text-center font-semibold text-sm w-full"
            style={{ color: "inherit" }}
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <span
            title="Click to edit button text"
            onClick={(e) => { e.preventDefault(); setEditingText(true); }}
            className="cursor-text"
          >
            {text}
          </span>
        )}
        {!editingText && <ArrowRight className="w-4 h-4 flex-shrink-0" />}
      </div>

      {/* Editable URL underneath */}
      <div className="flex items-center gap-1">
        <span className="text-xs text-gray-400 dark:text-white/30 flex-shrink-0">URL:</span>
        {editingUrl ? (
          <input
            autoFocus
            value={url}
            placeholder="https://..."
            onChange={(e) => update("url", e.target.value)}
            onBlur={() => setEditingUrl(false)}
            onKeyDown={(e) => { if (e.key === "Enter") setEditingUrl(false); }}
            className="flex-1 text-xs bg-gray-50 dark:bg-white/5 border border-indigo-300 rounded px-2 py-0.5 outline-none text-gray-600 dark:text-white/60"
          />
        ) : (
          <span
            title="Click to edit URL"
            onClick={() => setEditingUrl(true)}
            className="flex-1 text-xs cursor-text text-gray-400 dark:text-white/30 truncate px-1 py-0.5 rounded hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-colors"
          >
            {url || <span className="opacity-40">https://...</span>}
          </span>
        )}
      </div>
    </div>
  );
}
