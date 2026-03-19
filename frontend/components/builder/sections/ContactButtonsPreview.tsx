"use client";

import { Phone, Mail, MessageCircle, MapPin } from "lucide-react";
import { useBuilderStore } from "@/lib/store";

interface Props { data: Record<string, unknown> }

export function ContactButtonsPreview({ data }: Props) {
  const { layout } = useBuilderStore();
  const { secondaryColor, darkMode } = layout.theme;

  const allButtons = [
    { icon: Phone, label: "Call", value: data.phone as string, color: "#22C55E", href: `tel:${data.phone}` },
    { icon: Mail, label: "Email", value: data.email as string, color: "#2563EB", href: `mailto:${data.email}` },
    { icon: MessageCircle, label: "WhatsApp", value: data.whatsapp as string, color: "#25D366", href: `https://wa.me/${(data.whatsapp as string || "").replace(/\D/g, "")}` },
    { icon: MapPin, label: "Maps", value: data.address as string, color: "#EF4444", href: `https://maps.google.com/?q=${encodeURIComponent(data.address as string || "")}` },
  ];

  const buttons = allButtons.filter((b) => b.value);
  const displayButtons = buttons.length > 0 ? buttons : allButtons.slice(0, 3);

  return (
    <div className="px-5 py-4">
      <div className={`grid gap-2.5 ${displayButtons.length <= 2 ? "grid-cols-2" : displayButtons.length === 3 ? "grid-cols-3" : "grid-cols-4"}`}>
        {displayButtons.map(({ icon: Icon, label, color, href, value }) => (
          <a
            key={label}
            href={value ? href : undefined}
            target={value ? "_blank" : undefined}
            rel="noopener noreferrer"
            className="flex flex-col items-center gap-1.5 py-3.5 rounded-2xl transition-all hover:scale-105 active:scale-95"
            style={{ background: `${color}12`, border: `1px solid ${color}25` }}
            onClick={(e) => !value && e.preventDefault()}
          >
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `${color}20` }}>
              <Icon className="w-4.5 h-4.5" style={{ color }} />
            </div>
            <span className="text-xs font-medium" style={{ color: darkMode ? "rgba(248,250,252,0.7)" : "#374151" }}>{label}</span>
          </a>
        ))}
      </div>
    </div>
  );
}
