import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCardId(id: number): string {
  const year = new Date().getFullYear();
  return `DD-${year}-${String(id).padStart(6, "0")}`;
}

export function getCardUrl(username: string): string {
  const base = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  return `${base}/card/${username}`;
}

export function generateUsername(name: string): string {
  return name
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .slice(0, 30);
}

export function getPlatformIcon(platform: string): string {
  const icons: Record<string, string> = {
    instagram: "📸",
    facebook: "📘",
    linkedin: "💼",
    youtube: "▶️",
    twitter: "🐦",
    telegram: "✈️",
    website: "🌐",
    github: "💻",
    tiktok: "🎵",
  };
  return icons[platform.toLowerCase()] || "🔗";
}

export function getPlatformColor(platform: string): string {
  const colors: Record<string, string> = {
    instagram: "#E1306C",
    facebook: "#1877F2",
    linkedin: "#0A66C2",
    youtube: "#FF0000",
    twitter: "#1DA1F2",
    telegram: "#2CA5E0",
    website: "#6366F1",
    github: "#333333",
    tiktok: "#000000",
  };
  return colors[platform.toLowerCase()] || "#6366F1";
}

export function downloadVCF(profile: {
  name: string;
  phone?: string;
  email?: string;
  company?: string;
  website?: string;
}) {
  const vcf = `BEGIN:VCARD
VERSION:3.0
FN:${profile.name}
${profile.phone ? `TEL:${profile.phone}` : ""}
${profile.email ? `EMAIL:${profile.email}` : ""}
${profile.company ? `ORG:${profile.company}` : ""}
${profile.website ? `URL:${profile.website}` : ""}
END:VCARD`;

  const blob = new Blob([vcf], { type: "text/vcard" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${profile.name.replace(/\s+/g, "_")}.vcf`;
  a.click();
  URL.revokeObjectURL(url);
}

export const DEFAULT_THEME = {
  primaryColor: "#0F172A",
  secondaryColor: "#2563EB",
  accentColor: "#7C3AED",
  backgroundColor: "#F8FAFC",
  textColor: "#0F172A",
  fontFamily: "Inter",
  borderRadius: "12px",
  darkMode: false,
};

export const SECTION_LABELS: Record<string, string> = {
  profile: "Profile Header",
  contact_buttons: "Contact Buttons",
  social_links: "Social Media",
  services: "Services",
  portfolio: "Portfolio",
  testimonials: "Testimonials",
  business_hours: "Business Hours",
  map: "Location Map",
  cta: "Call to Action",
  lead_form: "Lead Form",
  text: "Text Block",
  image: "Image",
  video: "Video",
  gallery: "Gallery",
  custom_html: "Custom HTML",
};
