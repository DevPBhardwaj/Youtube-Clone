import mongoose ,{Schema} from "mongoose";
//Aggreagation Pipeline
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
//this is used for writing aggregate queries in mongodb 

const videoSchema = new Schema(
    {
        videoFile :{ //we are using cloudinary 
            type : String ,
            required:true
        }
    },
    {
        thumbnail :{
            type : String ,
            required:true
        }
    },
    {
        title :{
            type : String ,
            required:true,
        }
    },
    {
        description :{
            type : String ,
            required:true
        }
    },
    {
        duration :{
            type : Number ,
            required:true
        }
    },
    {
        views :{
            type : Number,
            default : 0
        }
    },
    {
        isPublish :{
            type : Boolean,
            default :true
        },
        owner:{
            type:Schema.Types.ObjectId,
            ref:"User"
        }
    },
    {
        timestamps: true
    },
    
)


videoSchema.plugin(mongooseAggregatePaginate); //here we can add our own plugin
export const Video = mongoose.model("Video",videoSchema)