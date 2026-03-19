"use client";

import { Star } from "lucide-react";

interface TestimonialItem { id: string; name: string; role: string; content: string; rating: number; }
interface Props { data: Record<string, unknown>; }

export function PublicTestimonials({ data }: Props) {
  const items = (data.items as TestimonialItem[]) || [];
  if (items.length === 0) return null;

  return (
    <div className="px-5 py-4">
      <p className="text-xs font-semibold uppercase tracking-wider opacity-40 mb-3">Testimonials</p>
      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className="p-4 rounded-xl bg-black/5 dark:bg-white/5">
            <div className="flex gap-0.5 mb-2">
              {Array.from({ length: item.rating }).map((_, i) => (
                <Star key={i} className="w-3 h-3 text-amber-400 fill-amber-400" />
              ))}
            </div>
            <p className="text-sm opacity-70 leading-relaxed mb-3">"{item.content}"</p>
            <div>
              <p className="text-xs font-semibold">{item.name}</p>
              <p className="text-xs opacity-40">{item.role}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
