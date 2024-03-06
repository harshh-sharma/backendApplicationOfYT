import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "username is required"],
      maxLength: [30, "username not contain more then 30 character"],
      minLength: [5, "username must be conatin atleast 5 character"],
      unique: [true, "email must be unique"],
      index: true,
    },
    email: {
      type: String,
      required: [true, "email is required"],
      unique: [true, "email is unique"],
      lowercase: true,
      trim: true,
    },
    fullname: {
      type: String,
      maxLength: [30, "username not contain more then 30 character"],
      minLength: [5, "username must be conatin atleast 5 character"],
      required: [true, "fullname is required"],
      trim: true,
    },
    password: {
      type: String,
      maxLength: [16, "password not contain more then 30 character"],
      minLength: [8, "password must be conatin atleast 5 character"],
      required: [true, "password is required"],
    },
    avatar: {
      type: String,
      required: [true, "avatar is required"],
    },
    coverimage: {
      type: String,
    },
    refreshtoken:{
        type:String
    },
    watchhistory: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Vedio",
      },
    ],
  },
  { timestamps: true },
);

userSchema.plugin("save",async function(next){
    if(!this.isModified("password")) return next();

    this.password = bcrypt.hash(this.password,10);
    next();
})

userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password,this.password);
}

userSchema.methods.generateAccessToken = function (){
    return jwt.sign({
        _id:this._id,
        username:this.username,
        fullname:this.fullname,
        email:this.email
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
        expiresIn:process.env.ACCESS_TOKEN_EXPIRY
    }
)};

userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id:this._id
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn:process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const User = mongoose.model("User", userSchema);
