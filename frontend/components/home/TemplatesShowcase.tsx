"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const CATEGORIES = ["All", "Doctor", "Engineer", "Lawyer", "Photographer", "Consultant", "Real Estate", "Startup"];

const TEMPLATES = [
  { id: "1", name: "Luxury Medical", category: "Doctor", gradient: "from-blue-600 to-cyan-500", emoji: "👨‍⚕️", isPremium: false },
  { id: "2", name: "Tech Founder", category: "Startup", gradient: "from-violet-600 to-purple-500", emoji: "🚀", isPremium: false },
  { id: "3", name: "Creative Studio", category: "Photographer", gradient: "from-pink-600 to-rose-500", emoji: "📸", isPremium: true },
  { id: "4", name: "Legal Pro", category: "Lawyer", gradient: "from-amber-600 to-orange-500", emoji: "⚖️", isPremium: true },
  { id: "5", name: "Real Estate Elite", category: "Real Estate", gradient: "from-emerald-600 to-teal-500", emoji: "🏠", isPremium: false },
  { id: "6", name: "Engineering Hub", category: "Engineer", gradient: "from-slate-600 to-gray-500", emoji: "⚙️", isPremium: false },
];

export function TemplatesShowcase() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.05 });

  return (
    <section className="bg-surface dark:bg-dark-surface section-padding" ref={ref}>
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="text-secondary text-sm font-semibold uppercase tracking-widest">
            Template Library
          </span>
          <h2 className="text-4xl lg:text-5xl font-display font-black text-primary dark:text-white mt-3 mb-4">
            Start with a{" "}
            <span className="gradient-text">premium template</span>
          </h2>
          <p className="text-gray-500 dark:text-white/50 text-lg max-w-xl mx-auto">
            100+ professionally designed templates for every industry.
          </p>
        </motion.div>

        {/* Category filter */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-wrap gap-2 justify-center mb-10"
        >
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              className="px-4 py-2 rounded-full text-sm font-medium border border-gray-200 dark:border-white/10 text-gray-600 dark:text-white/60 hover:border-secondary hover:text-secondary transition-all"
            >
              {cat}
            </button>
          ))}
        </motion.div>

        {/* Templates grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {TEMPLATES.map(({ id, name, category, gradient, emoji, isPremium }, i) => (
            <motion.div
              key={id}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="group relative bg-white dark:bg-dark-card rounded-2xl overflow-hidden border border-gray-100 dark:border-white/5 hover:border-secondary/30 transition-all duration-300 hover:-translate-y-2 hover:shadow-card-hover cursor-pointer"
            >
              {/* Template preview */}
              <div className={`h-48 bg-gradient-to-br ${gradient} relative overflow-hidden`}>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-6xl">{emoji}</span>
                </div>
                <div className="absolute inset-0 bg-black/20" />
                {isPremium && (
                  <div className="absolute top-3 right-3 bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                    PRO
                  </div>
                )}
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Link
                    href={`/templates/${id}`}
                    className="bg-white text-primary font-semibold text-sm px-5 py-2.5 rounded-xl hover:bg-gray-100 transition-colors"
                  >
                    Use Template
                  </Link>
                </div>
              </div>

              <div className="p-4">
                <h3 className="text-primary dark:text-white font-semibold">{name}</h3>
                <p className="text-gray-400 dark:text-white/40 text-sm">{category}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center">
          <Link
            href="/templates"
            className="inline-flex items-center gap-2 text-secondary font-semibold hover:gap-3 transition-all"
          >
            View all templates
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
