"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { cardsAPI } from "@/lib/api";
import { useBuilderStore } from "@/lib/store";
import { CardBuilder } from "@/components/builder/CardBuilder";
import { Loader2 } from "lucide-react";

export default function EditCardPage() {
  const { id } = useParams<{ id: string }>();
  const { setActiveCard } = useBuilderStore();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    cardsAPI.getById(id)
      .then((res) => {
        setActiveCard(res.data.card);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, [id, setActiveCard]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-secondary animate-spin mx-auto mb-3" />
          <p className="text-gray-400 dark:text-white/40 text-sm">Loading builder...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full min-h-[60vh]">
        <p className="text-red-400">Failed to load card. Please try again.</p>
      </div>
    );
  }

  return <CardBuilder />;
}
