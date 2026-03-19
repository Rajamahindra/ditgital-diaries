"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import {
  BarChart3, Brain, Globe, QrCode, Download, Users,
  MapPin, Zap, Shield, Smartphone, Link2, Palette
} from "lucide-react";

const features = [
  { icon: Brain, title: "AI Card Generator", desc: "Describe yourself, AI builds your complete card with bio, services, and design.", color: "#7C3AED" },
  { icon: Globe, title: "Live Public URL", desc: "Every card gets a unique URL. Share it like a website.", color: "#2563EB" },
  { icon: BarChart3, title: "Real-time Analytics", desc: "Track views, clicks, WhatsApp taps, QR scans and more.", color: "#06B6D4" },
  { icon: QrCode, title: "Auto QR Code", desc: "Every card auto-generates a scannable QR code.", color: "#10B981" },
  { icon: Download, title: "Download as PNG/PDF/VCF", desc: "Export your card in any format instantly.", color: "#F59E0B" },
  { icon: Users, title: "Lead Capture", desc: "Built-in contact form captures leads directly to your dashboard.", color: "#EF4444" },
  { icon: MapPin, title: "Business Discovery Map", desc: "Get discovered by professionals searching in your area.", color: "#8B5CF6" },
  { icon: Zap, title: "Drag & Drop Builder", desc: "Professional editor with live preview. No code needed.", color: "#F97316" },
  { icon: Shield, title: "NFC Ready", desc: "Tap your phone to share. NFC integration built-in.", color: "#14B8A6" },
  { icon: Smartphone, title: "Mobile Optimized", desc: "Every card looks perfect on all devices.", color: "#EC4899" },
  { icon: Link2, title: "Smart Link Tracking", desc: "Track every external click with detailed analytics.", color: "#6366F1" },
  { icon: Palette, title: "Premium Templates", desc: "100+ professionally designed templates across all industries.", color: "#84CC16" },
];

export function FeaturesSection({ settings = {} }: { settings?: Record<string, string> }) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.05 });

  return (
    <section id="features" className="bg-surface dark:bg-dark-surface section-padding" ref={ref}>
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-secondary text-sm font-semibold uppercase tracking-widest">
            Everything You Need
          </span>
          <h2 className="text-4xl lg:text-5xl font-display font-black text-primary dark:text-white mt-3 mb-4">
            {settings.features_title || "More than a card. A digital identity."}
          </h2>
          <p className="text-gray-500 dark:text-white/50 text-lg max-w-xl mx-auto">
            {settings.features_subtitle || "Every feature you need to build a powerful professional presence online."}
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {features.map(({ icon: Icon, title, desc, color }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              className="group bg-white dark:bg-dark-card rounded-2xl p-6 border border-gray-100 dark:border-white/5 hover:border-secondary/30 dark:hover:border-secondary/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover cursor-default"
            >
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110"
                style={{ background: `${color}15`, border: `1px solid ${color}25` }}
              >
                <Icon className="w-5 h-5" style={{ color }} />
              </div>
              <h3 className="text-primary dark:text-white font-semibold text-base mb-2">{title}</h3>
              <p className="text-gray-500 dark:text-white/40 text-sm leading-relaxed">{desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
