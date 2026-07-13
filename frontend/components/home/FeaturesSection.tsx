"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { BarChart3, Brain, Globe, QrCode, Download, Users, MapPin, Zap, Smartphone, Link2, Palette, Shield } from "lucide-react";

const FEATURES = [
  { Icon: Brain,     title: "AI writes your bio",         desc: "Describe what you do — AI generates your bio, services, and card design.",  color: "#8B5CF6" },
  { Icon: Globe,     title: "Live public profile",         desc: "Your card is a real URL. Share it anywhere, works on every device.",        color: "#6D28D9" },
  { Icon: BarChart3, title: "View analytics",              desc: "See who viewed your card, where they clicked, and how they found you.",      color: "#0891B2" },
  { Icon: QrCode,    title: "QR code included",            desc: "Every card gets a scannable QR code automatically. Print it anywhere.",     color: "#6D28D9" },
  { Icon: Download,  title: "Export in any format",        desc: "Download as PNG, PDF, or VCF contact file — one click.",                    color: "#059669" },
  { Icon: Users,     title: "Lead capture",                desc: "Built-in contact form. Leads go straight to your dashboard.",               color: "#DC2626" },
  { Icon: MapPin,    title: "Get discovered locally",      desc: "Show up when people search your profession in your city.",                  color: "#D97706" },
  { Icon: Zap,       title: "Drag & drop builder",         desc: "No code. Rearrange sections, change themes, publish instantly.",            color: "#EA580C" },
  { Icon: Shield,    title: "NFC tap-to-share",            desc: "Works with NFC-enabled phones. Tap to share, no app needed.",              color: "#7C3AED" },
  { Icon: Smartphone,"title": "Mobile optimised",          desc: "Every card renders perfectly on any screen size, every time.",             color: "#6D28D9" },
  { Icon: Link2,     title: "Smart link tracking",         desc: "Know which links get clicks. Per-link analytics built in.",                 color: "#0891B2" },
  { Icon: Palette,   title: "100+ templates",              desc: "Industry-specific designs. One click to apply, yours to customise.",        color: "#DB2777" },
];

export function FeaturesSection({ settings = {} }: { settings?: Record<string, string> }) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.04 });

  return (
    <section id="features" className="bg-[#F8F7FF] dark:bg-[#0C0A1A] section-padding" ref={ref}>
      <div className="max-w-6xl mx-auto">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="mb-14 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5"
        >
          <div>
            <p className="text-violet-600 dark:text-violet-400 text-sm font-semibold tracking-widest uppercase mb-3">
              Features
            </p>
            <h2 className="text-4xl lg:text-5xl font-black text-gray-900 dark:text-white leading-tight">
              {settings.features_title || <>Everything in one place.</>}
            </h2>
          </div>
          <p className="text-gray-400 dark:text-white/30 text-sm max-w-xs lg:text-right">
            {settings.features_subtitle || "No subscriptions to juggle. No extra tools."}
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-px bg-gray-200/80 dark:bg-white/[0.05] rounded-2xl overflow-hidden">
          {FEATURES.map(({ Icon, title, desc, color }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.35, delay: i * 0.03 }}
              className="bg-[#F8F7FF] dark:bg-[#0C0A1A] hover:bg-white dark:hover:bg-white/[0.04] p-6 transition-colors duration-200 group"
            >
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center mb-4"
                style={{ background: `${color}15` }}
              >
                <Icon className="w-4 h-4" style={{ color }} />
              </div>
              <p className="text-gray-900 dark:text-white font-semibold text-sm mb-1.5">{title}</p>
              <p className="text-gray-400 dark:text-white/30 text-xs leading-relaxed">{desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
