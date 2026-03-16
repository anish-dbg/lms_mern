import React from "react";
import about from "../assets/about.jpg";
import video from "../assets/video.mp4";
import { TfiLayoutLineSolid } from "react-icons/tfi";
import { BsPatchCheckFill } from "react-icons/bs";

function About() {
  return (
    <div className="w-[100vw] lg:h-[70vh] min-h-[50vh] flex flex-wrap items-center justify-center gap-2 mb-[30px]">
      
      {/* Image Section */}
      <div className="lg:w-[40%] md:w-[80%] w-[100%] h-[100%] flex items-center justify-center relative">
        <img
          src={about}
          alt="about"
          className="w-[85%] rounded-lg object-cover"
        />

        {/* Video Overlay */}
        <div className="max-w-[350px] absolute top-[55%] left-[50%] mx-auto p-4">
          <video
            src={video}
            className="w-full rounded-xl shadow-lg border-2 border-white"
            controls
            autoPlay
            loop
            muted
          ></video>
        </div>
      </div>

      {/* About Info */}
      <div className="lg:w-[45%] md:w-[80%] w-full flex flex-col gap-5 px-[30px] md:px-[60px]">

        {/* Title */}
        <div className="flex items-center gap-4 text-[18px] font-medium">
          About Us
          <TfiLayoutLineSolid className="w-[40px] h-[20px]" />
        </div>

        {/* Heading */}
        <div className="md:text-[42px] text-[30px] font-semibold leading-tight">
          We Are Maximize Your Learning Growth
        </div>

        {/* Description */}
        <div className="text-[15px] text-gray-600">
          We provide a modern Learning Management System to simplify online
          education, track progress, and enhance student-instructor
          collaboration efficiently.
        </div>

        {/* Features */}
        <div className="grid grid-cols-2 gap-4 mt-3">
          <div className="flex items-center gap-2">
            <BsPatchCheckFill className="text-green-600" />
            Simplified Learning
          </div>

          <div className="flex items-center gap-2">
            <BsPatchCheckFill className="text-green-600" />
            Expert Trainers
          </div>

          <div className="flex items-center gap-2">
            <BsPatchCheckFill className="text-green-600" />
            Big Experience
          </div>

          <div className="flex items-center gap-2">
            <BsPatchCheckFill className="text-green-600" />
            Lifetime Access
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;