import Course from "../model/courseModel.js";
import uploadOnCloudinary from "../config/cloudinary.js";
import Lecture from "../model/lectureModel.js";
import User from "../model/userModel.js";

export const createCourse = async(req,res) =>{
    try {
        const {title,category} = req.body;
        if(!title || !category){
            return res.status(400).json({
                msg: "title or category is required"
            })
        }
        const course = await Course.create({
            title,
            category,
            creator: req.userId
        })
        return res.status(201).json(course);
    } catch (error) {
        return res.status(500).json({
            msg: `CreateCourse error ${error}`
        })
    }
}

// see the course
export const getPublishedCourses = async(req,res) =>{
    try {
        const courses = await Course.find({isPublished:true}).populate('lectures reviews');
        if(!courses){
            return res.status(400).json({
                msg: "Course not found"
            })
        }
        return res.status(200).json(courses)
    } catch (error) {
        return res.status(500).json({
            msg: `failed to find isPublished Courses ${error}`
        })
        
    }
}

// admin course Creator to see

export const getCreatorCourses = async(req,res) =>{
    try {
        const userId = req.userId;
        const courses = await Course.find({creator:userId});
        if(!courses){
            return res.status(400).json({
                msg: "Courses are not found"
            })
        }
        return res.status(200).json(courses);
    } catch (error) {
        return res.status(500).json({
            msg: `failed to get creator courses ${error}`
        })
    }
}



// edit courses

export const editCourse = async (req, res) => {
  try {
    console.log("BODY:", req.body);
    console.log("FILE:", req.file);
    console.log("PARAMS:", req.params);

    const { courseId } = req.params;

    if (!courseId) {
      return res.status(400).json({
        msg: "CourseId is required",
      });
    }

    const {
      title,
      subTitle,
      description,
      category,
      level,
      isPublished,
      price,
    } = req.body;

    let course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
        msg: "Course is not found",
      });
    }

    // ✅ build update object safely
    const updateData = {};

    if (title) updateData.title = title;
    if (subTitle) updateData.subTitle = subTitle;
    if (description) updateData.description = description;
    if (category) updateData.category = category;
    if (level) updateData.level = level;
    if (price) updateData.price = price;

    if (isPublished !== undefined) {
      updateData.isPublished = isPublished;
    }

    // ✅ SAFE file handling
    if (req.file && req.file.path) {
      const uploaded = await uploadOnCloudinary(req.file.path);
      if (uploaded) {
        updateData.thumbnail = uploaded;
      }
    }

    course = await Course.findByIdAndUpdate(
      courseId,
      updateData,
      { new: true }
    );

    return res.status(200).json(course);

  } catch (error) {
    console.error("🔥 EDIT COURSE ERROR:", error);

    return res.status(500).json({
      msg: error.message,
    });
  }
};


//  getCourseById

export const getCourseById = async(req,res) =>{
    try {
        const {courseId} = req.params;
        let course = await Course.findById(courseId);
        if(!course){
            return res.status(400).json({
                msg: "Course is not found"
            })
        }
        return res.status(200).json(course);
    } catch (error) {
        return res.status(500).json({
            msg: `failed to get Course by id ${error}`
        })   
    }
}


// delete course

export const removeCourse = async(req,res) =>{
    try {
        const {courseId} = req.params;
        let course = await Course.findById(courseId);
        if(!course){
            return res.status(400).json({
                msg: "Course is not found"
            })
        }
        await Course.findByIdAndDelete(courseId, {new:true});
        return res.status(200).json({
            msg: "Course removed"
        })
    } catch (error) {
         return res.status(500).json({
            msg: `failed to get Course by id ${error}`
        })  
    }
}

// for Lecture (create and lecture ander push krna hai)
export const createLecture = async (req, res) => {
  try {
    const { lectureTitle } = req.body;
    const { courseId } = req.params;

    // ✅ ADD THIS
    if (!courseId) {
      return res.status(400).json({ msg: "Course ID is required" });
    }

    if (!lectureTitle) {
      return res.status(400).json({ msg: "Lecture title required" });
    }

    const lecture = await Lecture.create({ lectureTitle });

    const course = await Course.findByIdAndUpdate(
      courseId,
      { $push: { lectures: lecture._id } },
      { new: true }
    );

    // ✅ extra safety
    if (!course) {
      return res.status(404).json({ msg: "Course not found" });
    }

    return res.status(201).json({ lecture });

  } catch (error) {
    console.log("Create Lecture Error:", error);
    return res.status(500).json({ msg: error.message });
  }
};

// course lecture get krna reducers

export const getCourseLecture = async (req,res) =>{
    try {
        const {courseId} = req.params;
        const course = await Course.findById(courseId);
        if(!course) {
            return res.status(404).json({
                msg: "course is not found"
            })
        }
        await course.populate("lectures");
        await course.save();
        return res.status(200).json(course);
    } catch (error) {
        return res.status(500).json({
            msg: `failed to getCourseLecture ${error}`
        })   
    }
}
export const editLecture = async (req, res) => {
  try {
    console.log("BODY:", req.body);
    console.log("FILE:", req.file);
    console.log("PARAMS:", req.params);

    const { lectureId } = req.params;
    const { isPreviewFree, lectureTitle } = req.body;

    const lecture = await Lecture.findById(lectureId);

    if (!lecture) {
      return res.status(404).json({
        msg: "Lecture is not found",
      });
    }

    // ✅ SAFE FILE HANDLING
    if (req.file && req.file.path) {
      const videoUrl = await uploadOnCloudinary(req.file.path);
      lecture.videoUrl = videoUrl;
    }

    // ✅ SAFE TITLE UPDATE
    if (lectureTitle) {
      lecture.lectureTitle = lectureTitle;
    }

    // ✅ SAFE BOOLEAN
    if (isPreviewFree !== undefined) {
      lecture.isPreviewFree = isPreviewFree === "true";
    }

    await lecture.save();

    return res.status(200).json(lecture);

  } catch (error) {
    console.error("🔥 EDIT LECTURE ERROR:", error);

    return res.status(500).json({
      msg: error.message,
    });
  }
};


// lecture removed

export const removeLecture = async(req,res) =>{
    try {
        const {lectureId} = req.params;
        const lecture = await Lecture.findByIdAndDelete(lectureId);
        if(!lecture){
            return res.status(404).json({
                msg: "Lecture is not found"
            })
        }
        await Course.updateOne({lectures:lectureId},{$pull:{lectures:lectureId}});
        return res.status(200).json({
            msg: "Lecture Removed"
        })
    } catch (error) {
        return res.status(500).json({
            msg:`failed to remove Lecture ${error}`
        })
    }
}


// creater ke course ko view krana hai

export const getCreatorById = async(req,res) =>{
    try {
        const {userId} = req.body;
        const user = await User.findById(userId).select('-password');

        if(!user){
            return res.status(404).json({msg: "User is not Found"})
        }
        return res.status(200).json(user);
    } catch (error) {
        return res.status(500).json({
            msg: `failed to get Creator ${error}`
        })
        
    }
}