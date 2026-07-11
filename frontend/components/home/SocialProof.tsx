"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Star } from "lucide-react";

const STATS = [
  { value: "50,000+", label: "Professionals using it" },
  { value: "2M+",     label: "Card views served"      },
  { value: "98%",     label: "Customer satisfaction"  },
  { value: "150+",    label: "Countries reached"      },
];

const REVIEWS = [
  {
    name: "Dr. Ananya Singh",
    role: "Cardiologist, AIIMS Delhi",
    body: "My patients love the interactive card. It's replaced my old paper visiting cards completely.",
    initials: "AS",
    color: "#7C3AED",
    stars: 5,
  },
  {
    name: "Vikram Malhotra",
    role: "Startup Founder, Bangalore",
    body: "The AI generated my entire card in 30 seconds. It felt like having a personal branding team.",
    initials: "VM",
    color: "#2563EB",
    stars: 5,
  },
  {
    name: "Priya Nambiar",
    role: "Freelance Photographer",
    body: "My portfolio card gets 10× more engagement than my old PDF. The analytics alone are worth it.",
    initials: "PN",
    color: "#0891B2",
    stars: 5,
  },
];

export function SocialProof() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.05 });

  return (
    <section className="bg-[#F7F8FC] dark:bg-[#0D1321] section-padding" ref={ref}>
      <div className="max-w-6xl mx-auto">

        {/* Stats row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {STATS.map(({ value, label }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.08 }}
            >
              <p className="text-3xl lg:text-4xl font-black text-gray-900 dark:text-white tracking-tight">{value}</p>
              <p className="text-gray-500 dark:text-white/45 text-sm mt-1">{label}</p>
            </motion.div>
          ))}
        </div>

        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="mb-10"
        >
          <h2 className="text-3xl lg:text-4xl font-black text-gray-900 dark:text-white">
            What professionals say
          </h2>
        </motion.div>

        {/* Review cards */}
        <div className="grid md:grid-cols-3 gap-5">
          {REVIEWS.map(({ name, role, body, initials, color, stars }, i) => (
            <motion.div
              key={name}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
              className="bg-white dark:bg-white/[0.04] rounded-2xl p-6 border border-gray-100 dark:border-white/[0.07] shadow-[0_1px_4px_rgba(0,0,0,0.05)] dark:shadow-none"
            >
              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: stars }).map((_, j) => (
                  <Star key={j} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-gray-700 dark:text-white/70 text-[15px] leading-relaxed mb-6">
                "{body}"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-xs font-black flex-shrink-0"
                  style={{ background: `${color}` }}>
                  {initials}
                </div>
                <div>
                  <p className="text-gray-900 dark:text-white font-semibold text-sm">{name}</p>
                  <p className="text-gray-400 dark:text-white/35 text-xs">{role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
