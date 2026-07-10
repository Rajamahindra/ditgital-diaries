"use client";

import Link from "next/link";
import { ArrowRight, Check, Mail, Phone, Globe, MapPin } from "lucide-react";
import { motion } from "framer-motion";

const TRUST = ["No credit card", "2-min setup", "Free forever plan"];

export function HeroSection({ settings = {} }: { settings?: Record<string, string> }) {
  return (
    <section className="relative bg-[#0C0A1A] overflow-hidden min-h-screen flex items-center">

      {/* ── Very subtle noise texture ── */}
      <div className="absolute inset-0 opacity-[0.03]"
        style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")" }} />

      {/* ── Brand gradients ── */}
      <div className="absolute top-[-80px] right-[-120px] w-[520px] h-[520px] rounded-full"
        style={{ background: "radial-gradient(circle, rgba(139,92,246,0.22) 0%, transparent 70%)" }} />
      <div className="absolute bottom-[-100px] left-[-60px] w-[400px] h-[400px] rounded-full"
        style={{ background: "radial-gradient(circle, rgba(79,70,229,0.15) 0%, transparent 70%)" }} />
      <div className="absolute top-1/3 left-1/3 w-[600px] h-[300px] rounded-full"
        style={{ background: "radial-gradient(ellipse, rgba(109,40,217,0.08) 0%, transparent 70%)" }} />

      <div className="relative max-w-6xl mx-auto px-5 lg:px-8 pt-28 pb-24 w-full">
        <div className="grid lg:grid-cols-[1fr_440px] gap-16 xl:gap-24 items-center">

          {/* ── LEFT ── */}
          <div>
            {/* Eyebrow */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-violet-400 text-sm font-semibold tracking-widest uppercase mb-6"
            >
              Digital Business Cards
            </motion.p>

            {/* Headline — proper typographic weight contrast */}
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-[clamp(2.6rem,5.5vw,4.2rem)] font-black text-white leading-[1.08] tracking-[-0.03em] mb-6"
            >
              {settings.hero_headline || (
                <>
                  Your professional<br />
                  <em className="not-italic bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">digital identity,</em><br />
                  done in minutes.
                </>
              )}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-violet-300/60 text-lg leading-[1.7] max-w-lg mb-10"
            >
              {settings.hero_subheadline ||
                "More than a card — a live mini website with analytics, lead capture, and AI-generated content. Share it anywhere with one link."}
            </motion.p>

            {/* CTA group */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-wrap items-center gap-4 mb-10"
            >
              <Link href="/register"
                className="group flex items-center gap-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold text-[15px] py-3.5 px-7 rounded-xl shadow-[0_0_0_1px_rgba(139,92,246,0.5),0_8px_24px_rgba(109,40,217,0.35)] hover:shadow-[0_0_0_1px_rgba(139,92,246,0.6),0_12px_32px_rgba(109,40,217,0.5)] transition-all duration-200">
                {settings.hero_cta_primary || "Create your card — it's free"}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <Link href="/#features"
                className="text-violet-400/70 hover:text-violet-300 text-[15px] font-medium transition-colors">
                See what's included →
              </Link>
            </motion.div>

            {/* Trust chips */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.45 }}
              className="flex flex-wrap gap-4"
            >
              {TRUST.map((t) => (
                <span key={t} className="flex items-center gap-1.5 text-violet-400/50 text-sm">
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  {t}
                </span>
              ))}
            </motion.div>
          </div>

          {/* ── RIGHT — Card mockup ── */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="relative flex justify-center"
          >
            {/* Card */}
            <div className="animate-float relative w-[300px] rounded-[28px] overflow-hidden shadow-[0_32px_80px_rgba(0,0,0,0.5)] border border-white/10">

              {/* Cover gradient */}
              <div className="h-28 relative" style={{ background: "linear-gradient(135deg, #5B21B6, #6D28D9, #4F46E5)" }}>
                <div className="absolute bottom-0 left-0 right-0 h-16"
                  style={{ background: "linear-gradient(to top, rgba(15,23,42,0.6), transparent)" }} />
              </div>

              {/* Body */}
              <div className="bg-[#1E1B4B] px-5 pb-6">
                {/* Avatar row */}
                <div className="flex items-end justify-between -mt-9 mb-4">
                  <div className="w-[68px] h-[68px] rounded-2xl border-4 border-[#1E1B4B] overflow-hidden bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white text-2xl font-black shadow-lg">
                    A
                  </div>
                  <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-2 py-1 rounded-full mb-2">
                    ✓ Verified
                  </span>
                </div>

                <h3 className="text-white font-bold text-lg leading-tight mb-0.5">Alex Johnson</h3>
                <p className="text-violet-300 text-sm font-medium mb-0.5">Senior Product Designer</p>
                <p className="text-white/40 text-xs flex items-center gap-1 mb-4">
                  <MapPin className="w-3 h-3" /> Bangalore, India
                </p>
                <p className="text-white/50 text-xs leading-relaxed mb-5">
                  Crafting beautiful digital products for 8+ years. Specialising in SaaS and design systems.
                </p>

                {/* Buttons */}
                <div className="grid grid-cols-3 gap-2 mb-5">
                  {[
                    { icon: Mail,  label: "Email", bg: "#2E1065", c: "#C4B5FD" },
                    { icon: Phone, label: "Call",  bg: "#14532D", c: "#4ADE80" },
                    { icon: Globe, label: "Web",   bg: "#1E1B4B", c: "#818CF8" },
                  ].map(({ icon: I, label, bg, c }) => (
                    <div key={label} className="flex flex-col items-center gap-1.5 py-3 rounded-xl" style={{ background: bg }}>
                      <I className="w-4 h-4" style={{ color: c }} />
                      <span className="text-[10px] font-semibold text-white/60">{label}</span>
                    </div>
                  ))}
                </div>

                {/* URL */}
                <div className="flex items-center justify-between pt-4 border-t border-white/6">
                  <span className="text-white/25 text-[10px] font-mono">digitaldiaries.com/alex</span>
                  {/* tiny QR */}
                  <div className="grid grid-cols-4 gap-0.5">
                    {[1,0,1,0, 0,1,0,1, 1,0,1,0, 0,1,0,1].map((v,i) => (
                      <div key={i} className={`w-1.5 h-1.5 rounded-[1px] ${v ? "bg-white/50" : "bg-transparent"}`} />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Floating annotations — positioned with intent */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.9, duration: 0.4 }}
              className="absolute -right-6 top-12 bg-white dark:bg-[#2E1065] rounded-xl shadow-xl border border-gray-100 dark:border-violet-500/20 px-3 py-2.5"
            >
              <p className="text-[11px] font-semibold text-gray-900 dark:text-white">📊 247 views today</p>
              <p className="text-[10px] text-gray-500 dark:text-white/40 mt-0.5">↑ 34% from yesterday</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.1, duration: 0.4 }}
              className="absolute -left-6 bottom-20 bg-white dark:bg-[#2E1065] rounded-xl shadow-xl border border-gray-100 dark:border-violet-500/20 px-3 py-2.5"
            >
              <p className="text-[11px] font-semibold text-gray-900 dark:text-white">⚡ AI generated in</p>
              <p className="text-[10px] text-violet-600 dark:text-violet-400 font-bold mt-0.5">28 seconds</p>
            </motion.div>
          </motion.div>
        </div>

        {/* ── Stats bar ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="mt-20 pt-10 border-t border-violet-900/30 grid grid-cols-3 gap-8 max-w-sm"
        >
          {[
            { v: settings.hero_stat_1_value || "50K+", l: settings.hero_stat_1_label || "Professionals" },
            { v: settings.hero_stat_2_value || "4.9★", l: settings.hero_stat_2_label || "Avg rating"     },
            { v: settings.hero_stat_3_value || "2 min", l: settings.hero_stat_3_label || "Setup time"    },
          ].map(({ v, l }) => (
            <div key={l}>
              <p className="text-white text-2xl font-black tracking-tight">{v}</p>
              <p className="text-violet-400/50 text-xs mt-0.5">{l}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
