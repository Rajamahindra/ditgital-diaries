"use client";

import { Image as ImageIcon, ExternalLink } from "lucide-react";

interface PortfolioItem {
  id: string;
  title: string;
  description?: string;
  image?: string;
  link?: string;
}

interface Props { data: Record<string, unknown> }

export function PortfolioPreview({ data }: Props) {
  const items = (data.items as PortfolioItem[]) || [];

  return (
    <div className="px-5 py-4">
      <p className="text-xs text-gray-400 dark:text-white/30 font-medium mb-3 uppercase tracking-wider">Portfolio</p>
      {items.length === 0 ? (
        <div className="grid grid-cols-2 gap-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="aspect-square rounded-xl bg-gray-100 dark:bg-white/5 border border-gray-100 dark:border-white/5 flex items-center justify-center">
              <ImageIcon className="w-6 h-6 text-gray-300 dark:text-white/20" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-2">
          {items.map((item) => (
            <div key={item.id} className="relative aspect-square rounded-xl overflow-hidden bg-gray-100 dark:bg-white/5 border border-gray-100 dark:border-white/5 group">
              {item.image ? (
                <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <ImageIcon className="w-6 h-6 text-gray-300 dark:text-white/20" />
                </div>
              )}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
                <p className="text-white text-xs font-medium truncate">{item.title}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
