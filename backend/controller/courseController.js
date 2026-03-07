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

export const createLecture = async(req,res) =>{
    try {
        const {lectureTitle} = req.body;
        const {courseId} = req.params;
        if(lectureTitle || courseId){
            returnres.status(400).json({
                msg: "lectureTitle is required"
            })
        }
        const lecture = await Lecture.create({lectureTitle});
        const course = await Course.findById(courseId);
        if(course){
            course.lectures.push(lecture._id)
        }
        course.populate("lectures")
        course.save()
        return res.status(500).json({lecture,course})
    } catch (error) {
        
        return res.status(500).json({
            msg: `failed to delete Course ${error}`
        })
    }
}



// course lecture get