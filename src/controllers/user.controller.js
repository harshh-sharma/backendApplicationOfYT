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
  console.log(req.body);
  if (!username || !fullname || !email || !password) {
    return res.status(400).json({
      success:false,
      message:"All fields are required"
    })
  }

  const alreadyExistingUser = await User.findOne({
    $or: [{email},{username}],
  });

  if(alreadyExistingUser){
    return res.status(400).json({
      success:false,
      message:"user already registered"
    })
  }
  
  const avatarLocalFilePath = req.files?.avatar[0]?.path;
  const coverImageLocalFilePath = req.files?.coverImage?.path;
 

  if(!avatarLocalFilePath){
    return res.status(200).json({
      success:false,
      message:"Avatar is required"
    })
  }

  const avatar = await uploadFileOnCloudinary(avatarLocalFilePath);
  const coverimage = await uploadFileOnCloudinary(coverImageLocalFilePath);

  console.log("avatar",avatar);
  console.log("cover",coverimage);

  if(!avatar){
    return res.status(501).json({
      success:false,
      message:"Internal server error"
    })
  }

  const user = await User.create({
    fullname,
    email,
    password,
    username,
    avatar:avatar.url,
    coverimage:coverimage?.url || ""
  });

  const userCreated = await User.findById(user?._id).select("-password -refreshtoken");
  if(!userCreated){
   return res.status(500).json({
      success:false,
      message:"Internal server error,Please try again"
    })
  }

  res.status(201).json({
    success:true,
    data:userCreated,
  })



  } catch (error) {
   console.log(error);
  }
};

export { registerUser };
