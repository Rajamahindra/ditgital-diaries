"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import Link from "next/link";
import { ArrowRight, Search } from "lucide-react";

export function FinalCTA() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section className="bg-[#F8F7FF] dark:bg-[#0C0A1A] section-padding" ref={ref}>
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-5">

          {/* For creators */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="relative bg-[#1E1B4B] rounded-2xl p-8 lg:p-10 overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-48 h-48 rounded-full"
              style={{ background: "radial-gradient(circle, rgba(139,92,246,0.2) 0%, transparent 70%)", transform: "translate(30%, -30%)" }} />
            <div className="relative">
              <p className="text-violet-400 text-xs font-semibold tracking-widest uppercase mb-4">
                For professionals
              </p>
              <h3 className="text-white text-2xl lg:text-3xl font-black leading-tight mb-3">
                Your skills deserve<br />a proper home.
              </h3>
              <p className="text-white/50 text-sm leading-relaxed mb-7 max-w-xs">
                Stop sharing PDFs and screenshots. Create a card that's live, shareable, and represents you properly.
              </p>
              <Link
                href="/register"
                className="group inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-500 text-white font-semibold text-sm px-5 py-3 rounded-lg transition-colors"
              >
                Create your card free
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <p className="text-white/25 text-xs mt-4">No credit card · Free forever plan</p>
            </div>
          </motion.div>

          {/* For hirers */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.12 }}
            className="relative bg-[#052E16] rounded-2xl p-8 lg:p-10 overflow-hidden"
          >
            <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full"
              style={{ background: "radial-gradient(circle, rgba(5,150,105,0.2) 0%, transparent 70%)", transform: "translate(-30%, 30%)" }} />
            <div className="relative">
              <p className="text-emerald-400 text-xs font-semibold tracking-widest uppercase mb-4">
                Looking to hire
              </p>
              <h3 className="text-white text-2xl lg:text-3xl font-black leading-tight mb-3">
                The right person<br />is one search away.
              </h3>
              <p className="text-white/50 text-sm leading-relaxed mb-7 max-w-xs">
                Browse verified professionals by category and city. See their work, read their profile, contact them directly.
              </p>
              <Link
                href="/discover"
                className="group inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm px-5 py-3 rounded-lg transition-colors"
              >
                <Search className="w-4 h-4" />
                Find a professional
              </Link>
              <p className="text-white/25 text-xs mt-4">Free to browse · No sign-up needed</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
