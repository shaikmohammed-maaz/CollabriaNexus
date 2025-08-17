import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaHome ,FaBlog , FaParagraph , FaPhoneAlt , FaChartBar} from "react-icons/fa";
import Logo from './assets/LOGO.png'; // Assuming you have a logo image

export default function NavBar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 w-full z-50 glass border-b border-violet-300/30 shadow-lg rounded-b-2xl">
      <div className="max-w-7xl mx-auto flex items-
      center justify-between px-6 py-3">
        <div className="text-xl font-bold gradient-text"> <span><img className="w-[50px] inline" src={Logo} alt="Logo" /></span> CollabriaNexus</div>
        {/* Hamburger Button */}
        <button
          className="md:hidden flex flex-col justify-center items-center w-10 h-10"
          onClick={() => setOpen(!open)}
          aria-label="Toggle navigation"
        >
          <span className={`block h-0.5 w-6 bg-white transition-all duration-300 ${open ? "rotate-45 translate-y-1.5" : ""}`}></span>
          <span className={`block h-0.5 w-6 bg-white my-1 transition-all duration-300 ${open ? "opacity-0" : ""}`}></span>
          <span className={`block h-0.5 w-6 bg-white transition-all duration-300 ${open ? "-rotate-45 -translate-y-1.5" : ""}`}></span>
        </button>
        {/* Desktop Menu */}
        <ul className="hidden md:flex space-x-8 font-medium text-white">
          <li>
            <Link to="/" className="hover:text-violet-300 transition">
              Home
            </Link>
            {/* <a href="/" className="hover:text-violet-300 transition">Home</a> */}
          </li>
          <li>
            {/* <a href="/blog" className="hover:text-violet-300 transition">Blogs</a>
             */}
            <Link to="/blog" className="hover:text-violet-300 transition">
              Blogs
            </Link>
          </li>
          <li>
            {/* <a href="/about" className="hover:text-violet-300 transition">About Us</a> */}
            <Link to="/about" className="hover:text-violet-300 transition">
              About Us
            </Link>
          </li>
          <li>
            <Link to="/dashboard" className="hover:text-violet-300 transition">
              Dashboard
            </Link>
          </li>
        </ul>
      </div>
     {/* Mobile Menu */}
<ul
  className={`md:hidden bg-[#181828] border-t border-violet-300/20 shadow-xl rounded-b-2xl px-4 py-4 font-medium text-white absolute w-full left-0 transition-all duration-300 ease-in-out transform ${
    open ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0 pointer-events-none"
  }`}
>
  {[
    { to: "/", label: "Home", icon: <FaHome/> },
    { to: "/blog", label: "Blogs", icon: <FaBlog/> },
    { to: "/about", label: "About Us", icon: <FaParagraph/> },
    { to: "/dashboard", label: "Dashboard", icon: <FaChartBar/> },
  ].map((item, idx) => (
    <li key={idx} className="border-b border-violet-300/10 last:border-none">
      <Link
        to={item.to}
        className="flex items-center gap-3 py-3 px-2 rounded-lg hover:bg-violet-500/20 hover:text-violet-300 transition-colors"
        onClick={() => setOpen(false)}
      >
        <span className="text-lg">{item.icon}</span>
        <span>{item.label}</span>
      </Link>
    </li>
  ))}
</ul>
   </nav>
  );
}