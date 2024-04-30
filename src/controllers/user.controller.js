import {asyncHandler} from "../utils/asyncRequestHandler.js";
import {ApiError} from "../utils/apiErrorHandler.js" //for validation of errors 
import {User} from "../models/user.model.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import {ApiResponse} from "../utils/apiResponseHandler.js"

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
    console.log("email",email) //testing purpose -> postman -> http://localhost:8000/api/v1/users/register (send raw data and check here in console it will reflect)

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

    const existedUser = User.findOne({  //User is directly connected with mongodb (models -> user.models.js ) so it can directly access user details he input
        $or:[ { email }, { username }]
    })

    if(existedUser){
        throw new ApiError (409,"User with email or username exists already!")   // throwing error with the help of our util -> apiErrorHandler.js
    }

    // 4 step 
    // here we check the images and avatar using multer middelware as it gives some more access similar to req.body it gives req.files
    const avatarLocalPath = req.files?.avatar[0]?.path; // we are checking if we have the files then find the path of the first property avatar(this is our given name in the user.routes.js file ) and
    // in our multer we have given the destination where the file is going to be saved we will just going to get the path of the file here .


    // same for coverImage
    const coverImageLocalPath = req.files?.coverImage[0]?.path;

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

})


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
        "-password -refreshToken" // always give space in between those two fields you dont need like here pass and token
      )

      if(!createdUser){
        throw new ApiError (500,"Something went wrong while registering an user")

      }

     // step 8 
     // send the response 
     return res.status(201).json(
        new ApiResponse(200,createdUser,"User is registered successfully") // we are sending the user object as response check more in utils -> apiResponseHandler.js
 
     )

export {registerUser};