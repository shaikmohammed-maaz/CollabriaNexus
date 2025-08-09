import React, { useState } from "react";
import { FaCircle, FaBell } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function Friends() {
  const navigate = useNavigate();

  const [friends, setFriends] = useState([
    {
      id: 1,
      name: "John Doe",
      avatar: "https://randomuser.me/api/portraits/men/10.jpg",
      mining: true,
      lastActive: "2 mins ago",
      joined: "2025-07-01",
      coinsEarned: 35,
    },
    {
      id: 2,
      name: "Sarah Parker",
      avatar: "https://randomuser.me/api/portraits/women/22.jpg",
      mining: false,
      lastActive: "3 hours ago",
      joined: "2025-06-15",
      coinsEarned: 12,
    },
    {
      id: 3,
      name: "Michael Smith",
      avatar: "https://randomuser.me/api/portraits/men/45.jpg",
      mining: false,
      lastActive: "1 day ago",
      joined: "2025-07-20",
      coinsEarned: 7,
    },
  ]);

  const handlePoke = (name) => {
    alert(`You poked ${name}! 🚀`);
  };

  return (
    <div className="min-h-screen bg-background text-text pt-20 px-4 sm:px-6 lg:px-12 relative">

      <h1 className="text-3xl font-bold text-violet-400 mb-6 pl-20">
        Your Referral Network
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {friends.map((friend) => (
          <div
            key={friend.id}
            className="card p-5 rounded-xl shadow-lg bg-[#181828] border border-violet-300/20 flex flex-col items-center text-center"
          >
            <img
              src={friend.avatar}
              alt={friend.name}
              className="w-20 h-20 rounded-full border-2 border-violet-400 shadow-md mb-3"
            />
            <h2 className="text-lg font-semibold text-white">{friend.name}</h2>

            {friend.mining ? (
              <span className="flex items-center gap-2 text-green-400 font-medium mt-2">
                <FaCircle className="text-xs" /> Active
              </span>
            ) : (
              <span className="flex items-center gap-2 text-gray-400 font-medium mt-2">
                <FaCircle className="text-xs" /> Last Active: {friend.lastActive}
              </span>
            )}

            <p className="text-violet-300 mt-2">
              💰 Coins Earned: {friend.coinsEarned}
            </p>
            <p className="text-xs text-gray-500">Joined: {friend.joined}</p>

            {!friend.mining && (
              <button
                onClick={() => handlePoke(friend.name)}
                className="mt-4 px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white rounded-lg flex items-center gap-2 shadow-md"
              >
                <FaBell /> Poke
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
