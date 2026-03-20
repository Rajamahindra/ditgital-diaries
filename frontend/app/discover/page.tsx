"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Search, MapPin, Briefcase, User } from "lucide-react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { discoverAPI } from "@/lib/api";

const CATEGORIES = ["All", "Doctor", "Engineer", "Lawyer", "Photographer", "Consultant", "Real Estate", "Startup", "Designer", "Finance", "Fitness", "Wellness", "Marketing"];

type CardResult = {
  id: string;
  username: string;
  layout?: {
    sections?: {
      type: string;
      data?: { name?: string; profession?: string; company?: string; photo?: string; bio?: string };
    }[];
  };
};

export default function DiscoverPage() {
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("All");
  const [cards, setCards] = useState<CardResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const doSearch = useCallback(async () => {
    setLoading(true);
    setSearched(true);
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
  }, [search, location, category]);

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

          {/* Search bar */}
          <div className="max-w-3xl mx-auto mb-10">
            <div className="flex flex-col sm:flex-row gap-3 bg-white dark:bg-dark-card rounded-2xl p-2 border border-gray-100 dark:border-white/10 shadow-sm">
              <div className="flex-1 flex items-center gap-3 px-3">
                <Search className="w-5 h-5 text-gray-400 flex-shrink-0" />
                <input
                  type="text" value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && doSearch()}
                  placeholder="Name, profession, company..."
                  className="flex-1 bg-transparent text-primary dark:text-white placeholder-gray-400 dark:placeholder-white/30 outline-none text-sm"
                />
              </div>
              <div className="flex items-center gap-2 px-3 sm:border-l border-gray-100 dark:border-white/10">
                <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <input
                  type="text" value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && doSearch()}
                  placeholder="City, area..."
                  className="w-32 bg-transparent text-primary dark:text-white placeholder-gray-400 dark:placeholder-white/30 outline-none text-sm"
                />
              </div>
              <button onClick={doSearch} className="btn-gradient text-sm py-2.5 px-6 whitespace-nowrap rounded-xl">
                Search
              </button>
            </div>
          </div>

          {/* Category pills */}
          <div className="flex flex-wrap gap-2 justify-center mb-10">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  category === cat
                    ? "bg-secondary text-white shadow-glow-blue"
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
              {[1, 2, 3, 4, 5, 6].map((i) => <div key={i} className="h-28 rounded-2xl shimmer" />)}
            </div>
          ) : cards.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-white/5 flex items-center justify-center mx-auto mb-4">
                <User className="w-8 h-8 text-gray-300 dark:text-white/20" />
              </div>
              <p className="text-gray-400 dark:text-white/30 text-lg font-medium">
                {searched ? "No professionals found" : "Search for professionals"}
              </p>
              <p className="text-gray-300 dark:text-white/20 text-sm mt-1">
                Try searching by name, profession, or location
              </p>
            </div>
          ) : (
            <>
              <p className="text-gray-400 dark:text-white/40 text-sm mb-4">{cards.length} professional{cards.length !== 1 ? "s" : ""} found</p>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {cards.map((card, i) => {
                  const profile = card.layout?.sections?.find((s) => s.type === "profile");
                  const name = profile?.data?.name || card.username;
                  const profession = profile?.data?.profession || "";
                  const company = profile?.data?.company || "";
                  const photo = profile?.data?.photo || "";
                  const bio = profile?.data?.bio || "";

                  return (
                    <motion.div
                      key={card.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.04 }}
                    >
                      <Link
                        href={`/card/${card.username}`}
                        className="flex items-center gap-4 bg-white dark:bg-dark-card rounded-2xl p-5 border border-gray-100 dark:border-white/5 hover:border-secondary/40 hover:shadow-card-hover transition-all hover:-translate-y-1 block"
                      >
                        <div className="w-14 h-14 rounded-2xl overflow-hidden flex-shrink-0 bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center">
                          {photo ? (
                            <img src={photo} alt={name} className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-white text-xl font-bold">{name.charAt(0).toUpperCase()}</span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-primary dark:text-white font-semibold truncate">{name}</h3>
                          {profession && (
                            <p className="text-secondary text-sm font-medium truncate flex items-center gap-1">
                              <Briefcase className="w-3 h-3 flex-shrink-0" />{profession}
                            </p>
                          )}
                          {company && <p className="text-gray-400 dark:text-white/30 text-xs truncate">{company}</p>}
                          {bio && <p className="text-gray-400 dark:text-white/30 text-xs truncate mt-0.5">{bio}</p>}
                        </div>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
