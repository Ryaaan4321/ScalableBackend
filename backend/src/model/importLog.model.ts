import { Schema, model } from "mongoose";

const importLogSchema = new Schema({
  feedUrl: { type: String, required: true },
  timestamp: { type: Date, required: true },
  totalFetched: { type: Number, default: 0 },
  totalImported: { type: Number, default: 0 },
  newJobs: { type: Number, default: 0 },
  updatedJobs: { type: Number, default: 0 },
  failedJobs: [
    {
      externalId: String,
      reason: String
    }
  ]
});
export default model('ImportLogSchema',importLogSchema);