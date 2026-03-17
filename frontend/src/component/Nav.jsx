import React, { useState } from "react";
import logo from "../assets/logo.jpg";
import { IoPersonCircle } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setUserData } from "../redux/userSlice";

import axios from "axios";
import { serverUrl } from "../App";
import { toast } from "react-toastify";
import { RxHamburgerMenu, RxCross2 } from "react-icons/rx";

function Nav() {
  const { userData } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [show, setShow] = useState(false);
  const [showHam, setShowHam] = useState(false);

  const handleLoginOut = async () => {
    try {
      await axios.get(serverUrl + "/api/auth/logout", {
        withCredentials: true,
      });

      dispatch(setUserData(null));
      toast.success("Logout successfully");
      navigate("/");
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.msg || "Logout failed");
    }
  };

  return (
    <div>
      <div className="w-full h-[70px] fixed top-0 px-[20px] py-[10px] flex items-center justify-between bg-[#00000047] z-10">

        {/* Logo */}
        <div className="lg:w-[20%] w-[40%] lg:pl-[50px]">
          <img
            src={logo}
            alt="logo"
            className="w-[60px] rounded-[5px] border-2 border-white"
          />
        </div>

        {/* Desktop Menu */}
        <div className="w-[30%] lg:flex items-center justify-center gap-4 hidden">

          {/* Avatar */}
          {!userData ? (
            <IoPersonCircle
              className="w-[50px] h-[50px] fill-white cursor-pointer"
              onClick={() => navigate("/login")}
            />
          ) : userData?.photoUrl ? (
            <img
              src={userData.photoUrl}
              alt="profile"
              className="w-[50px] h-[50px] rounded-full border-2 border-white object-cover cursor-pointer"
              onClick={() => setShow(!show)}
            />
          ) : (
            <div
              className="w-[50px] h-[50px] rounded-full bg-white text-black flex items-center justify-center text-[20px] border-2 border-white cursor-pointer"
              onClick={() => setShow(!show)}
            >
              {userData?.name?.slice(0, 1).toUpperCase()}
            </div>
          )}

          {/* Educator Dashboard */}
          {userData?.role === "educator" && (
            <div
              className="px-[20px] py-[10px] border-2 border-white text-white bg-black rounded-[10px] text-[18px] cursor-pointer"
              onClick={() => navigate("/dashboard")}
            >
              Dashboard
            </div>
          )}

          {/* Login / Logout */}
          {!userData ? (
            <span
              className="px-[20px] py-[10px] border-2 border-white text-white rounded-[10px] text-[18px] cursor-pointer bg-[#000000d5]"
              onClick={() => navigate("/login")}
            >
              Login
            </span>
          ) : (
            <span
              className="px-[20px] py-[10px] border-2 bg-white text-black rounded-[10px] text-[18px] cursor-pointer"
              onClick={handleLoginOut}
            >
              Logout
            </span>
          )}

          {/* Dropdown */}
          {show && userData && (
            <div className="absolute top-[110%] right-[15%] flex flex-col items-center gap-2 text-[16px] rounded-md bg-white px-[15px] py-[10px] border-2 border-black">

              <span
                className="bg-black text-white px-[30px] py-[10px] rounded-2xl hover:bg-gray-600 cursor-pointer"
                onClick={() => navigate("/profile")}
              >
                My Profile
              </span>

              <span
                className="bg-black text-white px-[30px] py-[10px] rounded-2xl hover:bg-gray-600 cursor-pointer"
                onClick={() => navigate("/mycourses")}
              >
                My Courses
              </span>

            </div>
          )}
        </div>

        {/* Hamburger */}
        <RxHamburgerMenu
          className="w-[35px] h-[35px] lg:hidden text-white cursor-pointer"
          onClick={() => setShowHam(!showHam)}
        />

        {/* Mobile Menu */}
        <div
          className={`fixed top-0 left-0 w-screen h-screen bg-[#000000d6] flex items-center justify-center flex-col gap-5 z-10 lg:hidden ${
            showHam
              ? "translate-x-0 transition duration-500"
              : "-translate-x-full transition duration-500"
          }`}
        >

          <RxCross2
            className="w-[35px] h-[35px] fill-white absolute top-5 right-[4%]"
            onClick={() => setShowHam(false)}
          />

          {/* Avatar */}
          {!userData ? (
            <IoPersonCircle className="w-[50px] h-[50px] fill-white" />
          ) : userData?.photoUrl ? (
            <img
              src={userData.photoUrl}
              alt="profile"
              className="w-[50px] h-[50px] rounded-full border-2 border-white object-cover"
            />
          ) : (
            <div className="w-[50px] h-[50px] rounded-full bg-white text-black flex items-center justify-center text-[20px] border-2 border-white">
              {userData?.name?.slice(0, 1).toUpperCase()}
            </div>
          )}

          <div
            className="w-[200px] h-[65px] border-2 border-white text-white bg-black rounded-[10px] flex items-center justify-center text-[18px] cursor-pointer"
            onClick={() => navigate("/profile")}
          >
            My Profile
          </div>

          <div
            className="w-[200px] h-[65px] border-2 border-white text-white bg-black rounded-[10px] flex items-center justify-center text-[18px] cursor-pointer"
            onClick={() => navigate("/mycourses")}
          >
            My Courses
          </div>

          {userData?.role === "educator" && (
            <div
              className="w-[200px] h-[65px] border-2 border-white text-white bg-black rounded-[10px] flex items-center justify-center text-[18px] cursor-pointer"
              onClick={() => navigate("/dashboard")}
            >
              Dashboard
            </div>
          )}

          {!userData ? (
            <span
              className="w-[200px] h-[65px] border-2 border-white text-white bg-black rounded-[10px] flex items-center justify-center text-[18px] cursor-pointer"
              onClick={() => navigate("/login")}
            >
              Login
            </span>
          ) : (
            <span
              className="w-[200px] h-[65px] border-2 border-white text-white bg-black rounded-[10px] flex items-center justify-center text-[18px] cursor-pointer"
              onClick={handleLoginOut}
            >
              Logout
            </span>
          )}

        </div>
      </div>
    </div>
  );
}

export default Nav;