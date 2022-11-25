import mongoose from "mongoose";

export interface Story {
  imageUrl: string;
  creatorName: string;
  creatorImage: string;
  userId: mongoose.Schema.Types.ObjectId;
}

export const storySchema = new mongoose.Schema<Story>({
  imageUrl: { type: String, required: true },
  creatorName: { type: String, required: false },
  creatorImage: { type: String, required: false },
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
});
