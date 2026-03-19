"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Plus, Edit2, Eye, Trash2, Share2, MoreVertical } from "lucide-react";
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

  const handlePublishToggle = async (id: string) => {
    try {
      const res = await cardsAPI.publish(id);
      setCards((prev) => prev.map((c) => c.id === id ? res.data.card : c));
      toast.success(res.data.card.isPublished ? "Card published!" : "Card unpublished");
    } catch {
      toast.error("Failed");
    }
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
          {cards.map((card, i) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="bg-white dark:bg-dark-card rounded-2xl border border-gray-100 dark:border-white/5 overflow-hidden group hover:border-secondary/30 transition-all"
            >
              {/* Preview */}
              <div className="h-32 bg-gradient-to-br from-blue-600 to-violet-600 relative flex items-center justify-center">
                <span className="text-4xl">🪪</span>
                <div className={`absolute top-3 right-3 text-xs font-bold px-2 py-1 rounded-full ${card.isPublished ? "bg-green-500 text-white" : "bg-gray-500 text-white"}`}>
                  {card.isPublished ? "Live" : "Draft"}
                </div>
              </div>

              <div className="p-4">
                <h3 className="text-primary dark:text-white font-semibold truncate">
                  {card.layout?.meta?.title || card.username}
                </h3>
                <p className="text-gray-400 dark:text-white/30 text-xs mt-0.5 truncate">
                  /card/{card.username}
                </p>
                <p className="text-gray-300 dark:text-white/20 text-xs mt-0.5">
                  {card.uniqueId}
                </p>

                <div className="flex gap-2 mt-4">
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
                    onClick={() => handleDelete(card.id)}
                    className="p-2 rounded-lg border border-gray-200 dark:border-white/10 text-gray-400 hover:border-red-300 hover:text-red-500 transition-all"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
