import { Document, Types } from "mongoose";

export default interface ITask extends Document {
  title: string;
  description: string;
  empName:string;
  assignedTo: Types.ObjectId; 
  assignedBy: Types.ObjectId; 
  taskDate: Date;
  status: "pending" | "in progress" | "completed";
  createdAt: Date;
  updatedAt: Date;
}
