import APIError from "../../utils/api.error.js";
import { User } from "../models/user.model.js";
import uploadFileOnCloudinary from "../../utils/cloudinary.js";

const generateAccessAndRefreshToken = async(userId) => {
  const user = await User.findById(userId);
  const accessToken = await user.generateAccessToken();
  const refreshToken = await user.generateRefreshToken();

  user.refreshtoken = refreshToken;
  await user.save({validateBeforeSave:false});

  return {
    refreshToken,
    accessToken
  }
}

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

const loginUser = async (req,res) => {
  // first all we extract the details from req.body
  // then we validate the details and if details are empty then we thrown an error
  // then we search a user based on details,if user find then we generated access token and put to cookie
  // return response of 200
  try {
    const {email,username,password} = req.body;
    if(!email || !username){
      return res.status(400).json({
        success:false,
        message:"email and username is required"
      });
    }
    const user = await User.find({
      $or:[{email},{username}]
    });

    if(!user){
     return res.status(401).json({
        success:false,
        message:"user are not registered"
      })
    }

    if(!password){
      return res.status(401).json({
        success:false,
        message:"Password is required"
      })
    }

    const isValidPassword = await user.isPasswordCorrect(password);
    if(!isValidPassword){
      res.status(401).json({
        success:false,
        message:"user credentials are invalid"
      })
    }

    const {refreshToken,accessToken} = await generateAccessAndRefreshToken(user._id);

    const loggedInUser = await User.findById(user._id).select(
      "-password -username"
    );
    
    const cookieOption = {
      httpOnly:true,
      secure:true
    }

    return res.status(200)
                        .cookie("accessToken",accessToken,cookieOption)
                        .cookie("refreshToken",refreshToken,cookieOption)
                        .json({
                          success:false,
                          message:"user loggedIn successfully",
                          data:user,accessToken,refreshToken
                        })

    } catch (error) {
    res.status(400).json({
      success:false,
      message:error.message
    })
  }
}

export { registerUser };
