"use client";

interface Props { data: Record<string, unknown> }

const DAYS = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];

export function BusinessHoursPreview({ data }: Props) {
  const today = new Date().toLocaleDateString("en-US", { weekday: "long" }).toLowerCase();

  return (
    <div className="px-5 py-4">
      <p className="text-xs text-gray-400 dark:text-white/30 font-medium mb-3 uppercase tracking-wider">Business Hours</p>
      <div className="space-y-1.5">
        {DAYS.map((day) => {
          const hours = (data[day] as string) || "Closed";
          const isToday = day === today;
          const isClosed = hours.toLowerCase() === "closed";
          return (
            <div key={day} className={`flex items-center justify-between py-1.5 px-2.5 rounded-lg text-xs ${isToday ? "bg-blue-50 dark:bg-blue-500/10" : ""}`}>
              <span className={`capitalize font-medium ${isToday ? "text-blue-600 dark:text-blue-400" : "text-gray-600 dark:text-white/60"}`}>
                {day.slice(0, 3)}
                {isToday && <span className="ml-1.5 text-xs bg-blue-600 text-white px-1.5 py-0.5 rounded-full">Today</span>}
              </span>
              <span className={isClosed ? "text-red-400 text-xs" : "text-gray-500 dark:text-white/50 text-xs"}>
                {hours}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
