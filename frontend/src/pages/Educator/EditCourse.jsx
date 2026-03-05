import React, { useEffect, useRef, useState } from "react";
import { FaArrowLeftLong } from "react-icons/fa6";
import { useNavigate, useParams } from "react-router-dom";
import img from "../../assets/empty.jpg";
import { FaEdit } from "react-icons/fa";
import axios from "axios";
import { serverUrl } from "../../App";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";

function EditCourse() {
const navigate = useNavigate();
  const { courseId } = useParams();
  const thumb = useRef();

  const [isPublished, setIsPublished] = useState(false);
  const [title, setTitle] = useState("");
  const [subTitle, setSubTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [level, setLevel] = useState("");
  const [price, setPrice] = useState("");
  const [selectCourse,setSelectCourse] = useState(null);
  const [frontendImg, setFrontendImg] = useState(img);
  const [backendImg, setBackendImg] = useState(null);
  const [loading, setLoading] = useState(false);

  // Thumbnail change
  const handleThumbnail = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBackendImg(file);
      setFrontendImg(URL.createObjectURL(file));
    }
  };

  // Get course by id
  useEffect(() => {
  const getCourseById = async () => {
    try {
      const result = await axios.get(
        `${serverUrl}/api/course/getcourse/${courseId}`,
        { withCredentials: true }
      );

      const course = result.data; // 👈 store in variable first

      setSelectCourse(course);

      // 👇 use course directly (NOT selectCourse)
      setTitle(selectCourse.title || "");
      setSubTitle(selectCourse.subTitle || "");
      setDescription(selectCourse.description || "");
      setCategory(selectCourse.category || "");
      setLevel(selectCourse.level || "");
      setPrice(selectCourse.price || "");
      setFrontendImg(selectCourse.thumbnail || img);
      setIsPublished(selectCourse.isPublished || false);

    } catch (error) {
      console.log(error);
    }
  };

  if (courseId) getCourseById();
}, [courseId]);

  // Save / Update course
  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("subTitle", subTitle);
      formData.append("description", description);
      formData.append("category", category);
      formData.append("level", level);
      formData.append("price", price);
      formData.append("isPublished", isPublished);

      if (backendImg) {
        formData.append("thumbnail", backendImg);
      }

      await axios.post(
        `${serverUrl}/api/course/editcourse/${courseId}`,
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      navigate("/courses");
      setLoading(false);
      toast.success("Course updated")
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.msg);
    }
  };


  return (
    <div className="max-w-5xl mx-auto p-6 mt-10 bg-white rounded-lg shadow-md">
      {/* top bar */}
      <div className="flex items-center justify-center gap-[20px] md:justify-between flex-col md:flex-row mb-6 relative">
        <FaArrowLeftLong
          className="top-[-20%] md:top-[20%] absolute left-[0] md:left-[2%] w-[22px] h-[22px] cursor-pointer "
          onClick={() => navigate("/courses")}
        />
        <h2 className="text-2xl font-semibold md:pl-[60px]">
          Add Detail Information regarding the Course
        </h2>
        <div className="space-x-2 space-y-2">
          <button className="bg-black text-white px-4 py-2 rounded-md">
            Go to Lecture page
          </button>
        </div>
      </div>
      {/* form details */}
      <div className="bg-gray-50 p-6 rounded-md">
        <h2 className="text-lg font-medium mb-4">Basic Course Information</h2>
        <div className="space-x-2 space-y-2">
          {!isPublished ? (
            <button
              className="bg-green-100 text-green-600 px-4 py-2 rounded-md border-1"
              onClick={() => setIsPublished((prev) => !prev)}
            >
              Click to Publish
            </button>
          ) : (
            <button
              className="bg-red-100 text-red-600 px-4 py-2 rounded-md border-1"
              onClick={() => setIsPublished((prev) => !prev)}
            >
              Click to Publish
            </button>
          )}
          <button className="bg-red-600 text-white px-4 py-2 rounded-md border-1">
            Remove Course
          </button>
        </div>
        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Title
            </label>
            <input
              id="title"
              type="text"
              className="w-full border px-4 py-2 rounded-md"
              placeholder="CourseTitle"
              onChange={(e) => setTitle(e.target.value)} value={title}
            />
          </div>
          <div>
            <label
              htmlFor="subTitle"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              SubTitle
            </label>
            <input
              id="subTitle"
              type="text"
              className="w-full border px-4 py-2 rounded-md"
              placeholder="SubTitle"
              onChange={(e) => setSubTitle(e.target.value)} value={subTitle}
            />
          </div>
          <div>
            <label
              htmlFor="Description"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Description
            </label>
            <textarea
              id="Description"
              type="text"
              className="w-full border px-4 py-2 h-24 resize-none rounded-md"
              placeholder="Course Description"
              onChange={(e) => setDescription(e.target.value)} value={description}
            />
          </div>
          <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-x-4 space-y-4 sm:space-y-0">
            {/* for category */}
            <div className="flex-1">
              <label
                htmlFor=""
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Category
              </label>
              <select
                name=""
                id=""
                className="w-full border px-4 py-2 rounded-md bg-white"
                onChange={(e) => setCategory(e.target.value)} value={category}
              >
                <option value="">Select Category</option>
                <option value="App Development">App Development</option>
                <option value="AI/ML">AI/ML</option>
                <option value="AI Tools">AI Tools</option>
                <option value="Data Science">Data Science</option>
                <option value="Data Analytics">Data Analytics</option>
                <option value="Ethical Hacking">Ethical Hacking</option>
                <option value="UI/UX Designing">UI/UX Designing</option>
                <option value="Web Development">Web Development</option>
                <option value="Others">Others</option>
              </select>
            </div>
            {/* for label */}
            <div className="flex-1">
              <label
                htmlFor=""
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Course Level
              </label>
              <select
                name=""
                id=""
                className="w-full border px-4 py-2 rounded-md bg-white"
              >
                <option value="">Select Level</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
            {/* for price */}
            <div className="flex-1">
              <label
                htmlFor="price"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Course Price
              </label>
              <input
                type="number"
                name=""
                id="price"
                className="w-full border px-4 py-2 rounded-md"
                placeholder="$"
                onChange={(e) => setPrice(e.target.value)} value={price}
              />
            </div>
          </div>
          <div>
            <label
              htmlFor=""
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Course Thumbnail
            </label>
            <input type="file" hidden ref={thumb} accept="image/*" onChange={handleThumbnail} />
          </div>
          <div className="relative w-[300px] h-[170px]">
            <img
              src={frontendImg}
              alt=""
              className="w-[100%] h-[100%] border-1 border-black rounded-[5px]"
              onClick={() => thumb.current.click()}
            />
            <FaEdit
              className="w-[20px] h-[20px] absolute top-2 right-2"
              onClick={() => thumb.current.click()}
            />
          </div>
          <div className='flex items-center justify-start gap-[15px]'>
            <button  className="bg-green-100 text-green-600 px-4 py-2 rounded-md border-1 cursor-pointer" onClick={handleUpdate}>
             {loading ?<ClipLoader size={30} color="white"/>: "Save"}
            </button>
            <button
             className="bg-red-600 text-white px-7 py-2 rounded-md border-1 cursor-pointer"
              onClick={() => navigate("/courses")}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditCourse;
