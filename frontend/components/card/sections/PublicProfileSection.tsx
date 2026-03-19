"use client";

import { motion } from "framer-motion";
import { Camera } from "lucide-react";

interface Props {
  data: Record<string, unknown>;
}

export function PublicProfileSection({ data }: Props) {
  const banner = data.banner as string | undefined;

  return (
    <div>
      <div className="h-28 bg-gradient-to-br from-blue-600 to-violet-600 relative overflow-hidden">
        {banner ? (
          <img src={banner} alt="banner" className="absolute inset-0 w-full h-full object-cover" />
        ) : (
          <div className="absolute inset-0 opacity-20"
            style={{ backgroundImage: "radial-gradient(circle at 30% 50%, rgba(255,255,255,0.4) 0%, transparent 60%)" }}
          />
        )}
      </div>
      <div className="px-5 pb-5 -mt-12">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="w-24 h-24 rounded-2xl border-4 border-white shadow-xl bg-gray-100 flex items-center justify-center overflow-hidden mb-3"
        >
          {data.photo ? (
            <img src={data.photo as string} alt={data.name as string} className="w-full h-full object-cover" />
          ) : (
            <Camera className="w-10 h-10 text-gray-300" />
          )}
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <h1 className="font-display font-bold text-2xl leading-tight">{data.name as string}</h1>
          <p className="text-blue-600 font-semibold text-sm mt-0.5">{data.profession as string}</p>
          {data.company ? <p className="text-gray-500 text-xs mt-0.5">{String(data.company)}</p> : null}
          {data.bio ? <p className="text-sm mt-3 leading-relaxed opacity-70">{String(data.bio)}</p> : null}
        </motion.div>
      </div>
    </div>
  );
}