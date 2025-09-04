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

  // --- Helpers ---
  const calculateElapsedTime = (startTimestamp) => {
    const start = new Date(
      startTimestamp.seconds ? startTimestamp.seconds * 1000 : startTimestamp
    );
    const now = Date.now();
    return Math.floor((now - start.getTime()) / 60000); // minutes
  };

  const calculateMinedCoins = (elapsedMinutes, miningRate) => {
    return (elapsedMinutes / 1440) * miningRate;
  };

  const startMiningAnimation = (initialCoins, miningRate) => {
    if (intervalRef.current) clearInterval(intervalRef.current);

    let coins = initialCoins;
    intervalRef.current = setInterval(() => {
      coins += miningRate / 86400; // per second
      setCoinsMined(coins);
      setUsdEquivalent(coins * 0.12);
    }, 1000);
  };

  const resumeMiningSession = async (startTimestamp) => {
    const elapsedMinutes = calculateElapsedTime(startTimestamp);
    const miningRate = mining.miningRate || 3.0;

    if (elapsedMinutes >= 1440) {
      await handleCompleteMining();
      return;
    }

    const coins = calculateMinedCoins(elapsedMinutes, miningRate);
    setCoinsMined(coins);
    setUsdEquivalent(coins * 0.12);

    startMiningAnimation(coins, miningRate);
  };

  // FIXED: More robust safe property access
  const stats =
    userProfile && userProfile.stats
      ? {
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
        }
      : {
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

  const mining =
    userProfile && userProfile.mining
      ? {
          isMining: userProfile.mining.isMining ?? false,
          lastMiningStart: userProfile.mining.lastMiningStart ?? null,
          coinsMined: userProfile.mining.coinsMined ?? 0,
          nextAvailable: userProfile.mining.nextAvailable ?? null,
          totalMiningSessions: userProfile.mining.totalMiningSessions ?? 0,
          miningRate: userProfile.mining.miningRate ?? 3.0,
        }
      : {
          isMining: false,
          lastMiningStart: null,
          coinsMined: 0,
          nextAvailable: null,
          totalMiningSessions: 0,
          miningRate: 3.0,
        };

  const profile =
    userProfile && userProfile.profile
      ? {
          referralCode: userProfile.profile.referralCode ?? "",
          username: userProfile.profile.username ?? "",
          email: userProfile.profile.email ?? "",
        }
      : {
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
      // In MiningSection.jsx - Replace the problematic section with:
      if (miningData.isMining && miningData.lastMiningStart) {
        const startTime = new Date(
          miningData.lastMiningStart.seconds
            ? miningData.lastMiningStart.seconds * 1000
            : miningData.lastMiningStart
        );
        const elapsed = Date.now() - startTime.getTime();

        if (elapsed < ONE_DAY_MS) {
          resumeMiningSession(miningData.lastMiningStart);
        } else {
          handleCompleteMining();
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

  const getServerTime = async () => {
    // Use Firestore serverTimestamp roundtrip to get server time
    const serverTimeDoc = await addDoc(collection(db, "serverTime"), {
      ts: serverTime(),
    });
    const snap = await getDoc(serverTimeDoc);
    const serverTime = snap.data().ts.toDate();
    return serverTime;
  };

  const resumeMining = async (startTime) => {
    const serverNow = await getServerTime();
    const elapsedMs = serverNow - startTime.getTime();
    const miningRate = mining.miningRate || 3.0;
    const coins = Math.max(
      0,
      Math.min((elapsedMs / ONE_DAY_MS) * miningRate, miningRate)
    );
    setCoinsMined(parseFloat(coins.toFixed(4)));
    setUsdEquivalent(parseFloat((coins * 0.12).toFixed(4)));
    // ...existing interval logic if you want live updates...
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

  const handleCompleteMining = async () => {
    if (!currentUser) return;
    try {
      const result = await completeMiningSession(currentUser.uid);
      if (result.success) {
        setIsMining(false);
        setNextAvailable(null);
        setCoinsMined(result.coinsEarned);
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
            coinsEarned: (stats.coinsEarned || 0) + result.coinsEarned,
            totalCoinsEarned:
              (stats.totalCoinsEarned || 0) + result.coinsEarned,
          },
        }));
      } else {
        setError(result.error);
      }
    } catch (err) {
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
      alert("Referral link copied to clipboard! ðŸš€");
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
    <div className="w-full h-full flex flex-col gap-6 p-4 sm:p-6 bg-gradient-to-br from-[#251354] via-[#261547] to-[#321c64] rounded-2xl shadow-lg border border-purple-900/20 transition-all duration-300">
      {/* Error Display - Make sticky/floating on top right (mobile) */}
      {error && (
        <div className="fixed top-4 right-4 left-4 sm:left-auto z-50 bg-red-500/20 border border-red-500 text-red-300 px-4 py-2 rounded-lg flex justify-between items-center max-w-xs mx-auto sm:max-w-full">
          <span>{error}</span>
          <button
            onClick={() => setError(null)}
            className="ml-2 text-red-400 hover:text-red-200"
          >
            X
          </button>
        </div>
      )}
      {/* Header */}
      <h2 className="text-2xl font-bold text-purple-300 mb-4 flex items-center gap-3">
        Mining Dashboard
        <span className="text-sm bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full">
          {isMining ? "ACTIVE" : "INACTIVE"}
        </span>
      </h2>

      {/* Cube Animation */}
      <div className="w-full flex items-center justify-center py-8 sm:py-12">
        <CubeAnimation isMining={isMining} />
      </div>

      {/* Stats and Actions */}
      <div className="w-full flex flex-col gap-4">
        {/* Stats cards - stack on mobile */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 bg-gradient-to-t from-[#221c34] to-[#35246b] px-5 py-4 rounded-lg shadow border border-purple-600/30 text-center transition-all duration-200 hover:scale-[1.03]">
            <p className="text-xs text-purple-300 uppercase tracking-wider font-semibold">
              Coins Mined
            </p>
            <p className="text-2xl text-yellow-400 font-extrabold drop-shadow">
              {coinsMined.toFixed(4)}
            </p>
          </div>
          <div className="flex-1 bg-gradient-to-t from-[#221c34] to-[#35246b] px-5 py-4 rounded-lg shadow border border-purple-600/30 text-center transition-all duration-200 hover:scale-[1.03] mt-3 sm:mt-0">
            <p className="text-xs text-purple-300 uppercase tracking-wider font-semibold">
              USD Equivalent
            </p>
            <p className="text-2xl text-green-400 font-extrabold drop-shadow">
              ${usdEquivalent.toFixed(4)}
            </p>
          </div>
        </div>

        {/* Mining Rate */}
        <div className="bg-gradient-to-t from-[#221c34] to-[#312567] px-5 py-4 rounded-lg shadow border border-purple-600/30 text-center">
          <p className="text-xs text-purple-300 uppercase tracking-wider font-semibold">
            Mining Rate
          </p>
          <p className="text-lg text-purple-400 font-bold drop-shadow">
            {getMiningRate().toFixed(6)} coins/hour
          </p>
        </div>

        {/* Total Stats */}
        <div className="bg-gradient-to-t from-[#221c34] to-[#312567] px-5 py-4 rounded-lg shadow border border-purple-600/30 text-center">
          <p className="text-xs text-purple-300 uppercase tracking-wider font-semibold">
            Total Earned
          </p>
          <p className="text-lg text-blue-400 font-bold drop-shadow">
            {(stats.totalCoinsEarned || 0).toFixed(2)} coins
          </p>
        </div>

        {/* Mining status and action */}
        <div className="flex flex-col items-center mt-2 w-full">
          {isMining ? (
            <p className="text-sm text-green-400 font-semibold flex items-center mb-2 transition-all duration-300">
              Mining in progress...&nbsp;
              <span className="text-purple-300">{formatTimeRemaining()}</span>
            </p>
          ) : (
            <button
              onClick={handleStartMining}
              disabled={
                loading || (nextAvailable && Date.now() < nextAvailable)
              }
              className={`mt-1 px-5 py-3 rounded-md font-semibold text-sm shadow-lg w-full transition-all duration-200 flex items-center gap-2 ${
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

        {/* Referral - Make all content center and stack */}
        <div className="text-center mt-4 w-full">
          <button
            onClick={handleShareReferral}
            className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-indigo-500 hover:from-indigo-500 hover:to-purple-600 text-white px-4 py-3 rounded-md shadow-md transition-all duration-200 flex items-center justify-center gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Share Referral Link
          </button>
        </div>
      </div>
    </div>
  );
};

export default MiningSection;
