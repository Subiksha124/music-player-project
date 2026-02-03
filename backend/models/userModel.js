import mongoose from "mongoose";
import bcrypt from "bcrypt";
const userSchema= new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Name is required"],
    },
    password:{
        type:String,
        required:[true,"Password is required"],
        minLength:8,
    },
    email:{
        type:String,
        required:[true,"emai is required"],
        unique:true,
    },
    age:{
        type:Number,
    },
    resetPasswordToken:{
        type:String,
    },
    resetPasswordTokenExpiresIn:Date,
    favourites:[
        {
            id:{type:String,required:true},
            name:String,
            artist_name:String,
            image:String,
            duration:String,
            audio:String,
        }]
});
userSchema.pre("save",async function(){
    if(!this.isModified("password")) return;
    const salt=await bcrypt.genSalt(10);
    this.password=await bcrypt.hash(this.password,salt);
});
userSchema.methods.comparePassword=function(enteredPassword){
    return bcrypt.compare(enteredPassword,this.password);
}
const User=mongoose.model("user",userSchema);
export {User};