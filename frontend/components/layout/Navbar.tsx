"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useAuthStore } from "@/lib/store";
import { cn } from "@/lib/utils";

const NAV = [
  { label: "Templates", href: "/templates" },
  { label: "Features",  href: "/#features"  },
  { label: "Pricing",   href: "/#pricing"   },
  { label: "Discover",  href: "/discover"   },
];

export function Navbar({ settings = {} }: { settings?: Record<string, string> }) {
  const [scrolled,    setScrolled]    = useState(false);
  const [mobileOpen,  setMobileOpen]  = useState(false);
  const { user } = useAuthStore();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 inset-x-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-white/95 dark:bg-[#0C0A1A]/95 backdrop-blur-xl border-b border-violet-100/70 dark:border-violet-900/30 shadow-sm"
          : "bg-transparent"
      )}
    >
      <nav className="max-w-6xl mx-auto px-5 lg:px-8 h-16 flex items-center justify-between">

        {/* ── Logo ── */}
        <Link href="/" className="flex items-center gap-2.5 group flex-shrink-0">
          <Image
            src="/logo.svg"
            alt="Digital Diaries"
            width={36}
            height={36}
            className="rounded-xl transition-transform duration-200 group-hover:scale-105"
            priority
          />
          <span className={cn(
            "font-bold text-[17px] tracking-tight transition-colors",
            scrolled
              ? "text-gray-900 dark:text-white"
              : "text-white"
          )}>
            {settings.site_name || "Digital Diaries"}
          </span>
        </Link>

        {/* ── Desktop links ── */}
        <ul className="hidden lg:flex items-center gap-1">
          {NAV.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className={cn(
                  "text-[13.5px] font-medium px-3.5 py-2 rounded-lg transition-colors",
                  scrolled
                    ? "text-gray-600 dark:text-violet-200/70 hover:text-violet-700 dark:hover:text-violet-300 hover:bg-violet-50 dark:hover:bg-violet-900/20"
                    : "text-white/70 hover:text-white hover:bg-white/10"
                )}
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* ── CTA ── */}
        <div className="hidden lg:flex items-center gap-2.5">
          {user ? (
            <Link href="/dashboard"
              className={cn("text-[13.5px] font-semibold px-4 py-2 rounded-lg border transition-all",
                scrolled
                  ? "border-violet-200 dark:border-violet-700/50 text-violet-700 dark:text-violet-300 hover:border-violet-400 dark:hover:border-violet-500 hover:bg-violet-50 dark:hover:bg-violet-900/20"
                  : "border-white/20 text-white hover:border-white/40 hover:bg-white/10"
              )}>
              Dashboard
            </Link>
          ) : (
            <>
              <Link href="/login"
                className={cn("text-[13.5px] font-medium px-3.5 py-2 rounded-lg transition-colors",
                  scrolled
                    ? "text-gray-600 dark:text-violet-200/70 hover:text-violet-700 dark:hover:text-violet-300"
                    : "text-white/70 hover:text-white"
                )}>
                Log in
              </Link>
              <Link href="/register"
                className="text-[13.5px] font-semibold px-4 py-2 rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white transition-all shadow-[0_2px_12px_rgba(109,40,217,0.4)] hover:shadow-[0_4px_20px_rgba(109,40,217,0.5)]">
                Get started free
              </Link>
            </>
          )}
        </div>

        {/* ── Mobile hamburger ── */}
        <button
          className={cn("lg:hidden p-2 rounded-lg transition-colors",
            scrolled ? "text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-white/10" : "text-white hover:bg-white/10"
          )}
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </nav>

      {/* ── Mobile menu ── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
            className="lg:hidden bg-white dark:bg-[#0C0A1A] border-t border-violet-100 dark:border-violet-900/30 shadow-lg"
          >
            <div className="px-5 py-5 space-y-1">
              {NAV.map((l) => (
                <Link key={l.href} href={l.href}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-between text-gray-700 dark:text-violet-200/80 hover:text-violet-700 dark:hover:text-violet-300 font-medium py-2.5 px-3 rounded-lg hover:bg-violet-50 dark:hover:bg-violet-900/20 text-sm transition-colors">
                  {l.label}
                </Link>
              ))}
              <div className="pt-4 border-t border-violet-100 dark:border-violet-900/30 flex flex-col gap-2.5">
                {user ? (
                  <Link href="/dashboard" onClick={() => setMobileOpen(false)}
                    className="text-center font-semibold py-2.5 px-5 rounded-lg border border-violet-200 dark:border-violet-700/50 text-violet-700 dark:text-violet-300 text-sm transition-all hover:bg-violet-50 dark:hover:bg-violet-900/20">
                    Dashboard
                  </Link>
                ) : (
                  <>
                    <Link href="/login" onClick={() => setMobileOpen(false)}
                      className="text-center font-medium py-2.5 px-5 rounded-lg text-gray-600 dark:text-violet-200/70 border border-violet-100 dark:border-violet-900/30 text-sm hover:bg-violet-50 dark:hover:bg-violet-900/20 transition-all">
                      Log in
                    </Link>
                    <Link href="/register" onClick={() => setMobileOpen(false)}
                      className="text-center font-semibold py-2.5 px-5 rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-sm shadow-[0_2px_12px_rgba(109,40,217,0.4)]">
                      Get started free
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
