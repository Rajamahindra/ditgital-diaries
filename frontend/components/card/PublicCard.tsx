"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Download, Share2, QrCode, X } from "lucide-react";
import QRCode from "qrcode";
import { toPng } from "html-to-image";
import { jsPDF } from "jspdf";
import toast from "react-hot-toast";
import { cardsAPI } from "@/lib/api";
import { downloadVCF, getCardUrl } from "@/lib/utils";
import type { Card, CardSection } from "@/lib/types";

// Section renderers for public view
import { PublicProfileSection } from "./sections/PublicProfileSection";
import { PublicContactButtons } from "./sections/PublicContactButtons";
import { PublicSocialLinks } from "./sections/PublicSocialLinks";
import { PublicServices } from "./sections/PublicServices";
import { PublicPortfolio } from "./sections/PublicPortfolio";
import { PublicTestimonials } from "./sections/PublicTestimonials";
import { PublicLeadForm } from "./sections/PublicLeadForm";
import { PublicCTA } from "./sections/PublicCTA";
import { PublicMap } from "./sections/PublicMap";
import { PublicBusinessHours } from "./sections/PublicBusinessHours";
import Link from "next/link";

function SectionRenderer({ section, cardId }: { section: CardSection; cardId: string }) {
  if (!section.visible) return null;

  const track = (event: string) => {
    cardsAPI.trackEvent(cardId, event).catch(() => {});
  };

  switch (section.type) {
    case "profile": return <PublicProfileSection data={section.data} />;
    case "contact_buttons": return <PublicContactButtons data={section.data} onTrack={track} />;
    case "social_links": return <PublicSocialLinks data={section.data} onTrack={track} />;
    case "services": return <PublicServices data={section.data} />;
    case "portfolio": return <PublicPortfolio data={section.data} />;
    case "testimonials": return <PublicTestimonials data={section.data} />;
    case "lead_form": return <PublicLeadForm data={section.data} cardId={cardId} />;
    case "cta": return <PublicCTA data={section.data} onTrack={track} />;
    case "map": return <PublicMap data={section.data} />;
    case "business_hours": return <PublicBusinessHours data={section.data} />;
    case "text":
      return (
        <div className="px-5 py-4">
          <p className="text-sm leading-relaxed" style={{ color: "inherit" }}>
            {section.data.content as string}
          </p>
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
  const theme = card.layout?.theme;
  const sections = [...(card.layout?.sections || [])].sort((a, b) => a.position - b.position);
  const profileSection = sections.find((s) => s.type === "profile");

  // Track view
  useEffect(() => {
    cardsAPI.trackEvent(card.id, "view").catch(() => {});
  }, [card.id]);

  // Generate QR
  useEffect(() => {
    QRCode.toDataURL(cardUrl, { width: 256, margin: 2, color: { dark: "#0F172A", light: "#FFFFFF" } })
      .then(setQrDataUrl)
      .catch(() => {});
  }, [cardUrl]);

  const downloadPNG = async () => {
    if (!cardRef.current) return;
    try {
      const dataUrl = await toPng(cardRef.current, { quality: 0.95, pixelRatio: 2 });
      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = `${card.username}-card.png`;
      a.click();
      toast.success("Downloaded as PNG");
    } catch {
      toast.error("Download failed");
    }
  };

  const downloadPDF = async () => {
    if (!cardRef.current) return;
    try {
      const dataUrl = await toPng(cardRef.current, { quality: 0.95, pixelRatio: 2 });
      const pdf = new jsPDF({ orientation: "portrait", unit: "px", format: [390, 800] });
      pdf.addImage(dataUrl, "PNG", 0, 0, 390, 800);
      pdf.save(`${card.username}-card.pdf`);
      toast.success("Downloaded as PDF");
    } catch {
      toast.error("Download failed");
    }
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
    <div
      className="min-h-screen flex flex-col items-center justify-start py-8 px-4"
      style={{ background: theme?.darkMode ? "#0F172A" : "#F8FAFC" }}
    >
      {/* Card */}
      <motion.div
        ref={cardRef}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl"
        style={{
          background: theme?.backgroundColor || "#FFFFFF",
          color: theme?.textColor || "#0F172A",
          fontFamily: theme?.fontFamily || "Inter",
          borderRadius: theme?.borderRadius || "24px",
        }}
      >
        {sections.map((section) => (
          <SectionRenderer key={section.id} section={section} cardId={card.id} />
        ))}
      </motion.div>

      {/* Action bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex items-center gap-3 mt-6"
      >
        <button
          onClick={() => setShowQR(true)}
          className="flex items-center gap-2 bg-white dark:bg-dark-card text-primary dark:text-white border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm font-medium hover:border-secondary hover:text-secondary transition-all shadow-sm"
        >
          <QrCode className="w-4 h-4" />
          QR Code
        </button>
        <button
          onClick={() => setShowDownload(true)}
          className="flex items-center gap-2 bg-white dark:bg-dark-card text-primary dark:text-white border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm font-medium hover:border-secondary hover:text-secondary transition-all shadow-sm"
        >
          <Download className="w-4 h-4" />
          Download
        </button>
        <button
          onClick={handleShare}
          className="flex items-center gap-2 bg-secondary text-white rounded-xl px-4 py-2.5 text-sm font-medium hover:bg-blue-700 transition-all shadow-sm"
        >
          <Share2 className="w-4 h-4" />
          Share
        </button>
      </motion.div>

      {/* Viral footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-6 text-center"
      >
        <Link
          href="/register"
          className="text-xs text-gray-400 hover:text-secondary transition-colors"
        >
          Create your own digital card on{" "}
          <span className="font-semibold gradient-text">Digital Diaries</span>
        </Link>
      </motion.div>

      {/* QR Modal */}
      {showQR && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white dark:bg-dark-card rounded-2xl p-8 max-w-xs w-full text-center shadow-2xl"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-primary dark:text-white font-bold">QR Code</h3>
              <button onClick={() => setShowQR(false)} className="text-gray-400 hover:text-primary dark:hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* QR Design selector */}
            <div className="flex gap-2 justify-center mb-4">
              {(["classic", "rounded", "branded"] as const).map((d) => (
                <button
                  key={d}
                  onClick={() => setQrDesign(d)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${qrDesign === d ? "bg-secondary text-white" : "border border-gray-200 dark:border-white/10 text-gray-500 dark:text-white/50"}`}
                >
                  {d.charAt(0).toUpperCase() + d.slice(1)}
                </button>
              ))}
            </div>

            {qrDataUrl && (
              <div className={`inline-block p-3 mb-4 ${
                qrDesign === "rounded" ? "rounded-2xl bg-gradient-to-br from-blue-500 to-violet-600 p-4" :
                qrDesign === "branded" ? "rounded-xl bg-primary p-4" :
                "rounded-xl bg-white border border-gray-100"
              }`}>
                <img
                  src={qrDataUrl}
                  alt="QR Code"
                  className={`w-44 h-44 ${qrDesign === "rounded" ? "rounded-xl" : ""}`}
                  style={qrDesign === "branded" ? { filter: "invert(1)" } : {}}
                />
                {qrDesign === "branded" && (
                  <p className="text-white text-xs font-bold mt-2 tracking-wider">DIGITAL DIARIES</p>
                )}
              </div>
            )}

            <p className="text-gray-400 dark:text-white/40 text-xs break-all mb-4">{cardUrl}</p>
            <button
              onClick={() => {
                const a = document.createElement("a");
                a.href = qrDataUrl;
                a.download = `${card.username}-qr.png`;
                a.click();
              }}
              className="w-full btn-gradient py-2.5 text-sm"
            >
              Download QR
            </button>
          </motion.div>
        </div>
      )}

      {/* Download Modal */}
      {showDownload && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white dark:bg-dark-card rounded-2xl p-6 max-w-xs w-full shadow-2xl"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-primary dark:text-white font-bold">Download Card</h3>
              <button onClick={() => setShowDownload(false)} className="text-gray-400 hover:text-primary dark:hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3">
              {[
                { label: "Download as PNG", action: downloadPNG, desc: "High-quality image" },
                { label: "Download as PDF", action: downloadPDF, desc: "Print-ready document" },
                { label: "Save Contact (.vcf)", action: downloadContact, desc: "Add to phone contacts" },
              ].map(({ label, action, desc }) => (
                <button
                  key={label}
                  onClick={() => { action(); setShowDownload(false); }}
                  className="w-full text-left p-4 rounded-xl border border-gray-100 dark:border-white/10 hover:border-secondary hover:bg-secondary/5 transition-all"
                >
                  <div className="text-primary dark:text-white text-sm font-medium">{label}</div>
                  <div className="text-gray-400 dark:text-white/40 text-xs mt-0.5">{desc}</div>
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
