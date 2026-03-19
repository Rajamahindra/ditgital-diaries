"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, MapPin, Filter } from "lucide-react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { discoverAPI } from "@/lib/api";

const CATEGORIES = ["All", "Doctor", "Engineer", "Lawyer", "Photographer", "Consultant", "Real Estate", "Startup", "Designer"];

export default function DiscoverPage() {
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("All");
  const [cards, setCards] = useState<unknown[]>([]);
  const [loading, setLoading] = useState(false);

  const doSearch = async () => {
    setLoading(true);
    try {
      const res = await discoverAPI.search({
        q: search || undefined,
        location: location || undefined,
        category: category !== "All" ? category : undefined,
      });
      setCards(res.data.cards || []);
    } catch {
      setCards([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { doSearch(); }, [category]);

  return (
    <div className="min-h-screen bg-surface dark:bg-dark-surface">
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl lg:text-5xl font-display font-black text-primary dark:text-white mb-4">
              Discover <span className="gradient-text">Professionals</span>
            </h1>
            <p className="text-gray-500 dark:text-white/50 text-lg">
              Find doctors, photographers, lawyers, and more near you.
            </p>
          </div>

          {/* Search */}
          <div className="max-w-2xl mx-auto mb-10">
            <div className="flex gap-3 bg-white dark:bg-dark-card rounded-2xl p-2 border border-gray-100 dark:border-white/10 shadow-sm">
              <div className="flex-1 flex items-center gap-3 px-3">
                <Search className="w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && doSearch()}
                  placeholder="Search profession..."
                  className="flex-1 bg-transparent text-primary dark:text-white placeholder-gray-400 dark:placeholder-white/30 outline-none text-sm"
                />
              </div>
              <div className="flex items-center gap-2 px-3 border-l border-gray-100 dark:border-white/10">
                <MapPin className="w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Location"
                  className="w-28 bg-transparent text-primary dark:text-white placeholder-gray-400 dark:placeholder-white/30 outline-none text-sm"
                />
              </div>
              <button onClick={doSearch} className="btn-gradient text-sm py-2.5 px-5 whitespace-nowrap">
                Search
              </button>
            </div>
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-2 justify-center mb-10">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  category === cat
                    ? "bg-secondary text-white"
                    : "border border-gray-200 dark:border-white/10 text-gray-600 dark:text-white/60 hover:border-secondary hover:text-secondary"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Results */}
          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {[1, 2, 3, 4, 5, 6].map((i) => <div key={i} className="h-24 rounded-2xl shimmer" />)}
            </div>
          ) : cards.length === 0 ? (
            <div className="text-center py-16 text-gray-400 dark:text-white/30">
              No professionals found. Try a different search.
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {cards.map((card: unknown, i) => {
                const c = card as { id: string; username: string; layout?: { sections?: { type: string; data?: { name?: string; profession?: string; company?: string } }[] } };
                const profile = c.layout?.sections?.find((s) => s.type === "profile");
                return (
                  <motion.div
                    key={c.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Link
                      href={`/card/${c.username}`}
                      className="flex items-center gap-4 bg-white dark:bg-dark-card rounded-2xl p-5 border border-gray-100 dark:border-white/5 hover:border-secondary/30 transition-all hover:-translate-y-1 hover:shadow-card-hover block"
                    >
                      <div className="w-14 h-14 rounded-2xl bg-gradient-accent flex items-center justify-center text-2xl flex-shrink-0">
                        👤
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-primary dark:text-white font-semibold truncate">
                          {profile?.data?.name || c.username}
                        </h3>
                        <p className="text-gray-500 dark:text-white/50 text-sm truncate">
                          {profile?.data?.profession || "Professional"}
                        </p>
                        <p className="text-gray-400 dark:text-white/30 text-xs truncate">
                          {profile?.data?.company || ""}
                        </p>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
