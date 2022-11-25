import mongoose, { Schema, Types, ObjectId } from "mongoose";

export interface Post {
  ImageUrl: any;
  Caption: String;
  Likes: Number | String;
  LikedBy: Array<ObjectId>;
  Comments: Array<ObjectId>;
  ProfilePic: string;
  User: any;
}
export const postSchema = new Schema<Post>({
  ImageUrl: { type: String },
  Caption: { type: String },
  Likes: { type: Number },
  LikedBy: [{ type: Schema.Types.ObjectId }],
  Comments: [{ CommentBy: { type: String }, Comment: { type: String } }],
  ProfilePic: { type: String },
  User: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
});
