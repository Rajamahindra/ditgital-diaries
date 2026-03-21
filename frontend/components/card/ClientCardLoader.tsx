"use client";

import { useEffect, useState } from "react";
import { Loader2, Sparkles, RefreshCw } from "lucide-react";
import { PublicCard } from "./PublicCard";
import Link from "next/link";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://ditgital-diaries.onrender.com";

export function ClientCardLoader({ username }: { username: string }) {
  const [card, setCard] = useState<unknown>(null);
  const [status, setStatus] = useState<"loading" | "notfound" | "error">("loading");
  const [attempt, setAttempt] = useState(0);

  const load = async () => {
    setStatus("loading");
    setAttempt(0);

    // Try up to 4 times with increasing delays (handles Render cold start ~30s)
    for (let i = 0; i <= 3; i++) {
      if (i > 0) {
        setAttempt(i);
        await new Promise((r) => setTimeout(r, i === 1 ? 4000 : i === 2 ? 6000 : 8000));
      }
      try {
        const res = await fetch(`${API_URL}/api/cards/public/${username}`, {
          cache: "no-store",
        });
        if (res.status === 404) {
          setStatus("notfound");
          return;
        }
        if (res.ok) {
          const data = await res.json();
          if (data.card) {
            setCard(data.card);
            return;
          }
        }
      } catch {
        // retry
      }
    }
    setStatus("error");
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [username]);

  if (card) {
    return <PublicCard card={card as Parameters<typeof PublicCard>[0]["card"]} />;
  }

  if (status === "notfound") {
    return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-20 h-20 rounded-2xl bg-gradient-accent mx-auto flex items-center justify-center mb-6">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-display font-black text-white mb-3">Card Not Found</h1>
          <p className="text-white/50 mb-8">This card doesn&apos;t exist or hasn&apos;t been published yet.</p>
          <Link href="/" className="btn-gradient inline-flex items-center gap-2">Create Your Own Card</Link>
        </div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-20 h-20 rounded-2xl bg-gradient-accent mx-auto flex items-center justify-center mb-6">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-2xl font-display font-black text-white mb-3">Server is waking up</h1>
          <p className="text-white/50 mb-8">Our server takes a moment to start. Please try again.</p>
          <button onClick={load} className="btn-gradient inline-flex items-center gap-2">
            <RefreshCw className="w-4 h-4" /> Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center px-4">
      <div className="text-center">
        <div className="w-16 h-16 rounded-2xl bg-gradient-accent mx-auto flex items-center justify-center mb-4 animate-pulse">
          <Sparkles className="w-8 h-8 text-white" />
        </div>
        <Loader2 className="w-8 h-8 text-white/50 animate-spin mx-auto mb-3" />
        <p className="text-white font-semibold">Loading card...</p>
        {attempt > 0 && (
          <p className="text-white/40 text-sm mt-1">Waking up server... ({attempt}/4)</p>
        )}
      </div>
    </div>
  );
}
