import Link from "next/link";
import { Sparkles } from "lucide-react";

const LINKS = {
  Product: ["Templates", "Features", "Pricing", "Changelog"],
  Company: ["About", "Blog", "Careers", "Press"],
  Legal: ["Privacy Policy", "Terms of Service", "Cookie Policy"],
  Support: ["Help Center", "Contact", "Status", "API Docs"],
};

export function Footer({ settings = {} }: { settings?: Record<string, string> }) {
  return (
    <footer className="bg-primary border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2 lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              {settings.logo_url ? (
                <img src={settings.logo_url} alt={settings.site_name || "Logo"} className="h-8 w-auto" />
              ) : (
                <div className="w-8 h-8 rounded-xl bg-gradient-accent flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
              )}
              <span className="text-white font-display font-bold text-lg">
                {settings.site_name || "Digital"}
                <span className="gradient-text">{settings.site_name ? "" : "Diaries"}</span>
              </span>
            </Link>
            <p className="text-white/40 text-sm leading-relaxed">
              {settings.site_tagline || "AI-powered digital identity platform for professionals."}
            </p>
          </div>

          {/* Links */}
          {Object.entries(LINKS).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-white font-semibold text-sm mb-4">{category}</h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link}>
                    <Link
                      href="#"
                      className="text-white/40 hover:text-white text-sm transition-colors"
                    >
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-white/5 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/30 text-sm">
            {settings.footer_text || "© 2026 Digital Diaries. All rights reserved."}
          </p>
          <p className="text-white/20 text-xs">
            Made with ❤️ in India
          </p>
        </div>
      </div>
    </footer>
  );
}
