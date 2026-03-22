import { ClientCardLoader } from "@/components/card/ClientCardLoader";

// Always use client-side loading to avoid Render cold-start timeouts on Vercel
export default function CardPage({ params }: { params: { username: string } }) {
  return <ClientCardLoader username={params.username} />;
}
