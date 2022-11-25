import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import { Post, postSchema } from "../Models/Post";
import { HttpError } from "../Models/CustomError";
import { userSchema } from "../Models/User";
import multer from "multer";

const Posts = mongoose.model("Post", postSchema, "posts");
const Users = mongoose.model("User", userSchema, "users");
export const createPost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let { Caption, Likes, User, ProfilePic } = req.body;
  let file = req.file;
  console.log(User);
  const createdPost = new Posts<Post>({
    ImageUrl: file?.filename,
    Caption,
    Likes,
    LikedBy: [],
    Comments: [],
    ProfilePic,
    User,
  });
  let user;
  try {
    user = await Users.findById(User);
    console.log(user);
  } catch (err) {
    console.log(err);
    return next(new HttpError(404, "Creating Post failed"));
  }
  if (!user) {
    return next(new HttpError(404, "User not available"));
  }
  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await createdPost.save({ session: sess });
    user.Post.unshift(createdPost);
    await user.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    console.log(err);
    return next(new HttpError(404, "Cannot create post"));
  }
  res.json({ createdPost: createdPost });
};

export const getPostById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const postId = req.params.pid;
  let post;
  try {
    post = await Posts.findById(postId);
  } catch (err) {
    return next(new HttpError(404, "Something went wrong"));
  }
  if (!post) {
    return next(new HttpError(404, "Cant find post"));
  }
  res.json({ post: post });
};

export const deletePost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const postId = req.params.pid;
  let post;
  try {
    post = await Posts.findById(postId).populate("User");
  } catch (err) {
    return next(new HttpError(404, "Something went wrong"));
  }
  if (!post) {
    return next(new HttpError(404, "Cant find post"));
  }
  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await post.remove({ session: sess });
    post.User.Post.pull(post);
    await post.User.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    console.log(err);
    return next(new HttpError(404, "Cant delete user"));
  }
  res.json({ post: post });
};
export const getAllPost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let posts;

  try {
    posts = await Posts.find({});
  } catch {
    return next(new HttpError(500, "No post avaiable"));
  }
  res.json({ posts: posts });
};
export const sendLikeOnPost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const postId = req.params.pid;
  const { userId } = req.body;
  let post;
  let isAlreadyLiked;
  try {
    post = await Posts.findById(postId);
  } catch (err) {
    return next(new HttpError(404, "Could not find post"));
  }
  if (!post) {
    return next(new HttpError(404, "No post available"));
  }
  isAlreadyLiked = post.LikedBy.find((item) => item === userId);
  try {
    if (!isAlreadyLiked) {
      post.Likes = String(Number(post.Likes) + 1);
      post.LikedBy.push(userId);
      await post.save();
    }
  } catch {
    return next(new HttpError(404, "Something went wrong"));
  }
  res.json({ message: "Like Sent" });
};
export const removeLikeOnPost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const postId = req.params.pid;
  const { userId } = req.body;
  let post;
  let isAlreadyDisLiked;
  try {
    post = await Posts.findById(postId);
  } catch (err) {
    return next(new HttpError(404, "Could not find post"));
  }
  if (!post) {
    return next(new HttpError(404, "No post available"));
  }
  try {
    post.LikedBy = post.LikedBy.filter((item: any) => item === userId);
    console.log(post.LikedBy);
    post.Likes = String(Number(post.Likes) - 1);
    await post.save();
  } catch {
    return next(new HttpError(404, "Something went wrong"));
  }
  res.json({ message: "disLike Sent" });
};

export const commentOnPost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const postId = req.params.pid;
  const { Comment } = req.body;
  let post;
  try {
    post = await Posts.findById(postId);
  } catch {
    return next(new HttpError(401, "No post found from provided Id"));
  }
  if (!post) {
    return next(new HttpError(401, "No post found from provided Id"));
  }
  try {
    post.Comments.push(Comment);
    await post.save();
  } catch {
    return next(new HttpError(401, "Cannot push"));
  }
  res.json({ Comment });
};
