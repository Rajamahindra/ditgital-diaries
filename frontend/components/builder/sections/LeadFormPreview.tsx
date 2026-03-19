"use client";

import { useBuilderStore } from "@/lib/store";

interface Props { data: Record<string, unknown> }

export function LeadFormPreview({ data }: Props) {
  const { layout } = useBuilderStore();
  const { secondaryColor, accentColor, darkMode } = layout.theme;
  const title = (data.title as string) || "Get in Touch";
  const submitText = (data.submitText as string) || "Send Message";

  const inputStyle = {
    background: darkMode ? "rgba(255,255,255,0.05)" : "#F8FAFC",
    border: `1px solid ${darkMode ? "rgba(255,255,255,0.1)" : "#E2E8F0"}`,
    color: darkMode ? "rgba(248,250,252,0.4)" : "#94A3B8",
  };

  return (
    <div className="px-5 py-4">
      <p className="font-semibold text-base mb-4" style={{ color: darkMode ? "#F8FAFC" : "#0F172A" }}>{title}</p>
      <div className="space-y-2.5">
        {["Your Name", "Phone Number", "Email Address"].map((placeholder) => (
          <div key={placeholder} className="w-full px-3.5 py-2.5 rounded-xl text-sm" style={inputStyle}>
            {placeholder}
          </div>
        ))}
        <div className="w-full px-3.5 py-2.5 rounded-xl text-sm h-16" style={inputStyle}>
          Your Message
        </div>
        <button
          className="w-full py-3.5 rounded-2xl font-semibold text-sm text-white transition-all hover:opacity-90"
          style={{ background: `linear-gradient(135deg, ${secondaryColor}, ${accentColor})` }}
        >
          {submitText}
        </button>
      </div>
    </div>
  );
}
