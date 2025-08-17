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
  FaCrown,
  FaLightbulb,
  FaAward,
  FaThumbsUp,
  FaEye,
  FaArrowUp,
  FaBolt,
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
  const [isProfileImageHovered, setIsProfileImageHovered] = useState(false);
  const [animateStats, setAnimateStats] = useState(false);

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
        // Trigger stats animation
        setTimeout(() => setAnimateStats(true), 500);
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

  // Show loading state
  if (!currentUser) {
    return (
      <div className="min-h-screen pt-20 bg-gradient-to-br from-slate-900 via-violet-900/40 to-slate-900 text-white flex items-center justify-center">
        <div className="text-center backdrop-blur-xl bg-slate-800/30 rounded-3xl p-12 border border-violet-500/30 shadow-2xl">
          <div className="w-20 h-20 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <FaHeart className="text-3xl text-white animate-pulse" />
          </div>
          <p className="text-red-400 mb-6 text-xl font-semibold">Please log in to view profile</p>
          <button 
            onClick={() => navigate("/login")}
            className="px-8 py-4 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 rounded-2xl font-bold text-white shadow-lg hover:shadow-violet-500/30 transform hover:scale-105 transition-all duration-300"
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
          <div className="relative mb-8">
            <div className="animate-spin rounded-full h-20 w-20 border-4 border-transparent border-t-violet-400 border-r-purple-400 mx-auto"></div>
            <div className="absolute inset-0 rounded-full h-20 w-20 border-4 border-transparent border-b-pink-400 border-l-blue-400 mx-auto animate-spin" style={{animationDirection: 'reverse', animationDuration: '1.5s'}}></div>
          </div>
          <div className="backdrop-blur-xl bg-slate-800/30 rounded-3xl p-8 border border-violet-500/30">
            <p className="text-slate-300 text-xl font-semibold mb-2">Loading profile...</p>
            <p className="text-slate-500 text-sm">
              {!userProfile ? '🚀 Fetching user data...' : '📊 Loading profile data...'}
            </p>
            <div className="mt-4 flex justify-center">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-violet-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
              </div>
            </div>
          </div>
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

  const TabButton = ({ id, label, isActive, onClick, icon: Icon }) => (
    <button
      onClick={() => onClick(id)}
      className={`
        relative px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center gap-3 group overflow-hidden
        ${isActive
          ? "bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-lg shadow-violet-500/30 scale-105"
          : "text-slate-400 hover:text-violet-300 hover:bg-slate-700/50 hover:scale-105"
        }
      `}
    >
      {/* Animated background for inactive tabs */}
      <div className={`absolute inset-0 bg-gradient-to-r from-violet-600/10 to-purple-600/10 transition-opacity duration-300 ${
        isActive ? 'opacity-0' : 'opacity-0 group-hover:opacity-100'
      }`} />
      
      <Icon className={`text-lg transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
      <span className="relative z-10">{label}</span>
      
      {/* Active indicator */}
      {isActive && (
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-white/50 rounded-full" />
      )}
    </button>
  );

  const StatCard = ({ icon: Icon, value, label, color, delay = 0 }) => (
    <div 
      className={`
        group bg-slate-800/70 backdrop-blur-xl border border-violet-500/30 rounded-3xl p-8 
        shadow-xl hover:shadow-2xl transition-all duration-700 hover:bg-slate-800/80 text-center
        transform hover:scale-105 hover:-translate-y-2
        ${animateStats ? 'animate-slideInUp opacity-100' : 'opacity-0 translate-y-8'}
      `}
      style={{ animationDelay: `${delay}ms`, animationFillMode: 'forwards' }}
    >
      <div className={`
        flex items-center justify-center w-20 h-20 rounded-3xl mb-6 mx-auto
        bg-gradient-to-br ${color} border border-white/20
        group-hover:scale-110 group-hover:rotate-12 transition-transform duration-500
        shadow-lg group-hover:shadow-xl
      `}>
        <Icon className="text-4xl text-white drop-shadow-lg" />
      </div>
      <h2 className="text-4xl font-bold text-white mb-3 group-hover:scale-110 transition-transform duration-300">
        {typeof value === 'number' ? value.toLocaleString() : value}
      </h2>
      <p className="text-slate-400 text-sm font-medium group-hover:text-slate-300 transition-colors duration-300">
        {label}
      </p>
      
      {/* Decorative elements */}
      <div className="absolute top-4 right-4 w-3 h-3 bg-white/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="absolute bottom-4 left-4 w-2 h-2 bg-white/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </div>
  );

  return (
    <div className="min-h-screen pt-20 bg-gradient-to-br from-slate-900 via-violet-900/40 to-slate-900 text-white relative overflow-hidden">
      {/* Enhanced Animated Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-[32rem] h-[32rem] bg-violet-500/8 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[40rem] bg-pink-500/5 rounded-full blur-3xl animate-pulse delay-2000" />
        
        {/* Floating particles */}
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-violet-400/30 rounded-full animate-float" />
        <div className="absolute top-3/4 right-1/4 w-3 h-3 bg-purple-400/30 rounded-full animate-float delay-1000" />
        <div className="absolute top-1/2 right-1/3 w-1.5 h-1.5 bg-pink-400/30 rounded-full animate-float delay-2000" />
      </div>

      {/* Enhanced Header with navigation */}
      <div className="relative z-10 px-6 py-6">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="group flex items-center gap-3 px-6 py-3 bg-slate-800/60 backdrop-blur-xl rounded-2xl border border-violet-500/30 text-violet-300 hover:text-white hover:bg-slate-800/80 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-violet-500/20"
          >
            <FaBackward className="text-sm group-hover:-translate-x-1 transition-transform duration-300" />
            <span className="font-medium">Back to Dashboard</span>
          </button>

          <div className="relative">
            <button
              onClick={() => setSettingsOpen(!settingsOpen)}
              className="p-4 bg-slate-800/60 backdrop-blur-xl rounded-2xl border border-violet-500/30 text-violet-300 hover:text-white hover:bg-slate-800/80 transition-all duration-300 hover:scale-110 hover:rotate-90 hover:shadow-lg hover:shadow-violet-500/20"
            >
              <FaCog className="text-lg" />
            </button>
            
            {settingsOpen && (
              <div className="absolute right-0 top-16 bg-slate-900/95 backdrop-blur-xl border border-violet-500/30 rounded-2xl shadow-2xl shadow-violet-500/20 z-50 px-2 py-2 min-w-[200px] animate-slideInDown">
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-3 mb-1 bg-gradient-to-r from-red-600/30 to-pink-600/30 hover:from-red-600/50 hover:to-pink-600/50 rounded-xl text-white font-semibold transition-all duration-300 flex items-center gap-3 group"
                >
                  <FaArrowUp className="rotate-45 group-hover:scale-110 transition-transform duration-300" />
                  Logout
                </button>
                <button
                  onClick={() => setSettingsOpen(false)}
                  className="w-full text-left px-4 py-3 bg-slate-800/50 hover:bg-slate-800/70 rounded-xl text-violet-300 font-medium transition-all duration-300 flex items-center gap-3 group"
                >
                  <FaBolt className="group-hover:scale-110 transition-transform duration-300" />
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="relative  px-6 pb-8">
        {/* Enhanced Profile Header */}
        <div className="text-center mb-12">
          <div 
            className="relative inline-block mb-8 group"
            onMouseEnter={() => setIsProfileImageHovered(true)}
            onMouseLeave={() => setIsProfileImageHovered(false)}
          >
            <div className="relative">
              {/* Outer glow ring */}
              <div className={`absolute -inset-4 bg-gradient-to-r from-violet-400 via-purple-400 to-pink-400 rounded-full opacity-20 blur-xl transition-all duration-700 ${
                isProfileImageHovered ? 'scale-110 opacity-40' : 'scale-100'
              }`} />
              
              <img
                src={getUserAvatar()}
                alt={profile.name}
                className={`
                  relative w-40 h-40 rounded-full border-4 border-gradient-to-r from-violet-400 to-pink-400 
                  shadow-[0_8px_40px_0_rgba(120,56,255,0.6)] bg-gradient-to-tr from-violet-400/20 to-pink-400/20
                  transition-all duration-700 group-hover:scale-110 group-hover:rotate-6
                  ${isProfileImageHovered ? 'shadow-[0_12px_60px_0_rgba(120,56,255,0.8)]' : ''}
                `}
              />
              
              {/* Camera button with enhanced styling */}
              <div className={`
                absolute -bottom-3 -right-3 bg-gradient-to-r from-violet-600 to-purple-600 rounded-full p-4 
                border-4 border-slate-900 shadow-xl cursor-pointer group-hover:scale-110 transition-all duration-500
                hover:shadow-2xl hover:shadow-violet-500/50 hover:from-violet-500 hover:to-purple-500
                ${isProfileImageHovered ? 'animate-bounce' : ''}
              `}>
                <FaCamera className="text-white text-lg" />
              </div>
              
              {/* Enhanced Online/Mining status indicator */}
              <div className={`
                absolute top-3 right-3 w-8 h-8 rounded-full border-4 border-slate-900 shadow-lg flex items-center justify-center
                ${mining.isMining 
                  ? 'bg-gradient-to-r from-green-400 to-emerald-500 animate-pulse' 
                  : 'bg-gradient-to-r from-gray-400 to-gray-500'
                }
              `}>
                {mining.isMining && <FaBolt className="text-white text-xs animate-pulse" />}
              </div>
            </div>

            {/* Enhanced Level badge */}
            <div className="absolute -top-4 -left-4 bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 rounded-full px-4 py-2 text-base font-bold text-white shadow-xl border-4 border-slate-900 animate-pulse">
              <div className="flex items-center gap-1">
                <FaCrown className="text-sm" />
                LVL {stats.level}
              </div>
            </div>
            
            {/* VIP Crown */}
            {stats.isVip && (
              <div className="absolute -top-2 right-8 text-yellow-400 text-2xl animate-bounce">
                <FaCrown className="drop-shadow-lg" />
              </div>
            )}
          </div>

          <div className="space-y-4 mb-8">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-violet-300 via-pink-300 to-violet-300 bg-clip-text text-transparent animate-shimmer">
              {profile.name}
            </h1>
            <p className="text-violet-400 font-semibold text-xl flex items-center justify-center gap-2">
              <span>@{profile.username}</span>
              {stats.isVip && <FaCrown className="text-yellow-400 text-lg animate-pulse" />}
            </p>
            <p className="text-slate-400 font-medium">{profile.email}</p>
          </div>

          {/* Enhanced Tier Progress */}
          <div className="max-w-lg mx-auto mb-8">
            <div className="flex items-center justify-between mb-3">
              <span className="text-base font-semibold text-slate-300 flex items-center gap-2">
                <FaMedal className="text-violet-400" />
                {stats.currentTier}
              </span>
              <span className="text-sm text-slate-400 bg-slate-800/50 px-3 py-1 rounded-full">
                {stats.tierProgress}% to {stats.nextTier}
              </span>
            </div>
            <div className="w-full bg-slate-700/50 rounded-full h-4 overflow-hidden border border-violet-500/20">
              <div
                className="bg-gradient-to-r from-violet-500 via-purple-500 to-pink-500 h-4 rounded-full relative overflow-hidden transition-all duration-1000 shadow-lg"
                style={{ width: `${stats.tierProgress}%` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/30 to-transparent animate-shimmer"></div>
                <div className="absolute right-0 top-0 h-full w-8 bg-white/20 animate-pulse"></div>
              </div>
            </div>
          </div>

          {/* Enhanced Quick Stats Row */}
          <div className="flex justify-center gap-8 mb-12">
            <div className="group text-center p-4 rounded-2xl bg-slate-800/30 backdrop-blur-sm border border-violet-500/20 hover:bg-slate-800/50 transition-all duration-300 hover:scale-110">
              <div className="text-3xl font-bold text-yellow-400 mb-1 flex items-center justify-center gap-2 group-hover:scale-110 transition-transform duration-300">
                <FaFire className="text-orange-400" />
                {stats.currentStreak}
              </div>
              <div className="text-xs text-slate-400 font-medium">Day Streak</div>
            </div>
            <div className="group text-center p-4 rounded-2xl bg-slate-800/30 backdrop-blur-sm border border-violet-500/20 hover:bg-slate-800/50 transition-all duration-300 hover:scale-110">
              <div className="text-3xl font-bold text-violet-400 mb-1 flex items-center justify-center gap-2 group-hover:scale-110 transition-transform duration-300">
                <FaTrophy className="text-yellow-500" />
                {stats.rank}
              </div>
              <div className="text-xs text-slate-400 font-medium">Global Rank</div>
            </div>
            <div className="group text-center p-4 rounded-2xl bg-slate-800/30 backdrop-blur-sm border border-violet-500/20 hover:bg-slate-800/50 transition-all duration-300 hover:scale-110">
              <div className="text-3xl font-bold text-green-400 mb-1 flex items-center justify-center gap-2 group-hover:scale-110 transition-transform duration-300">
                <FaRocket className="text-blue-400" />
                {mining.totalMiningSessions}
              </div>
              <div className="text-xs text-slate-400 font-medium">Sessions</div>
            </div>
          </div>
        </div>

        {/* Enhanced Tab Navigation */}
        <div className="flex justify-center mb-12">
          <div className="bg-slate-800/60 backdrop-blur-xl rounded-3xl p-2 border border-violet-500/30 shadow-2xl">
            <div className="flex gap-2">
              <TabButton
                id="overview"
                label="Overview"
                icon={FaChartLine}
                isActive={activeTab === "overview"}
                onClick={setActiveTab}
              />
              <TabButton
                id="activity"
                label="Activity"
                icon={FaClock}
                isActive={activeTab === "activity"}
                onClick={setActiveTab}
              />
              <TabButton
                id="badges"
                label="Badges"
                icon={FaAward}
                isActive={activeTab === "badges"}
                onClick={setActiveTab}
              />
            </div>
          </div>
        </div>

        {/* Overview Tab Content */}
        {activeTab === "overview" && (
          <div className="space-y-12">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              <StatCard
                icon={FaCoins}
                value={stats.totalCoinsEarned}
                label="Total Coins Earned"
                color="from-yellow-500/20 to-orange-500/20"
                delay={100}
              />
              <StatCard
                icon={FaUserFriends}
                value={social.totalReferrals}
                label="Friends Referred"
                color="from-blue-500/20 to-cyan-500/20"
                delay={200}
              />
              <StatCard
                icon={FaShareAlt}
                value={profile.referralCode || 'Loading...'}
                label="Your Referral Code"
                color="from-pink-500/20 to-rose-500/20"
                delay={300}
              />
            </div>

            {/* Enhanced Share Button */}
            <div className="flex justify-center">
              <button
                onClick={handleShare}
                className="group relative px-12 py-6 bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 hover:from-violet-500 hover:via-purple-500 hover:to-pink-500 rounded-3xl text-white font-bold shadow-2xl shadow-violet-500/30 flex items-center gap-4 hover:scale-105 transform transition-all duration-500 border border-white/10 overflow-hidden"
              >
                {/* Animated background */}
                <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <FaShareAlt className="text-2xl group-hover:rotate-12 group-hover:scale-110 transition-transform duration-300 relative z-10" />
                <div className="relative z-10">
                  <div className="text-xl">Share Referral Code & Earn Rewards</div>
                  <div className="text-sm opacity-80">Invite friends and get bonuses</div>
                </div>
                <div className="ml-4 px-4 py-2 bg-white/20 rounded-2xl text-base font-bold relative z-10 group-hover:bg-white/30 transition-colors duration-300 flex items-center gap-2">
                  <FaCoins className="text-yellow-400" />
                  +50 coins
                </div>
                
                {/* Ripple effect */}
                <div className="absolute inset-0 bg-white/10 rounded-3xl scale-0 group-hover:scale-100 transition-transform duration-700 opacity-50" />
              </button>
            </div>
          </div>
        )}

        {/* Activity Tab Content */}
        {activeTab === "activity" && (
          <div className="space-y-8">
            {recentActivities.length > 0 ? (
              <div className="grid gap-4">
                {recentActivities.map((activity, index) => {
                  const ActivityIcon = getActivityIcon(activity.icon);
                  return (
                    <div
                      key={activity.id || index}
                      className="group bg-slate-800/50 backdrop-blur-xl border border-violet-500/20 rounded-2xl p-6 hover:bg-slate-800/70 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-violet-500/20"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-violet-500/20 to-purple-500/20 rounded-xl flex items-center justify-center border border-violet-500/30 group-hover:scale-110 transition-transform duration-300">
                          <ActivityIcon className="text-violet-400 text-lg" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-white mb-1">{activity.title}</h3>
                          <p className="text-slate-400 text-sm">{activity.description}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-violet-400 font-semibold text-lg">
                            +{activity.coinsEarned} coins
                          </div>
                          <div className="text-slate-500 text-xs">
                            {formatActivityTime(activity.timestamp)}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-6 border border-violet-500/20">
                  <FaClock className="text-4xl text-slate-400" />
                </div>
                <h3 className="text-2xl font-bold text-slate-300 mb-2">No Recent Activity</h3>
                <p className="text-slate-500 max-w-md mx-auto">
                  Start mining, referring friends, or completing tasks to see your activity here!
                </p>
              </div>
            )}
          </div>
        )}

        {/* Badges Tab Content */}
        {activeTab === "badges" && (
          <div className="space-y-8">
            {badges.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {badges.map((badge, index) => (
                  <div
                    key={badge.id || index}
                    className="group bg-slate-800/50 backdrop-blur-xl border border-violet-500/20 rounded-2xl p-6 text-center hover:bg-slate-800/70 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-violet-500/20"
                    style={{ animationDelay: `${index * 150}ms` }}
                  >
                    <div className="w-16 h-16 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-yellow-500/30 group-hover:scale-110 transition-transform duration-300">
                      <FaMedal className="text-3xl text-yellow-400" />
                    </div>
                    <h3 className="font-bold text-white mb-2">{badge.name}</h3>
                    <p className="text-slate-400 text-sm mb-3">{badge.description}</p>
                    <div className="text-xs text-violet-400 bg-violet-500/10 px-3 py-1 rounded-full inline-block">
                      Earned {formatActivityTime(badge.earnedAt)}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-6 border border-violet-500/20">
                  <FaAward className="text-4xl text-slate-400" />
                </div>
                <h3 className="text-2xl font-bold text-slate-300 mb-2">No Badges Yet</h3>
                <p className="text-slate-500 max-w-md mx-auto">
                  Complete achievements and milestones to earn your first badge!
                </p>
              </div>
            )}
          </div>
        )}

        {/* Enhanced Member Since Section */}
        <div className="flex justify-center mt-16">
          <div className="group flex items-center gap-3 px-6 py-3 bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-violet-500/20 hover:bg-slate-800/70 transition-all duration-300 hover:scale-105">
            <FaCalendarAlt className="text-violet-400 text-lg group-hover:scale-110 transition-transform duration-300" />
            <span className="text-slate-400 font-medium">
              Member since {formatJoinDate(profile.joined)}
            </span>
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse ml-2"></div>
          </div>
        </div>
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slideInDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes shimmer {
          0% {
            background-position: -200% center;
          }
          100% {
            background-position: 200% center;
          }
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        
        .animate-slideInUp {
          animation: slideInUp 0.8s ease-out;
        }
        
        .animate-slideInDown {
          animation: slideInDown 0.3s ease-out;
        }
        
        .animate-shimmer {
          background-size: 200% auto;
          animation: shimmer 3s linear infinite;
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}