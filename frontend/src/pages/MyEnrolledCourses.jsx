import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaArrowLeftLong } from "react-icons/fa6";

function MyEnrolledCourses() {
  const { userData } = useSelector((state) => state.user);
  const navigate = useNavigate();

  // keep only course objects (ignore string IDs)
  const courses =
    userData?.enrolledCourses?.filter((course) => typeof course === "object") ||
    [];

  return (
    <div className="min-h-screen w-full px-4 py-9 bg-gray-50">

      <FaArrowLeftLong
        className="absolute top-[3%] md:top-[6%] left-[5%] w-[22px] h-[22px] cursor-pointer"
        onClick={() => navigate("/")}
      />

      <h1 className="text-3xl text-center font-bold text-gray-800 mb-6">
        My Enrolled Courses
      </h1>

      {courses.length === 0 ? (
        <p className="text-gray-500 text-center w-full">
          You haven't enrolled in any course yet.
        </p>
      ) : (
        <div className="flex items-center justify-center flex-wrap gap-[30px]">
          {courses.map((course) => (
            <div
              key={course._id}
              className="bg-white rounded-2xl shadow-md overflow-hidden border w-[260px]"
            >
              <img
                src={course.thumbnail}
                alt={course.title}
                className="w-full h-40 object-cover"
              />

              <div className="p-4">
                <h2 className="text-lg font-semibold text-gray-800">
                  {course.title}
                </h2>

                <p className="text-sm text-black">{course.category}</p>
                <p className="text-sm text-black">{course.level}</p>

                <button
                  onClick={() => navigate(`/viewlecture/${course._id}`)}
                  className="w-full mt-3 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition"
                >
                  Watch Now
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyEnrolledCourses;