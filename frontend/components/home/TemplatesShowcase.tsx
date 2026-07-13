"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const TEMPLATES = [
  { id: "1", name: "Medical Professional", category: "Doctor / Healthcare", gradient: "135deg, #1e3a5f 0%, #2563EB 100%", tag: "Popular" },
  { id: "2", name: "Tech & Startup",       category: "Founder / Engineer",  gradient: "135deg, #2e1065 0%, #7C3AED 100%", tag: "Popular" },
  { id: "3", name: "Creative Portfolio",   category: "Designer / Photographer", gradient: "135deg, #4a044e 0%, #EC4899 100%", tag: null },
  { id: "4", name: "Legal Practice",       category: "Lawyer / CA",         gradient: "135deg, #451a03 0%, #D97706 100%", tag: "Pro" },
  { id: "5", name: "Real Estate",          category: "Agent / Broker",      gradient: "135deg, #052e16 0%, #059669 100%", tag: null },
  { id: "6", name: "Minimalist",           category: "All professions",     gradient: "135deg, #1e293b 0%, #475569 100%", tag: null },
];

export function TemplatesShowcase() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.05 });

  return (
    <section className="bg-white dark:bg-[#0E0C1E] section-padding" ref={ref}>
      <div className="max-w-6xl mx-auto">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5 mb-12"
        >
          <div>
            <p className="text-violet-600 dark:text-violet-400 text-sm font-semibold tracking-widest uppercase mb-3">
              Templates
            </p>
            <h2 className="text-4xl lg:text-5xl font-black text-gray-900 dark:text-white leading-tight">
              Start from a template.<br />
              <span className="text-gray-400 dark:text-white/30">Make it yours.</span>
            </h2>
          </div>
          <Link
            href="/templates"
            className="inline-flex items-center gap-2 text-violet-600 dark:text-violet-400 font-semibold text-sm hover:gap-3 transition-all self-start lg:self-auto"
          >
            View all templates <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {TEMPLATES.map(({ id, name, category, gradient, tag }, i) => (
            <motion.div
              key={id}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.45, delay: i * 0.07 }}
              className="group relative bg-white dark:bg-white/[0.03] rounded-xl border border-gray-100 dark:border-white/[0.07] overflow-hidden hover:border-gray-300 dark:hover:border-white/15 transition-all"
            >
              {/* Preview swatch */}
              <div
                className="h-36 relative"
                style={{ background: `linear-gradient(${gradient})` }}
              >
                {tag && (
                  <span className={`absolute top-3 right-3 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    tag === "Pro"
                      ? "bg-amber-500/90 text-white"
                      : "bg-white/20 text-white backdrop-blur-sm"
                  }`}>
                    {tag}
                  </span>
                )}
                {/* Mini card skeleton inside */}
                <div className="absolute bottom-4 left-4 right-4 bg-white/10 backdrop-blur-sm rounded-lg p-2.5 border border-white/20">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-md bg-white/20" />
                    <div className="space-y-1 flex-1">
                      <div className="h-1.5 bg-white/30 rounded-full w-2/3" />
                      <div className="h-1 bg-white/20 rounded-full w-1/2" />
                    </div>
                  </div>
                </div>
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Link
                    href={`/templates`}
                    className="bg-white text-gray-900 font-semibold text-xs px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    Use this template
                  </Link>
                </div>
              </div>

              <div className="px-4 py-3">
                <p className="text-gray-900 dark:text-white font-semibold text-sm">{name}</p>
                <p className="text-gray-400 dark:text-white/30 text-xs mt-0.5">{category}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
