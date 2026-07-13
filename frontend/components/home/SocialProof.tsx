"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Star } from "lucide-react";

const REVIEWS = [
  {
    name: "Dr. Ananya Singh",
    role: "Cardiologist, AIIMS Delhi",
    body: "My patients can now find and contact me directly through my card. It replaced my old paper visiting cards completely.",
    initials: "AS",
    color: "#2563EB",
  },
  {
    name: "Vikram Malhotra",
    role: "Startup Founder, Bangalore",
    body: "The AI wrote my bio and picked a design in under a minute. Sent it to three investors that same day.",
    initials: "VM",
    color: "#7C3AED",
  },
  {
    name: "Priya Nambiar",
    role: "Freelance Photographer, Mumbai",
    body: "I found my last three clients through the discover page. People searching for photographers in Mumbai are finding me.",
    initials: "PN",
    color: "#EC4899",
  },
  {
    name: "Arjun Krishnan",
    role: "HR Manager, Infosys",
    body: "We use Digital Diaries to shortlist freelancers. The profiles show skills, availability, and contact — everything in one place.",
    initials: "AK",
    color: "#059669",
  },
];

export function SocialProof() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.05 });

  return (
    <section className="bg-white dark:bg-[#0E0C1E] section-padding" ref={ref}>
      <div className="max-w-6xl mx-auto">

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-20 pb-20 border-b border-gray-100 dark:border-white/[0.06]">
          {[
            { v: "50,000+", l: "Professionals" },
            { v: "2M+",     l: "Card views"    },
            { v: "98%",     l: "Satisfaction"  },
            { v: "150+",    l: "Countries"     },
          ].map(({ v, l }, i) => (
            <motion.div
              key={l}
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.45, delay: i * 0.08 }}
            >
              <p className="text-3xl lg:text-4xl font-black text-gray-900 dark:text-white tracking-tight">{v}</p>
              <p className="text-gray-400 dark:text-white/30 text-sm mt-1">{l}</p>
            </motion.div>
          ))}
        </div>

        {/* Reviews */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.45, delay: 0.2 }}
          className="mb-10"
        >
          <p className="text-gray-400 dark:text-white/30 text-xs uppercase tracking-widest font-medium mb-1">
            What people say
          </p>
          <h2 className="text-3xl font-black text-gray-900 dark:text-white">
            Both sides love it.
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-4">
          {REVIEWS.map(({ name, role, body, initials, color }, i) => (
            <motion.div
              key={name}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.45, delay: 0.25 + i * 0.08 }}
              className="bg-gray-50 dark:bg-white/[0.03] rounded-xl border border-gray-100 dark:border-white/[0.06] p-5 flex flex-col"
            >
              {/* Stars */}
              <div className="flex gap-0.5 mb-4">
                {[...Array(5)].map((_, j) => (
                  <Star key={j} className="w-3 h-3 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-gray-700 dark:text-white/60 text-sm leading-relaxed flex-1 mb-5">
                "{body}"
              </p>
              <div className="flex items-center gap-2.5">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-black flex-shrink-0"
                  style={{ background: color }}
                >
                  {initials}
                </div>
                <div>
                  <p className="text-gray-900 dark:text-white font-semibold text-xs">{name}</p>
                  <p className="text-gray-400 dark:text-white/30 text-[11px]">{role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
