
import express from "express"
import dotenv from "dotenv"
import connectDB from "./config/connectDB.js";
import cookieParser from "cookie-parser";
import authRouter from "./route/authRoute.js";
import cors from "cors";
import userRouter from "./route/userRoute.js";
import courseRouter from "./route/courseRoute.js";
import paymentRouter from "./route/paymentRoute.js";
import reviewRouter from "./route/reviewRoute.js";


dotenv.config();
const port = process.env.PORT;
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: "https://lms-mern-1-q4w7.onrender.com",
    credentials: true
}))

app.use("/api/auth",authRouter);
app.use("/api/user",userRouter);
app.use("/api/course",courseRouter);
app.use("/api/order",paymentRouter);
app.use('/api/review',reviewRouter )

app.get("/",(req,res) =>{
    res.send("Hello From server");
})
const startServer = async () => {
  try {
    await connectDB();   // ✅ FIRST connect DB
    console.log("✅ DB Connected");

    app.listen(port, () => {
      console.log("🚀 Server started");
    });

  } catch (error) {
    console.log("❌ DB connection failed:", error);
  }
};

startServer();