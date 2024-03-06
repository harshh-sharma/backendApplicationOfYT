import mongoose from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const vedioSchema = new mongoose.Schema({
        vediofile:{
            type:String,
            required:[true,"vedio file is required"]
        },
        title:{
            type:String,
            required:[true,"title is required"],
            trim:true
        },
        description:{
            type:String,
            required:[true,"description is required"],
            lowercase:true
        },
        duration:{
            type:Number,
            required:[true,"duration is required"]
        },
        views:{
            type:Number,
            default:0
        },
        isPublished:{
            type:Boolean,
            default:true
        },
        thumpnail:{
            type:String
        },
        owner:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        }
},{timestamps:true});

vedioSchema.plugin(mongooseAggregatePaginate);

export const Vedio = mongoose.model("Vedio",vedioSchema);