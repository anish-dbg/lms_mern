import Course from "../model/courseModel.js";
import Review from "../model/reviewModel.js";


export const createReview = async(req,res) =>{
    try {
        const {rating, comment, courseId} = req.body;
        const userId = req.userId;

        const course = await Course.findById(courseId);
        if(!course){
            return res.status(400).json({
                msg: "Course is not found"
            })
        }
        const alreadyReviewed = await Review.findOne({course:courseId, user:userId});
        if(alreadyReviewed){
            return res.status(400).json({
                msg: "You have already reviewed this course"
            })
        }
        const review = new Review({
            course:courseId,
            user:userId,
            rating,
            comment
        })
        await review.save();
        await course.reviews.push(review._id);
        await course.save();
        return res.status(200).json(review)
    } catch (error) {
        return res.status(500).json({
            msg: `Failed to create review ${error}`
        })
    }
}


export const getReview = async (req, res) => {
    try {
        const review = await Review.find({})
            .populate('user', 'name photoUrl description')
            .populate('course', 'title')
            .sort({ reviewedAt: -1 });

        return res.status(200).json(review);
    } catch (error) {
        console.error("GET REVIEW ERROR:", error);
        return res.status(500).json({
            msg: `Failed to get review ${error}`
        });
    }
}