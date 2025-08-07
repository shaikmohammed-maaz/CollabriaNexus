import React from "react";
import NavBar from "./NavBar";
import { FaRocket, FaChartBar, FaUserAstronaut, FaCoins } from "react-icons/fa";
import AboutSection from "./AboutSection";

export default function Home() {
  return (
    <div
      className="min-h-screen w-screen flex flex-col relative overflow-hidden"
      style={{
        background: "#ffffff",
        backgroundImage:
          "radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(84,68,124,1) 50%, rgba(0,0,0,1) 100%)",
      }}
    >
      <NavBar />

      {/* Floating Background Icons */}
      <FaRocket className="text-violet-400/30 text-[90px] blur-sm absolute left-[10%] top-[18%] z-0 animate-float-slow" />
      <FaChartBar className="text-violet-300/20 text-[70px] blur-[2px] absolute right-[15%] top-[30%] z-0 animate-float" />
      <FaUserAstronaut className="text-violet-500/20 text-[80px] blur-[1.5px] absolute left-[25%] bottom-[10%] z-0 animate-float-reverse" />
      <FaCoins className="text-yellow-400/20 text-[65px] blur-[2px] absolute right-[12%] bottom-[15%] z-0 animate-float" />

      <svg
        className="absolute top-[-10%] left-[-10%] w-[130%] h-[130%] z-[-10] animate-fadeIn pointer-events-none"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1000 1000"
        style={{
          transform: "rotate(-35deg)",
          filter: "blur(2px)",
        }}
      >
        <defs>
          <radialGradient id="fadeGrad" r="100%" cx="50%" cy="50%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.2)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0)" />
          </radialGradient>
        </defs>

        {[0, 50, 100, 150, 200].map((offset, index) => (
          <ellipse
            key={index}
            cx="500"
            cy="500"
            rx={400 + offset}
            ry={200 + offset / 1.5}
            fill="url(#fadeGrad)"
            opacity={0.2 - index * 0.03}
          />
        ))}
      </svg>

      {/* Hero Section */}
      <section className="flex flex-1 items-center justify-center w-full px-8 pt-28 pb-8">
        <div className="flex flex-col items-center justify-center w-full max-w-2xl text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white leading-tight drop-shadow-lg mb-6">
            Empower Your Journey:
            <br className="hidden sm:block" />
            <span className="text-accent"> Discover, Learn, and Grow</span>
            <br />
            Beyond Limits
          </h1>
          <p className="text-lg sm:text-xl italic text-gray-700 max-w-lg mb-8">
            Unlock global knowledge, real-world stories, and verified insights —
            all in one transformative platform.
          </p>
          <button
            className="px-8 py-3 rounded-xl font-semibold text-white bg-white/10 border border-violet-300/30 shadow-lg backdrop-blur-md transition hover:bg-white/20"
            style={{
              boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.18)",
              border: "1px solid rgba(147, 51, 234, 0.3)",
              backdropFilter: "blur(12px)",
            }}
            onClick={() => window.location.href = "/dashboard"}
          >
            Start Your Journey
          </button>
        </div>
      </section>

      {/* Informative Floating Boxes Section */}
      <section className="w-full flex flex-wrap justify-center gap-8 py-12 px-6 relative z-0">
        {/* Box 1 – Blog & Company Insights */}
        <div className="relative w-[280px] h-[280px] rotate-[-6deg] translate-y-3 dance dance-delay-1">
          <div className="circle-cut w-full h-full p-5 flex flex-col justify-center text-white">
            <h3 className="text-lg font-semibold mb-2">
              Inspiring Articles & Proven Paths
            </h3>
            <p className="text-sm leading-snug">
              Read real, verified stories and company blueprints — fuel your
              ambition with knowledge that works.
            </p>
          </div>
        </div>

        {/* Box 2 – Learning / Mine Feature */}
        <div className="relative w-[300px] h-[240px] rotate-[8deg] -translate-y-2 dance dance-delay-2">
          <div className="inner-curve w-full h-full p-5 flex flex-col justify-center text-white">
            <h3 className="text-lg font-semibold mb-2">
              Mine Insights, Build Your Future
            </h3>
            <p className="text-sm leading-snug">
              Explore practical lessons and resources, curated for real-world
              growth. Every click, a step forward.
            </p>
          </div>
        </div>

        {/* Box 3 – Curated News & Motivation */}
        <div className="relative w-[280px] h-[280px] rotate-[5deg] translate-y-6 dance dance-delay-3">
          <div className="circle-cut w-full h-full p-5 flex flex-col justify-center text-white">
            <h3 className="text-lg font-semibold mb-2">
              Stay Ahead with Curated News
            </h3>
            <p className="text-sm leading-snug">
              Motivation meets discovery: handpicked news and breakthrough ideas
              to keep you inspired every day.
            </p>
          </div>
        </div>

        {/* Box 4 – Mentorship & Expert Advice */}
        <div className="relative w-[300px] h-[240px] rotate-[-12deg] -translate-y-4 dance dance-delay-4">
          <div className="inner-curve w-full h-full p-5 flex flex-col justify-center text-white">
            <h3 className="text-lg font-semibold mb-2">
              Connect with Mentors, Unlock New Perspectives
            </h3>
            <p className="text-sm leading-snug">
              Discover guidance from industry experts — find answers, spark
              ideas, and accelerate your personal journey.
            </p>
          </div>
        </div>
      </section>

      {/* About Section */}
      <AboutSection />

    </div>
  );
}
