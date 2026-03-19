"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Sparkles, Loader2, ArrowRight, Wand2 } from "lucide-react";
import toast from "react-hot-toast";
import { cardsAPI, aiAPI } from "@/lib/api";
import { generateUsername } from "@/lib/utils";
import { useAuthStore } from "@/lib/store";

const TEMPLATES_QUICK = [
  { id: "doctor", label: "Doctor", emoji: "👨‍⚕️" },
  { id: "engineer", label: "Engineer", emoji: "⚙️" },
  { id: "photographer", label: "Photographer", emoji: "📸" },
  { id: "lawyer", label: "Lawyer", emoji: "⚖️" },
  { id: "consultant", label: "Consultant", emoji: "💼" },
  { id: "startup", label: "Startup", emoji: "🚀" },
];

export default function NewCardPage() {
  const [step, setStep] = useState<"choose" | "ai" | "creating">("choose");
  const [aiPrompt, setAiPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { user } = useAuthStore();

  const createBlankCard = async () => {
    setLoading(true);
    try {
      const username = generateUsername(user?.name || "user") + "-" + Date.now().toString(36);
      const res = await cardsAPI.create({ username });
      router.push(`/dashboard/cards/${res.data.card.id}/edit`);
    } catch {
      toast.error("Failed to create card");
      setLoading(false);
    }
  };

  const createWithAI = async () => {
    if (!aiPrompt.trim()) return;
    setLoading(true);
    setStep("creating");
    try {
      const aiRes = await aiAPI.generateCard(aiPrompt);
      const { layout } = aiRes.data;
      const username = generateUsername(user?.name || "user") + "-" + Date.now().toString(36);
      const res = await cardsAPI.create({ username });
      await cardsAPI.update(res.data.card.id, { layout });
      toast.success("AI generated your card!");
      router.push(`/dashboard/cards/${res.data.card.id}/edit`);
    } catch {
      toast.error("AI generation failed. Creating blank card...");
      await createBlankCard();
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-2xl font-display font-bold text-primary dark:text-white mb-2">
          Create New Card
        </h1>
        <p className="text-gray-500 dark:text-white/50">
          Start from scratch or let AI build it for you.
        </p>
      </motion.div>

      {step === "creating" ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white dark:bg-dark-card rounded-2xl p-16 border border-gray-100 dark:border-white/5 text-center"
        >
          <div className="w-20 h-20 rounded-2xl bg-gradient-accent mx-auto flex items-center justify-center mb-6 animate-pulse">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-xl font-bold text-primary dark:text-white mb-3">
            AI is building your card...
          </h2>
          <p className="text-gray-400 dark:text-white/40 text-sm mb-6">
            Generating layout, content, and design based on your prompt.
          </p>
          <div className="flex justify-center gap-2">
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
        <div className="space-y-5">
          {/* AI Option */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-dark-card rounded-2xl p-6 border border-gray-100 dark:border-white/5"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-accent flex items-center justify-center">
                <Wand2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-primary dark:text-white font-semibold">AI Card Generator</h3>
                <p className="text-gray-400 dark:text-white/40 text-xs">Describe yourself, AI builds everything</p>
              </div>
              <span className="ml-auto bg-gradient-accent text-white text-xs font-bold px-2.5 py-1 rounded-full">
                Recommended
              </span>
            </div>

            <textarea
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              placeholder="e.g. Create a luxury cardiologist card for Dr. Arjun Sharma in Hyderabad with 15 years experience..."
              className="w-full bg-gray-50 dark:bg-primary/50 text-primary dark:text-white placeholder-gray-400 dark:placeholder-white/30 rounded-xl p-4 text-sm outline-none focus:ring-2 focus:ring-secondary/30 resize-none min-h-[100px] border border-gray-100 dark:border-white/5"
            />

            <div className="flex flex-wrap gap-2 mt-3 mb-4">
              {TEMPLATES_QUICK.map(({ id, label, emoji }) => (
                <button
                  key={id}
                  onClick={() => setAiPrompt(`Create a professional ${label.toLowerCase()} digital card`)}
                  className="flex items-center gap-1.5 text-xs border border-gray-200 dark:border-white/10 rounded-full px-3 py-1.5 text-gray-500 dark:text-white/50 hover:border-secondary hover:text-secondary transition-all"
                >
                  <span>{emoji}</span>
                  {label}
                </button>
              ))}
            </div>

            <button
              onClick={createWithAI}
              disabled={loading || !aiPrompt.trim()}
              className="w-full btn-gradient flex items-center justify-center gap-2 py-3 disabled:opacity-50"
            >
              {loading ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Generating...</>
              ) : (
                <><Sparkles className="w-4 h-4" /> Generate with AI</>
              )}
            </button>
          </motion.div>

          {/* Blank option */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <button
              onClick={createBlankCard}
              disabled={loading}
              className="w-full bg-white dark:bg-dark-card rounded-2xl p-6 border border-gray-100 dark:border-white/5 hover:border-secondary/30 transition-all text-left group"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-primary dark:text-white font-semibold mb-1">Start from Scratch</h3>
                  <p className="text-gray-400 dark:text-white/40 text-sm">
                    Open the drag-and-drop builder with a blank canvas.
                  </p>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-300 dark:text-white/20 group-hover:text-secondary transition-colors" />
              </div>
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
}
