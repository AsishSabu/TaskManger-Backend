import mongoose, { Document } from "mongoose";

export default interface IUser extends Document {
    name?: string;
    email: string;
    password: string;
    role: "manager" | "employee";
    manager?:string
    isVerified: boolean;
    isBlocked: boolean;
}
