"use client";

import { useState, useEffect } from "react";
import { Bell, Moon, Sun, Search } from "lucide-react";
import { useTheme } from "next-themes";
import { useAuthStore } from "@/lib/store";

export function DashboardHeader() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const { user } = useAuthStore();

  // Fix hydration: only render theme icon after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="bg-[#0A1020]/80 backdrop-blur-xl border-b border-white/5 px-6 py-4 flex items-center justify-between sticky top-0 z-30">
      {/* Search */}
      <div className="flex items-center gap-3 flex-1 max-w-sm bg-white/[0.04] hover:bg-white/[0.06] border border-white/5 hover:border-white/10 rounded-xl px-4 py-2.5 transition-all duration-200 group">
        <Search className="w-4 h-4 text-white/25 group-hover:text-white/40 transition-colors flex-shrink-0" />
        <input
          type="text"
          placeholder="Search cards, leads..."
          className="flex-1 bg-transparent text-white placeholder-white/25 outline-none text-sm"
        />
        <kbd className="hidden sm:flex items-center gap-1 text-white/15 text-xs border border-white/10 rounded px-1.5 py-0.5">
          ⌘K
        </kbd>
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-2 ml-4">
        {/* Theme toggle — only render icon after mount to avoid hydration mismatch */}
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="p-2.5 rounded-xl text-white/30 hover:text-white/70 hover:bg-white/5 border border-transparent hover:border-white/5 transition-all duration-200"
          aria-label="Toggle theme"
        >
          {mounted ? (
            theme === "dark" ? (
              <Sun className="w-4.5 h-4.5 w-[18px] h-[18px]" />
            ) : (
              <Moon className="w-[18px] h-[18px]" />
            )
          ) : (
            <Moon className="w-[18px] h-[18px]" />
          )}
        </button>

        {/* Notifications */}
        <button className="relative p-2.5 rounded-xl text-white/30 hover:text-white/70 hover:bg-white/5 border border-transparent hover:border-white/5 transition-all duration-200">
          <Bell className="w-[18px] h-[18px]" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full ring-2 ring-[#0A1020]" />
        </button>

        {/* Divider */}
        <div className="w-px h-6 bg-white/8 mx-1" />

        {/* Avatar */}
        <button className="flex items-center gap-2.5 pl-1 pr-3 py-1.5 rounded-xl hover:bg-white/5 border border-transparent hover:border-white/5 transition-all duration-200 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-sm font-bold text-white shadow-md shadow-violet-500/20">
            {user?.name?.[0]?.toUpperCase() || "U"}
          </div>
          <div className="hidden sm:block text-left">
            <div className="text-white text-xs font-semibold leading-none mb-0.5">{user?.name || "User"}</div>
            <div className="text-white/30 text-[10px] capitalize">{user?.plan || "free"}</div>
          </div>
        </button>
      </div>
    </header>
  );
}
