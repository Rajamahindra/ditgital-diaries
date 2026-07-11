"use client";

import { Plus, Trash2 } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { useBuilderStore } from "@/lib/store";
import { InlineText, InlineBio } from "./InlineEditHelpers";

interface TestimonialItem { id: string; name: string; role: string; content: string; rating: number; }
interface Props { data: Record<string, unknown>; sectionId?: string; }

export function TestimonialsPreview({ data, sectionId }: Props) {
  const { updateSection, selectedSectionId } = useBuilderStore();
  const id = sectionId ?? selectedSectionId ?? "";
  const items: TestimonialItem[] = (data.items as TestimonialItem[]) || [];
  const updateItems = (next: TestimonialItem[]) => { if (id) updateSection(id, { items: next }); };

  return (
    <div className="px-5 py-4">
      <p className="text-xs text-gray-400 dark:text-white/30 font-medium mb-3 uppercase tracking-wider">
        Testimonials
      </p>
      {items.length === 0 ? (
        <div className="text-center py-4 text-gray-300 dark:text-white/20 text-sm">
          No testimonials yet — click + to add one
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item, i) => (
            <div key={item.id} className="p-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 group relative">
              {/* Star rating — click stars to change */}
              <div className="flex gap-0.5 mb-2">
                {Array.from({ length: 5 }).map((_, s) => (
                  <button
                    key={s}
                    onClick={(e) => { e.stopPropagation(); const u = [...items]; u[i] = { ...item, rating: s + 1 }; updateItems(u); }}
                    className={`text-sm leading-none transition-colors ${s < item.rating ? "text-amber-400 hover:text-amber-500" : "text-gray-200 dark:text-white/10 hover:text-amber-300"}`}
                    title={`${s + 1} star${s > 0 ? "s" : ""}`}
                  >★</button>
                ))}
              </div>

              <InlineBio
                value={item.content}
                placeholder="Write a testimonial..."
                onChange={(v) => { const u = [...items]; u[i] = { ...item, content: v }; updateItems(u); }}
                className="text-gray-600 dark:text-white/60 text-xs leading-relaxed italic"
                style={{ color: "inherit" }}
              />

              <div className="mt-2">
                <InlineText
                  as="p"
                  value={item.name}
                  placeholder="Client name"
                  onChange={(v) => { const u = [...items]; u[i] = { ...item, name: v }; updateItems(u); }}
                  className="text-gray-800 dark:text-white text-xs font-semibold"
                  style={{ color: "inherit" }}
                />
                <InlineText
                  as="p"
                  value={item.role}
                  placeholder="Role / Company"
                  onChange={(v) => { const u = [...items]; u[i] = { ...item, role: v }; updateItems(u); }}
                  className="text-gray-400 dark:text-white/40 text-xs"
                  style={{ color: "inherit" }}
                />
              </div>

              <button
                onClick={(e) => { e.stopPropagation(); updateItems(items.filter((_, j) => j !== i)); }}
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:text-red-400"
                title="Remove"
              >
                <Trash2 className="w-3.5 h-3.5 text-red-400" />
              </button>
            </div>
          ))}
        </div>
      )}
      <button
        onClick={(e) => { e.stopPropagation(); updateItems([...items, { id: uuidv4(), name: "Client Name", role: "Client", content: "Great service!", rating: 5 }]); }}
        className="mt-3 w-full flex items-center justify-center gap-1.5 py-2 rounded-xl border-2 border-dashed border-gray-200 dark:border-white/10 text-gray-400 dark:text-white/30 hover:border-indigo-400 hover:text-indigo-400 transition-all text-xs"
      >
        <Plus className="w-3 h-3" /> Add Testimonial
      </button>
    </div>
  );
}
