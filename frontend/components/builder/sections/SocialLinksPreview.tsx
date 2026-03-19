"use client";

import { getPlatformColor } from "@/lib/utils";
import { useBuilderStore } from "@/lib/store";

interface SocialLink { platform: string; url: string }
interface Props { data: Record<string, unknown> }

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

export function SocialLinksPreview({ data }: Props) {
  const { layout } = useBuilderStore();
  const { darkMode } = layout.theme;
  const links = (data.links as SocialLink[]) || [];
  const displayLinks = links.length > 0 ? links : [
    { platform: "instagram", url: "" }, { platform: "linkedin", url: "" },
    { platform: "youtube", url: "" }, { platform: "twitter", url: "" },
  ];

  return (
    <div className="px-5 py-4">
      <p className="text-xs font-medium mb-3 uppercase tracking-wider opacity-40"
        style={{ color: darkMode ? "#F8FAFC" : "#0F172A" }}>
        Connect With Me
      </p>
      <div className="flex flex-wrap gap-2">
        {displayLinks.map(({ platform, url }, i) => {
          const color = getPlatformColor(platform);
          const icon = PLATFORM_ICONS[platform.toLowerCase()] || "🔗";
          const label = PLATFORM_LABELS[platform.toLowerCase()] || platform;
          return (
            <a key={i} href={url || "#"} target={url ? "_blank" : undefined} rel="noopener noreferrer"
              onClick={(e) => !url && e.preventDefault()}
              className="flex items-center gap-2 px-3 py-2 rounded-xl transition-all hover:scale-105 active:scale-95"
              style={{ background: `${color}12`, border: `1px solid ${color}25` }}
              title={label}>
              <span className="text-base leading-none">{icon}</span>
              <span className="text-xs font-medium" style={{ color }}>{label}</span>
            </a>
          );
        })}
      </div>
    </div>
  );
}
