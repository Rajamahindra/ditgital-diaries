"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Sparkles, Loader2, ArrowRight } from "lucide-react";

const PROMPTS = [
  "Cardiologist in Hyderabad, 12 years experience",
  "Wedding photographer in Mumbai, available on weekends",
  "Tax consultant and CA in Delhi",
  "UX designer at a startup in Bangalore",
];

export function AIDemo() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setDone(false);
    await new Promise((r) => setTimeout(r, 1800));
    setLoading(false);
    setDone(true);
  };

  return (
    <section className="bg-[#0C0A1A] section-padding" ref={ref}>
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-14 items-center">

          {/* Left */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.55 }}
          >
            <p className="text-violet-400 text-sm font-semibold tracking-widest uppercase mb-4">
              AI-powered
            </p>
            <h2 className="text-4xl lg:text-5xl font-black text-white leading-tight mb-5">
              Describe yourself.<br />
              <span className="text-violet-400">Card ready in seconds.</span>
            </h2>
            <p className="text-white/40 text-base leading-relaxed mb-8 max-w-md">
              Tell the AI who you are and what you do. It writes your bio, picks a layout, and builds the card — you just review and publish.
            </p>

            <div className="bg-white/[0.05] rounded-xl border border-white/[0.08] p-4 mb-4">
              <div className="flex items-start gap-3">
                <Sparkles className="w-4 h-4 text-violet-400 mt-1 flex-shrink-0" />
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="e.g. Cardiologist in Hyderabad, 12 years experience..."
                  className="flex-1 bg-transparent text-white placeholder-white/20 text-sm resize-none outline-none min-h-[72px] leading-relaxed"
                />
              </div>
              <div className="flex justify-between items-center mt-3 pt-3 border-t border-white/[0.06]">
                <span className="text-white/20 text-xs">Powered by AI</span>
                <button
                  onClick={handleGenerate}
                  disabled={loading || !prompt.trim()}
                  className="flex items-center gap-2 bg-violet-600 hover:bg-violet-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold text-xs px-4 py-2 rounded-lg transition-colors"
                >
                  {loading ? <><Loader2 className="w-3.5 h-3.5 animate-spin" />Generating...</> : <>Generate<ArrowRight className="w-3.5 h-3.5" /></>}
                </button>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {PROMPTS.map((p) => (
                <button
                  key={p}
                  onClick={() => setPrompt(p)}
                  className="text-[11px] text-white/40 hover:text-white/70 border border-white/[0.08] hover:border-white/20 rounded-full px-3 py-1.5 transition-all"
                >
                  {p}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Right — result preview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.55, delay: 0.15 }}
            className="flex justify-center"
          >
            <div className="w-[300px]">
              <AnimatePresence mode="wait">
                {loading ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="h-[360px] rounded-2xl bg-white/[0.04] border border-white/[0.07] flex flex-col items-center justify-center gap-4"
                  >
                    <div className="w-12 h-12 rounded-xl bg-violet-600/20 flex items-center justify-center">
                      <Sparkles className="w-6 h-6 text-violet-400 animate-pulse" />
                    </div>
                    <p className="text-white/40 text-sm">Building your card...</p>
                    <div className="flex gap-1">
                      {[0,1,2].map((i) => (
                        <div key={i} className="w-1.5 h-1.5 bg-violet-500 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                      ))}
                    </div>
                  </motion.div>
                ) : done ? (
                  <motion.div
                    key="done"
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="rounded-2xl overflow-hidden border border-white/10 shadow-2xl"
                  >
                    <div className="h-24" style={{ background: "linear-gradient(135deg,#5B21B6,#4F46E5)" }} />
                    <div className="bg-[#13111F] px-5 pb-5">
                      <div className="-mt-7 mb-4 flex items-end justify-between">
                        <div className="w-14 h-14 rounded-xl border-4 border-[#13111F] bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white font-black">
                          {prompt[0]?.toUpperCase() || "Y"}
                        </div>
                        <span className="text-[10px] text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-2 py-0.5 rounded-full mb-1 font-semibold">
                          ✓ AI generated
                        </span>
                      </div>
                      <p className="text-white font-bold text-sm mb-0.5">{prompt.split(",")[0] || "Your Name"}</p>
                      <p className="text-violet-400 text-xs mb-3">{prompt.split(",")[1]?.trim() || "Professional"}</p>
                      <p className="text-white/40 text-[11px] leading-relaxed mb-4">
                        AI-generated bio based on your description. Personalised and ready to publish.
                      </p>
                      <div className="grid grid-cols-3 gap-1.5">
                        {["Email","Call","Portfolio"].map((l) => (
                          <div key={l} className="bg-white/[0.06] rounded-lg py-2 text-center">
                            <span className="text-white/40 text-[10px]">{l}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="h-[360px] rounded-2xl bg-white/[0.03] border border-white/[0.07] border-dashed flex items-center justify-center"
                  >
                    <p className="text-white/20 text-sm text-center px-6">
                      Enter a description and click Generate to preview your card
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
