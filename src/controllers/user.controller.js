import APIError from "../../utils/api.error.js";
import { User } from "../models/user.model.js";
import uploadFileOnCloudinary from "../../utils/cloudinary.js";

const registerUser = async(req, res) => {
  // take the user body
  // validating the data
  // check the user alredy exist or not
  // then create a user in db
  // return response
  try {
    
  const { username, fullname, email, password } = req.body;
  if (!username || !fullname || !email || !password) {
    throw new APIError("All fields are required", 400);
  }

  const alreadyExistingUser = await User.findOne({
    $or: [{email},{username}],
  });

  if(alreadyExistingUser){
    throw new APIError("User already registered",400);
  }
  
  const avatarLocalFilePath = req.files?.avatar[0]?.path;
  const coverImageLocalPath = req.files?.coverImage?.path;

  if(!avatarLocalFilePath){
    throw new APIError("Avatar is required",400);
  }

  const avatar = await uploadFileOnCloudinary(avatarLocalFilePath);
  let coverimage;

  if(coverImageLocalPath){
    coverimage = await uploadFileOnCloudinary(coverImageLocalPath); 
  }

  if(!avatar){
    throw new APIError("Internal server error ,Please try again",501);
  }

  const user = await User.create({
    fullname,
    email,
    password,
    username,
    avatar:avatar.url,
    coverimage:coverimage?.url || ""
  })

  if(user){
    res.status(200).json({
      success:true,
      data:user
    })
  }

  const userCreated = await User.findById(user?._id).select("-password -refreshtoken");
  if(!userCreated){
    throw new APIError("something went wrong while registering the user,Please try again",500);
  }

  res.status(201).json({
    success:true,
    message:"user created successfully",
    data:userCreated,
  })



  } catch (error) {
    console.log(error.message);
  }
};

export { registerUser };
