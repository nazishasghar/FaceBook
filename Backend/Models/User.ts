import { ObjectId } from "mongodb";
import mongoose, { Schema, Types } from "mongoose";
import { Post } from "./Post";
import { Story } from "./Stories";

export interface Friend {
  Name: String;
  Email: String;
  isOnline: Boolean;
  User: Types.Array<ObjectId>;
}
export interface User {
  ProfilePic: any;
  Name: string;
  Password: string;
  Email: string;
  Age: string;
  Address: string;
  Pincode: string;
  MobileNumber: String;
  Education: Object;
  Post: Array<any>
  Stories: Array<Story>;
  Messages: Array<any>;
  Friends: Array<Friend>;
  Requests: Array<ObjectId>;
  RequestSentTo: Array<ObjectId>;
  Hobbies: string;
  BloodGroup: string;
  MaritalStatus: string;
  isOnline: boolean;
}
export const userSchema = new mongoose.Schema<User>({
  ProfilePic: { type: String, required: false },
  Name: { type: String, required: true },
  Email: { type: String, required: true, unique: true },
  Password: { type: String, required: true, minlength: 8, select: false },
  Age: { type: String, required: true },
  Address: { type: String, required: false },
  Pincode: { type: String, required: false },
  MobileNumber: { type: String, required: false },
  Education: { type: Object, required: false },
  Post: [{ type: mongoose.Types.ObjectId, required: false, ref: "Post" }],
  Stories: [{ type: mongoose.Types.ObjectId, required: false, ref: "Story" }],
  Messages: [{ type: Object }],
  Friends: [{ type: mongoose.Types.ObjectId, required: false }],
  Requests: [{ type: mongoose.Types.ObjectId }],
  RequestSentTo: [{ type: mongoose.Types.ObjectId, required: false }],
  Hobbies: { type: String, required: false },
  BloodGroup: { type: String, required: false },
  MaritalStatus: { type: String, required: false },

  isOnline: { type: Boolean, required: false },
});
