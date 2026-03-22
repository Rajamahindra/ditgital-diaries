"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Download, Share2, QrCode, X, Phone, Mail, MessageCircle, MapPin, ExternalLink } from "lucide-react";
import QRCode from "qrcode";
import { toPng } from "html-to-image";
import { jsPDF } from "jspdf";
import toast from "react-hot-toast";
import { cardsAPI } from "@/lib/api";
import { downloadVCF, getCardUrl, getPlatformColor } from "@/lib/utils";
import type { Card, CardSection } from "@/lib/types";
import { PublicLeadForm } from "./sections/PublicLeadForm";
import { PublicServices } from "./sections/PublicServices";
import { PublicTestimonials } from "./sections/PublicTestimonials";
import { PublicPortfolio } from "./sections/PublicPortfolio";
import { PublicBusinessHours } from "./sections/PublicBusinessHours";
import { PublicMap } from "./sections/PublicMap";
import { PublicCTA } from "./sections/PublicCTA";
import Link from "next/link";

const PLATFORM_ICONS: Record<string, string> = {
  instagram: "📸", facebook: "📘", linkedin: "💼", youtube: "▶️",
  twitter: "🐦", telegram: "✈️", website: "🌐", github: "💻", tiktok: "🎵",
};

function ProfileSection({ data, theme }: { data: Record<string, unknown>; theme: Record<string, unknown> }) {
  const primaryColor = (theme.primaryColor as string) || "#0F172A";
  const secondaryColor = (theme.secondaryColor as string) || "#2563EB";
  const accentColor = (theme.accentColor as string) || "#7C3AED";

  return (
    <div className="relative">
      {/* Banner */}
      <div className="h-44 sm:h-52 relative overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 50%, ${accentColor} 100%)` }}>
        {data.banner ? (
          <img src={data.banner as string} alt="banner" className="absolute inset-0 w-full h-full object-cover" />
        ) : (
          <>
            <div className="absolute inset-0 opacity-20"
              style={{ backgroundImage: "radial-gradient(circle at 20% 50%, rgba(255,255,255,0.5) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.3) 0%, transparent 40%)" }} />
            <div className="absolute bottom-0 left-0 right-0 h-16"
              style={{ background: "linear-gradient(to top, rgba(0,0,0,0.2), transparent)" }} />
          </>
        )}
      </div>

      {/* Avatar + Info */}
      <div className="px-5 sm:px-8 pb-6 -mt-14 relative">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.2 }}
          className="w-28 h-28 rounded-2xl border-4 border-white shadow-2xl bg-gray-100 flex items-center justify-center overflow-hidden mb-4"
          style={{ borderColor: "white" }}>
          {data.photo ? (
            <img src={data.photo as string} alt={data.name as string} className="w-full h-full object-cover" />
          ) : (
            <span className="text-5xl">👤</span>
          )}
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <h1 className="font-bold text-3xl sm:text-4xl leading-tight" style={{ color: theme.textColor as string || "#0F172A" }}>
            {data.name as string || "Your Name"}
          </h1>
          {!!data.profession && (
            <p className="font-semibold text-base mt-1" style={{ color: secondaryColor }}>
              {String(data.profession)}
            </p>
          )}
          {!!data.company && (
            <p className="text-sm mt-0.5 opacity-60" style={{ color: theme.textColor as string || "#0F172A" }}>
              {String(data.company)}
            </p>
          )}
          {!!data.tagline && (
            <p className="text-sm mt-1 italic opacity-50" style={{ color: theme.textColor as string || "#0F172A" }}>
              &ldquo;{String(data.tagline)}&rdquo;
            </p>
          )}
          {!!data.bio && (
            <p className="text-sm mt-3 leading-relaxed opacity-70 max-w-lg" style={{ color: theme.textColor as string || "#0F172A" }}>
              {String(data.bio)}
            </p>
          )}
        </motion.div>
      </div>
    </div>
  );
}

function ContactSection({ data, onTrack, theme }: { data: Record<string, unknown>; onTrack: (e: string) => void; theme: Record<string, unknown> }) {
  const buttons = [
    { icon: Phone, label: "Call", color: "#22C55E", href: `tel:${data.phone}`, event: "call_click", show: !!data.phone },
    { icon: MessageCircle, label: "WhatsApp", color: "#25D366", href: `https://wa.me/${(data.whatsapp as string)?.replace(/\D/g, "")}`, event: "whatsapp_click", show: !!data.whatsapp },
    { icon: Mail, label: "Email", color: "#2563EB", href: `mailto:${data.email}`, event: "email_click", show: !!data.email },
    { icon: MapPin, label: "Location", color: "#EF4444", href: `https://maps.google.com/?q=${encodeURIComponent(data.address as string || "")}`, event: "maps_click", show: !!data.address },
  ].filter((b) => b.show);

  if (buttons.length === 0) return null;

  return (
    <div className="px-5 sm:px-8 py-5">
      <div className={`grid gap-3 ${buttons.length === 1 ? "grid-cols-1" : buttons.length === 2 ? "grid-cols-2" : buttons.length === 3 ? "grid-cols-3" : "grid-cols-4"}`}>
        {buttons.map(({ icon: Icon, label, color, href, event }) => (
          <a key={label} href={href} onClick={() => onTrack(event)}
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

function SocialSection({ data, onTrack }: { data: Record<string, unknown>; onTrack: (e: string) => void }) {
  const links = (data.links as { platform: string; url: string }[]) || [];
  if (links.length === 0) return null;

  return (
    <div className="px-5 sm:px-8 py-5">
      <p className="text-xs font-bold uppercase tracking-widest opacity-40 mb-4">Connect With Me</p>
      <div className="flex flex-wrap gap-3">
        {links.filter(l => l.url).map(({ platform, url }, i) => {
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

function SectionRenderer({ section, cardId, theme }: { section: CardSection; cardId: string; theme: Record<string, unknown> }) {
  if (!section.visible) return null;
  const track = (event: string) => cardsAPI.trackEvent(cardId, event).catch(() => {});

  switch (section.type) {
    case "profile": return <ProfileSection data={section.data} theme={theme} />;
    case "contact_buttons": return <ContactSection data={section.data} onTrack={track} theme={theme} />;
    case "social_links": return <SocialSection data={section.data} onTrack={track} />;
    case "services": return <PublicServices data={section.data} />;
    case "portfolio": return <PublicPortfolio data={section.data} />;
    case "testimonials": return <PublicTestimonials data={section.data} />;
    case "lead_form": return <PublicLeadForm data={section.data} cardId={cardId} />;
    case "cta": return <PublicCTA data={section.data} onTrack={track} />;
    case "map": return <PublicMap data={section.data} />;
    case "business_hours": return <PublicBusinessHours data={section.data} />;
    case "text":
      return (
        <div className="px-5 sm:px-8 py-4">
          <p className="text-sm leading-relaxed opacity-70">{section.data.content as string}</p>
        </div>
      );
    default: return null;
  }
}

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

  useEffect(() => { cardsAPI.trackEvent(card.id, "view").catch(() => {}); }, [card.id]);
  useEffect(() => {
    QRCode.toDataURL(cardUrl, { width: 256, margin: 2, color: { dark: "#0F172A", light: "#FFFFFF" } })
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
    toast.success("Contact saved");
  };

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({ title: profileSection?.data?.name as string || "Digital Card", url: cardUrl });
    } else {
      await navigator.clipboard.writeText(cardUrl);
      toast.success("Link copied!");
    }
  };

  return (
    <div className="min-h-screen" style={{ background: theme.darkMode ? "#0F172A" : "#F1F5F9" }}>
      {/* Full-width card */}
      <div className="max-w-2xl mx-auto">
        <motion.div ref={cardRef} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full shadow-2xl overflow-hidden"
          style={{ background: bgColor, color: textColor, fontFamily: (theme.fontFamily as string) || "Inter",
            borderRadius: "0 0 24px 24px", minHeight: "100vh" }}>
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

          {/* Action bar inside card */}
          <div className="px-5 sm:px-8 py-6 flex flex-wrap gap-3">
            <button onClick={() => setShowQR(true)}
              className="flex items-center gap-2 px-5 py-3 rounded-xl border-2 text-sm font-semibold transition-all hover:scale-105"
              style={{ borderColor: `${secondaryColor}40`, color: secondaryColor, background: `${secondaryColor}10` }}>
              <QrCode className="w-4 h-4" /> QR Code
            </button>
            <button onClick={() => setShowDownload(true)}
              className="flex items-center gap-2 px-5 py-3 rounded-xl border-2 text-sm font-semibold transition-all hover:scale-105"
              style={{ borderColor: `${accentColor}40`, color: accentColor, background: `${accentColor}10` }}>
              <Download className="w-4 h-4" /> Download
            </button>
            <button onClick={handleShare}
              className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold text-white transition-all hover:scale-105"
              style={{ background: `linear-gradient(135deg, ${secondaryColor}, ${accentColor})` }}>
              <Share2 className="w-4 h-4" /> Share Card
            </button>
          </div>

          {/* Viral footer */}
          <div className="px-5 sm:px-8 pb-8 text-center">
            <Link href="/register" className="text-xs opacity-40 hover:opacity-70 transition-opacity">
              Create your own card on <span className="font-bold" style={{ color: secondaryColor }}>Digital Diaries</span>
            </Link>
          </div>
        </motion.div>
      </div>

      {/* QR Modal */}
      {showQR && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl p-6 max-w-xs w-full text-center shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-900 font-bold text-lg">QR Code</h3>
              <button onClick={() => setShowQR(false)} className="text-gray-400 hover:text-gray-700 p-1">
                <X className="w-5 h-5" />
              </button>
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
              <div className={`inline-block p-3 mb-4 ${
                qrDesign === "rounded" ? "rounded-2xl p-4" :
                qrDesign === "branded" ? "rounded-xl p-4" : "rounded-xl bg-white border border-gray-100"
              }`} style={qrDesign === "rounded" ? { background: `linear-gradient(135deg, ${secondaryColor}, ${accentColor})` } :
                qrDesign === "branded" ? { background: "#0F172A" } : {}}>
                <img src={qrDataUrl} alt="QR Code" className={`w-44 h-44 ${qrDesign === "rounded" ? "rounded-xl" : ""}`}
                  style={qrDesign === "branded" ? { filter: "invert(1)" } : {}} />
                {qrDesign === "branded" && <p className="text-white text-xs font-bold mt-2 tracking-wider">DIGITAL DIARIES</p>}
              </div>
            )}
            <p className="text-gray-400 text-xs break-all mb-4">{cardUrl}</p>
            <button onClick={() => { const a = document.createElement("a"); a.href = qrDataUrl; a.download = `${card.username}-qr.png`; a.click(); }}
              className="w-full py-3 rounded-xl text-white font-semibold text-sm"
              style={{ background: `linear-gradient(135deg, ${secondaryColor}, ${accentColor})` }}>
              Download QR
            </button>
          </motion.div>
        </div>
      )}

      {/* Download Modal */}
      {showDownload && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl p-6 max-w-xs w-full shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-gray-900 font-bold text-lg">Download Card</h3>
              <button onClick={() => setShowDownload(false)} className="text-gray-400 hover:text-gray-700 p-1">
                <X className="w-5 h-5" />
              </button>
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
        </div>
      )}
    </div>
  );
}
