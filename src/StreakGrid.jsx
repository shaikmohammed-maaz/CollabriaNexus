import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import { FaChevronLeft, FaChevronRight, FaFire, FaCalendarCheck, FaPlus, FaCheckCircle } from "react-icons/fa";
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

  // Calculate current streak
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

  const firstDayOfMonth = currentMonth.startOf("month");
  const startOfWeek = firstDayOfMonth.startOf("week");
  const calendarDays = Array.from({ length: 42 }, (_, i) => startOfWeek.add(i, "day"));

  const handlePrev = () => setCurrentMonth(currentMonth.subtract(1, "month"));
  const handleNext = () => setCurrentMonth(currentMonth.add(1, "month"));

  // Calculate monthly progress
  const monthlyCompletedDays = Object.keys(streakData).filter(date => 
    dayjs(date).month() === currentMonth.month() && streakData[date].completed
  ).length;
  const monthlyProgress = (monthlyCompletedDays / currentMonth.daysInMonth()) * 100;

  // Check if today is completed
  const todayCompleted = streakData[today.format("YYYY-MM-DD")]?.completed || false;
  const todayActivities = streakData[today.format("YYYY-MM-DD")]?.activities || [];

  // Show loading state
  if (!currentUser) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <p className="text-gray-400 text-sm">Please log in to view your streak</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-violet-400 mx-auto mb-2"></div>
          <p className="text-gray-400 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col">
      {/* Compact Streak Counter */}
      <div className="flex items-center justify-center mb-3 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-lg p-2 border border-orange-500/30">
        <FaFire className={`text-orange-500 mr-2 text-sm ${animateStreak ? 'animate-pulse' : ''}`} />
        <span className="text-orange-400 font-bold text-sm">{currentStreak} Days</span>
        <FaFire className={`text-orange-500 ml-2 text-sm ${animateStreak ? 'animate-pulse' : ''}`} />
      </div>

      {/* Compact Status */}
      {/* {!todayCompleted ? (
        <div className="mb-3 text-center">
          <div className="bg-blue-500/10 border border-blue-500/20 rounded p-2">
            <p className="text-blue-300 text-xs mb-1">Auto-marked when mining starts!</p>
            <button
              onClick={handleMarkComplete}
              className="px-2 py-1 bg-slate-600 hover:bg-slate-500 text-white rounded text-xs flex items-center gap-1 mx-auto opacity-75"
            >
              <FaPlus className="text-xs" />
              Mark Now
            </button>
          </div>
        </div>
      ) : (
        <div className="mb-3 text-center">
          <div className="bg-green-500/10 border border-green-500/20 rounded p-2">
            <div className="flex items-center justify-center gap-1">
              <FaCheckCircle className="text-green-400 text-xs" />
              <span className="text-green-300 text-xs">Today Complete!</span>
              {todayActivities.includes('mining_started') && (
                <span className="text-xs">⛏️</span>
              )}
            </div>
          </div>
        </div>
      )} */}

      {/* Compact Header */}
      <div className="flex items-center justify-between mb-2 px-1">
        <button
          onClick={handlePrev}
          className="text-violet-400 hover:text-violet-300 p-1 rounded group"
        >
          <FaChevronLeft className="text-xs group-hover:-translate-x-0.5 transition-transform" />
        </button>
        <div className="text-violet-300 text-xs font-bold flex items-center gap-1">
          <FaCalendarCheck className="text-xs" />
          {currentMonth.format("MMM YYYY")}
        </div>
        <button
          onClick={handleNext}
          className="text-violet-400 hover:text-violet-300 p-1 rounded group"
        >
          <FaChevronRight className="text-xs group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      {/* Weekday Headers */}
      <div className="grid grid-cols-7 gap-0.5 text-[9px] text-violet-300/80 mb-1 text-center font-medium">
        {weekDays.map((day) => (
          <div key={day} className="py-0.5">{day}</div>
        ))}
      </div>

      {/* Compact Calendar Grid */}
      <div className="grid grid-cols-7 gap-0.5 flex-1 mb-2">
        {calendarDays.map((day) => {
          const dateStr = day.format("YYYY-MM-DD");
          const dayData = streakData[dateStr];
          const isCompleted = dayData?.completed || false;
          const dayActivities = dayData?.activities || [];
          const isToday = day.isSame(today, "day");
          const isCurrentMonth = day.month() === currentMonth.month();
          const isPastDate = day.isBefore(today, "day");
          const isFutureDate = day.isAfter(today, "day");

          return (
            <div
              key={dateStr}
              className={`
                aspect-square flex items-center justify-center text-[8px] font-medium rounded transition-all duration-200 cursor-pointer relative overflow-hidden
                ${isCompleted
                  ? "bg-gradient-to-br from-violet-500 to-purple-600 text-white shadow-sm"
                  : isPastDate
                  ? "bg-gray-800/50 text-gray-500"
                  : isFutureDate
                  ? "bg-slate-700/30 text-slate-500"
                  : "bg-slate-800/70 text-slate-300 hover:bg-slate-700/70"
                }
                ${isToday ? "ring-1 ring-orange-400" : ""}
                ${!isCurrentMonth ? "opacity-30" : ""}
                ${hoveredDate === dateStr ? "scale-105 z-10" : ""}
              `}
              onMouseEnter={() => setHoveredDate(dateStr)}
              onMouseLeave={() => setHoveredDate(null)}
            >
              <span className="relative z-10">{day.date()}</span>
              
              {/* Tiny completion indicators */}
              {isCompleted && (
                <>
                  <div className="absolute top-0 right-0 w-1 h-1 bg-green-400 rounded-full"></div>
                  {dayActivities.includes('mining_started') && (
                    <div className="absolute top-0 left-0 text-[6px]">⛏</div>
                  )}
                </>
              )}

              {isToday && !isCompleted && (
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-0.5 bg-orange-400 rounded"></div>
              )}
            </div>
          );
        })}
      </div>

      {/* Compact Progress Bar */}
      <div className="w-full">
        <div className="flex justify-between items-center mb-1">
          <span className="text-[10px] text-violet-300">Progress</span>
          <span className="text-[10px] text-violet-400 font-medium">
            {monthlyCompletedDays}/{currentMonth.daysInMonth()}
          </span>
        </div>
        <div className="w-full bg-slate-800 rounded-full h-1 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-violet-500 to-purple-600 rounded-full transition-all duration-1000"
            style={{ width: `${monthlyProgress}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default StreakGrid;
