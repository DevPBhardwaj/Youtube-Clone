import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";   //to access cookies of user and operate CRUD operation on them , 
                                             //server has the right to do so only


const app = express();
//always use these middlewares after creation of the app from express as middlewares can only be used once the app is created
app.use(cors({   //this (.use) is used for middlewares and all configurations
    origin: process.env.CORS_ORIGIN,
    credentials: true,
}));


//now we are preparing to recieve the data from multiple sources or methods like json,forms,url,req.body
//Here we are fetching data from forms
app.use(express.json({limit:"16kb"})) //this is used to parse the data from the body of the request which is in json format,
                                      //set the limit of data upto 16kb only 


//now fetching data from URLS
app.use(express.urlencoded({
    extended:"true",  //to fetch object in object
    limit:"16kb"
}))  //when you search something on chrome it encodes the data and this is used to parse the data from the url
                                // for ex search priyanshu ch it will give you https://priyanshu+Ch or priyanshu%20Ch so to decode that..


//now for storing some static data like pdf , images , favicon or something like that in pulic folder we made
app.use(express.static("public"))

//for cookies 
app.use(cookieParser())



//routes import 
import userRouter from './routes/user.routes.js' //try to add .js in end

//routes declaration
//here we are using middleware as we declared the routes in userRouter
app.use("/api/v1/users", userRouter)  
 //1 argument is users is the prefix for all the routes in userRouter
 //2 argument is which router you want to activate
//how this work is that when we are making a request to /users , it will give control to userRouter then 
// it passes the control to user.routes.js and there we will tell him on which route he has to go on





export default app;