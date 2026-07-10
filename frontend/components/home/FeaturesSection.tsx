"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import {
  BarChart3, Brain, Globe, QrCode, Download, Users,
  MapPin, Zap, Smartphone, Link2, Palette, Shield,
} from "lucide-react";

const FEATURES = [
  { Icon: Brain,       title: "AI Card Generator",           desc: "Describe yourself — AI writes the bio, picks a design, adds services.",  tag: "AI"      },
  { Icon: Globe,       title: "Live Public URL",              desc: "Every card is a real webpage. Share one link, works everywhere.",         tag: "Core"    },
  { Icon: BarChart3,   title: "Real-time Analytics",          desc: "Views, clicks, WhatsApp taps, QR scans — all tracked live.",             tag: "Data"    },
  { Icon: QrCode,      title: "Auto QR Code",                 desc: "Every card auto-generates a scannable QR. No extra steps.",              tag: "Core"    },
  { Icon: Download,    title: "Export PNG · PDF · VCF",       desc: "Download your card in any format with one click.",                       tag: "Export"  },
  { Icon: Users,       title: "Lead Capture Form",            desc: "Built-in contact form sends leads straight to your dashboard.",          tag: "CRM"     },
  { Icon: MapPin,      title: "Discovery Map",                desc: "Get found by professionals searching for your skill in your city.",      tag: "Growth"  },
  { Icon: Zap,         title: "Drag & Drop Builder",          desc: "Live preview editor. Rearrange, theme, publish — no code.",              tag: "Builder" },
  { Icon: Shield,      title: "NFC-ready",                    desc: "Tap to share via NFC on supported devices. Physical → digital.",         tag: "Pro"     },
  { Icon: Smartphone,  title: "Mobile-first",                 desc: "Every card is perfected for small screens. Always.",                     tag: "Core"    },
  { Icon: Link2,       title: "Smart Link Tracking",          desc: "See which external links get clicked with per-link analytics.",          tag: "Data"    },
  { Icon: Palette,     title: "Premium Templates",            desc: "100+ templates across industries. One click to apply.",                  tag: "Design"  },
];

const TAG_COLORS: Record<string, string> = {
  AI: "#8B5CF6", Core: "#6D28D9", Data: "#0891B2", Export: "#059669",
  CRM: "#DC2626", Growth: "#D97706", Builder: "#EA580C", Pro: "#7C3AED",
  Design: "#DB2777",
};

export function FeaturesSection({ settings = {} }: { settings?: Record<string, string> }) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.04 });

  return (
    <section id="features" className="bg-white dark:bg-[#0C0A1A] section-padding" ref={ref}>
      <div className="max-w-6xl mx-auto">

        {/* Header — left-aligned, not centred */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55 }}
          className="mb-14 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6"
        >
          <div>
            <p className="text-violet-600 dark:text-violet-400 text-sm font-semibold tracking-widest uppercase mb-3">
              Features
            </p>
            <h2 className="text-4xl lg:text-5xl font-black text-gray-900 dark:text-white leading-tight">
              {settings.features_title || (
                <>Everything to build<br />a powerful presence.</>
              )}
            </h2>
          </div>
          <p className="text-gray-500 dark:text-violet-300/40 text-base max-w-xs lg:text-right">
            {settings.features_subtitle || "One platform. Every tool you need."}
          </p>
        </motion.div>

        {/* Grid — intentionally non-uniform: 4 cols on wide */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {FEATURES.map(({ Icon, title, desc, tag }, i) => {
            const tagColor = TAG_COLORS[tag] || "#6366F1";
            return (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.45, delay: i * 0.04 }}
                className="group p-5 rounded-2xl border border-gray-100 dark:border-white/[0.07] bg-gray-50/50 dark:bg-white/[0.03] hover:border-gray-300 dark:hover:border-white/15 hover:bg-white dark:hover:bg-white/[0.06] transition-all duration-200"
              >
                {/* Icon + tag in same row */}
                <div className="flex items-start justify-between mb-4">
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center"
                    style={{ background: `${tagColor}12`, border: `1px solid ${tagColor}20` }}>
                    <Icon className="w-4.5 h-4.5" style={{ color: tagColor }} />
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                    style={{ color: tagColor, background: `${tagColor}12` }}>
                    {tag}
                  </span>
                </div>
                <h3 className="text-gray-900 dark:text-white font-semibold text-sm mb-1.5">{title}</h3>
                <p className="text-gray-500 dark:text-white/35 text-xs leading-relaxed">{desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
