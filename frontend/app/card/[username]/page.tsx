import { Metadata } from "next";
import { notFound } from "next/navigation";
import { PublicCard } from "@/components/card/PublicCard";

async function getCard(username: string) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/cards/public/${username}`,
      { next: { revalidate: 60 } }
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
