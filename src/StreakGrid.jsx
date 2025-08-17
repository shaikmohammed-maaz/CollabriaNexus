import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import { FaChevronLeft, FaChevronRight, FaFire, FaCalendarCheck, FaPlus } from "react-icons/fa";
import { useAuth } from './Services/AuthContext';
import { getStreakData, markTodayComplete, getCurrentStreakFromData } from './Services/streakService';

const weekDays = ["S", "M", "T", "W", "T", "F", "S"];

const StreakGrid = () => {
  const { currentUser, userProfile } = useAuth();
  const [currentMonth, setCurrentMonth] = useState(dayjs());
  const [hoveredDate, setHoveredDate] = useState(null);
  const [animateStreak, setAnimateStreak] = useState(false);
  const [streakData, setStreakData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const today = dayjs();

  // Load streak data for current month
  useEffect(() => {
    if (!currentUser) {
      setLoading(false);
      return;
    }

    const loadStreakData = async () => {
      try {
        setLoading(true);
        const result = await getStreakData(
          currentUser.uid, 
          currentMonth.year(), 
          currentMonth.month() + 1
        );
        
        if (result.success) {
          setStreakData(result.streakData);
        } else {
          setError(result.error);
        }
      } catch (err) {
        console.error('Error loading streak data:', err);
        setError('Failed to load streak data');
      } finally {
        setLoading(false);
      }
    };

    loadStreakData();
  }, [currentUser, currentMonth]);

  // Calculate current streak from user profile or streak data
  const getCurrentStreak = () => {
    if (userProfile?.stats?.currentStreak !== undefined) {
      return userProfile.stats.currentStreak;
    }
    return getCurrentStreakFromData(streakData);
  };

  const currentStreak = getCurrentStreak();

  // Handle marking today as complete
  const handleMarkComplete = async () => {
    if (!currentUser) return;

    try {
      const result = await markTodayComplete(currentUser.uid, ['manual_completion']);
      if (result.success) {
        // Refresh streak data
        const updatedResult = await getStreakData(
          currentUser.uid, 
          currentMonth.year(), 
          currentMonth.month() + 1
        );
        if (updatedResult.success) {
          setStreakData(updatedResult.streakData);
        }
        
        setAnimateStreak(true);
        setTimeout(() => setAnimateStreak(false), 1000);
      }
    } catch (error) {
      console.error('Error marking day complete:', error);
    }
  };

  useEffect(() => {
    setAnimateStreak(true);
    const timer = setTimeout(() => setAnimateStreak(false), 1000);
    return () => clearTimeout(timer);
  }, [currentMonth]);

  const daysInMonth = currentMonth.daysInMonth();
  const firstDayOfMonth = currentMonth.startOf("month");
  const startOfWeek = firstDayOfMonth.startOf("week");

  // Generate calendar grid including previous month's trailing days
  const calendarDays = Array.from({ length: 42 }, (_, i) => startOfWeek.add(i, "day"));

  const handlePrev = () => setCurrentMonth(currentMonth.subtract(1, "month"));
  const handleNext = () => setCurrentMonth(currentMonth.add(1, "month"));

  // Calculate monthly progress
  const monthlyCompletedDays = Object.keys(streakData).filter(date => 
    dayjs(date).month() === currentMonth.month() && streakData[date].completed
  ).length;
  const monthlyProgress = (monthlyCompletedDays / currentMonth.daysInMonth()) * 100;

  // Show loading state
  if (!currentUser) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <p className="text-gray-400">Please log in to view your streak</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-400 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading streak data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col justify-start relative">
      {/* Error Display */}
      {error && (
        <div className="mb-4 bg-red-500/20 border border-red-500 text-red-300 px-3 py-2 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Streak Counter with Fire Animation */}
      {/* <div className="flex items-center justify-center mb-4 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-xl p-3 border border-orange-500/30">
        <FaFire className={`text-orange-500 mr-2 text-lg ${animateStreak ? 'animate-pulse' : ''}`} />
        <span className="text-orange-400 font-bold text-sm">
          {currentStreak} Day Streak
        </span>
        <FaFire className={`text-orange-500 ml-2 text-lg ${animateStreak ? 'animate-pulse' : ''}`} />
      </div> */}

      {/* Today's Action Button */}
      {!streakData[today.format("YYYY-MM-DD")]?.completed && (
        <div className="mb-4 text-center">
          <button
            onClick={handleMarkComplete}
            className="px-4 py-2 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white rounded-lg text-sm font-medium transition-all duration-300 flex items-center gap-2 mx-auto"
          >
            <FaPlus />
            Mark Today Complete
          </button>
        </div>
      )}

      {/* Header with Glassmorphism Effect */}
      <div className="flex items-center justify-between mb-4 w-full px-2 bg-white/5 backdrop-blur-sm rounded-lg py-2 border border-white/10">
        <button
          onClick={handlePrev}
          className="text-violet-400 hover:text-violet-300 hover:bg-white/10 transition-all duration-200 text-sm p-2 rounded-lg group"
          aria-label="Previous month"
        >
          <FaChevronLeft className="group-hover:transform group-hover:-translate-x-0.5 transition-transform" />
        </button>

        <div className="text-violet-300 text-sm font-bold text-center flex items-center gap-2">
          <FaCalendarCheck className="text-violet-400" />
          {currentMonth.format("MMMM YYYY")}
        </div>

        <button
          onClick={handleNext}
          className="text-violet-400 hover:text-violet-300 hover:bg-white/10 transition-all duration-200 text-sm p-2 rounded-lg group"
          aria-label="Next month"
        >
          <FaChevronRight className="group-hover:transform group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      {/* Weekday Headers */}
      <div className="grid grid-cols-7 gap-1 text-[10px] text-violet-300/80 mb-2 text-center font-medium">
        {weekDays.map((day) => (
          <div key={day} className="w-full py-1">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1 flex-1">
        {calendarDays.map((day) => {
          const dateStr = day.format("YYYY-MM-DD");
          const isCompleted = streakData[dateStr]?.completed || false;
          const isToday = day.isSame(today, "day");
          const isCurrentMonth = day.month() === currentMonth.month();
          const isPastDate = day.isBefore(today, "day");

          return (
            <div
              key={dateStr}
              className={`
                w-full aspect-square flex items-center justify-center text-[9px] font-medium rounded-lg 
                transition-all duration-300 cursor-pointer relative overflow-hidden group
                ${isCompleted
                  ? "bg-gradient-to-br from-violet-500 to-purple-600 text-white shadow-lg shadow-violet-500/30 hover:shadow-violet-500/50"
                  : isPastDate
                  ? "bg-gray-800/50 text-gray-500 border border-gray-700/50"
                  : "bg-slate-800/70 text-slate-300 border border-slate-700/50 hover:bg-slate-700/70"
                }
                ${isToday ? "ring-2 ring-orange-400 ring-offset-2 ring-offset-slate-900" : ""}
                ${!isCurrentMonth ? "opacity-40" : ""}
                ${hoveredDate === dateStr ? "scale-110 z-10" : ""}
              `}
              title={`${day.format("dddd, MMMM D")} ${isCompleted ? "- Completed ✓" : ""}`}
              onMouseEnter={() => setHoveredDate(dateStr)}
              onMouseLeave={() => setHoveredDate(null)}
            >
              {/* Shimmer effect for completed days */}
              {isCompleted && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 animate-shimmer" />
              )}
              
              {/* Day number */}
              <span className="relative z-10">{day.date()}</span>
              
              {/* Completion indicator */}
              {isCompleted && (
                <div className="absolute top-0.5 right-0.5 w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
              )}

              {/* Today indicator */}
              {isToday && !isCompleted && (
                <div className="absolute bottom-0.5 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-orange-400 rounded-full" />
              )}
            </div>
          );
        })}
      </div>

      {/* Progress Bar */}
      <div className="mt-4 w-full">
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs text-violet-300">Monthly Progress</span>
          <span className="text-xs text-violet-400 font-medium">
            {monthlyCompletedDays}/{currentMonth.daysInMonth()} days
          </span>
        </div>
        <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-violet-500 to-purple-600 rounded-full transition-all duration-1000 ease-out shadow-sm shadow-violet-500/50"
            style={{ width: `${monthlyProgress}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default StreakGrid;
