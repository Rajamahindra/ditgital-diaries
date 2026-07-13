"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { MapPin, ArrowRight, Star } from "lucide-react";
import Link from "next/link";

const CATEGORIES = [
  { label: "Doctors",           count: "2,400+", color: "#2563EB", bg: "#EFF6FF", darkBg: "rgba(37,99,235,0.1)", emoji: "🩺" },
  { label: "Photographers",     count: "890+",   color: "#EC4899", bg: "#FDF2F8", darkBg: "rgba(236,72,153,0.1)",emoji: "📸" },
  { label: "Lawyers",           count: "1,200+", color: "#D97706", bg: "#FFFBEB", darkBg: "rgba(217,119,6,0.1)", emoji: "⚖️" },
  { label: "Interior Designers",count: "640+",   color: "#7C3AED", bg: "#F5F3FF", darkBg: "rgba(124,58,237,0.1)",emoji: "🎨" },
  { label: "Architects",        count: "530+",   color: "#0891B2", bg: "#ECFEFF", darkBg: "rgba(8,145,178,0.1)", emoji: "🏗️" },
  { label: "Consultants",       count: "3,100+", color: "#059669", bg: "#ECFDF5", darkBg: "rgba(5,150,105,0.1)", emoji: "💼" },
];

const FEATURED = [
  {
    name: "Dr. Priya Mehta",
    role: "Dermatologist",
    location: "Mumbai",
    rating: 4.9,
    reviews: 128,
    available: true,
    color: "#2563EB",
    initials: "PM",
  },
  {
    name: "Rahul Sharma",
    role: "Product Designer",
    location: "Bangalore",
    rating: 5.0,
    reviews: 64,
    available: true,
    color: "#7C3AED",
    initials: "RS",
  },
  {
    name: "Sneha Kapoor",
    role: "Wedding Photographer",
    location: "Delhi",
    rating: 4.8,
    reviews: 211,
    available: false,
    color: "#EC4899",
    initials: "SK",
  },
];

export function DiscoverSection() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.05 });

  return (
    <section className="bg-white dark:bg-[#0E0C1E] section-padding" ref={ref}>
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-12"
        >
          <div>
            <p className="text-violet-600 dark:text-violet-400 text-sm font-semibold tracking-widest uppercase mb-3">
              Discover professionals
            </p>
            <h2 className="text-4xl lg:text-5xl font-black text-gray-900 dark:text-white leading-tight">
              Find who you need.<br />
              <span className="text-gray-400 dark:text-white/40">Right here.</span>
            </h2>
          </div>
          <Link
            href="/discover"
            className="inline-flex items-center gap-2 text-violet-600 dark:text-violet-400 font-semibold text-sm hover:gap-3 transition-all self-start lg:self-auto"
          >
            Browse all professionals
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>

        {/* Category grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-12">
          {CATEGORIES.map(({ label, count, color, bg, darkBg, emoji }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: i * 0.06 }}
            >
              <Link
                href={`/discover?category=${label.toLowerCase().replace(" ", "-")}`}
                className="flex flex-col items-center gap-2 p-4 rounded-xl border border-gray-100 dark:border-white/[0.07] hover:border-gray-300 dark:hover:border-white/20 bg-white dark:bg-white/[0.03] hover:bg-gray-50 dark:hover:bg-white/[0.05] transition-all text-center group"
              >
                <span className="text-2xl">{emoji}</span>
                <p className="text-gray-800 dark:text-white font-semibold text-xs leading-tight">{label}</p>
                <p className="text-xs" style={{ color }}>{count}</p>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Featured cards */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.3 }}
          className="text-gray-400 dark:text-white/30 text-xs uppercase tracking-widest font-medium mb-5"
        >
          Featured professionals
        </motion.p>

        <div className="grid md:grid-cols-3 gap-4">
          {FEATURED.map(({ name, role, location, rating, reviews, available, color, initials }, i) => (
            <motion.div
              key={name}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.45, delay: 0.35 + i * 0.1 }}
              className="group relative bg-white dark:bg-white/[0.04] rounded-xl border border-gray-100 dark:border-white/[0.07] p-5 hover:border-gray-300 dark:hover:border-white/15 hover:shadow-md transition-all cursor-pointer"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center text-white text-sm font-black flex-shrink-0"
                    style={{ background: color }}
                  >
                    {initials}
                  </div>
                  <div>
                    <p className="text-gray-900 dark:text-white font-semibold text-sm">{name}</p>
                    <p className="text-gray-500 dark:text-white/40 text-xs">{role}</p>
                  </div>
                </div>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                  available
                    ? "text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 dark:text-emerald-400"
                    : "text-gray-400 bg-gray-100 dark:bg-white/5 dark:text-white/30"
                }`}>
                  {available ? "Available" : "Busy"}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  <span className="text-gray-700 dark:text-white/70 text-xs font-semibold">{rating}</span>
                  <span className="text-gray-400 dark:text-white/30 text-xs">({reviews})</span>
                </div>
                <div className="flex items-center gap-1 text-gray-400 dark:text-white/30">
                  <MapPin className="w-3 h-3" />
                  <span className="text-xs">{location}</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-100 dark:border-white/[0.06]">
                <Link
                  href="/discover"
                  className="text-xs font-semibold transition-colors"
                  style={{ color }}
                >
                  View profile →
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
