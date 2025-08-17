import React, { useState } from "react";
import {
  FaRocket,
  FaChartBar,
  FaUserAstronaut,
  FaCoins,
  FaBrain,
  FaLightbulb,
  FaGlobe,
  FaHandshake,
  FaUsers,
  FaArrowRight,
  FaPlay,
  FaStar,
  FaBookOpen,
  FaNewspaper,
  FaSearch,
  FaShieldAlt,
} from "react-icons/fa";

const Home = () => {
  const [activeTab, setActiveTab] = useState("learn");

  const platformFeatures = [
    {
      icon: FaBookOpen,
      title: "Curated Knowledge Base",
      description:
        "Access verified articles, company insights, and proven strategies from industry leaders.",
      category: "learn",
    },
    {
      icon: FaBrain,
      title: "Expert Mentorship",
      description:
        "Connect directly with professionals and get personalized guidance for your career growth.",
      category: "connect",
    },
    {
      icon: FaNewspaper,
      title: "Industry News & Trends",
      description:
        "Stay updated with the latest industry developments and breakthrough innovations.",
      category: "discover",
    },
    {
      icon: FaHandshake,
      title: "Project Collaboration",
      description:
        "Join meaningful projects, contribute your skills, and build your professional network.",
      category: "grow",
    },
  ];

  const tabs = [
    { id: "learn", label: "Learn", icon: FaBookOpen },
    { id: "connect", label: "Connect", icon: FaUsers },
    { id: "discover", label: "Discover", icon: FaSearch },
    { id: "grow", label: "Grow", icon: FaArrowRight },
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-to-b from-gray-900 to-gray-800">
        <div className="px-6 lg:px-8 w-full max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="mb-6">
              <span className="bg-purple-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
                🚀 LAUNCHING SOON
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-8 leading-tight">
              Your Gateway to
              <br />
              <span className="text-purple-400">Global Knowledge</span> &
              <span className="text-pink-400"> Expert Networks</span>
            </h1>

            <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto">
              Connect with industry experts, access verified insights, and
              accelerate your professional journey through authentic knowledge
              sharing and meaningful collaboration.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
              <button className="px-8 py-4 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold text-lg transition-colors shadow-lg">
                <span className="flex items-center justify-center gap-2">
                  <FaRocket />
                  Get Early Access
                </span>
              </button>
              <button className="px-8 py-4 border border-gray-600 hover:bg-gray-800 rounded-lg font-semibold text-lg transition-colors">
                <span className="flex items-center justify-center gap-2">
                  <FaPlay />
                  Watch Demo
                </span>
              </button>
            </div>

            {/* Trust Indicators */}
            <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto text-center">
              <div>
                <div className="text-2xl font-bold text-purple-400 mb-1">
                  100%
                </div>
                <div className="text-sm text-gray-400">Verified Content</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-pink-400 mb-1">
                  24/7
                </div>
                <div className="text-sm text-gray-400">Global Access</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-cyan-400 mb-1">∞</div>
                <div className="text-sm text-gray-400">
                  Learning Opportunities
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Overview */}
      <section className="py-16 bg-gray-800">
        <div className="px-6 lg:px-8 w-full max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-300">
              Four simple steps to transform your professional journey
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="flex justify-center mb-12">
            <div className="bg-gray-900 p-2 rounded-xl inline-flex w-full max-w-full overflow-x-auto flex-wrap space-x-2 scrollbar-hide">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`min-w-[100px] px-6 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2 whitespace-nowrap 
          ${
            activeTab === tab.id
              ? "bg-purple-600 text-white"
              : "text-gray-400 hover:text-white"
          }`}
                  style={{ flex: "0 0 auto" }}
                >
                  <tab.icon className="text-lg" />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Content based on active tab */}
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              {platformFeatures
                .filter((feature) => feature.category === activeTab)
                .map((feature, index) => (
                  <div key={index}>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="bg-purple-600 p-3 rounded-lg">
                        <feature.icon className="text-2xl text-white" />
                      </div>
                      <h3 className="text-2xl font-bold">{feature.title}</h3>
                    </div>
                    <p className="text-lg text-gray-300 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                ))}
            </div>

            <div className="bg-gray-900 border border-gray-700 rounded-2xl p-8">
              <div className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-xl p-6 mb-6">
                <h4 className="text-lg font-semibold mb-2 text-center">
                  Coming Soon
                </h4>
                <div className="text-center text-gray-300">
                  Interactive demo and preview will be available here
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                  <span className="text-gray-300">Platform Features</span>
                  <FaShieldAlt className="text-green-400" />
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                  <span className="text-gray-300">Expert Network</span>
                  <FaUsers className="text-blue-400" />
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                  <span className="text-gray-300">Global Access</span>
                  <FaGlobe className="text-purple-400" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Benefits */}
      <section className="py-16 bg-gray-900">
        <div className="px-6 lg:px-8 w-full max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Why Choose CollabriaNexus?
            </h2>
            <p className="text-xl text-gray-300">
              Built for professionals who value authentic knowledge and
              meaningful connections
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-gradient-to-br from-blue-600 to-cyan-500 w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4">
                <FaShieldAlt className="text-2xl text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3">Verified & Authentic</h3>
              <p className="text-gray-300">
                All content and expert profiles are thoroughly verified to
                ensure authenticity and quality.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-gradient-to-br from-purple-600 to-pink-500 w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4">
                <FaGlobe className="text-2xl text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3">Global Community</h3>
              <p className="text-gray-300">
                Connect with professionals and experts from around the world in
                your field of interest.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-gradient-to-br from-green-600 to-emerald-500 w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4">
                <FaBrain className="text-2xl text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3">Career Growth</h3>
              <p className="text-gray-300">
                Access opportunities for skill development, mentorship, and
                collaborative projects.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Early Access CTA */}
      <section className="py-16 bg-gradient-to-r from-purple-900 to-pink-900">
        <div className="px-6 lg:px-8 w-full max-w-4xl mx-auto text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">
            Be Among the First
          </h2>
          <p className="text-xl text-gray-200 mb-8 leading-relaxed">
            Join our exclusive waitlist and get early access to the platform
            that will transform how professionals connect, learn, and grow
            together.
          </p>

          <div className="bg-white/10 backdrop-blur border border-white/20 rounded-2xl p-8 mb-8">
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none"
              />
              <button className="px-6 py-3 bg-white text-purple-900 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                Join Waitlist
              </button>
            </div>
          </div>

          <div className="text-sm text-gray-300 flex items-center justify-center gap-2">
            <FaStar className="text-yellow-400" />
            No spam, just updates on our launch progress
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
