"use client";

import { Phone, Mail, MessageCircle, MapPin } from "lucide-react";

interface Props {
  data: Record<string, unknown>;
  onTrack: (event: string) => void;
}

export function PublicContactButtons({ data, onTrack }: Props) {
  const buttons = [
    { icon: Phone, label: "Call", color: "#22C55E", href: `tel:${data.phone}`, event: "call_click", show: !!data.phone },
    { icon: Mail, label: "Email", color: "#2563EB", href: `mailto:${data.email}`, event: "email_click", show: !!data.email },
    { icon: MessageCircle, label: "WhatsApp", color: "#25D366", href: `https://wa.me/${(data.whatsapp as string)?.replace(/\D/g, "")}`, event: "whatsapp_click", show: !!data.whatsapp },
    { icon: MapPin, label: "Maps", color: "#EF4444", href: `https://maps.google.com/?q=${encodeURIComponent(data.address as string || "")}`, event: "maps_click", show: !!data.address },
  ].filter((b) => b.show);

  if (buttons.length === 0) return null;

  return (
    <div className="px-5 py-4">
      <div className={`grid gap-3 ${buttons.length <= 2 ? "grid-cols-2" : buttons.length === 3 ? "grid-cols-3" : "grid-cols-4"}`}>
        {buttons.map(({ icon: Icon, label, color, href, event }) => (
          <a
            key={label}
            href={href}
            onClick={() => onTrack(event)}
            className="flex flex-col items-center gap-2 py-3.5 rounded-2xl border transition-all hover:scale-105 active:scale-95"
            style={{ background: `${color}12`, borderColor: `${color}25` }}
          >
            <Icon className="w-5 h-5" style={{ color }} />
            <span className="text-xs font-medium opacity-70">{label}</span>
          </a>
        ))}
      </div>
    </div>
  );
}
