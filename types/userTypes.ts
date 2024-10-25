import mongoose, { Document } from "mongoose";

export default interface IUser extends Document {
    name?: string;
    email: string;
    password: string;
    role: "manager" | "employee";
    manager?:string
    status:"pending"|"approved"|"rejected"
    isVerified: boolean;
    isBlocked: boolean;
}
