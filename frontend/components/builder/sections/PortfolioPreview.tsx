"use client";

import { Plus, Trash2, ImageIcon } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { useBuilderStore } from "@/lib/store";
import { InlineText, InlineImageUpload } from "./InlineEditHelpers";

interface PortfolioItem { id: string; title: string; description?: string; image?: string; link?: string; }
interface Props { data: Record<string, unknown>; sectionId?: string; }

export function PortfolioPreview({ data, sectionId }: Props) {
  const { updateSection, selectedSectionId } = useBuilderStore();
  const id = sectionId ?? selectedSectionId ?? "";
  const items: PortfolioItem[] = (data.items as PortfolioItem[]) || [];
  const updateItems = (next: PortfolioItem[]) => { if (id) updateSection(id, { items: next }); };

  return (
    <div className="px-5 py-4">
      <p className="text-xs text-gray-400 dark:text-white/30 font-medium mb-3 uppercase tracking-wider">
        Portfolio
      </p>
      <div className="grid grid-cols-2 gap-2">
        {items.length === 0 ? (
          /* placeholder tiles */
          [1, 2, 3, 4].map((i) => (
            <div key={i} className="aspect-square rounded-xl bg-gray-100 dark:bg-white/5 border border-gray-100 dark:border-white/5 flex items-center justify-center">
              <ImageIcon className="w-6 h-6 text-gray-300 dark:text-white/20" />
            </div>
          ))
        ) : (
          items.map((item, i) => (
            <div key={item.id} className="rounded-xl overflow-hidden bg-gray-100 dark:bg-white/5 border border-gray-100 dark:border-white/5 group relative flex flex-col">
              {/* Image upload */}
              <div className="aspect-square">
                <InlineImageUpload
                  value={item.image || ""}
                  onChange={(url) => { const u = [...items]; u[i] = { ...item, image: url }; updateItems(u); }}
                  aspectClass="w-full h-full"
                />
              </div>
              {/* Title */}
              <div className="p-2">
                <InlineText
                  as="p"
                  value={item.title}
                  placeholder="Project title"
                  onChange={(v) => { const u = [...items]; u[i] = { ...item, title: v }; updateItems(u); }}
                  className="text-xs font-semibold text-gray-800 dark:text-white truncate"
                  style={{ color: "inherit" }}
                />
                <InlineText
                  as="p"
                  value={item.description || ""}
                  placeholder="Description"
                  onChange={(v) => { const u = [...items]; u[i] = { ...item, description: v }; updateItems(u); }}
                  className="text-xs text-gray-400 dark:text-white/40 mt-0.5 truncate"
                  style={{ color: "inherit" }}
                />
              </div>
              {/* Delete */}
              <button
                onClick={(e) => { e.stopPropagation(); updateItems(items.filter((_, j) => j !== i)); }}
                className="absolute top-1.5 right-1.5 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                title="Remove"
              >
                <Trash2 className="w-3 h-3 text-white" />
              </button>
            </div>
          ))
        )}

        {/* Add new item tile */}
        <button
          onClick={(e) => { e.stopPropagation(); updateItems([...items, { id: uuidv4(), title: "New Project", description: "", image: "", link: "" }]); }}
          className="aspect-square rounded-xl border-2 border-dashed border-gray-200 dark:border-white/10 flex flex-col items-center justify-center gap-1 text-gray-400 dark:text-white/30 hover:border-indigo-400 hover:text-indigo-400 transition-all"
          title="Add portfolio item"
        >
          <Plus className="w-5 h-5" />
          <span className="text-xs">Add</span>
        </button>
      </div>
    </div>
  );
}
