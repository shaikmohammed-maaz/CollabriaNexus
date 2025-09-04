import React, { useState, useEffect } from "react";
import {
  FaRocket,
  FaFire,
  FaHeart,
  FaGem,
  FaCog,
  FaCrown,
  FaCheckCircle,
  FaCircle,
  FaTrophy,
  FaMedal,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import { useAuth } from "./Services/AuthContext";
import {
  subscribeToBadgeQuests,
  validateAndUpdateBadgeProgress,
} from "./Services/badgeService";

// Icon mapping helper
const getIconComponent = (iconName) => {
  const iconMap = {
    FaRocket: FaRocket,
    FaFire: FaFire,
    FaHeart: FaHeart,
    FaGem: FaGem,
    FaCog: FaCog,
    FaCrown: FaCrown,
    FaTrophy: FaTrophy,
    FaMedal: FaMedal,
  };
  return iconMap[iconName] || FaTrophy;
};

const BadgeQuests = () => {
  const { currentUser } = useAuth();
  const [currentBadgeIndex, setCurrentBadgeIndex] = useState(0);
  const [badges, setBadges] = useState([]);
  const [loading, setLoading] = useState(true);

  // Subscribe to real-time badge updates
  useEffect(() => {
    if (!currentUser) {
      setLoading(false);
      return;
    }
    const unsubscribe = subscribeToBadgeQuests(
      currentUser.uid,
      (updatedBadges) => {
        setBadges(updatedBadges);
        setLoading(false);
      }
    );
    return unsubscribe;
  }, [currentUser]);

  // Force validation when component mounts
  useEffect(() => {
    if (currentUser) {
      validateAndUpdateBadgeProgress(currentUser.uid);
    }
  }, [currentUser]);

  // Navigation functions
  const goToPrevious = () => {
    setCurrentBadgeIndex((prev) => (prev === 0 ? badges.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentBadgeIndex((prev) => (prev === badges.length - 1 ? 0 : prev + 1));
  };

  // Show loading state
  if (!currentUser) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-violet-400 text-sm">Please log in to view quests</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400 mb-3"></div>
        <p className="text-violet-400 text-sm">Loading quests...</p>
      </div>
    );
  }

  if (badges.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-violet-400 text-sm">No quests available</p>
      </div>
    );
  }

  const currentBadge = badges[currentBadgeIndex];
  const IconComponent = getIconComponent(currentBadge.icon);

  return (
    <div className="h-full flex flex-col">
      {/* Navigation - Chevrons with Title & Icon */}
      <div className="flex items-center justify-between mb-4 bg-violet-500/10 rounded-xl p-3 border border-violet-500/20">
        <button
          onClick={goToPrevious}
          disabled={badges.length <= 1}
          aria-label="Previous Badge"
          className="p-2 rounded-full bg-violet-600 hover:bg-violet-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-violet-500/25"
        >
          <FaChevronLeft className="text-white text-sm" />
        </button>
        
        <div className="flex-1 text-center px-4">
          <div className="flex items-center justify-center gap-3 mb-1">
            <div className={`text-xl ${currentBadge.color}`}>
              <IconComponent />
            </div>
            <h3 className="text-white font-bold text-lg truncate">
              {badges.length > 0 ? badges[currentBadgeIndex].name : "No Badges"}
            </h3>
            {currentBadge.isEarned && (
              <FaTrophy className="text-lg text-yellow-400 flex-shrink-0" />
            )}
          </div>
          <p className="text-violet-400 text-xs">
            {currentBadgeIndex + 1} of {badges.length}
          </p>
        </div>
        
        <button
          onClick={goToNext}
          disabled={badges.length <= 1}
          aria-label="Next Badge"
          className="p-2 rounded-full bg-violet-600 hover:bg-violet-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-violet-500/25"
        >
          <FaChevronRight className="text-white text-sm" />
        </button>
      </div>

      {/* Badge Card - Compact Version (REMOVED DUPLICATE HEADER) */}
      <div className="flex-1 flex flex-col">
        

        {/* Progress Bar */}
        <div className="mb-3">
          <div className="flex justify-between text-xs text-gray-400 mb-1">
            <span>Progress</span>
            <span>{Math.round(currentBadge.progress)}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-1.5">
            <div
              className="bg-gradient-to-r from-violet-500 to-purple-500 h-1.5 rounded-full transition-all duration-300"
              style={{ width: `${currentBadge.progress}%` }}
            ></div>
          </div>
        </div>

        {/* Tasks - Scrollable */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-2">
          {currentBadge.tasks.map((task) => (
            <div
              key={task.id}
              className={`flex items-center gap-2 p-2 rounded-lg transition-all duration-200 ${
                task.completed
                  ? "bg-green-500/10 border border-green-500/20"
                  : "bg-gray-700/30 border border-gray-600/30"
              }`}
            >
              <div
                className={`text-sm flex-shrink-0 ${
                  task.completed ? "text-green-400" : "text-gray-500"
                }`}
              >
                {task.completed ? <FaCheckCircle /> : <FaCircle />}
              </div>
              <div className="flex-1 min-w-0">
                <p
                  className={`text-xs font-medium truncate ${
                    task.completed ? "text-green-300" : "text-gray-300"
                  }`}
                >
                  {task.text}
                </p>
                {task.completed && task.completedAt && (
                  <p className="text-xs text-gray-500 mt-0.5">
                    ✅{" "}
                    {new Date(
                      task.completedAt.seconds
                        ? task.completedAt.seconds * 1000
                        : task.completedAt
                    ).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Badge Status */}
        <div className="mt-3 text-center">
          {currentBadge.isEarned ? (
            <div className="flex items-center justify-center gap-2 text-yellow-400">
              <FaTrophy className="text-sm" />
              <span className="text-xs font-semibold">Badge Earned! 🎉</span>
            </div>
          ) : (
            <p className="text-gray-500 text-xs">
              Complete all tasks to earn this badge
            </p>
          )}
        </div>

        {/* Auto-update Notice */}
        <div className="mt-2 text-center">
          <p className="text-xs text-violet-500">✨ Updates automatically</p>
        </div>
      </div>
    </div>
  );
};

export default BadgeQuests;
