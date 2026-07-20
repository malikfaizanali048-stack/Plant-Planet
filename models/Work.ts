import { Schema, models, model } from "mongoose";

export interface IWork {
  _id?: string;
  title: string;
  description?: string;
  mediaType: "image" | "video";
  mediaUrl: string;
  createdAt?: Date;
}

const WorkSchema = new Schema<IWork>(
  {
    title: { type: String, required: true },
    description: { type: String, default: "" },
    mediaType: { type: String, enum: ["image", "video"], required: true },
    mediaUrl: { type: String, required: true },
  },
  { timestamps: true }
);

export default models.Work || model<IWork>("Work", WorkSchema);