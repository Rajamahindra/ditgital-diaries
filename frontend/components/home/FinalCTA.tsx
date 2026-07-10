"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function FinalCTA() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section className="bg-[#F5F3FF] dark:bg-[#0C0A1A] section-padding" ref={ref}>
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="relative bg-[#1E1B4B] rounded-3xl px-8 py-16 lg:px-16 lg:py-20 overflow-hidden"
        >
          {/* Brand accent glows */}
          <div className="absolute top-0 right-0 w-80 h-80 rounded-full"
            style={{ background: "radial-gradient(circle, rgba(139,92,246,0.2) 0%, transparent 70%)", transform: "translate(30%, -30%)" }} />
          <div className="absolute bottom-0 left-24 w-64 h-64 rounded-full"
            style={{ background: "radial-gradient(circle, rgba(79,70,229,0.15) 0%, transparent 70%)", transform: "translateY(40%)" }} />

          <div className="relative max-w-2xl">
            <p className="text-violet-400 text-sm font-semibold tracking-widest uppercase mb-5">
              Get started today
            </p>
            <h2 className="text-4xl lg:text-5xl font-black text-white mb-5 leading-tight">
              Your professional identity<br />
              deserves better than a PDF.
            </h2>
            <p className="text-violet-300/50 text-lg mb-10 max-w-md">
              Join 50,000+ professionals who already use Digital Diaries to get discovered, capture leads, and stand out.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <Link href="/register"
                className="group inline-flex items-center gap-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold text-[15px] py-4 px-8 rounded-xl shadow-[0_0_0_1px_rgba(139,92,246,0.5),0_8px_24px_rgba(109,40,217,0.35)] hover:shadow-[0_12px_32px_rgba(109,40,217,0.5)] transition-all duration-200">
                Create your free card
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <span className="text-violet-300/30 text-sm">No credit card · Free forever plan</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
