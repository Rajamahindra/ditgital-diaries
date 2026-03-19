"use client";

import { useState } from "react";
import { useDraggable } from "@dnd-kit/core";
import { motion } from "framer-motion";
import { v4 as uuidv4 } from "uuid";
import {
  User, Phone, Share2, Briefcase, Image, Video,
  MessageSquare, MapPin, MousePointer, FileText,
  Code, Star, Clock, Layout, Sparkles, Loader2, Plus, GripVertical,
} from "lucide-react";
import { useBuilderStore } from "@/lib/store";
import { aiAPI } from "@/lib/api";
import type { SectionType, CardSection } from "@/lib/types";
import toast from "react-hot-toast";
import { getDefaultData } from "./CardBuilder";

const COMPONENTS: { type: SectionType; label: string; icon: React.ElementType; color: string }[] = [
  { type: "profile", label: "Profile Header", icon: User, color: "#2563EB" },
  { type: "contact_buttons", label: "Contact Buttons", icon: Phone, color: "#10B981" },
  { type: "social_links", label: "Social Links", icon: Share2, color: "#EC4899" },
  { type: "services", label: "Services", icon: Briefcase, color: "#7C3AED" },
  { type: "portfolio", label: "Portfolio", icon: Layout, color: "#F59E0B" },
  { type: "testimonials", label: "Testimonials", icon: Star, color: "#EF4444" },
  { type: "business_hours", label: "Business Hours", icon: Clock, color: "#06B6D4" },
  { type: "map", label: "Location Map", icon: MapPin, color: "#84CC16" },
  { type: "cta", label: "CTA Button", icon: MousePointer, color: "#F97316" },
  { type: "lead_form", label: "Lead Form", icon: FileText, color: "#8B5CF6" },
  { type: "text", label: "Text Block", icon: MessageSquare, color: "#64748B" },
  { type: "image", label: "Image", icon: Image, color: "#0EA5E9" },
  { type: "video", label: "Video", icon: Video, color: "#DC2626" },
  { type: "custom_html", label: "Custom HTML", icon: Code, color: "#374151" },
];

function DraggableComponent({ type, label, icon: Icon, color }: typeof COMPONENTS[0]) {
  const { addSection } = useBuilderStore();
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `new:${type}`,
    data: { type: "new-component", sectionType: type },
  });

  const handleClick = () => {
    addSection({
      id: uuidv4(),
      type,
      position: 0,
      visible: true,
      data: getDefaultData(type),
      styles: {},
    });
    toast.success(`${label} added`);
  };

  return (
    <div
      ref={setNodeRef}
      style={{ opacity: isDragging ? 0.4 : 1 }}
      className="flex items-center gap-2.5 w-full px-2.5 py-2 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 transition-all group cursor-pointer select-none"
    >
      {/* Drag handle */}
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing text-gray-300 dark:text-white/20 hover:text-gray-400 flex-shrink-0"
        title="Drag to canvas"
      >
        <GripVertical className="w-3.5 h-3.5" />
      </div>

      {/* Icon */}
      <div
        className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110"
        style={{ background: `${color}18`, border: `1px solid ${color}30` }}
      >
        <Icon className="w-3.5 h-3.5" style={{ color }} />
      </div>

      {/* Label */}
      <span
        onClick={handleClick}
        className="text-gray-600 dark:text-white/60 text-xs group-hover:text-primary dark:group-hover:text-white transition-colors flex-1"
      >
        {label}
      </span>

      {/* Add button */}
      <button
        onClick={handleClick}
        className="opacity-0 group-hover:opacity-100 transition-opacity w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0"
        style={{ background: `${color}20`, color }}
        title="Add to card"
      >
        <Plus className="w-3 h-3" />
      </button>
    </div>
  );
}

export function BuilderLeftPanel() {
  const [tab, setTab] = useState<"components" | "ai">("components");
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const { layout, setLayout } = useBuilderStore();

  const handleAISuggest = async () => {
    if (!aiPrompt.trim()) return;
    setAiLoading(true);
    try {
      const res = await aiAPI.generateContent("section", { prompt: aiPrompt, currentLayout: layout });
      if (res.data.layout) setLayout(res.data.layout);
      toast.success("AI suggestion applied!");
    } catch {
      toast.error("AI suggestion failed");
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <aside className="w-60 bg-white dark:bg-dark-card border-r border-gray-100 dark:border-white/5 flex flex-col overflow-hidden flex-shrink-0">
      {/* Tabs */}
      <div className="flex border-b border-gray-100 dark:border-white/5">
        <button onClick={() => setTab("components")}
          className={`flex-1 py-2.5 text-xs font-semibold transition-colors ${tab === "components" ? "text-secondary border-b-2 border-secondary" : "text-gray-400 dark:text-white/40"}`}>
          Components
        </button>
        <button onClick={() => setTab("ai")}
          className={`flex-1 py-2.5 text-xs font-semibold transition-colors flex items-center justify-center gap-1 ${tab === "ai" ? "text-secondary border-b-2 border-secondary" : "text-gray-400 dark:text-white/40"}`}>
          <Sparkles className="w-3 h-3" /> AI
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {tab === "components" ? (
          <div className="p-2">
            <p className="text-xs text-gray-400 dark:text-white/30 font-medium px-2 py-2 uppercase tracking-wider">
              Click or drag to add
            </p>
            <div className="space-y-0.5">
              {COMPONENTS.map((comp) => (
                <DraggableComponent key={comp.type} {...comp} />
              ))}
            </div>
          </div>
        ) : (
          <div className="p-3 space-y-4">
            <p className="text-xs text-gray-500 dark:text-white/50 leading-relaxed">
              Describe what you want to improve or add.
            </p>
            <textarea
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              placeholder="e.g. Add a WhatsApp button, improve my headline..."
              className="w-full bg-gray-50 dark:bg-primary/50 text-primary dark:text-white placeholder-gray-400 dark:placeholder-white/30 rounded-xl p-3 text-xs outline-none focus:ring-2 focus:ring-secondary/30 resize-none min-h-[90px] border border-gray-100 dark:border-white/5"
            />
            <button onClick={handleAISuggest} disabled={aiLoading || !aiPrompt.trim()}
              className="w-full btn-gradient text-xs py-2.5 flex items-center justify-center gap-2 disabled:opacity-50">
              {aiLoading ? <><Loader2 className="w-3 h-3 animate-spin" /> Thinking...</> : <><Sparkles className="w-3 h-3" /> Apply Suggestion</>}
            </button>
            <div className="space-y-1.5">
              <p className="text-xs text-gray-400 dark:text-white/30 font-medium">Quick prompts</p>
              {["Add WhatsApp button", "Improve headline", "Add portfolio section", "Generate bio"].map((s) => (
                <button key={s} onClick={() => setAiPrompt(s)}
                  className="w-full text-left text-xs text-gray-500 dark:text-white/40 hover:text-secondary border border-gray-100 dark:border-white/5 hover:border-secondary/30 rounded-lg px-3 py-2 transition-all">
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
