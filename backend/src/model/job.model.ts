import { Schema, model } from "mongoose";

const jobSchema = new Schema(
  {
    externalId: { type: String, required: true, unique: true },
    title: { type: String },
    description: { type: String },
    company: { type: String },
    link: { type: String },
    location: { type: String }, 
    pubDate: { type: Date }
  },
  {
    timestamps: true,
    strict: false 
  }
);

export default model("Job", jobSchema);
