"use client";
import { useEffect, useState } from "react";
import AuthGuard from "@/components/AuthGuard";
import Layout from "@/components/Layout";
import { adminAPI } from "@/lib/api";
import { formatDate } from "@/lib/utils";
import { Users, FileText, Eye, CreditCard, TrendingUp, Tag, CheckCircle, Clock } from "lucide-react";

interface Stats {
  totalUsers: number; totalCards: number; publishedCards: number;
  totalLeads: number; totalViews: number; totalPosts: number;
  publishedPosts: number; totalCategories: number;
}

function StatCard({ icon: Icon, label, value, color, sub }: { icon: React.ElementType; label: string; value: number | string; color: string; sub?: string }) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 hover:border-gray-700 transition-colors">
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm text-gray-400 font-medium">{label}</span>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
      </div>
      <p className="text-3xl font-bold text-white">{value}</p>
      {sub && <p className="text-xs text-gray-500 mt-1">{sub}</p>}
    </div>
  );
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentPosts, setRecentPosts] = useState<Record<string, string>[]>([]);
  const [recentUsers, setRecentUsers] = useState<Record<string, string>[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminAPI.getStats().then(r => {
      setStats(r.data.stats);
      setRecentPosts(r.data.recentPosts || []);
      setRecentUsers(r.data.recentUsers || []);
    }).finally(() => setLoading(false));
  }, []);

  return (
    <AuthGuard>
      <Layout>
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-white">Dashboard</h1>
            <p className="text-gray-400 text-sm mt-1">Welcome back, Admin</p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => <div key={i} className="h-32 rounded-2xl shimmer" />)}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
              <StatCard icon={Users} label="Total Users" value={stats?.totalUsers || 0} color="bg-violet-600" sub="Registered accounts" />
              <StatCard icon={FileText} label="Total Posts" value={stats?.totalPosts || 0} color="bg-blue-600" sub={`${stats?.publishedPosts || 0} published`} />
              <StatCard icon={Eye} label="Total Views" value={stats?.totalViews || 0} color="bg-emerald-600" sub="Card page views" />
              <StatCard icon={CreditCard} label="Total Cards" value={stats?.totalCards || 0} color="bg-orange-500" sub={`${stats?.publishedCards || 0} published`} />
              <StatCard icon={TrendingUp} label="Total Leads" value={stats?.totalLeads || 0} color="bg-pink-600" sub="Form submissions" />
              <StatCard icon={Tag} label="Categories" value={stats?.totalCategories || 0} color="bg-cyan-600" sub="Content categories" />
              <StatCard icon={CheckCircle} label="Published Posts" value={stats?.publishedPosts || 0} color="bg-green-600" sub="Live articles" />
              <StatCard icon={Clock} label="Draft Posts" value={(stats?.totalPosts || 0) - (stats?.publishedPosts || 0)} color="bg-yellow-600" sub="Pending review" />
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Posts */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Recent Posts</h2>
              {recentPosts.length === 0 ? (
                <p className="text-gray-500 text-sm">No posts yet</p>
              ) : (
                <div className="space-y-3">
                  {recentPosts.map((post) => (
                    <div key={post.id} className="flex items-center gap-3 py-2 border-b border-gray-800 last:border-0">
                      <div className={`w-2 h-2 rounded-full flex-shrink-0 ${post.status === "published" ? "bg-emerald-500" : "bg-yellow-500"}`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-white truncate">{post.title}</p>
                        <p className="text-xs text-gray-500">{formatDate(post.created_at)}</p>
                      </div>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${post.status === "published" ? "bg-emerald-500/10 text-emerald-400" : "bg-yellow-500/10 text-yellow-400"}`}>
                        {post.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Recent Users */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Recent Users</h2>
              {recentUsers.length === 0 ? (
                <p className="text-gray-500 text-sm">No users yet</p>
              ) : (
                <div className="space-y-3">
                  {recentUsers.map((user) => (
                    <div key={user.id} className="flex items-center gap-3 py-2 border-b border-gray-800 last:border-0">
                      <div className="w-8 h-8 rounded-full bg-violet-600/20 border border-violet-600/30 flex items-center justify-center text-violet-400 text-sm font-semibold flex-shrink-0">
                        {user.name?.[0]?.toUpperCase() || "U"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-white truncate">{user.name}</p>
                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                      </div>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-gray-800 text-gray-400 capitalize">{user.plan}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </Layout>
    </AuthGuard>
  );
}
