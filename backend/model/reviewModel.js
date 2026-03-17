import mongoose from 'mongoose'

const reviewSchema = new mongoose.Schema({
    course:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Course'
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    rating:{
        type: Number,
        required:true,
        min:1,
        max:5
    },
    comment:{
        type:String,
        trim:true
    },
    reviewAt:{
        type:Date,
        default:Date.now
    }
},{timeStamps:true})

const Review = mongoose.model("Review", reviewSchema);
export default Review;