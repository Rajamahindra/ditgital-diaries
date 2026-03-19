"use client";
import { useEffect, useState, useCallback } from "react";
import AuthGuard from "@/components/AuthGuard";
import Layout from "@/components/Layout";
import { adminAPI } from "@/lib/api";
import { formatDate } from "@/lib/utils";
import { Search, Ban, Trash2, Users as UsersIcon, ShieldOff } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

export default function UsersPage() {
  const [users, setUsers] = useState<Record<string, unknown>[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminAPI.getUsers(page, search);
      setUsers(res.data.users);
      setTotal(res.data.total);
    } finally { setLoading(false); }
  }, [page, search]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  async function handleBan(id: string) {
    await adminAPI.banUser(id as string);
    toast.success("Ban status toggled");
    fetchUsers();
  }

  async function handleDelete(id: string) {
    if (!confirm("Permanently delete this user?")) return;
    await adminAPI.deleteUser(id as string);
    toast.success("User deleted");
    fetchUsers();
  }

  return (
    <AuthGuard>
      <Layout>
        <Toaster position="top-right" />
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">Users</h1>
              <p className="text-gray-400 text-sm mt-1">{total} registered users</p>
            </div>
          </div>

          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search by name or email..."
              className="w-full pl-11 pr-4 py-3 bg-gray-900 border border-gray-800 rounded-xl text-white text-sm outline-none focus:ring-2 focus:ring-violet-500" />
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-800">
                    {["User", "Plan", "Status", "Joined", "Actions"].map(h => (
                      <th key={h} className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {loading ? [...Array(5)].map((_, i) => (
                    <tr key={i} className="border-b border-gray-800">
                      {[...Array(5)].map((_, j) => <td key={j} className="px-6 py-4"><div className="h-4 rounded shimmer" /></td>)}
                    </tr>
                  )) : users.length === 0 ? (
                    <tr><td colSpan={5} className="px-6 py-16 text-center">
                      <UsersIcon className="w-10 h-10 text-gray-700 mx-auto mb-3" />
                      <p className="text-gray-500">No users found</p>
                    </td></tr>
                  ) : users.map(user => (
                    <tr key={user.id as string} className="border-b border-gray-800 hover:bg-gray-800/40 transition">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-violet-600/20 border border-violet-600/30 flex items-center justify-center text-violet-400 text-sm font-semibold flex-shrink-0">
                            {(user.name as string)?.[0]?.toUpperCase() || "U"}
                          </div>
                          <div>
                            <p className="text-white text-sm font-medium">{user.name as string}</p>
                            <p className="text-gray-500 text-xs">{user.email as string}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-gray-800 text-gray-300 capitalize">{user.plan as string}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${user.is_banned ? "bg-red-500/10 text-red-400" : "bg-emerald-500/10 text-emerald-400"}`}>
                          {user.is_banned ? "Banned" : "Active"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-400 text-sm">{formatDate(user.created_at as string)}</td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button onClick={() => handleBan(user.id as string)}
                            className={`p-1.5 rounded-lg transition ${user.is_banned ? "text-gray-500 hover:text-emerald-400 hover:bg-emerald-400/10" : "text-gray-500 hover:text-orange-400 hover:bg-orange-400/10"}`}>
                            {user.is_banned ? <ShieldOff className="w-4 h-4" /> : <Ban className="w-4 h-4" />}
                          </button>
                          <button onClick={() => handleDelete(user.id as string)}
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
