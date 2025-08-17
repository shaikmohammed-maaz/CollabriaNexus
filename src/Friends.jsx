import React, { useState, useEffect } from "react";
import { 
  FaCircle, 
  FaBell, 
  FaUserPlus, 
  FaShare, 
  FaSearch, 
  FaFilter,
  FaCrown,
  FaFire,
  FaGift,
  FaChartLine,
  FaCopy,
  FaUsers
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useAuth } from './Services/AuthContext';
import { getReferredFriends, getNetworkStats, pokeFriend } from './Services/socialService';

export default function Friends() {
  const navigate = useNavigate();
  const { currentUser, userProfile } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [friends, setFriends] = useState([]);
  const [networkStats, setNetworkStats] = useState({
    totalFriends: 0,
    activeNow: 0,
    networkCoins: 0,
    vipMembers: 0,
    referralCode: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch friends and network stats
  useEffect(() => {
    if (!currentUser) {
      setLoading(false);
      return;
    }

    const loadFriendsData = async () => {
      try {
        setLoading(true);
        
        // Get referred friends (users you referred)
        const friendsResult = await getReferredFriends(currentUser.uid);
        if (friendsResult.success) {
          setFriends(friendsResult.friends);
        } else {
          setError(friendsResult.error);
        }
        
        // Get network stats
        const statsResult = await getNetworkStats(currentUser.uid);
        if (statsResult.success) {
          setNetworkStats(statsResult.stats);
        }
        
      } catch (err) {
        console.error('Error loading friends data:', err);
        setError('Failed to load friends data');
      } finally {
        setLoading(false);
      }
    };

    loadFriendsData();
  }, [currentUser]);

  const handlePoke = async (friend) => {
    if (!currentUser) return;

    // Add animation class temporarily
    const friendElement = document.getElementById(`friend-${friend.id}`);
    if (friendElement) {
      friendElement.classList.add('animate-pulse');
      setTimeout(() => {
        friendElement.classList.remove('animate-pulse');
      }, 1000);
    }
    
    try {
      const result = await pokeFriend(currentUser.uid, friend.id, friend.name);
      if (result.success) {
        alert(`You poked ${friend.name}! 🚀 They'll get a notification to start mining!`);
      } else {
        alert('Failed to poke friend. Please try again.');
      }
    } catch (error) {
      console.error('Error poking friend:', error);
      alert('Failed to poke friend. Please try again.');
    }
  };

  const handleCopyReferralCode = () => {
    const referralCode = userProfile?.profile?.referralCode || networkStats.referralCode;
    if (referralCode) {
      navigator.clipboard.writeText(referralCode);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    } else {
      alert('Referral code not available');
    }
  };

  const filteredFriends = friends.filter(friend => {
    const matchesSearch = friend.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = 
      filterStatus === "all" ||
      (filterStatus === "active" && friend.mining) ||
      (filterStatus === "inactive" && !friend.mining) ||
      (filterStatus === "vip" && friend.isVip);
    
    return matchesSearch && matchesFilter;
  });

  // Show loading state
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 text-white pt-20 px-4 sm:px-6 lg:px-12 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Please log in to view your referral network</h2>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 text-white pt-20 px-4 sm:px-6 lg:px-12 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-400 mx-auto mb-4"></div>
          <p className="text-slate-400">Loading your referral network...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 text-white pt-20 px-4 sm:px-6 lg:px-12 relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-32 left-20 w-64 h-64 bg-violet-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-32 right-20 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      {/* Error Display */}
      {error && (
        <div className="relative z-10 mb-4 bg-red-500/20 border border-red-500 text-red-300 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Header Section */}
      <div className="relative z-10 mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent mb-2">
              Your Referral Network 🌐
            </h1>
            <p className="text-slate-400 flex items-center gap-2">
              <FaUsers className="text-violet-400" />
              Build your team and earn together
            </p>
          </div>
          
          <button
            onClick={() => setShowInviteModal(true)}
            className="px-6 py-3 bg-gradient-to-r from-violet-600 to-purple-600 rounded-xl font-semibold shadow-lg hover:shadow-violet-500/30 transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
          >
            <FaUserPlus />
            Invite Friends
          </button>
        </div>

        {/* Network Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-slate-800/60 backdrop-blur-xl border border-violet-500/20 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Total Friends</p>
                <p className="text-2xl font-bold text-violet-400">{networkStats.totalFriends}</p>
              </div>
              <FaUsers className="text-violet-400 text-2xl" />
            </div>
          </div>
          
          <div className="bg-slate-800/60 backdrop-blur-xl border border-green-500/20 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Active Now</p>
                <p className="text-2xl font-bold text-green-400">{networkStats.activeNow}</p>
              </div>
              <FaCircle className="text-green-400 text-2xl" />
            </div>
          </div>
          
          <div className="bg-slate-800/60 backdrop-blur-xl border border-yellow-500/20 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Network Coins</p>
                <p className="text-2xl font-bold text-yellow-400">{networkStats.networkCoins.toLocaleString()}</p>
              </div>
              <FaChartLine className="text-yellow-400 text-2xl" />
            </div>
          </div>
          
          <div className="bg-slate-800/60 backdrop-blur-xl border border-purple-500/20 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">VIP Members</p>
                <p className="text-2xl font-bold text-purple-400">{networkStats.vipMembers}</p>
              </div>
              <FaCrown className="text-purple-400 text-2xl" />
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="relative z-10 mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search friends..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-slate-800/60 backdrop-blur-xl border border-violet-500/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition-all duration-300"
          />
        </div>
        
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-3 bg-slate-800/60 backdrop-blur-xl border border-violet-500/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition-all duration-300"
        >
          <option value="all">All Friends</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="vip">VIP Members</option>
        </select>
      </div>

      {/* Friends Grid */}
      <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredFriends.map((friend, index) => (
          <div
            key={friend.id}
            id={`friend-${friend.id}`}
            className="group bg-slate-800/60 backdrop-blur-xl border border-violet-500/20 rounded-2xl p-6 shadow-xl hover:shadow-2xl hover:shadow-violet-500/20 transition-all duration-500 transform hover:scale-105 hover:bg-slate-800/80 relative overflow-hidden"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {/* Background Glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-violet-600/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />
            
            {/* VIP Badge */}
            {friend.isVip && (
              <div className="absolute top-3 right-3 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full p-1">
                <FaCrown className="text-white text-xs" />
              </div>
            )}

            <div className="relative z-10 text-center">
              {/* Avatar with Status */}
              <div className="relative inline-block mb-4">
                <img
                  src={friend.avatar}
                  alt={friend.name}
                  className="w-20 h-20 rounded-full border-3 border-violet-400 shadow-lg group-hover:shadow-violet-400/50 transition-all duration-300"
                />
                <div className={`
                  absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-3 border-slate-800 flex items-center justify-center text-xs
                  ${friend.mining ? 'bg-green-500 animate-pulse' : 'bg-gray-500'}
                `}>
                  {friend.mining ? '⚡' : '💤'}
                </div>
              </div>

              {/* Name and Level */}
              <h2 className="text-lg font-bold text-white mb-1 group-hover:text-violet-300 transition-colors">
                {friend.name}
              </h2>
              
              <div className="flex items-center justify-center gap-2 mb-3">
                <span className="px-2 py-1 bg-violet-600/20 border border-violet-500/30 rounded-full text-xs text-violet-300">
                  Level {friend.level}
                </span>
                {friend.streak > 0 && (
                  <span className="px-2 py-1 bg-orange-600/20 border border-orange-500/30 rounded-full text-xs text-orange-300 flex items-center gap-1">
                    <FaFire /> {friend.streak}
                  </span>
                )}
              </div>

              {/* Status */}
              {friend.mining ? (
                <div className="flex items-center justify-center gap-2 text-green-400 font-medium mb-3">
                  <FaCircle className="text-xs animate-pulse" />
                  <span>Mining Active</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2 text-slate-400 font-medium mb-3">
                  <FaCircle className="text-xs" />
                  <span className="text-xs">Last seen: {friend.lastActive}</span>
                </div>
              )}

              {/* Stats */}
              <div className="grid grid-cols-1 gap-2 mb-4">
                <div className="bg-slate-700/50 rounded-lg p-2">
                  <div className="text-yellow-400 font-bold text-sm">💰 {friend.coinsEarned.toLocaleString()}</div>
                  <div className="text-xs text-slate-400">Coins Earned</div>
                </div>
              </div>

              <p className="text-xs text-slate-500 mb-4">Joined: {friend.joined}</p>

              {/* Action Buttons */}
              <div className="space-y-2">
                {!friend.mining && (
                  <button
                    onClick={() => handlePoke(friend)}
                    className="w-full px-4 py-2 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white rounded-lg flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                  >
                    <FaBell className="animate-bounce" />
                    Poke to Mine
                  </button>
                )}
                
                {/* TODO: Implement send gift functionality */}
                <button 
                  disabled
                  className="w-full px-4 py-2 bg-slate-700/50 text-slate-500 rounded-lg flex items-center justify-center gap-2 cursor-not-allowed border border-slate-600/50"
                >
                  <FaGift />
                  Send Gift (Coming Soon)
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredFriends.length === 0 && !loading && (
        <div className="relative z-10 text-center py-12">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-slate-300 mb-2">
            {friends.length === 0 ? "No referrals yet" : "No friends found"}
          </h3>
          <p className="text-slate-400 mb-6">
            {friends.length === 0 
              ? "Invite friends using your referral code to build your network"
              : "Try adjusting your search or filter criteria"
            }
          </p>
          {friends.length === 0 ? (
            <button
              onClick={() => setShowInviteModal(true)}
              className="px-6 py-3 bg-violet-600 hover:bg-violet-500 rounded-lg text-white transition-all duration-300"
            >
              Invite Friends
            </button>
          ) : (
            <button
              onClick={() => {
                setSearchTerm("");
                setFilterStatus("all");
              }}
              className="px-6 py-3 bg-violet-600 hover:bg-violet-500 rounded-lg text-white transition-all duration-300"
            >
              Clear Filters
            </button>
          )}
        </div>
      )}

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 border border-violet-500/30 rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <div className="text-center mb-6">
              <div className="text-4xl mb-2">🚀</div>
              <h2 className="text-xl font-bold text-white mb-2">Invite Friends</h2>
              <p className="text-slate-400">Share your referral code and earn together!</p>
            </div>

            <div className="space-y-4">
              <div className="bg-slate-700/50 rounded-lg p-4 border border-violet-500/20">
                <p className="text-sm text-slate-400 mb-2">Your Referral Code</p>
                <div className="flex items-center justify-between">
                  <code className="text-lg font-bold text-violet-400 bg-slate-800 px-3 py-1 rounded">
                    {userProfile?.profile?.referralCode || networkStats.referralCode || 'Loading...'}
                  </code>
                  <button
                    onClick={handleCopyReferralCode}
                    className={`p-2 rounded-lg transition-all duration-300 ${
                      copiedCode 
                        ? 'bg-green-600 text-white' 
                        : 'bg-violet-600 hover:bg-violet-500 text-white'
                    }`}
                  >
                    {copiedCode ? '✓' : <FaCopy />}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={() => {
                    const referralCode = userProfile?.profile?.referralCode || networkStats.referralCode;
                    const shareText = `Join me on MineVerse and start earning! Use my referral code: ${referralCode}`;
                    if (navigator.share) {
                      navigator.share({ text: shareText });
                    } else {
                      navigator.clipboard.writeText(shareText);
                      alert('Referral message copied to clipboard!');
                    }
                  }}
                  className="px-4 py-3 bg-blue-600 hover:bg-blue-500 rounded-lg text-white font-medium transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <FaShare />
                  Share
                </button>
                <button
                  onClick={() => setShowInviteModal(false)}
                  className="px-4 py-3 bg-slate-700 hover:bg-slate-600 rounded-lg text-white font-medium transition-all duration-300"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
