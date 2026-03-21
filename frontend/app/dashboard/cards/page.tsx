"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Plus, Edit2, Eye, Trash2, Copy, Globe, GlobeLock } from "lucide-react";
import toast from "react-hot-toast";
import { cardsAPI } from "@/lib/api";
import type { Card } from "@/lib/types";

export default function CardsPage() {
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);

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
      const isNowPublished = res.data.card.isPublished;
      if (isNowPublished) {
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
                className="bg-white dark:bg-dark-card rounded-2xl border border-gray-100 dark:border-white/5 overflow-hidden group hover:border-secondary/30 transition-all"
              >
                {/* Preview */}
                <div className="h-32 bg-gradient-to-br from-blue-600 to-violet-600 relative flex items-center justify-center overflow-hidden">
                  {photo ? (
                    <img src={photo} alt={name} className="w-full h-full object-cover opacity-60" />
                  ) : (
                    <span className="text-5xl">🪪</span>
                  )}
                  <div className={`absolute top-3 right-3 text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1 ${card.isPublished ? "bg-green-500 text-white" : "bg-gray-500/80 text-white"}`}>
                    {card.isPublished ? <><Globe className="w-3 h-3" /> Live</> : <><GlobeLock className="w-3 h-3" /> Draft</>}
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="text-primary dark:text-white font-semibold truncate">{name}</h3>
                  <p className="text-gray-400 dark:text-white/30 text-xs mt-0.5 truncate font-mono">
                    /card/{card.username}
                  </p>

                  {/* Live link — only show when published */}
                  {card.isPublished && (
                    <div className="mt-2 flex items-center gap-1.5 bg-green-50 dark:bg-green-500/10 rounded-lg px-2.5 py-1.5">
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
                    <Link
                      href={`/dashboard/cards/${card.id}/edit`}
                      className="flex-1 flex items-center justify-center gap-1.5 text-xs font-medium py-2 rounded-lg border border-gray-200 dark:border-white/10 text-gray-600 dark:text-white/60 hover:border-secondary hover:text-secondary transition-all"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      Edit
                    </Link>
                    <Link
                      href={`/card/${card.username}`}
                      target="_blank"
                      className="flex-1 flex items-center justify-center gap-1.5 text-xs font-medium py-2 rounded-lg bg-secondary/10 text-secondary hover:bg-secondary hover:text-white transition-all"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      View
                    </Link>
                    <button
                      onClick={() => handlePublishToggle(card)}
                      title={card.isPublished ? "Unpublish" : "Publish"}
                      className={`p-2 rounded-lg border transition-all ${card.isPublished ? "border-green-200 dark:border-green-500/20 text-green-500 hover:bg-red-50 hover:border-red-300 hover:text-red-500" : "border-gray-200 dark:border-white/10 text-gray-400 hover:border-green-400 hover:text-green-500"}`}
                    >
                      <Globe className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(card.id)}
                      className="p-2 rounded-lg border border-gray-200 dark:border-white/10 text-gray-400 hover:border-red-300 hover:text-red-500 transition-all"
                    >
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
