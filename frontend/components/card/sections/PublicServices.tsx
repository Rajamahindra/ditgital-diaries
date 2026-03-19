"use client";

interface ServiceItem { id: string; title: string; description: string; price?: string; }
interface Props { data: Record<string, unknown>; }

export function PublicServices({ data }: Props) {
  const items = (data.items as ServiceItem[]) || [];
  if (items.length === 0) return null;

  return (
    <div className="px-5 py-4">
      <p className="text-xs font-semibold uppercase tracking-wider opacity-40 mb-3">Services</p>
      <div className="space-y-2">
        {items.map((item) => (
          <div key={item.id} className="flex items-center justify-between p-3 rounded-xl bg-black/5 dark:bg-white/5">
            <div>
              <p className="text-sm font-semibold">{item.title}</p>
              {item.description && <p className="text-xs opacity-50 mt-0.5">{item.description}</p>}
            </div>
            {item.price && <span className="text-blue-600 text-sm font-bold ml-3">{item.price}</span>}
          </div>
        ))}
      </div>
    </div>
  );
}
