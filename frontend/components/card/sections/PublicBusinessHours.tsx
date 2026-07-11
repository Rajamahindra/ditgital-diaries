"use client";

import { Clock } from "lucide-react";

interface Props { data: Record<string, unknown>; }

const DAYS = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
const DAY_SHORT: Record<string, string> = {
  monday: "Mon", tuesday: "Tue", wednesday: "Wed", thursday: "Thu",
  friday: "Fri", saturday: "Sat", sunday: "Sun",
};

export function PublicBusinessHours({ data }: Props) {
  const todayIdx = new Date().getDay(); // 0=Sun
  const today = DAYS[todayIdx === 0 ? 6 : todayIdx - 1];
  const hasAnyHours = DAYS.some((d) => data[d]);
  if (!hasAnyHours) return null;

  return (
    <div className="px-5 sm:px-8 py-5">
      <div className="flex items-center gap-2 mb-4">
        <Clock className="w-4 h-4 opacity-40" />
        <p className="text-xs font-bold uppercase tracking-widest opacity-40">Business Hours</p>
      </div>
      <div className="space-y-1.5">
        {DAYS.map((day) => {
          const hours = (data[day] as string) || "Closed";
          const isToday = day === today;
          const isClosed = hours.toLowerCase() === "closed";
          return (
            <div key={day}
              className={`flex items-center justify-between py-2 px-3.5 rounded-xl text-sm transition-all ${isToday ? "bg-blue-500/10 font-semibold" : "opacity-60"}`}>
              <div className="flex items-center gap-2">
                {isToday && <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />}
                <span className="capitalize">{DAY_SHORT[day]}</span>
                {isToday && <span className="text-xs text-blue-500 font-normal">(Today)</span>}
              </div>
              <span className={isClosed ? "text-red-400 text-xs" : ""}>{hours}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
