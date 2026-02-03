import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/connectDB.js";
import router from "./routes/authRoutes.js";
import songRouter from "./routes/songRoutes.js";
dotenv.config();
const PORT=process.env.PORT||3500;
const app=express();
app.use(express.json());
connectDB();
app.use(
    cors({
        origin:"http://localhost:3500",
        credentials:true,
    })
)
app.use("/api/auth",router);
app.use("api/song",songRouter)
app.get("/",(req,res)=>{
    res.status(200).json({message:"serverr is working"});
})
app.get("/test", (req, res) => {
  res.status(200).json({message:"Test route works"});
});

app.listen(PORT,()=>console.log(`server is running on port${PORT}`))
