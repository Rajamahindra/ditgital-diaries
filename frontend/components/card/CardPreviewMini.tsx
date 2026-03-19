"use client";

import { motion } from "framer-motion";
import { Phone, Mail, Globe, Instagram, Linkedin, Youtube } from "lucide-react";

export function CardPreviewMini() {
  return (
    <div
      className="w-72 rounded-3xl overflow-hidden shadow-2xl border border-white/10"
      style={{ background: "linear-gradient(135deg, #1E293B 0%, #0F172A 100%)" }}
    >
      {/* Header gradient */}
      <div className="h-24 bg-gradient-accent relative">
        <div className="absolute inset-0 opacity-30"
          style={{ backgroundImage: "radial-gradient(circle at 30% 50%, rgba(255,255,255,0.2) 0%, transparent 60%)" }}
        />
      </div>

      {/* Avatar */}
      <div className="px-6 -mt-10 pb-4">
        <div className="w-20 h-20 rounded-2xl border-4 border-dark-card bg-gradient-accent flex items-center justify-center text-3xl shadow-xl mb-3">
          👨‍⚕️
        </div>

        <h3 className="text-white font-display font-bold text-xl">Dr. Arjun Sharma</h3>
        <p className="text-secondary text-sm font-medium">Cardiologist</p>
        <p className="text-white/50 text-xs mt-0.5">Apollo Hospitals, Hyderabad</p>

        <p className="text-white/60 text-xs mt-3 leading-relaxed">
          15+ years of experience in interventional cardiology. Committed to heart health.
        </p>

        {/* Contact buttons */}
        <div className="grid grid-cols-3 gap-2 mt-4">
          {[
            { icon: Phone, label: "Call", color: "#22C55E" },
            { icon: Mail, label: "Email", color: "#2563EB" },
            { icon: Globe, label: "Web", color: "#7C3AED" },
          ].map(({ icon: Icon, label, color }) => (
            <motion.button
              key={label}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex flex-col items-center gap-1 py-2 rounded-xl border border-white/10 hover:border-white/20 transition-all"
              style={{ background: `${color}15` }}
            >
              <Icon className="w-4 h-4" style={{ color }} />
              <span className="text-white/60 text-xs">{label}</span>
            </motion.button>
          ))}
        </div>

        {/* Social icons */}
        <div className="flex gap-3 mt-4">
          {[
            { icon: Instagram, color: "#E1306C" },
            { icon: Linkedin, color: "#0A66C2" },
            { icon: Youtube, color: "#FF0000" },
          ].map(({ icon: Icon, color }, i) => (
            <motion.button
              key={i}
              whileHover={{ scale: 1.2 }}
              className="w-8 h-8 rounded-lg flex items-center justify-center border border-white/10"
              style={{ background: `${color}20` }}
            >
              <Icon className="w-4 h-4" style={{ color }} />
            </motion.button>
          ))}
        </div>

        {/* Services */}
        <div className="mt-4 space-y-2">
          {["Cardiac Consultation", "ECG & Echo", "Heart Surgery"].map((s) => (
            <div key={s} className="flex items-center gap-2 text-xs text-white/60">
              <div className="w-1.5 h-1.5 rounded-full bg-secondary" />
              {s}
            </div>
          ))}
        </div>

        {/* Save contact */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full mt-4 py-2.5 rounded-xl bg-gradient-accent text-white text-sm font-semibold"
        >
          Save Contact
        </motion.button>
      </div>
    </div>
  );
}
