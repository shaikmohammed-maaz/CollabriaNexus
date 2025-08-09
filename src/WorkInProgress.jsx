// WorkInProgress.jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaBolt, FaHome, FaBackward } from "react-icons/fa";

export default function WorkInProgress() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0f0f1a] text-white flex items-center justify-center px-4 py-20">
      <div className="max-w-3xl w-full bg-gradient-to-b from-[#0f1016]/60 via-[#12121b]/60 to-[#0f0f14]/60 border border-violet-400/10 rounded-2xl shadow-2xl p-8 relative overflow-hidden">
        {/* decorative pulses */}
        <div className="absolute -left-20 -top-20 w-72 h-72 rounded-full bg-violet-600/10 blur-3xl animate-blob" />
        <div className="absolute -right-28 -bottom-24 w-96 h-96 rounded-full bg-pink-500/6 blur-3xl animate-blob animation-delay-2000" />

        <div className="relative z-10 flex flex-col items-center text-center gap-6">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-gradient-to-tr from-pink-500 to-violet-600 p-4 shadow-xl">
              <FaBolt className="text-white text-2xl" />
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white">
              Work in Progress
            </h1>
          </div>

          <p className="max-w-2xl text-gray-300 text-sm md:text-base leading-relaxed">
            We’re forging something shiny behind the scenes — features that make mining smoother, smarter, and more fun.
            Hang tight, miner. Good things take time... and a little bit of ⚡ magic.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 mt-2">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 justify-center px-5 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 transition shadow"
            >
              <FaBackward /> Back
            </button>

            <Link
              to="/"
              className="flex items-center gap-2 justify-center px-5 py-2 rounded-lg bg-transparent border border-violet-600 text-violet-300 hover:bg-violet-600/10 transition shadow"
            >
              <FaHome /> Go Home
            </Link>
          </div>

          <div className="mt-4 text-xs text-gray-500">
            Want updates? We can add an email subscribe soon — tell me if you want that.
          </div>
        </div>
      </div>

      {/* small style for blob animation */}
      <style>{`
        @keyframes blob {
          0% { transform: translate(0px,0px) scale(1); }
          33% { transform: translate(30px,-20px) scale(1.05); }
          66% { transform: translate(-20px,20px) scale(0.95); }
          100% { transform: translate(0px,0px) scale(1); }
        }
        .animate-blob { animation: blob 6s infinite ease-in-out; }
        .animation-delay-2000 { animation-delay: 2s; }
      `}</style>
    </div>
  );
}
