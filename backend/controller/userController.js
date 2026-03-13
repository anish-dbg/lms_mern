

//find current user

import uploadOnCloudinary from "../config/cloudinary.js";
import User from "../model/userModel.js"

export const getCurrentUser = async(req,res) =>{
    try {
        const user = await User.findById(req.userId)
  .populate({
    path: "enrolledCourses",
    model: "Course"
  })
  .select("-password");
        console.log("populate Course", user.enrolledCourses)
        if(!user){
            return res.status(404).json({
                msg: "User not found"
            })
        }
        return res.status(200).json(user);
    } catch (error) {
        return res.status(500).json({msg:
            `GetCurrent User error${error}`
        })
        
    }
}

export const updateProfile = async (req,res) =>{
    try{
        const userId = req.userId;

        if(!userId){
            return res.status(400).json({
                msg:"User not authenticated"
            })
        }

        const updateData = {};

        if(req.body.name){
            updateData.name = req.body.name;
        }

        if(req.body.description){
            updateData.description = req.body.description;
        }
        
        if(req.file){
            const uploaded = await uploadOnCloudinary(req.file.path);
            if(uploaded){
                updateData.photoUrl = uploaded;
            }
        }

     const user = await User.findByIdAndUpdate(
     userId,
     updateData,
     { returnDocument: 'after' }
    ).select("-password");

        if(!user){
            return res.status(404).json({
                msg: "User not Found"
            })
        }

        return res.status(200).json(user)

    }catch(error){
        return res.status(500).json({
            msg:`updateProfile error ${error}`
        })
    }
}