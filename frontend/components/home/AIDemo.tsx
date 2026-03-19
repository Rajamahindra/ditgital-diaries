"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Sparkles, Loader2, ArrowRight } from "lucide-react";
import { CardPreviewMini } from "@/components/card/CardPreviewMini";

const DEMO_PROMPTS = [
  "Create a luxury doctor digital card in Hyderabad",
  "Build a modern photographer portfolio card in Mumbai",
  "Design a startup founder card for a tech company in Bangalore",
  "Create a real estate agent card in Delhi",
];

export function AIDemo() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState(false);
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    // Simulate AI generation
    await new Promise((r) => setTimeout(r, 2000));
    setLoading(false);
    setGenerated(true);
  };

  return (
    <section className="bg-primary section-padding" ref={ref}>
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7 }}
          >
            <span className="text-secondary text-sm font-semibold uppercase tracking-widest">
              AI-Powered
            </span>
            <h2 className="text-4xl lg:text-5xl font-display font-black text-white mt-3 mb-6">
              Describe yourself.{" "}
              <span className="gradient-text">AI does the rest.</span>
            </h2>
            <p className="text-white/50 text-lg mb-8 leading-relaxed">
              Our AI understands your profession, location, and style — then generates a complete
              professional card with bio, services, design, and content in seconds.
            </p>

            {/* Prompt input */}
            <div className="bg-dark-card rounded-2xl p-4 border border-white/10 mb-4">
              <div className="flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-accent mt-1 flex-shrink-0" />
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Describe your card... e.g. Create a luxury doctor digital card in Hyderabad"
                  className="flex-1 bg-transparent text-white placeholder-white/30 text-sm resize-none outline-none min-h-[80px]"
                />
              </div>
              <div className="flex justify-end mt-3">
                <button
                  onClick={handleGenerate}
                  disabled={loading || !prompt.trim()}
                  className="btn-gradient flex items-center gap-2 text-sm py-2.5 px-5 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      Generate Card
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Quick prompts */}
            <div className="flex flex-wrap gap-2">
              {DEMO_PROMPTS.map((p) => (
                <button
                  key={p}
                  onClick={() => setPrompt(p)}
                  className="text-xs text-white/50 hover:text-white border border-white/10 hover:border-white/30 rounded-full px-3 py-1.5 transition-all"
                >
                  {p}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Right: Preview */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="flex justify-center"
          >
            <AnimatePresence mode="wait">
              {loading ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="w-72 h-96 bg-dark-card rounded-3xl border border-white/10 flex flex-col items-center justify-center gap-4"
                >
                  <div className="w-16 h-16 rounded-2xl bg-gradient-accent flex items-center justify-center animate-pulse">
                    <Sparkles className="w-8 h-8 text-white" />
                  </div>
                  <p className="text-white/60 text-sm">AI is building your card...</p>
                  <div className="flex gap-1">
                    {[0, 1, 2].map((i) => (
                      <div
                        key={i}
                        className="w-2 h-2 bg-secondary rounded-full animate-bounce"
                        style={{ animationDelay: `${i * 0.15}s` }}
                      />
                    ))}
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="preview"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="relative"
                >
                  {generated && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute -top-4 left-1/2 -translate-x-1/2 bg-green-500 text-white text-xs font-bold px-4 py-1.5 rounded-full whitespace-nowrap z-10"
                    >
                      ✓ Card Generated by AI
                    </motion.div>
                  )}
                  <CardPreviewMini />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
