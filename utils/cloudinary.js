import { v2 } from "cloudinary";
import exp from "constants";
import fs from "fs";
          
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY , 
  api_secret:process.env.CLOUDINARY_API_SECRET 
});

const uploadFileOnCloudinary = async(localfilePath) => {
    try {
        if(!localfilePath) return null;
        const response = await v2.uploader.upload(localfilePath,{
            resource_type:"auto"
        })
    
        //file as been uploaded successfully
        console.log(`file successfully upload on cloudinary ${response.url}`);
        return response;
    } catch (error) {
        fs.unlinkSync(localfilePath);
    }
}

export default uploadFileOnCloudinary;
