import React, { useState, useEffect, useMemo } from "react";
import {
  FaCoins,
  FaUserFriends,
  FaShareAlt,
  FaBackward,
  FaTrophy,
  FaMedal,
  FaFire,
  FaRocket,
  FaCalendarAlt,
  FaCrown,
  FaCog,
  FaClock,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useAuth } from './Services/AuthContext';
import { subscribeToUserActivities } from './Services/activityService';
import { subscribeToBadges } from './Services/badgeService';
import { logout as authLogout } from './Services/authService';

// Icon mapping for activities
const getActivityIcon = (iconName) => {
  const iconMap = {
    FaCoins,
    FaUserFriends,
    FaTrophy,
    FaRocket,
    FaFire,
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
        unsubscribeActivities = subscribeToUserActivities(currentUser.uid, (activities) => {
          setRecentActivities(activities);
        });

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
    if (userProfile) setLoading(false);
  }, [userProfile]);

  const stats = useMemo(() => {
    const s = userProfile?.stats || {};
    return {
      totalCoinsEarned: s.totalCoinsEarned ?? 0,
      level: s.level ?? 1,
      currentTier: s.currentTier ?? 'Bronze Miner',
      nextTier: s.nextTier ?? 'Silver Miner',
      tierProgress: Math.min(Math.max(s.tierProgress ?? 0, 0), 100),
      currentStreak: s.currentStreak ?? 0,
      totalMined: s.totalMined ?? 0,
      rank: s.rank ?? '#0',
      isVip: s.isVip ?? false,
    };
  }, [userProfile]);

  const profile = useMemo(() => {
    const p = userProfile?.profile || {};
    return {
      username: p.username ?? 'User',
      name: p.name ?? p.username ?? 'User',
      email: p.email ?? '',
      avatar: p.avatar ?? '',
      referralCode: p.referralCode ?? '',
      joined: p.joined ?? new Date(),
      lastActive: p.lastActive ?? new Date(),
    };
  }, [userProfile]);

  const social = useMemo(() => ({
    totalReferrals: userProfile?.social?.totalReferrals ?? 0,
  }), [userProfile]);

  const mining = useMemo(() => ({
    isMining: userProfile?.mining?.isMining ?? false,
    totalMiningSessions: userProfile?.mining?.totalMiningSessions ?? 0,
  }), [userProfile]);

  if (!currentUser) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center bg-gradient-to-br from-slate-900 via-violet-900/40 to-slate-900 text-white">
        <div className="text-center bg-slate-800/40 border border-violet-500/30 rounded-2xl p-10 max-w-md w-full">
          <div className="w-16 h-16 bg-gradient-to-r from-violet-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <FaUserFriends className="text-2xl text-white" />
          </div>
          <p className="text-violet-300 mb-6 text-lg font-semibold">Please log in to view profile</p>
          <button
            onClick={() => navigate("/login")}
            className="px-6 py-3 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 rounded-xl font-bold text-white shadow-lg transition-all"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  if (loading || !userProfile) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center bg-gradient-to-br from-slate-900 via-violet-900/40 to-slate-900 text-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-transparent border-t-violet-400 border-r-purple-400 mx-auto mb-6"></div>
          <p className="text-slate-300 text-lg font-semibold mb-1">Loading profile...</p>
          <p className="text-slate-500 text-sm">Fetching user data</p>
        </div>
      </div>
    );
  }

  const handleShare = () => {
    if (!profile.referralCode) {
      alert('Referral code not available yet. Please try again in a moment.');
      return;
    }
    const link = `${window.location.origin}/signup?ref=${profile.referralCode}`;
    navigator.clipboard.writeText(link);
    alert("Referral link copied!");
  };

  const handleLogout = async () => {
    try {
      if (typeof logout === 'function') await logout();
      else await authLogout();
      navigate("/login");
    } catch (error) {
      console.error('Error logging out:', error);
      alert('Failed to logout. Please try again.');
    }
  };

  const getUserAvatar = () => {
    if (profile.avatar) return profile.avatar;
    return `https://api.dicebear.com/7.x/initials/svg?seed=${profile.username}&backgroundColor=6366f1&fontSize=40`;
  };

  const formatJoinDate = (date) => {
    const d = date?.seconds ? new Date(date.seconds * 1000) : new Date(date);
    return d.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  };

  const formatActivityTime = (timestamp) => {
    const date = timestamp?.seconds ? new Date(timestamp.seconds * 1000) : new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} mins ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    return `${diffDays} days ago`;
  };

  const TabButton = ({ id, label, isActive, onClick, Icon }) => (
    <button
      onClick={() => onClick(id)}
      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
        isActive ? 'bg-violet-600 text-white' : 'text-violet-300 hover:bg-violet-500/20'
      } flex items-center gap-2`}
    >
      {Icon && <Icon />}
      {label}
    </button>
  );

  const StatCard = ({ Icon, value, label, accent = 'from-violet-500/20 to-purple-500/20' }) => (
    <div className="bg-slate-800/60 border border-violet-500/20 rounded-2xl p-6 hover:bg-slate-800/70 transition-all">
      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${accent} flex items-center justify-center mb-4`}>
        <Icon className="text-white" />
      </div>
      <div className="text-2xl font-bold text-white">{typeof value === 'number' ? value.toLocaleString() : value}</div>
      <div className="text-slate-400 text-xs mt-1">{label}</div>
    </div>
  );

  return (
    <div className="min-h-screen pt-24 bg-gradient-to-br from-slate-900 via-violet-900/40 to-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-violet-500/20 bg-slate-800/60 text-violet-300 hover:text-white hover:bg-slate-800/80 transition"
          >
            <FaBackward className="text-sm" /> Back
          </button>

          <div className="relative">
            <button
              onClick={() => setSettingsOpen(!settingsOpen)}
              className="p-3 rounded-xl border border-violet-500/20 bg-slate-800/60 text-violet-300 hover:text-white hover:bg-slate-800/80 transition"
            >
              <FaCog />
            </button>
            {settingsOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-slate-900 border border-violet-500/20 rounded-xl shadow-xl z-10">
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-3 rounded-t-xl hover:bg-red-500/20 text-white"
                >
                  Logout
                </button>
                <button
                  onClick={() => setSettingsOpen(false)}
                  className="w-full text-left px-4 py-3 rounded-b-xl hover:bg-slate-800 text-violet-300"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Top Section: Profile Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8 items-start">
          {/* Profile Card */}
          <div className="lg:col-span-1 bg-slate-800/60 border border-violet-500/20 rounded-2xl p-6">
            <div className="flex items-center gap-4">
              <img src={getUserAvatar()} alt={profile.name} className="w-20 h-20 rounded-full border-2 border-violet-500/40 object-cover" />
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold">{profile.name}</h1>
                  {stats.isVip && <FaCrown className="text-yellow-400" />}
                </div>
                <div className="text-violet-300 text-sm">@{profile.username}</div>
                <div className="text-slate-400 text-xs mt-1">{profile.email}</div>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-4">
              <span className="text-xs px-2 py-1 rounded-lg bg-violet-500/20 text-violet-300 border border-violet-500/30">Level {stats.level}</span>
              <span className="text-xs px-2 py-1 rounded-lg bg-slate-700/50 text-slate-300 border border-slate-600/50">{stats.currentTier}</span>
            </div>
            <div className="mt-4">
              <div className="w-full bg-slate-700/50 rounded-full h-2">
                <div className="bg-gradient-to-r from-violet-500 to-pink-500 h-2 rounded-full" style={{ width: `${stats.tierProgress}%` }} />
              </div>
              <div className="text-right text-xs text-slate-400 mt-1">{stats.tierProgress}% to {stats.nextTier}</div>
            </div>
            <div className="mt-4 flex items-center gap-2 text-sm text-slate-400">
              <FaCalendarAlt className="text-violet-400" />
              Member since {formatJoinDate(profile.joined)}
            </div>
            <div className="mt-4">
              <button onClick={handleShare} className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 border border-white/10">
                <FaShareAlt /> Share Referral Link
              </button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-6">
            <StatCard Icon={FaFire} value={stats.currentStreak} label="Day Streak" accent="from-orange-400/30 to-amber-400/30" />
            <StatCard Icon={FaTrophy} value={stats.rank} label="Global Rank" accent="from-yellow-400/30 to-orange-400/30" />
            <StatCard Icon={FaRocket} value={mining.totalMiningSessions} label="Sessions" accent="from-blue-400/30 to-cyan-400/30" />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center justify-center mb-6">
          <div className="bg-slate-800/60 border border-violet-500/20 rounded-xl p-1 flex gap-1">
            <TabButton id="overview" label="Overview" Icon={FaCoins} isActive={activeTab === 'overview'} onClick={setActiveTab} />
            <TabButton id="activity" label="Activity" Icon={FaClock} isActive={activeTab === 'activity'} onClick={setActiveTab} />
            <TabButton id="badges" label="Badges" Icon={FaMedal} isActive={activeTab === 'badges'} onClick={setActiveTab} />
          </div>
        </div>

        {/* Overview */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <StatCard Icon={FaCoins} value={stats.totalCoinsEarned} label="Total Coins Earned" accent="from-yellow-500/20 to-orange-500/20" />
            <StatCard Icon={FaUserFriends} value={social.totalReferrals} label="Friends Referred" accent="from-blue-500/20 to-cyan-500/20" />
            <StatCard Icon={FaShareAlt} value={profile.referralCode || '—'} label="Referral Code" accent="from-pink-500/20 to-rose-500/20" />
          </div>
        )}

        {/* Activity */}
        {activeTab === 'activity' && (
          <div className="space-y-4">
            {recentActivities.length > 0 ? (
              recentActivities.map((activity, index) => {
                const ActivityIcon = getActivityIcon(activity.icon);
                return (
                  <div key={activity.id || index} className="bg-slate-800/60 border border-violet-500/20 rounded-2xl p-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-violet-500/20 flex items-center justify-center">
                        <ActivityIcon className="text-violet-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-white truncate">{activity.title}</div>
                        <div className="text-slate-400 text-xs truncate">{activity.description}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-violet-300 font-semibold">+{activity.coinsEarned} coins</div>
                        <div className="text-slate-500 text-xs">{formatActivityTime(activity.timestamp)}</div>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-12 bg-slate-800/40 border border-violet-500/20 rounded-2xl">
                <div className="w-16 h-16 rounded-full bg-slate-700/50 flex items-center justify-center mx-auto mb-4">
                  <FaClock className="text-slate-400 text-2xl" />
                </div>
                <div className="text-slate-300 font-semibold">No Recent Activity</div>
                <div className="text-slate-500 text-sm">Start mining, referring friends, or completing tasks to see your activity here!</div>
              </div>
            )}
          </div>
        )}

        {/* Badges */}
        {activeTab === 'badges' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {badges.length > 0 ? (
              badges.map((badge, index) => (
                <div key={badge.id || index} className="bg-slate-800/60 border border-violet-500/20 rounded-2xl p-6 text-center">
                  <div className="w-14 h-14 rounded-full bg-yellow-500/20 border border-yellow-500/30 flex items-center justify-center mx-auto mb-3">
                    <FaMedal className="text-yellow-400 text-2xl" />
                  </div>
                  <div className="font-bold text-white">{badge.name}</div>
                  <div className="text-slate-400 text-sm mb-2">{badge.description}</div>
                  <div className="text-xs text-violet-400 bg-violet-500/10 px-2 py-1 rounded-full inline-block">
                    {badge.isEarned ? `Earned ${formatActivityTime(badge.earnedAt)}` : `${Math.round(badge.progress || 0)}%`}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 bg-slate-800/40 border border-violet-500/20 rounded-2xl col-span-full">
                <div className="w-16 h-16 rounded-full bg-slate-700/50 flex items-center justify-center mx-auto mb-4">
                  <FaMedal className="text-slate-400 text-2xl" />
                </div>
                <div className="text-slate-300 font-semibold">No Badges Yet</div>
                <div className="text-slate-500 text-sm">Complete achievements and milestones to earn your first badge!</div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
