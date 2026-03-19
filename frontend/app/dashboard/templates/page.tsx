"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Loader2, Sparkles, Crown, Search } from "lucide-react";
import { templatesAPI, cardsAPI } from "@/lib/api";
import { useAuthStore } from "@/lib/store";
import { generateUsername } from "@/lib/utils";

interface TemplateTheme {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  darkMode: boolean;
}

interface TemplateSection {
  type: string;
  data: Record<string, unknown>;
}

interface Template {
  id: string;
  name: string;
  category: string;
  isPremium: boolean;
  tags: string[];
  layout?: {
    theme?: Partial<TemplateTheme>;
    sections?: TemplateSection[];
  };
}

const CATEGORY_ICONS: Record<string, string> = {
  All: "✦", Doctor: "🩺", Startup: "🚀", Photographer: "📸",
  "Real Estate": "🏠", Lawyer: "⚖️", Fitness: "💪", Designer: "🎨",
  Chef: "👨‍🍳", Architect: "🏛️", Finance: "💰", Wellness: "🧘",
  Marketing: "📈", Events: "🎉", Engineer: "⚙️", Consultant: "💼",
  Fashion: "👗", Travel: "✈️", Artist: "🎵",
};

const STYLE_LABELS: Record<string, { label: string; color: string }> = {
  glass: { label: "Glass", color: "#38BDF8" },
  neon: { label: "Neon", color: "#00FF88" },
  minimal: { label: "Minimal", color: "#6B7280" },
  luxury: { label: "Gold", color: "#D4AF37" },
  gradient: { label: "Gradient", color: "#A855F7" },
  geometric: { label: "Geo", color: "#F59E0B" },
  retro: { label: "Retro", color: "#8B4513" },
  dark: { label: "Dark", color: "#94A3B8" },
  playful: { label: "Fun", color: "#F472B6" },
};

function detectStyle(template: Template): string {
  const theme = template.layout?.theme as Record<string, unknown> | undefined;
  if (theme?.glassEffect) return "glass";
  if (theme?.neonGlow) return "neon";
  const accent = theme?.accentStyle as string | undefined;
  if (accent === "luxury") return "luxury";
  if (accent === "retro") return "retro";
  if (accent === "cyber") return "neon";
  if (accent === "playful") return "playful";
  if (theme?.backgroundPattern) return "geometric";
  if (theme?.darkMode && !theme?.glassEffect) return "dark";
  if (theme?.backgroundStyle === "gradient") return "gradient";
  return "minimal";
}

const CATEGORY_GRADIENTS: Record<string, [string, string]> = {
  Doctor: ["#2563EB", "#06B6D4"], Startup: ["#7C3AED", "#A855F7"],
  Photographer: ["#EC4899", "#F97316"], "Real Estate": ["#10B981", "#059669"],
  Lawyer: ["#D97706", "#92400E"], Fitness: ["#EF4444", "#F97316"],
  Designer: ["#A78BFA", "#EC4899"], Chef: ["#F59E0B", "#EF4444"],
  Architect: ["#6366F1", "#8B5CF6"], Finance: ["#1D4ED8", "#0EA5E9"],
  Wellness: ["#4ADE80", "#10B981"], Marketing: ["#F59E0B", "#EF4444"],
  Events: ["#C084FC", "#F0ABFC"], Engineer: ["#64748B", "#94A3B8"],
  Consultant: ["#0EA5E9", "#1D4ED8"], Fashion: ["#E879F9", "#F0ABFC"],
  Travel: ["#0EA5E9", "#38BDF8"], Artist: ["#A855F7", "#EC4899"],
};

function getTheme(template: Template): TemplateTheme {
  return {
    primaryColor: template.layout?.theme?.primaryColor ?? "#0F172A",
    secondaryColor: template.layout?.theme?.secondaryColor ?? "#2563EB",
    accentColor: template.layout?.theme?.accentColor ?? "#7C3AED",
    backgroundColor: template.layout?.theme?.backgroundColor ?? "#FFFFFF",
    darkMode: template.layout?.theme?.darkMode ?? false,
  };
}

function MiniCardPreview({ template }: { template: Template }) {
  const theme = getTheme(template);
  const extTheme = template.layout?.theme as Record<string, unknown> | undefined;
  const [c1, c2] = CATEGORY_GRADIENTS[template.category] ?? ["#2563EB", "#7C3AED"];
  const profile = template.layout?.sections?.find((s) => s.type === "profile");
  const name = (profile?.data?.name as string) || template.name;

  const isGlass = !!extTheme?.glassEffect;
  const isNeon = !!extTheme?.neonGlow;
  const isRetro = extTheme?.accentStyle === "retro";
  const bgGradient = extTheme?.backgroundGradient as string | undefined;
  const bgPattern = extTheme?.backgroundPattern as string | undefined;
  const avatarShape = (extTheme?.avatarShape as string) || "circle";

  const cardBg = bgGradient || theme.backgroundColor;
  const avatarRadius = avatarShape === "square" ? "4px" : avatarShape === "hexagon" ? "30% 70% 70% 30% / 30% 30% 70% 70%" : "50%";

  return (
    <div className="absolute inset-3 rounded-xl overflow-hidden shadow-2xl flex flex-col"
      style={{ background: cardBg }}>
      {/* Cover */}
      <div className="h-10 flex-shrink-0 relative overflow-hidden"
        style={{
          background: isGlass
            ? `linear-gradient(135deg, ${c1}50, ${c2}40)`
            : isNeon
            ? `linear-gradient(135deg, ${c1}20, ${c2}10)`
            : `linear-gradient(135deg, ${c1}, ${c2})`,
        }}>
        {isNeon && (
          <div className="absolute bottom-0 left-0 right-0 h-px" style={{ background: c1, boxShadow: `0 0 6px ${c1}` }} />
        )}
        {bgPattern && bgPattern !== "noise" && (
          <div className="absolute inset-0 opacity-30"
            style={{ backgroundImage: `radial-gradient(circle, ${c1}40 1px, transparent 1px)`, backgroundSize: "8px 8px" }} />
        )}
      </div>
      {/* Avatar */}
      <div className="px-3 -mt-4 flex-shrink-0">
        <div className="w-8 h-8 border-2 border-white shadow-md flex items-center justify-center text-white text-xs font-bold"
          style={{
            borderRadius: avatarRadius,
            background: isGlass ? `${c1}40` : `linear-gradient(135deg, ${c1}, ${c2})`,
            ...(isNeon ? { boxShadow: `0 0 8px ${c1}` } : {}),
          }}>
          {name.charAt(0)}
        </div>
      </div>
      {/* Content */}
      <div className="px-3 pt-1.5 pb-2 flex-1 min-h-0">
        <div className="h-2 rounded-full w-20 mb-1"
          style={{ background: theme.darkMode ? "rgba(255,255,255,0.7)" : theme.primaryColor, opacity: 0.85 }} />
        <div className="h-1.5 rounded-full w-14 mb-2"
          style={{ background: isNeon ? c1 : theme.secondaryColor, opacity: 0.6, ...(isNeon ? { boxShadow: `0 0 4px ${c1}` } : {}) }} />
        <div className="flex gap-1">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex-1 h-4 rounded-md"
              style={{
                background: isGlass ? "rgba(255,255,255,0.1)" : theme.secondaryColor,
                opacity: isGlass ? 1 : 0.12,
                border: isNeon ? `1px solid ${c1}40` : undefined,
              }} />
          ))}
        </div>
        <div className="mt-2 h-3 rounded-full w-full"
          style={{
            background: isNeon
              ? "transparent"
              : `linear-gradient(135deg, ${c1}, ${c2})`,
            opacity: 0.7,
            border: isNeon ? `1px solid ${c1}` : undefined,
            boxShadow: isNeon ? `0 0 6px ${c1}` : undefined,
          }} />
      </div>
    </div>
  );
}

function TemplateCard({ template, onUse, isCreating }: {
  template: Template; onUse: () => void; isCreating: boolean;
}) {
  const [c1, c2] = CATEGORY_GRADIENTS[template.category] ?? ["#2563EB", "#7C3AED"];
  const theme = getTheme(template);
  const extTheme = template.layout?.theme as Record<string, unknown> | undefined;
  const profile = template.layout?.sections?.find((s) => s.type === "profile");
  const profession = (profile?.data?.profession as string) || template.category;
  const sectionCount = template.layout?.sections?.length ?? 0;
  const styleKey = detectStyle(template);
  const styleInfo = STYLE_LABELS[styleKey];
  const isNeon = !!extTheme?.neonGlow;
  const isGlass = !!extTheme?.glassEffect;
  const bgGradient = extTheme?.backgroundGradient as string | undefined;

  const previewBg = bgGradient
    ? bgGradient
    : isNeon
    ? `linear-gradient(135deg, ${c1}15, ${c2}10)`
    : `linear-gradient(135deg, ${c1}22, ${c2}22)`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="group bg-white dark:bg-dark-card rounded-2xl overflow-hidden border border-gray-100 dark:border-white/5 hover:border-secondary/40 hover:shadow-2xl transition-all duration-300 flex flex-col"
    >
      {/* Preview area */}
      <div className="relative h-44 overflow-hidden flex-shrink-0" style={{ background: previewBg }}>
        {isNeon && (
          <div className="absolute inset-0 opacity-20"
            style={{ backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 4px, ${c1}15 4px, ${c1}15 5px)` }} />
        )}
        <MiniCardPreview template={template} />
        {/* Badges */}
        <div className="absolute top-2.5 left-2.5 z-10 flex gap-1.5">
          <span className="bg-black/40 backdrop-blur-sm text-white text-xs font-medium px-2.5 py-1 rounded-full">
            {CATEGORY_ICONS[template.category] ?? "✦"} {template.category}
          </span>
        </div>
        {/* Style badge */}
        <div className="absolute top-2.5 right-2.5 z-10 flex gap-1.5">
          {template.isPremium && (
            <div className="bg-amber-500 text-white text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
              <Crown className="w-3 h-3" /> PRO
            </div>
          )}
          {styleInfo && (
            <div className="text-xs font-bold px-2 py-0.5 rounded-full"
              style={{ background: `${styleInfo.color}25`, color: styleInfo.color, border: `1px solid ${styleInfo.color}50` }}>
              {styleInfo.label}
            </div>
          )}
        </div>
        {/* Section count */}
        <div className="absolute bottom-2.5 right-2.5 z-10 bg-black/40 backdrop-blur-sm text-white text-xs px-2 py-0.5 rounded-full">
          {sectionCount} sections
        </div>
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="text-primary dark:text-white font-semibold text-sm leading-tight">{template.name}</h3>
          <div className="w-3 h-3 rounded-full flex-shrink-0 mt-0.5"
            style={{ background: `linear-gradient(135deg, ${c1}, ${c2})` }} />
        </div>
        <p className="text-gray-400 dark:text-white/40 text-xs truncate mb-2">{profession}</p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-3">
          {(template.tags ?? []).slice(0, 3).map((tag) => (
            <span key={tag}
              className="text-xs px-2 py-0.5 rounded-full border"
              style={{ color: c1, borderColor: `${c1}30`, background: `${c1}08` }}>
              {tag}
            </span>
          ))}
        </div>

        {/* Color dots */}
        <div className="flex items-center gap-1.5 mb-3">
          {[theme.primaryColor, theme.secondaryColor, theme.accentColor, theme.backgroundColor].map((color, i) => (
            <div key={i} className="w-4 h-4 rounded-full border border-white/20 shadow-sm"
              style={{ background: color }} title={color} />
          ))}
          <span className="text-xs text-gray-300 dark:text-white/20 ml-1">
            {theme.darkMode ? "Dark" : "Light"}
          </span>
        </div>

        <button
          onClick={onUse}
          disabled={isCreating}
          className="mt-auto w-full py-2.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          style={{
            background: isCreating ? `${c1}20` : `linear-gradient(135deg, ${c1}, ${c2})`,
            color: isCreating ? c1 : "#FFFFFF",
          }}
        >
          {isCreating ? (
            <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Creating...</>
          ) : (
            <><Sparkles className="w-3.5 h-3.5" /> Use Template</>
          )}
        </button>
      </div>
    </motion.div>
  );
}

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [creating, setCreating] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeStyle, setActiveStyle] = useState("All");
  const [search, setSearch] = useState("");
  const router = useRouter();
  const { user } = useAuthStore();

  useEffect(() => {
    templatesAPI.getAll()
      .then((res) => {
        const data = res.data.templates ?? [];
        setTemplates(data);
      })
      .catch((err) => {
        console.error("Templates load error:", err);
        setError("Failed to load templates. Is the backend running?");
      })
      .finally(() => setLoading(false));
  }, []);

  const categories = ["All", ...Array.from(new Set(templates.map((t) => t.category))).sort()];

  const filtered = templates.filter((t) => {
    const matchCat = activeCategory === "All" || t.category === activeCategory;
    const matchStyle = activeStyle === "All" || detectStyle(t) === activeStyle;
    const q = search.toLowerCase();
    const matchSearch = !q ||
      t.name.toLowerCase().includes(q) ||
      t.category.toLowerCase().includes(q) ||
      (t.tags ?? []).some((tag) => tag.toLowerCase().includes(q));
    return matchCat && matchStyle && matchSearch;
  });

  const useTemplate = async (templateId: string) => {
    setCreating(templateId);
    try {
      const username = generateUsername(user?.name ?? "user") + "-" + Date.now().toString(36);
      const res = await cardsAPI.create({ username, templateId });
      toast.success("Template applied! Opening builder...");
      router.push(`/dashboard/cards/${res.data.card.id}/edit`);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? "Failed to create card";
      toast.error(msg);
      setCreating(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-primary dark:text-white">Templates</h1>
          <p className="text-gray-500 dark:text-white/50 text-sm mt-1">
            {loading ? "Loading..." : `${templates.length} professionally designed templates`}
          </p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search templates..."
            className="pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-dark-card text-primary dark:text-white placeholder-gray-400 dark:placeholder-white/30 text-sm outline-none focus:ring-2 focus:ring-secondary/30 w-64"
          />
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-2xl p-6 text-center">
          <p className="text-red-600 dark:text-red-400 font-medium">{error}</p>
          <button onClick={() => { setError(null); setLoading(true); templatesAPI.getAll().then((r) => setTemplates(r.data.templates ?? [])).catch(() => setError("Still failing")).finally(() => setLoading(false)); }}
            className="mt-3 text-sm text-secondary hover:underline">
            Try again
          </button>
        </div>
      )}

      {/* Category pills */}
      {!error && (
        <div className="flex flex-wrap gap-2">
          {(loading ? ["All"] : categories).map((cat) => (
            <button key={cat} onClick={() => setActiveCategory(cat)}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm font-medium transition-all ${
                activeCategory === cat
                  ? "bg-secondary text-white shadow-glow-blue"
                  : "bg-white dark:bg-dark-card border border-gray-200 dark:border-white/10 text-gray-500 dark:text-white/50 hover:border-secondary/40 hover:text-secondary"
              }`}>
              <span>{CATEGORY_ICONS[cat] ?? "✦"}</span> {cat}
            </button>
          ))}
        </div>
      )}

      {/* Style filter pills */}
      {!error && !loading && (
        <div className="flex flex-wrap gap-2">
          <button onClick={() => setActiveStyle("All")}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all border ${activeStyle === "All" ? "bg-gray-800 text-white border-gray-800 dark:bg-white/10 dark:border-white/20" : "bg-white dark:bg-dark-card border-gray-200 dark:border-white/10 text-gray-500 dark:text-white/40 hover:border-gray-400"}`}>
            All Styles
          </button>
          {Object.entries(STYLE_LABELS).map(([key, { label, color }]) => (
            <button key={key} onClick={() => setActiveStyle(key)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all border`}
              style={activeStyle === key
                ? { background: color, color: "#fff", borderColor: color }
                : { background: `${color}10`, color: color, borderColor: `${color}40` }}>
              {label}
            </button>
          ))}
        </div>
      )}

      {/* Grid */}
      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-72 rounded-2xl shimmer" />
          ))}
        </div>
      ) : !error && filtered.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-4xl mb-4">🔍</p>
          <p className="text-gray-500 dark:text-white/40 font-medium">No templates found</p>
          <p className="text-gray-400 dark:text-white/30 text-sm mt-1">Try a different category or search term</p>
          <button onClick={() => { setSearch(""); setActiveCategory("All"); setActiveStyle("All"); }}
            className="mt-4 text-secondary text-sm hover:underline">Clear filters</button>
        </div>
      ) : !error ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          <AnimatePresence mode="popLayout">
            {filtered.map((t, i) => (
              <motion.div key={t.id} layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: i * 0.04 }}>
                <TemplateCard
                  template={t}
                  onUse={() => useTemplate(t.id)}
                  isCreating={creating === t.id}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : null}
    </div>
  );
}
