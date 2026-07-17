import { Schema, models, model } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser {
  _id?: string;
  name: string;
  email: string;
  password: string;
  role: "admin" | "customer";
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["admin", "customer"], default: "customer" },
  },
  { timestamps: true }
);

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

UserSchema.methods.comparePassword = function (candidate: string) {
  return bcrypt.compare(candidate, this.password);
};

export default models.User || model<IUser>("User", UserSchema);
