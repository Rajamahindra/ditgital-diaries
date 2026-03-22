import { ClientCardLoader } from "@/components/card/ClientCardLoader";

interface Props {
  params: Promise<{ username: string }> | { username: string };
}

export default async function CardPage({ params }: Props) {
  // Next.js 15 made params async — handle both sync and async
  const resolvedParams = await Promise.resolve(params);
  const username = resolvedParams.username;

  return <ClientCardLoader username={username} />;
}
