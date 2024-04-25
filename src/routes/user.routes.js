import { Router} from "express";
import { registerUser } from "../controllers/user.controller.js"; //always try to add .js in end

const router = Router();

router.route("/register").post(registerUser) //this is the method we created in controllers > userController
//ex -> http://localhost:8000/api/v1/users/register 
//ex2 -> http://localhost:8000/api/v1/users/login etc we dont have to change it again and again now




export default router;