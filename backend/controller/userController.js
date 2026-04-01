

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
export const updateProfile = async (req, res) => {
  try {
    console.log("BODY:", req.body);
    console.log("FILE:", req.file);
    console.log("USERID:", req.userId);

    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({
        msg: "User not authenticated",
      });
    }

    const updateData = {};

    if (req.body.name) {
      updateData.name = req.body.name;
    }

    if (req.body.description) {
      updateData.description = req.body.description;
    }

    // ✅ SAFE FILE HANDLING
    if (req.file && req.file.path) {
      const uploaded = await uploadOnCloudinary(req.file.path);
      if (uploaded) {
        updateData.photoUrl = uploaded;
      }
    }

    const user = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true } // 🔥 FIX THIS (IMPORTANT)
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        msg: "User not Found",
      });
    }

    return res.status(200).json(user);

  } catch (error) {
    console.error("🔥 PROFILE ERROR:", error);

    return res.status(500).json({
      msg: error.message,
    });
  }
};