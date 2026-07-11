"use client";

import { useState } from "react";
import { Phone, Mail, MessageCircle, MapPin } from "lucide-react";
import { useBuilderStore } from "@/lib/store";

interface Props { data: Record<string, unknown>; sectionId?: string; }

export function ContactButtonsPreview({ data, sectionId }: Props) {
  const { layout, updateSection, selectedSectionId } = useBuilderStore();
  const { darkMode } = layout.theme;
  const id = sectionId ?? selectedSectionId ?? "";
  const update = (key: string, v: unknown) => { if (id) updateSection(id, { [key]: v }); };

  const BUTTONS = [
    { icon: Phone,         key: "phone",    label: "Call",     color: "#22C55E" },
    { icon: Mail,          key: "email",    label: "Email",    color: "#2563EB" },
    { icon: MessageCircle, key: "whatsapp", label: "WhatsApp", color: "#25D366" },
    { icon: MapPin,        key: "address",  label: "Location", color: "#EF4444" },
  ];

  const [editing, setEditing] = useState<string | null>(null);

  return (
    <div className="px-5 py-4">
      <div className="grid grid-cols-4 gap-2">
        {BUTTONS.map(({ icon: Icon, key, label, color }) => {
          const value = (data[key] as string) || "";
          const isEditing = editing === key;

          return (
            <div key={key} className="flex flex-col items-center gap-1">
              <div
                className="w-full flex flex-col items-center gap-1.5 py-3 rounded-2xl transition-all cursor-pointer group"
                style={{ background: `${color}12`, border: `1px solid ${color}25` }}
                onClick={() => setEditing(isEditing ? null : key)}
                title={`Click to edit ${label}`}
              >
                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `${color}20` }}>
                  <Icon className="w-4 h-4" style={{ color }} />
                </div>
                <span className="text-xs font-medium" style={{ color: darkMode ? "rgba(248,250,252,0.7)" : "#374151" }}>
                  {label}
                </span>
              </div>
              {/* Inline input below the button when editing */}
              {isEditing && (
                <input
                  autoFocus
                  value={value}
                  placeholder={key === "email" ? "you@email.com" : key === "address" ? "City, State" : "+91 98765..."}
                  onChange={(e) => update(key, e.target.value)}
                  onBlur={() => setEditing(null)}
                  onKeyDown={(e) => { if (e.key === "Enter") setEditing(null); }}
                  className="w-full text-xs rounded-lg px-2 py-1 outline-none border"
                  style={{
                    background: darkMode ? "rgba(255,255,255,0.07)" : "#F8FAFC",
                    border: `1.5px solid ${color}60`,
                    color: darkMode ? "#F8FAFC" : "#0F172A",
                  }}
                  onClick={(e) => e.stopPropagation()}
                />
              )}
              {/* Show current value hint */}
              {!isEditing && value && (
                <span
                  className="text-xs truncate w-full text-center cursor-pointer"
                  style={{ color: color, opacity: 0.8 }}
                  title={value}
                  onClick={() => setEditing(key)}
                >
                  {value.length > 10 ? value.slice(0, 10) + "…" : value}
                </span>
              )}
              {!isEditing && !value && (
                <span
                  className="text-xs truncate w-full text-center cursor-pointer opacity-30"
                  style={{ color: darkMode ? "#F8FAFC" : "#374151" }}
                  onClick={() => setEditing(key)}
                >
                  tap to add
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
