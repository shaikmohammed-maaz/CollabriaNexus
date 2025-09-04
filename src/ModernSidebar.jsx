import React, { useState } from 'react';
import { 
  FaHome, 
  FaUsers, 
  FaComments, 
  FaTimes, 
  FaCrown,
  FaInfinity,
  FaBars
} from 'react-icons/fa';

const ModernSidebar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const navItems = [
    { icon: FaHome, label: 'Dashboard', path: '/', active: true },
    { icon: FaUsers, label: 'Community', path: '/community' },
    { icon: FaComments, label: 'Messages', path: '/messages' },
    { icon: FaInfinity, label: 'Nexus', path: '/nexus' }
  ];

  const profile = {
    username: 'John Doe',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face&auto=format'
  };

  const stats = {
    isVip: true
  };

  return (
    <div className="relative">
      {/* Mobile menu button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed top-6 left-6 z-50 md:hidden p-3 bg-slate-900/90 backdrop-blur-md 
                   rounded-xl border border-violet-500/30 text-violet-300 hover:text-white
                   transition-all duration-300 hover:scale-110 shadow-lg"
      >
        <FaBars className="text-lg" />
      </button>

      {/* Backdrop for mobile */}
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
          bg-slate-900/95 backdrop-blur-2xl
          border border-violet-400/20 rounded-3xl
          flex flex-col justify-between py-8 
          shadow-2xl shadow-violet-500/20 hover:shadow-violet-500/30
          transition-all duration-700 ease-out z-40
          ${sidebarOpen ? "translate-x-0 opacity-100" : "-translate-x-full md:translate-x-0 opacity-0 md:opacity-100"}
          max-h-[80vh] overflow-hidden
          before:absolute before:inset-0 before:rounded-3xl before:p-[1px]
          before:bg-gradient-to-b before:from-violet-400/30 before:via-purple-500/20 before:to-transparent
          before:-z-10
        `}
        style={{
          background: 'linear-gradient(145deg, rgba(15, 23, 42, 0.95), rgba(30, 41, 59, 0.95))'
        }}
      >
        {/* Animated background elements */}
        <div className="absolute top-8 right-6 w-16 h-16 bg-gradient-to-br from-violet-500/10 to-purple-500/10 
                       rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-20 left-4 w-12 h-12 bg-gradient-to-br from-purple-500/10 to-pink-500/10 
                       rounded-full blur-lg animate-pulse" style={{ animationDelay: '1s' }}></div>
        
        {/* Subtle animated particles */}
        <div className="absolute top-1/4 left-8 w-2 h-2 bg-violet-400/30 rounded-full animate-ping" 
             style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-3/4 right-8 w-1 h-1 bg-purple-400/30 rounded-full animate-ping" 
             style={{ animationDelay: '3s' }}></div>

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
        <div className="w-full px-6 md:px-3 mb-8">
          <div className="flex items-center justify-center md:justify-center">
            <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl 
                           flex items-center justify-center shadow-lg shadow-violet-500/25
                           hover:shadow-violet-500/40 transition-all duration-300 hover:scale-105">
              <span className="text-white font-bold text-xl">∞</span>
            </div>
            <span className="ml-3 md:hidden text-white font-bold text-xl bg-gradient-to-r 
                           from-violet-200 to-purple-200 bg-clip-text text-transparent">
              CollabriaNexus
            </span>
          </div>
        </div>
        
        {/* Navigation Items */}
        <div className="flex flex-col gap-4 w-full px-6 md:px-3 flex-1">
          {navItems.map((item, index) => (
            <button 
              key={index}
              className={`
                group relative w-full md:w-14 h-14 flex items-center justify-start md:justify-center
                text-violet-300 hover:text-white transition-all duration-500
                rounded-2xl transform hover:scale-105 active:scale-95
                border border-transparent overflow-hidden
                ${item.active 
                  ? 'bg-gradient-to-r from-violet-600/40 to-purple-600/40 text-violet-100 border-violet-400/50 shadow-lg shadow-violet-500/20' 
                  : 'hover:bg-gradient-to-r hover:from-violet-600/30 hover:to-purple-600/30 hover:border-violet-400/40 hover:shadow-lg hover:shadow-violet-500/25'
                }
              `}
              style={{ 
                animationDelay: `${index * 150}ms`
              }}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {/* Animated background */}
              <div className={`
                absolute inset-0 bg-gradient-to-r from-violet-600/20 to-purple-600/20 
                transform transition-transform duration-500 ease-out rounded-2xl
                ${hoveredIndex === index ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}
              `} />
              
              {/* Shimmer effect */}
              <div className="absolute inset-0 overflow-hidden rounded-2xl">
                <div className={`
                  absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent
                  transform -skew-x-12 transition-transform duration-700
                  ${hoveredIndex === index ? 'translate-x-full' : '-translate-x-full'}
                `} />
              </div>
              
              <item.icon className="text-xl md:text-lg ml-4 md:ml-0 text-current flex-shrink-0 relative z-10 
                                 transition-all duration-300 group-hover:scale-110 group-hover:drop-shadow-lg" />
              <span className="ml-4 md:hidden font-semibold text-current relative z-10 
                              transition-all duration-300 group-hover:translate-x-1">{item.label}</span>
              
              {/* Active indicator */}
              {item.active && (
                <div className="absolute right-3 md:right-2 top-1/2 transform -translate-y-1/2">
                  <div className="w-2 h-2 bg-violet-400 rounded-full animate-pulse shadow-lg shadow-violet-400/50">
                    <div className="absolute inset-0 bg-violet-400 rounded-full animate-ping opacity-75"></div>
                  </div>
                </div>
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
          ))}
        </div>
        
        {/* Elegant divider */}
        <div className="w-full px-6 md:px-3 my-6">
          <div className="relative h-px">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-violet-500/30 to-transparent" />
            <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 
                           w-2 h-2 bg-violet-400/60 rounded-full shadow-lg shadow-violet-400/40" />
          </div>
        </div>
        
        {/* Enhanced Profile Section */}
        <div className="w-full px-6 md:px-3">
          <div className="group relative flex md:justify-center items-center p-4 rounded-2xl 
                         hover:bg-gradient-to-r hover:from-violet-600/20 hover:to-purple-600/20 
                         transition-all duration-500 border border-transparent 
                         hover:border-violet-400/40 hover:shadow-lg hover:shadow-violet-500/20
                         transform hover:scale-105 cursor-pointer">
            <div className="relative">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 
                             p-0.5 shadow-lg group-hover:shadow-violet-400/60 
                             transition-all duration-500 group-hover:scale-110">
                <img
                  src={profile.avatar}
                  alt="Profile"
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
              
              {/* Enhanced online indicator */}
              <div className="absolute -top-1 -right-1 w-4 h-4">
                <div className="w-4 h-4 bg-emerald-400 rounded-full border-2 border-slate-800 
                               shadow-lg shadow-emerald-400/50 animate-pulse">
                  <div className="absolute inset-0 bg-emerald-400 rounded-full animate-ping opacity-75" />
                </div>
              </div>

              {/* VIP crown for mobile */}
              {stats.isVip && (
                <div className="absolute -top-2 -left-2 w-6 h-6 bg-gradient-to-br from-yellow-400 to-orange-500 
                               rounded-full flex items-center justify-center shadow-lg shadow-yellow-400/40
                               md:hidden animate-pulse">
                  <FaCrown className="text-white text-xs" />
                </div>
              )}
            </div>
            
            <div className="ml-4 md:hidden flex-1">
              <p className="text-white font-semibold text-lg leading-tight
                           bg-gradient-to-r from-white to-violet-200 bg-clip-text text-transparent">
                {profile.username}
              </p>
              <p className="text-violet-300 text-sm font-medium flex items-center mt-1">
                {stats.isVip ? (
                  <>
                    <span className="w-2 h-2 bg-gradient-to-r from-yellow-400 to-orange-500 
                                   rounded-full mr-2 animate-pulse" />
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
            
            {/* Desktop VIP indicator */}
            {stats.isVip && (
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-yellow-400/20 to-orange-500/20 
                             rounded-full border border-yellow-400/60 hidden md:flex items-center justify-center
                             animate-pulse shadow-lg shadow-yellow-400/30">
                <FaCrown className="text-yellow-400 text-xs" />
              </div>
            )}
            
            {/* Enhanced profile tooltip for desktop */}
            <div className="absolute left-20 bg-slate-900/95 backdrop-blur-md text-white 
                           px-4 py-3 rounded-xl text-sm font-medium
                           opacity-0 group-hover:opacity-100 transition-all duration-300 
                           pointer-events-none hidden md:block 
                           border border-violet-500/30 shadow-xl shadow-violet-500/10 z-50
                           min-w-max">
              <div className="font-semibold flex items-center">
                {profile.username}
                {stats.isVip && <FaCrown className="text-yellow-400 text-xs ml-2" />}
              </div>
              <div className="text-xs text-violet-300 mt-1">
                {stats.isVip ? '👑 VIP Member' : 'Standard User'}
              </div>
              <div className="absolute left-0 top-1/2 transform -translate-x-1 -translate-y-1/2 
                             w-2 h-2 bg-slate-900 rotate-45 border-l border-b border-violet-500/30" />
            </div>
          </div>
        </div>

        {/* Bottom decorative element */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 
                       w-8 h-1 bg-gradient-to-r from-violet-500/40 to-purple-500/40 
                       rounded-full shadow-lg shadow-violet-500/20" />
      </aside>
    </div>
  );
};

export default ModernSidebar;