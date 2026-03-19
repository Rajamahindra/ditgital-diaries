"use client";
import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import AuthGuard from "@/components/AuthGuard";
import Layout from "@/components/Layout";
import { adminAPI } from "@/lib/api";
import { formatDate } from "@/lib/utils";
import { Plus, Search, Pencil, Trash2, Eye, EyeOff } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

export default function PostsPage() {
  const [posts, setPosts] = useState<Record<string, unknown>[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminAPI.getPosts({ search, status, page: String(page) });
      setPosts(res.data.posts);
      setTotal(res.data.total);
    } finally {
      setLoading(false);
    }
  }, [search, status, page]);

  useEffect(() => { fetchPosts(); }, [fetchPosts]);

  async function handleDelete(id: string, permanent = false) {
    if (!confirm(permanent ? "Permanently delete this post?" : "Move to trash?")) return;
    await adminAPI.deletePost(id as string, permanent);
    toast.success("Post deleted");
    fetchPosts();
  }

  return (
    <AuthGuard>
      <Layout>
        <Toaster position="top-right" />
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">Posts</h1>
              <p className="text-gray-400 text-sm mt-1">{total} total posts</p>
            </div>
            <Link href="/posts/new"
              className="flex items-center gap-2 px-4 py-2.5 bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold rounded-xl transition">
              <Plus className="w-4 h-4" />New Post
            </Link>
          </div>

          <div className="flex gap-3 flex-wrap">
            <div className="relative flex-1 min-w-48">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
                placeholder="Search posts..."
                className="w-full pl-10 pr-4 py-2.5 bg-gray-900 border border-gray-800 rounded-xl text-white text-sm outline-none focus:ring-2 focus:ring-violet-500" />
            </div>
            <select value={status} onChange={e => { setStatus(e.target.value); setPage(1); }}
              className="px-4 py-2.5 bg-gray-900 border border-gray-800 rounded-xl text-white text-sm outline-none focus:ring-2 focus:ring-violet-500">
              <option value="">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-800">
                    {["Title", "Category", "Status", "Date", "Actions"].map(h => (
                      <th key={h} className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {loading ? [...Array(5)].map((_, i) => (
                    <tr key={i} className="border-b border-gray-800">
                      {[...Array(5)].map((_, j) => (
                        <td key={j} className="px-6 py-4"><div className="h-4 rounded shimmer" /></td>
                      ))}
                    </tr>
                  )) : posts.length === 0 ? (
                    <tr><td colSpan={5} className="px-6 py-16 text-center text-gray-500">No posts found</td></tr>
                  ) : posts.map((post) => (
                    <tr key={post.id as string} className="border-b border-gray-800 hover:bg-gray-800/40 transition">
                      <td className="px-6 py-4">
                        <p className="text-white text-sm font-medium truncate max-w-xs">{post.title as string}</p>
                        <p className="text-gray-500 text-xs mt-0.5">/{post.slug as string}</p>
                      </td>
                      <td className="px-6 py-4 text-gray-400 text-sm">{(post.category_name as string) || "—"}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                          post.status === "published" ? "bg-emerald-500/10 text-emerald-400" : "bg-yellow-500/10 text-yellow-400"
                        }`}>{post.status as string}</span>
                      </td>
                      <td className="px-6 py-4 text-gray-400 text-sm">{formatDate(post.created_at as string)}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Link href={`/posts/${post.id}/edit`}
                            className="p-1.5 text-gray-500 hover:text-violet-400 hover:bg-violet-400/10 rounded-lg transition">
                            <Pencil className="w-4 h-4" />
                          </Link>
                          <button onClick={() => handleDelete(post.id as string)}
                            className="p-1.5 text-gray-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition">
                            <Trash2 className="w-4 h-4" />
                          </button>
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
