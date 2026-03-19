"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Star } from "lucide-react";

const STATS = [
  { value: "50,000+", label: "Professionals" },
  { value: "2M+", label: "Card Views" },
  { value: "98%", label: "Satisfaction" },
  { value: "150+", label: "Countries" },
];

const TESTIMONIALS = [
  {
    name: "Dr. Ananya Singh",
    role: "Cardiologist, AIIMS Delhi",
    content: "Digital Diaries transformed how I share my professional profile. My patients love the interactive card.",
    avatar: "👩‍⚕️",
    rating: 5,
  },
  {
    name: "Vikram Malhotra",
    role: "Startup Founder, Bangalore",
    content: "The AI generated my entire card in 30 seconds. It's like having a personal branding team.",
    avatar: "👨‍💼",
    rating: 5,
  },
  {
    name: "Priya Nambiar",
    role: "Freelance Photographer",
    content: "My portfolio card gets 10x more engagement than my old PDF resume. The analytics are incredible.",
    avatar: "📸",
    rating: 5,
  },
];

export function SocialProof() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.05 });

  return (
    <section className="bg-primary section-padding" ref={ref}>
      <div className="max-w-7xl mx-auto">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {STATS.map(({ value, label }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="text-center"
            >
              <div className="text-4xl lg:text-5xl font-display font-black gradient-text mb-2">
                {value}
              </div>
              <div className="text-white/50 text-sm">{label}</div>
            </motion.div>
          ))}
        </div>

        {/* Testimonials */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl lg:text-4xl font-display font-black text-white">
            Loved by <span className="gradient-text">professionals</span> across India
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {TESTIMONIALS.map(({ name, role, content, avatar, rating }, i) => (
            <motion.div
              key={name}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.4 + i * 0.1 }}
              className="bg-dark-card rounded-2xl p-6 border border-white/5"
            >
              <div className="flex gap-1 mb-4">
                {Array.from({ length: rating }).map((_, j) => (
                  <Star key={j} className="w-4 h-4 text-amber-400 fill-amber-400" />
                ))}
              </div>
              <p className="text-white/70 text-sm leading-relaxed mb-6">"{content}"</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-accent flex items-center justify-center text-xl">
                  {avatar}
                </div>
                <div>
                  <div className="text-white font-semibold text-sm">{name}</div>
                  <div className="text-white/40 text-xs">{role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
