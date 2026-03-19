"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

export function FinalCTA() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section className="bg-surface dark:bg-dark-surface section-padding" ref={ref}>
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="relative bg-gradient-hero rounded-3xl p-12 lg:p-20 overflow-hidden border border-white/10"
        >
          {/* Background effects */}
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-secondary/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-accent/20 rounded-full blur-3xl" />

          <div className="relative">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-2 mb-8">
              <Sparkles className="w-4 h-4 text-accent" />
              <span className="text-white/80 text-sm font-medium">Free to start. No credit card.</span>
            </div>

            <h2 className="text-4xl lg:text-6xl font-display font-black text-white mb-6 leading-tight">
              Create Your Card{" "}
              <span className="gradient-text">Now</span>
            </h2>

            <p className="text-white/60 text-lg mb-10 max-w-xl mx-auto">
              Join 50,000+ professionals who use Digital Diaries to build their digital identity.
            </p>

            <Link
              href="/register"
              className="inline-flex items-center gap-3 bg-gradient-accent text-white font-bold text-lg py-5 px-10 rounded-2xl hover:opacity-90 transition-all shadow-glow-purple hover:shadow-2xl active:scale-95"
            >
              Get Started Free
              <ArrowRight className="w-5 h-5" />
            </Link>

            <p className="text-white/30 text-sm mt-6">
              Setup in 2 minutes · No credit card required · Cancel anytime
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
