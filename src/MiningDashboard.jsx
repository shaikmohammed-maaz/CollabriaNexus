import React, { useState, useEffect, useRef } from "react";
import CubeAnimation from "./CubeAnimation";

const ONE_DAY_MS = 24 * 60 * 60 * 1000;
const DAILY_REWARD = 3; // coins/day
const RATE_PER_HOUR = DAILY_REWARD / 24; // coins/hour

const MiningSection = () => {
  const [coinsMined, setCoinsMined] = useState(0);
  const [usdEquivalent, setUsdEquivalent] = useState(0);
  const [isMining, setIsMining] = useState(false);
  const [nextAvailable, setNextAvailable] = useState(null);
  const intervalRef = useRef(null);

  // Restore mining state on load
  useEffect(() => {
    const lastStart = localStorage.getItem("lastMiningStart");

    if (lastStart) {
      const startTime = new Date(lastStart);
      const elapsed = Date.now() - startTime.getTime();

      if (elapsed < ONE_DAY_MS) {
        startMining(startTime);
      } else {
        setNextAvailable(null);
        localStorage.removeItem("lastMiningStart");
        localStorage.removeItem("coinsMined");
      }
    }
  }, []);

  const startMining = (startTime = new Date()) => {
    setIsMining(true);
    localStorage.setItem("lastMiningStart", startTime.toISOString());

    const ratePerMs = DAILY_REWARD / ONE_DAY_MS; // coins/ms

    intervalRef.current = setInterval(() => {
      const elapsedMs = Date.now() - startTime.getTime();

      if (elapsedMs >= ONE_DAY_MS) {
        clearInterval(intervalRef.current);
        setIsMining(false);
        setNextAvailable(null);
        return;
      }

      const mined = elapsedMs * ratePerMs;
      localStorage.setItem("coinsMined", mined.toFixed(6));

      setCoinsMined(mined.toFixed(6));
      setUsdEquivalent((mined * 0.12).toFixed(4)); // Example USD rate
      setNextAvailable(startTime.getTime() + ONE_DAY_MS);
    }, 1000); // Update every second
  };

  const handleStartClick = () => {
    if (nextAvailable && Date.now() < nextAvailable) return;
    setCoinsMined(0);
    setUsdEquivalent(0);
    startMining();
  };

  const formatTimeRemaining = () => {
    if (!nextAvailable) return "";
    const diff = nextAvailable - Date.now();
    if (diff <= 0) return "You can mine now!";
    const hrs = Math.floor(diff / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hrs}h ${mins}m remaining`;
  };

  return (
    <div className="w-full h-full flex flex-col md:flex-row items-center md:items-start justify-center gap-6 p-4">
      {/* Cube Animation */}
      <div className="w-full md:w-1/2 flex justify-center items-center py-10 md:py-0 md:pt-16">
        <CubeAnimation isMining={isMining} />
      </div>

      {/* Stats and Actions */}
      <div className="w-full md:w-1/2 flex flex-col justify-center gap-3">
        <div className="flex gap-3">
          <div className="bg-[#1d1d2e] px-4 py-3 rounded-md text-center flex-1">
            <p className="text-xs text-gray-300">Coins Mined</p>
            <p className="text-xl text-yellow-400 font-bold">{coinsMined}</p>
          </div>
          <div className="bg-[#1d1d2e] px-4 py-3 rounded-md text-center flex-1">
            <p className="text-xs text-gray-300">USD Equivalent</p>
            <p className="text-xl text-green-400 font-bold">${usdEquivalent}</p>
          </div>
        </div>

        <div className="bg-[#1d1d2e] px-4 py-3 rounded-md text-center">
          <p className="text-xs text-gray-300">Mining Rate</p>
          <p className="text-lg text-purple-400 font-semibold">
            {RATE_PER_HOUR.toFixed(6)} coins/hour
          </p>
        </div>

        {isMining ? (
          <p className="text-sm text-green-400 text-center">
            ⛏ Mining in progress... {formatTimeRemaining()}
          </p>
        ) : (
          <button
            onClick={handleStartClick}
            disabled={nextAvailable && Date.now() < nextAvailable}
            className={`mt-1 px-4 py-2 rounded-md text-white font-semibold text-sm ${
              nextAvailable && Date.now() < nextAvailable
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-gradient-to-r from-pink-500 to-purple-600"
            }`}
          >
            {nextAvailable && Date.now() < nextAvailable
              ? `Come back in ${formatTimeRemaining()}`
              : "Start Mining"}
          </button>
        )}

        <div className="text-center">
          <button className="bg-purple-600 text-white px-3 py-1 rounded-md text-xs">
            🔗 Share Referral Link
          </button>
          <p className="text-[10px] text-gray-400 mt-1">
            Share your referral link to increase your mining rate!
          </p>
        </div>
      </div>
    </div>
  );
};

export default MiningSection;
