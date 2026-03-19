"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAdminStore } from "@/lib/store";
import {
  LayoutDashboard, Users, FileText, Image, Tag,
  CreditCard, LogOut, Menu, X, Shield, ChevronRight,
  Settings, Layout as LayoutIcon, Layers,
} from "lucide-react";

const nav = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/posts", icon: FileText, label: "Posts" },
  { href: "/categories", icon: Tag, label: "Categories" },
  { href: "/media", icon: Image, label: "Media" },
  { href: "/users", icon: Users, label: "Users" },
  { href: "/cards", icon: CreditCard, label: "Cards" },
  { href: "/templates", icon: Layers, label: "Templates" },
  { href: "/site-settings", icon: Settings, label: "Site Settings" },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAdminStore();

  function handleLogout() {
    logout();
    router.push("/login");
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-950">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 border-r border-gray-800 flex flex-col
        transform transition-transform duration-200 ${open ? "translate-x-0" : "-translate-x-full"} lg:relative lg:translate-x-0`}>
        <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-800">
          <div className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center flex-shrink-0">
            <Shield className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="font-bold text-white text-sm">Digital Diaries</p>
            <p className="text-xs text-gray-500">Admin Panel</p>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {nav.map(({ href, icon: Icon, label }) => {
            const active = pathname === href || pathname.startsWith(href + "/");
            return (
              <Link key={href} href={href} onClick={() => setOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                  active ? "bg-violet-600/20 text-violet-400" : "text-gray-400 hover:bg-gray-800 hover:text-white"
                }`}>
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span className="flex-1">{label}</span>
                {active && <ChevronRight className="w-3 h-3" />}
              </Link>
            );
          })}
        </nav>

        <div className="px-3 py-4 border-t border-gray-800 space-y-1">
          <div className="px-3 py-2 rounded-xl bg-gray-800/50">
            <p className="text-xs font-medium text-white truncate">{user?.name || user?.email}</p>
            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
          </div>
          <button onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 w-full rounded-xl text-sm font-medium text-gray-400 hover:bg-red-500/10 hover:text-red-400 transition-all">
            <LogOut className="w-4 h-4" />Logout
          </button>
        </div>
      </aside>

      {open && <div className="fixed inset-0 z-40 bg-black/60 lg:hidden" onClick={() => setOpen(false)} />}

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-gray-900 border-b border-gray-800 flex items-center justify-between px-6 flex-shrink-0">
          <button className="lg:hidden text-gray-400 hover:text-white" onClick={() => setOpen(true)}>
            <Menu className="w-5 h-5" />
          </button>
          <div className="hidden lg:flex items-center gap-2 text-sm text-gray-400">
            <span>Admin</span>
            <ChevronRight className="w-3 h-3" />
            <span className="text-white capitalize">{pathname.split("/")[1]}</span>
          </div>
          <div className="w-8 h-8 rounded-full bg-violet-600 flex items-center justify-center text-white text-sm font-bold">
            {(user?.name || user?.email || "A")[0].toUpperCase()}
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
