"use client";

import { Camera } from "lucide-react";
import { useBuilderStore } from "@/lib/store";

interface Props { data: Record<string, unknown> }

function getPatternCSS(pattern: string, color: string): string {
  const c = color;
  switch (pattern) {
    case "dots": return `radial-gradient(circle, ${c}40 1px, transparent 1px)`;
    case "grid": return `linear-gradient(${c}20 1px, transparent 1px), linear-gradient(90deg, ${c}20 1px, transparent 1px)`;
    case "diagonal": return `repeating-linear-gradient(45deg, ${c}15 0, ${c}15 1px, transparent 0, transparent 50%)`;
    case "hexagon": return `radial-gradient(circle at 50% 50%, ${c}30 2px, transparent 2px)`;
    case "circuit": return `linear-gradient(${c}25 1px, transparent 1px), linear-gradient(90deg, ${c}25 1px, transparent 1px)`;
    case "noise": return `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.08'/%3E%3C/svg%3E")`;
    case "topography": return `radial-gradient(ellipse at 20% 50%, ${c}20 0%, transparent 50%), radial-gradient(ellipse at 80% 20%, ${c}15 0%, transparent 50%)`;
    case "waves": return `repeating-linear-gradient(0deg, transparent, transparent 10px, ${c}15 10px, ${c}15 11px)`;
    default: return "";
  }
}

export function ProfileSectionPreview({ data }: Props) {
  const { layout } = useBuilderStore();
  const { secondaryColor, accentColor, darkMode, coverStyle, backgroundPattern, glassEffect, neonGlow, avatarShape } = layout.theme as Record<string, unknown> & typeof layout.theme;

  const name = (data.name as string) || "Your Name";
  const profession = (data.profession as string) || "Your Profession";
  const company = (data.company as string) || "Your Company";
  const bio = (data.bio as string) || "Write your bio here...";
  const tagline = (data.tagline as string) || "";
  const photo = data.photo as string | undefined;

  // Cover background
  let coverBg = `linear-gradient(135deg, ${secondaryColor}, ${accentColor})`;
  if (coverStyle === "glass") {
    coverBg = `linear-gradient(135deg, ${secondaryColor}40, ${accentColor}30)`;
  } else if (coverStyle === "neon") {
    coverBg = `linear-gradient(135deg, ${secondaryColor}20, ${accentColor}10)`;
  } else if (coverStyle === "none") {
    coverBg = darkMode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)";
  } else if (coverStyle === "pattern" && backgroundPattern) {
    coverBg = `linear-gradient(135deg, ${secondaryColor}30, ${accentColor}20)`;
  }

  // Avatar shape
  const avatarRadius = avatarShape === "square" ? "8px" : avatarShape === "hexagon" ? "30% 70% 70% 30% / 30% 30% 70% 70%" : "50%";

  // Neon glow style
  const neonStyle = neonGlow ? { boxShadow: `0 0 20px ${secondaryColor}80, 0 0 40px ${secondaryColor}40` } : {};
  const neonTextStyle = neonGlow ? { textShadow: `0 0 10px ${secondaryColor}` } : {};
  const neonBorderStyle = neonGlow ? { border: `1px solid ${secondaryColor}60`, boxShadow: `0 0 10px ${secondaryColor}40` } : {};

  // Glass effect
  const glassCardStyle = glassEffect ? {
    background: "rgba(255,255,255,0.08)",
    backdropFilter: "blur(12px)",
    WebkitBackdropFilter: "blur(12px)",
    border: "1px solid rgba(255,255,255,0.15)",
  } : {};

  return (
    <div className="relative">
      {/* Cover */}
      <div className="h-28 relative overflow-hidden" style={{ background: coverBg }}>
        {/* Pattern overlay */}
        {backgroundPattern && backgroundPattern !== "noise" && (
          <div className="absolute inset-0" style={{
            backgroundImage: getPatternCSS(backgroundPattern as string, secondaryColor),
            backgroundSize: backgroundPattern === "dots" ? "20px 20px" : backgroundPattern === "grid" ? "20px 20px" : "10px 10px",
            opacity: 0.6,
          }} />
        )}
        {/* Neon scanline effect */}
        {neonGlow && (
          <div className="absolute inset-0 opacity-10"
            style={{ backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 2px, ${secondaryColor}30 2px, ${secondaryColor}30 4px)` }} />
        )}
        {/* Glass shimmer */}
        {glassEffect && (
          <div className="absolute inset-0 opacity-20"
            style={{ backgroundImage: `linear-gradient(135deg, rgba(255,255,255,0.3) 0%, transparent 50%, rgba(255,255,255,0.1) 100%)` }} />
        )}
        {/* Neon border bottom */}
        {neonGlow && (
          <div className="absolute bottom-0 left-0 right-0 h-px" style={{ background: secondaryColor, boxShadow: `0 0 8px ${secondaryColor}` }} />
        )}
      </div>

      <div className="px-5 pb-5" style={glassEffect ? { ...glassCardStyle, margin: "0 8px 8px", borderRadius: "12px", marginTop: "-16px" } : {}}>
        {/* Avatar */}
        <div className="relative -mt-12 mb-3 flex items-end justify-between" style={glassEffect ? { marginTop: "-8px" } : {}}>
          <div className="w-20 h-20 border-4 shadow-xl overflow-hidden flex-shrink-0"
            style={{
              borderRadius: avatarRadius,
              borderColor: darkMode ? "#1E293B" : "#FFFFFF",
              background: `${secondaryColor}20`,
              ...neonStyle,
              ...(glassEffect ? { borderColor: `${secondaryColor}40`, background: "rgba(255,255,255,0.1)" } : {}),
            }}>
            {photo ? (
              <img src={photo} alt={name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Camera className="w-7 h-7" style={{ color: secondaryColor }} />
              </div>
            )}
          </div>
          {/* Verified badge */}
          <div className="mb-1 px-2 py-0.5 rounded-full text-xs font-medium text-white"
            style={{
              background: neonGlow
                ? "transparent"
                : `linear-gradient(135deg, ${secondaryColor}, ${accentColor})`,
              ...(neonGlow ? { border: `1px solid ${secondaryColor}`, color: secondaryColor, ...neonBorderStyle } : {}),
            }}>
            ✓ Verified
          </div>
        </div>

        <h2 className="font-display font-bold text-xl leading-tight"
          style={{ color: darkMode ? "#F8FAFC" : "#0F172A", ...neonTextStyle }}>
          {name}
        </h2>
        <p className="font-semibold text-sm mt-0.5" style={{ color: secondaryColor, ...(neonGlow ? { textShadow: `0 0 8px ${secondaryColor}` } : {}) }}>
          {profession}
        </p>
        <p className="text-xs mt-0.5 opacity-60" style={{ color: darkMode ? "#F8FAFC" : "#0F172A" }}>{company}</p>
        {tagline && (
          <p className="text-xs mt-1.5 italic opacity-50" style={{ color: darkMode ? "#F8FAFC" : "#0F172A" }}>{tagline}</p>
        )}
        <p className="text-sm mt-3 leading-relaxed opacity-70" style={{ color: darkMode ? "#F8FAFC" : "#374151" }}>{bio}</p>
      </div>
    </div>
  );
}
