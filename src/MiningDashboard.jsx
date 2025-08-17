import React, { useState, useEffect, useRef } from "react";
import CubeAnimation from "./CubeAnimation";
import { useAuth } from "./Services/AuthContext"; // Import auth context
import {
  startMiningSession,
  updateMiningProgress,
  completeMiningSession,
  subscribeToMiningUpdates,
} from "./Services/miningService"; // Import mining services
import { updateUserStats } from "./Services/userService"; // Import user service
import { createMiningCompletionNotification } from "./Services/notificationService";

const ONE_DAY_MS = 24 * 60 * 60 * 1000;
const DAILY_REWARD = 3;
const RATE_PER_HOUR = DAILY_REWARD / 24;

const MiningSection = () => {
  const { currentUser, userProfile, setUserProfile } = useAuth();
  const [coinsMined, setCoinsMined] = useState(0);
  const [usdEquivalent, setUsdEquivalent] = useState(0);
  const [isMining, setIsMining] = useState(false);
  const [nextAvailable, setNextAvailable] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const intervalRef = useRef(null);
  const unsubscribeRef = useRef(null);

  // FIXED: More robust safe property access
  const stats = (userProfile && userProfile.stats) ? {
    coinsEarned: userProfile.stats.coinsEarned ?? 0,
    totalCoinsEarned: userProfile.stats.totalCoinsEarned ?? 0,
    level: userProfile.stats.level ?? 1,
    currentTier: userProfile.stats.currentTier ?? "Bronze Miner",
    nextTier: userProfile.stats.nextTier ?? "Silver Miner",
    tierProgress: userProfile.stats.tierProgress ?? 0,
    currentStreak: userProfile.stats.currentStreak ?? 0,
    totalMined: userProfile.stats.totalMined ?? 0,
    rank: userProfile.stats.rank ?? "#0",
    isVip: userProfile.stats.isVip ?? false,
  } : {
    coinsEarned: 0,
    totalCoinsEarned: 0,
    level: 1,
    currentTier: "Bronze Miner",
    nextTier: "Silver Miner",
    tierProgress: 0,
    currentStreak: 0,
    totalMined: 0,
    rank: "#0",
    isVip: false,
  };

  const mining = (userProfile && userProfile.mining) ? {
    isMining: userProfile.mining.isMining ?? false,
    lastMiningStart: userProfile.mining.lastMiningStart ?? null,
    coinsMined: userProfile.mining.coinsMined ?? 0,
    nextAvailable: userProfile.mining.nextAvailable ?? null,
    totalMiningSessions: userProfile.mining.totalMiningSessions ?? 0,
    miningRate: userProfile.mining.miningRate ?? 3.0,
  } : {
    isMining: false,
    lastMiningStart: null,
    coinsMined: 0,
    nextAvailable: null,
    totalMiningSessions: 0,
    miningRate: 3.0,
  };

  const profile = (userProfile && userProfile.profile) ? {
    referralCode: userProfile.profile.referralCode ?? "",
    username: userProfile.profile.username ?? "",
    email: userProfile.profile.email ?? "",
  } : {
    referralCode: "",
    username: "",
    email: "",
  };

  // Initialize mining state from Firebase
  useEffect(() => {
    if (currentUser && userProfile) {
      const miningData = mining; // Use safe mining object
      setIsMining(miningData.isMining || false);
      setCoinsMined(miningData.coinsMined || 0);
      setUsdEquivalent((miningData.coinsMined || 0) * 0.12);
      setNextAvailable(
        miningData.nextAvailable
          ? new Date(miningData.nextAvailable).getTime()
          : null
      );

      // Subscribe to real-time mining updates
      unsubscribeRef.current = subscribeToMiningUpdates(
        currentUser.uid,
        (miningUpdate) => {
          setIsMining(miningUpdate.isMining || false);
          setCoinsMined(miningUpdate.coinsMined || 0);
          setUsdEquivalent((miningUpdate.coinsMined || 0) * 0.12);
          setNextAvailable(
            miningUpdate.nextAvailable
              ? new Date(miningUpdate.nextAvailable).getTime()
              : null
          );
        }
      );

      // If mining was in progress, resume the interval
      if (miningData.isMining && miningData.lastMiningStart) {
        const startTime = new Date(
          miningData.lastMiningStart.seconds
            ? miningData.lastMiningStart.seconds * 1000
            : miningData.lastMiningStart
        );
        const elapsed = Date.now() - startTime.getTime();
        if (elapsed < ONE_DAY_MS) {
          resumeMining(startTime);
        } else {
          // Mining session expired, complete it
          handleCompleteMining(DAILY_REWARD);
        }
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
    };
  }, [currentUser, userProfile]);

  const resumeMining = (startTime) => {
    const ratePerMs = DAILY_REWARD / ONE_DAY_MS;

    intervalRef.current = setInterval(async () => {
      const elapsedMs = Date.now() - startTime.getTime();

      if (elapsedMs >= ONE_DAY_MS) {
        // Mining session completed
        clearInterval(intervalRef.current);
        await handleCompleteMining(DAILY_REWARD);
        return;
      }

      const mined = elapsedMs * ratePerMs;

      // Update Firebase every 10 seconds to reduce writes
      if (Math.floor(elapsedMs / 1000) % 10 === 0) {
        await updateMiningProgress(currentUser.uid, mined);
      }

      // Update local state every second
      setCoinsMined(parseFloat(mined.toFixed(6)));
      setUsdEquivalent(parseFloat((mined * 0.12).toFixed(4)));
    }, 1000);
  };

  const handleStartMining = async () => {
    if (!currentUser) {
      setError("Please log in to start mining");
      return;
    }

    if (nextAvailable && Date.now() < nextAvailable) return;

    setLoading(true);
    setError(null);

    try {
      const result = await startMiningSession(currentUser.uid);

      if (result.success) {
        setCoinsMined(0);
        setUsdEquivalent(0);
        const startTime = new Date();
        resumeMining(startTime);

        // Update local user profile safely
        setUserProfile((prev) => ({
          ...prev,
          mining: {
            ...mining, // Use safe mining object
            isMining: true,
            lastMiningStart: startTime,
            coinsMined: 0,
            nextAvailable: new Date(startTime.getTime() + ONE_DAY_MS),
          },
        }));
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError("Failed to start mining session");
      console.error("Mining start error:", err);
    }

    setLoading(false);
  };

  const handleCompleteMining = async (finalCoins) => {
    if (!currentUser) return;

    try {
      // Complete mining session
      await completeMiningSession(currentUser.uid, finalCoins);

      // Update user stats - FIXED: Use safe values
      await updateUserStats(currentUser.uid, {
        "stats.coinsEarned": finalCoins,
        "stats.totalCoinsEarned": (stats.totalCoinsEarned || 0) + finalCoins, // FIXED
        "mining.totalMiningSessions": (mining.totalMiningSessions || 0) + 1, // FIXED
      });

      // CREATE NOTIFICATION
      await createMiningCompletionNotification(currentUser.uid, finalCoins);

      // Update local state
      setIsMining(false);
      setNextAvailable(null);
      setCoinsMined(finalCoins);

      // Update local user profile - FIXED: Use safe values
      setUserProfile((prev) => ({
        ...prev,
        mining: {
          ...mining,
          isMining: false,
          nextAvailable: null,
          totalMiningSessions: (mining.totalMiningSessions || 0) + 1,
        },
        stats: {
          ...stats,
          coinsEarned: finalCoins,
          totalCoinsEarned: (stats.totalCoinsEarned || 0) + finalCoins, // FIXED
        },
      }));

    } catch (err) {
      console.error("Error completing mining:", err);
      setError("Failed to complete mining session");
    }
  };

  const formatTimeRemaining = () => {
    if (!nextAvailable) return "";
    const diff = nextAvailable - Date.now();
    if (diff <= 0) return "You can mine now!";
    const hrs = Math.floor(diff / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hrs}h ${mins}m remaining`;
  };

  const getMiningRate = () => {
    // Get mining rate from user profile (can be boosted by referrals) - safe access
    return mining.miningRate || RATE_PER_HOUR;
  };

  const handleShareReferral = () => {
    if (profile.referralCode) {
      // Safe access
      const referralLink = `${window.location.origin}/signup?ref=${profile.referralCode}`;
      navigator.clipboard.writeText(referralLink);
      alert("Referral link copied to clipboard! 🚀");
    } else {
      alert("Referral code not available yet. Please try again in a moment.");
    }
  };

  // Show loading state if user data is not available
  if (!currentUser || !userProfile) {
    return (
      <div className="w-full h-full flex items-center justify-center p-6 bg-gradient-to-br from-[#251354] via-[#261547] to-[#321c64] rounded-2xl">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400 mx-auto mb-4"></div>
          <p className="text-purple-300">Loading mining dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col md:flex-row items-center md:items-start justify-center gap-10 p-6 bg-gradient-to-br from-[#251354] via-[#261547] to-[#321c64] rounded-2xl shadow-lg border border-purple-900/20 transition-all duration-300">
      
      {/* Error Display */}
      {error && (
        <div className="absolute top-4 right-4 bg-red-500/20 border border-red-500 text-red-300 px-4 py-2 rounded-lg">
          {error}
          <button
            onClick={() => setError(null)}
            className="ml-2 text-red-400 hover:text-red-200"
          >
            ×
          </button>
        </div>
      )}

      {/* Cube Animation */}
      <div className="w-full md:w-1/2 flex justify-center items-center py-12 md:py-0 md:pt-16">
        <CubeAnimation isMining={isMining} />
      </div>

      {/* Stats and Actions */}
      <div className="w-full md:w-1/2 flex flex-col justify-center gap-5">
        {/* Stats cards */}
        <div className="flex gap-5">
          <div className="flex-1 bg-gradient-to-t from-[#221c34] to-[#35246b] px-6 py-5 rounded-lg shadow border border-purple-600/30 text-center transition-all duration-200 hover:scale-[1.03]">
            <p className="text-xs text-purple-300 uppercase tracking-wider font-semibold">
              Coins Mined
            </p>
            <p className="text-2xl text-yellow-400 font-extrabold drop-shadow">
              {coinsMined.toFixed(4)}
            </p>
          </div>
          <div className="flex-1 bg-gradient-to-t from-[#221c34] to-[#35246b] px-6 py-5 rounded-lg shadow border border-purple-600/30 text-center transition-all duration-200 hover:scale-[1.03]">
            <p className="text-xs text-purple-300 uppercase tracking-wider font-semibold">
              USD Equivalent
            </p>
            <p className="text-2xl text-green-400 font-extrabold drop-shadow">
              ${usdEquivalent.toFixed(4)}
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-t from-[#221c34] to-[#312567] px-6 py-5 rounded-lg shadow border border-purple-600/30 text-center">
          <p className="text-xs text-purple-300 uppercase tracking-wider font-semibold">
            Mining Rate
          </p>
          <p className="text-lg text-purple-400 font-bold drop-shadow">
            {getMiningRate().toFixed(6)} coins/hour
          </p>
        </div>

        {/* Total Stats - FIXED: Extra safety */}
        <div className="bg-gradient-to-t from-[#221c34] to-[#312567] px-6 py-5 rounded-lg shadow border border-purple-600/30 text-center">
          <p className="text-xs text-purple-300 uppercase tracking-wider font-semibold">
            Total Earned
          </p>
          <p className="text-lg text-blue-400 font-bold drop-shadow">
            {(stats.totalCoinsEarned || 0).toFixed(2)} coins
          </p>
        </div>

        {/* Mining status and action */}
        <div className="flex flex-col items-center mt-2">
          {isMining ? (
            <p className="text-sm text-green-400 font-semibold flex items-center mb-2 transition-all duration-300">
              ⛏ Mining in progress...&nbsp;
              <span className="text-purple-300">{formatTimeRemaining()}</span>
            </p>
          ) : (
            <button
              onClick={handleStartMining}
              disabled={loading || (nextAvailable && Date.now() < nextAvailable)}
              className={`mt-1 px-6 py-3 rounded-md font-semibold text-sm shadow-lg transition-all duration-200 flex items-center gap-2 ${
                loading || (nextAvailable && Date.now() < nextAvailable)
                  ? "bg-gray-500 cursor-not-allowed text-white"
                  : "bg-gradient-to-r from-pink-500 to-purple-600 hover:from-purple-400 hover:to-pink-400 text-white"
              }`}
            >
              {loading && (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              )}
              {nextAvailable && Date.now() < nextAvailable
                ? `Come back in ${formatTimeRemaining()}`
                : loading
                ? "Starting..."
                : "Start Mining"}
            </button>
          )}
        </div>

        <div className="text-center mt-4">
          <button
            onClick={handleShareReferral}
            className="bg-gradient-to-r from-purple-600 to-indigo-500 hover:from-indigo-500 hover:to-purple-600 text-white px-4 py-2 rounded-md text-xs shadow font-bold transition-all duration-200"
          >
            🔗 Share Referral Link
          </button>
          <p className="text-[11px] text-purple-300 mt-2 font-medium">
            Share your referral link to increase your mining rate!
          </p>
          <p className="text-[10px] text-purple-400 mt-1">
            Code: {profile.referralCode || "Loading..."}
          </p>
        </div>
      </div>
    </div>
  );
};

export default MiningSection;
