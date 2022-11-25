import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import { HttpError } from "../Models/CustomError";
import { userSchema } from "../Models/User";
const Users = mongoose.model("User", userSchema);
export const sendMessage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { SentBy, SentTo, Content } = req.body;
  const createdMessage = { SentTo, SentBy, Content };
  console.log(createdMessage);
  let sentBy, sentTo;
  try {
    sentBy = await Users.findById(SentBy);
    sentTo = await Users.findById(SentTo);
  } catch {
    return next(new HttpError(401, "Cannot send message"));
  }
  if (!sentBy || !sentTo) {
    return next(new HttpError(401, "Cannot send"));
  }
  try {
    sentBy.Messages.push(createdMessage);
    sentTo.Messages.push(createdMessage);
    await sentBy.save();
    await sentTo.save();
  } catch {
    return next(new HttpError(401, "Cannot send"));
  }

  res.json({ createdMessage, message: "Message created" });
};

export const getMessagesForUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { userId } = req.body;

  let user;

  try {
    user = await Users.findById(userId);
  } catch {
    return next(new HttpError(401, "Cant find user"));
  }

  if (!user) {
    return next(new HttpError(401, "No user found"));
  }
  const messages = user.Messages;
  res.json({ messages });
};
