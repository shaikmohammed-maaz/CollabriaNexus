import React from "react";

export default function NavBar() {
  return (
    <nav className="fixed top-0 left-0 w-full z-50 glass border-b border-violet-300/30 shadow-lg rounded-b-2xl">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">
        <div className="text-xl font-bold gradient-text">CollabriaNexus</div>
        <ul className="flex space-x-8 font-medium text-white">
          <li>
            <a href="/" className="hover:text-violet-300 transition">Home</a>
          </li>
          <li>
            <a href="/blogs" className="hover:text-violet-300 transition">Blogs</a>
          </li>
          <li>
            <a href="/about" className="hover:text-violet-300 transition">About Us</a>
          </li>
          <li>
            <a href="/contact" className="hover:text-violet-300 transition">Contact Us</a>
          </li>
        </ul>
      </div>
    </nav>
  );
}