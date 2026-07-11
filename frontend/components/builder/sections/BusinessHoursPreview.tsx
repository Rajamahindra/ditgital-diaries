"use client";

import { useState } from "react";
import { useBuilderStore } from "@/lib/store";

interface Props { data: Record<string, unknown>; sectionId?: string; }

const DAYS = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];

export function BusinessHoursPreview({ data, sectionId }: Props) {
  const { updateSection, selectedSectionId } = useBuilderStore();
  const id = sectionId ?? selectedSectionId ?? "";
  const update = (key: string, v: string) => { if (id) updateSection(id, { [key]: v }); };

  const today = new Date().toLocaleDateString("en-US", { weekday: "long" }).toLowerCase();
  const [editingDay, setEditingDay] = useState<string | null>(null);

  return (
    <div className="px-5 py-4">
      <p className="text-xs text-gray-400 dark:text-white/30 font-medium mb-3 uppercase tracking-wider">
        Business Hours
      </p>
      <div className="space-y-1">
        {DAYS.map((day) => {
          const hours = (data[day] as string) || "";
          const isToday = day === today;
          const isClosed = hours.toLowerCase() === "closed" || hours === "";
          const isEditing = editingDay === day;

          return (
            <div
              key={day}
              className={`flex items-center justify-between py-1.5 px-2.5 rounded-lg text-xs group cursor-pointer transition-colors ${isToday ? "bg-blue-50 dark:bg-blue-500/10" : "hover:bg-gray-50 dark:hover:bg-white/5"}`}
              onClick={() => setEditingDay(isEditing ? null : day)}
              title="Click to edit hours"
            >
              <span className={`capitalize font-medium flex items-center gap-1.5 ${isToday ? "text-blue-600 dark:text-blue-400" : "text-gray-600 dark:text-white/60"}`}>
                {day.slice(0, 3)}
                {isToday && <span className="text-xs bg-blue-600 text-white px-1.5 py-0.5 rounded-full leading-none">Today</span>}
              </span>

              {isEditing ? (
                <input
                  autoFocus
                  value={hours}
                  placeholder="9 AM – 6 PM or Closed"
                  onChange={(e) => update(day, e.target.value)}
                  onBlur={() => setEditingDay(null)}
                  onKeyDown={(e) => { if (e.key === "Enter") setEditingDay(null); }}
                  className="text-xs rounded px-2 py-0.5 outline-none border border-indigo-300 bg-white dark:bg-gray-800 text-gray-700 dark:text-white w-36"
                  onClick={(e) => e.stopPropagation()}
                />
              ) : (
                <span className={`text-xs ${isClosed && !hours ? "text-gray-300 dark:text-white/20 italic" : isClosed ? "text-red-400" : "text-gray-500 dark:text-white/50"} group-hover:text-indigo-400 transition-colors`}>
                  {hours || "click to set"}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
