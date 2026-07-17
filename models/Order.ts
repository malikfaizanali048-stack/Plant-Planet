import { Schema, models, model } from "mongoose";

export interface IOrderItem {
  productId: string;
  name: string;
  price: number;
  qty: number;
  image: string;
}

export interface IOrder {
  _id?: string;
  items: IOrderItem[];
  customerName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  paymentMethod: "COD" | "Card";
  stripePaymentIntentId?: string;
  subtotal: number;
  deliveryCharge: number;
  total: number;
  status: "Pending" | "Confirmed" | "Shipped" | "Delivered" | "Cancelled";
  createdAt?: Date;
}

const OrderItemSchema = new Schema<IOrderItem>(
  {
    productId: { type: String, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    qty: { type: Number, required: true },
    image: { type: String, default: "" },
  },
  { _id: false }
);

const OrderSchema = new Schema<IOrder>(
  {
    items: { type: [OrderItemSchema], required: true },
    customerName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    paymentMethod: { type: String, enum: ["COD", "Card"], required: true },
    stripePaymentIntentId: { type: String },
    subtotal: { type: Number, required: true },
    deliveryCharge: { type: Number, required: true },
    total: { type: Number, required: true },
    status: {
      type: String,
      enum: ["Pending", "Confirmed", "Shipped", "Delivered", "Cancelled"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

export default models.Order || model<IOrder>("Order", OrderSchema);
