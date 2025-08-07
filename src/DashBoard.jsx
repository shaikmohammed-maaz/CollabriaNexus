import React from "react";
import { FaHome, FaUserFriends, FaNewspaper } from "react-icons/fa";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-background text-text flex py-10">
      {/* Sidebar */}
      <aside
        className="sticky top-20 h-[calc(100vh-5rem-5rem)] w-16 bg-[#181828] flex flex-col items-center justify-between py-6 shadow-lg rounded-xl ml-2"
        style={{ maxHeight: "calc(100vh - 5rem - 5rem)" }} // Adjust if your NavBar/Footer height changes
      >
        <div className="flex flex-col gap-8 justify-center flex-1">
          <button className="text-violet-400 hover:text-violet-300 transition text-2xl">
            <FaHome />
          </button>
          <button className="text-violet-400 hover:text-violet-300 transition text-2xl">
            <FaUserFriends />
          </button>
          <button className="text-violet-400 hover:text-violet-300 transition text-2xl">
            <FaNewspaper />
          </button>
        </div>
        <div className="mb-2">
          <img
            src="https://randomuser.me/api/portraits/men/32.jpg"
            alt="Profile"
            className="w-10 h-10 rounded-full border-2 border-violet-400 shadow"
          />
        </div>
      </aside>

      {/* Main Content shifted right for sidebar, and with vertical padding */}
      <div className="flex-1 ml-20 flex flex-col">
        

        {/* Main Content Area */}
        <main className="flex-1 p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Right Side - Two Taller Cards */}
          <div className="flex flex-col gap-6 md:col-span-2">
            <div className="card p-4 h-[350px] shadow-card flex items-center justify-center text-center">
              <p className="text-text-muted">City Park 10K Run</p>
            </div>
            <div className="card p-4 h-[220px] shadow-card flex items-center justify-center text-center">
              <p className="text-text-muted">Average Speed</p>
            </div>
          </div>
          {/* Top Left - Two Rectangular Cards */}
          <div className="flex flex-col gap-6 md:col-span-1">
            <div className="card p-4 h-[350px] shadow-card flex items-center justify-center text-center">
              <p className="text-text-muted">Your daily goal progress</p>
            </div>
            <div className="card p-4 h-[220px] shadow-card flex items-center justify-center text-center">
              <p className="text-text-muted">Team Race Log</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
