"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutDashboard, CreditCard, BarChart3, Users,
  Palette, DollarSign, Settings, Sparkles, LogOut, ChevronRight
} from "lucide-react";
import { useAuthStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: "Overview", href: "/dashboard" },
  { icon: CreditCard, label: "My Cards", href: "/dashboard/cards" },
  { icon: BarChart3, label: "Analytics", href: "/dashboard/analytics" },
  { icon: Users, label: "Leads", href: "/dashboard/leads" },
  { icon: Palette, label: "Templates", href: "/dashboard/templates" },
  { icon: DollarSign, label: "Billing", href: "/dashboard/billing" },
  { icon: Settings, label: "Settings", href: "/dashboard/settings" },
];

const PLAN_COLORS: Record<string, string> = {
  free: "bg-white/10 text-white/50",
  pro: "bg-blue-500/15 text-blue-400",
  business: "bg-violet-500/15 text-violet-400",
};

export function DashboardSidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
    Cookies.remove("dd_token");
    logout();
    router.push("/");
  };

  const planColor = PLAN_COLORS[user?.plan || "free"] || PLAN_COLORS.free;

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-[#0A1020] border-r border-white/5 min-h-screen relative">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-600/[0.03] to-violet-600/[0.03] pointer-events-none" />

      {/* Logo */}
      <div className="relative p-6 border-b border-white/5">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center shadow-lg shadow-violet-500/20 group-hover:scale-110 transition-transform duration-200">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="text-white font-bold text-lg">
            Digital
            <span className="bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent font-black">
              Diaries
            </span>
          </span>
        </Link>
      </div>

      {/* Nav */}
      <nav className="relative flex-1 p-3 space-y-0.5">
        {NAV_ITEMS.map(({ icon: Icon, label, href }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group",
                active
                  ? "text-white"
                  : "text-white/40 hover:text-white/80 hover:bg-white/[0.04]"
              )}
            >
              {/* Active background */}
              {active && (
                <motion.div
                  layoutId="sidebar-active-bg"
                  className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-600/20 to-violet-600/10 border border-blue-500/20"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                />
              )}

              <Icon
                className={cn(
                  "relative w-4 h-4 flex-shrink-0 transition-colors",
                  active ? "text-blue-400" : "text-white/30 group-hover:text-white/60"
                )}
              />
              <span className="relative">{label}</span>

              {active && (
                <motion.div
                  layoutId="sidebar-active-arrow"
                  className="relative ml-auto"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                >
                  <ChevronRight className="w-3.5 h-3.5 text-blue-400" />
                </motion.div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User profile */}
      <div className="relative p-3 border-t border-white/5">
        {/* User info */}
        <div className="flex items-center gap-3 px-3 py-3 rounded-xl bg-white/[0.03] border border-white/5 mb-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-sm font-bold text-white shadow-md shadow-violet-500/20 flex-shrink-0">
            {user?.name?.[0]?.toUpperCase() || "U"}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-white text-sm font-semibold truncate">{user?.name || "User"}</div>
            <div className={cn("text-xs font-medium capitalize px-1.5 py-0.5 rounded-md inline-block mt-0.5", planColor)}>
              {user?.plan || "free"} plan
            </div>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-white/30 hover:text-red-400 hover:bg-red-500/8 transition-all duration-200 group"
        >
          <LogOut className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          Sign out
        </button>
      </div>
    </aside>
  );
}
