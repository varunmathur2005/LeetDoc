"use client";

import React from "react";
import { format, subDays, eachDayOfInterval } from "date-fns";
import { Tooltip } from "@/components/ui/tooltip"; // assuming you have tooltip from shadcn

interface Props {
  submissions: { timestamp: string }[];
}

export function CalendarHeatmap({ submissions }: Props) {
  const today = new Date();
  const startDate = subDays(today, 180); // last 6 months

  const days = eachDayOfInterval({ start: startDate, end: today });
  const counts: Record<string, number> = {};

  submissions.forEach((s) => {
    const date = format(new Date(s.timestamp), "yyyy-MM-dd");
    counts[date] = (counts[date] || 0) + 1;
  });

  const getColor = (count: number) => {
    if (count >= 5) return "bg-green-600";
    if (count >= 3) return "bg-green-400";
    if (count >= 1) return "bg-green-200";
    return "bg-gray-200";
  };

  return (
    <div className="mt-8 px-4 lg:px-6">
      <h3 className="text-lg font-semibold text-gray-700 mb-4">
        📆 Coding Activity
      </h3>
      <div className="grid grid-cols-7 gap-1">
        {days.map((day) => {
          const key = format(day, "yyyy-MM-dd");
          const count = counts[key] || 0;
          const tooltipText = `${count} problem${
            count !== 1 ? "s" : ""
          } on ${format(day, "MMM d")}`;

          return (
            <Tooltip key={key}>
              <div
                className={`w-4 h-4 rounded-sm ${getColor(count)}`}
                title={tooltipText}
              />
            </Tooltip>
          );
        })}
      </div>
    </div>
  );
}
