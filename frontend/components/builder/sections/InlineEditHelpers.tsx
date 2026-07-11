"use client";

import { useRef, useState } from "react";
import { Camera, ImageIcon } from "lucide-react";

// ─── Image upload helper ──────────────────────────────────────────────────────
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

export async function uploadImage(file: File): Promise<string> {
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

// ─── Inline single-line text ──────────────────────────────────────────────────
export function InlineText({
  value, placeholder, onChange, className, style, as: Tag = "span",
}: {
  value: string; placeholder: string; onChange: (v: string) => void;
  className?: string; style?: React.CSSProperties; as?: "span" | "p" | "h2" | "h3";
}) {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const hoverStyle = {
    cursor: "text", borderRadius: 5, padding: "1px 5px", display: "block",
    transition: "background 0.15s", outline: "none",
  };

  if (editing) {
    return (
      <input
        ref={inputRef}
        autoFocus
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        onBlur={() => setEditing(false)}
        onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); setEditing(false); } }}
        className={className}
        style={{
          ...style, background: "rgba(99,102,241,0.08)", border: "1.5px solid rgba(99,102,241,0.4)",
          borderRadius: 5, outline: "none", padding: "1px 5px", width: "100%",
        }}
      />
    );
  }
  return (
    <Tag
      title="Click to edit"
      className={`inline-edit-target ${className ?? ""}`}
      style={{ ...style, ...hoverStyle }}
      onClick={(e) => { e.stopPropagation(); setEditing(true); }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(99,102,241,0.08)"; (e.currentTarget as HTMLElement).style.outline = "1px dashed rgba(99,102,241,0.35)"; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.outline = "none"; }}
    >
      {value || <span style={{ opacity: 0.35 }}>{placeholder}</span>}
    </Tag>
  );
}

// ─── Inline multi-line textarea ───────────────────────────────────────────────
export function InlineBio({
  value, placeholder, onChange, style, className,
}: {
  value: string; placeholder: string; onChange: (v: string) => void;
  style?: React.CSSProperties; className?: string;
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
        className={className}
        style={{
          ...style, background: "rgba(99,102,241,0.08)", border: "1.5px solid rgba(99,102,241,0.4)",
          borderRadius: 5, outline: "none", padding: "4px 5px", width: "100%", resize: "none",
        }}
      />
    );
  }
  return (
    <p
      title="Click to edit"
      className={`inline-edit-target ${className ?? ""}`}
      style={{ ...style, cursor: "text", borderRadius: 5, padding: "2px 5px", transition: "background 0.15s", minHeight: 32, whiteSpace: "pre-wrap" }}
      onClick={(e) => { e.stopPropagation(); setEditing(true); }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(99,102,241,0.08)"; (e.currentTarget as HTMLElement).style.outline = "1px dashed rgba(99,102,241,0.35)"; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.outline = "none"; }}
    >
      {value || <span style={{ opacity: 0.35 }}>{placeholder}</span>}
    </p>
  );
}

// ─── Clickable image upload square ───────────────────────────────────────────
export function InlineImageUpload({
  value, onChange, aspectClass = "w-full h-24", icon = "image", label = "Click to upload",
}: {
  value: string; onChange: (url: string) => void;
  aspectClass?: string; icon?: "image" | "camera"; label?: string;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try { onChange(await uploadImage(file)); } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  return (
    <div
      onClick={() => !uploading && fileRef.current?.click()}
      className={`relative ${aspectClass} rounded-xl overflow-hidden cursor-pointer group border-2 border-dashed border-gray-200 dark:border-white/10 hover:border-indigo-400 transition-all`}
      title={label}
    >
      {value
        ? <img src={value} alt="" className="w-full h-full object-cover" />
        : <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 text-gray-300 dark:text-white/20">
            {icon === "camera" ? <Camera className="w-6 h-6" /> : <ImageIcon className="w-6 h-6" />}
            <span className="text-xs">{label}</span>
          </div>
      }
      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
        {uploading
          ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          : <span className="text-white text-xs font-medium">{value ? "Change" : label}</span>
        }
      </div>
      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
    </div>
  );
}
