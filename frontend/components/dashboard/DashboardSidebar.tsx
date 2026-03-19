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

export function DashboardSidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
    Cookies.remove("dd_token");
    logout();
    router.push("/");
  };

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-white dark:bg-dark-card border-r border-gray-100 dark:border-white/5 min-h-screen">
      {/* Logo */}
      <div className="p-6 border-b border-gray-100 dark:border-white/5">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-accent flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="text-primary dark:text-white font-display font-bold text-lg">
            Digital<span className="gradient-text">Diaries</span>
          </span>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1">
        {NAV_ITEMS.map(({ icon: Icon, label, href }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group",
                active
                  ? "bg-secondary text-white shadow-glow-blue"
                  : "text-gray-500 dark:text-white/50 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-primary dark:hover:text-white"
              )}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {label}
              {active && (
                <motion.div
                  layoutId="sidebar-active"
                  className="ml-auto"
                >
                  <ChevronRight className="w-4 h-4" />
                </motion.div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User */}
      <div className="p-4 border-t border-gray-100 dark:border-white/5">
        <div className="flex items-center gap-3 px-3 py-2 mb-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-accent flex items-center justify-center text-sm font-bold text-white">
            {user?.name?.[0]?.toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-primary dark:text-white text-sm font-semibold truncate">{user?.name}</div>
            <div className="text-gray-400 dark:text-white/30 text-xs capitalize">{user?.plan} plan</div>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-400 dark:text-white/40 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all"
        >
          <LogOut className="w-4 h-4" />
          Sign out
        </button>
      </div>
    </aside>
  );
}
