//File Handling


import fs from "fs" ; //this is a node file system we dont have to install it
//check its documentary for more details 

import {v2 as cloudinary} from 'cloudinary';
          
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret:  process.env.CLOUDINARY_API_SECRET
});


//file fetching is a complex and time taking process so we create a method for fetching file and use try catch to handle issues
//we also gonna use async await

const uploadOnCloudinary = async (localFilePath) => {
    try{
        //if no file path is provided return null
        if(!localFilePath) return null;
        //upload the file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath,{
            resource_type: "auto" //learn more on cloudinary documentation
        })

        //If the file has uploaded successfully then return the whole response 
        // or just the response.url we are just returning the whole response here
        // and consoling the response.url

        // console.log("File is uploaded successfully on Cloudinary", response.url)
        //it will be romoved once uploaded synchronusly
        fs.unlinkSync(localFilePath);
        return response;

    } catch(error){
        // here we will remove the locally saved temporary file as the upload
        // operation has failed otherwise it will slow down the process
        fs.unlinkSync(localFilePath);
        console.log("Error while uploading file on cloudinary", error);
        return null;

    }
}


cloudinary.uploader.upload("https://upload.wikimedia.org/wikipedia/commons/a/ae/Olympic_flag.jpg",
  { public_id: "olympic_flag" }, 
  function(error, result) {console.log(result); });

  export {uploadOnCloudinary}