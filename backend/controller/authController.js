import User from "../model/userModel.js";
import validator from "validator";
import bcrypt from "bcryptjs";
import genToken from "../config/token.js";
import sendMail from "../config/sendEmail.js";


export const signUp = async (req,res) =>{
    try{
        const {name, email, password,role} = req.body;
        let existUser = await User.findOne({email});
        if(existUser){
            return res.status(400).json({
                msg: "User already exist"
            })
        }
        if(!validator.isEmail(email)){
            return res.status(400).json({
                msg: "Enter Valid email"
            })
        }
        if(password.length < 8){
            return res.status(400).json({
                msg: "Enter Strong Password"
            })
        }
        let hashPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            name,
            email,
            password: hashPassword,
            role
        })
        // token generate hona chahiyea or yae parse ho jaye cookies mai store
        let token = await genToken(user._id);
        res.cookie("token",token,{
            httpOnly:true,
            secure:true,
            sameSite: "none",
            maxAge: 7*24*60*60*1000
        })
        return res.status(201).json(user);
    }catch(error){
        return res.status(500).json({msg: `Signup error ${error}`})
    }
}

export const login = async (req, res) => {
  try {
    console.log("BODY:", req.body);

    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        msg: "User not found",
      });
    }

    // ✅ handle google users (no password)
    if (!user.password) {
      return res.status(400).json({
        msg: "Please login with Google",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        msg: "Incorrect password",
      });
    }

    // ✅ check JWT_SECRET
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET missing");
    }

    const token = await genToken(user._id);

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json(user);

  } catch (error) {
    console.error("🔥 LOGIN ERROR:", error);

    return res.status(500).json({
      msg: error.message,
    });
  }
};

export const sendOTP = async(req,res) =>{
    try {
        // otp generate
        const {email} = req.body;
        let user = await User.findOne({email});
        if(!user){
            return res.status(404).json({
                msg: "User not found"
            })
        }
        const otp = Math.floor(1000 + Math.random()*9000).toString();
        user.resetOtp = otp,
        user.otpExpires = Date.now() + 5*60*1000,
        user.isOtpVerified = false;

        await user.save();

        // sendMail
        await sendMail(email,otp);
        return res.status(200).json({
            msg: "otp send successfully"
        })
    } catch (error) {
        return res.status(500).json({
            msg: `send Otp error ${error}`
        })    
    }
}


export const verifyOTP = async(req,res) =>{
    try {
    const {email,otp} = req.body;
    const user = await User.findOne({email});
    if(!user || user.resetOtp != otp || user.otpExpires < Date.now()){
        return res.status(404).json({msg: "Invalid OTP"})
    }
    user.isOtpVerified = true,
    user.resetOtp = undefined,
    user.otpExpires = undefined

    await user.save();
    return res.status(200).json({
        msg: "Otp Verified Successfully"
    })
    } catch (error) {
        return res.status(500).json({
            msg: `Verified Otp error ${error}`
        })
    }  
}


export const resetPassword = async (req,res) =>{
    try {
        const {email,password} = req.body;
        const user = await User.findOne({email});
        if(!user || !user.isOtpVerified){
            return res.status(404).json({
                msg: "OTP verification is required"
            })
        }
        const hashPassword = await bcrypt.hash(password,10);
        user.password = hashPassword,
        user.isOtpVerified = false

        await user.save();
        return res.status(200).json({
            msg:"Reset Password Successfully"
        })
    } catch (error) {
        return res.status(500).json({
            msg: `reset password error ${error}`});
    }
}


export const googleAuth = async (req, res) => {
  try {
    const { name, email, role } = req.body;

    if (!email) {
      return res.status(400).json({ msg: "Email is required" });
    }

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        name,
        email,
        role: role || "student",
      });
    }

    let token = await genToken(user._id);

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json(user);

  } catch (error) {
    console.error("🔥 GOOGLE AUTH ERROR:", error);
    return res.status(500).json({
      msg: error.message,
    });
  }
};