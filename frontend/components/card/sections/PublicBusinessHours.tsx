"use client";

interface Props { data: Record<string, unknown>; }

const DAYS = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];

export function PublicBusinessHours({ data }: Props) {
  const today = DAYS[new Date().getDay() === 0 ? 6 : new Date().getDay() - 1];

  return (
    <div className="px-5 py-4">
      <p className="text-xs font-semibold uppercase tracking-wider opacity-40 mb-3">Business Hours</p>
      <div className="space-y-1.5">
        {DAYS.map((day) => (
          <div
            key={day}
            className={`flex items-center justify-between py-1.5 px-3 rounded-lg text-sm ${
              day === today ? "bg-blue-500/10 text-blue-600 font-semibold" : "opacity-60"
            }`}
          >
            <span className="capitalize">{day}</span>
            <span>{(data[day] as string) || "Closed"}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
