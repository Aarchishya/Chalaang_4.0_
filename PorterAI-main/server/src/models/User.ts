import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  phone: string;
  pan: string;
  bankAccount: string;
  createdAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true, unique: true },
    pan: { type: String, required: true, unique: true },
    bankAccount: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model<IUser>("User", UserSchema);
