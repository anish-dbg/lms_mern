import React from "react";
import logo from "../assets/logo.jpg";
import { useNavigate } from "react-router-dom";

function Footer() {
  const navigate = useNavigate();

  return (
    <div className="bg-black text-gray-300 py-10 px-6 mt-20">
      <div className="max-w-7xl mx-auto flex lg:items-start items-start justify-between gap-10 flex-col lg:flex-row">

        {/* Logo Section */}
        <div className="lg:w-[40%] md:w-[60%] w-full">
          <img src={logo} alt="logo" className="h-10 mb-3 rounded-md" />
          <h2 className="text-xl font-bold text-white mb-3">
            Virtual Courses
          </h2>
          <p className="text-sm">
            AI-powered learning platform to help you grow smarter. Learn
            anything, anytime, anywhere.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <div className="text-white font-semibold mb-3">Quick Links</div>
          <ul className="text-sm space-y-2">
            <li onClick={() => navigate("/")} className="hover:text-white cursor-pointer">Home</li>
            <li onClick={() => navigate("/allcourses")} className="hover:text-white cursor-pointer">All Courses</li>
            <li onClick={() => navigate("/login")} className="hover:text-white cursor-pointer">Login</li>
            <li onClick={() => navigate("/profile")} className="hover:text-white cursor-pointer">Profile</li>
          </ul>
        </div>

        {/* Categories */}
        <div>
          <div className="text-white font-semibold mb-3">Categories</div>
          <ul className="text-sm space-y-2">
            <li className="hover:text-white">Web Development</li>
            <li className="hover:text-white">App Development</li>
            <li className="hover:text-white">AI / ML</li>
            <li className="hover:text-white">UI / UX Designing</li>
          </ul>
        </div>

      </div>

      <div className="border-t border-gray-700 mt-10 pt-5 text-sm text-center text-gray-500">
        © {new Date().getFullYear()} LearnAI. All rights reserved.
      </div>
    </div>
  );
}

export default Footer;