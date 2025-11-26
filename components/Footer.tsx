"use client";

import React from "react";
import {
  FaFacebookF,
  FaInstagram,
  FaTelegramPlane,
  FaTiktok,
} from "react-icons/fa";
import Logo from "./Logo";

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-20 mt-24 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-6">
        {/* Logo + text */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <Logo size={180} />
          </div>

          <p className="text-lg text-gray-400 max-w-2xl mx-auto mt-4">
            Premium activewear designed for performance and style.
          </p>
        </div>

        {/* Social icons */}
        <div className="flex justify-center items-center gap-6 mb-10">
          {/* Telegram */}
          <a
            href="https://t.me/yourusername"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Follow us on Telegram"
            className="group relative p-4 rounded-full bg-gray-800/50 border border-gray-700
                       text-gray-400 hover:text-white
                       hover:bg-[#0088cc] hover:border-[#0088cc]
                       transform hover:scale-110 hover:-translate-y-1
                       transition-all duration-300 shadow-lg hover:shadow-[#0088cc]/40"
          >
            <FaTelegramPlane size={24} />
            <span
              className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 
                         pointer-events-none text-xs font-medium bg-gray-900 text-white px-3 py-1.5 rounded-lg
                         border border-gray-700 whitespace-nowrap transition-opacity duration-200"
            >
              Telegram
            </span>
          </a>

          {/* Facebook */}
          <a
            href="https://facebook.com/yourpage"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Follow us on Facebook"
            className="group relative p-4 rounded-full bg-gray-800/50 border border-gray-700
                       text-gray-400 hover:text-white
                       hover:bg-[#1877f2] hover:border-[#1877f2]
                       transform hover:scale-110 hover:-translate-y-1
                       transition-all duration-300 shadow-lg hover:shadow-blue-500/40"
          >
            <FaFacebookF size={24} />
            <span
              className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 
                           pointer-events-none text-xs font-medium bg-gray-900 text-white px-3 py-1.5 rounded-lg
                           border border-gray-700 whitespace-nowrap transition-opacity duration-200"
            >
              Facebook
            </span>
          </a>

          {/* Instagram */}
          <a
            href="https://instagram.com/yourprofile"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Follow us on Instagram"
            className="group relative p-4 rounded-full bg-gray-800/50 border border-gray-700
                       text-gray-400 hover:text-white
                       hover:bg-gradient-to-tr from-purple-600 via-pink-500 to-orange-400 
                       hover:border-pink-500
                       transform hover:scale-110 hover:-translate-y-1
                       transition-all duration-300 shadow-lg hover:shadow-pink-500/50"
          >
            <FaInstagram size={24} />
            <span
              className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 
                           pointer-events-none text-xs font-medium bg-gray-900 text-white px-3 py-1.5 rounded-lg
                           border border-gray-700 whitespace-nowrap transition-opacity duration-200"
            >
              Instagram
            </span>
          </a>

          {/* TikTok */}
          <a
            href="https://tiktok.com/@yourprofile"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Follow us on TikTok"
            className="group relative p-4 rounded-full bg-gray-800/50 border border-gray-700
                       text-gray-400 hover:text-white
                       hover:bg-black hover:border-white/30
                       transform hover:scale-110 hover:-translate-y-1
                       transition-all duration-300 shadow-lg hover:shadow-white/20"
          >
            <FaTiktok size={24} />
            <span
              className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 
                           pointer-events-none text-xs font-medium bg-gray-900 text-white px-3 py-1.5 rounded-lg
                           border border-gray-700 whitespace-nowrap transition-opacity duration-200"
            >
              TikTok
            </span>
          </a>
        </div>

        {/* Copyright */}
        <div className="text-center pt-8 border-t border-gray-800">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} Puda Activewear. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
