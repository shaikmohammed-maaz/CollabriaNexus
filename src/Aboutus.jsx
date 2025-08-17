import React from 'react';
import { FaRocket, FaUsers, FaLightbulb, FaBolt, FaGlobe, FaBrain, FaHandshake, FaCode, FaChartLine, FaStar, FaEye, FaHeart } from 'react-icons/fa';

const AboutUs = () => {
  const stats = [
    { number: "∞", label: "Potential Connections", icon: FaUsers },
    { number: "0", label: "Day One - We Start Here", icon: FaRocket },
    { number: "24/7", label: "Knowledge Never Sleeps", icon: FaBrain },
    { number: "100%", label: "Authenticity Guaranteed", icon: FaStar }
  ];

  const features = [
    {
      icon: FaBrain,
      title: "Expert Mentorship",
      description: "Connect with industry leaders who guide your journey from beginner to expert",
      color: "bg-blue-500"
    },
    {
      icon: FaLightbulb,
      title: "Mystery Solving",
      description: "Tackle real-world case studies and unsolved challenges with brilliant minds",
      color: "bg-yellow-500"
    },
    {
      icon: FaGlobe,
      title: "Global Network",
      description: "Access a worldwide community of passionate professionals and innovators",
      color: "bg-green-500"
    },
    {
      icon: FaCode,
      title: "Project Collaboration",
      description: "Join ambitious projects, earn fees or ESOPs, and build your professional network",
      color: "bg-purple-500"
    },
    {
      icon: FaChartLine,
      title: "Company Insights",
      description: "Discover how successful companies operate with verified, authentic information",
      color: "bg-red-500"
    },
    {
      icon: FaHandshake,
      title: "Niche Communities",
      description: "Find your tribe in focused chat rooms designed around specific interests and skills",
      color: "bg-indigo-500"
    }
  ];

  const visionPoints = [
    { icon: FaEye, text: "To become the world's most-used platform outside social media and entertainment" },
    { icon: FaHeart, text: "Where passion meets purpose and knowledge transforms lives" },
    { icon: FaGlobe, text: "Connecting minds across borders, cultures, and disciplines" },
    { icon: FaBolt, text: "Accelerating human potential through authentic collaboration" }
  ];

  return (
    <div className="bg-gray-900 text-white min-h-screen">
      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="w-full px-6 sm:px-8 lg:px-12">
          <div className="text-center max-w-5xl mx-auto">
            <div className="mb-6">
              <span className="bg-purple-600 text-white px-4 py-2 rounded-full text-sm font-semibold tracking-wide">
                🚀 LAUNCHING SOON
              </span>
            </div>
            
            <h1 className="text-4xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold mb-6 leading-tight">
              Welcome to
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                Collabria ~ Nexus
              </span>
            </h1>
            
            <p className="text-lg sm:text-xl lg:text-2xl text-gray-300 mb-12 leading-relaxed max-w-4xl mx-auto">
              The revolutionary platform where <span className="text-purple-400 font-semibold">knowledge meets passion</span>, 
              <span className="text-pink-400 font-semibold"> experts guide beginners</span>, and 
              <span className="text-cyan-400 font-semibold"> global minds collaborate</span> to solve tomorrow's challenges
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6 mb-16">
              <button className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg font-bold text-lg hover:from-purple-700 hover:to-pink-700 transform hover:scale-105 transition-all duration-300 shadow-lg">
                <span className="flex items-center justify-center gap-2">
                  <FaRocket />
                  Join the Revolution
                </span>
              </button>
              <button className="px-8 py-4 border-2 border-gray-600 rounded-lg font-bold text-lg hover:bg-gray-800 transition-all duration-300">
                Learn More
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 hover:bg-gray-750 transition-all duration-300">
                    <stat.icon className="text-3xl text-purple-400 mx-auto mb-3" />
                    <div className="text-2xl sm:text-3xl font-bold text-white">
                      {stat.number}
                    </div>
                    <div className="text-sm text-gray-400 mt-2">{stat.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="py-16 lg:py-24 bg-gray-800">
        <div className="w-full px-6 sm:px-8 lg:px-12">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 text-white">
                Our Vision
              </h2>
              <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto">
                We're not just building an app — we're crafting the future of human connection and knowledge sharing
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-6 lg:gap-8 mb-16">
              {visionPoints.map((point, index) => (
                <div 
                  key={index}
                  className="flex items-start gap-4 p-6 bg-gray-900 border border-gray-700 rounded-xl hover:bg-gray-850 transition-all duration-300"
                >
                  <point.icon className="text-2xl text-purple-400 flex-shrink-0 mt-1" />
                  <p className="text-gray-300 leading-relaxed">{point.text}</p>
                </div>
              ))}
            </div>

            {/* Central Vision Statement */}
            <div className="text-center bg-gradient-to-r from-purple-900/50 to-pink-900/50 border border-purple-500/30 rounded-2xl p-8 lg:p-12">
              <h3 className="text-2xl lg:text-3xl font-bold mb-4 text-purple-200">The World's Next Essential Platform</h3>
              <p className="text-lg lg:text-xl text-gray-300 leading-relaxed">
                Beyond social media, beyond entertainment — we're creating the definitive space where 
                <span className="text-purple-400 font-semibold"> knowledge, passion, and authentic human connection </span>
                converge to accelerate human potential and solve the world's most pressing challenges.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 lg:py-24 bg-gray-900">
        <div className="w-full px-6 sm:px-8 lg:px-12">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 text-white">
                What Makes Us Different
              </h2>
              <p className="text-lg sm:text-xl text-gray-300">Six pillars that will transform how the world collaborates</p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="bg-gray-800 border border-gray-700 rounded-2xl p-8 hover:bg-gray-750 hover:border-gray-600 transition-all duration-300 hover:scale-105"
                >
                  <div className={`inline-flex p-4 rounded-xl ${feature.color} mb-6`}>
                    <feature.icon className="text-2xl text-white" />
                  </div>
                  
                  <h3 className="text-xl lg:text-2xl font-bold mb-4 text-white">
                    {feature.title}
                  </h3>
                  
                  <p className="text-gray-300 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Values */}
      <section className="py-16 lg:py-24 bg-gray-800">
        <div className="w-full px-6 sm:px-8 lg:px-12">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
              <div className="bg-gray-900 border border-gray-700 rounded-2xl p-8 lg:p-10">
                <h2 className="text-2xl lg:text-3xl font-bold mb-6 text-purple-400">Our Mission</h2>
                <p className="text-gray-300 text-lg leading-relaxed mb-6">
                  To democratize knowledge sharing and create authentic connections between experts and learners worldwide. 
                  We believe that everyone has something valuable to teach and something meaningful to learn.
                </p>
                <ul className="space-y-3 text-gray-400">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                    Connect passionate minds across the globe
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                    Verify and authenticate all knowledge shared
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                    Create opportunities for meaningful collaboration
                  </li>
                </ul>
              </div>

              <div className="bg-gray-900 border border-gray-700 rounded-2xl p-8 lg:p-10">
                <h2 className="text-2xl lg:text-3xl font-bold mb-6 text-pink-400">Our Values</h2>
                <p className="text-gray-300 text-lg leading-relaxed mb-6">
                  Built on the foundation of authenticity, accessibility, and human potential. 
                  We're creating a platform where knowledge flows freely and connections form naturally.
                </p>
                <ul className="space-y-3 text-gray-400">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-pink-400 rounded-full"></div>
                    Authenticity in every interaction
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-pink-400 rounded-full"></div>
                    Inclusive and accessible to everyone
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-pink-400 rounded-full"></div>
                    Focused on genuine human connection
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Beginning Section */}
      <section className="py-16 lg:py-24 bg-gray-900">
        <div className="w-full px-6 sm:px-8 lg:px-12">
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 border border-purple-500/30 rounded-2xl p-8 lg:p-12">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-8 text-white">
                This Is Just The Beginning
              </h2>
              
              <p className="text-lg sm:text-xl text-gray-300 mb-8 leading-relaxed">
                We're starting from zero, but we're thinking infinite. Every great platform began with a vision, 
                a first user, and the courage to reimagine what's possible.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-8">
                <div className="text-center">
                  <div className="text-5xl lg:text-6xl font-bold text-purple-400 mb-2">
                    Day 0
                  </div>
                  <div className="text-gray-400">Where we are</div>
                </div>
                <div className="text-2xl text-gray-500 rotate-90 sm:rotate-0">→</div>
                <div className="text-center">
                  <div className="text-2xl lg:text-3xl font-bold text-pink-400 mb-2">The Future</div>
                  <div className="text-gray-400">Starts now</div>
                </div>
              </div>

              <blockquote className="text-lg lg:text-xl text-gray-400 italic border-l-4 border-purple-500 pl-6">
                "Every expert was once a beginner. Every pro was once an amateur. 
                Every icon was once an unknown."
              </blockquote>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 lg:py-24 bg-gradient-to-r from-purple-900 to-pink-900">
        <div className="w-full px-6 sm:px-8 lg:px-12">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 text-white">
              Ready to Shape the Future?
            </h2>
            <p className="text-lg sm:text-xl text-gray-200 mb-12 leading-relaxed">
              Be among the first to experience the platform that will connect minds, 
              accelerate learning, and transform how the world collaborates
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-8">
              <button className="px-12 py-4 bg-white text-purple-900 rounded-lg font-bold text-lg hover:bg-gray-100 transform hover:scale-105 transition-all duration-300 shadow-lg">
                <span className="flex items-center justify-center gap-2">
                  <FaRocket />
                  Get Early Access
                </span>
              </button>
              
              <button className="px-12 py-4 border-2 border-white/30 text-white rounded-lg font-bold text-lg hover:bg-white/10 transition-all duration-300">
                Subscribe for Updates
              </button>
            </div>

            <div className="text-sm text-gray-300">
              <p>🌟 Join our waitlist and be part of something revolutionary</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;