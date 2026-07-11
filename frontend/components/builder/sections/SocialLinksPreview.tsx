"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { getPlatformColor } from "@/lib/utils";
import { useBuilderStore } from "@/lib/store";

interface SocialLink { platform: string; url: string; }
interface Props { data: Record<string, unknown>; sectionId?: string; }

const PLATFORM_ICONS: Record<string, string> = {
  instagram: "📸", facebook: "📘", linkedin: "💼", youtube: "▶️",
  twitter: "𝕏", telegram: "✈️", website: "🌐", github: "💻",
  tiktok: "🎵", spotify: "🎧", pinterest: "📌", behance: "🎨",
};
const PLATFORM_LABELS: Record<string, string> = {
  instagram: "Instagram", facebook: "Facebook", linkedin: "LinkedIn",
  youtube: "YouTube", twitter: "Twitter", telegram: "Telegram",
  website: "Website", github: "GitHub", tiktok: "TikTok",
  spotify: "Spotify", pinterest: "Pinterest", behance: "Behance",
};
const ALL_PLATFORMS = Object.keys(PLATFORM_LABELS);

export function SocialLinksPreview({ data, sectionId }: Props) {
  const { layout, updateSection, selectedSectionId } = useBuilderStore();
  const { darkMode } = layout.theme;
  const id = sectionId ?? selectedSectionId ?? "";
  const links: SocialLink[] = (data.links as SocialLink[]) || [];
  const update = (newLinks: SocialLink[]) => { if (id) updateSection(id, { links: newLinks }); };

  const [editingIdx, setEditingIdx] = useState<number | null>(null);

  return (
    <div className="px-5 py-4">
      <p className="text-xs font-medium mb-3 uppercase tracking-wider opacity-40"
        style={{ color: darkMode ? "#F8FAFC" : "#0F172A" }}>
        Connect With Me
      </p>

      <div className="flex flex-wrap gap-2">
        {(links.length > 0 ? links : [{ platform: "instagram", url: "" }, { platform: "linkedin", url: "" }]).map((link, i) => {
          const color = getPlatformColor(link.platform);
          const icon = PLATFORM_ICONS[link.platform] || "🔗";
          const label = PLATFORM_LABELS[link.platform] || link.platform;
          const isEditing = editingIdx === i;

          return (
            <div key={i} className="flex flex-col gap-1">
              <div
                className="flex items-center gap-2 px-3 py-2 rounded-xl transition-all cursor-pointer group relative"
                style={{ background: `${color}12`, border: `1px solid ${isEditing ? color : `${color}25`}` }}
                onClick={() => setEditingIdx(isEditing ? null : i)}
                title="Click to edit URL"
              >
                <span className="text-base leading-none">{icon}</span>
                <span className="text-xs font-medium" style={{ color }}>{label}</span>
                {/* Delete button */}
                {links.length > 0 && (
                  <button
                    onClick={(e) => { e.stopPropagation(); update(links.filter((_, j) => j !== i)); setEditingIdx(null); }}
                    className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Remove"
                  >
                    <Trash2 className="w-3 h-3 text-red-400" />
                  </button>
                )}
              </div>
              {isEditing && (
                <div className="flex flex-col gap-1 min-w-[140px]">
                  <select
                    value={link.platform}
                    onChange={(e) => { const u = [...links]; u[i] = { ...link, platform: e.target.value }; update(u); }}
                    className="text-xs rounded-lg px-2 py-1 outline-none border bg-white dark:bg-gray-800 text-gray-700 dark:text-white border-gray-200 dark:border-white/10"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {ALL_PLATFORMS.map((p) => <option key={p} value={p}>{PLATFORM_LABELS[p]}</option>)}
                  </select>
                  <input
                    autoFocus
                    value={link.url}
                    placeholder="https://..."
                    onChange={(e) => { const u = [...links]; u[i] = { ...link, url: e.target.value }; update(u); }}
                    onBlur={() => setEditingIdx(null)}
                    onKeyDown={(e) => { if (e.key === "Enter") setEditingIdx(null); }}
                    className="text-xs rounded-lg px-2 py-1 outline-none border"
                    style={{ border: `1.5px solid ${color}60`, background: darkMode ? "rgba(255,255,255,0.07)" : "#F8FAFC", color: darkMode ? "#F8FAFC" : "#0F172A" }}
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
              )}
            </div>
          );
        })}

        {/* Add new link */}
        <button
          onClick={() => { const newLinks = [...links, { platform: "instagram", url: "" }]; update(newLinks); setEditingIdx(newLinks.length - 1); }}
          className="flex items-center gap-1 px-3 py-2 rounded-xl border-2 border-dashed border-gray-200 dark:border-white/10 text-gray-400 dark:text-white/30 hover:border-indigo-400 hover:text-indigo-400 transition-all text-xs"
          title="Add social link"
        >
          <Plus className="w-3 h-3" /> Add
        </button>
      </div>
    </div>
  );
}
