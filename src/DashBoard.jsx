import React, { useState, useEffect } from "react";
import StreakGrid from "./StreakGrid";
import Notifications from "./Notifications";
import Achievements from "./Achievements";
import MiningSection from "./MiningDashboard";
import {
  FaHome,
  FaUserFriends,
  FaNewspaper,
  FaTachometerAlt,
  FaUser,
  FaBars,
  FaTimes,
  FaCrown,
  FaChartLine,
  FaCheckCircle,
  FaCircle,
  FaPlus,
  FaTrophy,
  FaClock,
  FaStar,
  FaFire,
  FaGem,
  FaRocket,
  FaMedal,
  FaHeart,
  FaChevronLeft,
  FaChevronRight,
  FaCog,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import BadgeQuests from "./BadgeQuests";
import { useAuth } from './Services/AuthContext';

export default function Dashboard() {
  const { currentUser, userProfile } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [timeOfDay, setTimeOfDay] = useState("");
  
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setTimeOfDay("Good Morning");
    else if (hour < 18) setTimeOfDay("Good Afternoon");
    else setTimeOfDay("Good Evening");
  }, []);

  // FIXED: More robust safe property access
  const stats = (userProfile && userProfile.stats) ? {
    totalCoinsEarned: userProfile.stats.totalCoinsEarned ?? 0,
    level: userProfile.stats.level ?? 1,
    isVip: userProfile.stats.isVip ?? false
  } : {
    totalCoinsEarned: 0,
    level: 1,
    isVip: false
  };

  const profile = (userProfile && userProfile.profile) ? {
    username: userProfile.profile.username ?? "User",
    avatar: userProfile.profile.avatar ?? "",
    email: userProfile.profile.email ?? ""
  } : {
    username: "User",
    avatar: "",
    email: ""
  };

  // Show loading state if user data is not available
  if (!currentUser || !userProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-400 mx-auto mb-4"></div>
          <p className="text-slate-300 text-lg">Loading your dashboard...</p>
          <p className="text-slate-500 text-sm mt-2">Setting up your personalized experience</p>
        </div>
      </div>
    );
  }
  
  const navItems = [
    { icon: FaHome, path: "/dashboard", label: "Home" },
    { icon: FaUserFriends, path: "/friends", label: "Friends" },
    { icon: FaNewspaper, path: "/work-in-progress", label: "News" },
  ];

  const getUserAvatar = () => {
    if (profile.avatar) {
      return profile.avatar;
    }
    return `https://api.dicebear.com/7.x/initials/svg?seed=${profile.username}&backgroundColor=6366f1&fontSize=40`;
  };


  console.log(currentUser, userProfile);
  
  return (
    <div className="min-h-screen pt-20 bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 text-white relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-violet-500/5 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl animate-pulse delay-500" />
      </div>
      
      {/* Overlay when sidebar is open on mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <aside
        className={`
          fixed 
          top-1/2 left-4 transform -translate-y-1/2
          md:top-1/2 md:left-4 md:transform md:-translate-y-1/2
          w-72 md:w-24 
          bg-slate-800/90 backdrop-blur-xl border border-violet-500/30 rounded-2xl
          flex flex-col justify-between py-8 shadow-2xl shadow-violet-500/10
          transition-all duration-500 ease-out z-40
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
          max-h-[75vh]
        `}
      >
        {/* Close button for mobile */}
        <button
          onClick={() => setSidebarOpen(false)}
          className="absolute top-4 right-4 text-violet-300 hover:text-white md:hidden p-2 bg-violet-600/20 rounded-lg hover:bg-violet-600/40 transition-all duration-200"
        >
          <FaTimes className="text-lg" />
        </button>
        
        {/* Navigation Items */}
        <div className="flex flex-col gap-6 w-full px-4 md:px-2 mt-8">
          {navItems.map((item, index) => (
            <Link to={item.path} key={item.path} className="w-full">
              <button 
                className={`
                  group relative w-full md:w-16 h-16 flex items-center justify-start md:justify-center
                  text-violet-300 hover:text-white transition-all duration-300
                  rounded-xl hover:bg-gradient-to-r hover:from-violet-600 hover:to-purple-600
                  hover:shadow-lg hover:shadow-violet-500/30 transform hover:scale-105
                  border border-transparent hover:border-violet-400/30
                  ${index === 0 ? 'bg-violet-600/30 text-violet-200 border-violet-400/40' : ''}
                `}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <item.icon className="text-xl md:text-lg ml-4 md:ml-0 text-current flex-shrink-0" />
                <span className="ml-4 md:hidden font-medium text-current">{item.label}</span>
                
                {/* Tooltip for desktop */}
                <div className="absolute left-20 bg-slate-800/95 backdrop-blur-sm text-white px-3 py-2 rounded-lg text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none hidden md:block border border-violet-500/30 shadow-lg z-50">
                  {item.label}
                  <div className="absolute left-0 top-1/2 transform -translate-x-1 -translate-y-1/2 w-2 h-2 bg-slate-800 rotate-45 border-l border-b border-violet-500/30"></div>
                </div>
              </button>
            </Link>
          ))}
        </div>
        
        {/* Profile Section */}
        <div className="w-full px-4 md:px-2 mb-4">
          <Link to="/profile">
            <div className="group relative flex md:justify-center items-center p-4 rounded-xl hover:bg-violet-600/30 transition-all duration-300 border border-transparent hover:border-violet-400/40">
              <div className="relative">
                <img
                  src={getUserAvatar()}
                  alt="Profile"
                  className="w-12 h-12 rounded-full border-2 border-violet-400/70 shadow-lg group-hover:shadow-violet-400/50 transition-all duration-300 group-hover:border-violet-300"
                />
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-slate-800 animate-pulse" />
              </div>
              <div className="ml-3 md:hidden">
                <p className="text-white font-medium">{profile.username}</p>
                <p className="text-violet-300 text-sm">
                  {stats.isVip ? 'VIP Member' : 'Standard User'}
                </p>
              </div>
              {stats.isVip && <FaCrown className="ml-auto md:hidden text-yellow-400 text-lg" />}
            </div>
          </Link>
        </div>
      </aside>
      
      {/* Floating Toggle Button */}
      <button
        className={`
          fixed bottom-6 left-6 z-50 w-14 h-14 
          bg-gradient-to-r from-violet-600 to-purple-600 rounded-full 
          shadow-lg shadow-violet-500/40 flex items-center justify-center 
          hover:shadow-xl hover:shadow-violet-500/60 transition-all duration-300 
          transform hover:scale-110 active:scale-95 md:hidden
          border border-violet-400/30 hover:border-violet-300
          ${sidebarOpen ? 'rotate-180' : 'rotate-0'}
        `}
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? (
          <FaTimes className="text-white text-xl" />
        ) : (
          <FaBars className="text-white text-xl" />
        )}
      </button>
      
      {/* Main Content */}
      <div className="min-h-screen overflow-y-auto">
        {/* Welcome Section */}
        <div className="px-6 py-8 md:ml-32">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
                {timeOfDay}, {profile.username}! 👋
              </h1>
              <p className="text-slate-300 mt-2 flex items-center gap-2">
                <FaChartLine className="text-violet-400" />
                Ready to boost your productivity today?
              </p>
            </div>
            <div className="hidden md:block">
              <div className="flex items-center gap-4 bg-slate-800/60 backdrop-blur-sm rounded-xl px-4 py-2 border border-violet-500/30 shadow-lg">
                <div className="text-right">
                  <p className="text-sm text-violet-300">Total Coins</p>
                  <p className="text-xl font-bold text-yellow-400">
                    {/* FIXED: Extra safety check */}
                    {(stats.totalCoinsEarned || 0).toLocaleString()}
                  </p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center shadow-md">
                  💰
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Stats */}
          <div className="md:hidden mt-4 grid grid-cols-2 gap-4">
            <div className="bg-slate-800/60 backdrop-blur-sm rounded-xl px-4 py-3 border border-violet-500/30">
              <p className="text-xs text-violet-300">Total Coins</p>
              <p className="text-lg font-bold text-yellow-400">
                {/* FIXED: Extra safety check */}
                {(stats.totalCoinsEarned || 0).toLocaleString()}
              </p>
            </div>
            <div className="bg-slate-800/60 backdrop-blur-sm rounded-xl px-4 py-3 border border-violet-500/30">
              <p className="text-xs text-violet-300">Level</p>
              <p className="text-lg font-bold text-blue-400">
                {stats.level || 1}
              </p>
            </div>
          </div>
        </div>
        
        {/* Main content - Rest of your JSX remains the same */}
        <main className="px-6 pb-8 md:ml-32 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content Area */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            {/* Mining Dashboard */}
            <div className="group bg-slate-800/70 backdrop-blur-xl border border-violet-500/30 rounded-2xl p-6 shadow-xl hover:shadow-2xl hover:shadow-violet-500/20 transition-all duration-500 hover:bg-slate-800/80 relative overflow-hidden min-h-[350px]">
              <div className="absolute inset-0 bg-gradient-to-r from-violet-600/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />
              <div className="relative z-10">
                <h2 className="text-xl font-bold text-violet-300 mb-4 flex items-center gap-3">
                  ⛏️ Mining Dashboard
                  <div className="px-3 py-1 bg-green-500/20 border border-green-500/30 rounded-full text-xs text-green-400 font-semibold">
                    ACTIVE
                  </div>
                </h2>
                <MiningSection />
              </div>
            </div>
            
            {/* Notifications */}
            <div className="group bg-slate-800/70 backdrop-blur-xl border border-violet-500/30 rounded-2xl p-6 shadow-xl hover:shadow-2xl hover:shadow-violet-500/20 transition-all duration-500 hover:bg-slate-800/80 min-h-[350px] relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-cyan-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />
              <div className="relative z-10 h-full">
                <h2 className="text-xl font-bold text-violet-300 mb-4 flex items-center gap-3">
                  🔔 Notifications
                  <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse" />
                </h2>
                <Notifications />
              </div>
            </div>
          </div>
          
          {/* Sidebar Content */}
          <div className="flex flex-col gap-6">
            {/* Achievements */}
            <div className="group bg-slate-800/70 backdrop-blur-xl border border-violet-500/30 rounded-2xl p-6 shadow-xl hover:shadow-2xl hover:shadow-violet-500/20 transition-all duration-500 hover:bg-slate-800/80 h-[350px] relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-600/5 to-orange-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />
              <div className="relative z-10 h-full">
                <h2 className="text-xl font-bold text-violet-300 mb-4 flex items-center gap-3">
                  🏆 Achievements
                  <FaCrown className="text-yellow-400" />
                </h2>
                <Achievements />
              </div>
            </div>
            
            {/* Streak Grid */}
            <div className="group bg-slate-800/70 backdrop-blur-xl border border-violet-500/30 rounded-2xl p-6 shadow-xl hover:shadow-2xl hover:shadow-violet-500/20 transition-all duration-500 hover:bg-slate-800/80 h-[350px] relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-600/5 to-red-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />
              <div className="relative z-10 h-full">
                <h2 className="text-xl font-bold text-violet-300 mb-4 flex items-center gap-3">
                  🔥 Your Streak
                  <div className="px-2 py-1 bg-orange-500/20 border border-orange-500/30 rounded-full text-xs text-orange-400 font-semibold">
                    HOT
                  </div>
                </h2>
                <StreakGrid />
              </div>
            </div>

            {/* Badge Quest System */}
            <div className="group bg-slate-800/70 backdrop-blur-xl border border-violet-500/30 rounded-2xl p-6 shadow-xl hover:shadow-2xl hover:shadow-violet-500/20 transition-all duration-500 hover:bg-slate-800/80 h-[450px] relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />
              <div className="relative z-10 h-full">
                <h2 className="text-xl font-bold text-violet-300 mb-4 flex items-center gap-3">
                  <FaMedal className="text-purple-400" />
                  Badge Quests
                  <div className="px-2 py-1 bg-purple-500/20 border border-purple-500/30 rounded-full text-xs text-purple-400 font-semibold">
                    EARN
                  </div>
                </h2>
                <BadgeQuests />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
