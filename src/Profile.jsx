import React, { useState, useEffect } from "react";
import {
  FaCoins,
  FaUserFriends,
  FaCircle,
  FaShareAlt,
  FaBackward,
  FaStar,
  FaTrophy,
  FaMedal,
  FaFire,
  FaGem,
  FaChevronRight,
  FaClock,
  FaCheckCircle,
  FaEdit,
  FaCamera,
  FaChartLine,
  FaRocket,
  FaHeart,
  FaCog,
  FaCalendarAlt,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useAuth } from './Services/AuthContext';
import { subscribeToUserActivities } from './Services/activityService';
import { subscribeToBadges } from './Services/badgeService';
import { logout as authLogout } from './Services/authService';

// Icon mapping for activities
const getActivityIcon = (iconName) => {
  const iconMap = {
    'FaCoins': FaCoins,
    'FaUserFriends': FaUserFriends,
    'FaTrophy': FaTrophy,
    'FaRocket': FaRocket,
    'FaStar': FaStar,
    'FaFire': FaFire,
    'FaGem': FaGem,
    'FaCog': FaCog
  };
  return iconMap[iconName] || FaClock;
};

export default function Profile() {
  const navigate = useNavigate();
  const { currentUser, userProfile, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [recentActivities, setRecentActivities] = useState([]);
  const [badges, setBadges] = useState([]);
  const [loading, setLoading] = useState(true);

  // Subscribe to real-time data
  useEffect(() => {
    if (!currentUser) {
      setLoading(false);
      return;
    }

    let unsubscribeActivities, unsubscribeBadges;

    const loadProfileData = async () => {
      try {
        // Subscribe to activities
        unsubscribeActivities = subscribeToUserActivities(currentUser.uid, (activities) => {
          setRecentActivities(activities);
        });

        // Subscribe to badges
        unsubscribeBadges = subscribeToBadges(currentUser.uid, (userBadges) => {
          setBadges(userBadges);
        });

        setLoading(false);
      } catch (error) {
        console.error('Error loading profile data:', error);
        setLoading(false);
      }
    };

    loadProfileData();

    return () => {
      if (unsubscribeActivities) unsubscribeActivities();
      if (unsubscribeBadges) unsubscribeBadges();
    };
  }, [currentUser]);

  // Wait for userProfile to load
  useEffect(() => {
    if (userProfile) {
      setLoading(false);
    }
  }, [userProfile]);

  // ENHANCED Safe property access with more robust checking
  const stats = React.useMemo(() => {
    if (!userProfile || !userProfile.stats) {
      return {
        totalCoinsEarned: 0,
        level: 1,
        currentTier: 'Bronze Miner',
        nextTier: 'Silver Miner',
        tierProgress: 0,
        currentStreak: 0,
        totalMined: 0,
        rank: '#0',
        isVip: false
      };
    }
    
    return {
      totalCoinsEarned: userProfile.stats.totalCoinsEarned ?? 0,
      level: userProfile.stats.level ?? 1,
      currentTier: userProfile.stats.currentTier ?? 'Bronze Miner',
      nextTier: userProfile.stats.nextTier ?? 'Silver Miner',
      tierProgress: userProfile.stats.tierProgress ?? 0,
      currentStreak: userProfile.stats.currentStreak ?? 0,
      totalMined: userProfile.stats.totalMined ?? 0,
      rank: userProfile.stats.rank ?? '#0',
      isVip: userProfile.stats.isVip ?? false
    };
  }, [userProfile]);

  const profile = React.useMemo(() => {
    if (!userProfile || !userProfile.profile) {
      return {
        username: "User",
        name: "User", 
        email: "",
        avatar: "",
        referralCode: "",
        joined: new Date(),
        lastActive: new Date()
      };
    }

    return {
      username: userProfile.profile.username ?? "User",
      name: userProfile.profile.name ?? userProfile.profile.username ?? "User",
      email: userProfile.profile.email ?? "",
      avatar: userProfile.profile.avatar ?? "",
      referralCode: userProfile.profile.referralCode ?? "",
      joined: userProfile.profile.joined ?? new Date(),
      lastActive: userProfile.profile.lastActive ?? new Date()
    };
  }, [userProfile]);

  const social = React.useMemo(() => {
    if (!userProfile || !userProfile.social) {
      return { totalReferrals: 0 };
    }
    return {
      totalReferrals: userProfile.social.totalReferrals ?? 0
    };
  }, [userProfile]);

  const mining = React.useMemo(() => {
    if (!userProfile || !userProfile.mining) {
      return {
        isMining: false,
        totalMiningSessions: 0
      };
    }
    return {
      isMining: userProfile.mining.isMining ?? false,
      totalMiningSessions: userProfile.mining.totalMiningSessions ?? 0
    };
  }, [userProfile]);

  // DEBUG LOGGING - Remove this after fixing

  // Show loading state
  if (!currentUser) {
    return (
      <div className="min-h-screen pt-20 bg-gradient-to-br from-slate-900 via-violet-900/40 to-slate-900 text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">Please log in to view profile</p>
          <button 
            onClick={() => navigate("/login")}
            className="px-4 py-2 bg-violet-600 hover:bg-violet-500 rounded-lg"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  if (loading || !userProfile) {
    return (
      <div className="min-h-screen pt-20 bg-gradient-to-br from-slate-900 via-violet-900/40 to-slate-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-400 mx-auto mb-4"></div>
          <p className="text-slate-300 text-lg">Loading profile...</p>
          <p className="text-slate-500 text-sm mt-2">
            {!userProfile ? 'Fetching user data...' : 'Loading profile data...'}
          </p>
        </div>
      </div>
    );
  }

  const handleShare = () => {
    if (!profile.referralCode) {
      alert('Referral code not available yet. Please try again in a moment.');
      return;
    }
    const shareText = `Join CollabriaNexus with my code: ${profile.referralCode}`;
    navigator.clipboard.writeText(shareText);
    alert("Referral code copied! 🚀");
  };

  const handleLogout = async () => {
    try {
      await authLogout()();
      navigate("/login");
    } catch (error) {
      console.error('Error logging out:', error);
      alert('Failed to logout. Please try again.');
    }
  };

  const getUserAvatar = () => {
    if (profile.avatar) {
      return profile.avatar;
    }
    return `https://api.dicebear.com/7.x/initials/svg?seed=${profile.username}&backgroundColor=6366f1&fontSize=40`;
  };

  const formatJoinDate = (date) => {
    if (date?.seconds) {
      return new Date(date.seconds * 1000).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      });
    }
    return new Date(date).toLocaleDateString("en-US", {
      month: "long", 
      year: "numeric",
    });
  };

  const formatActivityTime = (timestamp) => {
    if (timestamp?.seconds) {
      const date = new Date(timestamp.seconds * 1000);
      const now = new Date();
      const diffMs = now - date;
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);
      
      if (diffMins < 1) return "Just now";
      if (diffMins < 60) return `${diffMins} mins ago`;
      if (diffHours < 24) return `${diffHours} hours ago`;
      return `${diffDays} days ago`;
    }
    return "Recently";
  };

  const TabButton = ({ id, label, isActive, onClick }) => (
    <button
      onClick={() => onClick(id)}
      className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
        isActive
          ? "bg-violet-600 text-white shadow-lg"
          : "text-slate-400 hover:text-violet-300 hover:bg-slate-700/50"
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="min-h-screen pt-20 bg-gradient-to-br from-slate-900 via-violet-900/40 to-slate-900 text-white relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-violet-500/5 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>


      {/* Header with navigation */}
      <div className="relative z-10 px-6 py-6">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800/60 backdrop-blur-sm rounded-xl border border-violet-500/30 text-violet-300 hover:text-white hover:bg-slate-800/80 transition-all duration-200"
          >
            <FaBackward className="text-sm" />
            Back to Dashboard
          </button>

          <button
            onClick={() => setSettingsOpen(!settingsOpen)}
            className="p-2 bg-slate-800/60 backdrop-blur-sm rounded-xl border border-violet-500/30 text-violet-300 hover:text-white hover:bg-slate-800/80 transition-all duration-200 relative"
          >
            <FaCog className="text-lg" />
          </button>
          {settingsOpen && (
            <div className="absolute right-6 top-16 bg-slate-900 border border-violet-500/30 rounded-xl shadow-lg z-50 px-6 py-4 min-w-[180px] flex flex-col">
              <button
                onClick={handleLogout}
                className="w-full text-left px-3 py-2 mb-2 bg-violet-600/30 hover:bg-violet-600/60 rounded-lg text-white font-semibold transition-all duration-200"
              >
                Logout
              </button>
              <button
                onClick={() => setSettingsOpen(false)}
                className="w-full text-left px-3 py-2 bg-slate-800/50 hover:bg-slate-800/70 rounded-lg text-violet-300 font-medium transition-all duration-200"
              >
                Close
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="relative z-10 px-6 pb-8">
        {/* Profile Header */}
        <div className="text-center mb-8">
          <div className="relative inline-block mb-6">
            <div className="relative">
              <img
                src={getUserAvatar()}
                alt={profile.name}
                className="w-36 h-36 rounded-full border-4 border-gradient-to-r from-violet-400 to-pink-400 shadow-[0_8px_40px_0_rgba(120,56,255,0.4)] bg-gradient-to-tr from-violet-400/20 to-pink-400/20"
              />
              <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-violet-600 to-purple-600 rounded-full p-3 border-4 border-slate-900 shadow-lg">
                <FaCamera className="text-white text-sm" />
              </div>
              {/* Online/Mining status indicator */}
              <div className={`absolute top-2 right-2 w-6 h-6 rounded-full border-4 border-slate-900 shadow-lg ${
                mining.isMining ? 'bg-green-400 animate-pulse' : 'bg-gray-400'
              }`} />
            </div>

            {/* Level badge */}
            <div className="absolute -top-2 -left-2 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full px-3 py-1 text-sm font-bold text-white shadow-lg border-2 border-slate-900">
              LVL {stats.level}
            </div>
          </div>

          <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-300 via-pink-300 to-violet-300 bg-clip-text text-transparent mb-2">
            {profile.name}
          </h1>
          <p className="text-violet-400 font-medium mb-1">@{profile.username}</p>
          <p className="text-slate-400 text-sm mb-4">{profile.email}</p>

          {/* Tier Progress */}
          <div className="max-w-md mx-auto mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-300">
                {stats.currentTier}
              </span>
              <span className="text-sm text-slate-400">
                {stats.tierProgress}% to {stats.nextTier}
              </span>
            </div>
            <div className="w-full bg-slate-700/50 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-violet-500 to-purple-500 h-3 rounded-full relative overflow-hidden transition-all duration-1000"
                style={{ width: `${stats.tierProgress}%` }}
              >
                <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
              </div>
            </div>
          </div>

          {/* Quick Stats Row */}
          <div className="flex justify-center gap-6 mb-8">
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-400">
                {stats.currentStreak}
              </div>
              <div className="text-xs text-slate-400">Day Streak</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-violet-400">
                {stats.rank}
              </div>
              <div className="text-xs text-slate-400">Global Rank</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">
                {mining.totalMiningSessions}
              </div>
              <div className="text-xs text-slate-400">Sessions</div>
            </div>
          </div>
        </div>

        {/* Rest of your JSX remains the same... */}
        {/* I'll continue with the tabs section */}

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="bg-slate-800/60 backdrop-blur-sm rounded-xl p-1 border border-violet-500/30">
            <TabButton
              id="overview"
              label="Overview"
              isActive={activeTab === "overview"}
              onClick={setActiveTab}
            />
            <TabButton
              id="activity"
              label="Activity"
              isActive={activeTab === "activity"}
              onClick={setActiveTab}
            />
            <TabButton
              id="badges"
              label="Badges"
              isActive={activeTab === "badges"}
              onClick={setActiveTab}
            />
          </div>
        </div>

        {/* Overview Tab Content */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {/* Total Coins */}
              <div className="group bg-slate-800/70 backdrop-blur-xl border border-violet-500/30 rounded-2xl p-6 shadow-xl hover:shadow-2xl hover:shadow-violet-500/20 transition-all duration-500 hover:bg-slate-800/80 text-center">
                <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 mb-4 mx-auto group-hover:scale-110 transition-transform duration-300">
                  <FaCoins className="text-3xl text-yellow-400" />
                </div>
                <h2 className="text-3xl font-bold text-yellow-300 mb-2">
                  {stats.totalCoinsEarned.toLocaleString()}
                </h2>
                <p className="text-slate-400 text-sm">Total Coins Earned</p>
              </div>

              {/* Total Referrals */}
              <div className="group bg-slate-800/70 backdrop-blur-xl border border-violet-500/30 rounded-2xl p-6 shadow-xl hover:shadow-2xl hover:shadow-violet-500/20 transition-all duration-500 hover:bg-slate-800/80 text-center">
                <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/30 mb-4 mx-auto group-hover:scale-110 transition-transform duration-300">
                  <FaUserFriends className="text-3xl text-blue-400" />
                </div>
                <h2 className="text-3xl font-bold text-blue-300 mb-2">
                  {social.totalReferrals}
                </h2>
                <p className="text-slate-400 text-sm">Friends Referred</p>
              </div>

              {/* Referral Code */}
              <div className="group bg-slate-800/70 backdrop-blur-xl border border-violet-500/30 rounded-2xl p-6 shadow-xl hover:shadow-2xl hover:shadow-violet-500/20 transition-all duration-500 hover:bg-slate-800/80 text-center">
                <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r from-pink-500/20 to-rose-500/20 border border-pink-500/30 mb-4 mx-auto group-hover:scale-110 transition-transform duration-300">
                  <FaShareAlt className="text-3xl text-pink-400" />
                </div>
                <h2 className="text-2xl font-bold text-pink-300 mb-2">
                  {profile.referralCode || 'Loading...'}
                </h2>
                <p className="text-slate-400 text-sm">Your Referral Code</p>
                <button
                  onClick={handleShare}
                  className="mt-3 px-3 py-1 bg-pink-500/20 hover:bg-pink-500/30 rounded-lg text-pink-300 text-xs font-medium transition-all duration-200"
                >
                  Copy Code
                </button>
              </div>
            </div>

            {/* Share Button */}
            <div className="flex justify-center">
              <button
                onClick={handleShare}
                className="group px-8 py-4 bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 hover:from-violet-500 hover:via-purple-500 hover:to-pink-500 rounded-2xl text-white font-bold shadow-lg shadow-violet-500/30 flex items-center gap-3 hover:scale-105 transform transition-all duration-300 border border-white/10"
              >
                <FaShareAlt className="text-lg group-hover:rotate-12 transition-transform duration-300" />
                Share Referral Code & Earn Rewards
                <div className="ml-2 px-2 py-1 bg-white/20 rounded-lg text-xs">
                  +50 coins
                </div>
              </button>
            </div>
          </div>
        )}

        {/* Other tabs remain the same... */}
        {/* Member Since */}
        <div className="flex justify-center mt-8">
          <div className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 backdrop-blur-sm rounded-xl border border-violet-500/20">
            <FaCalendarAlt className="text-violet-400 text-sm" />
            <span className="text-slate-400 text-sm">
              Member since {formatJoinDate(profile.joined)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
