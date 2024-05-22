import { Router} from "express";
import { loginUser, logoutUser, registerUser,refreshAccessToken } from "../controllers/user.controller.js"; //always try to add .js in end
import {upload} from "../middlewares/multer.middleware.js"  // we are using it for file handling if user send files like avatar , img etc
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(
    // form this we can send images
    upload.fields([ // this is a middleware and upload.field is a method of multer to get more than one file  || it should be used before method like (registerUser)
        {
            name:"avatar",
            maxCount:1
        },         //for avatar
        {
            name:"coverImage",
            maxCount:1
        }         //for cover image
    ]),

    registerUser  //this is the method we created in controllers -> userController

) 
//ex -> http://localhost:8000/api/v1/users/register 
//ex2 -> http://localhost:8000/api/v1/users/login etc we dont have to change it again and again now

router.route("/login").post(loginUser)
//secured routes
router.route("/logout").post(verifyJWT, logoutUser)  //here the middleware is run first then the logoutUser will be run and check the middleware verifyJWT it contains next() in the end this is the only reason for that
router.route("/refresh-token").post(refreshAccessToken)

export default router;