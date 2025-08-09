import React, { useState } from "react";
import dayjs from "dayjs";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const dummyStreakData = {
  "2025-08-01": { completed: true },
  "2025-08-02": { completed: true },
  "2025-08-04": { completed: true },
  "2025-08-07": { completed: true },
  "2025-08-11": { completed: true },
  "2025-08-12": { completed: true },
  "2025-08-13": { completed: true },
};

const weekDays = ["S", "M", "T", "W", "T", "F", "S"];

const StreakGrid = () => {
  const [currentMonth, setCurrentMonth] = useState(dayjs());
  const today = dayjs();

  const daysInMonth = currentMonth.daysInMonth();
  const firstDayOfMonth = currentMonth.startOf("month");

  const days = Array.from({ length: daysInMonth }, (_, i) =>
    firstDayOfMonth.add(i, "day")
  );

  const handlePrev = () => setCurrentMonth(currentMonth.subtract(1, "month"));
  const handleNext = () => setCurrentMonth(currentMonth.add(1, "month"));

  return (
    <div className="w-full h-full flex flex-col justify-start">
      {/* Header */}
      <div className="flex items-center justify-between mb-3 w-full px-1">
        <button
          onClick={handlePrev}
          className="text-white hover:text-accentLight transition text-sm p-1 bg-transparent outline-none"
          aria-label="Previous month"
        >
          <FaChevronLeft />
        </button>

        <div className="text-accent text-sm font-semibold text-center w-[120px] truncate">
          {currentMonth.format("MMMM YYYY")}
        </div>

        <button
          onClick={handleNext}
          className="text-white hover:text-accentLight transition text-sm p-1 bg-transparent outline-none"
          aria-label="Next month"
        >
          <FaChevronRight />
        </button>
      </div>

      {/* Weekday Initials */}
      <div className="grid grid-cols-7 gap-[3px] text-[10px] text-text-muted mb-1 text-center">
        {weekDays.map((day) => (
          <div key={day} className="w-full">
            {day}
          </div>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-7 gap-[3px]">
        {days.map((day) => {
          const dateStr = day.format("YYYY-MM-DD");
          const isCompleted = dummyStreakData[dateStr]?.completed || false;
          const isToday = day.isSame(today, "day");

          return (
            <div
              key={dateStr}
              className={`w-full aspect-square flex items-center justify-center text-[10px] rounded-sm border border-border ${
                isCompleted
                  ? "bg-accent text-white"
                  : "bg-[#2a2a3c] text-text-muted"
              } ${isToday ? "ring-2 ring-violet-400" : ""}`}
              title={day.format("dddd, MMMM D")}
            >
              {day.date()}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StreakGrid;
