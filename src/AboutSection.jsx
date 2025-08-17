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
      <section className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-pink-500 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-500 rounded-full blur-3xl"></div>
        </div>

        <div className="flex items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center w-full max-w-7xl mx-auto">
            
            {/* Left Side - Main Content */}
            <div className="text-center lg:text-left">
              <div className="mb-6 lg:justify-start justify-center flex">
                <span className="bg-purple-600 text-white px-6 py-3 rounded-full text-sm font-semibold tracking-wide inline-flex items-center gap-2">
                  <FaRocket className="text-sm" />
                  LAUNCHING SOON
                </span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold mb-8 leading-tight">
                Welcome to
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400">
                  Collabria ~ Nexus
                </span>
              </h1>
              
              <p className="text-lg sm:text-xl lg:text-2xl text-gray-300 mb-10 leading-relaxed">
                The revolutionary platform where <span className="text-purple-400 font-semibold">knowledge meets passion</span>, 
                <span className="text-pink-400 font-semibold"> experts guide beginners</span>, and 
                <span className="text-cyan-400 font-semibold"> global minds collaborate</span> to solve tomorrow's challenges
              </p>

              <div className="flex flex-col sm:flex-row lg:justify-start justify-center gap-4 sm:gap-6 mb-12">
                <button className="px-10 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-bold text-lg hover:from-purple-700 hover:to-pink-700 transform hover:scale-105 transition-all duration-300 shadow-2xl shadow-purple-500/25">
                  <span className="flex items-center justify-center gap-3">
                    <FaRocket className="text-xl" />
                    Join the Revolution
                  </span>
                </button>
                <button className="px-10 py-4 bg-gray-800/50 backdrop-blur border-2 border-gray-600 rounded-xl font-bold text-lg hover:bg-gray-700/50 transition-all duration-300">
                  Learn More
                </button>
              </div>
            </div>

            {/* Right Side - Stats Grid */}
            <div className="grid grid-cols-2 gap-6 lg:gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="bg-gray-800/80 backdrop-blur border border-gray-700 rounded-2xl p-6 lg:p-8 hover:bg-gray-750/80 hover:border-purple-500/50 transition-all duration-300 transform hover:scale-105">
                    <stat.icon className="text-4xl lg:text-5xl text-purple-400 mx-auto mb-4" />
                    <div className="text-3xl lg:text-4xl font-bold text-white mb-2">
                      {stat.number}
                    </div>
                    <div className="text-sm lg:text-base text-gray-400 leading-tight">{stat.label}</div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-gray-400 rounded-full mt-2"></div>
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="py-20 lg:py-32 bg-gradient-to-b from-gray-800 to-gray-900 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, purple 2px, transparent 2px),
                             radial-gradient(circle at 75% 75%, pink 2px, transparent 2px)`,
            backgroundSize: '100px 100px'
          }}></div>
        </div>

        <div className="relative z-10 px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-20 lg:mb-32">
            <h2 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-10">
              Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400">Vision</span>
            </h2>
            <p className="text-xl sm:text-2xl lg:text-3xl text-gray-300 max-w-5xl mx-auto leading-relaxed">
              We're not just building an app — we're crafting the future of human connection and knowledge sharing
            </p>
          </div>

          <div className="max-w-8xl mx-auto">
            {/* Vision Points Grid */}
            <div className="grid sm:grid-cols-2 gap-8 lg:gap-12 mb-20 lg:mb-32">
              {visionPoints.map((point, index) => (
                <div 
                  key={index}
                  className="group flex items-start gap-6 lg:gap-8 p-8 lg:p-10 bg-gray-900/60 backdrop-blur border border-gray-700/50 rounded-3xl hover:bg-gray-800/60 hover:border-purple-500/30 transition-all duration-500"
                >
                  <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-4 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                    <point.icon className="text-2xl lg:text-3xl text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-300 text-lg lg:text-xl leading-relaxed group-hover:text-white transition-colors duration-300">
                      {point.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Central Vision Statement */}
            <div className="text-center max-w-6xl mx-auto">
              <div className="bg-gradient-to-br from-purple-900/40 via-pink-900/40 to-cyan-900/40 backdrop-blur border-2 border-purple-500/30 rounded-[3rem] p-12 lg:p-20">
                <h3 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-purple-200 via-pink-200 to-cyan-200">
                  The World's Next Essential Platform
                </h3>
                <p className="text-xl sm:text-2xl lg:text-3xl text-gray-200 leading-relaxed">
                  Beyond social media, beyond entertainment — we're creating the definitive space where 
                  <span className="text-purple-300 font-semibold"> knowledge, passion, and authentic human connection </span>
                  converge to accelerate human potential and solve the world's most pressing challenges.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 lg:py-24 bg-gray-900 relative">
        {/* Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
          <div className="absolute top-20 left-10 w-32 h-32 bg-purple-500/5 rounded-full blur-2xl"></div>
          <div className="absolute bottom-20 right-10 w-40 h-40 bg-pink-500/5 rounded-full blur-2xl"></div>
        </div>

        <div className="relative z-10 px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-8 text-white">
              What Makes Us <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Different</span>
            </h2>
            <p className="text-xl sm:text-2xl text-gray-300 max-w-3xl mx-auto">Six pillars that will transform how the world collaborates</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8 lg:gap-10 max-w-8xl mx-auto">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-3xl p-8 lg:p-10 hover:bg-gray-750/70 hover:border-purple-500/50 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/10"
              >
                <div className={`inline-flex p-5 rounded-2xl ${feature.color} mb-8 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="text-3xl text-white" />
                </div>
                
                <h3 className="text-2xl lg:text-3xl font-bold mb-6 text-white group-hover:text-purple-200 transition-colors duration-300">
                  {feature.title}
                </h3>
                
                <p className="text-gray-300 text-lg leading-relaxed group-hover:text-gray-200 transition-colors duration-300">
                  {feature.description}
                </p>
              </div>
            ))}
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