import mongoose ,{Schema} from "mongoose"; //destructuring Schema from moongose
//or
// const Schema = mongoose.Schema; 
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
 

const userSchema = new Schema(
    {
        username : {
            type:String,
            required:true,
            unique:true,
            trim:true,
            lowercase:true,
            minlength:3,
            index:true
        }
    },
    {
        email : {
            type:String,
            required:true,
            unique:true,
            trim:true,
            minlength:3
        }
    },
    {
        fullName: {
            type:String,
            required:true,
            trim:true,
            minlength:3,
            index:true
        }
    },
    {
        avatar : {
            type:String, //cloudinary url
            required:true
        }
    },
    {
        coverImage : {
            type:String, //cloudinary url
            required:true
        }
    },
    {
        watchHistory : {
            type:Schema.Types.ObjectId,
            ref:"Video"
        }
    },
    {
        password:{
            type:String,
            required:[true,"Password is Required"]
        }
    },
    {
        refreshToken : {
            type: String,
        }
    },
    {
        timestamps:true
    }
)

// This is a middleware type which means do somthing before(pre) saving(save) a file
// Keyword async is used as passoword hasing bcz it takes time in encrpt and decrypt.
//Here the (next) is used to tell the program to move to next middleware

userSchema.pre("save" , async function (next) {
    if(!this.isModified("password")) return next(); // if password is not modified then return next
    this.password = bcrypt.hash(this.password,10)//it can be 8,9,10,12 upto 100 etc
}) 
 // dont use fat arrow function here as we cant use this keyword in this so how can we take reference form our schema without using this keyword


//we have created a custom method that compares user() pssword and the encrypted pass
userSchema.methods.isPasswordCorrect = async function (password){
    return await bcrypt.compare(password,this.password);
}

//Generate Access token method
userSchema.methods.generateAccessToken = function(){
  return jwt.sign(// this sign method is used to generate token
  //hover on .sign() method to know more
        {
            _id:this._id,
            // _id is the id of the user
            email:this.email,
            username:this.username,
            fullName : this.fullName
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    ) 
}

//Generate Refresh token method
userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(// this sign method is used to generate token
          {
              _id:this._id,
          },
          process.env.REFRESH_TOKEN_SECRET,
          {
              expiresIn: process.env.REFRESH_TOKEN_EXPIRY
          }
      ) 
  }



export const User = mongoose.model("User",userSchema);