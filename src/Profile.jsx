import React from "react";
import { FaCoins, FaUserFriends, FaCircle, FaShareAlt, FaBackward } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const navigate = useNavigate();

  // Example static data - replace with your real user data from API or context
  const user = {
    name: "John Doe",
    email: "john.doe@example.com",
    avatar: "https://randomuser.me/api/portraits/men/75.jpg",
    coinsEarned: 125,
    referralCode: "COLLAB123",
    mining: true,
    lastActive: "2 mins ago",
    joined: "2025-06-01",
    totalReferrals: 8,
  };

  const handleShare = () => {
    navigator.clipboard.writeText(`Join CollabriaNexus with my code: ${user.referralCode}`);
    alert("Referral code copied! 🚀");
  };

  return (
    <div className="min-h-screen bg-[#101018] text-white pt-20 px-4 sm:px-6 lg:px-12">
      

      {/* Profile Header */}
      <div className="flex flex-col items-center text-center mb-8">
        <img
          src={user.avatar}
          alt={user.name}
          className="w-28 h-28 rounded-full border-4 border-violet-400 shadow-lg"
        />
        <h1 className="text-3xl font-bold mt-4">{user.name}</h1>
        <p className="text-gray-400">{user.email}</p>

        {/* Status */}
        {user.mining ? (
          <span className="flex items-center gap-2 text-green-400 font-medium mt-2">
            <FaCircle className="text-xs" /> Active
          </span>
        ) : (
          <span className="flex items-center gap-2 text-gray-400 font-medium mt-2">
            <FaCircle className="text-xs" /> Last Active: {user.lastActive}
          </span>
        )}
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <div className="bg-[#181828] p-5 rounded-xl shadow-lg text-center border border-violet-300/20">
          <FaCoins className="text-3xl text-yellow-400 mx-auto mb-2" />
          <h2 className="text-xl font-bold">{user.coinsEarned}</h2>
          <p className="text-gray-400">Coins Earned</p>
        </div>
        <div className="bg-[#181828] p-5 rounded-xl shadow-lg text-center border border-violet-300/20">
          <FaUserFriends className="text-3xl text-blue-400 mx-auto mb-2" />
          <h2 className="text-xl font-bold">{user.totalReferrals}</h2>
          <p className="text-gray-400">Referrals</p>
        </div>
        <div className="bg-[#181828] p-5 rounded-xl shadow-lg text-center border border-violet-300/20">
          <FaShareAlt className="text-3xl text-pink-400 mx-auto mb-2" />
          <h2 className="text-xl font-bold">{user.referralCode}</h2>
          <p className="text-gray-400">Referral Code</p>
        </div>
      </div>

      {/* Referral Button */}
      <div className="flex justify-center mb-8">
        <button
          onClick={handleShare}
          className="px-6 py-3 bg-violet-600 hover:bg-violet-500 rounded-lg text-white font-medium shadow-md flex items-center gap-2"
        >
          <FaShareAlt /> Share Referral Code
        </button>
      </div>

      {/* Joined date */}
      <p className="text-center text-gray-400">Joined: {user.joined}</p>
    </div>
  );
}
