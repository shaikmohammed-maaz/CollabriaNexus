import React, { useState, useEffect } from "react";
import StreakGrid from "./StreakGrid";
import Notifications from "./Notifications";
import Achievements from "./Achievements";
import MiningSection from "./MiningDashboard";
import Logo from "../public/logo.png";

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
import { useAuth } from "./Services/AuthContext";

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
  const stats =
    userProfile && userProfile.stats
      ? {
          totalCoinsEarned: userProfile.stats.totalCoinsEarned ?? 0,
          level: userProfile.stats.level ?? 1,
          isVip: userProfile.stats.isVip ?? false,
        }
      : {
          totalCoinsEarned: 0,
          level: 1,
          isVip: false,
        };

  const profile =
    userProfile && userProfile.profile
      ? {
          username: userProfile.profile.username ?? "User",
          avatar: userProfile.profile.avatar ?? "",
          email: userProfile.profile.email ?? "",
        }
      : {
          username: "User",
          avatar: "",
          email: "",
        };

  // Show loading state if user data is not available
  if (!currentUser || !userProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-400 mx-auto mb-4"></div>
          <p className="text-slate-300 text-lg">Loading your dashboard...</p>
          <p className="text-slate-500 text-sm mt-2">
            Setting up your personalized experience
          </p>
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

  const [hoveredIndex, setHoveredIndex] = React.useState(null);

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
    w-80 md:w-20 
    bg-gradient-to-b from-slate-900/95 to-slate-800/95 
    backdrop-blur-2xl border border-violet-400/20 rounded-3xl
    flex flex-col justify-between py-8 
    shadow-2xl shadow-violet-500/20 hover:shadow-violet-500/30
    transition-all duration-700 ease-out z-40
    ${sidebarOpen ? "translate-x-0 opacity-100" : "-translate-x-full md:translate-x-0 opacity-0 md:opacity-100"}
    max-h-[80vh] overflow-hidden
    before:absolute before:inset-0 before:rounded-3xl before:p-[1px]
    before:bg-gradient-to-b before:from-violet-400/30 before:via-purple-500/20 before:to-transparent
    before:mask-gradient before:pointer-events-none before:-z-10
  `}
>
  {/* Decorative gradient orbs */}
  <div className="absolute top-8 right-6 w-16 h-16 bg-violet-500/10 rounded-full blur-xl animate-pulse"></div>
  <div className="absolute bottom-20 left-4 w-12 h-12 bg-purple-500/10 rounded-full blur-lg animate-pulse delay-1000"></div>

  {/* Close button for mobile */}
  <button
    onClick={() => setSidebarOpen(false)}
    className="absolute top-6 right-6 text-violet-300 hover:text-white md:hidden 
               p-3 bg-violet-600/20 rounded-xl hover:bg-violet-600/40 
               transition-all duration-300 hover:scale-110 hover:rotate-90
               border border-violet-500/30 hover:border-violet-400/50
               backdrop-blur-sm shadow-lg"
  >
    <FaTimes className="text-lg" />
  </button>
  
  {/* Brand/Logo area */}
  <div className="w-full px-6 md:px-3 mb-4 pr-16">
    <div className="flex items-center justify-center md:justify-center">
      <div className="w-10 h-10rounded-xl flex items-center justify-center shadow-lg">
        <span className="text-white font-bold text-lg">
          <img src={Logo} alt="Logo" className="w-10 h-6" />
        </span>
      </div>
      <span className="ml-3 md:hidden text-white font-bold text-xl bg-gradient-to-r from-violet-200 to-purple-200 bg-clip-text text-transparent">
        CollabriaNexus
      </span>
    </div>
  </div>
  
  {/* Navigation Items */}
  <div className="flex flex-col gap-3 w-full px-6 md:px-3 flex-1">
    {navItems.map((item, index) => (
      <Link to={item.path} key={item.path} className="w-full">
        <button 
          className={`
            group relative w-full md:w-14 h-14 flex items-center justify-start md:justify-center
            text-violet-300 hover:text-white transition-all duration-500
            rounded-2xl transform hover:scale-105 active:scale-95
            border border-transparent overflow-hidden
            ${index === 0 
              ? 'bg-gradient-to-r from-violet-600/40 to-purple-600/40 text-violet-100 border-violet-400/50 shadow-lg shadow-violet-500/20' 
              : 'hover:bg-gradient-to-r hover:from-violet-600/30 hover:to-purple-600/30 hover:border-violet-400/40 hover:shadow-lg hover:shadow-violet-500/25'
            }
          `}
          style={{ 
            animationDelay: `${index * 150}ms`,
            animation: 'slideInLeft 0.8s ease-out forwards'
          }}
          onMouseEnter={() => setHoveredIndex(index)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          {/* Animated background */}
          <div className={`
            absolute inset-0 bg-gradient-to-r from-violet-600/20 to-purple-600/20 
            transform transition-transform duration-500 ease-out
            ${hoveredIndex === index ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}
          `} />
          
          {/* Ripple effect */}
          <div className="absolute inset-0 overflow-hidden rounded-2xl">
            <div className={`
              absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent
              transform -skew-x-12 transition-transform duration-700
              ${hoveredIndex === index ? 'translate-x-full' : '-translate-x-full'}
            `} />
          </div>
          
          <item.icon className="text-xl md:text-lg ml-4 md:ml-0 text-current flex-shrink-0 relative z-10 
                               transition-transform duration-300 group-hover:scale-110" />
          <span className="ml-4 md:hidden font-semibold text-current relative z-10 
                          transition-all duration-300 group-hover:translate-x-1">{item.label}</span>
          
          {/* Active indicator */}
          {index === 0 && (
            <div className="absolute right-2 md:right-1 w-2 h-2 bg-violet-400 rounded-full animate-pulse shadow-lg shadow-violet-400/50" />
          )}
          
          {/* Tooltip for desktop */}
          <div className={`
            absolute left-20 bg-slate-900/95 backdrop-blur-md text-white 
            px-4 py-3 rounded-xl text-sm font-medium
            transition-all duration-300 pointer-events-none hidden md:block 
            border border-violet-500/30 shadow-xl shadow-violet-500/10 z-50
            ${hoveredIndex === index ? 'opacity-100 translate-x-2' : 'opacity-0 translate-x-0'}
          `}>
            {item.label}
            <div className="absolute left-0 top-1/2 transform -translate-x-1 -translate-y-1/2 
                           w-2 h-2 bg-slate-900 rotate-45 border-l border-b border-violet-500/30" />
          </div>
        </button>
      </Link>
    ))}
  </div>
  
  {/* Divider with gradient */}
  <div className="w-full px-6 md:px-3 my-6">
    <div className="h-px bg-gradient-to-r from-transparent via-violet-500/30 to-transparent" />
  </div>
  
  {/* Profile Section */}
  <div className="w-full px-6 md:px-3">
    <Link to="/profile">
      <div className="group relative flex md:justify-center items-center p-4 rounded-2xl 
                     hover:bg-gradient-to-r hover:from-violet-600/20 hover:to-purple-600/20 
                     transition-all duration-500 border border-transparent 
                     hover:border-violet-400/40 hover:shadow-lg hover:shadow-violet-500/20
                     transform hover:scale-105 cursor-pointer">
        <div className="relative">
          <img
            src={getUserAvatar()}
            alt="Profile"
            className="w-12 h-12 rounded-full border-2 border-violet-400/60 
                       shadow-lg group-hover:shadow-violet-400/60 
                       transition-all duration-500 group-hover:border-violet-300
                       group-hover:scale-110 object-cover"
          />
          {/* Online indicator with enhanced animation */}
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full 
                         border-2 border-slate-800 shadow-lg shadow-emerald-400/50">
            <div className="absolute inset-0 bg-emerald-400 rounded-full animate-ping opacity-75" />
          </div>
        </div>
        
        <div className="ml-4 md:hidden flex-1">
          <p className="text-white font-semibold text-lg leading-tight
                       bg-gradient-to-r from-white to-violet-200 bg-clip-text text-transparent">
            {profile.username}
          </p>
          <p className="text-violet-300 text-sm font-medium flex items-center mt-1">
            {stats.isVip ? (
              <>
                <span className="w-2 h-2 bg-yellow-400 rounded-full mr-2 animate-pulse" />
                VIP Member
              </>
            ) : (
              <>
                <span className="w-2 h-2 bg-violet-400 rounded-full mr-2" />
                Standard User
              </>
            )}
          </p>
        </div>
        
        {stats.isVip && (
          <FaCrown className="ml-auto md:hidden text-yellow-400 text-xl 
                            transition-all duration-300 group-hover:text-yellow-300 
                            group-hover:rotate-12 group-hover:scale-110
                            drop-shadow-lg" />
        )}

        {/* Desktop VIP indicator */}
        {stats.isVip && (
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-400/20 rounded-full 
                         border border-yellow-400/60 hidden md:flex items-center justify-center
                         animate-pulse">
            <FaCrown className="text-yellow-400 text-xs" />
          </div>
        )}
        
        {/* Profile tooltip for desktop */}
        <div className="absolute left-20 bg-slate-900/95 backdrop-blur-md text-white 
                       px-4 py-3 rounded-xl text-sm font-medium
                       opacity-0 group-hover:opacity-100 transition-all duration-300 
                       pointer-events-none hidden md:block 
                       border border-violet-500/30 shadow-xl shadow-violet-500/10 z-50
                       min-w-max">
          <div className="font-semibold">{profile.username}</div>
          <div className="text-xs text-violet-300 mt-1">
            {stats.isVip ? '👑 VIP Member' : 'Standard User'}
          </div>
          <div className="absolute left-0 top-1/2 transform -translate-x-1 -translate-y-1/2 
                         w-2 h-2 bg-slate-900 rotate-45 border-l border-b border-violet-500/30" />
        </div>
      </div>
    </Link>
  </div>
</aside>

<style jsx>{`
  @keyframes slideInLeft {
    from {
      opacity: 0;
      transform: translateX(-30px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
  
  .mask-gradient {
    mask: linear-gradient(180deg, transparent, black 10px, black calc(100% - 10px), transparent);
  }
`}</style>
      {/* Floating Toggle Button */}
      <button
        className={`
          fixed bottom-6 left-6 z-50 w-14 h-14 
          bg-gradient-to-r from-violet-600 to-purple-600 rounded-full 
          shadow-lg shadow-violet-500/40 flex items-center justify-center 
          hover:shadow-xl hover:shadow-violet-500/60 transition-all duration-300 
          transform hover:scale-110 active:scale-95 md:hidden
          border border-violet-400/30 hover:border-violet-300
          ${sidebarOpen ? "rotate-180" : "rotate-0"}
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
                <div className="w-12 h-12 text-4xl bg-gradient-to-r from-yellow-300 to-orange-300 rounded-full flex items-center justify-center shadow-md">
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
                <MiningSection />
              </div>
            </div>

            {/* Notifications */}
            <div className="group bg-slate-800/70 backdrop-blur-xl border border-violet-500/30 rounded-2xl p-6 shadow-xl hover:shadow-2xl hover:shadow-violet-500/20 transition-all duration-500 hover:bg-slate-800/80 min-h-[350px] relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-cyan-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />
              <div className="relative z-10 h-full">
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
                <Achievements />
              </div>
            </div>

            {/* Streak Grid */}
            <div className="group bg-slate-800/70 backdrop-blur-xl border border-violet-500/30 rounded-2xl p-6 shadow-xl hover:shadow-2xl hover:shadow-violet-500/20 transition-all duration-500 hover:bg-slate-800/80 h-[350px] relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-600/5 to-red-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />
              <div className="relative z-10 h-full">
                {/* <h2 className="text-xl font-bold text-violet-300 mb-4 flex items-center gap-3">
                  🔥 Your Streak
                  <div className="px-2 py-1 bg-orange-500/20 border border-orange-500/30 rounded-full text-xs text-orange-400 font-semibold">
                    HOT
                  </div>
                </h2> */}
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
