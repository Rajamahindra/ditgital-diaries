"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Plus, Edit2, Eye, Trash2, Copy, Globe, GlobeLock, QrCode, X, Download } from "lucide-react";
import toast from "react-hot-toast";
import QRCode from "qrcode";
import { cardsAPI } from "@/lib/api";
import type { Card } from "@/lib/types";

function QRModal({ card, onClose }: { card: Card; onClose: () => void }) {
  const [qrDataUrl, setQrDataUrl] = useState("");
  const [design, setDesign] = useState<"classic" | "rounded" | "branded">("classic");
  const cardUrl = typeof window !== "undefined"
    ? `${window.location.origin}/card/${card.username}`
    : `/card/${card.username}`;

  useEffect(() => {
    QRCode.toDataURL(cardUrl, { width: 300, margin: 2, color: { dark: "#0F172A", light: "#FFFFFF" } })
      .then(setQrDataUrl).catch(() => {});
  }, [cardUrl]);

  const download = () => {
    const a = document.createElement("a");
    a.href = qrDataUrl;
    a.download = `${card.username}-qr.png`;
    a.click();
    toast.success("QR downloaded!");
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        className="bg-white dark:bg-dark-card rounded-2xl p-6 max-w-xs w-full shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-primary dark:text-white font-bold">QR Code</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-primary dark:hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex gap-2 justify-center mb-4">
          {(["classic", "rounded", "branded"] as const).map((d) => (
            <button key={d} onClick={() => setDesign(d)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${design === d ? "bg-secondary text-white" : "border border-gray-200 dark:border-white/10 text-gray-500 dark:text-white/50"}`}>
              {d.charAt(0).toUpperCase() + d.slice(1)}
            </button>
          ))}
        </div>

        {qrDataUrl && (
          <div className={`flex flex-col items-center mb-4 p-3 ${
            design === "rounded" ? "rounded-2xl bg-gradient-to-br from-blue-500 to-violet-600 p-4" :
            design === "branded" ? "rounded-xl bg-primary p-4" :
            "rounded-xl bg-white border border-gray-100"
          }`}>
            <img src={qrDataUrl} alt="QR" className={`w-48 h-48 ${design === "rounded" ? "rounded-xl" : ""}`}
              style={design === "branded" ? { filter: "invert(1)" } : {}} />
            {design === "branded" && (
              <p className="text-white text-xs font-bold mt-2 tracking-wider">DIGITAL DIARIES</p>
            )}
          </div>
        )}

        <p className="text-gray-400 dark:text-white/40 text-xs text-center break-all mb-4">{cardUrl}</p>
        <button onClick={download} className="w-full btn-gradient py-2.5 text-sm flex items-center justify-center gap-2">
          <Download className="w-4 h-4" /> Download QR
        </button>
      </motion.div>
    </div>
  );
}

export default function CardsPage() {
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [qrCard, setQrCard] = useState<Card | null>(null);

  const fetchCards = () => {
    cardsAPI.getAll()
      .then((res) => setCards(res.data.cards || []))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchCards(); }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this card? This cannot be undone.")) return;
    try {
      await cardsAPI.delete(id);
      setCards((prev) => prev.filter((c) => c.id !== id));
      toast.success("Card deleted");
    } catch {
      toast.error("Failed to delete");
    }
  };

  const handlePublishToggle = async (card: Card) => {
    try {
      const res = await cardsAPI.publish(card.id);
      setCards((prev) => prev.map((c) => c.id === card.id ? res.data.card : c));
      if (res.data.card.isPublished) {
        toast.success(`Card is now LIVE at /card/${card.username}`);
      } else {
        toast.success("Card unpublished");
      }
    } catch {
      toast.error("Failed to update");
    }
  };

  const copyLink = (username: string) => {
    const url = `${window.location.origin}/card/${username}`;
    navigator.clipboard.writeText(url);
    toast.success("Link copied!");
  };

  return (
    <div className="space-y-8">
      {qrCard && <QRModal card={qrCard} onClose={() => setQrCard(null)} />}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-primary dark:text-white">My Cards</h1>
          <p className="text-gray-500 dark:text-white/50 text-sm mt-1">{cards.length} card{cards.length !== 1 ? "s" : ""}</p>
        </div>
        <Link href="/dashboard/cards/new" className="btn-gradient flex items-center gap-2 text-sm">
          <Plus className="w-4 h-4" />
          New Card
        </Link>
      </div>

      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3].map((i) => <div key={i} className="h-48 rounded-2xl shimmer" />)}
        </div>
      ) : cards.length === 0 ? (
        <div className="bg-white dark:bg-dark-card rounded-2xl border border-dashed border-gray-200 dark:border-white/10 p-16 text-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-accent mx-auto flex items-center justify-center mb-4">
            <Plus className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-primary dark:text-white font-semibold text-lg mb-2">No cards yet</h3>
          <p className="text-gray-400 dark:text-white/40 text-sm mb-6">Create your first digital card.</p>
          <Link href="/dashboard/cards/new" className="btn-gradient inline-flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Create Card
          </Link>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {cards.map((card, i) => {
            const profile = card.layout?.sections?.find((s) => s.type === "profile");
            const name = profile?.data?.name as string || card.username;
            const photo = profile?.data?.photo as string || "";

            return (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="bg-white dark:bg-dark-card rounded-2xl border border-gray-100 dark:border-white/5 overflow-hidden group hover:border-secondary/30 hover:shadow-lg transition-all"
              >
                {/* Card preview banner using actual card theme colors */}
                {(() => {
                  const theme = card.layout?.theme as unknown as Record<string, unknown> | undefined;
                  const primary = (theme?.primaryColor as string) || "#0F172A";
                  const secondary = (theme?.secondaryColor as string) || "#2563EB";
                  const accent = (theme?.accentColor as string) || "#7C3AED";
                  const bgGradient = theme?.backgroundGradient as string | undefined;
                  const bannerBg = bgGradient || `linear-gradient(135deg, ${primary} 0%, ${secondary} 55%, ${accent} 100%)`;
                  return (
                    <div className="h-32 relative flex items-end overflow-hidden" style={{ background: bannerBg }}>
                      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.4) 1px, transparent 1px)", backgroundSize: "16px 16px" }} />
                      {photo && <img src={photo} alt={name} className="absolute inset-0 w-full h-full object-cover opacity-40" />}
                      {!photo && <span className="absolute inset-0 flex items-center justify-center text-5xl opacity-30">🪪</span>}
                      <div className="relative px-4 pb-3 flex items-end gap-3 w-full">
                        <div className="w-12 h-12 rounded-xl border-2 border-white/80 shadow-lg bg-white/20 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                          {name.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-white font-semibold text-sm truncate drop-shadow">{name}</p>
                          <p className="text-white/60 text-xs truncate font-mono">/card/{card.username}</p>
                        </div>
                      </div>
                      <div className={`absolute top-3 right-3 text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1 ${card.isPublished ? "bg-green-500 text-white" : "bg-black/40 text-white/80"}`}>
                        {card.isPublished ? <><Globe className="w-3 h-3" /> Live</> : <><GlobeLock className="w-3 h-3" /> Draft</>}
                      </div>
                    </div>
                  );
                })()}

                <div className="p-4">
                  {card.isPublished && (
                    <div className="mb-3 flex items-center gap-1.5 bg-green-50 dark:bg-green-500/10 rounded-lg px-2.5 py-1.5">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                      <span className="text-green-600 dark:text-green-400 text-xs font-medium truncate flex-1">
                        {typeof window !== "undefined" ? window.location.origin : "https://greaternewstv.com"}/card/{card.username}
                      </span>
                      <button onClick={() => copyLink(card.username)} className="text-green-500 hover:text-green-700 flex-shrink-0">
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}

                  <div className="flex gap-2 mt-3">
                    <Link href={`/dashboard/cards/${card.id}/edit`}
                      className="flex-1 flex items-center justify-center gap-1.5 text-xs font-medium py-2 rounded-lg border border-gray-200 dark:border-white/10 text-gray-600 dark:text-white/60 hover:border-secondary hover:text-secondary transition-all">
                      <Edit2 className="w-3.5 h-3.5" /> Edit
                    </Link>
                    <Link href={`/card/${card.username}`} target="_blank"
                      className="flex-1 flex items-center justify-center gap-1.5 text-xs font-medium py-2 rounded-lg bg-secondary/10 text-secondary hover:bg-secondary hover:text-white transition-all">
                      <Eye className="w-3.5 h-3.5" /> View
                    </Link>
                    <button onClick={() => handlePublishToggle(card)} title={card.isPublished ? "Unpublish" : "Publish"}
                      className={`p-2 rounded-lg border transition-all ${card.isPublished ? "border-green-200 dark:border-green-500/20 text-green-500 hover:bg-red-50 hover:border-red-300 hover:text-red-500" : "border-gray-200 dark:border-white/10 text-gray-400 hover:border-green-400 hover:text-green-500"}`}>
                      <Globe className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => setQrCard(card)} title="QR Code"
                      className="p-2 rounded-lg border border-gray-200 dark:border-white/10 text-gray-400 hover:border-secondary hover:text-secondary transition-all">
                      <QrCode className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => handleDelete(card.id)}
                      className="p-2 rounded-lg border border-gray-200 dark:border-white/10 text-gray-400 hover:border-red-300 hover:text-red-500 transition-all">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
