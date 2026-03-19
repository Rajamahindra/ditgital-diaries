"use client";

interface PortfolioItem { id: string; title: string; description: string; image?: string; link?: string; }
interface Props { data: Record<string, unknown>; }

export function PublicPortfolio({ data }: Props) {
  const items = (data.items as PortfolioItem[]) || [];
  if (items.length === 0) return null;

  return (
    <div className="px-5 py-4">
      <p className="text-xs font-semibold uppercase tracking-wider opacity-40 mb-3">Portfolio</p>
      <div className="grid grid-cols-2 gap-3">
        {items.map((item) => (
          <a
            key={item.id}
            href={item.link || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-xl overflow-hidden border border-black/10 dark:border-white/10 hover:scale-105 transition-transform"
          >
            {item.image ? (
              <img src={item.image} alt={item.title} className="w-full h-24 object-cover" />
            ) : (
              <div className="w-full h-24 bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center text-white text-2xl">
                🎨
              </div>
            )}
            <div className="p-2">
              <p className="text-xs font-semibold truncate">{item.title}</p>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
