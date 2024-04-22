import dotenv from 'dotenv';
import connectDB from "../db/index.js";
import app from './app.js';

dotenv.config({ path: './env' });

connectDB()
//here after the completion of async method which we have used in the db>index.js file, it will return a promise to us like below
.then(()=>{
    app.listen(process.env.PORT||8000,()=>{
       console.log(`Server is running at Port : ${process.env.PORT}`);
    })
})

.catch(err=>{
    console.log("MongoDB connection failed !!!",err);
})