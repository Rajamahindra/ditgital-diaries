"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Eye, MousePointer, Users, QrCode, Plus, ArrowRight } from "lucide-react";
import { cardsAPI } from "@/lib/api";
import { useAuthStore } from "@/lib/store";
import type { Card } from "@/lib/types";

const STAT_ICONS = [Eye, MousePointer, Users, QrCode];
const STAT_COLORS = ["#2563EB", "#7C3AED", "#10B981", "#F59E0B"];

export default function DashboardPage() {
  const { user } = useAuthStore();
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState({ views: 0, clicks: 0, leads: 0, scans: 0 });

  useEffect(() => {
    cardsAPI.getAll()
      .then((res) => {
        const c = res.data.cards || [];
        setCards(c);
        // fetch analytics for the first card
        if (c.length > 0) {
          cardsAPI.getAnalytics(c[0].id)
            .then((r) => {
              const a = r.data.analytics as { total_views?: number; button_clicks?: number; qr_scans?: number } | undefined;
              setAnalytics({
                views: Number(a?.total_views) || 0,
                clicks: Number(a?.button_clicks) || 0,
                leads: 0,
                scans: Number(a?.qr_scans) || 0,
              });
            })
            .catch(() => {});
        }
      })
      .catch(() => setCards([]))
      .finally(() => setLoading(false));
  }, []);

  const stats = [
    { label: "Total Views", value: analytics.views.toLocaleString(), icon: Eye },
    { label: "Button Clicks", value: analytics.clicks.toLocaleString(), icon: MousePointer },
    { label: "Leads Captured", value: analytics.leads.toLocaleString(), icon: Users },
    { label: "QR Scans", value: analytics.scans.toLocaleString(), icon: QrCode },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-xl sm:text-2xl font-display font-bold text-primary dark:text-white">
            Welcome back, {user?.name?.split(" ")[0]} 👋
          </h1>
          <p className="text-gray-500 dark:text-white/50 text-sm mt-1">
            Here&apos;s what&apos;s happening with your cards today.
          </p>
        </div>
        <Link href="/dashboard/cards/new" className="btn-gradient flex items-center gap-2 text-sm w-fit">
          <Plus className="w-4 h-4" />
          New Card
        </Link>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
        {stats.map(({ label, value, icon: Icon }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="bg-white dark:bg-dark-card rounded-2xl p-4 sm:p-5 border border-gray-100 dark:border-white/5"
          >
            <div className="flex items-center justify-between mb-3">
              <div
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center"
                style={{ background: `${STAT_COLORS[i]}15` }}
              >
                <Icon className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: STAT_COLORS[i] }} />
              </div>
            </div>
            <div className="text-xl sm:text-2xl font-display font-black text-primary dark:text-white">{value}</div>
            <div className="text-gray-400 dark:text-white/40 text-xs mt-1">{label}</div>
          </motion.div>
        ))}
      </div>

      {/* Cards */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-display font-bold text-primary dark:text-white">My Cards</h2>
          <Link href="/dashboard/cards" className="text-secondary text-sm flex items-center gap-1 hover:gap-2 transition-all">
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-40 rounded-2xl shimmer" />
            ))}
          </div>
        ) : cards.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white dark:bg-dark-card rounded-2xl border border-dashed border-gray-200 dark:border-white/10 p-12 text-center"
          >
            <div className="w-16 h-16 rounded-2xl bg-gradient-accent mx-auto flex items-center justify-center mb-4">
              <Plus className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-primary dark:text-white font-semibold text-lg mb-2">
              Create your first card
            </h3>
            <p className="text-gray-400 dark:text-white/40 text-sm mb-6">
              Build your professional digital identity in minutes.
            </p>
            <Link href="/dashboard/cards/new" className="btn-gradient inline-flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Create Card
            </Link>
          </motion.div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {cards.slice(0, 3).map((card, i) => (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white dark:bg-dark-card rounded-2xl p-5 border border-gray-100 dark:border-white/5 hover:border-secondary/30 transition-all group"
              >
                <div className="h-24 rounded-xl bg-gradient-accent mb-4 flex items-center justify-center text-3xl">
                  🪪
                </div>
                <h3 className="text-primary dark:text-white font-semibold truncate">
                  {card.layout?.meta?.title || card.username}
                </h3>
                <p className="text-gray-400 dark:text-white/40 text-xs mt-1">
                  digitaldiaries.com/card/{card.username}
                </p>
                <div className="flex gap-2 mt-4">
                  <Link
                    href={`/dashboard/cards/${card.id}/edit`}
                    className="flex-1 text-center text-xs font-medium py-2 rounded-lg border border-gray-200 dark:border-white/10 text-gray-600 dark:text-white/60 hover:border-secondary hover:text-secondary transition-all"
                  >
                    Edit
                  </Link>
                  <Link
                    href={`/card/${card.username}`}
                    target="_blank"
                    className="flex-1 text-center text-xs font-medium py-2 rounded-lg bg-secondary/10 text-secondary hover:bg-secondary hover:text-white transition-all"
                  >
                    View Live
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
