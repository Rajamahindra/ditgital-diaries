"use client";

import { useSortable } from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { motion } from "framer-motion";
import { GripVertical, Trash2, Eye, EyeOff, Copy, Plus } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { useBuilderStore } from "@/lib/store";
import { SECTION_LABELS, cn } from "@/lib/utils";
import type { CardSection } from "@/lib/types";

import { ProfileSectionPreview } from "./sections/ProfileSectionPreview";
import { ContactButtonsPreview } from "./sections/ContactButtonsPreview";
import { SocialLinksPreview } from "./sections/SocialLinksPreview";
import { ServicesPreview } from "./sections/ServicesPreview";
import { LeadFormPreview } from "./sections/LeadFormPreview";
import { CTAPreview } from "./sections/CTAPreview";
import { MapPreview } from "./sections/MapPreview";
import { TextPreview } from "./sections/TextPreview";
import { TestimonialsPreview } from "./sections/TestimonialsPreview";
import { BusinessHoursPreview } from "./sections/BusinessHoursPreview";
import { PortfolioPreview } from "./sections/PortfolioPreview";
import { InlineImageUpload } from "./sections/InlineEditHelpers";
import { useState } from "react";

function InlineEditableCaption({ sectionId, value }: { sectionId: string; value: string }) {
  const { updateSection } = useBuilderStore();
  const [editing, setEditing] = useState(false);
  if (!value && !editing) return (
    <p
      className="text-xs text-center mt-1 text-gray-300 dark:text-white/20 cursor-text hover:text-indigo-400 transition-colors italic"
      onClick={() => setEditing(true)}
    >click to add caption</p>
  );
  if (editing) return (
    <input autoFocus value={value} placeholder="Caption…"
      onChange={(e) => updateSection(sectionId, { caption: e.target.value })}
      onBlur={() => setEditing(false)}
      onKeyDown={(e) => { if (e.key === "Enter") setEditing(false); }}
      className="w-full text-xs text-center mt-1 outline-none bg-transparent border-b border-indigo-300 text-gray-500 dark:text-white/50" />
  );
  return (
    <p className="text-xs opacity-50 mt-1 text-center cursor-text hover:opacity-80 transition-opacity"
      onClick={() => setEditing(true)}>{value}</p>
  );
}

function InlineEditableVideoUrl({ sectionId, value, title }: { sectionId: string; value: string; title: string }) {
  const { updateSection } = useBuilderStore();
  const [editingUrl, setEditingUrl] = useState(false);
  const [editingTitle, setEditingTitle] = useState(false);
  return (
    <div className="space-y-2">
      <div className="w-full h-24 rounded-xl bg-gray-900 flex items-center justify-center text-white/40 text-xs gap-2 cursor-pointer hover:bg-gray-800 transition-colors"
        onClick={() => setEditingTitle(true)}>
        <span>▶</span>
        {editingTitle
          ? <input autoFocus value={title} placeholder="Video title"
              onChange={(e) => updateSection(sectionId, { title: e.target.value })}
              onBlur={() => setEditingTitle(false)}
              onKeyDown={(e) => { if (e.key === "Enter") setEditingTitle(false); }}
              className="bg-transparent outline-none border-b border-white/30 text-white/60 text-xs w-32"
              onClick={(e) => e.stopPropagation()} />
          : <span>{title || "Click to set title"}</span>
        }
      </div>
      {editingUrl
        ? <input autoFocus value={value} placeholder="https://youtube.com/..."
            onChange={(e) => updateSection(sectionId, { url: e.target.value })}
            onBlur={() => setEditingUrl(false)}
            onKeyDown={(e) => { if (e.key === "Enter") setEditingUrl(false); }}
            className="w-full text-xs rounded-lg px-2 py-1.5 outline-none border border-indigo-300 bg-gray-50 dark:bg-white/5 text-gray-700 dark:text-white" />
        : <span onClick={() => setEditingUrl(true)}
            className="block text-xs cursor-text text-gray-400 dark:text-white/30 truncate px-2 py-1 rounded hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-colors">
            {value || <span className="italic opacity-40">click to add video URL…</span>}
          </span>
      }
    </div>
  );
}

function CanvasImageSection({ section }: { section: CardSection }) {
  const { updateSection } = useBuilderStore();
  return (
    <div className="px-4 py-3">
      <InlineImageUpload
        value={(section.data.url as string) || ""}
        onChange={(url) => updateSection(section.id, { url })}
        aspectClass="w-full h-40"
      />
      <InlineEditableCaption sectionId={section.id} value={(section.data.caption as string) || ""} />
    </div>
  );
}

function CanvasGallerySection({ section }: { section: CardSection }) {
  const { updateSection } = useBuilderStore();
  const images: { id: string; url: string }[] = (section.data.images as { id: string; url: string }[]) || [];
  const visible = images.filter(i => i.url);
  return (
    <div className="px-4 py-3">
      {visible.length === 0
        ? <div className="w-full h-16 rounded-xl bg-gray-100 dark:bg-white/5 flex items-center justify-center text-gray-300 dark:text-white/20 text-xs cursor-pointer hover:border-indigo-400 border-2 border-dashed border-gray-200 dark:border-white/10 transition-colors"
            onClick={() => updateSection(section.id, { images: [...images, { id: crypto.randomUUID(), url: "" }] })}>
            Click to add photos
          </div>
        : <div className="grid grid-cols-3 gap-1.5">
            {visible.slice(0, 6).map(img => (
              <img key={img.id} src={img.url} alt="" className="w-full h-16 object-cover rounded-lg" />
            ))}
          </div>
      }
    </div>
  );
}

function SectionRenderer({ section }: { section: CardSection }) {
  switch (section.type) {
    case "profile": return <ProfileSectionPreview data={section.data} sectionId={section.id} />;
    case "contact_buttons": return <ContactButtonsPreview data={section.data} sectionId={section.id} />;
    case "social_links": return <SocialLinksPreview data={section.data} sectionId={section.id} />;
    case "services": return <ServicesPreview data={section.data} sectionId={section.id} />;
    case "lead_form": return <LeadFormPreview data={section.data} sectionId={section.id} />;
    case "cta": return <CTAPreview data={section.data} sectionId={section.id} />;
    case "map": return <MapPreview data={section.data} sectionId={section.id} />;
    case "text": return <TextPreview data={section.data} sectionId={section.id} />;
    case "testimonials": return <TestimonialsPreview data={section.data} sectionId={section.id} />;
    case "business_hours": return <BusinessHoursPreview data={section.data} sectionId={section.id} />;
    case "portfolio": return <PortfolioPreview data={section.data} sectionId={section.id} />;
    case "image":
      return <CanvasImageSection section={section} />;
    case "video":
      return (
        <div className="px-4 py-3">
          <InlineEditableVideoUrl sectionId={section.id} value={(section.data.url as string) || ""} title={(section.data.title as string) || ""} />
        </div>
      );
    case "gallery":
      return <CanvasGallerySection section={section} />;
    default:
      return (
        <div className="px-4 py-6 text-center text-gray-400 dark:text-white/30 text-sm">
          {SECTION_LABELS[section.type] || section.type}
        </div>
      );
  }
}

function SortableSection({ section }: { section: CardSection }) {
  const { selectedSectionId, selectSection, removeSection, updateSection, addSection } = useBuilderStore();
  const isSelected = selectedSectionId === section.id;

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: section.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={() => selectSection(section.id)}
      className={cn(
        "relative group rounded-xl border-2 transition-all duration-150 cursor-pointer",
        isSelected ? "border-secondary shadow-[0_0_0_3px_rgba(37,99,235,0.15)]" : "border-transparent hover:border-gray-200 dark:hover:border-white/10"
      )}
    >
      {/* Drag handle */}
      <div
        {...attributes}
        {...listeners}
        className="absolute left-1 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing p-1 z-10"
        onClick={(e) => e.stopPropagation()}
      >
        <GripVertical className="w-3.5 h-3.5 text-gray-400" />
      </div>

      {/* Section label */}
      {isSelected && (
        <div className="absolute -top-px left-3 -translate-y-full pb-1 z-20">
          <span className="bg-secondary text-white text-xs font-medium px-2 py-0.5 rounded-t-md">
            {SECTION_LABELS[section.type] || section.type}
          </span>
        </div>
      )}

      {/* Actions toolbar */}
      {isSelected && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute -top-8 right-1 flex items-center gap-0.5 bg-white dark:bg-dark-card rounded-lg border border-gray-100 dark:border-white/10 shadow-lg px-1 py-1 z-20"
        >
          <button
            onClick={(e) => { e.stopPropagation(); updateSection(section.id, { __visible: !section.visible }); }}
            className="p-1.5 hover:bg-gray-50 dark:hover:bg-white/5 rounded-md text-gray-400 hover:text-primary dark:hover:text-white transition-colors"
            title={section.visible ? "Hide" : "Show"}
          >
            {section.visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); addSection({ ...section, id: uuidv4() }); }}
            className="p-1.5 hover:bg-gray-50 dark:hover:bg-white/5 rounded-md text-gray-400 hover:text-primary dark:hover:text-white transition-colors"
            title="Duplicate"
          >
            <Copy className="w-3.5 h-3.5" />
          </button>
          <div className="w-px h-4 bg-gray-100 dark:bg-white/10 mx-0.5" />
          <button
            onClick={(e) => { e.stopPropagation(); removeSection(section.id); }}
            className="p-1.5 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-md text-gray-400 hover:text-red-500 transition-colors"
            title="Delete"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </motion.div>
      )}

      {/* Content */}
      <div className={cn(!section.visible && "opacity-30 pointer-events-none")}>
        <SectionRenderer section={section} />
      </div>
    </div>
  );
}

function CanvasDropZone({ sections }: { sections: CardSection[] }) {
  const { isOver, setNodeRef } = useDroppable({ id: "canvas-drop-zone" });
  const { selectSection, addSection } = useBuilderStore();

  if (sections.length === 0) {
    return (
      <div
        ref={setNodeRef}
        onClick={() => selectSection(null)}
        className={cn(
          "flex flex-col items-center justify-center min-h-[400px] p-8 text-center rounded-2xl border-2 border-dashed transition-all duration-200",
          isOver
            ? "border-secondary bg-secondary/5 scale-[1.01]"
            : "border-gray-200 dark:border-white/10"
        )}
      >
        <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-all", isOver ? "bg-secondary/20" : "bg-gray-100 dark:bg-white/5")}>
          <Plus className={cn("w-7 h-7 transition-colors", isOver ? "text-secondary" : "text-gray-300 dark:text-white/20")} />
        </div>
        <p className={cn("text-sm font-medium transition-colors", isOver ? "text-secondary" : "text-gray-400 dark:text-white/30")}>
          {isOver ? "Drop here to add" : "Drag components here"}
        </p>
        <p className="text-gray-300 dark:text-white/20 text-xs mt-1">
          or click components in the left panel
        </p>
      </div>
    );
  }

  return (
    <div ref={setNodeRef} className="p-3 space-y-1.5">
      {sections.map((section) => (
        <SortableSection key={section.id} section={section} />
      ))}
      {/* Drop indicator at bottom */}
      {isOver && (
        <div className="h-1.5 rounded-full bg-secondary/40 mx-2 animate-pulse" />
      )}
    </div>
  );
}

export function BuilderCanvas({ viewMode }: { viewMode: "desktop" | "mobile" }) {
  const { layout } = useBuilderStore();
  const sorted = [...layout.sections].sort((a, b) => a.position - b.position);

  const theme = layout.theme as typeof layout.theme & Record<string, unknown>;

  // Build card background
  let cardBackground = theme.backgroundColor;
  if (theme.backgroundStyle === "gradient" && theme.backgroundGradient) {
    cardBackground = theme.backgroundGradient as string;
  }

  // Pattern overlay CSS
  const patternMap: Record<string, { image: string; size: string }> = {
    dots: { image: `radial-gradient(circle, ${theme.secondaryColor}30 1px, transparent 1px)`, size: "20px 20px" },
    grid: { image: `linear-gradient(${theme.secondaryColor}15 1px, transparent 1px), linear-gradient(90deg, ${theme.secondaryColor}15 1px, transparent 1px)`, size: "24px 24px" },
    diagonal: { image: `repeating-linear-gradient(45deg, ${theme.secondaryColor}10 0, ${theme.secondaryColor}10 1px, transparent 0, transparent 50%)`, size: "10px 10px" },
    hexagon: { image: `radial-gradient(circle at 50% 50%, ${theme.secondaryColor}25 2px, transparent 2px)`, size: "24px 24px" },
    circuit: { image: `linear-gradient(${theme.secondaryColor}20 1px, transparent 1px), linear-gradient(90deg, ${theme.secondaryColor}20 1px, transparent 1px)`, size: "20px 20px" },
    topography: { image: `radial-gradient(ellipse at 20% 50%, ${theme.secondaryColor}15 0%, transparent 50%), radial-gradient(ellipse at 80% 20%, ${theme.accentColor}10 0%, transparent 50%)`, size: "100% 100%" },
    waves: { image: `repeating-linear-gradient(0deg, transparent, transparent 10px, ${theme.secondaryColor}10 10px, ${theme.secondaryColor}10 11px)`, size: "100% 100%" },
    noise: { image: "", size: "" },
  };

  const patternInfo = theme.backgroundPattern ? patternMap[theme.backgroundPattern as string] : null;

  const cardStyle: React.CSSProperties = {
    background: cardBackground,
    fontFamily: theme.fontFamily,
    color: theme.textColor,
    position: "relative",
  };

  return (
    <main className="flex-1 overflow-auto bg-gray-50 dark:bg-primary/30 flex items-start justify-center p-6">
      <div className={cn("transition-all duration-300", viewMode === "mobile" ? "w-[390px]" : "w-full max-w-2xl")}>
        {viewMode === "mobile" ? (
          <div className="relative">
            {/* Phone shell */}
            <div className="absolute -inset-5 bg-gray-800 rounded-[3.5rem] shadow-2xl" />
            <div className="absolute -inset-4 bg-gray-900 rounded-[3rem]" />
            {/* Notch */}
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 w-24 h-5 bg-gray-900 rounded-full z-10" />
            <div className="relative bg-white rounded-[2.5rem] overflow-hidden min-h-[680px] shadow-inner" style={cardStyle}>
              {patternInfo && patternInfo.image && (
                <div className="absolute inset-0 pointer-events-none z-0" style={{ backgroundImage: patternInfo.image, backgroundSize: patternInfo.size }} />
              )}
              <div className="relative z-10">
                <CanvasDropZone sections={sorted} />
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl shadow-xl overflow-hidden min-h-[600px] border border-gray-100 relative" style={cardStyle}>
            {patternInfo && patternInfo.image && (
              <div className="absolute inset-0 pointer-events-none z-0" style={{ backgroundImage: patternInfo.image, backgroundSize: patternInfo.size }} />
            )}
            <div className="relative z-10">
              <CanvasDropZone sections={sorted} />
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
