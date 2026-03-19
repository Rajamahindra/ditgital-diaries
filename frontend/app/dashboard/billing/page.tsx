"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Check, Zap, Crown } from "lucide-react";
import { subscriptionsAPI } from "@/lib/api";
import { useAuthStore } from "@/lib/store";
import toast from "react-hot-toast";

const PLANS = [
  {
    id: "free",
    name: "Free",
    price: "₹0",
    period: "forever",
    color: "#64748B",
    icon: "🆓",
    features: ["1 digital card", "Basic templates", "Public URL", "QR code"],
  },
  {
    id: "pro",
    name: "Pro",
    price: "₹499",
    period: "/month",
    color: "#2563EB",
    icon: "⚡",
    features: ["10 digital cards", "AI card generator", "Advanced analytics", "Premium templates", "Lead capture", "Download PNG/PDF/VCF"],
  },
  {
    id: "business",
    name: "Business",
    price: "₹1,499",
    period: "/month",
    color: "#7C3AED",
    icon: "👑",
    features: ["Unlimited cards", "Team profiles", "Lead CRM", "White-label", "API access", "Admin panel"],
  },
];

export default function BillingPage() {
  const { user, setUser } = useAuthStore();
  const [loading, setLoading] = useState<string | null>(null);

  const handleUpgrade = async (planId: string) => {
    if (planId === user?.plan) return;
    setLoading(planId);
    try {
      await subscriptionsAPI.subscribe(planId);
      toast.success(`Upgraded to ${planId} plan!`);
      if (user) setUser({ ...user, plan: planId as "free" | "pro" | "business" });
    } catch {
      toast.error("Upgrade failed. Please try again.");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-2xl font-display font-bold text-primary dark:text-white">Billing & Plans</h1>
        <p className="text-gray-500 dark:text-white/50 text-sm mt-1">
          Current plan: <span className="text-secondary font-semibold capitalize">{user?.plan}</span>
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {PLANS.map(({ id, name, price, period, color, icon, features }, i) => {
          const isCurrent = user?.plan === id;
          return (
            <motion.div
              key={id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`relative bg-white dark:bg-dark-card rounded-2xl p-6 border-2 transition-all ${
                isCurrent ? "border-secondary shadow-glow-blue" : "border-gray-100 dark:border-white/5"
              }`}
            >
              {isCurrent && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-secondary text-white text-xs font-bold px-3 py-1 rounded-full">
                  Current Plan
                </div>
              )}

              <div className="text-3xl mb-3">{icon}</div>
              <h3 className="text-primary dark:text-white font-display font-bold text-xl mb-1">{name}</h3>
              <div className="flex items-baseline gap-1 mb-5">
                <span className="text-3xl font-black text-primary dark:text-white">{price}</span>
                <span className="text-gray-400 text-sm">{period}</span>
              </div>

              <ul className="space-y-2 mb-6">
                {features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-gray-600 dark:text-white/60">
                    <Check className="w-4 h-4 flex-shrink-0" style={{ color }} />
                    {f}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleUpgrade(id)}
                disabled={isCurrent || loading === id}
                className={`w-full py-3 rounded-xl font-semibold text-sm transition-all ${
                  isCurrent
                    ? "bg-gray-100 dark:bg-white/5 text-gray-400 cursor-default"
                    : "border-2 hover:scale-[1.02] active:scale-[0.98]"
                }`}
                style={!isCurrent ? { borderColor: color, color } : {}}
              >
                {loading === id ? "Processing..." : isCurrent ? "Current Plan" : `Upgrade to ${name}`}
              </button>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
