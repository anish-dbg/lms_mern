import Razorpay from "razorpay";
import Course from "../model/courseModel.js";
import User from "../model/userModel.js";
import dotenv from "dotenv";

dotenv.config();

// Razorpay Instance
export const RazorPayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});


// ================= CREATE ORDER =================
export const RazorpayOrder = async (req, res) => {
  try {

    const { courseId } = req.body;

    if (!courseId) {
      return res.status(400).json({
        msg: "CourseId is required",
      });
    }

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
        msg: "Course is not found",
      });
    }

    const options = {
      amount: Number(course.price) * 100, // Razorpay uses paisa
      currency: "INR",
      receipt: `receipt_${courseId}`,
    };

    const order = await RazorPayInstance.orders.create(options);

    return res.status(200).json(order);

  } catch (error) {

    console.log("RAZORPAY ORDER ERROR:", error);

    return res.status(500).json({
      msg: "Failed to create Razorpay Order",
      error: error.message,
    });
  }
};



// ================= VERIFY PAYMENT =================
export const verifyPayment = async (req, res) => {
  try {

    const { courseId, userId, razorpay_order_id } = req.body;

    if (!courseId || !userId || !razorpay_order_id) {
      return res.status(400).json({
        msg: "Missing required fields",
      });
    }

    const orderInfo = await RazorPayInstance.orders.fetch(razorpay_order_id);

    if (orderInfo.status === "paid") {

      const user = await User.findById(userId);

      if (!user.enrolledCourses.includes(courseId)) {
        user.enrolledCourses.push(courseId);
        await user.save();
      }

      const course = await Course.findById(courseId).populate("lectures");

      if (!course.enrolledStudents.includes(userId)) {
        course.enrolledStudents.push(userId);
        await course.save();
      }

      return res.status(200).json({
        msg: "Payment verified and enrollment successful",
      });

    } else {

      return res.status(200).json({
        msg: "Payment Failed",
      });

    }

  } catch (error) {

    console.log("VERIFY PAYMENT ERROR:", error);

    return res.status(500).json({
      msg: "Internal server error during payment verification",
      error: error.message,
    });
  }
};