import { Metadata } from "next";
import { PublicCard } from "@/components/card/PublicCard";
import { ClientCardLoader } from "@/components/card/ClientCardLoader";

// Server-side backend URL (set BACKEND_URL in Vercel env vars)
const BACKEND_URL =
  process.env.BACKEND_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "https://ditgital-diaries.onrender.com";

async function getCard(username: string) {
  const url = `${BACKEND_URL}/api/cards/public/${username}`;
  try {
    const res = await fetch(url, {
      cache: "no-store",
      signal: AbortSignal.timeout(10000),
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.card ?? null;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: { params: { username: string } }): Promise<Metadata> {
  const card = await getCard(params.username);
  if (!card) return { title: "Digital Card | Digital Diaries" };
  const profile = card.layout?.sections?.find((s: { type: string }) => s.type === "profile");
  const name = profile?.data?.name || card.username;
  return {
    title: `${name} | Digital Diaries`,
    description: profile?.data?.bio || `${name}'s digital card`,
  };
}

export default async function CardPage({ params }: { params: { username: string } }) {
  const card = await getCard(params.username);

  // If server-side fetch failed (Render sleeping, timeout, etc.)
  // fall back to client-side fetch which will retry with longer waits
  if (!card) {
    return <ClientCardLoader username={params.username} />;
  }

  return <PublicCard card={card} />;
}
