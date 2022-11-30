import mongoose, { Schema, Types, ObjectId } from "mongoose";
import { UUID } from "bson";
export interface Post {
  id:String
  ImageUrl: String;
  Caption: String;
  Likes: Number | String;
  LikedBy: Array<ObjectId>;
  Comments: Array<ObjectId>;
  ProfilePic: string;
  User: any;
}
export const postSchema = new Schema<Post>({
  id:{type:String},
  ImageUrl: { type: String },
  Caption: { type: String },
  Likes: { type: Number },
  LikedBy: [{ type: String}],
  Comments: [{ CommentBy: { type: String }, Comment: { type: String } }],
  ProfilePic: { type: String },
  User: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
});
