import type { Metadata } from "next";
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

export const dynamic = "force-dynamic";

const BACKEND =
  process.env.BACKEND_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "https://ditgital-diaries.onrender.com";

async function getSiteSettings(): Promise<Record<string, string>> {
  try {
    const res = await fetch(`${BACKEND}/api/admin/public-settings`, {
      cache: "no-store",
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) return {};
    const data = await res.json();
    return data.settings || {};
  } catch {
    return {};
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSiteSettings();
  return {
    title: s.site_name || "Digital Diaries",
    description: s.site_tagline || "AI-Powered Digital Identity Platform",
  };
}

export default async function HomePage() {
  const settings = await getSiteSettings();
  const primary = settings.primary_color || "#0F172A";
  const secondary = settings.secondary_color || "#2563EB";
  const accent = settings.accent_color || "#7C3AED";

  return (
    <main className="min-h-screen bg-primary overflow-x-hidden">
      <style>{`:root { --primary: ${primary}; --secondary: ${secondary}; --accent: ${accent}; }`}</style>
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
