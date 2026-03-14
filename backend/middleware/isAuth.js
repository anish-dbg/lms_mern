// verify your token and put your verify token in req.userId mai
import jwt from "jsonwebtoken";

const isAuth = async(req,res,next) =>{
    try{
        const token = req.cookies.token;
        if(!token){
            return res.status(400).json({msg: "User does't have token"})
        }
        const verifyToken = await jwt.verify(token, process.env.JWT_SECRET);
        if(!verifyToken){
            return res.status(400).json({msg: "User does't have valid token"})
        }
        req.userId = verifyToken.userId;
        next();
    }catch(error){
       return res.status(400).json({msg: `isAuth error ${error}` });
    }
}

export default isAuth;
