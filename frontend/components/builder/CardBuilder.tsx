"use client";

import { useState, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import {
  DndContext, DragEndEvent, DragOverlay, DragStartEvent,
  PointerSensor, useSensor, useSensors, closestCenter,
  DragOverEvent, useDroppable,
} from "@dnd-kit/core";
import {
  SortableContext, verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Save, Eye, Share2, Loader2, Smartphone, Monitor, Zap } from "lucide-react";
import toast from "react-hot-toast";
import { v4 as uuidv4 } from "uuid";
import { useBuilderStore } from "@/lib/store";
import { cardsAPI } from "@/lib/api";
import { BuilderLeftPanel } from "./BuilderLeftPanel";
import { BuilderCanvas } from "./BuilderCanvas";
import { BuilderRightPanel } from "./BuilderRightPanel";
import type { SectionType } from "@/lib/types";

type ViewMode = "desktop" | "mobile";

function getDefaultData(type: SectionType): Record<string, unknown> {
  const uid = () => uuidv4();
  const defaults: Partial<Record<SectionType, Record<string, unknown>>> = {
    profile: { name: "Your Name", profession: "Your Profession", company: "Your Company", bio: "Write your bio here..." },
    contact_buttons: { phone: "", email: "", whatsapp: "", address: "" },
    social_links: { links: [{ platform: "instagram", url: "" }, { platform: "linkedin", url: "" }] },
    services: { items: [{ id: uid(), title: "Service 1", description: "Description", price: "" }] },
    portfolio: { items: [] },
    testimonials: { items: [{ id: uid(), name: "Client Name", role: "Client", content: "Great service!", rating: 5 }] },
    business_hours: { monday: "9 AM – 6 PM", tuesday: "9 AM – 6 PM", wednesday: "9 AM – 6 PM", thursday: "9 AM – 6 PM", friday: "9 AM – 6 PM", saturday: "10 AM – 2 PM", sunday: "Closed" },
    map: { address: "", embedUrl: "" },
    cta: { text: "Book Appointment", url: "", style: "primary" },
    lead_form: { title: "Get in Touch", fields: ["name", "phone", "email", "message"] },
    text: { content: "Add your text here..." },
    image: { url: "", alt: "", caption: "" },
    video: { url: "", title: "" },
    gallery: { images: [] },
    custom_html: { html: "<p>Custom HTML</p>" },
  };
  return defaults[type] || {};
}

export { getDefaultData };

export function CardBuilder() {
  const { activeCard, layout, isDirty, isSaving, setSaving, setDirty, reorderSections, addSection } = useBuilderStore();
  const [viewMode, setViewMode] = useState<ViewMode>("mobile");
  const [activeDragId, setActiveDragId] = useState<string | null>(null);
  const [activeDragType, setActiveDragType] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  const handleSave = useCallback(async () => {
    if (!activeCard || !isDirty) return;
    setSaving(true);
    try {
      await cardsAPI.update(activeCard.id, { layout });
      setDirty(false);
      toast.success("Card saved!");
    } catch {
      toast.error("Failed to save");
    } finally {
      setSaving(false);
    }
  }, [activeCard, isDirty, layout, setSaving, setDirty]);

  const handlePublish = async () => {
    if (!activeCard) return;
    try {
      // Save first if there are unsaved changes
      if (isDirty) {
        setSaving(true);
        try {
          await cardsAPI.update(activeCard.id, { layout });
          setDirty(false);
        } catch (saveErr: unknown) {
          const msg = (saveErr as { response?: { data?: { message?: string } } })?.response?.data?.message || "Failed to save card";
          toast.error(`Save failed: ${msg}`);
          setSaving(false);
          return; // Don't publish if save failed
        } finally {
          setSaving(false);
        }
      }
      const res = await cardsAPI.publish(activeCard.id);
      const isNowPublished = res.data.card.isPublished;
      if (isNowPublished) {
        const url = `${window.location.origin}/card/${activeCard.username}`;
        toast.success(
          <span>
            Card is LIVE! <a href={url} target="_blank" rel="noreferrer" className="underline font-bold">{url}</a>
          </span>,
          { duration: 6000 }
        );
      } else {
        toast.success("Card unpublished");
      }
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || "Failed to publish";
      toast.error(msg);
    }
  };

  const handleDragStart = (event: DragStartEvent) => {
    const id = event.active.id as string;
    setActiveDragId(id);
    // Check if it's a new component from left panel (prefixed with "new:")
    if (id.startsWith("new:")) {
      setActiveDragType(id.replace("new:", ""));
    } else {
      setActiveDragType(null);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveDragId(null);
    setActiveDragType(null);

    if (!over) return;

    const activeId = active.id as string;

    // Dropping a new component from left panel onto canvas
    if (activeId.startsWith("new:")) {
      const type = activeId.replace("new:", "") as SectionType;
      if (over.id === "canvas-drop-zone" || layout.sections.some((s) => s.id === over.id)) {
        addSection({
          id: uuidv4(),
          type,
          position: layout.sections.length,
          visible: true,
          data: getDefaultData(type),
          styles: {},
        });
        toast.success(`${type.replace(/_/g, " ")} added`);
      }
      return;
    }

    // Reordering existing sections
    if (active.id !== over.id) {
      const sections = layout.sections;
      const oldIndex = sections.findIndex((s) => s.id === active.id);
      const newIndex = sections.findIndex((s) => s.id === over.id);
      if (oldIndex !== -1 && newIndex !== -1) {
        reorderSections(oldIndex, newIndex);
      }
    }
  };

  const activeDragSection = activeDragId && !activeDragId.startsWith("new:")
    ? layout.sections.find((s) => s.id === activeDragId)
    : null;

  return (
    <div className="flex flex-col h-[calc(100vh-73px)] -m-6 lg:-m-8">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-white dark:bg-dark-card border-b border-gray-100 dark:border-white/5 flex-shrink-0">
        <div className="flex items-center gap-3">
          <span className="text-primary dark:text-white font-semibold text-sm truncate max-w-48">
            {activeCard?.layout?.meta?.title || activeCard?.username || "Untitled Card"}
          </span>
          {isDirty && (
            <span className="text-xs text-amber-500 bg-amber-50 dark:bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-200 dark:border-amber-500/20">
              Unsaved changes
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center bg-gray-100 dark:bg-primary rounded-lg p-1">
            <button onClick={() => setViewMode("mobile")}
              className={`p-1.5 rounded-md transition-all ${viewMode === "mobile" ? "bg-white dark:bg-dark-card shadow-sm text-secondary" : "text-gray-400"}`}>
              <Smartphone className="w-4 h-4" />
            </button>
            <button onClick={() => setViewMode("desktop")}
              className={`p-1.5 rounded-md transition-all ${viewMode === "desktop" ? "bg-white dark:bg-dark-card shadow-sm text-secondary" : "text-gray-400"}`}>
              <Monitor className="w-4 h-4" />
            </button>
          </div>

          <button onClick={() => window.open(`/card/${activeCard?.username}`, "_blank")}
            className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-white/50 hover:text-primary dark:hover:text-white border border-gray-200 dark:border-white/10 rounded-lg px-3 py-1.5 transition-all">
            <Eye className="w-4 h-4" /> Preview
          </button>

          <button onClick={handleSave} disabled={isSaving || !isDirty}
            className="flex items-center gap-1.5 text-sm border border-secondary text-secondary hover:bg-secondary hover:text-white rounded-lg px-3 py-1.5 transition-all disabled:opacity-40">
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save
          </button>

          <button onClick={handlePublish}
            className="flex items-center gap-1.5 text-sm btn-gradient py-1.5 px-4">
            <Zap className="w-4 h-4" /> Publish
          </button>
        </div>
      </div>

      {/* Builder Body */}
      <div className="flex flex-1 overflow-hidden">
        <DndContext sensors={sensors} collisionDetection={closestCenter}
          onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
          <BuilderLeftPanel />
          <SortableContext items={layout.sections.map((s) => s.id)} strategy={verticalListSortingStrategy}>
            <BuilderCanvas viewMode={viewMode} />
          </SortableContext>
          <BuilderRightPanel />

          <DragOverlay dropAnimation={{ duration: 150, easing: "ease" }}>
            {activeDragType && (
              <div className="bg-secondary text-white rounded-xl px-4 py-2.5 shadow-2xl text-sm font-medium flex items-center gap-2 opacity-90">
                <Zap className="w-4 h-4" />
                Drop to add {activeDragType.replace(/_/g, " ")}
              </div>
            )}
            {activeDragSection && (
              <div className="bg-white dark:bg-dark-card rounded-xl p-4 border-2 border-secondary shadow-2xl opacity-90 w-64">
                <span className="text-primary dark:text-white text-sm font-medium">
                  Moving: {activeDragSection.type.replace(/_/g, " ")}
                </span>
              </div>
            )}
          </DragOverlay>
        </DndContext>
      </div>
    </div>
  );
}
