"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Users, Mail, Phone, MessageSquare, Check } from "lucide-react";
import { cardsAPI, leadsAPI } from "@/lib/api";
import type { Lead } from "@/lib/types";

export default function LeadsPage() {
  const [cards, setCards] = useState<{ id: string; username: string }[]>([]);
  const [selectedCard, setSelectedCard] = useState<string>("");
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    cardsAPI.getAll().then((res) => {
      const c = res.data.cards || [];
      setCards(c);
      if (c.length > 0) setSelectedCard(c[0].id);
    });
  }, []);

  useEffect(() => {
    if (!selectedCard) return;
    setLoading(true);
    leadsAPI.getByCard(selectedCard)
      .then((res) => setLeads(res.data.leads || []))
      .finally(() => setLoading(false));
  }, [selectedCard]);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-primary dark:text-white">Leads</h1>
          <p className="text-gray-500 dark:text-white/50 text-sm mt-1">
            {leads.length} lead{leads.length !== 1 ? "s" : ""} captured
          </p>
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

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => <div key={i} className="h-20 rounded-2xl shimmer" />)}
        </div>
      ) : leads.length === 0 ? (
        <div className="bg-white dark:bg-dark-card rounded-2xl border border-dashed border-gray-200 dark:border-white/10 p-16 text-center">
          <Users className="w-12 h-12 text-gray-300 dark:text-white/20 mx-auto mb-4" />
          <h3 className="text-primary dark:text-white font-semibold mb-2">No leads yet</h3>
          <p className="text-gray-400 dark:text-white/40 text-sm">
            Leads will appear here when visitors fill out your contact form.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {leads.map((lead, i) => (
            <motion.div
              key={lead.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`bg-white dark:bg-dark-card rounded-2xl p-5 border transition-all ${
                lead.isRead ? "border-gray-100 dark:border-white/5" : "border-secondary/30 bg-secondary/5 dark:bg-secondary/5"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-primary dark:text-white font-semibold">{lead.name}</h3>
                    {!lead.isRead && (
                      <span className="w-2 h-2 bg-secondary rounded-full" />
                    )}
                  </div>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-white/50">
                    {lead.phone && (
                      <a href={`tel:${lead.phone}`} className="flex items-center gap-1.5 hover:text-secondary transition-colors">
                        <Phone className="w-3.5 h-3.5" />
                        {lead.phone}
                      </a>
                    )}
                    {lead.email && (
                      <a href={`mailto:${lead.email}`} className="flex items-center gap-1.5 hover:text-secondary transition-colors">
                        <Mail className="w-3.5 h-3.5" />
                        {lead.email}
                      </a>
                    )}
                  </div>
                  {lead.message && (
                    <div className="flex items-start gap-1.5 mt-2 text-sm text-gray-500 dark:text-white/50">
                      <MessageSquare className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                      <p>{lead.message}</p>
                    </div>
                  )}
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-xs text-gray-400 dark:text-white/30">
                    {new Date(lead.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
