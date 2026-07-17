import { Schema, models, model } from "mongoose";

export interface IServiceRequest {
  _id?: string;
  type: "Residential Landscape" | "Commercial Landscape" | "Indoor Plant-Scaping";
  requestKind: "Quote" | "Consultant Booking";
  name: string;
  email: string;
  phone: string;
  address: string;
  message?: string;
  gardenImage?: string;
  yearlyPlan: boolean;
  status: "New" | "Contacted" | "Scheduled" | "Completed";
  createdAt?: Date;
}

const ServiceRequestSchema = new Schema<IServiceRequest>(
  {
    type: {
      type: String,
      enum: ["Residential Landscape", "Commercial Landscape", "Indoor Plant-Scaping"],
      required: true,
    },
    requestKind: { type: String, enum: ["Quote", "Consultant Booking"], required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    message: { type: String },
    gardenImage: { type: String },
    yearlyPlan: { type: Boolean, default: false },
    status: { type: String, enum: ["New", "Contacted", "Scheduled", "Completed"], default: "New" },
  },
  { timestamps: true }
);

export default models.ServiceRequest || model<IServiceRequest>("ServiceRequest", ServiceRequestSchema);
