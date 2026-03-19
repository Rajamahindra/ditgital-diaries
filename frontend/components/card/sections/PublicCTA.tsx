"use client";

interface Props { data: Record<string, unknown>; onTrack: (event: string) => void; }

export function PublicCTA({ data, onTrack }: Props) {
  const text = (data.text as string) || "Book Appointment";
  const url = (data.url as string) || "#";
  const style = (data.style as string) || "primary";

  return (
    <div className="px-5 py-4">
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => onTrack("cta_click")}
        className={`block w-full text-center py-4 rounded-2xl font-bold text-sm transition-all hover:scale-[1.02] active:scale-[0.98] ${
          style === "primary"
            ? "bg-gradient-to-r from-blue-600 to-violet-600 text-white shadow-lg"
            : "border-2 border-blue-600 text-blue-600"
        }`}
      >
        {text}
      </a>
    </div>
  );
}
