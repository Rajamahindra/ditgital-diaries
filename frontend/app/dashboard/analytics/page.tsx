"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import { Eye, MousePointer, Users, QrCode, TrendingUp } from "lucide-react";
import { cardsAPI } from "@/lib/api";

export default function AnalyticsPage() {
  const [cards, setCards] = useState<{ id: string; username: string }[]>([]);
  const [selectedCard, setSelectedCard] = useState<string>("");
  const [analytics, setAnalytics] = useState<Record<string, unknown> | null>(null);
  const [dailyViews, setDailyViews] = useState<{ date: string; views: string }[]>([]);

  useEffect(() => {
    cardsAPI.getAll().then((res) => {
      const c = res.data.cards || [];
      setCards(c);
      if (c.length > 0) setSelectedCard(c[0].id);
    });
  }, []);

  useEffect(() => {
    if (!selectedCard) return;
    cardsAPI.getAnalytics(selectedCard).then((res) => {
      setAnalytics(res.data.analytics);
      setDailyViews(res.data.dailyViews || []);
    });
  }, [selectedCard]);

  const stats = analytics
    ? [
        { label: "Total Views", value: analytics.total_views as string, icon: Eye, color: "#2563EB" },
        { label: "Unique Views", value: analytics.unique_views as string, icon: TrendingUp, color: "#7C3AED" },
        { label: "Button Clicks", value: analytics.button_clicks as string, icon: MousePointer, color: "#10B981" },
        { label: "QR Scans", value: analytics.qr_scans as string, icon: QrCode, color: "#F59E0B" },
      ]
    : [];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-primary dark:text-white">Analytics</h1>
          <p className="text-gray-500 dark:text-white/50 text-sm mt-1">Track your card performance</p>
        </div>
        {cards.length > 0 && (
          <select
            value={selectedCard}
            onChange={(e) => setSelectedCard(e.target.value)}
            className="bg-white dark:bg-dark-card border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2 text-sm text-primary dark:text-white outline-none"
          >
            {cards.map((c) => (
              <option key={c.id} value={c.id}>{c.username}</option>
            ))}
          </select>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map(({ label, value, icon: Icon, color }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="bg-white dark:bg-dark-card rounded-2xl p-5 border border-gray-100 dark:border-white/5"
          >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ background: `${color}15` }}>
              <Icon className="w-5 h-5" style={{ color }} />
            </div>
            <div className="text-2xl font-display font-black text-primary dark:text-white">{value || "0"}</div>
            <div className="text-gray-400 dark:text-white/40 text-xs mt-1">{label}</div>
          </motion.div>
        ))}
      </div>

      {/* Chart */}
      {dailyViews.length > 0 && (
        <div className="bg-white dark:bg-dark-card rounded-2xl p-6 border border-gray-100 dark:border-white/5">
          <h3 className="text-primary dark:text-white font-semibold mb-6">Views (Last 30 Days)</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={dailyViews}>
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#94A3B8" }} />
              <YAxis tick={{ fontSize: 11, fill: "#94A3B8" }} />
              <Tooltip
                contentStyle={{ background: "#1E293B", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", color: "#F8FAFC" }}
              />
              <Line type="monotone" dataKey="views" stroke="#2563EB" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {cards.length === 0 && (
        <div className="text-center py-16 text-gray-400 dark:text-white/30">
          Create and publish a card to see analytics.
        </div>
      )}
    </div>
  );
}
