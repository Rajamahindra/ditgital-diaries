"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Loader2, ShieldCheck } from "lucide-react";
import { paymentsAPI } from "@/lib/api";
import { useAuthStore } from "@/lib/store";
import toast from "react-hot-toast";

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => { open(): void };
  }
}

const PLANS = [
  {
    id: "free",
    name: "Free",
    price: "₹0",
    amount: 0,
    period: "forever",
    color: "#64748B",
    icon: "🆓",
    features: ["1 digital card", "Basic templates", "Public URL", "QR code"],
  },
  {
    id: "pro",
    name: "Pro",
    price: "₹499",
    amount: 499,
    period: "/month",
    color: "#2563EB",
    icon: "⚡",
    popular: true,
    features: ["10 digital cards", "AI card generator", "Advanced analytics", "Premium templates", "Lead capture", "Download PNG/PDF/VCF"],
  },
  {
    id: "business",
    name: "Business",
    price: "₹1,499",
    amount: 1499,
    period: "/month",
    color: "#7C3AED",
    icon: "👑",
    features: ["Unlimited cards", "Team profiles", "Lead CRM", "White-label", "API access", "Admin panel"],
  },
];

function loadRazorpay(): Promise<boolean> {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export default function BillingPage() {
  const { user, setUser } = useAuthStore();
  const [loading, setLoading] = useState<string | null>(null);

  const handleUpgrade = async (planId: string, amount: number) => {
    if (planId === user?.plan || planId === "free") return;
    setLoading(planId);

    try {
      const loaded = await loadRazorpay();
      if (!loaded) return toast.error("Payment gateway failed to load. Check your connection.");

      const orderRes = await paymentsAPI.createOrder(planId);
      const { orderId, keyId } = orderRes.data;

      const options = {
        key: keyId,
        amount: amount * 100,
        currency: "INR",
        name: "Digital Diaries",
        description: `${planId.charAt(0).toUpperCase() + planId.slice(1)} Plan`,
        order_id: orderId,
        prefill: {
          name: user?.name || "",
          email: user?.email || "",
        },
        theme: { color: "#2563EB" },
        handler: async (response: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) => {
          try {
            await paymentsAPI.verify({ ...response, planId });
            toast.success(`Upgraded to ${planId} plan!`);
            if (user) setUser({ ...user, plan: planId as "free" | "pro" | "business" });
          } catch {
            toast.error("Payment verification failed. Contact support.");
          }
        },
        modal: {
          ondismiss: () => setLoading(null),
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      if (msg === "Payment gateway not configured") {
        toast.error("Payments not yet configured. Please contact support.");
      } else {
        toast.error("Failed to initiate payment. Try again.");
      }
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
        {PLANS.map(({ id, name, price, amount, period, color, icon, features, popular }, i) => {
          const isCurrent = user?.plan === id;
          return (
            <motion.div
              key={id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`relative bg-white dark:bg-dark-card rounded-2xl p-6 border-2 transition-all ${
                popular ? "border-secondary shadow-glow-blue scale-[1.02]" :
                isCurrent ? "border-green-400" : "border-gray-100 dark:border-white/5"
              }`}
            >
              {popular && !isCurrent && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-secondary text-white text-xs font-bold px-3 py-1 rounded-full">
                  Most Popular
                </div>
              )}
              {isCurrent && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full">
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
                onClick={() => handleUpgrade(id, amount)}
                disabled={isCurrent || id === "free" || loading === id}
                className={`w-full py-3 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 ${
                  isCurrent || id === "free"
                    ? "bg-gray-100 dark:bg-white/5 text-gray-400 cursor-default"
                    : "text-white hover:scale-[1.02] active:scale-[0.98]"
                }`}
                style={!(isCurrent || id === "free") ? { background: color } : {}}
              >
                {loading === id ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Processing...</>
                ) : isCurrent ? (
                  "Current Plan"
                ) : id === "free" ? (
                  "Free Forever"
                ) : (
                  `Upgrade — ${price}/mo`
                )}
              </button>
            </motion.div>
          );
        })}
      </div>

      <div className="flex items-center gap-2 text-gray-400 dark:text-white/30 text-xs">
        <ShieldCheck className="w-4 h-4" />
        Payments are secured by Razorpay. Your card details are never stored on our servers.
      </div>
    </div>
  );
}
