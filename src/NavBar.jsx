import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaHome, FaBook, FaInfoCircle, FaChartBar, FaBars, FaTimes  } from "react-icons/fa";
import Logo from './assets/LOGO.png';

export default function NavBar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      setScrolled(isScrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setOpen(false);
  }, [location]);

  const navItems = [
    { to: "/", label: "Home", icon: <FaHome /> },
    { to: "/blog", label: "Blogs", icon: <FaBook /> },
    { to: "/about", label: "About Us", icon: <FaInfoCircle /> },
    { to: "/dashboard", label: "Dashboard", icon: <FaChartBar /> },
  ];

  const isActiveRoute = (path) => {
    return location.pathname === path;
  };

  return (
    <>
      <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled 
          ? 'glass-scrolled border-b border-violet-300/40 shadow-2xl backdrop-blur-xl' 
          : 'glass border-b border-violet-300/30 shadow-lg backdrop-blur-md'
      } rounded-b-2xl`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">
          
          {/* Logo Section */}
          <Link to="/" className="flex items-center group">
            <div className="relative">
              <img 
                className="w-[50px] transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3" 
                src={Logo} 
                alt="Logo" 
              />
              <div className="absolute inset-0 w-[50px] h-[50px] rounded-full bg-gradient-to-r from-violet-400/20 to-purple-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-lg"></div>
            </div>
            <span className="ml-3 text-xl font-bold gradient-text group-hover:scale-105 transition-transform duration-300">
              CollabriaNexus
            </span>
          </Link>

          {/* Desktop Menu */}
          <ul className="hidden md:flex items-center space-x-1 font-medium">
            {navItems.map((item, idx) => (
              <li key={idx}>
                <Link
                  to={item.to}
                  className={`relative px-4 py-2 rounded-xl transition-all duration-300 group flex items-center gap-2 ${
                    isActiveRoute(item.to)
                      ? 'text-violet-300 bg-violet-500/20 shadow-lg'
                      : 'text-white hover:text-violet-300 hover:bg-violet-500/10'
                  }`}
                >
                  <span className={`transition-transform duration-300 ${
                    isActiveRoute(item.to) ? 'scale-110' : 'group-hover:scale-110'
                  }`}>
                    {item.icon}
                  </span>
                  <span className="relative">
                    {item.label}
                    {isActiveRoute(item.to) && (
                      <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-violet-400 to-purple-400 rounded-full"></span>
                    )}
                  </span>
                </Link>
              </li>
            ))}
          </ul>

          {/* Enhanced Hamburger Button */}
          <button
            className="md:hidden relative flex flex-col justify-center items-center w-10 h-10 rounded-lg hover:bg-violet-500/20 transition-colors duration-300"
            onClick={() => setOpen(!open)}
            aria-label="Toggle navigation"
          >
            {open ? (
              <FaTimes className="text-white text-xl transition-transform duration-300 rotate-180" />
            ) : (
              <FaBars className="text-white text-xl transition-transform duration-300" />
            )}
          </button>
        </div>

        {/* Enhanced Mobile Menu */}
        <div className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          open ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <ul className="bg-gradient-to-b from-[#181828] to-[#0f0f1a] border-t border-violet-300/20 shadow-2xl rounded-b-2xl px-4 py-4 font-medium text-white">
            {navItems.map((item, idx) => (
              <li key={idx} className="border-b border-violet-300/10 last:border-none">
                <Link
                  to={item.to}
                  className={`flex items-center gap-3 py-4 px-3 rounded-xl transition-all duration-300 group ${
                    isActiveRoute(item.to)
                      ? 'bg-violet-500/20 text-violet-300 shadow-lg transform translate-x-2'
                      : 'hover:bg-violet-500/20 hover:text-violet-300 hover:transform hover:translate-x-2'
                  }`}
                  onClick={() => setOpen(false)}
                >
                  <span className={`text-lg transition-all duration-300 ${
                    isActiveRoute(item.to) 
                      ? 'text-violet-400 scale-110' 
                      : 'group-hover:text-violet-400 group-hover:scale-110'
                  }`}>
                    {item.icon}
                  </span>
                  <span className="relative">
                    {item.label}
                    {isActiveRoute(item.to) && (
                      <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-violet-400 to-purple-400 rounded-full"></span>
                    )}
                  </span>
                  {isActiveRoute(item.to) && (
                    <span className="ml-auto w-2 h-2 bg-violet-400 rounded-full animate-pulse"></span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* Mobile Menu Backdrop */}
      {open && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Enhanced Styles */}
      <style jsx>{`
        .glass {
          background: rgba(24, 24, 40, 0.85);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
        }
        
        .glass-scrolled {
          background: rgba(15, 15, 26, 0.95);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
        }
        
        .gradient-text {
          background: linear-gradient(135deg, #a855f7, #ec4899, #06b6d4);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: gradient-shift 3s ease-in-out infinite;
        }
        
        @keyframes gradient-shift {
          0%, 100% { 
            background: linear-gradient(135deg, #a855f7, #ec4899, #06b6d4);
            -webkit-background-clip: text;
            background-clip: text;
          }
          50% { 
            background: linear-gradient(135deg, #06b6d4, #a855f7, #ec4899);
            -webkit-background-clip: text;
            background-clip: text;
          }
        }
        
        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translate3d(0, -20px, 0);
          }
          to {
            opacity: 1;
            transform: translate3d(0, 0, 0);
          }
        }
        
        .animate-fadeInDown {
          animation: fadeInDown 0.3s ease-out;
        }
        
        /* Smooth scrollbar for mobile menu */
        .overflow-y-auto::-webkit-scrollbar {
          width: 4px;
        }
        
        .overflow-y-auto::-webkit-scrollbar-track {
          background: rgba(139, 92, 246, 0.1);
          border-radius: 2px;
        }
        
        .overflow-y-auto::-webkit-scrollbar-thumb {
          background: rgba(139, 92, 246, 0.5);
          border-radius: 2px;
        }
        
        .overflow-y-auto::-webkit-scrollbar-thumb:hover {
          background: rgba(139, 92, 246, 0.7);
        }
      `}</style>
    </>
  );
}