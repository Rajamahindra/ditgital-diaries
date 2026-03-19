"use client";

import { useBuilderStore } from "@/lib/store";

interface ServiceItem { id: string; title: string; description: string; price?: string }
interface Props { data: Record<string, unknown> }

export function ServicesPreview({ data }: Props) {
  const { layout } = useBuilderStore();
  const { secondaryColor, darkMode } = layout.theme;
  const items = (data.items as ServiceItem[]) || [];

  return (
    <div className="px-5 py-4">
      <p className="text-xs font-medium mb-3 uppercase tracking-wider opacity-40"
        style={{ color: darkMode ? "#F8FAFC" : "#0F172A" }}>
        Services
      </p>
      <div className="space-y-2">
        {items.length === 0 ? (
          <div className="text-center py-4 text-sm opacity-30" style={{ color: darkMode ? "#F8FAFC" : "#0F172A" }}>
            Add your services
          </div>
        ) : (
          items.map((item) => (
            <div key={item.id} className="flex items-center justify-between p-3 rounded-xl transition-all"
              style={{ background: darkMode ? "rgba(255,255,255,0.05)" : "#F8FAFC", border: `1px solid ${darkMode ? "rgba(255,255,255,0.08)" : "#E2E8F0"}` }}>
              <div className="flex items-start gap-2.5">
                <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ background: secondaryColor }} />
                <div>
                  <p className="text-sm font-semibold" style={{ color: darkMode ? "#F8FAFC" : "#0F172A" }}>{item.title}</p>
                  {item.description && (
                    <p className="text-xs mt-0.5 opacity-50" style={{ color: darkMode ? "#F8FAFC" : "#374151" }}>{item.description}</p>
                  )}
                </div>
              </div>
              {item.price && (
                <span className="text-sm font-bold ml-3 flex-shrink-0" style={{ color: secondaryColor }}>{item.price}</span>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
