import React, { useState, useEffect } from "react";
import { useAuth } from './Services/AuthContext';
import { getUserBadges } from './Services/badgeService';
import { 
  FaRocket, 
  FaFire, 
  FaHeart, 
  FaGem, 
  FaCog, 
  FaCrown,
  FaTrophy,
  FaStar,
  FaMedal,
  FaAward
} from "react-icons/fa";

// Badge icon mapping
const getBadgeIcon = (iconName, isEarned) => {
  const iconProps = {
    className: `text-3xl ${isEarned ? 'text-yellow-400' : 'text-gray-500'}`,
    size: 32
  };
  
  switch (iconName) {
    case 'FaRocket':
      return <FaRocket {...iconProps} />;
    case 'FaFire':
      return <FaFire {...iconProps} />;
    case 'FaHeart':
      return <FaHeart {...iconProps} />;
    case 'FaGem':
      return <FaGem {...iconProps} />;
    case 'FaCog':
      return <FaCog {...iconProps} />;
    case 'FaCrown':
      return <FaCrown {...iconProps} />;
    case 'FaTrophy':
      return <FaTrophy {...iconProps} />;
    case 'FaStar':
      return <FaStar {...iconProps} />;
    default:
      return <FaTrophy {...iconProps} />;
  }
};

// Enhanced No Achievements Component
const NoAchievementsState = () => {
  return (
    <div className="flex flex-1 items-center justify-center min-h-[300px]">
      <div className="text-center px-6 py-2 max-w-md mx-auto">
        {/* Animated Icon Stack */}
        <div className="relative mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="animate-bounce delay-0">
              <FaTrophy className="text-5xl text-gray-600" />
            </div>
            <div className="animate-bounce delay-100">
              <FaMedal className="text-4xl text-gray-500" />
            </div>
            <div className="animate-bounce delay-200">
              <FaAward className="text-5xl text-gray-600" />
            </div>
          </div>
          
          {/* Floating Emojis */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-4 animate-float delay-0">
              <span className="text-2xl opacity-60">🏆</span>
            </div>
            <div className="absolute top-2 right-4 animate-float delay-300">
              <span className="text-xl opacity-50">⭐</span>
            </div>
            <div className="absolute bottom-0 left-8 animate-float delay-500">
              <span className="text-lg opacity-40">🎯</span>
            </div>
            <div className="absolute bottom-2 right-8 animate-float delay-700">
              <span className="text-xl opacity-45">💎</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-0">
          <h3 className="text-xl font-bold text-gray-300 mb-3">
            No Achievements Yet
          </h3>
          <p className="text-gray-400 text-base leading-relaxed mb-6 pb-2 ">
            Start your journey to earn amazing badges and achievements!
          </p>
          
          {/* Achievement Examples */}
          {/* <div className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 rounded-xl p-4 border border-purple-500/20">
            <p className="text-sm text-gray-300 mb-3 font-medium">Complete tasks like:</p>
            <div className="flex flex-wrap gap-2 justify-center">
              <span className="bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full text-xs border border-purple-500/30">
                🚀 First Launch
              </span>
              <span className="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full text-xs border border-blue-500/30">
                🔥 Daily Streak
              </span>
              <span className="bg-green-500/20 text-green-300 px-3 py-1 rounded-full text-xs border border-green-500/30">
                💎 Milestone Reached
              </span>
            </div>
          </div> */}
          
          {/* Call to Action */}
          <div className="mt-2 pb-5">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600/20 to-blue-600/20 text-purple-300 px-4 py-2 rounded-lg border border-purple-500/30">
              <FaStar className="text-sm animate-pulse" />
              <span className="text-sm font-medium">Complete challenges to unlock badges!</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function Achievements() {
  const { currentUser } = useAuth();
  const [badges, setBadges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!currentUser) {
      setLoading(false);
      return;
    }

    const loadBadges = async () => {
      try {
        setLoading(true);
        const result = await getUserBadges(currentUser.uid);
        
        if (result.success) {
          setBadges(result.badges);
        } else {
          setError(result.error);
        }
      } catch (err) {
        console.error('Error loading badges:', err);
        setError('Failed to load achievements');
      } finally {
        setLoading(false);
      }
    };

    loadBadges();
  }, [currentUser]);

  // Enhanced Loading State
  if (loading) {
    return (
      <div className="w-full flex flex-col">
        <div className="flex items-center justify-center py-16 min-h-[300px]">
          <div className="text-center">
            <div className="relative mb-6">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500/30 border-t-purple-400 mx-auto"></div>
              <div className="absolute inset-0 animate-ping rounded-full h-12 w-12 border-2 border-purple-400/20"></div>
            </div>
            <div className="space-y-2">
              <p className="text-gray-300 font-medium">Loading achievements...</p>
              <p className="text-gray-500 text-sm animate-pulse">Fetching your progress</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Enhanced Error State
  if (error) {
    return (
      <div className="w-full flex flex-col">
        <div className="flex items-center justify-center py-16 min-h-[300px]">
          <div className="text-center max-w-md mx-auto px-6">
            <div className="mb-6">
              <div className="w-16 h-16 mx-auto bg-red-500/20 rounded-full flex items-center justify-center border border-red-500/30">
                <span className="text-2xl">❌</span>
              </div>
            </div>
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-red-400">Unable to Load Achievements</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{error}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="mt-4 bg-red-500/20 hover:bg-red-500/30 text-red-300 px-4 py-2 rounded-lg text-sm font-medium transition-colors border border-red-500/30"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main Component Render
  return (
    <div className="w-full flex flex-col">
      {/* Header Section */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
              <FaTrophy className="text-white text-sm" />
            </div>
            <h2 className="text-xl font-bold text-white">Achievements</h2>
          </div>
          {badges.length > 0 && (
            <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 border border-purple-500/30 rounded-lg px-4 py-2">
              <span className="text-gray-400 text-sm">Progress: </span>
              <span className="text-purple-400 font-semibold">
                {badges.filter(b => b.isEarned).length}/{badges.length}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1">
        {badges.length === 0 ? (
          <NoAchievementsState />
        ) : (
          <div className="flex overflow-x-auto space-x-6 px-2 pb-4 scrollbar-hide">
            {badges.map((badge) => (
              <div
                key={badge.id || badge.badgeId}
                className={`min-w-[240px] max-w-[260px] border rounded-xl p-5 flex flex-col justify-between shadow-lg flex-shrink-0 transition-all duration-300 hover:scale-105 hover:shadow-xl ${
                  badge.isEarned
                    ? 'bg-gradient-to-br from-[#2a2a3c] via-[#2d2d40] to-[#3a3a4c] border-yellow-500/40 hover:shadow-yellow-500/25'
                    : 'bg-gradient-to-br from-[#1a1a2c] to-[#1d1d30] border-gray-600/50 opacity-75 hover:opacity-90'
                }`}
                style={{ minHeight: '220px' }}
              >
                {/* Header with Icon and Status */}
                <div className="flex items-start justify-between mb-4">
                  <div className={`flex items-center justify-center w-14 h-14 rounded-xl transition-all duration-300 ${
                    badge.isEarned 
                      ? 'bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border border-yellow-500/30' 
                      : 'bg-gradient-to-br from-purple-600/10 to-blue-600/10 border border-gray-600/30'
                  }`}>
                    {getBadgeIcon(badge.icon, badge.isEarned)}
                  </div>
                  
                  {badge.isEarned && (
                    <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-400 text-xs px-3 py-1.5 rounded-full border border-green-500/40 font-medium">
                      <span className="mr-1">✓</span>
                      Earned
                    </div>
                  )}
                </div>

                {/* Badge Content */}
                <div className="flex-1 space-y-3">
                  <div>
                    <h3 className={`text-lg font-bold mb-2 line-clamp-2 ${
                      badge.isEarned ? 'text-white' : 'text-gray-400'
                    }`}>
                      {badge.name}
                    </h3>
                    <p className={`text-sm leading-relaxed line-clamp-3 ${
                      badge.isEarned ? 'text-gray-300' : 'text-gray-500'
                    }`}>
                      {badge.description}
                    </p>
                  </div>
                  
                  {/* Enhanced Progress Section */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-medium text-gray-400">Progress</span>
                      <span className={`text-xs font-semibold ${
                        badge.isEarned ? 'text-green-400' : 'text-gray-400'
                      }`}>
                        {badge.tasks ? badge.tasks.filter(t => t.completed).length : 0}/
                        {badge.tasks ? badge.tasks.length : 0}
                      </span>
                    </div>
                    <div className="relative">
                      <div className="w-full bg-gray-700/50 rounded-full h-2.5 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-700 ease-out ${
                            badge.isEarned 
                              ? 'bg-gradient-to-r from-green-400 via-emerald-500 to-green-600' 
                              : 'bg-gradient-to-r from-purple-500 via-blue-500 to-purple-600'
                          }`}
                          style={{
                            width: `${badge.progress || 0}%`
                          }}
                        ></div>
                      </div>
                      {badge.isEarned && (
                        <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-emerald-500/20 rounded-full animate-pulse"></div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Footer with Earned Date */}
                {badge.isEarned && badge.earnedAt && (
                  <div className="mt-4 pt-3 border-t border-gray-600/30">
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span className="text-yellow-400">🗓️</span>
                      <span>Earned: {new Date(badge.earnedAt.seconds * 1000).toLocaleDateString()}</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-10px) rotate(1deg); }
          66% { transform: translateY(5px) rotate(-1deg); }
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        
        .delay-0 { animation-delay: 0ms; }
        .delay-100 { animation-delay: 100ms; }
        .delay-200 { animation-delay: 200ms; }
        .delay-300 { animation-delay: 300ms; }
        .delay-500 { animation-delay: 500ms; }
        .delay-700 { animation-delay: 700ms; }
      `}</style>
    </div>
  );
}