import { userSchema } from "../Models/User";
import { User } from "../Models/User";
import mongoose, { Aggregate } from "mongoose";
import { NextFunction, Request, Response } from "express";
import { HttpError } from "../Models/CustomError";
import jwt from "jsonwebtoken";
import bcrpt from "bcrypt";
import { Story, storySchema } from "../Models/Stories";
import { postSchema } from "../Models/Post";
const Users = mongoose.model("User", userSchema, "users");
export const signUp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  bcrpt
    .hash(req.body.Password, 10)
    .then(async (hash) => {
      const newUser = new Users<User>({
        ProfilePic: req.file?.filename,
        Name: req.body.Name,
        Email: req.body.Email,
        Password: hash,
        Age: req.body.Age,
        Address: req.body.Address,
        Pincode: req.body.Pincode,
        MobileNumber: req.body.MobileNumber,
        Education: JSON.parse(req.body.Education),
        Post: [],
        RequestSentTo: [],
        Stories: [],
        Messages: [],
        Friends: [],
        Requests: [],
        Hobbies: req.body.Hobbies,
        BloodGroup: req.body.BloodGroup,
        MaritalStatus: req.body.MaritalStatus,
        isOnline: false,
      });

      try {
        await newUser.save();
      } catch (err) {
        console.log(err);
        return next(new HttpError(404, "err"));
      }
      res
        .status(201)
        .json({ user: newUser, userId: newUser.id, email: newUser.Email });
    })
    .catch((err) => {
      console.log(err);
    });
};
export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body;
  let existingUser;
  try {
    existingUser = await Users.findOne({ Email: email }).select("+Password");
    console.log(existingUser);
  } catch {
    return next(new HttpError(500, "No user"));
  }
  if (!existingUser) {
    return next(new HttpError(404, "User not there"));
  }
  let isValidPassword = false;
  try {
    isValidPassword = await bcrpt.compare(password, existingUser.Password);
  } catch {
    return next(new HttpError(404, "sign-up failed"));
  }
  if (!isValidPassword) {
    return next(new HttpError(404, "password is incorrect"));
  }
  let token;
  try {
    existingUser.isOnline = true;
    await existingUser.save();
    token = jwt.sign(
      { userId: existingUser.id, email: existingUser.Email },
      "specialkey",
      { expiresIn: "1h" }
    );
  } catch {
    return next(new HttpError(404, "sign-up failed"));
  }
  res.json({
    message: "Logged in",
    user: existingUser,
    userId: existingUser.id,
    token: token,
    expiresIn: "1h",
  });
};
export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { userId } = req.body;
  let existingUser;
  try {
    existingUser = await Users.findById(userId);
  } catch {
    return next(new HttpError(404, "user not found"));
  }
  if (!existingUser) {
    return next(new HttpError(404, "user not found"));
  }
  existingUser.isOnline = false;
  await existingUser.save();
  res.json({ message: "Logged out" });
};
