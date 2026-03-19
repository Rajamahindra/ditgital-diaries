"use client";

import { useBuilderStore } from "@/lib/store";
import { ArrowRight } from "lucide-react";

interface Props { data: Record<string, unknown> }

export function CTAPreview({ data }: Props) {
  const { layout } = useBuilderStore();
  const { secondaryColor, accentColor } = layout.theme;
  const text = (data.text as string) || "Book Appointment";
  const url = (data.url as string) || "#";
  const style = (data.style as string) || "primary";

  return (
    <div className="px-5 py-4">
      <a
        href={url}
        target={url !== "#" ? "_blank" : undefined}
        rel="noopener noreferrer"
        onClick={(e) => url === "#" && e.preventDefault()}
        className="w-full py-3.5 rounded-2xl font-semibold text-sm transition-all flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98]"
        style={
          style === "primary"
            ? { background: `linear-gradient(135deg, ${secondaryColor}, ${accentColor})`, color: "#FFFFFF" }
            : style === "outline"
            ? { border: `2px solid ${secondaryColor}`, color: secondaryColor, background: "transparent" }
            : { color: secondaryColor, background: "transparent" }
        }
      >
        {text}
        <ArrowRight className="w-4 h-4" />
      </a>
    </div>
  );
}
