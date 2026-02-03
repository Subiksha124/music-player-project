import Imagekit from "../config/imagekit.js";
import {User} from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"
import dotenv from "dotenv"

dotenv.config();

const createToken=(userId)=>{
    return jwt.sign({id:userId},process.env.JWT_SECRET,{expiresIn:process.env.JWT_EXPIRES_IN})
}
const signup=async (req,res)=>{
    const{name,age,password,email}=req.body;
    try{
        if(!name||!email||!password)
        {
            return res.status(400).json({message:"all fields are required"});
        }
        const existingUser=await User.findOne({email:email});
        if(existingUser)
        {
           return res.status(400).json({message:"user already exists"});
        }
        /*let avatarUrl="";
        if(avatar)
        {
            const uploadResponse=await Imagekit.upload({
                file:avatar,
                fileName:`avatar_${Date.now()}.jpg`,
                folder:"/mern-music-player",
            });
            avatarUrl=uploadResponse.url;
        }*/
       
        const user=await User.create({
            name, email, password,age
        });
        const token=createToken(user.id);
        res.status(201).json({message:"user created sucessfully",
            user:{
                id:user.id,
                name:user.name,
                email:user.email,
                age:user.age
            },
            token,
        })

    }
    catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({
        message: "Signup error",
        error: error.message
    });
}

} 
const login=async(req,res)=>
    {
    try{
        const{name,email,password}=req.body;
    const user=await User.findOne({email:email});
    if(!user)
    {
        return res.status(400).json({message:"Email id doesn't exists"});
    }
    const isMatch=await user.comparePassword(password);
    if(!isMatch)
    {
        return res.status(400).json({message:"Invalid credentials"});
    }
    const token=createToken(user.id);
    res.status(200).json({
        message:"User logged in sucessfully",
        user:{
            name:user.name,
            id:user.id,
            email:user.email
        },
        token,
    })
}
    catch(error)
    {
        console.error("login not successful",error.message);
        res.status(500).json({message:"Login error"});
    }
}  
const getMe=async(req,res)=>{

    if(!req.user)
    {
        return res.status(401).json({message:"Not authenticated"});
    }
   res.status(200).json(req.user);
}
const forgotPassword=async(req,res)=>{
    try{
        const{email}=req.body;
        if(!email)
        {
            return res.status(400).json({message:"Email is required"});
        }
        const user=await User.findOne({email});
        if(!user)
        {
            return res.status(404).json({message:"User not found"});
        }
        const resetToken=crypto.randomBytes(32).toString("hex");
        const hashedToken=crypto.createHash("sha256").update(resetToken).digest("hex");

        user.resetPasswordToken=hashedToken,
        user.resetPasswordTokenExpiresIn=Date.now()+10*60*1000;

        await user.save();

        const resetUrl=`${process.env.FRONTEND_URL}\reset-password\${resetToken}`;
        await sendMail({
            to:user.email,
            subject:"Teset your password",
            _html: 
            `<h3>Password Reset</h3>
            <p>Click on the link to reset</p>
            <a href="${resetUrl}">${resetUrl}</a>
            <p>thid link expires in 10 mins</p>
            `,
        })
        res.status(200).json({message:"Password reset email "});
    }
    catch(error)
    {
      console.error("Forgot Password error:",error.message);
      res.status(500).json({message:"Something went wrong"});
    }
}
const resetPassword=async(req,res)=>{
    try{
    const{token}=req.params;
    const{password}=req.body;
    if(!password||password.length<6)
    {
        return res.status(400).json({message:"Password must be atleast 6 charectors"});
    }
    const hashedToken=crypto.createHash("sha256").update(token).digest("hex");
    const user=User.findOne({
        resetPassword:hashedToken,
        resetPasswordTokenExpires:{$gt:Date.now()},
    });
    if(!user)
    {
        return res.status(400).json({message:"Token is invalid or expired"});
    }
    user.password=password;
    user.resetPasswordToken=undefined;
    user.resetPasswordTokenExpires=undefined;

    await user.save();
    res.status(200).json({message:"Tpassword reset sucessfully"});}
    catch(error)
    {
        console.error("reset Password error:",error.message);
      res.status(500).json({message:"Something went wrong"});
    }
}
const editProfile=async(req,res)=>{
    try{
        const userId=req.user?.id;
        if(!userId){
            return res.status(401).json({message:"not authenticated"});
        }
        const{name,email,currentPassword,newPassword}=req.body;
        const user=await User.findById(userId);
        if(name)
        {
            user.name=name;
        }
        if(email)
        {
            user.email=email;
        }
        if(currentPassword||newPassword)
        {
            if(!currentPassword||!newPassword)
            {
                return res.status(400).json({message:"Both current and new password are required",});
            }
           const isMatch=await user.comparePassword(currentPassword);
           if(!isMatch)
           {
            return res.status(400).json({message:"current password is incorrect"});
           }
           if(newPassword.length<6)
           {
            return res.status(400).json({message:"Password must be atleast 6 charecters"});
           }
           user.password=newPassword;
        }
        return res.status(200).json({message:"Profile updated sucessfully",
            user:{
                id:user.id,
                name:user.name,
                email:user.email,
            },
        });
    }
    catch(error)
    {
        console.error(error);
        return res.status(500).json({ message: "Server error" });
    }
};
export {signup,login,getMe,forgotPassword,resetPassword,editProfile};
