"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { UserPlus, Wand2, Share2 } from "lucide-react";

const STEPS = [
  {
    n: "01",
    Icon: UserPlus,
    title: "Sign up free",
    body: "Create your account in 30 seconds. No credit card. Just your email.",
    color: "#6366F1",
  },
  {
    n: "02",
    Icon: Wand2,
    title: "AI builds your card",
    body: "Describe yourself — the AI writes your bio, picks a design, adds your services.",
    color: "#2563EB",
  },
  {
    n: "03",
    Icon: Share2,
    title: "Share your live URL",
    body: "Your card is live instantly at digitaldiaries.com/card/yourname.",
    color: "#0891B2",
  },
];

export function HowItWorks() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section className="bg-[#F7F8FC] dark:bg-[#0D1321] section-padding" ref={ref}>
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55 }}
          className="mb-16"
        >
          <p className="text-indigo-600 dark:text-indigo-400 text-sm font-semibold tracking-widest uppercase mb-3">
            How it works
          </p>
          <h2 className="text-4xl lg:text-5xl font-black text-gray-900 dark:text-white max-w-md">
            Live in under<br />
            <span className="text-indigo-600 dark:text-indigo-400">three steps.</span>
          </h2>
        </motion.div>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-px bg-gray-200 dark:bg-white/8 rounded-2xl overflow-hidden">
          {STEPS.map(({ n, Icon, title, body, color }, i) => (
            <motion.div
              key={n}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.55, delay: i * 0.12 }}
              className="bg-white dark:bg-[#0D1321] p-8 lg:p-10 relative group hover:bg-[#F0F4FF] dark:hover:bg-[#111827] transition-colors duration-300"
            >
              {/* Step number — large background */}
              <span className="absolute top-6 right-7 text-6xl font-black text-gray-100 dark:text-white/[0.04] select-none leading-none">
                {n}
              </span>

              <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-7"
                style={{ background: `${color}15`, border: `1px solid ${color}25` }}>
                <Icon className="w-5 h-5" style={{ color }} />
              </div>

              <h3 className="text-gray-900 dark:text-white font-bold text-xl mb-3">{title}</h3>
              <p className="text-gray-500 dark:text-white/45 text-[15px] leading-relaxed">{body}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
