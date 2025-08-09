import React from "react";
import { FaRocket, FaUsers, FaGem, FaBolt } from "react-icons/fa";

const AboutUs = () => {
  return (
    <div className="bg-[#0f0f1a] text-white pt-20">
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center text-center">
        <img
          src="https://static.vecteezy.com/system/resources/thumbnails/016/208/685/small_2x/abstract-background-with-purple-beautiful-smoke-from-waves-and-lines-energy-hi-tech-magic-laser-neon-with-glow-effect-screensaver-beautiful-animation-in-high-resolution-4k-video.jpg"
          alt="Mining background"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/80"></div>
        <div className="relative z-10 px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-purple-400">
            About Collabria ~ Nexus
          </h1>
          <p className="mt-4 text-gray-300 max-w-2xl mx-auto">
            Revolutionizing digital mining — accessible, eco-friendly, and rewarding for everyone.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 px-6 max-w-6xl mx-auto grid md:grid-cols-2 gap-8">
        <div className="bg-[#1d1d2e] p-6 rounded-lg shadow-lg border border-purple-600/30">
          <h2 className="text-2xl font-semibold mb-3">Our Mission</h2>
          <p className="text-gray-300 text-sm leading-relaxed">
            To democratize digital mining by making it easy, transparent, and available to anyone with an internet connection — no expensive rigs or high power bills.
          </p>
        </div>
        <div className="bg-[#1d1d2e] p-6 rounded-lg shadow-lg border border-purple-600/30">
          <h2 className="text-2xl font-semibold mb-3">Our Vision</h2>
          <p className="text-gray-300 text-sm leading-relaxed">
            A future where mining is as simple as tapping a button, and every user benefits equally from the digital gold rush.
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-6 bg-[#151520]">
        <h2 className="text-3xl font-bold text-center mb-12">Why Choose Us?</h2>
        <div className="grid md:grid-cols-4 gap-8 max-w-6xl mx-auto">
          <div className="bg-[#1d1d2e] p-6 rounded-lg text-center hover:shadow-purple-500/30 transition">
            <FaGem className="text-purple-400 text-4xl mb-4 mx-auto" />
            <h3 className="font-semibold mb-2">Daily Rewards</h3>
            <p className="text-xs text-gray-400">
              Earn coins every day with real-time mining updates.
            </p>
          </div>
          <div className="bg-[#1d1d2e] p-6 rounded-lg text-center hover:shadow-purple-500/30 transition">
            <FaBolt className="text-yellow-400 text-4xl mb-4 mx-auto" />
            <h3 className="font-semibold mb-2">Fast & Lightweight</h3>
            <p className="text-xs text-gray-400">
              Mining optimized to run smoothly without draining resources.
            </p>
          </div>
          <div className="bg-[#1d1d2e] p-6 rounded-lg text-center hover:shadow-purple-500/30 transition">
            <FaRocket className="text-pink-500 text-4xl mb-4 mx-auto" />
            <h3 className="font-semibold mb-2">Referral Boost</h3>
            <p className="text-xs text-gray-400">
              Invite friends to increase your mining speed and rewards.
            </p>
          </div>
          <div className="bg-[#1d1d2e] p-6 rounded-lg text-center hover:shadow-purple-500/30 transition">
            <FaUsers className="text-green-400 text-4xl mb-4 mx-auto" />
            <h3 className="font-semibold mb-2">Community Driven</h3>
            <p className="text-xs text-gray-400">
              Join a growing network of miners supporting each other.
            </p>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 px-6 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">Meet Our Team</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-[#1d1d2e] p-6 rounded-lg text-center hover:shadow-purple-500/30 transition"
            >
              <img
                src={`https://randomuser.me/api/portraits/men/${i * 10}.jpg`}
                alt="Team member"
                className="w-24 h-24 rounded-full mx-auto mb-4 border-2 border-purple-500"
              />
              <h3 className="font-semibold">John Doe</h3>
              <p className="text-xs text-gray-400">Lead Developer</p>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 text-center bg-gradient-to-r from-purple-600 to-pink-600">
        <h2 className="text-2xl font-bold mb-4">Join the MineVerse Revolution 🚀</h2>
        <p className="text-gray-200 mb-6">
          Start mining today and be part of the next digital gold rush.
        </p>
        <button className="bg-black px-6 py-2 rounded-md font-semibold hover:bg-gray-900 transition">
          Get Started
        </button>
      </section>
    </div>
  );
};

export default AboutUs;
