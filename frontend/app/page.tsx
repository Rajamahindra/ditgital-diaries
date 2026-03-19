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

async function getSiteSettings(): Promise<Record<string, string>> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/admin/public-settings`,
      { cache: "no-store" }
    );
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
  return (
    <main className="min-h-screen bg-primary overflow-x-hidden">
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
