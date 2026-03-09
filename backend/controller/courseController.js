import Course from "../model/courseModel.js";
import uploadOnCloudinary from "../config/cloudinary.js";
import Lecture from "../model/lectureModel.js";

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
        const courses = await Course.find({isPublished:true});
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

export const editCourse = async (req,res) =>{
    try {
        const {courseId} = req.params; // useParams set and get kr denge
        const {title,subTitle,description,category,level,isPublished,price} = req.body;
        let thumbnail;
        if(req.file){
            thumbnail = await uploadOnCloudinary(req.file.path);
        }
        let course = await Course.findById(courseId);
        if(!course){
            return res.status(400).json({
                msg: "Course is not found"
            }) 
        }
        const updateData = {title,subTitle,description,category,level,isPublished,price,thumbnail};
        course = await Course.findByIdAndUpdate(courseId,updateData,{new:true});
        return res.status(200).json(course);
    } catch (error) {
         return res.status(500).json({
            msg: `failed to edit courses ${error}`
        })
    }
}


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
export const createLecture = async (req,res)=>{
  try {

    const {lectureTitle} = req.body;
    const {courseId} = req.params;

    if(!lectureTitle){
      return res.status(400).json({msg:"Lecture title required"});
    }

    const lecture = await Lecture.create({lectureTitle});

    await Course.findByIdAndUpdate(
      courseId,
      {$push:{lectures:lecture._id}}
    );

    return res.status(201).json({lecture});

  } catch(error){
    console.log("Create Lecture Error:",error);
    return res.status(500).json({msg:"Failed to create lecture"});
  }
}


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

export const editLecture = async(req,res) =>{
    try {
        const {lectureId} = req.params;
        const {isPreviewFree, lectureTitle} = req.body;
        const lecture = await Lecture.findById(lectureId);
        if(!lecture){
            return res.status(404).json({
                msg: "Lecture is not found"
            })
        }
        let videoUrl;
        if(req.file){
            videoUrl = await uploadOnCloudinary(req.file.path);
            lecture.videoUrl = videoUrl;
        }
        if(lectureTitle){
            lecture.lectureTitle = lectureTitle;
         }
       lecture.isPreviewFree = isPreviewFree;
       await lecture.save();
       return res.status(200).json(lecture);
    } catch (error) {
        return res.status(500).json({
            msg: `failed to edit Lecture ${error}`
        })        
    }
}


// lecture removed

export const removeLecture = async(req,res) =>{
    try {
        const {lectureId} = req.params;
        const lecture = await Lecture.findByIdAndDelete(lectureId);
        if(lecture){
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

