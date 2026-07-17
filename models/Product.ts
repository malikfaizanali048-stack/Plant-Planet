import mongoose, { Schema, models, model } from "mongoose";

export interface IProduct {
  _id?: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  discountPercent: number;
  category: string;
  images: string[];
  stock: number;
  isHotDeal: boolean;
  dealEndsAt?: Date;
  createdAt?: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    discountPercent: { type: Number, default: 0, min: 0, max: 100 },
    category: {
      type: String,
      required: true,
      enum: ["Indoor", "Outdoor", "Fruit Trees", "Herbs & Seeds", "Pots & Accessories"],
    },
    images: { type: [String], default: [] },
    stock: { type: Number, default: 50 },
    isHotDeal: { type: Boolean, default: false },
    dealEndsAt: { type: Date },
  },
  { timestamps: true }
);

export default models.Product || model<IProduct>("Product", ProductSchema);
