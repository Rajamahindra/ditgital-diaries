"use client";

import { useEffect, useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { HeroSection } from "@/components/home/HeroSection";
import { HowItWorks } from "@/components/home/HowItWorks";
import { FeaturesSection } from "@/components/home/FeaturesSection";
import { TemplatesShowcase } from "@/components/home/TemplatesShowcase";
import { AIDemo } from "@/components/home/AIDemo";
import { DiscoverSection } from "@/components/home/DiscoverSection";
import { PricingSection } from "@/components/home/PricingSection";
import { SocialProof } from "@/components/home/SocialProof";
import { FinalCTA } from "@/components/home/FinalCTA";
import { Footer } from "@/components/layout/Footer";

const API = process.env.NEXT_PUBLIC_API_URL || "https://digital-diaries.onrender.com";

function applyColors(settings: Record<string, string>) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  if (settings.primary_color) root.style.setProperty("--primary", settings.primary_color);
  if (settings.secondary_color) root.style.setProperty("--secondary", settings.secondary_color);
  if (settings.accent_color) root.style.setProperty("--accent", settings.accent_color);
}

export function HomePageClient({ initialSettings }: { initialSettings: Record<string, string> }) {
  const [settings, setSettings] = useState<Record<string, string>>(initialSettings);

  // Apply colors from initial server-fetched settings immediately
  useEffect(() => {
    applyColors(initialSettings);
  }, []);

  // Then re-fetch client-side to get latest settings (handles Render cold start)
  useEffect(() => {
    fetch(`${API}/api/admin/public-settings`)
      .then(r => r.json())
      .then(data => {
        if (data.settings && Object.keys(data.settings).length > 0) {
          setSettings(data.settings);
          applyColors(data.settings);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <main className="min-h-screen bg-[#0C0A1A] overflow-x-hidden">
      <Navbar settings={settings} />
      <HeroSection settings={settings} />
      <HowItWorks />
      <FeaturesSection settings={settings} />
      <AIDemo />
      <TemplatesShowcase />
      <DiscoverSection />
      <SocialProof />
      <PricingSection settings={settings} />
      <FinalCTA />
      <Footer settings={settings} />
    </main>
  );
}
