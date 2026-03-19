"use client";

import { getPlatformColor } from "@/lib/utils";

interface SocialLink { platform: string; url: string; }
interface Props { data: Record<string, unknown>; onTrack: (event: string) => void; }

const ICONS: Record<string, string> = {
  instagram: "📸", facebook: "📘", linkedin: "💼", youtube: "▶️",
  twitter: "🐦", telegram: "✈️", website: "🌐", github: "💻", tiktok: "🎵",
};

export function PublicSocialLinks({ data, onTrack }: Props) {
  const links = (data.links as SocialLink[]) || [];
  if (links.length === 0) return null;

  return (
    <div className="px-5 py-4">
      <p className="text-xs font-semibold uppercase tracking-wider opacity-40 mb-3">Follow Me</p>
      <div className="flex flex-wrap gap-2">
        {links.map(({ platform, url }, i) => {
          const color = getPlatformColor(platform);
          return (
            <a
              key={i}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => onTrack(`social_${platform}_click`)}
              className="w-11 h-11 rounded-xl flex items-center justify-center text-xl transition-transform hover:scale-110 active:scale-95 border"
              style={{ background: `${color}15`, borderColor: `${color}25` }}
            >
              {ICONS[platform.toLowerCase()] || "🔗"}
            </a>
          );
        })}
      </div>
    </div>
  );
}
