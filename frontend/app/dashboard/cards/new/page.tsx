"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles, Loader2, ArrowRight, Wand2, ArrowLeft,
  Check, Search, Crown, ChevronRight,
} from "lucide-react";
import toast from "react-hot-toast";
import { cardsAPI, aiAPI, templatesAPI } from "@/lib/api";
import { generateUsername } from "@/lib/utils";
import { useAuthStore } from "@/lib/store";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Template {
  id: string;
  name: string;
  category: string;
  isPremium: boolean;
  tags: string[];
  layout?: {
    theme?: {
      primaryColor?: string;
      secondaryColor?: string;
      accentColor?: string;
      backgroundColor?: string;
      darkMode?: boolean;
      glassEffect?: boolean;
      neonGlow?: boolean;
      backgroundGradient?: string;
      accentStyle?: string;
      avatarShape?: string;
    };
    sections?: { type: string; data: Record<string, unknown> }[];
  };
}

// ─── Constants ────────────────────────────────────────────────────────────────
const PROFESSIONS = [
  { id: "doctor", label: "Doctor / Medical", emoji: "👨‍⚕️", color: "#2563EB" },
  { id: "lawyer", label: "Lawyer", emoji: "⚖️", color: "#D97706" },
  { id: "engineer", label: "Engineer / Developer", emoji: "⚙️", color: "#6366F1" },
  { id: "photographer", label: "Photographer", emoji: "📸", color: "#EC4899" },
  { id: "consultant", label: "Consultant", emoji: "💼", color: "#0EA5E9" },
  { id: "startup", label: "Startup / Founder", emoji: "🚀", color: "#7C3AED" },
  { id: "fitness", label: "Fitness / Trainer", emoji: "💪", color: "#EF4444" },
  { id: "wellness", label: "Wellness / Yoga", emoji: "🧘", color: "#10B981" },
  { id: "designer", label: "Designer / Creative", emoji: "🎨", color: "#F59E0B" },
  { id: "finance", label: "Finance / Advisor", emoji: "💰", color: "#1D4ED8" },
  { id: "real-estate", label: "Real Estate", emoji: "🏠", color: "#059669" },
  { id: "events", label: "Events / Wedding", emoji: "🎉", color: "#C084FC" },
  { id: "marketing", label: "Marketing / Growth", emoji: "📈", color: "#F97316" },
  { id: "travel", label: "Travel / Tourism", emoji: "✈️", color: "#0EA5E9" },
  { id: "artist", label: "Artist / Musician", emoji: "🎵", color: "#A855F7" },
  { id: "other", label: "Other", emoji: "✨", color: "#64748B" },
];

const STYLE_OPTIONS = [
  { id: "glass", label: "Glassmorphism", desc: "Dark, elegant, modern", emoji: "🔮", gradient: "from-blue-900 to-violet-900" },
  { id: "neon", label: "Neon / Cyberpunk", desc: "Bold, electric, futuristic", emoji: "⚡", gradient: "from-black to-green-950" },
  { id: "minimal", label: "Minimal / Clean", desc: "Simple, professional, light", emoji: "🤍", gradient: "from-gray-50 to-white" },
  { id: "luxury", label: "Luxury / Gold", desc: "Premium, exclusive, rich", emoji: "✨", gradient: "from-yellow-950 to-black" },
];

const CATEGORY_GRADIENTS: Record<string, [string, string]> = {
  Doctor: ["#2563EB", "#06B6D4"], Startup: ["#7C3AED", "#A855F7"],
  Photographer: ["#EC4899", "#F97316"], "Real Estate": ["#10B981", "#059669"],
  Lawyer: ["#D97706", "#92400E"], Fitness: ["#EF4444", "#F97316"],
  Designer: ["#A78BFA", "#EC4899"], Finance: ["#1D4ED8", "#0EA5E9"],
  Wellness: ["#4ADE80", "#10B981"], Marketing: ["#F59E0B", "#EF4444"],
  Events: ["#C084FC", "#F0ABFC"], Engineer: ["#64748B", "#94A3B8"],
  Consultant: ["#0EA5E9", "#1D4ED8"], Fashion: ["#E879F9", "#F0ABFC"],
  Travel: ["#0EA5E9", "#38BDF8"], Artist: ["#A855F7", "#EC4899"],
};

// ─── Mini Card Preview ────────────────────────────────────────────────────────
function MiniCardPreview({ template }: { template: Template }) {
  const theme = template.layout?.theme;
  const [c1, c2] = CATEGORY_GRADIENTS[template.category] ?? ["#2563EB", "#7C3AED"];
  const profile = template.layout?.sections?.find((s) => s.type === "profile");
  const name = (profile?.data?.name as string) || template.name;
  const isGlass = !!theme?.glassEffect;
  const isNeon = !!theme?.neonGlow;
  const bgGradient = theme?.backgroundGradient;
  const avatarShape = theme?.avatarShape || "circle";
  const cardBg = bgGradient || theme?.backgroundColor || "#fff";
  const avatarRadius = avatarShape === "square" ? "4px" : "50%";

  return (
    <div className="absolute inset-0 rounded-2xl overflow-hidden flex flex-col" style={{ background: cardBg }}>
      {/* Cover */}
      <div className="h-16 flex-shrink-0 relative overflow-hidden"
        style={{ background: isGlass ? `linear-gradient(135deg, ${c1}60, ${c2}50)` : isNeon ? `linear-gradient(135deg, ${c1}20, ${c2}10)` : `linear-gradient(135deg, ${c1}, ${c2})` }}>
        {isNeon && <div className="absolute bottom-0 left-0 right-0 h-px" style={{ background: c1, boxShadow: `0 0 8px ${c1}` }} />}
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.4) 1px, transparent 1px)`, backgroundSize: "10px 10px" }} />
      </div>
      {/* Avatar */}
      <div className="px-4 -mt-5 flex-shrink-0">
        <div className="w-10 h-10 border-2 border-white shadow-lg flex items-center justify-center text-white text-sm font-bold"
          style={{ borderRadius: avatarRadius, background: isGlass ? `${c1}50` : `linear-gradient(135deg, ${c1}, ${c2})`, boxShadow: isNeon ? `0 0 10px ${c1}` : undefined }}>
          {name.charAt(0)}
        </div>
      </div>
      {/* Content */}
      <div className="px-4 pt-2 pb-3 flex-1">
        <div className="h-2.5 rounded-full w-24 mb-1.5" style={{ background: theme?.darkMode ? "rgba(255,255,255,0.8)" : "#1e293b", opacity: 0.85 }} />
        <div className="h-2 rounded-full w-16 mb-3" style={{ background: isNeon ? c1 : c2, opacity: 0.6, boxShadow: isNeon ? `0 0 4px ${c1}` : undefined }} />
        <div className="flex gap-1.5 mb-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex-1 h-5 rounded-lg" style={{ background: isGlass ? "rgba(255,255,255,0.12)" : c1, opacity: isGlass ? 1 : 0.12, border: isNeon ? `1px solid ${c1}50` : undefined }} />
          ))}
        </div>
        <div className="h-4 rounded-full w-full" style={{ background: isNeon ? "transparent" : `linear-gradient(135deg, ${c1}, ${c2})`, opacity: 0.75, border: isNeon ? `1px solid ${c1}` : undefined, boxShadow: isNeon ? `0 0 8px ${c1}` : undefined }} />
      </div>
    </div>
  );
}

// ─── Template Card ────────────────────────────────────────────────────────────
function TemplateCard({ template, selected, onSelect }: { template: Template; selected: boolean; onSelect: () => void }) {
  const [c1, c2] = CATEGORY_GRADIENTS[template.category] ?? ["#2563EB", "#7C3AED"];
  const theme = template.layout?.theme;
  const isNeon = !!theme?.neonGlow;
  const isGlass = !!theme?.glassEffect;
  const bgGradient = theme?.backgroundGradient;
  const previewBg = bgGradient ? bgGradient : isNeon ? `linear-gradient(135deg, ${c1}15, ${c2}10)` : `linear-gradient(135deg, ${c1}20, ${c2}20)`;

  return (
    <motion.div whileHover={{ y: -3 }} onClick={onSelect}
      className={`relative rounded-2xl overflow-hidden cursor-pointer border-2 transition-all ${selected ? "border-blue-500 shadow-[0_0_0_4px_rgba(37,99,235,0.2)]" : "border-transparent hover:border-blue-300"}`}>
      {/* Preview */}
      <div className="relative h-40 overflow-hidden" style={{ background: previewBg }}>
        {isNeon && <div className="absolute inset-0 opacity-15" style={{ backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 4px, ${c1}20 4px, ${c1}20 5px)` }} />}
        <MiniCardPreview template={template} />
        {selected && (
          <div className="absolute inset-0 bg-blue-500/20 flex items-center justify-center">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
              <Check className="w-4 h-4 text-white" />
            </div>
          </div>
        )}
        {template.isPremium && (
          <div className="absolute top-2 right-2 bg-amber-500 text-white text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
            <Crown className="w-3 h-3" /> PRO
          </div>
        )}
      </div>
      {/* Info */}
      <div className="p-3 bg-white dark:bg-dark-card">
        <p className="text-xs font-semibold text-primary dark:text-white truncate">{template.name}</p>
        <p className="text-xs text-gray-400 dark:text-white/40 mt-0.5">{template.category}</p>
      </div>
    </motion.div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function NewCardPage() {
  const [step, setStep] = useState<"method" | "profession" | "style" | "template" | "ai" | "creating">("method");
  const [method, setMethod] = useState<"template" | "ai" | "blank" | null>(null);
  const [selectedProfession, setSelectedProfession] = useState<string | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [templatesLoading, setTemplatesLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [aiPrompt, setAiPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { user } = useAuthStore();

  // Load templates when entering template step
  useEffect(() => {
    if (step === "template" && templates.length === 0) {
      setTemplatesLoading(true);
      templatesAPI.getAll()
        .then((res) => setTemplates(res.data.templates ?? []))
        .catch(() => toast.error("Failed to load templates"))
        .finally(() => setTemplatesLoading(false));
    }
  }, [step]);

  // Auto-set AI prompt when profession is selected
  useEffect(() => {
    if (selectedProfession && method === "ai") {
      const prof = PROFESSIONS.find((p) => p.id === selectedProfession);
      if (prof) setAiPrompt(`Create a professional ${prof.label} digital visiting card`);
    }
  }, [selectedProfession, method]);

  const filteredTemplates = templates.filter((t) => {
    const profMatch = !selectedProfession || selectedProfession === "other" ||
      t.category.toLowerCase().includes(selectedProfession.replace("-", " ")) ||
      (t.tags ?? []).some((tag) => tag.toLowerCase().includes(selectedProfession.replace("-", " ")));
    const styleMatch = !selectedStyle ||
      (selectedStyle === "glass" && t.layout?.theme?.glassEffect) ||
      (selectedStyle === "neon" && t.layout?.theme?.neonGlow) ||
      (selectedStyle === "luxury" && t.layout?.theme?.accentStyle === "luxury") ||
      (selectedStyle === "minimal" && !t.layout?.theme?.glassEffect && !t.layout?.theme?.neonGlow && t.layout?.theme?.accentStyle !== "luxury");
    const searchMatch = !search || t.name.toLowerCase().includes(search.toLowerCase()) || t.category.toLowerCase().includes(search.toLowerCase());
    return profMatch && styleMatch && searchMatch;
  });

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

  const createFromTemplate = async () => {
    if (!selectedTemplate) return;
    setLoading(true);
    setStep("creating");
    try {
      const username = generateUsername(user?.name || "user") + "-" + Date.now().toString(36);
      const res = await cardsAPI.create({ username, templateId: selectedTemplate.id });
      toast.success("Template applied! Opening builder...");
      router.push(`/dashboard/cards/${res.data.card.id}/edit`);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? "Failed to create card";
      toast.error(msg);
      setLoading(false);
      setStep("template");
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

  const STEPS_LABEL: Record<string, string> = {
    method: "Choose Method",
    profession: "Your Profession",
    style: "Pick a Style",
    template: "Choose Template",
    ai: "AI Generator",
    creating: "Creating...",
  };

  const stepOrder = ["method", "profession", "style", "template"];
  const currentStepIdx = stepOrder.indexOf(step);

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          {step !== "method" && step !== "creating" && (
            <button onClick={() => {
              if (step === "profession") setStep("method");
              else if (step === "style") setStep("profession");
              else if (step === "template") setStep("style");
              else if (step === "ai") setStep("profession");
            }} className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-white/5 text-gray-400 hover:text-primary dark:hover:text-white transition-all">
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          <div>
            <h1 className="text-2xl font-display font-bold text-primary dark:text-white">Create New Card</h1>
            <p className="text-gray-500 dark:text-white/50 text-sm mt-0.5">{STEPS_LABEL[step]}</p>
          </div>
        </div>

        {/* Progress bar */}
        {step !== "creating" && step !== "ai" && (
          <div className="flex gap-2 mt-4">
            {stepOrder.map((s, i) => (
              <div key={s} className={`h-1.5 flex-1 rounded-full transition-all ${i <= currentStepIdx ? "bg-secondary" : "bg-gray-200 dark:bg-white/10"}`} />
            ))}
          </div>
        )}
      </motion.div>

      <AnimatePresence mode="wait">
        {/* ── STEP 1: Method ── */}
        {step === "method" && (
          <motion.div key="method" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
            className="space-y-4">
            {[
              { id: "template", icon: "🎨", title: "Choose a Template", desc: "Pick from 40+ professionally designed templates", badge: "Most Popular", badgeColor: "bg-blue-500" },
              { id: "ai", icon: "🤖", title: "Generate with AI", desc: "Describe yourself, AI builds your entire card", badge: "Recommended", badgeColor: "bg-gradient-to-r from-violet-500 to-blue-500" },
              { id: "blank", icon: "✏️", title: "Start from Scratch", desc: "Open the drag-and-drop builder with a blank canvas", badge: null, badgeColor: "" },
            ].map(({ id, icon, title, desc, badge, badgeColor }) => (
              <motion.button key={id} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
                onClick={() => {
                  if (id === "blank") { createBlankCard(); return; }
                  setMethod(id as "template" | "ai");
                  setStep("profession");
                }}
                disabled={loading}
                className="w-full bg-white dark:bg-dark-card rounded-2xl p-6 border border-gray-100 dark:border-white/5 hover:border-secondary/40 hover:shadow-lg transition-all text-left group flex items-center gap-5">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-50 to-violet-50 dark:from-white/5 dark:to-white/10 flex items-center justify-center text-3xl flex-shrink-0">
                  {icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-primary dark:text-white font-semibold">{title}</h3>
                    {badge && <span className={`text-white text-xs font-bold px-2.5 py-0.5 rounded-full ${badgeColor}`}>{badge}</span>}
                  </div>
                  <p className="text-gray-400 dark:text-white/40 text-sm">{desc}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-300 dark:text-white/20 group-hover:text-secondary transition-colors flex-shrink-0" />
              </motion.button>
            ))}
          </motion.div>
        )}

        {/* ── STEP 2: Profession ── */}
        {step === "profession" && (
          <motion.div key="profession" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <p className="text-gray-500 dark:text-white/50 text-sm mb-5">Select your profession to get the best matching templates</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {PROFESSIONS.map(({ id, label, emoji, color }) => (
                <motion.button key={id} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                  onClick={() => {
                    setSelectedProfession(id);
                    if (method === "ai") setStep("ai");
                    else setStep("style");
                  }}
                  className={`p-4 rounded-2xl border-2 text-left transition-all ${selectedProfession === id ? "border-blue-500 shadow-[0_0_0_3px_rgba(37,99,235,0.15)]" : "border-gray-100 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20"}`}
                  style={selectedProfession === id ? { background: `${color}10` } : {}}>
                  <span className="text-2xl block mb-2">{emoji}</span>
                  <span className="text-xs font-semibold text-primary dark:text-white leading-tight">{label}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {/* ── STEP 3: Style ── */}
        {step === "style" && (
          <motion.div key="style" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <p className="text-gray-500 dark:text-white/50 text-sm mb-5">Choose the visual style for your card</p>
            <div className="grid grid-cols-2 gap-4">
              {STYLE_OPTIONS.map(({ id, label, desc, emoji, gradient }) => (
                <motion.button key={id} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  onClick={() => { setSelectedStyle(id); setStep("template"); }}
                  className={`relative rounded-2xl overflow-hidden border-2 text-left transition-all ${selectedStyle === id ? "border-blue-500" : "border-transparent hover:border-gray-300 dark:hover:border-white/20"}`}>
                  <div className={`h-24 bg-gradient-to-br ${gradient} flex items-center justify-center`}>
                    <span className="text-4xl">{emoji}</span>
                  </div>
                  <div className="p-4 bg-white dark:bg-dark-card">
                    <p className="font-semibold text-primary dark:text-white text-sm">{label}</p>
                    <p className="text-xs text-gray-400 dark:text-white/40 mt-0.5">{desc}</p>
                  </div>
                  {selectedStyle === id && (
                    <div className="absolute top-2 right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                      <Check className="w-3.5 h-3.5 text-white" />
                    </div>
                  )}
                </motion.button>
              ))}
            </div>
            <button onClick={() => setStep("template")}
              className="mt-4 w-full py-3 rounded-xl border border-gray-200 dark:border-white/10 text-gray-500 dark:text-white/50 text-sm hover:border-secondary hover:text-secondary transition-all">
              Skip — Show all templates
            </button>
          </motion.div>
        )}

        {/* ── STEP 4: Template ── */}
        {step === "template" && (
          <motion.div key="template" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <div className="flex items-center gap-3 mb-5">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input value={search} onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search templates..."
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-dark-card text-primary dark:text-white placeholder-gray-400 text-sm outline-none focus:ring-2 focus:ring-secondary/30" />
              </div>
              <span className="text-xs text-gray-400 dark:text-white/40 whitespace-nowrap">{filteredTemplates.length} templates</span>
            </div>

            {templatesLoading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-52 rounded-2xl shimmer" />)}
              </div>
            ) : filteredTemplates.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-4xl mb-3">🔍</p>
                <p className="text-gray-500 dark:text-white/40 font-medium">No templates found</p>
                <button onClick={() => { setSearch(""); setSelectedStyle(null); setSelectedProfession(null); }}
                  className="mt-3 text-secondary text-sm hover:underline">Clear filters</button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-h-[480px] overflow-y-auto pr-1">
                {filteredTemplates.map((t) => (
                  <TemplateCard key={t.id} template={t} selected={selectedTemplate?.id === t.id} onSelect={() => setSelectedTemplate(t)} />
                ))}
              </div>
            )}

            {selectedTemplate && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className="mt-5 p-4 bg-blue-50 dark:bg-blue-500/10 rounded-2xl border border-blue-200 dark:border-blue-500/20 flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-blue-700 dark:text-blue-400">Selected: {selectedTemplate.name}</p>
                  <p className="text-xs text-blue-500 dark:text-blue-400/70 mt-0.5">{selectedTemplate.category} • {selectedTemplate.layout?.sections?.length ?? 0} sections</p>
                </div>
                <button onClick={createFromTemplate} disabled={loading}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-all disabled:opacity-50">
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
                  Use This
                </button>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* ── AI Step ── */}
        {step === "ai" && (
          <motion.div key="ai" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
            className="bg-white dark:bg-dark-card rounded-2xl p-6 border border-gray-100 dark:border-white/5">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center">
                <Wand2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-primary dark:text-white font-semibold">AI Card Generator</h3>
                <p className="text-gray-400 dark:text-white/40 text-xs">Describe yourself, AI builds everything</p>
              </div>
            </div>
            <textarea value={aiPrompt} onChange={(e) => setAiPrompt(e.target.value)}
              placeholder="e.g. Create a luxury cardiologist card for Dr. Arjun Sharma in Hyderabad with 15 years experience, specializing in cardiac surgery..."
              className="w-full bg-gray-50 dark:bg-primary/50 text-primary dark:text-white placeholder-gray-400 dark:placeholder-white/30 rounded-xl p-4 text-sm outline-none focus:ring-2 focus:ring-secondary/30 resize-none min-h-[120px] border border-gray-100 dark:border-white/5 mb-4" />
            <div className="flex flex-wrap gap-2 mb-5">
              {["Add WhatsApp & call buttons", "Include services section", "Add testimonials", "Make it luxury style"].map((s) => (
                <button key={s} onClick={() => setAiPrompt((prev) => prev + ". " + s)}
                  className="text-xs border border-gray-200 dark:border-white/10 rounded-full px-3 py-1.5 text-gray-500 dark:text-white/50 hover:border-secondary hover:text-secondary transition-all">
                  + {s}
                </button>
              ))}
            </div>
            <button onClick={createWithAI} disabled={loading || !aiPrompt.trim()}
              className="w-full btn-gradient flex items-center justify-center gap-2 py-3.5 disabled:opacity-50 text-sm font-semibold">
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Generating...</> : <><Sparkles className="w-4 h-4" /> Generate My Card</>}
            </button>
          </motion.div>
        )}

        {/* ── Creating ── */}
        {step === "creating" && (
          <motion.div key="creating" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="bg-white dark:bg-dark-card rounded-2xl p-16 border border-gray-100 dark:border-white/5 text-center">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-violet-600 mx-auto flex items-center justify-center mb-6 animate-pulse">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-xl font-bold text-primary dark:text-white mb-3">
              {method === "ai" ? "AI is building your card..." : "Setting up your card..."}
            </h2>
            <p className="text-gray-400 dark:text-white/40 text-sm mb-6">
              {method === "ai" ? "Generating layout, content, and design based on your prompt." : "Applying template and opening the builder."}
            </p>
            <div className="flex justify-center gap-2">
              {[0, 1, 2].map((i) => (
                <div key={i} className="w-2 h-2 bg-secondary rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
