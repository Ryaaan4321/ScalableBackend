import { Schema, model } from "mongoose";

const importLogSchema = new Schema({
    url: String,
    totalFetched: Number,
    newJobs: Number,
    updatedJobs: Number,
    failedJobs: Number,
    failures: Array,
    timestamp: Date,
})
export default model('ImportLogSchema',importLogSchema);