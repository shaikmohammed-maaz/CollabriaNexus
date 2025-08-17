import React, { useState, useEffect } from "react";
import NoAchievements from "./assets/NoAchievements.png";
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
  FaStar
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

  // Show loading state
  if (loading) {
    return (
      <div className="w-full flex flex-col">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400 mx-auto mb-4"></div>
            <p className="text-gray-400">Loading achievements...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="w-full flex flex-col">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <p className="text-red-400 mb-2">Failed to load achievements</p>
            <p className="text-gray-500 text-sm">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  // Show achievements/badges
  return (
    <div className="w-full flex flex-col">
      <div className="flex overflow-x-auto space-x-6 px-2 pb-2 scrollbar-hide">
        {badges.length === 0 ? (
          <div className="flex flex-1 items-center justify-center">
            <div className="text-center py-8">
              <img
                src={NoAchievements}
                alt="No Achievements"
                className="w-[200px] h-[200px] object-contain mx-auto mb-4 opacity-60"
              />
              <h3 className="text-lg font-semibold text-gray-300 mb-2">No achievements yet</h3>
              <p className="text-gray-500 text-sm">Complete tasks and challenges to earn badges!</p>
            </div>
          </div>
        ) : (
          badges.map((badge) => (
            <div
              key={badge.id || badge.badgeId}
              className={`min-w-[220px] max-w-[240px] h-[200px] border rounded-xl p-4 flex flex-col justify-between shadow-lg flex-shrink-0 transition-all duration-300 hover:scale-105 ${
                badge.isEarned
                  ? 'bg-gradient-to-br from-[#2a2a3c] to-[#3a3a4c] border-yellow-500/30 hover:shadow-yellow-500/20'
                  : 'bg-[#1a1a2c] border-gray-600/50 opacity-70'
              }`}
            >
              {/* Badge Icon */}
              <div className="flex items-center justify-between">
                <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br from-purple-600/20 to-blue-600/20">
                  {getBadgeIcon(badge.icon, badge.isEarned)}
                </div>
                
                {/* Completion Status */}
                {badge.isEarned && (
                  <div className="bg-green-500/20 text-green-400 text-xs px-2 py-1 rounded-full border border-green-500/30">
                    ✓ Earned
                  </div>
                )}
              </div>

              {/* Badge Info */}
              <div className="mt-4">
                <h3 className={`text-md font-semibold mb-2 ${
                  badge.isEarned ? 'text-white' : 'text-gray-400'
                }`}>
                  {badge.name}
                </h3>
                <p className={`text-sm ${
                  badge.isEarned ? 'text-gray-300' : 'text-gray-500'
                }`}>
                  {badge.description}
                </p>
                
                {/* Progress Bar */}
                <div className="mt-3">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-400">Progress</span>
                    <span className={badge.isEarned ? 'text-green-400' : 'text-gray-400'}>
                      {badge.tasks ? badge.tasks.filter(t => t.completed).length : 0}/
                      {badge.tasks ? badge.tasks.length : 0}
                    </span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-500 ${
                        badge.isEarned 
                          ? 'bg-gradient-to-r from-green-400 to-emerald-500' 
                          : 'bg-gradient-to-r from-purple-500 to-blue-500'
                      }`}
                      style={{
                        width: `${badge.progress || 0}%`
                      }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Earned Date */}
              {badge.isEarned && badge.earnedAt && (
                <div className="mt-2 text-xs text-gray-500">
                  Earned: {new Date(badge.earnedAt.seconds * 1000).toLocaleDateString()}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Achievement Summary */}
      {badges.length > 0 && (
        <div className="mt-4 flex justify-center">
          <div className="bg-[#2a2a3c] border border-purple-500/20 rounded-lg px-4 py-2">
            <span className="text-gray-400 text-sm">
              Achievements: </span>
            <span className="text-purple-400 font-semibold">
              {badges.filter(b => b.isEarned).length}/{badges.length}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
