"use client";

import { useRef, useState } from "react";
import { Camera, ImageIcon } from "lucide-react";
import { useBuilderStore } from "@/lib/store";

interface Props { data: Record<string, unknown>; sectionId?: string; }

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

async function compressImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const maxW = 800;
      const scale = Math.min(1, maxW / img.width);
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      const ctx = canvas.getContext("2d");
      if (!ctx) return reject(new Error("canvas failed"));
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL("image/jpeg", 0.82));
    };
    img.onerror = reject;
    img.src = url;
  });
}

async function uploadImage(file: File): Promise<string> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
    const { default: Cookies } = await import("js-cookie");
    const token = Cookies.get("dd_token");
    const form = new FormData();
    form.append("image", file);
    const res = await fetch(`${apiUrl}/api/upload/image`, {
      method: "POST",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: form,
    });
    if (res.ok) {
      const data = await res.json();
      return data.url as string;
    }
  } catch { /* fall through */ }
  return compressImage(file);
}

/** Inline editable text — single line */
function InlineText({
  value, placeholder, onChange, className, style, as: Tag = "span",
}: {
  value: string; placeholder: string; onChange: (v: string) => void;
  className?: string; style?: React.CSSProperties; as?: "span" | "p" | "h2";
}) {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  if (editing) {
    return (
      <input
        ref={inputRef}
        autoFocus
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        onBlur={() => setEditing(false)}
        onKeyDown={(e) => { if (e.key === "Enter") setEditing(false); }}
        className={className}
        style={{
          ...style,
          background: "rgba(255,255,255,0.15)",
          border: "1.5px solid rgba(255,255,255,0.5)",
          borderRadius: 6,
          outline: "none",
          padding: "1px 6px",
          minWidth: 80,
          width: "100%",
          backdropFilter: "blur(4px)",
        }}
      />
    );
  }

  return (
    <Tag
      onClick={() => setEditing(true)}
      title="Click to edit"
      className={className}
      style={{
        ...style,
        cursor: "text",
        borderRadius: 6,
        padding: "1px 4px",
        transition: "background 0.15s",
        display: "block",
      }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.12)"; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
    >
      {value || <span style={{ opacity: 0.35 }}>{placeholder}</span>}
    </Tag>
  );
}

/** Inline editable textarea — multi-line */
function InlineBio({
  value, placeholder, onChange, style,
}: {
  value: string; placeholder: string; onChange: (v: string) => void; style?: React.CSSProperties;
}) {
  const [editing, setEditing] = useState(false);

  if (editing) {
    return (
      <textarea
        autoFocus
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        onBlur={() => setEditing(false)}
        rows={3}
        style={{
          ...style,
          background: "rgba(255,255,255,0.15)",
          border: "1.5px solid rgba(255,255,255,0.5)",
          borderRadius: 6,
          outline: "none",
          padding: "4px 6px",
          width: "100%",
          resize: "none",
          backdropFilter: "blur(4px)",
          fontSize: "0.75rem",
        }}
      />
    );
  }

  return (
    <p
      onClick={() => setEditing(true)}
      title="Click to edit"
      style={{
        ...style,
        cursor: "text",
        borderRadius: 6,
        padding: "2px 4px",
        transition: "background 0.15s",
        minHeight: 36,
        whiteSpace: "pre-wrap",
      }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.12)"; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
    >
      {value || <span style={{ opacity: 0.35 }}>{placeholder}</span>}
    </p>
  );
}

export function ProfileSectionPreview({ data, sectionId }: Props) {
  const { layout, updateSection, selectedSectionId } = useBuilderStore();
  const { secondaryColor, accentColor, darkMode, coverStyle, backgroundPattern, glassEffect, neonGlow, avatarShape } = layout.theme as Record<string, unknown> & typeof layout.theme;

  // Resolve section id: use passed prop, or fall back to selected
  const resolvedId = sectionId ?? selectedSectionId ?? "";

  const update = (key: string, value: unknown) => {
    if (resolvedId) updateSection(resolvedId, { [key]: value });
  };

  const name = (data.name as string) || "";
  const profession = (data.profession as string) || "";
  const company = (data.company as string) || "";
  const bio = (data.bio as string) || "";
  const tagline = (data.tagline as string) || "";
  const photo = data.photo as string | undefined;
  const banner = data.banner as string | undefined;

  // Image upload refs
  const bannerRef = useRef<HTMLInputElement>(null);
  const photoRef = useRef<HTMLInputElement>(null);
  const [uploadingBanner, setUploadingBanner] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  async function handleBannerUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingBanner(true);
    try { update("banner", await uploadImage(file)); } finally { setUploadingBanner(false); if (bannerRef.current) bannerRef.current.value = ""; }
  }

  async function handlePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingPhoto(true);
    try { update("photo", await uploadImage(file)); } finally { setUploadingPhoto(false); if (photoRef.current) photoRef.current.value = ""; }
  }

  // Cover background
  let coverBg = `linear-gradient(135deg, ${secondaryColor}, ${accentColor})`;
  if (coverStyle === "glass") coverBg = `linear-gradient(135deg, ${secondaryColor}40, ${accentColor}30)`;
  else if (coverStyle === "neon") coverBg = `linear-gradient(135deg, ${secondaryColor}20, ${accentColor}10)`;
  else if (coverStyle === "none") coverBg = darkMode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)";
  else if (coverStyle === "pattern" && backgroundPattern) coverBg = `linear-gradient(135deg, ${secondaryColor}30, ${accentColor}20)`;

  const avatarRadius = avatarShape === "square" ? "8px" : avatarShape === "hexagon" ? "30% 70% 70% 30% / 30% 30% 70% 70%" : "50%";
  const neonStyle = neonGlow ? { boxShadow: `0 0 20px ${secondaryColor}80, 0 0 40px ${secondaryColor}40` } : {};
  const neonTextStyle = neonGlow ? { textShadow: `0 0 10px ${secondaryColor}` } : {};
  const neonBorderStyle = neonGlow ? { border: `1px solid ${secondaryColor}60`, boxShadow: `0 0 10px ${secondaryColor}40` } : {};
  const glassCardStyle = glassEffect ? {
    background: "rgba(255,255,255,0.08)", backdropFilter: "blur(12px)",
    WebkitBackdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.15)",
  } : {};

  const textColor = darkMode ? "#F8FAFC" : "#0F172A";

  return (
    <div className="relative">
      {/* ── Cover / Banner ── */}
      <div
        className="h-28 relative overflow-hidden cursor-pointer group"
        style={{ background: coverBg }}
        onClick={() => bannerRef.current?.click()}
        title="Click to change banner"
      >
        {banner && <img src={banner} alt="banner" className="absolute inset-0 w-full h-full object-cover" />}
        {backgroundPattern && backgroundPattern !== "noise" && (
          <div className="absolute inset-0" style={{
            backgroundImage: getPatternCSS(backgroundPattern as string, secondaryColor),
            backgroundSize: backgroundPattern === "dots" ? "20px 20px" : backgroundPattern === "grid" ? "20px 20px" : "10px 10px",
            opacity: 0.6,
          }} />
        )}
        {neonGlow && (
          <div className="absolute inset-0 opacity-10"
            style={{ backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 2px, ${secondaryColor}30 2px, ${secondaryColor}30 4px)` }} />
        )}
        {glassEffect && (
          <div className="absolute inset-0 opacity-20"
            style={{ backgroundImage: `linear-gradient(135deg, rgba(255,255,255,0.3) 0%, transparent 50%, rgba(255,255,255,0.1) 100%)` }} />
        )}
        {neonGlow && (
          <div className="absolute bottom-0 left-0 right-0 h-px" style={{ background: secondaryColor, boxShadow: `0 0 8px ${secondaryColor}` }} />
        )}
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1 pointer-events-none">
          {uploadingBanner
            ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            : <><ImageIcon className="w-4 h-4 text-white" /><span className="text-white text-xs font-medium">Change Banner</span></>
          }
        </div>
        <input ref={bannerRef} type="file" accept="image/*" className="hidden" onChange={handleBannerUpload} />
      </div>

      <div className="px-5 pb-5" style={glassEffect ? { ...glassCardStyle, margin: "0 8px 8px", borderRadius: "12px", marginTop: "-16px" } : {}}>
        {/* ── Avatar + Verified ── */}
        <div className="relative -mt-12 mb-3 flex items-end justify-between" style={glassEffect ? { marginTop: "-8px" } : {}}>
          {/* Avatar — click to upload */}
          <div
            className="w-20 h-20 border-4 shadow-xl overflow-hidden flex-shrink-0 cursor-pointer group/avatar relative"
            style={{
              borderRadius: avatarRadius,
              borderColor: darkMode ? "#1E293B" : "#FFFFFF",
              background: `${secondaryColor}20`,
              ...neonStyle,
              ...(glassEffect ? { borderColor: `${secondaryColor}40`, background: "rgba(255,255,255,0.1)" } : {}),
            }}
            onClick={() => photoRef.current?.click()}
            title="Click to change photo"
          >
            {photo
              ? <img src={photo} alt={name} className="w-full h-full object-cover" />
              : <div className="w-full h-full flex items-center justify-center">
                  <Camera className="w-7 h-7" style={{ color: secondaryColor }} />
                </div>
            }
            {/* Hover overlay on avatar */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/avatar:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
              {uploadingPhoto
                ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                : <Camera className="w-5 h-5 text-white" />
              }
            </div>
          </div>
          <input ref={photoRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />

          {/* Verified badge */}
          <div className="mb-1 px-2 py-0.5 rounded-full text-xs font-medium text-white"
            style={{
              background: neonGlow ? "transparent" : `linear-gradient(135deg, ${secondaryColor}, ${accentColor})`,
              ...(neonGlow ? { border: `1px solid ${secondaryColor}`, color: secondaryColor, ...neonBorderStyle } : {}),
            }}>
            ✓ Verified
          </div>
        </div>

        {/* ── Inline-editable text fields ── */}
        <InlineText
          as="h2"
          value={name}
          placeholder="Your Name"
          onChange={(v) => update("name", v)}
          className="font-display font-bold text-xl leading-tight"
          style={{ color: textColor, ...neonTextStyle }}
        />
        <InlineText
          value={profession}
          placeholder="Your Profession"
          onChange={(v) => update("profession", v)}
          className="font-semibold text-sm mt-0.5"
          style={{ color: secondaryColor, ...(neonGlow ? { textShadow: `0 0 8px ${secondaryColor}` } : {}) }}
        />
        <InlineText
          value={company}
          placeholder="Your Company"
          onChange={(v) => update("company", v)}
          className="text-xs mt-0.5 opacity-60"
          style={{ color: textColor }}
        />
        {(tagline || true) && (
          <InlineText
            value={tagline}
            placeholder="Add a tagline..."
            onChange={(v) => update("tagline", v)}
            className="text-xs mt-1.5 italic opacity-50"
            style={{ color: textColor }}
          />
        )}
        <InlineBio
          value={bio}
          placeholder="Write your bio here..."
          onChange={(v) => update("bio", v)}
          style={{ color: darkMode ? "#F8FAFC" : "#374151", opacity: 0.7, fontSize: "0.875rem", marginTop: 12, lineHeight: 1.6 }}
        />
      </div>
    </div>
  );
}
