import jwt from "jsonwebtoken";
import {User} from "../models/userModel.js"
export const protect=async(req,res)=>{

const authHeader=req.headers.authorization;
console.log("HEADERS:", req.headers);
console.log("AUTH HEADER:", req.headers.authorization);

if(!authHeader||!authHeader.startsWith("Bearer"))
{
    return res.status(401).json({message:"Not authorized, missing Token"});
}
const token=authHeader.split(" ")[1];
console.log("Token:",token)
try{
    
    const decoded=jwt.verify(token,process.env.JWT_SECRET);
    console.log("decoded id:",decoded.id);
    console.log(decoded);
    const user=await User.findById(decoded.id).select("-password");
    if(!user)
    {
        return res.status(401).json({message:"Not authorized"});
    }
    req.user=user;
    next();
}
catch(error)
{
    console.error("Token verification failed",error.message);
    return res.status(401).json({message:"Invalid or expired token"});
}
}