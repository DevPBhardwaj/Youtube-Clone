//It will figure out that so we have the user or not 

import { ApiError } from "../utils/apiErrorHandler.js";
import { asyncHandler } from "../utils/asyncRequestHandler.js";
import jwt from "jsonwebtoken"
import { User } from "../models/user.model.js";

export const verifyJWT = asyncHandler(async(req,res,next)=>{
   try {
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","")   //we are here fetching the value of token here by removing the syntax part        // https://jwt.io/introduction  (Authorization: Bearer <token>)
 if(!token){
     throw new ApiError(401,"Unauthrozed request")
 }
     const decodedToken =  jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
 
     const user = await User.findById(decodedToken?._id).select("-password -refreshToken") //we took here _id becasue while creating we gave this name only in user.model.js
     if(!user){
         throw new ApiError(401,"Invalid Access token")
     }
 
     req.user = user         //here we are adding a new object in req and putting his name as user
     next()
   } catch (error) {
     throw new ApiError(401,error?.message || "Invalid access token")
    
   }
})