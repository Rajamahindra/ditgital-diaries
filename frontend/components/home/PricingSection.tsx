"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Check, Zap } from "lucide-react";
import Link from "next/link";

export function PricingSection({ settings = {} }: { settings?: Record<string, string> }) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.05 });

  const plans = [
    {
      name: "Free",
      price: settings.plan_free_price || "₹0",
      period: "forever",
      description: "Perfect to get started",
      color: "#64748B",
      features: ["1 digital card", "Basic templates", "Public URL", "QR code", "Contact buttons", "Social links"],
      cta: "Get Started Free",
      href: "/register",
      popular: false,
    },
    {
      name: "Pro",
      price: settings.plan_pro_price || "₹499",
      period: "per month",
      description: "For serious professionals",
      color: "#2563EB",
      features: ["10 digital cards", "AI card generator", "Advanced analytics", "Premium templates", "Lead capture", "Download PNG/PDF/VCF", "Custom domain", "Priority support"],
      cta: "Start Pro Trial",
      href: "/register?plan=pro",
      popular: true,
    },
    {
      name: "Business",
      price: settings.plan_business_price || "₹1,499",
      period: "per month",
      description: "For teams and agencies",
      color: "#7C3AED",
      features: ["Unlimited cards", "Team profiles", "Lead CRM", "White-label option", "API access", "Admin panel", "Custom branding", "Dedicated support"],
      cta: "Contact Sales",
      href: "/contact",
      popular: false,
    },
  ];

  return (
    <section id="pricing" className="bg-surface dark:bg-dark-surface section-padding" ref={ref}>
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-secondary text-sm font-semibold uppercase tracking-widest">
            Simple Pricing
          </span>
          <h2 className="text-4xl lg:text-5xl font-display font-black text-primary dark:text-white mt-3 mb-4">
            {settings.pricing_title || "Choose your plan"}
          </h2>
          <p className="text-gray-500 dark:text-white/50 text-lg max-w-xl mx-auto">
            {settings.pricing_subtitle || "Start free. Upgrade when you need more power."}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map(({ name, price, period, description, color, features, cta, href, popular }, i) => (
            <motion.div
              key={name}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className={`relative rounded-2xl p-8 border transition-all duration-300 ${
                popular
                  ? "bg-primary dark:bg-dark-card border-secondary shadow-glow-blue scale-105"
                  : "bg-white dark:bg-dark-card border-gray-100 dark:border-white/5 hover:border-secondary/30"
              }`}
            >
              {popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-accent text-white text-xs font-bold px-4 py-1.5 rounded-full flex items-center gap-1">
                  <Zap className="w-3 h-3" />
                  Most Popular
                </div>
              )}

              <div className="mb-6">
                <h3 className={`font-display font-bold text-xl mb-1 ${popular ? "text-white" : "text-primary dark:text-white"}`}>
                  {name}
                </h3>
                <p className={`text-sm mb-4 ${popular ? "text-white/60" : "text-gray-400 dark:text-white/40"}`}>
                  {description}
                </p>
                <div className="flex items-baseline gap-1">
                  <span className={`text-4xl font-black font-display ${popular ? "text-white" : "text-primary dark:text-white"}`}>
                    {price}
                  </span>
                  <span className={`text-sm ${popular ? "text-white/50" : "text-gray-400"}`}>/{period}</span>
                </div>
              </div>

              <ul className="space-y-3 mb-8">
                {features.map((f) => (
                  <li key={f} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: `${color}20` }}>
                      <Check className="w-3 h-3" style={{ color }} />
                    </div>
                    <span className={`text-sm ${popular ? "text-white/80" : "text-gray-600 dark:text-white/60"}`}>{f}</span>
                  </li>
                ))}
              </ul>

              <Link
                href={href}
                className={`block text-center font-semibold py-3 px-6 rounded-xl transition-all duration-200 ${
                  popular
                    ? "bg-gradient-accent text-white hover:opacity-90 shadow-glow-purple"
                    : "border border-gray-200 dark:border-white/10 text-primary dark:text-white hover:border-secondary hover:text-secondary"
                }`}
              >
                {cta}
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
