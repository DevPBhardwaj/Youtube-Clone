import mongoose from "mongoose";
import { DB_NAME } from "../Constants.js";


const connectDB = async () =>{
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log(`\n MongoDB Connected Successfully ! DB HOST : ${connectionInstance.connection.host}`);
    }
    catch(error){
        console.log("MongoDB Connection Error:",error);
        process.exit(1)    //this is the node method you can check more in node documentations about the exits number like 1,0 etc
    }
}


export default connectDB;