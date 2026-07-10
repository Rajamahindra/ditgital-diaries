import Link from "next/link";
import Image from "next/image";

const COL = {
  Product: ["Templates", "Features", "Pricing", "Changelog"],
  Company:  ["About", "Blog", "Careers", "Press"],
  Legal:    ["Privacy Policy", "Terms of Service", "Cookie Policy"],
  Support:  ["Help Center", "Contact", "Status", "API Docs"],
};

export function Footer({ settings = {} }: { settings?: Record<string, string> }) {
  return (
    <footer className="bg-white dark:bg-[#0C0A1A] border-t border-violet-100 dark:border-violet-900/30">
      <div className="max-w-6xl mx-auto px-5 lg:px-8 py-14">

        <div className="grid grid-cols-2 lg:grid-cols-6 gap-10 mb-14">
          {/* Brand */}
          <div className="col-span-2">
            <Link href="/" className="inline-flex items-center gap-2.5 mb-5">
              <Image
                src="/logo.svg"
                alt="Digital Diaries"
                width={36}
                height={36}
                className="rounded-xl"
              />
              <span className="text-gray-900 dark:text-white font-bold text-[17px]">
                {settings.site_name || "Digital Diaries"}
              </span>
            </Link>
            <p className="text-gray-500 dark:text-violet-300/40 text-sm leading-relaxed max-w-[220px]">
              {settings.site_tagline || "AI-powered digital identity platform for modern professionals."}
            </p>
          </div>

          {/* Link columns */}
          {Object.entries(COL).map(([cat, links]) => (
            <div key={cat}>
              <h4 className="text-gray-900 dark:text-violet-200 font-semibold text-sm mb-4">{cat}</h4>
              <ul className="space-y-2.5">
                {links.map((l) => (
                  <li key={l}>
                    <Link href="#" className="text-gray-500 dark:text-violet-300/40 hover:text-violet-700 dark:hover:text-violet-300 text-sm transition-colors">
                      {l}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-violet-100 dark:border-violet-900/30 pt-7 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-gray-400 dark:text-violet-300/30 text-sm">
            {settings.footer_text || "© 2026 Greater News TV / Digital Diaries. All rights reserved."}
          </p>
          <p className="text-gray-400 dark:text-violet-300/25 text-xs">
            Made with ❤️ in India
          </p>
        </div>
      </div>
    </footer>
  );
}
