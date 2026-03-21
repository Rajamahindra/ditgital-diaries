import { Metadata } from "next";
import { notFound } from "next/navigation";
import { PublicCard } from "@/components/card/PublicCard";

// Always use the real backend URL — env var may not be set on Vercel at build time
const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "https://ditgital-diaries.onrender.com";

async function getCard(username: string) {
  try {
    const res = await fetch(
      `${BACKEND_URL}/api/cards/public/${username}`,
      { cache: "no-store" } // always fresh — no stale cache
    );
    if (!res.ok) return null;
    const data = await res.json();
    return data.card;
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: { username: string };
}): Promise<Metadata> {
  const card = await getCard(params.username);
  if (!card) return { title: "Card Not Found" };

  const profile = card.layout?.sections?.find((s: { type: string }) => s.type === "profile");
  const name = profile?.data?.name || card.username;
  const profession = profile?.data?.profession || "";

  return {
    title: `${name} — ${profession} | Digital Diaries`,
    description: profile?.data?.bio || `${name}'s digital card on Digital Diaries`,
    openGraph: {
      title: `${name} | Digital Diaries`,
      description: profile?.data?.bio,
      type: "profile",
    },
  };
}

export default async function CardPage({ params }: { params: { username: string } }) {
  const card = await getCard(params.username);
  if (!card) notFound();

  return <PublicCard card={card} />;
}
