"use client";

import { Bell, Moon, Sun, Search } from "lucide-react";
import { useTheme } from "next-themes";
import { useAuthStore } from "@/lib/store";

export function DashboardHeader() {
  const { theme, setTheme } = useTheme();
  const { user } = useAuthStore();

  return (
    <header className="bg-white dark:bg-dark-card border-b border-gray-100 dark:border-white/5 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-3 flex-1 max-w-md">
        <Search className="w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search cards, leads..."
          className="flex-1 bg-transparent text-primary dark:text-white placeholder-gray-400 dark:placeholder-white/30 outline-none text-sm"
        />
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="p-2 rounded-lg text-gray-400 hover:text-primary dark:hover:text-white hover:bg-gray-50 dark:hover:bg-white/5 transition-all"
        >
          {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>

        <button className="relative p-2 rounded-lg text-gray-400 hover:text-primary dark:hover:text-white hover:bg-gray-50 dark:hover:bg-white/5 transition-all">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
        </button>

        <div className="w-8 h-8 rounded-xl bg-gradient-accent flex items-center justify-center text-sm font-bold text-white cursor-pointer">
          {user?.name?.[0]?.toUpperCase()}
        </div>
      </div>
    </header>
  );
}
