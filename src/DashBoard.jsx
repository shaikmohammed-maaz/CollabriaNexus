import React, { useState } from "react";
import StreakGrid from "./StreakGrid";
import Notifications from "./Notifications";
import Achievements from "./Achievements";
import MiningSection from "./MiningDashboard";
import {
  FaHome,
  FaUserFriends,
  FaNewspaper,
  FaTachometerAlt,
} from "react-icons/fa";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-text flex pt-20 py-10 relative">
      {/* Sidebar */}
      <aside
        className={`
          fixed md:sticky top-20
          h-[calc(100vh-5rem-5rem)] 
          w-28 md:w-16 bg-[#181828] flex flex-col items-center justify-between py-4 shadow-lg rounded-xl ml-2
          transition-transform duration-300 z-40
          ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
          }
        `}
        style={{ maxHeight: "calc(100vh - 5rem - 5rem)" }}
      >
        <div className="flex flex-col gap-8 justify-center flex-1">
          <Link to="/dashboard" className="block mb-6">
          <button className="text-violet-400 hover:text-violet-300 transition text-2xl">            
              <FaHome />            
          </button>
          </Link>
          <Link to="/friends" className="block">
            <button className="text-violet-400 hover:text-violet-300 transition text-2xl">
              <FaUserFriends />
            </button>
          </Link>
          <Link to="/blog" className="block">
          <button className="text-violet-400 hover:text-violet-300 transition text-2xl">            
              <FaNewspaper />
          </button>
          </Link>
        </div>
        <Link to="/profile" className="block mb-6">
        <div className="mb-6 md:mb-2">
          <img
            src="https://randomuser.me/api/portraits/men/32.jpg"
            alt="Profile"
            className="w-10 h-10 rounded-full border-2 border-violet-400 shadow"
          />
        </div>
        </Link>
      </aside>

      {/* Floating Toggle Button */}
      <button
        className="fixed bottom-6 left-6 z-50 w-12 h-12 bg-violet-100 rounded-lg shadow-lg flex items-center justify-center hover:bg-violet-600 transition md:hidden"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        <FaTachometerAlt style={{ color: "#4c1d95", fontSize: "1.5rem" }} />
      </button>

      {/* Main Content */}
      <div className="flex-1 md:ml-4 flex flex-col">
        {/* Welcome Message */}
        <div className="px-4 sm:px-6 pb-4">
          <h1 className="text-2xl font-bold text-violet-400">Welcome, Alex!</h1>
        </div>

        <main className="flex-1 p-3 sm:p-6 grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {/* Right Side - Two Taller Cards */}
          <div className="flex flex-col gap-4 sm:gap-6 md:col-span-2">
            <div className="card p-4 shadow-card flex flex-col items-center justify-center text-center h-[calc(100vh-5rem)] md:h-[350px]">
              <h2 className="text-lg font-bold text-left mb-4 text-accent">
                Mining Dashboard
              </h2>
              <MiningSection />
            </div>
            <div className="card p-4 h-[320px] shadow-card flex flex-col items-center justify-center text-center">
              <h2 className="text-lg font-bold mb-4 text-accent">
                Notifications
              </h2>
              <Notifications />
            </div>
          </div>

          {/* Top Left - Two Rectangular Cards */}
          <div className="flex flex-col gap-4 sm:gap-6 md:col-span-1">
            <div className="card p-4 h-[350px] shadow-card flex flex-col items-center justify-center text-center">
              <h2 className="text-lg font-bold mb-4 text-accent">
                Achievements
              </h2>
              <Achievements />
            </div>
            <div className="card p-4 h-[320px] shadow-card flex flex-col items-center justify-center text-center">
              <h2 className="text-lg font-bold mb-4 text-accent">
                Your Streak
              </h2>
              <StreakGrid />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
