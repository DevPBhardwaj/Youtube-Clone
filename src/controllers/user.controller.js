import {asyncHandler} from "../utils/asyncRequestHandler.js";

//This is a higher order function 
//this asyncHandler is coming from utils folder .
//we are using this so that we dont have to write the try catch block in every route
//or promises in every route it will automatically pass the route through the asyncHandler

const registerUser = asyncHandler ( async (req,res)=>{
    res.status(200).json({
        message:"Ok"
    })
})


export {registerUser};