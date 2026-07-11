"use client";

import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

interface Props { data: Record<string, unknown>; onTrack: (event: string) => void; }

export function PublicCTA({ data, onTrack }: Props) {
  const text = (data.text as string) || "Book Appointment";
  const url = (data.url as string) || "#";
  const style = (data.style as string) || "primary";

  return (
    <div className="px-5 sm:px-8 py-4">
      <motion.a href={url} target="_blank" rel="noopener noreferrer"
        onClick={() => onTrack("cta_click")}
        whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
        className={`flex items-center justify-center gap-2 w-full py-4 rounded-2xl font-bold text-sm transition-all ${
          style === "primary"
            ? "bg-gradient-to-r from-blue-600 to-violet-600 text-white shadow-lg shadow-blue-500/25"
            : style === "outline"
            ? "border-2 border-blue-600 text-blue-600 hover:bg-blue-50"
            : "text-blue-600 hover:bg-blue-50"
        }`}>
        {text}
        <ArrowRight className="w-4 h-4" />
      </motion.a>
    </div>
  );
}
