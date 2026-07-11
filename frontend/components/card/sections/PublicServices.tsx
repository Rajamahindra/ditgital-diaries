"use client";

import { motion } from "framer-motion";

interface ServiceItem { id: string; title: string; description: string; price?: string; }
interface Props { data: Record<string, unknown>; }

const SERVICE_ICONS = ["💊", "🏥", "🩺", "💉", "🧬", "🔬", "🏋️", "🧘", "🌿", "💆", "🎯", "⚡", "🌟", "🔑", "📊", "💡", "🎨", "📸", "⚖️", "🏠", "🍽️", "✈️", "🎵", "💻", "🏗️"];

export function PublicServices({ data }: Props) {
  const items = (data.items as ServiceItem[]) || [];
  if (items.length === 0) return null;

  return (
    <div className="px-5 sm:px-8 py-5">
      <p className="text-xs font-bold uppercase tracking-widest opacity-40 mb-4">Our Services</p>
      <div className="space-y-3">
        {items.map((item, idx) => (
          <motion.div key={item.id}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.06 }}
            className="flex items-start gap-3 p-4 rounded-2xl bg-black/[0.04] dark:bg-white/[0.05] hover:bg-black/[0.07] dark:hover:bg-white/[0.08] transition-colors">
            <div className="w-10 h-10 rounded-xl bg-black/[0.06] dark:bg-white/[0.08] flex items-center justify-center flex-shrink-0 text-lg">
              {SERVICE_ICONS[idx % SERVICE_ICONS.length]}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm">{item.title}</p>
              {item.description && (
                <p className="text-xs mt-0.5 opacity-60 leading-relaxed">{item.description}</p>
              )}
            </div>
            {item.price && (
              <span className="text-sm font-bold flex-shrink-0 text-blue-600 dark:text-blue-400">{item.price}</span>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
