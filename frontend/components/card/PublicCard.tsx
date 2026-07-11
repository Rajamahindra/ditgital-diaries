"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Download, Share2, QrCode, X, Phone, Mail, MessageCircle,
  MapPin, ExternalLink, UserPlus, ChevronLeft, ChevronRight,
  CheckCircle, Globe, Clock, Star, Briefcase, Image as ImageIcon,
} from "lucide-react";
import QRCode from "qrcode";
import { toPng } from "html-to-image";
import { jsPDF } from "jspdf";
import toast from "react-hot-toast";
import { cardsAPI } from "@/lib/api";
import { downloadVCF, getCardUrl, getPlatformColor } from "@/lib/utils";
import type { Card, CardSection } from "@/lib/types";
import { PublicLeadForm } from "./sections/PublicLeadForm";
import { PublicBusinessHours } from "./sections/PublicBusinessHours";
import { PublicMap } from "./sections/PublicMap";
import { PublicCTA } from "./sections/PublicCTA";
import Link from "next/link";

const PLATFORM_ICONS: Record<string, string> = {
  instagram: "📸", facebook: "📘", linkedin: "💼", youtube: "▶️",
  twitter: "🐦", telegram: "✈️", website: "🌐", github: "💻",
  tiktok: "🎵", spotify: "🎧", behance: "🎨", dribbble: "🏀",
  pinterest: "📌", snapchat: "👻", whatsapp: "💬",
};

// ─── Profile Section ──────────────────────────────────────────────────────────
function ProfileSection({ data, theme }: { data: Record<string, unknown>; theme: Record<string, unknown> }) {
  const primary = (theme.primaryColor as string) || "#0F172A";
  const secondary = (theme.secondaryColor as string) || "#2563EB";
  const accent = (theme.accentColor as string) || "#7C3AED";
  const textColor = (theme.textColor as string) || "#0F172A";
  const isDark = !!theme.darkMode;

  return (
    <div className="relative">
      {/* Cover Banner */}
      <div className="h-48 sm:h-56 relative overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${primary} 0%, ${secondary} 55%, ${accent} 100%)` }}>
        {data.banner ? (
          <img src={data.banner as string} alt="cover" className="absolute inset-0 w-full h-full object-cover" />
        ) : (
          <>
            <div className="absolute inset-0"
              style={{ backgroundImage: `radial-gradient(circle at 15% 50%, rgba(255,255,255,0.18) 0%, transparent 55%), radial-gradient(circle at 85% 15%, rgba(255,255,255,0.12) 0%, transparent 45%)` }} />
            <div className="absolute inset-0 opacity-10"
              style={{ backgroundImage: `repeating-linear-gradient(45deg, rgba(255,255,255,0.05) 0, rgba(255,255,255,0.05) 1px, transparent 0, transparent 50%)`, backgroundSize: "20px 20px" }} />
          </>
        )}
        <div className="absolute bottom-0 left-0 right-0 h-20"
          style={{ background: `linear-gradient(to top, ${isDark ? "rgba(0,0,0,0.5)" : "rgba(0,0,0,0.15)"}, transparent)` }} />
      </div>

      {/* Avatar + Info */}
      <div className="px-5 sm:px-8 pb-6 -mt-16 relative">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.15, type: "spring" }}
          className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl border-4 border-white shadow-2xl bg-gray-100 flex items-center justify-center overflow-hidden mb-4"
          style={{ borderColor: "white" }}>
          {data.photo ? (
            <img src={data.photo as string} alt={data.name as string} className="w-full h-full object-cover" />
          ) : (
            <span className="text-5xl">👤</span>
          )}
        </motion.div>

        {!!data.logo && (
          <div className="absolute top-4 right-5 sm:right-8 w-14 h-14 rounded-xl bg-white shadow-lg overflow-hidden border border-gray-100">
            <img src={data.logo as string} alt="logo" className="w-full h-full object-contain p-1" />
          </div>
        )}

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
          <h1 className="font-bold text-3xl sm:text-4xl leading-tight" style={{ color: textColor }}>
            {(data.name as string) || "Your Name"}
          </h1>
          {!!data.profession && (
            <p className="font-semibold text-base mt-1" style={{ color: secondary }}>
              {String(data.profession)}
            </p>
          )}
          {!!data.company && (
            <p className="text-sm mt-0.5 opacity-60" style={{ color: textColor }}>
              {String(data.company)}
            </p>
          )}
          {!!data.tagline && (
            <p className="text-sm mt-1.5 italic opacity-50" style={{ color: textColor }}>
              &ldquo;{String(data.tagline)}&rdquo;
            </p>
          )}
          {!!data.bio && (
            <p className="text-sm mt-3 leading-relaxed opacity-70 max-w-lg" style={{ color: textColor }}>
              {String(data.bio)}
            </p>
          )}
        </motion.div>
      </div>
    </div>
  );
}

// ─── Contact Buttons ──────────────────────────────────────────────────────────
function ContactSection({ data, onTrack, theme }: { data: Record<string, unknown>; onTrack: (e: string) => void; theme: Record<string, unknown> }) {
  const buttons = [
    { icon: Phone, label: "Call", color: "#22C55E", href: `tel:${data.phone}`, event: "call_click", show: !!data.phone },
    { icon: MessageCircle, label: "WhatsApp", color: "#25D366", href: `https://wa.me/${(data.whatsapp as string)?.replace(/\D/g, "")}`, event: "whatsapp_click", show: !!data.whatsapp },
    { icon: Mail, label: "Email", color: "#2563EB", href: `mailto:${data.email}`, event: "email_click", show: !!data.email },
    { icon: MapPin, label: "Location", color: "#EF4444", href: `https://maps.google.com/?q=${encodeURIComponent((data.address as string) || "")}`, event: "maps_click", show: !!data.address },
  ].filter((b) => b.show);

  if (buttons.length === 0) return null;

  const cols = buttons.length === 1 ? "grid-cols-1" : buttons.length === 2 ? "grid-cols-2" : buttons.length === 3 ? "grid-cols-3" : "grid-cols-4";

  return (
    <div className="px-5 sm:px-8 py-5">
      <div className={`grid gap-3 ${cols}`}>
        {buttons.map(({ icon: Icon, label, color, href, event }) => (
          <a key={label} href={href} onClick={() => onTrack(event)} target={event === "maps_click" ? "_blank" : undefined} rel="noopener noreferrer"
            className="flex flex-col items-center gap-2 py-4 rounded-2xl border-2 transition-all hover:scale-105 active:scale-95 font-medium"
            style={{ background: `${color}12`, borderColor: `${color}30`, color }}>
            <Icon className="w-6 h-6" />
            <span className="text-xs font-semibold">{label}</span>
          </a>
        ))}
      </div>
    </div>
  );
}

// ─── Social Links ─────────────────────────────────────────────────────────────
function SocialSection({ data, onTrack }: { data: Record<string, unknown>; onTrack: (e: string) => void }) {
  const links = (data.links as { platform: string; url: string }[]) || [];
  const visible = links.filter((l) => l.url);
  if (visible.length === 0) return null;

  return (
    <div className="px-5 sm:px-8 py-5">
      <p className="text-xs font-bold uppercase tracking-widest opacity-40 mb-4">Connect With Me</p>
      <div className="flex flex-wrap gap-3">
        {visible.map(({ platform, url }, i) => {
          const color = getPlatformColor(platform);
          return (
            <a key={i} href={url} target="_blank" rel="noopener noreferrer"
              onClick={() => onTrack(`social_${platform}_click`)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 text-sm font-medium transition-all hover:scale-105"
              style={{ background: `${color}12`, borderColor: `${color}30`, color }}>
              <span className="text-base">{PLATFORM_ICONS[platform.toLowerCase()] || "🔗"}</span>
              <span className="capitalize">{platform}</span>
              <ExternalLink className="w-3 h-3 opacity-50" />
            </a>
          );
        })}
      </div>
    </div>
  );
}

// ─── Services ─────────────────────────────────────────────────────────────────
function ServicesSection({ data, theme }: { data: Record<string, unknown>; theme: Record<string, unknown> }) {
  const items = (data.items as { id: string; title: string; description: string; price?: string }[]) || [];
  if (items.length === 0) return null;
  const secondary = (theme.secondaryColor as string) || "#2563EB";
  const textColor = (theme.textColor as string) || "#0F172A";

  const SERVICE_ICONS = ["💊", "🏥", "🩺", "💉", "🧬", "🔬", "🏋️", "🧘", "🌿", "💆", "🎯", "⚡", "🌟", "🔑", "📊", "💡", "🎨", "📸", "⚖️", "🏠"];

  return (
    <div className="px-5 sm:px-8 py-5">
      <div className="flex items-center gap-2 mb-4">
        <Briefcase className="w-4 h-4 opacity-40" style={{ color: textColor }} />
        <p className="text-xs font-bold uppercase tracking-widest opacity-40" style={{ color: textColor }}>Our Services</p>
      </div>
      <div className="space-y-3">
        {items.map((item, idx) => (
          <motion.div key={item.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.06 }}
            className="flex items-start gap-3 p-4 rounded-2xl transition-all hover:scale-[1.01]"
            style={{ background: `${secondary}08`, border: `1px solid ${secondary}18` }}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-lg"
              style={{ background: `${secondary}15` }}>
              {SERVICE_ICONS[idx % SERVICE_ICONS.length]}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm" style={{ color: textColor }}>{item.title}</p>
              {item.description && <p className="text-xs mt-0.5 opacity-60 leading-relaxed" style={{ color: textColor }}>{item.description}</p>}
            </div>
            {item.price && (
              <span className="text-sm font-bold flex-shrink-0" style={{ color: secondary }}>{item.price}</span>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ─── Testimonials ─────────────────────────────────────────────────────────────
function TestimonialsSection({ data, theme }: { data: Record<string, unknown>; theme: Record<string, unknown> }) {
  const items = (data.items as { id: string; name: string; role: string; content: string; rating: number }[]) || [];
  if (items.length === 0) return null;
  const secondary = (theme.secondaryColor as string) || "#2563EB";
  const textColor = (theme.textColor as string) || "#0F172A";

  return (
    <div className="px-5 sm:px-8 py-5">
      <div className="flex items-center gap-2 mb-4">
        <Star className="w-4 h-4 opacity-40" style={{ color: textColor }} />
        <p className="text-xs font-bold uppercase tracking-widest opacity-40" style={{ color: textColor }}>Reviews</p>
      </div>
      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className="p-4 rounded-2xl" style={{ background: `${secondary}08`, border: `1px solid ${secondary}18` }}>
            <div className="flex items-center gap-1 mb-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5" fill={i < item.rating ? "#F59E0B" : "none"} stroke={i < item.rating ? "#F59E0B" : "#D1D5DB"} />
              ))}
            </div>
            <p className="text-sm italic opacity-70 leading-relaxed mb-3" style={{ color: textColor }}>&ldquo;{item.content}&rdquo;</p>
            <div>
              <p className="text-sm font-semibold" style={{ color: textColor }}>{item.name}</p>
              {item.role && <p className="text-xs opacity-50" style={{ color: textColor }}>{item.role}</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Portfolio ────────────────────────────────────────────────────────────────
function PortfolioSection({ data, theme }: { data: Record<string, unknown>; theme: Record<string, unknown> }) {
  const items = (data.items as { id: string; title: string; description?: string; image?: string; link?: string }[]) || [];
  const visible = items.filter((i) => i.title || i.image);
  if (visible.length === 0) return null;
  const secondary = (theme.secondaryColor as string) || "#2563EB";
  const textColor = (theme.textColor as string) || "#0F172A";

  return (
    <div className="px-5 sm:px-8 py-5">
      <p className="text-xs font-bold uppercase tracking-widest opacity-40 mb-4" style={{ color: textColor }}>Portfolio</p>
      <div className="grid grid-cols-2 gap-3">
        {visible.map((item) => (
          <a key={item.id} href={item.link || "#"} target={item.link ? "_blank" : undefined} rel="noopener noreferrer"
            className="rounded-2xl overflow-hidden border transition-all hover:scale-[1.02]"
            style={{ borderColor: `${secondary}20` }}>
            {item.image ? (
              <img src={item.image} alt={item.title} className="w-full h-28 object-cover" />
            ) : (
              <div className="w-full h-28 flex items-center justify-center" style={{ background: `${secondary}10` }}>
                <ImageIcon className="w-8 h-8 opacity-30" style={{ color: secondary }} />
              </div>
            )}
            <div className="p-2.5">
              <p className="text-xs font-semibold truncate" style={{ color: textColor }}>{item.title}</p>
              {item.description && <p className="text-xs opacity-50 truncate mt-0.5" style={{ color: textColor }}>{item.description}</p>}
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}

// ─── Gallery with Lightbox ────────────────────────────────────────────────────
function GallerySection({ data, theme }: { data: Record<string, unknown>; theme: Record<string, unknown> }) {
  const images = (data.images as { id: string; url: string; caption?: string }[]) || [];
  const visible = images.filter((i) => i.url);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const textColor = (theme.textColor as string) || "#0F172A";

  if (visible.length === 0) return null;

  return (
    <div className="px-5 sm:px-8 py-5">
      <div className="flex items-center gap-2 mb-4">
        <ImageIcon className="w-4 h-4 opacity-40" style={{ color: textColor }} />
        <p className="text-xs font-bold uppercase tracking-widest opacity-40" style={{ color: textColor }}>Gallery</p>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {visible.map((img, idx) => (
          <motion.div key={img.id} whileHover={{ scale: 1.03 }} onClick={() => setLightbox(idx)}
            className="rounded-xl overflow-hidden cursor-pointer aspect-square">
            <img src={img.url} alt={img.caption || `Gallery ${idx + 1}`} className="w-full h-full object-cover" />
          </motion.div>
        ))}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox !== null && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            onClick={() => setLightbox(null)}>
            <button className="absolute top-4 right-4 text-white/70 hover:text-white p-2">
              <X className="w-6 h-6" />
            </button>
            <button className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white p-2"
              onClick={(e) => { e.stopPropagation(); setLightbox((lightbox - 1 + visible.length) % visible.length); }}>
              <ChevronLeft className="w-8 h-8" />
            </button>
            <motion.img key={lightbox} initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              src={visible[lightbox].url} alt={visible[lightbox].caption || ""}
              className="max-w-full max-h-[80vh] rounded-2xl object-contain"
              onClick={(e) => e.stopPropagation()} />
            <button className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white p-2"
              onClick={(e) => { e.stopPropagation(); setLightbox((lightbox + 1) % visible.length); }}>
              <ChevronRight className="w-8 h-8" />
            </button>
            {visible[lightbox].caption && (
              <p className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/70 text-sm bg-black/50 px-4 py-2 rounded-full">
                {visible[lightbox].caption}
              </p>
            )}
            <p className="absolute bottom-6 right-6 text-white/40 text-xs">{lightbox + 1} / {visible.length}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Section Dispatcher ───────────────────────────────────────────────────────
function SectionRenderer({ section, cardId, theme }: { section: CardSection; cardId: string; theme: Record<string, unknown> }) {
  if (!section.visible) return null;
  const track = (event: string) => cardsAPI.trackEvent(cardId, event).catch(() => {});
  const textColor = (theme.textColor as string) || "#0F172A";
  const secondary = (theme.secondaryColor as string) || "#2563EB";

  switch (section.type) {
    case "profile": return <ProfileSection data={section.data} theme={theme} />;
    case "contact_buttons": return <ContactSection data={section.data} onTrack={track} theme={theme} />;
    case "social_links": return <SocialSection data={section.data} onTrack={track} />;
    case "services": return <ServicesSection data={section.data} theme={theme} />;
    case "portfolio": return <PortfolioSection data={section.data} theme={theme} />;
    case "testimonials": return <TestimonialsSection data={section.data} theme={theme} />;
    case "lead_form": return <PublicLeadForm data={section.data} cardId={cardId} />;
    case "cta": return <PublicCTA data={section.data} onTrack={track} />;
    case "map": return <PublicMap data={section.data} />;
    case "business_hours": return <PublicBusinessHours data={section.data} />;
    case "gallery": return <GallerySection data={section.data} theme={theme} />;
    case "text":
      return (
        <div className="px-5 sm:px-8 py-4">
          <p className="text-sm leading-relaxed opacity-70" style={{ color: textColor }}>{section.data.content as string}</p>
        </div>
      );
    case "image": {
      const url = section.data.url as string;
      if (!url) return null;
      return (
        <div className="px-5 sm:px-8 py-4">
          <img src={url} alt={(section.data.caption as string) || "Image"} className="w-full rounded-2xl object-cover" />
          {!!section.data.caption && <p className="text-xs opacity-50 mt-2 text-center" style={{ color: textColor }}>{String(section.data.caption)}</p>}
        </div>
      );
    }
    case "video": {
      const rawUrl = (section.data.url as string) || "";
      const ytMatch = rawUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
      const embedUrl = ytMatch ? `https://www.youtube.com/embed/${ytMatch[1]}` : rawUrl;
      if (!rawUrl) return null;
      return (
        <div className="px-5 sm:px-8 py-4">
          {!!section.data.title && <p className="text-sm font-semibold mb-3 opacity-70" style={{ color: textColor }}>{String(section.data.title)}</p>}
          <div className="relative w-full rounded-2xl overflow-hidden" style={{ paddingBottom: "56.25%" }}>
            <iframe src={embedUrl} className="absolute inset-0 w-full h-full" allowFullScreen title={section.data.title as string || "Video"} />
          </div>
        </div>
      );
    }
    default: return null;
  }
}

// ─── Main Public Card ─────────────────────────────────────────────────────────
export function PublicCard({ card }: { card: Card }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const [showQR, setShowQR] = useState(false);
  const [qrDesign, setQrDesign] = useState<"classic" | "rounded" | "branded">("classic");
  const [showDownload, setShowDownload] = useState(false);

  const cardUrl = getCardUrl(card.username);
  const theme = (card.layout?.theme as unknown as Record<string, unknown>) || {};
  const sections = [...(card.layout?.sections || [])].sort((a, b) => a.position - b.position);
  const profileSection = sections.find((s) => s.type === "profile");
  const bgColor = (theme.backgroundColor as string) || "#F8FAFC";
  const textColor = (theme.textColor as string) || "#0F172A";
  const secondaryColor = (theme.secondaryColor as string) || "#2563EB";
  const accentColor = (theme.accentColor as string) || "#7C3AED";
  const isDark = !!theme.darkMode;

  useEffect(() => { cardsAPI.trackEvent(card.id, "view").catch(() => {}); }, [card.id]);
  useEffect(() => {
    QRCode.toDataURL(cardUrl, { width: 300, margin: 2, color: { dark: "#0F172A", light: "#FFFFFF" } })
      .then(setQrDataUrl).catch(() => {});
  }, [cardUrl]);

  const downloadPNG = async () => {
    if (!cardRef.current) return;
    try {
      const dataUrl = await toPng(cardRef.current, { quality: 0.95, pixelRatio: 2 });
      const a = document.createElement("a"); a.href = dataUrl; a.download = `${card.username}-card.png`; a.click();
      toast.success("Downloaded as PNG");
    } catch { toast.error("Download failed"); }
  };

  const downloadPDF = async () => {
    if (!cardRef.current) return;
    try {
      const dataUrl = await toPng(cardRef.current, { quality: 0.95, pixelRatio: 2 });
      const pdf = new jsPDF({ orientation: "portrait", unit: "px", format: [390, 800] });
      pdf.addImage(dataUrl, "PNG", 0, 0, 390, 800);
      pdf.save(`${card.username}-card.pdf`);
      toast.success("Downloaded as PDF");
    } catch { toast.error("Download failed"); }
  };

  const downloadContact = () => {
    if (!profileSection) return;
    const contactData = card.layout?.sections?.find((s) => s.type === "contact_buttons");
    downloadVCF({
      name: profileSection.data.name as string,
      phone: contactData?.data?.phone as string,
      email: contactData?.data?.email as string,
      company: profileSection.data.company as string,
      website: cardUrl,
    });
    toast.success("Contact saved to phone");
  };

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({ title: profileSection?.data?.name as string || "Digital Card", url: cardUrl });
    } else {
      await navigator.clipboard.writeText(cardUrl);
      toast.success("Link copied!");
    }
  };

  const outerBg = isDark ? "#0F172A" : "#F1F5F9";

  return (
    <div className="min-h-screen" style={{ background: outerBg }}>
      <div className="max-w-2xl mx-auto">
        <motion.div ref={cardRef} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
          className="w-full shadow-2xl overflow-hidden"
          style={{ background: bgColor, color: textColor, fontFamily: (theme.fontFamily as string) || "Inter", borderRadius: "0 0 24px 24px", minHeight: "100vh" }}>

          {sections.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-32 px-8 text-center">
              <span className="text-6xl mb-4">🪪</span>
              <h2 className="text-2xl font-bold mb-2" style={{ color: textColor }}>Card is empty</h2>
              <p className="opacity-50 text-sm">This card has no sections yet.</p>
            </div>
          ) : (
            sections.map((section) => (
              <SectionRenderer key={section.id} section={section} cardId={card.id} theme={theme} />
            ))
          )}

          {/* Divider */}
          <div className="h-px mx-5 sm:mx-8 opacity-10" style={{ background: textColor }} />

          {/* Action Bar */}
          <div className="px-5 sm:px-8 py-6">
            <div className="flex flex-wrap gap-3 mb-4">
              <button onClick={downloadContact}
                className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold text-white transition-all hover:scale-105 flex-1 justify-center"
                style={{ background: `linear-gradient(135deg, ${secondaryColor}, ${accentColor})` }}>
                <UserPlus className="w-4 h-4" /> Add to Contacts
              </button>
              <button onClick={handleShare}
                className="flex items-center gap-2 px-5 py-3 rounded-xl border-2 text-sm font-semibold transition-all hover:scale-105"
                style={{ borderColor: `${secondaryColor}40`, color: secondaryColor, background: `${secondaryColor}10` }}>
                <Share2 className="w-4 h-4" /> Share
              </button>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowQR(true)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-semibold transition-all hover:scale-105 flex-1 justify-center"
                style={{ borderColor: `${accentColor}30`, color: accentColor, background: `${accentColor}08` }}>
                <QrCode className="w-3.5 h-3.5" /> QR Code
              </button>
              <button onClick={() => setShowDownload(true)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-semibold transition-all hover:scale-105 flex-1 justify-center"
                style={{ borderColor: `${accentColor}30`, color: accentColor, background: `${accentColor}08` }}>
                <Download className="w-3.5 h-3.5" /> Download
              </button>
            </div>
          </div>

          {/* Viral Footer */}
          <div className="px-5 sm:px-8 pb-8 text-center">
            <Link href="/register"
              className="inline-flex items-center gap-1.5 text-xs opacity-40 hover:opacity-70 transition-opacity">
              Create your own card on{" "}
              <span className="font-bold" style={{ color: secondaryColor }}>Digital Diaries</span>
            </Link>
          </div>
        </motion.div>
      </div>

      {/* QR Modal */}
      <AnimatePresence>
        {showQR && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-6 max-w-xs w-full text-center shadow-2xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-900 font-bold text-lg">QR Code</h3>
                <button onClick={() => setShowQR(false)} className="text-gray-400 hover:text-gray-700 p-1"><X className="w-5 h-5" /></button>
              </div>
              <div className="flex gap-2 justify-center mb-4">
                {(["classic", "rounded", "branded"] as const).map((d) => (
                  <button key={d} onClick={() => setQrDesign(d)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${qrDesign === d ? "text-white" : "border border-gray-200 text-gray-500"}`}
                    style={qrDesign === d ? { background: `linear-gradient(135deg, ${secondaryColor}, ${accentColor})` } : {}}>
                    {d.charAt(0).toUpperCase() + d.slice(1)}
                  </button>
                ))}
              </div>
              {qrDataUrl && (
                <div className={`inline-block p-3 mb-4 ${qrDesign === "rounded" ? "rounded-2xl p-4" : qrDesign === "branded" ? "rounded-xl p-4" : "rounded-xl bg-white border border-gray-100"}`}
                  style={qrDesign === "rounded" ? { background: `linear-gradient(135deg, ${secondaryColor}, ${accentColor})` } : qrDesign === "branded" ? { background: "#0F172A" } : {}}>
                  <img src={qrDataUrl} alt="QR Code" className={`w-44 h-44 ${qrDesign === "rounded" ? "rounded-xl" : ""}`}
                    style={qrDesign === "branded" ? { filter: "invert(1)" } : {}} />
                  {qrDesign === "branded" && <p className="text-white text-xs font-bold mt-2 tracking-wider">DIGITAL DIARIES</p>}
                </div>
              )}
              <p className="text-gray-400 text-xs break-all mb-4">{cardUrl}</p>
              <button onClick={() => { const a = document.createElement("a"); a.href = qrDataUrl; a.download = `${card.username}-qr.png`; a.click(); toast.success("QR downloaded!"); }}
                className="w-full py-3 rounded-xl text-white font-semibold text-sm"
                style={{ background: `linear-gradient(135deg, ${secondaryColor}, ${accentColor})` }}>
                Download QR
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Download Modal */}
      <AnimatePresence>
        {showDownload && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-6 max-w-xs w-full shadow-2xl">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-gray-900 font-bold text-lg">Download Card</h3>
                <button onClick={() => setShowDownload(false)} className="text-gray-400 hover:text-gray-700 p-1"><X className="w-5 h-5" /></button>
              </div>
              <div className="space-y-3">
                {[
                  { label: "Download as PNG", action: downloadPNG, desc: "High-quality image", emoji: "🖼️" },
                  { label: "Download as PDF", action: downloadPDF, desc: "Print-ready document", emoji: "📄" },
                  { label: "Save Contact (.vcf)", action: downloadContact, desc: "Add to phone contacts", emoji: "📱" },
                ].map(({ label, action, desc, emoji }) => (
                  <button key={label} onClick={() => { action(); setShowDownload(false); }}
                    className="w-full text-left p-4 rounded-xl border border-gray-100 hover:border-blue-200 hover:bg-blue-50 transition-all">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{emoji}</span>
                      <div>
                        <div className="text-gray-900 text-sm font-semibold">{label}</div>
                        <div className="text-gray-400 text-xs mt-0.5">{desc}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
