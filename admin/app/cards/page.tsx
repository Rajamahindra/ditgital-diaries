"use client";
import { useEffect, useState, useCallback } from "react";
import AuthGuard from "@/components/AuthGuard";
import Layout from "@/components/Layout";
import { adminAPI } from "@/lib/api";
import { formatDate } from "@/lib/utils";
import { Star, StarOff, ExternalLink } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

export default function CardsPage() {
  const [cards, setCards] = useState<Record<string, unknown>[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  const fetchCards = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminAPI.getCards(page);
      setCards(res.data.cards);
      setTotal(res.data.total);
    } finally { setLoading(false); }
  }, [page]);

  useEffect(() => { fetchCards(); }, [fetchCards]);

  async function handleFeature(id: string) {
    await adminAPI.featureCard(id);
    toast.success("Feature status toggled");
    fetchCards();
  }

  const apiUrl = process.env.NEXT_PUBLIC_API_URL?.replace(":5000", ":3000") || "http://localhost:3000";

  return (
    <AuthGuard>
      <Layout>
        <Toaster position="top-right" />
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-white">Cards</h1>
            <p className="text-gray-400 text-sm mt-1">{total} total cards</p>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-800">
                    {["Card", "Owner", "Status", "Featured", "Created", "Actions"].map(h => (
                      <th key={h} className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {loading ? [...Array(5)].map((_, i) => (
                    <tr key={i} className="border-b border-gray-800">
                      {[...Array(6)].map((_, j) => <td key={j} className="px-6 py-4"><div className="h-4 rounded shimmer" /></td>)}
                    </tr>
                  )) : cards.length === 0 ? (
                    <tr><td colSpan={6} className="px-6 py-12 text-center text-gray-500">No cards found</td></tr>
                  ) : cards.map(card => (
                    <tr key={card.id as string} className="border-b border-gray-800 hover:bg-gray-800/40 transition">
                      <td className="px-6 py-4">
                        <p className="text-white text-sm font-medium">@{card.username as string}</p>
                        <p className="text-gray-500 text-xs">{card.unique_id as string}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-white text-sm">{card.owner_name as string}</p>
                        <p className="text-gray-500 text-xs">{card.owner_email as string}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${card.is_published ? "bg-emerald-500/10 text-emerald-400" : "bg-gray-700 text-gray-400"}`}>
                          {card.is_published ? "Published" : "Draft"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${card.is_featured ? "bg-yellow-500/10 text-yellow-400" : "bg-gray-800 text-gray-500"}`}>
                          {card.is_featured ? "Featured" : "Normal"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-400 text-sm">{formatDate(card.created_at as string)}</td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button onClick={() => handleFeature(card.id as string)}
                            className={`p-1.5 rounded-lg transition ${card.is_featured ? "text-yellow-400 hover:bg-yellow-400/10" : "text-gray-500 hover:text-yellow-400 hover:bg-yellow-400/10"}`}>
                            {card.is_featured ? <StarOff className="w-4 h-4" /> : <Star className="w-4 h-4" />}
                          </button>
                          <a href={`${apiUrl}/card/${card.username}`} target="_blank" rel="noreferrer"
                            className="p-1.5 text-gray-500 hover:text-blue-400 hover:bg-blue-400/10 rounded-lg transition">
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {total > 20 && (
              <div className="flex items-center justify-between px-6 py-4 border-t border-gray-800">
                <p className="text-sm text-gray-400">Page {page} of {Math.ceil(total / 20)}</p>
                <div className="flex gap-2">
                  <button disabled={page === 1} onClick={() => setPage(p => p - 1)}
                    className="px-3 py-1.5 text-sm bg-gray-800 text-gray-300 rounded-lg disabled:opacity-40 hover:bg-gray-700 transition">Prev</button>
                  <button disabled={page >= Math.ceil(total / 20)} onClick={() => setPage(p => p + 1)}
                    className="px-3 py-1.5 text-sm bg-gray-800 text-gray-300 rounded-lg disabled:opacity-40 hover:bg-gray-700 transition">Next</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </Layout>
    </AuthGuard>
  );
}
