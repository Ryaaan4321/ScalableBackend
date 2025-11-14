import { timeStamp } from "console";
import { Schema, model } from "mongoose";
const jobSchema=new Schema({
    externalId:{type:String,required:true},
    title:{type:String},
    description:{type:String},
    company:{type:String},
    link:{type:String},
    loacaion:{type:String},
    pubDate:{type:Date}
}
,{timestamps:true});
export default model("JobSchema",jobSchema);