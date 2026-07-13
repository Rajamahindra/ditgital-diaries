"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

const FOR_CREATORS = [
  { n: "1", title: "Sign up", body: "Create an account in 30 seconds — just your email." },
  { n: "2", title: "Build your card", body: "Use the drag-and-drop builder or let AI generate your bio, services and design." },
  { n: "3", title: "Share one link", body: "Publish your card and share the link on WhatsApp, email, LinkedIn — anywhere." },
];

const FOR_HIRERS = [
  { n: "1", title: "Search by profession", body: "Type what you need — doctor, photographer, lawyer, designer." },
  { n: "2", title: "Filter by location", body: "Browse professionals in your city or anywhere in India." },
  { n: "3", title: "Contact directly", body: "Reach them via their card — call, email, or WhatsApp in one tap." },
];

export function HowItWorks() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.08 });

  return (
    <section className="bg-white dark:bg-[#0E0C1E] section-padding" ref={ref}>
      <div className="max-w-6xl mx-auto">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="mb-14"
        >
          <p className="text-violet-600 dark:text-violet-400 text-sm font-semibold tracking-widest uppercase mb-3">
            How it works
          </p>
          <h2 className="text-4xl lg:text-5xl font-black text-gray-900 dark:text-white leading-tight">
            Built for two sides<br />of the same table.
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-6">

          {/* For creators */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="rounded-2xl border border-violet-100 dark:border-violet-900/30 bg-violet-50/50 dark:bg-violet-950/20 p-8"
          >
            <div className="inline-flex items-center gap-2 bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300 text-xs font-bold px-3 py-1.5 rounded-full mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-violet-500" />
              For professionals
            </div>
            <p className="text-gray-700 dark:text-white/60 text-sm mb-8 leading-relaxed">
              You have the skills. Give people a proper place to find you.
            </p>
            <div className="space-y-7">
              {FOR_CREATORS.map(({ n, title, body }, i) => (
                <motion.div
                  key={n}
                  initial={{ opacity: 0, x: -12 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.2 + i * 0.1 }}
                  className="flex gap-5"
                >
                  <span className="w-7 h-7 rounded-lg bg-violet-100 dark:bg-violet-900/50 text-violet-600 dark:text-violet-400 text-xs font-black flex items-center justify-center flex-shrink-0 mt-0.5">
                    {n}
                  </span>
                  <div>
                    <p className="text-gray-900 dark:text-white font-semibold text-[15px] mb-0.5">{title}</p>
                    <p className="text-gray-500 dark:text-white/40 text-sm leading-relaxed">{body}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* For hirers */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="rounded-2xl border border-emerald-100 dark:border-emerald-900/30 bg-emerald-50/50 dark:bg-emerald-950/20 p-8"
          >
            <div className="inline-flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 text-xs font-bold px-3 py-1.5 rounded-full mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              For people who hire
            </div>
            <p className="text-gray-700 dark:text-white/60 text-sm mb-8 leading-relaxed">
              Need the right person for the job? They're already here.
            </p>
            <div className="space-y-7">
              {FOR_HIRERS.map(({ n, title, body }, i) => (
                <motion.div
                  key={n}
                  initial={{ opacity: 0, x: 12 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.3 + i * 0.1 }}
                  className="flex gap-5"
                >
                  <span className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-400 text-xs font-black flex items-center justify-center flex-shrink-0 mt-0.5">
                    {n}
                  </span>
                  <div>
                    <p className="text-gray-900 dark:text-white font-semibold text-[15px] mb-0.5">{title}</p>
                    <p className="text-gray-500 dark:text-white/40 text-sm leading-relaxed">{body}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
