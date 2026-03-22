"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { adminAPI } from "@/lib/api";
import { useAdminStore } from "@/lib/store";
import { Loader2, Shield } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { setAuth, logout } = useAdminStore();
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await adminAPI.login(email, password);
      // Set auth first so the next request has the token
      setAuth(res.data.user, res.data.token);
      // Verify admin access against the backend
      try {
        await adminAPI.getStats();
      } catch (adminErr: unknown) {
        const status = (adminErr as { response?: { status?: number } })?.response?.status;
        if (status === 403) {
          logout();
          toast.error("Access denied — this account is not an admin");
          return;
        }
      }
      router.push("/dashboard");
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || "Login failed";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <Toaster position="top-right" />
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-violet-600 flex items-center justify-center mx-auto mb-4">
            <Shield className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">Digital Diaries</h1>
          <p className="text-gray-400 text-sm mt-1">Admin Panel</p>
        </div>
        <div className="bg-gray-900 rounded-2xl border border-gray-800 p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white outline-none focus:ring-2 focus:ring-violet-500 transition"
                placeholder="admin@digitaldiaries.com" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} required
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white outline-none focus:ring-2 focus:ring-violet-500 transition"
                placeholder="••••••••" />
            </div>
            <button type="submit" disabled={loading}
              className="w-full py-3 bg-violet-600 hover:bg-violet-500 text-white font-semibold rounded-xl transition flex items-center justify-center gap-2 disabled:opacity-60">
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" />Signing in...</> : "Sign In"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
