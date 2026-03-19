"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { UserPlus, Wand2, Share2 } from "lucide-react";

const steps = [
  {
    icon: UserPlus,
    step: "01",
    title: "Sign Up Free",
    description: "Create your account in 30 seconds. No credit card required.",
    color: "#2563EB",
  },
  {
    icon: Wand2,
    step: "02",
    title: "AI Builds Your Card",
    description: "Describe yourself and our AI generates a complete professional card with bio, services, and design.",
    color: "#7C3AED",
  },
  {
    icon: Share2,
    step: "03",
    title: "Share Your Live URL",
    description: "Get your unique URL like digitaldiaries.com/card/yourname and share it everywhere.",
    color: "#06B6D4",
  },
];

export function HowItWorks() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section className="bg-primary section-padding" ref={ref}>
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-secondary text-sm font-semibold uppercase tracking-widest">
            Simple Process
          </span>
          <h2 className="text-4xl lg:text-5xl font-display font-black text-white mt-3 mb-4">
            Up and running in{" "}
            <span className="gradient-text">3 steps</span>
          </h2>
          <p className="text-white/50 text-lg max-w-xl mx-auto">
            From zero to a live professional digital identity in under 2 minutes.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 relative">
          {/* Connector line */}
          <div className="hidden md:block absolute top-16 left-1/3 right-1/3 h-px bg-gradient-to-r from-secondary via-accent to-cyan-500 opacity-30" />

          {steps.map(({ icon: Icon, step, title, description, color }, i) => (
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              className="relative group"
            >
              <div className="bg-dark-card rounded-2xl p-8 border border-white/5 hover:border-white/10 transition-all duration-300 hover:-translate-y-2 hover:shadow-premium">
                {/* Step number */}
                <div className="text-6xl font-black text-white/5 absolute top-4 right-6 font-display">
                  {step}
                </div>

                {/* Icon */}
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-lg"
                  style={{ background: `${color}20`, border: `1px solid ${color}30` }}
                >
                  <Icon className="w-7 h-7" style={{ color }} />
                </div>

                <h3 className="text-white font-display font-bold text-xl mb-3">{title}</h3>
                <p className="text-white/50 leading-relaxed">{description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
