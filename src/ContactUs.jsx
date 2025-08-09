import React from "react";
import { FaEnvelope, FaPhoneAlt, FaMapMarkerAlt } from "react-icons/fa";

const ContactUs = () => {
  return (
    <div className="bg-[#0f0f1a] text-white min-h-screen py-20 px-6">
      {/* Page Header */}
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-purple-400">
          Contact Us
        </h1>
        <p className="mt-4 text-gray-300 max-w-2xl mx-auto text-base md:text-lg">
          Got questions, feedback, or ideas? We’d love to hear from you.
          Drop us a message and we’ll get back to you as soon as possible.
        </p>
      </div>

      {/* Grid Layout */}
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-start">
        {/* Contact Form */}
        <form className="bg-[#1d1d2e] p-8 rounded-lg shadow-lg border border-purple-600/30 space-y-6">
          {[
            { label: "Name", type: "text", placeholder: "Your name" },
            { label: "Email", type: "email", placeholder: "you@example.com" },
            { label: "Subject", type: "text", placeholder: "Subject" },
          ].map(({ label, type, placeholder }, idx) => (
            <div key={idx}>
              <label className="block text-sm text-left text-gray-300 mb-1">{label}</label>
              <input
                type={type}
                placeholder={placeholder}
                className="w-full px-4 py-2 rounded-md bg-[#0f0f1a] border border-gray-700 focus:border-purple-500 focus:outline-none text-white text-sm"
                required
              />
            </div>
          ))}

          {/* Message Textarea */}
          <div>
            <label className="block text-sm text-left text-gray-300 mb-1">Message</label>
            <textarea
              placeholder="Write your message..."
              rows="5"
              className="w-full px-4 py-2 rounded-md bg-[#0f0f1a] border border-gray-700 focus:border-purple-500 focus:outline-none text-white text-sm resize-none"
              required
            ></textarea>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-2 bg-gradient-to-r from-pink-500 to-purple-600 rounded-md font-semibold hover:opacity-90 transition"
          >
            Send Message
          </button>
        </form>

        {/* Contact Info */}
        <div className="bg-[#1d1d2e] p-8 rounded-lg shadow-lg border border-purple-600/30 flex flex-col justify-between space-y-6">
          {[
            {
              icon: <FaEnvelope className="text-purple-400 text-xl" />,
              title: "Email",
              value: "support@mineverse.com",
            },
            {
              icon: <FaPhoneAlt className="text-purple-400 text-xl" />,
              title: "Phone",
              value: "+1 (555) 123-4567",
            },
            {
              icon: <FaMapMarkerAlt className="text-purple-400 text-xl" />,
              title: "Address",
              value: "123 Crypto Street, Blockchain City, 00000",
            },
          ].map(({ icon, title, value }, idx) => (
            <div key={idx} className="flex items-start space-x-4">
              {icon}
              <div>
                <p className="font-semibold">{title}</p>
                <p className="text-gray-300 text-sm">{value}</p>
              </div>
            </div>
          ))}

          <div className="pt-2 border-t border-gray-700 mt-4">
            <p className="text-sm text-gray-400">
              Our support team is available 24/7 to assist you with your mining journey.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
