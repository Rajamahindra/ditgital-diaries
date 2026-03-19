"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Play, Star, Users, Zap } from "lucide-react";
import { CardPreviewMini } from "@/components/card/CardPreviewMini";

export function HeroSection({ settings = {} }: { settings?: Record<string, string> }) {
  const stats = [
    { icon: Users, value: settings.hero_stat_1_value || "50K+", label: settings.hero_stat_1_label || "Professionals" },
    { icon: Star, value: settings.hero_stat_2_value || "4.9★", label: settings.hero_stat_2_label || "Rating" },
    { icon: Zap, value: settings.hero_stat_3_value || "2 min", label: settings.hero_stat_3_label || "Setup time" },
  ];
  return (
    <section className="relative min-h-screen bg-gradient-hero flex items-center overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/20 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-accent opacity-5 rounded-full blur-3xl" />
        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Copy */}
          <div>
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-8"
            >
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-white/80 text-sm font-medium">
                {settings.site_tagline || "AI-Powered Digital Identity Platform"}
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-5xl lg:text-7xl font-display font-black text-white leading-[1.05] tracking-tight mb-6"
            >
              {settings.hero_headline || "Build Your Professional Digital Identity in Minutes"}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-white/60 text-lg lg:text-xl leading-relaxed mb-10 max-w-xl"
            >
              {settings.hero_subheadline || "Not just a visiting card. A complete mini website with AI-generated content, real-time analytics, lead capture, and a live public URL — all in one."}
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap gap-4 mb-12"
            >
              <Link href="/register" className="btn-gradient flex items-center gap-2 text-base py-4 px-8">
                {settings.hero_cta_primary || "Create Your Card Free"}
                <ArrowRight className="w-5 h-5" />
              </Link>
              <button className="btn-secondary flex items-center gap-2 text-base py-4 px-8">
                <Play className="w-5 h-5" />
                {settings.hero_cta_secondary || "Watch Demo"}
              </button>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex gap-8"
            >
              {stats.map(({ icon: Icon, value, label }) => (
                <div key={label} className="flex items-center gap-2">
                  <Icon className="w-4 h-4 text-secondary" />
                  <div>
                    <div className="text-white font-bold text-lg leading-none">{value}</div>
                    <div className="text-white/40 text-xs">{label}</div>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right: Live Card Preview */}
          <motion.div
            initial={{ opacity: 0, x: 60, rotateY: -15 }}
            animate={{ opacity: 1, x: 0, rotateY: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            className="relative flex justify-center"
          >
            <div className="relative">
              {/* Glow */}
              <div className="absolute inset-0 bg-gradient-accent opacity-30 blur-3xl rounded-3xl scale-110" />
              {/* Card */}
              <div className="relative animate-float">
                <CardPreviewMini />
              </div>
              {/* Floating badges */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
                className="absolute -top-4 -right-4 bg-green-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg"
              >
                ✓ Live URL
              </motion.div>
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 3, repeat: Infinity, delay: 1 }}
                className="absolute -bottom-4 -left-4 bg-secondary text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg"
              >
                ⚡ AI Generated
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-primary to-transparent" />
    </section>
  );
}
