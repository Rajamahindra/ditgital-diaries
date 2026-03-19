"use client";

interface TestimonialItem {
  id: string;
  name: string;
  role: string;
  content: string;
  rating: number;
}

interface Props { data: Record<string, unknown> }

export function TestimonialsPreview({ data }: Props) {
  const items = (data.items as TestimonialItem[]) || [];

  return (
    <div className="px-5 py-4">
      <p className="text-xs text-gray-400 dark:text-white/30 font-medium mb-3 uppercase tracking-wider">Testimonials</p>
      {items.length === 0 ? (
        <div className="text-center py-4 text-gray-300 dark:text-white/20 text-sm">Add client testimonials</div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.id} className="p-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5">
              <div className="flex gap-0.5 mb-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i} className={`text-xs ${i < item.rating ? "text-amber-400" : "text-gray-200"}`}>★</span>
                ))}
              </div>
              <p className="text-gray-600 dark:text-white/60 text-xs leading-relaxed italic">"{item.content}"</p>
              <div className="mt-2">
                <p className="text-gray-800 dark:text-white text-xs font-semibold">{item.name}</p>
                <p className="text-gray-400 dark:text-white/40 text-xs">{item.role}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
