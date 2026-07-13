"use client";

import Link from "next/link";
import { ArrowRight, Search, MapPin, Briefcase, Stethoscope, Camera, Scale } from "lucide-react";
import { motion } from "framer-motion";

const CATEGORIES = [
  { icon: Stethoscope, label: "Doctors",     href: "/discover?category=doctor"     },
  { icon: Briefcase,   label: "Consultants", href: "/discover?category=consultant" },
  { icon: Camera,      label: "Creatives",   href: "/discover?category=creative"   },
  { icon: Scale,       label: "Lawyers",     href: "/discover?category=lawyer"     },
];

export function HeroSection({ settings = {} }: { settings?: Record<string, string> }) {
  return (
    <section className="relative bg-[#0C0A1A] min-h-screen flex flex-col">

      {/* Background — one clean gradient, no blobs everywhere */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 60% 0%, rgba(109,40,217,0.18) 0%, transparent 70%)",
        }}
      />

      {/* ── Main content ── */}
      <div className="relative flex-1 max-w-6xl mx-auto w-full px-5 lg:px-8 pt-32 pb-20 flex flex-col justify-center">

        {/* Two-audience pill */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="inline-flex items-center gap-2 mb-8 w-fit"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-violet-400 animate-pulse" />
          <span className="text-violet-400 text-sm font-medium tracking-wide">
            For professionals &amp; the people who hire them
          </span>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* ── LEFT ── */}
          <div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.08 }}
              className="text-[clamp(2.8rem,5.8vw,4.4rem)] font-black text-white leading-[1.06] tracking-[-0.03em] mb-6"
            >
              {settings.hero_headline || (
                <>
                  One link.<br />
                  Your entire<br />
                  <span className="text-violet-400">professional story.</span>
                </>
              )}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.18 }}
              className="text-white/50 text-[1.05rem] leading-[1.75] max-w-[440px] mb-10"
            >
              {settings.hero_subheadline ||
                "Build a digital card that works like a mini website — share it anywhere. Or find the right professional for your next project."}
            </motion.p>

            {/* Dual CTA */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.28 }}
              className="flex flex-col sm:flex-row gap-3 mb-12"
            >
              <Link
                href="/register"
                className="group inline-flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-500 text-white font-semibold text-[15px] px-6 py-3.5 rounded-lg transition-colors"
              >
                Create your card free
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <Link
                href="/discover"
                className="inline-flex items-center justify-center gap-2 text-white/70 hover:text-white border border-white/15 hover:border-white/30 font-medium text-[15px] px-6 py-3.5 rounded-lg transition-all"
              >
                <Search className="w-4 h-4" />
                Find a professional
              </Link>
            </motion.div>

            {/* Stats — minimal, left-aligned */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex gap-8"
            >
              {[
                { v: settings.hero_stat_1_value || "50K+",  l: "Professionals" },
                { v: settings.hero_stat_2_value || "2M+",   l: "Card views"    },
                { v: settings.hero_stat_3_value || "150+",  l: "Countries"     },
              ].map(({ v, l }) => (
                <div key={l}>
                  <p className="text-white text-xl font-black tracking-tight">{v}</p>
                  <p className="text-white/30 text-xs mt-0.5">{l}</p>
                </div>
              ))}
            </motion.div>
          </div>

          {/* ── RIGHT — realistic card ── */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="relative flex justify-center lg:justify-end"
          >
            {/* Analytics badge */}
            <motion.div
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1, duration: 0.35 }}
              className="absolute -left-4 top-10 z-10 bg-white rounded-xl shadow-lg px-3.5 py-2.5 border border-gray-100"
            >
              <p className="text-[11px] font-semibold text-gray-800">📊 247 views today</p>
              <p className="text-[10px] text-gray-400 mt-0.5">↑ 34% from yesterday</p>
            </motion.div>

            {/* Hire badge */}
            <motion.div
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.2, duration: 0.35 }}
              className="absolute -right-2 bottom-16 z-10 bg-violet-600 rounded-xl shadow-lg px-3.5 py-2.5"
            >
              <p className="text-[11px] font-semibold text-white">✓ Available for hire</p>
              <p className="text-[10px] text-violet-200 mt-0.5">Responds within 2h</p>
            </motion.div>

            {/* Card */}
            <div className="animate-float w-[280px] rounded-2xl overflow-hidden shadow-2xl border border-white/10">
              <div className="h-24" style={{ background: "linear-gradient(135deg,#5B21B6,#4F46E5)" }} />
              <div className="bg-[#13111F] px-5 pb-5">
                <div className="flex items-end justify-between -mt-8 mb-4">
                  <div className="w-16 h-16 rounded-xl border-4 border-[#13111F] bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white text-xl font-black">
                    A
                  </div>
                  <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-2 py-0.5 rounded-full mb-1">
                    Open to work
                  </span>
                </div>
                <p className="text-white font-bold text-base leading-tight">Alex Johnson</p>
                <p className="text-violet-400 text-xs font-medium mt-0.5">Product Designer · 8 yrs exp</p>
                <div className="flex items-center gap-1 mt-1 mb-3">
                  <MapPin className="w-3 h-3 text-white/30" />
                  <span className="text-white/30 text-[11px]">Bangalore, India</span>
                </div>
                <p className="text-white/40 text-[11px] leading-relaxed mb-4">
                  Crafting digital products for SaaS companies. Ex-Swiggy, Ex-CRED. Available for freelance.
                </p>
                <div className="grid grid-cols-3 gap-1.5">
                  {["Email","Call","Portfolio"].map((l) => (
                    <div key={l} className="bg-white/[0.06] rounded-lg py-2 text-center">
                      <span className="text-white/50 text-[10px] font-medium">{l}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* ── Category quick-links ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.45 }}
          className="mt-16 pt-10 border-t border-white/[0.07]"
        >
          <p className="text-white/30 text-xs uppercase tracking-widest mb-5 font-medium">
            Browse by category
          </p>
          <div className="flex flex-wrap gap-3">
            {CATEGORIES.map(({ icon: Icon, label, href }) => (
              <Link
                key={label}
                href={href}
                className="flex items-center gap-2 bg-white/[0.05] hover:bg-white/[0.09] border border-white/[0.08] hover:border-violet-500/40 text-white/60 hover:text-white text-sm font-medium px-4 py-2 rounded-lg transition-all"
              >
                <Icon className="w-3.5 h-3.5" />
                {label}
              </Link>
            ))}
            <Link
              href="/discover"
              className="flex items-center gap-2 text-violet-400 hover:text-violet-300 text-sm font-medium px-4 py-2 transition-colors"
            >
              View all →
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
