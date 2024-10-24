import IUser from "../types/userTypes"
import mongoose, { Schema, Document } from "mongoose"

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      trim: true,
      maxLength: 32,
    },
    email: {
      type: String,
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      trim: true,
    },
    role: {
      type: String,
      enum: ["employee", "manager"],
      default: "employee",
    },
    manager: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
)

const User = mongoose.model<IUser>("User", userSchema)
export default User
