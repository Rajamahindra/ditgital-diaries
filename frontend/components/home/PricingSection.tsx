"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Check } from "lucide-react";
import Link from "next/link";

export function PricingSection({ settings = {} }: { settings?: Record<string, string> }) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.05 });
  const [annual, setAnnual] = useState(false);

  const plans = [
    {
      name: "Free",
      price: settings.plan_free_price || "₹0",
      annualPrice: settings.plan_free_price || "₹0",
      period: "forever",
      desc: "Get started with the basics.",
      features: ["1 digital card", "Public URL", "QR code", "Contact buttons", "Social links", "Basic templates"],
      cta: "Start for free",
      href: "/register",
      highlight: false,
    },
    {
      name: "Pro",
      price: settings.plan_pro_price || "₹499",
      annualPrice: "₹399",
      period: "/ month",
      desc: "For professionals who mean business.",
      features: ["10 cards", "AI card generator", "Advanced analytics", "Lead capture", "Download PNG/PDF/VCF", "Premium templates", "Priority support"],
      cta: "Start Pro — free trial",
      href: "/register?plan=pro",
      highlight: true,
    },
    {
      name: "Business",
      price: settings.plan_business_price || "₹1,499",
      annualPrice: "₹1,199",
      period: "/ month",
      desc: "For teams and growing agencies.",
      features: ["Unlimited cards", "Team profiles", "Lead CRM", "White-label option", "API access", "Admin dashboard", "Dedicated support"],
      cta: "Talk to sales",
      href: "/contact",
      highlight: false,
    },
  ];

  return (
    <section id="pricing" className="bg-white dark:bg-[#0C0A1A] section-padding" ref={ref}>
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55 }}
          className="mb-12"
        >
          <p className="text-violet-600 dark:text-violet-400 text-sm font-semibold tracking-widest uppercase mb-3">
            Pricing
          </p>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
            <h2 className="text-4xl lg:text-5xl font-black text-gray-900 dark:text-white">
              {settings.pricing_title || "Simple, honest pricing."}
            </h2>
            {/* Toggle */}
            <div className="flex items-center gap-2 self-start sm:self-auto">
              <span className={`text-sm font-medium transition-colors ${!annual ? "text-gray-900 dark:text-white" : "text-gray-400 dark:text-white/40"}`}>
                Monthly
              </span>
              <button
                onClick={() => setAnnual(!annual)}
                className={`relative w-11 h-6 rounded-full transition-colors ${annual ? "bg-violet-600" : "bg-gray-200 dark:bg-white/15"}`}
              >
                <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${annual ? "translate-x-5" : "translate-x-0"}`} />
              </button>
              <span className={`text-sm font-medium transition-colors flex items-center gap-1.5 ${annual ? "text-gray-900 dark:text-white" : "text-gray-400 dark:text-white/40"}`}>
                Annual
                <span className="text-[10px] font-bold bg-emerald-500 text-white px-1.5 py-0.5 rounded-full">-20%</span>
              </span>
            </div>
          </div>
          <p className="text-gray-500 dark:text-violet-300/40 text-base mt-3">
            {settings.pricing_subtitle || "Start free. Upgrade when you're ready."}
          </p>
        </motion.div>

        {/* Plans */}
        <div className="grid md:grid-cols-3 gap-4">
          {plans.map(({ name, price, annualPrice, period, desc, features, cta, href, highlight }, i) => (
            <motion.div
              key={name}
              initial={{ opacity: 0, y: 28 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.55, delay: i * 0.1 }}
              className={`relative rounded-2xl p-7 flex flex-col transition-all duration-200 ${
                highlight
                  ? "bg-[#1E1B4B] dark:bg-[#2E1065] border-2 border-violet-500/60 shadow-[0_0_0_1px_rgba(139,92,246,0.2),0_24px_60px_rgba(109,40,217,0.2)]"
                  : "bg-gray-50 dark:bg-white/[0.03] border border-gray-200 dark:border-white/[0.07] hover:border-violet-200 dark:hover:border-violet-700/30"
              }`}
            >
              {highlight && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[11px] font-bold tracking-wider uppercase bg-gradient-to-r from-violet-600 to-indigo-600 text-white px-3.5 py-1 rounded-full">
                  Most popular
                </span>
              )}

              <div className="mb-6">
                <h3 className={`font-bold text-lg mb-1 ${highlight ? "text-white" : "text-gray-900 dark:text-white"}`}>{name}</h3>
                <p className={`text-sm mb-5 ${highlight ? "text-violet-300/60" : "text-gray-500 dark:text-white/40"}`}>{desc}</p>
                <div className="flex items-baseline gap-1">
                  <span className={`text-4xl font-black tracking-tight ${highlight ? "text-white" : "text-gray-900 dark:text-white"}`}>
                    {annual ? annualPrice : price}
                  </span>
                  <span className={`text-sm ${highlight ? "text-violet-300/40" : "text-gray-400 dark:text-white/30"}`}>{period}</span>
                </div>
                {annual && name !== "Free" && (
                  <p className="text-emerald-400 text-xs mt-1 font-medium">Billed annually</p>
                )}
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                {features.map((f) => (
                  <li key={f} className="flex items-center gap-2.5">
                    <Check className={`w-4 h-4 flex-shrink-0 ${highlight ? "text-violet-400" : "text-violet-600 dark:text-violet-400"}`} />
                    <span className={`text-sm ${highlight ? "text-white/70" : "text-gray-600 dark:text-white/55"}`}>{f}</span>
                  </li>
                ))}
              </ul>

              <Link href={href}
                className={`block text-center font-semibold text-[15px] py-3 rounded-xl transition-all duration-200 ${
                  highlight
                    ? "bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-[0_4px_16px_rgba(109,40,217,0.4)]"
                    : "border border-gray-300 dark:border-white/15 text-gray-700 dark:text-white/80 hover:border-violet-300 dark:hover:border-violet-600/50 hover:bg-violet-50 dark:hover:bg-violet-900/20"
                }`}>
                {cta}
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
