import {asyncHandler} from "../utils/asyncRequestHandler.js";
import {ApiError} from "../utils/apiErrorHandler.js" //for validation of errors 
import {User} from "../models/user.model.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import {ApiResponse} from "../utils/apiResponseHandler.js"
import jwt from "jsonwebtoken"




const generateAccessAndRefereshTokens = async(userId)=>{ //At this point we already have the user (user details with us) so we can find userId
    try{
         const user = await User.findById(userId) //now we have the user document now we will generate the acces token and refresh token
         const accessToken = user.generateAccessToken()  //we build this function in user model
         const refreshToken = user.generateRefreshToken()  //we build this function in user model

         //here we give the accessToken to user but we store the referesh token in the database so that user dont have to login again and again

         user.refreshToken = refreshToken  //here we are sending the value of refreshToken to our user object refreshToken in models
         await user.save({validateBeforeSave:false})  //now we save the user document with the refreshToken but ignoring the password in model
         
         return {accessToken,refreshToken} 

    } catch (error){
        throw new ApiError(500," Something went wrong while generating access and referesh tokens")
    }
}





//This is a higher order function 
//this asyncHandler is coming from utils folder .
//we are using this so that we dont have to write the try catch block in every route
//or promises in every route it will automatically pass the route through the asyncHandler

const registerUser = asyncHandler ( async (req,res)=>{  // we gave this async here to make wait for the files to upload on cloudinary 
    // res.status(200).json({
    //     message:"Ok"         before writing the below code we can check this left code on postman whether its working or not *take care of spaces while writing url in Postman
    // })

    
    // logic building for user registration / algorithms

    // 1-> get user details from frontend
    // 2-> validation - for ex - not empty fields
    // 3-> check if user already exists: username , email etc
    // 4-> check the images, check for avatar
    // 5-> upload them to cloudinary , avatar
    // 6-> create user object - create entry in db
    // 7-> remove password and refresh token field form the response
    // 8-> check for user creation 
    // 9-> return res otherwise return error 



    // 1 step
    //here everthing is mostly present in req.body(from form,json) except data from url (will see later how to get that as well)

    const {fullName , email , username, password} = req.body  //check what we need in here from models->user.models.js
    console.log("email",email); //testing purpose -> postman -> http://localhost:8000/api/v1/users/register (send raw data and check here in console it will reflect)

    // 2 step

    //  Option 1 simple one using if else 
    /* 
    if(fullName === ""){
        throw new ApiError (400,"fullName is required")
    }
    */

    // Option 2 using arrays with .some method 
    // .some method will return true if any of the element in the array satisfies the condition

    if([fullName,email,password,username].some((field)=>field?.trim()==="")){ //here we are checking if there is any field first trim it and then check whether it is empty or not .
        // and if its empty then do the below part
        throw new ApiError (400,"All fields are required") // for more info about ApiError go to  utils->apiErrorHandler.js
    } // write more validations here 


    // 3 step 
    // check if user already exists

    const existedUser = await User.findOne({  //User is directly connected with mongodb (models -> user.models.js ) so it can directly access user details he input
        $or:[ { email }, { username }]
    })

    if(existedUser){
        throw new ApiError (409,"User with email or username exists already!")   // throwing error with the help of our util -> apiErrorHandler.js
    }

    //console.log(req.files);

    // 4 step 
    // here we check the images and avatar using multer middelware as it gives some more access similar to req.body it gives req.files
    const avatarLocalPath = req.files?.avatar[0]?.path; // we are checking if we have the files then find the path of the first property avatar(this is our given name in the user.routes.js file ) and
    // in our multer we have given the destination where the file is going to be saved we will just going to get the path of the file here .


    // same for coverImage
    // const coverImageLocalPath = req.files?.coverImage[0]?.path;
    // OR
    let coverImageLocalPath;
    if(req.files && Array.isArray(req.files.coverImage)&& req.files.coverImage.length>0){ //this isArray() tells we got the array or not ?
        coverImageLocalPath = req.files.coverImage[0].path
    }

    // 2 part of 4 part check for avatar image 

    if(!avatarLocalPath){
        throw new ApiError (400,"Avatar is required")
    }


    //step 5 upload to cloudinary 
    const avatar = await uploadOnCloudinary(avatarLocalPath)        //this method is already prepared in our utils -> cloudinary.js we just have to pass the path of the image we evaluated above
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if(!avatar){
        throw new ApiError (400,"Avatar file is required to upload!")
    }
    // step 6 
//create user object - create entry in db

    const user = await User.create({
        fullName,
        avatar:avatar.url, // we just need this information from cloudinary but he is sending us full response so we are just going to get the url from it . check more at utils -> cloudinary.js
        coverImage:coverImage?.url || "", //we have no validation so if we dont have any image then add the or part as null as its not mendatory
        email,
        username: username.toLowerCase(),
    })

    // step 7 
    // remove password and token from the response
    // we are going to use the select method to remove the password and refreshToken from the response 


      const createdUser = await User.findById(user._id).select( // here we are selecting the user and not the password and refreshToken
        "-password -refreshToken" // always give space in between those two fields. you dont need like here pass and token
      )

      if(!createdUser){
        throw new ApiError (500,"Something went wrong while registering an user")

      }

     // step 8 
     // send the response 
     return res.status(201).json(
        new ApiResponse(200,createdUser,"User is registered successfully") // we are sending the user object as response check more in utils -> apiResponseHandler.js
     )
})



const loginUser = asyncHandler(async (req,res)=>{
    
    //steps
    // 1 get the data from the req body
    // 2 check username or email one from both but we make a code which can work for both
    // 3 find the user
    // 4 if we find the user check password
    // 5 access and refresh token (already generated in user.model.js)
    // 6 send the tokens in secure cookies
    // 7 send the response login successfully

     // step 1
    const {email,username,password} = req.body                      //debugging console.log(email,username,password);     
    //fetching data from body

                    // login from email

    // if(!email){
    //     throw new ApiError(400,"Please provide email");
    // }

                        //OR login from username

    // if( !username){
    //     throw new ApiError(400,"Please provide username or email");
    // }

                        //OR login from both 
    //step 2

    if( ! (username || email)){                                      //debugging console.log(email,username);     
        throw new ApiError(400,"Please provide username or email");
    }
        

    //step 3
    //check if we already have the username and email in our database using again the same findOne operators of mongodb

    const user =await User.findOne({          // here the User come from model(user model) and the user is the instance of the User model
        $or:[{username},{email}]
    })
     console.log(user);     

    if(!user){
        throw new ApiError(400,"user doesnt exist"); // if we find no any same as input username or email in the database 
    }


    //Step 4 if we find the user check password
    const isPasswordValid = await user.isPasswordCorrect(password) //make sure this user is that one which we have created(Instance of User model) 
    //Here we are calling the function isPasswordCorrect which is in user.model.js. It is comparing the password we fetched from req.body with the password which is encrypted using bcrypt

    if(!isPasswordValid){
        throw new ApiError(401,"Invalid User Credentials"); // if we find no any same as input username or email in the database 
    }


        // 5 access and refresh token (already generated in user.model.js)
        // This work is done several time during the project so we are creating the function at the top for this 
        const {accessToken,refreshToken} = await generateAccessAndRefereshTokens(user._id); //here the argument of the function needs the id of the user and we are fetching it and sending it to the top function
        // above we are getting the return fromt the function and we destructure it  -> const {accessToken,refreshToken}

        
        //Step 6 send the tokens in secure cookies
        const loggedInUser = await User.findById(user._id).select("-password -refreshToken") //we dont want to send the password and refresh token to user
        
        // now we will send the cookie and for that we have to add some options here 
        const options ={
            httpOnly:true,
            secure:true,
        }

        return res
        .status(200)
        .cookie("accessToken",accessToken,options)
        .cookie("refreshToken",refreshToken,options)
        .json(
            new ApiResponse(200,{user:loggedInUser,accessToken,refreshToken},"User logged In successfully") //this we are saving again maybe the user wants to save it
            //now go back to utils and check the ApiResponse here we are sending the data and the status code to that util
        )
})

const logoutUser = asyncHandler(async(req,res)=>{

    await User.findByIdAndUpdate(
        req.user.id, //first argument ->how will you find user
        {
           $set:{
            refreshToken: undefined
           } //what to update now , so now we will write  the $set operator of mongodb
        },
        {
            new:true
        }

    )

    const options ={
        httpOnly:true,
        secure: true
    }

    return res
    .status(200)
    .clearCookie("accessToken",options)
    .clearCookie("refreshToken",options)
    .json(new ApiResponse (200,{},"User Logged Out"))

})

//here we are going to make a endpoint for the refresh token - > An access token is a short-lived token that allows a user to access certain resources or perform specific actions on a server and depends on the company needs for how long they want the token to accessible mostly (15-20 mins).
// A refresh token is a long-lived token used to obtain a new access token when the old one expires, without requiring the user to log in again. This mechanism helps maintain user sessions securely.
const refreshAccessToken = asyncHandler(async(req,res)=>{
    //now how will you make the user login again obviously by fetching the refresh token and it will come from the cookies which we sent in the loginUser line no 228
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken //(the body part is for those who is using the phone) //and the name is incomingRefreshToken as we already have one refresh token save in the backend
    
    if(incomingRefreshToken){
        throw new ApiError(401,"unauthorized request")
    }

   try {
     //now we will verify if the refresh token is valid or not
     const decodedToken = jwt.verify(incomingRefreshToken,process.env.process.env.REFRESH_TOKEN_SECRET) //to verify one we have to send the token and one secret information in our .env file
     const user = await User.findById(decodedToken?._id)
 
     if(!user){
         throw new ApiError(401,"Invalid refresh Token")
     }
 
     //now we will match both the tokens
     if(user.incomingRefreshToken!== user?.refreshToken ){  //check it in model is it the same name of refreshToken or not 
         throw new ApiError(401,"Refresh Token is expired or use")
     }
 
     //its upto us now we want to generate new tokens or not here we are generating
 
     const options ={
         httpOnly:true,
         secure: true
     }
 
     const {accessToken,newRefreshToken} = await generateAccessAndRefereshTokens(user._id)
     
     return res
     .status(200)
     .cookie("accessToken",accessToken,options)
     .cookie("refreshToken",newRefreshToken,options)
     .json(
         new ApiResponse(
             200,
             {
                 accessToken,refreshToken:newRefreshToken
             },
             "Access token refreshed"
 
         )
     )
   } catch (error) {
    throw new ApiError(401,error?.message || "Invalid refresh token") //if the token is invalid then it will show the error message
   }

})
export {registerUser,loginUser,logoutUser,refreshAccessToken};