import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import { 
  FaChevronLeft, 
  FaChevronRight, 
  FaFire, 
  FaCheckCircle,
  FaPlus,
  FaTrophy,
  FaAdn 
} from "react-icons/fa";
import { useAuth } from './Services/AuthContext';
import { getStreakData, markTodayComplete, getStreakStats, getCurrentStreakFromData } from './Services/streakService';

const weekDays = ["S", "M", "T", "W", "T", "F", "S"];

const StreakGrid = () => {
  const { currentUser, userProfile } = useAuth();
  const [currentMonth, setCurrentMonth] = useState(dayjs());
  const [streakData, setStreakData] = useState({});
  const [streakStats, setStreakStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const today = dayjs();

  useEffect(() => {
    if (!currentUser) {
      setLoading(false);
      return;
    }

    const loadStreakData = async () => {
      try {
        setLoading(true);
        const [dataResult, statsResult] = await Promise.all([
          getStreakData(currentUser.uid, currentMonth.year(), currentMonth.month() + 1),
          getStreakStats(currentUser.uid)
        ]);

        if (dataResult.success) {
          setStreakData(dataResult.streakData);
        }

        if (statsResult.success) {
          setStreakStats(statsResult.stats);
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

  const getCurrentStreak = () => {
    if (streakStats?.currentStreak !== undefined) {
      return streakStats.currentStreak;
    }
    if (userProfile?.stats?.currentStreak !== undefined) {
      return userProfile.stats.currentStreak;
    }
    return getCurrentStreakFromData(streakData);
  };

  const currentStreak = getCurrentStreak();
  const longestStreak = streakStats?.longestStreak || 0;

  const handleMarkComplete = async () => {
    if (!currentUser) return;
    try {
      await markTodayComplete(currentUser.uid, ['manual_completion']);
      
      const [updatedDataResult, updatedStatsResult] = await Promise.all([
        getStreakData(currentUser.uid, currentMonth.year(), currentMonth.month() + 1),
        getStreakStats(currentUser.uid)
      ]);

      if (updatedDataResult.success) {
        setStreakData(updatedDataResult.streakData);
      }
      if (updatedStatsResult.success) {
        setStreakStats(updatedStatsResult.stats);
      }
    } catch (error) {
      console.error('Error marking day complete:', error);
    }
  };

  const firstDayOfMonth = currentMonth.startOf("month");
  const startOfWeek = firstDayOfMonth.startOf("week");
  const calendarDays = Array.from({ length: 42 }, (_, i) => startOfWeek.add(i, "day"));

  const handlePrev = () => setCurrentMonth(currentMonth.subtract(1, "month"));
  const handleNext = () => setCurrentMonth(currentMonth.add(1, "month"));

  const todayCompleted = streakData[today.format("YYYY-MM-DD")]?.completed || false;

  if (!currentUser) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-violet-300 text-sm">Please log in to view your streak</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-400 mb-3"></div>
        <p className="text-violet-300 text-sm">Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Compact Header - fits in 350px container */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <FaFire className="text-orange-400 text-lg" />
          <h2 className="text-lg font-bold text-white">Streak</h2>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <div className="text-orange-400 font-bold">{currentStreak}</div>
          <div className="text-violet-400">/</div>
          <div className="text-yellow-400">{longestStreak}</div>
        </div>
      </div>

      {/* Month Navigation */}
      <div className="flex items-center justify-between mb-3">
        <button
          onClick={handlePrev}
          className="p-1.5 rounded-lg bg-violet-600/30 hover:bg-violet-600/50 transition-colors"
        >
          <FaChevronLeft className="text-violet-300 text-sm" />
        </button>
        
        <span className="text-white font-medium text-sm">
          {currentMonth.format("MMM YYYY")}
        </span>
        
        <button
          onClick={handleNext}
          className="p-1.5 rounded-lg bg-violet-600/30 hover:bg-violet-600/50 transition-colors"
        >
          <FaChevronRight className="text-violet-300 text-sm" />
        </button>
      </div>

      {/* Today Status & Mark Complete */}
      <div className="flex items-center justify-between mb-3">
        <div className="text-xs text-violet-400">
          Today: {todayCompleted ? 'Completed' : 'Pending'}
        </div>
        <button
          onClick={handleMarkComplete}
          disabled={todayCompleted}
          className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
            todayCompleted
              ? 'bg-green-500/20 text-green-300 cursor-not-allowed'
              : 'bg-orange-500/20 hover:bg-orange-500/40 text-orange-300'
          }`}
        >
          {todayCompleted ? <FaCheckCircle className="inline" /> : <FaPlus className="inline" />}
        </button>
      </div>

      {/* Weekday Headers */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekDays.map((day, index) => (
          <div
            key={index}
            className="text-center text-xs font-medium text-violet-400 py-1"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid - Compact for 350px height */}
      <div className="grid grid-cols-7 gap-1 flex-1">
        {calendarDays.map((date) => {
          const dateStr = date.format("YYYY-MM-DD");
          const dayData = streakData[dateStr];
          const isCompleted = dayData?.completed || false;
          const isToday = date.isSame(today, "day");
          const isCurrentMonth = date.month() === currentMonth.month();

          return (
            <div
              key={dateStr}
              className={`
                h-8 flex items-center justify-center rounded-md text-xs font-medium
                transition-all duration-200 border
                ${isCurrentMonth 
                  ? isCompleted
                    ? 'bg-orange-400/30 border-orange-500/50 text-orange-200'
                    : 'bg-slate-700/50 border-slate-600/50 text-slate-300'
                  : 'bg-transparent border-transparent text-slate-600'
                }
                ${isToday ? 'ring-2 ring-orange-400/60' : ''}
              `}
            >
              {date.date()}
              
              {/* Today indicator */}
              {isToday && (
                <div className="absolute w-1 h-1 bg-orange-400 rounded-full -mt-6 ml-6"></div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer Note */}
      <div className="mt-2 text-center">
        <p className="text-xs text-violet-500">
          ✨ Auto-tracked with mining
        </p>
      </div>
    </div>
  );
};

export default StreakGrid;
