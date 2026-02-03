import mongoose from "mongoose";
//import dotenv from "dotenv";

//dotenv.config({path:"../.env"});
const connectDB=async()=>{
    try{
const connection=await mongoose.connect(process.env.MONGODB_URI);
console.log(`MongoDB connected sucesfully:${connection.connection.host}`);
    }
    catch(error)
    {
        console.error("MongoDB connection error",error.message);
    }
}
export default connectDB;