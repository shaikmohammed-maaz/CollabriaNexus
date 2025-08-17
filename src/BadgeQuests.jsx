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
import { useAuth } from './Services/AuthContext';
import { subscribeToBadgeQuests, updateBadgeTask } from './Services/badgeService';

// Icon mapping helper
const getIconComponent = (iconName) => {
  const iconMap = {
    'FaRocket': FaRocket,
    'FaFire': FaFire,
    'FaHeart': FaHeart,
    'FaGem': FaGem,
    'FaCog': FaCog,
    'FaCrown': FaCrown,
    'FaTrophy': FaTrophy,
    'FaMedal': FaMedal
  };
  return iconMap[iconName] || FaTrophy;
};

const BadgeQuests = () => {
  const { currentUser } = useAuth();
  const [currentBadgeIndex, setCurrentBadgeIndex] = useState(0);
  const [badges, setBadges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Subscribe to real-time badge updates
  useEffect(() => {
    if (!currentUser) {
      setLoading(false);
      return;
    }

    const unsubscribe = subscribeToBadgeQuests(currentUser.uid, (updatedBadges) => {
      setBadges(updatedBadges);
      setLoading(false);
    });

    return unsubscribe;
  }, [currentUser]);

  // Handle task completion (for manual testing - you can remove this)
  const handleTaskToggle = async (taskId) => {
    if (!currentUser || badges.length === 0) return;

    const currentBadge = badges[currentBadgeIndex];
    const task = currentBadge.tasks.find(t => t.id === taskId);
    
    try {
      const result = await updateBadgeTask(
        currentUser.uid, 
        currentBadge.badgeId, 
        taskId, 
        !task.completed
      );
      
      if (result.success && result.badgeEarned) {
        // Badge was just earned - could show special animation here
        console.log(`🎉 Badge "${currentBadge.name}" earned!`);
      }
    } catch (error) {
      console.error('Error toggling task:', error);
    }
  };

  // Show loading state
  if (!currentUser) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-gray-400">Please log in to view badge quests</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-400 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading badge quests...</p>
        </div>
      </div>
    );
  }

  if (badges.length === 0) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <FaTrophy className="text-4xl text-gray-500 mx-auto mb-4" />
          <p className="text-gray-400">No badge quests available</p>
        </div>
      </div>
    );
  }

  const currentBadge = badges[currentBadgeIndex];
  const completedTasks = currentBadge.tasks.filter(task => task.completed).length;
  const progress = (completedTasks / currentBadge.tasks.length) * 100;
  const isCompleted = progress === 100;

  // Get the icon component
  const IconComponent = getIconComponent(currentBadge.icon);

  return (
    <div className="h-full flex flex-col">
      {/* Error Display */}
      {error && (
        <div className="mb-4 bg-red-500/20 border border-red-500 text-red-300 px-3 py-2 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Badge Header */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-3">
          <button 
            onClick={() => setCurrentBadgeIndex((prev) => (prev - 1 + badges.length) % badges.length)}
            className="p-2 bg-slate-700/50 hover:bg-slate-700/70 rounded-lg text-slate-400 hover:text-white transition-all duration-200"
          >
            <FaChevronLeft className="text-sm" />
          </button>

          <div className="text-center">
            <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-r ${currentBadge.bgGradient} border ${currentBadge.borderColor} mb-2`}>
              <IconComponent className={`text-2xl ${currentBadge.color}`} />
            </div>
            <h3 className="font-bold text-white text-sm">{currentBadge.name}</h3>
            <p className="text-xs text-slate-400">{currentBadge.description}</p>
          </div>

          <button 
            onClick={() => setCurrentBadgeIndex((prev) => (prev + 1) % badges.length)}
            className="p-2 bg-slate-700/50 hover:bg-slate-700/70 rounded-lg text-slate-400 hover:text-white transition-all duration-200"
          >
            <FaChevronRight className="text-sm" />
          </button>
        </div>

        {/* Progress */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className={`text-xl font-bold ${currentBadge.color}`}>{completedTasks}</span>
            <span className="text-slate-400 text-sm">/ {currentBadge.tasks.length}</span>
          </div>
          <div className={`flex items-center gap-2 px-2 py-1 rounded-full ${
            isCompleted 
              ? 'bg-green-500/20 border border-green-500/30' 
              : `bg-gradient-to-r ${currentBadge.bgGradient} border ${currentBadge.borderColor}`
          }`}>
            {isCompleted ? (
              <>
                <FaCheckCircle className="text-green-400 text-xs" />
                <span className="text-green-400 font-semibold text-xs">EARNED!</span>
              </>
            ) : (
              <>
                <FaTrophy className={`${currentBadge.color} text-xs`} />
                <span className={`${currentBadge.color} font-semibold text-xs`}>{Math.round(progress)}%</span>
              </>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-700/50 rounded-full h-2 mb-2">
          <div 
            className={`bg-gradient-to-r ${currentBadge.bgGradient.replace('/20', '')} h-2 rounded-full transition-all duration-500 relative overflow-hidden`}
            style={{ width: `${progress}%` }}
          >
            <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
          </div>
        </div>

        {/* Badge Navigation Dots */}
        <div className="flex items-center justify-center">
          <div className="flex gap-1">
            {badges.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentBadgeIndex(index)}
                className={`w-2 h-2 rounded-full transition-all duration-200 ${
                  index === currentBadgeIndex 
                    ? currentBadge.color.replace('text-', 'bg-') 
                    : 'bg-slate-600 hover:bg-slate-500'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Tasks List */}
      <div className="flex-1 overflow-y-auto space-y-2">
        {currentBadge.tasks.map((task) => (
          <div
            key={task.id}
            className={`group flex items-center gap-3 p-3 rounded-lg border transition-all duration-200 cursor-pointer ${
              task.completed
                ? `bg-gradient-to-r ${currentBadge.bgGradient} ${currentBadge.borderColor}`
                : "bg-slate-700/30 border-slate-600/40 hover:bg-slate-700/50"
            }`}
            onClick={() => handleTaskToggle(task.id)} // Remove this if you don't want manual task toggling
          >
            <div className="flex-shrink-0">
              {task.completed ? (
                <FaCheckCircle className={`${currentBadge.color} text-lg transition-transform group-hover:scale-110`} />
              ) : (
                <FaCircle className="text-slate-500 text-lg transition-transform group-hover:scale-110" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className={`text-sm transition-all duration-200 ${
                task.completed 
                  ? `text-slate-300 ${currentBadge.color}` 
                  : "text-white group-hover:text-violet-300"
              }`}>
                {task.text}
              </p>
              {task.completedAt && (
                <p className="text-xs text-slate-500 mt-1">
                  Completed: {new Date(task.completedAt.seconds * 1000).toLocaleDateString()}
                </p>
              )}
            </div>
            {task.completed && (
              <div className="px-2 py-1 bg-white/10 rounded-full">
                <span className="text-white text-xs font-medium">✓</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Badge Status */}
      <div className="mt-3 text-center">
        {isCompleted ? (
          <div className="inline-flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-green-600/20 to-emerald-600/20 border border-green-500/30 rounded-lg">
            <FaMedal className="text-green-400" />
            <span className="text-green-400 font-medium text-sm">Badge Earned!</span>
            {currentBadge.earnedAt && (
              <span className="text-green-300 text-xs">
                • {new Date(currentBadge.earnedAt.seconds * 1000).toLocaleDateString()}
              </span>
            )}
          </div>
        ) : (
          <p className="text-slate-400 text-xs">
            Complete all tasks to earn this badge
          </p>
        )}
      </div>
    </div>
  );
};

export default BadgeQuests;
