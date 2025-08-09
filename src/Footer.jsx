import React from "react";
import { FaTwitter, FaGithub, FaLinkedin, FaDiscord } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="w-full bg-[#181828] border-t border-violet-900/30 py-8 px-4 mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <span className="" >
            <img
              src="./src/assets/LOGO.png"
              alt="Collabria Nexus Logo"
              className="w-20 h-10"
            />
          </span>
          <span className="text-2xl font-extrabold text-violet-400 tracking-tight">CollabriaNexus</span>
          <span className="text-gray-500 text-sm hidden sm:inline">Empowering Your Journey</span>
        </div>
        <div className="flex gap-6 text-violet-400 text-2xl">
          <a href="https://twitter.com/" target="_blank" rel="noopener noreferrer" className="hover:text-violet-300 transition">
            <FaTwitter />
          </a>
          <a href="https://github.com/" target="_blank" rel="noopener noreferrer" className="hover:text-violet-300 transition">
            <FaGithub />
          </a>
          <a href="https://linkedin.com/" target="_blank" rel="noopener noreferrer" className="hover:text-violet-300 transition">
            <FaLinkedin />
          </a>
          <a href="https://discord.com/" target="_blank" rel="noopener noreferrer" className="hover:text-violet-300 transition">
            <FaDiscord />
          </a>
        </div>
        <div className="text-gray-500 text-xs text-center md:text-right">
          &copy; {new Date().getFullYear()} CollabriaNexus. All rights reserved.
        </div>
      </div>
    </footer>
  );
}