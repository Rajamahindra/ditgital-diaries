import type { Metadata } from "next";
import { HomePageClient } from "@/components/home/HomePageClient";

export const dynamic = "force-dynamic";

const BACKEND =
  process.env.BACKEND_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "https://ditgital-diaries.onrender.com";

async function getSiteSettings(): Promise<Record<string, string>> {
  try {
    const res = await fetch(`${BACKEND}/api/admin/public-settings`, {
      cache: "no-store",
      signal: AbortSignal.timeout(8000),
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
  return <HomePageClient initialSettings={settings} />;
}
