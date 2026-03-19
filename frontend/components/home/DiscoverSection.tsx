"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Search, MapPin } from "lucide-react";
import Link from "next/link";

const PROFESSIONALS = [
  { name: "Dr. Priya Mehta", role: "Dermatologist", location: "Mumbai", emoji: "👩‍⚕️", color: "#2563EB" },
  { name: "Rahul Verma", role: "Architect", location: "Delhi", emoji: "🏗️", color: "#7C3AED" },
  { name: "Sneha Kapoor", role: "Photographer", location: "Bangalore", emoji: "📸", color: "#EC4899" },
  { name: "Amit Shah", role: "CA & Tax Advisor", location: "Ahmedabad", emoji: "💼", color: "#10B981" },
  { name: "Kavya Reddy", role: "Interior Designer", location: "Hyderabad", emoji: "🎨", color: "#F59E0B" },
  { name: "Rohan Nair", role: "Software Engineer", location: "Pune", emoji: "💻", color: "#06B6D4" },
];

export function DiscoverSection() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.05 });

  return (
    <section className="bg-primary section-padding" ref={ref}>
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="text-secondary text-sm font-semibold uppercase tracking-widest">
            Business Discovery
          </span>
          <h2 className="text-4xl lg:text-5xl font-display font-black text-white mt-3 mb-4">
            Discover{" "}
            <span className="gradient-text">professionals</span>{" "}
            near you
          </h2>
          <p className="text-white/50 text-lg max-w-xl mx-auto">
            Search doctors, photographers, lawyers, and more by profession and location.
          </p>
        </motion.div>

        {/* Search bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="max-w-2xl mx-auto mb-12"
        >
          <div className="flex gap-3 bg-dark-card rounded-2xl p-2 border border-white/10">
            <div className="flex-1 flex items-center gap-3 px-3">
              <Search className="w-5 h-5 text-white/30" />
              <input
                type="text"
                placeholder="Search profession... e.g. Doctors"
                className="flex-1 bg-transparent text-white placeholder-white/30 outline-none text-sm"
              />
            </div>
            <div className="flex items-center gap-2 px-3 border-l border-white/10">
              <MapPin className="w-4 h-4 text-white/30" />
              <input
                type="text"
                placeholder="Location"
                className="w-28 bg-transparent text-white placeholder-white/30 outline-none text-sm"
              />
            </div>
            <Link href="/discover" className="btn-gradient text-sm py-2.5 px-5 whitespace-nowrap">
              Search
            </Link>
          </div>
        </motion.div>

        {/* Professionals grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {PROFESSIONALS.map(({ name, role, location, emoji, color }, i) => (
            <motion.div
              key={name}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="group bg-dark-card rounded-2xl p-5 border border-white/5 hover:border-white/15 transition-all duration-300 hover:-translate-y-1 cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
                  style={{ background: `${color}20`, border: `1px solid ${color}30` }}
                >
                  {emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-semibold truncate">{name}</h3>
                  <p className="text-white/50 text-sm">{role}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <MapPin className="w-3 h-3 text-white/30" />
                    <span className="text-white/30 text-xs">{location}</span>
                  </div>
                </div>
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ background: `${color}20` }}
                >
                  <span className="text-xs" style={{ color }}>→</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link href="/discover" className="btn-secondary inline-flex items-center gap-2">
            Explore all professionals
          </Link>
        </div>
      </div>
    </section>
  );
}
