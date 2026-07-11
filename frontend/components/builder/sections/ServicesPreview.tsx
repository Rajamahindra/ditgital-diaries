"use client";

import { Plus, Trash2 } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { useBuilderStore } from "@/lib/store";
import { InlineText } from "./InlineEditHelpers";

interface ServiceItem { id: string; title: string; description: string; price?: string; }
interface Props { data: Record<string, unknown>; sectionId?: string; }

export function ServicesPreview({ data, sectionId }: Props) {
  const { layout, updateSection, selectedSectionId } = useBuilderStore();
  const { secondaryColor, darkMode } = layout.theme;
  const id = sectionId ?? selectedSectionId ?? "";
  const items: ServiceItem[] = (data.items as ServiceItem[]) || [];
  const updateItems = (next: ServiceItem[]) => { if (id) updateSection(id, { items: next }); };

  const textColor = darkMode ? "#F8FAFC" : "#0F172A";
  const subColor = darkMode ? "rgba(248,250,252,0.5)" : "#374151";
  const bg = darkMode ? "rgba(255,255,255,0.05)" : "#F8FAFC";
  const border = darkMode ? "rgba(255,255,255,0.08)" : "#E2E8F0";

  return (
    <div className="px-5 py-4">
      <p className="text-xs font-medium mb-3 uppercase tracking-wider opacity-40" style={{ color: textColor }}>
        Services
      </p>
      <div className="space-y-2">
        {items.length === 0 ? (
          <div className="text-center py-4 text-sm opacity-30" style={{ color: textColor }}>
            No services yet — click + to add one
          </div>
        ) : (
          items.map((item, i) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-3 rounded-xl group"
              style={{ background: bg, border: `1px solid ${border}` }}
            >
              <div className="flex items-start gap-2.5 flex-1 min-w-0">
                <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ background: secondaryColor }} />
                <div className="flex-1 min-w-0">
                  <InlineText
                    as="p"
                    value={item.title}
                    placeholder="Service name"
                    onChange={(v) => { const u = [...items]; u[i] = { ...item, title: v }; updateItems(u); }}
                    className="text-sm font-semibold"
                    style={{ color: textColor }}
                  />
                  <InlineText
                    as="p"
                    value={item.description}
                    placeholder="Description"
                    onChange={(v) => { const u = [...items]; u[i] = { ...item, description: v }; updateItems(u); }}
                    className="text-xs mt-0.5 opacity-50"
                    style={{ color: subColor }}
                  />
                </div>
              </div>
              <div className="flex items-center gap-2 ml-2 flex-shrink-0">
                <InlineText
                  value={item.price || ""}
                  placeholder="Price"
                  onChange={(v) => { const u = [...items]; u[i] = { ...item, price: v }; updateItems(u); }}
                  className="text-sm font-bold"
                  style={{ color: secondaryColor, minWidth: 40, textAlign: "right" }}
                />
                <button
                  onClick={(e) => { e.stopPropagation(); updateItems(items.filter((_, j) => j !== i)); }}
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:text-red-400"
                  title="Remove"
                >
                  <Trash2 className="w-3.5 h-3.5 text-red-400" />
                </button>
              </div>
            </div>
          ))
        )}
        <button
          onClick={(e) => { e.stopPropagation(); updateItems([...items, { id: uuidv4(), title: "New Service", description: "", price: "" }]); }}
          className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl border-2 border-dashed border-gray-200 dark:border-white/10 text-gray-400 dark:text-white/30 hover:border-indigo-400 hover:text-indigo-400 transition-all text-xs"
        >
          <Plus className="w-3 h-3" /> Add Service
        </button>
      </div>
    </div>
  );
}
