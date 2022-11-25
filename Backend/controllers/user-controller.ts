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
const Stories = mongoose.model("Stories", storySchema, "stories");
const Posts = mongoose.model("Post", postSchema, "posts");
export const getStories = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let stories;
  try {
    stories = await Stories.find({});
  } catch (err) {
    console.log(err);
    return next(new HttpError(404, "No Stories found"));
  }
  res.json({ stories });
};
export const getUserbyId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = req.params.uid;
  let user;
  try {
    user = await Users.findById(userId);
  } catch {
    const err = new HttpError(404, "Could not find user with provided id");
    return next(err);
  }
  res.json(user?.toObject({ getters: true }));
};
export const getAllUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let users;
  try {
    users = await Users.find({});
  } catch {
    return next(new HttpError(404, "Cant find user"));
  }
  res.json({ users: users.map((user) => user.toObject({ getters: true })) });
};

export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userToBeDeletedId = req.params.uid;
  let userToBeDeleted;
  try {
    userToBeDeleted = await Users.findById(userToBeDeletedId);
  } catch {
    return next(new HttpError(404, "Cant find user"));
  }
  try {
    await userToBeDeleted?.remove();
  } catch {
    return next(new HttpError(404, "Cant delete user"));
  }
  res.json({ deletedUser: userToBeDeleted?.Name });
};

export const addFriend = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { currentUserId, addedFriendId } = req.body;
  let currentUser;
  let addedFriend;
  try {
    currentUser = await Users.findById(currentUserId);
    addedFriend = await Users.findById(addedFriendId);
  } catch {
    return next(new HttpError(404, "Something went wrong"));
  }
  if (!currentUser || !addedFriend) {
    return next(new HttpError(404, "User not found"));
  }
  try {
    currentUser.Friends.push(addedFriendId);
    currentUser.Requests = currentUser.Requests.filter(
      (item: any) => item === addedFriendId
    );
    await currentUser.save();
    addedFriend.Friends.push(currentUserId);
    addedFriend.RequestSentTo = addedFriend.RequestSentTo.filter(
      (item: any) => item === currentUserId
    );
    await addedFriend.save();
  } catch {
    return next(new HttpError(404, "Something went wrong"));
  }
  res.json({ currentUser, addedFriend, message: "Friend request accepted" });
};
export const updateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const {
    userId,
    Age,
    Address,
    Pincode,
    Education,
    Hobbies,
    BloodGroup,
    MaritalStatus,
  } = req.body;
  const updatedProfilePic = req.file;
  let updatedUser;
  let usersPosts;
  try {
    usersPosts = await Posts.find({ User: userId });
    updatedUser = await Users.findById(userId);
  } catch {
    return next(new HttpError(401, "User Not found"));
  }
  if (!updatedProfilePic || !updatedUser) {
    return next(new HttpError(401, "User Not found"));
  }
  try {
    updatedUser.ProfilePic = updatedProfilePic.filename;
    updatedUser.Age = Age;
    updatedUser.Address = Address;
    updatedUser.Pincode = Pincode;
    updatedUser.Education = JSON.parse(Education);
    updatedUser.Hobbies = Hobbies;
    updatedUser.BloodGroup = BloodGroup;
    updatedUser.MaritalStatus = MaritalStatus;
    usersPosts.forEach((item) => {
      item.ProfilePic = updatedProfilePic.filename;
      item.save();
    });
    await updatedUser.save();
  } catch (err) {
    console.log(err);
  }
  res.json({ updatedUser });
};
export const sendRequest = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { sendRequestToUserId, getRequestFromUserId } = req.body;
  let sendRequestToUser;
  let getRequestFromUser;
  try {
    sendRequestToUser = await Users.findById(sendRequestToUserId);
    getRequestFromUser = await Users.findById(getRequestFromUserId);
  } catch {
    return next(new HttpError(404, "Something went wrong"));
  }
  if (sendRequestToUser && getRequestFromUser) {
    sendRequestToUser.Requests.push(getRequestFromUserId);
    getRequestFromUser.RequestSentTo.push(sendRequestToUserId);
    await sendRequestToUser.save();
    await getRequestFromUser.save();
  } else {
    return next(new HttpError(404, "user not found"));
  }
  res.json({ sendRequestToUser,getRequestFromUser, message: "Request sent" });
};
export const removeRequest = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { removeRequestFromUserId, removeSentRequestFromUserId } = req.body;

  let removeRequestFromUser, removeSentRequestFromUser;
  try {
    removeRequestFromUser = await Users.findById(removeRequestFromUserId);
    removeSentRequestFromUser = await Users.findById(
      removeSentRequestFromUserId
    );
  } catch (err) {
    return next(new HttpError(401, "No user found"));
  }
  if (!removeRequestFromUser || !removeSentRequestFromUser) {
    return next(new HttpError(401, "No user found"));
  }
  try {
    removeRequestFromUser.Requests = removeRequestFromUser.Requests.filter(
      (item) => item === removeSentRequestFromUserId
    );
    removeSentRequestFromUser.RequestSentTo =
      removeSentRequestFromUser.RequestSentTo.filter(
        (item) => item === removeRequestFromUserId
      );
    await removeRequestFromUser.save();
    await removeSentRequestFromUser.save();
  } catch {
    return next(new HttpError(404, "Cant perform operation"));
  }
  res.json({ removeSentRequestFromUser, message: "Removed Successfully" });
};
export const getAllFriends = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { userId } = req.body;
  let existingUser;
  try {
    existingUser = await Users.findById(userId);
  } catch (err) {
    console.log(err);
    return next(new HttpError(404, `${err}`));
  }
  if (!existingUser) {
    return next(new HttpError(404, "user not found"));
  }
  const friends = await Users.find({ _id: { $in: existingUser.Friends } });
  res.json({ friends, message: "friends fetched" });
};

export const createStory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { userId } = req.body;
  let file = req.file;
  let user;
  let story;
  try {
    user = await Users.findById(userId);
  } catch {
    return next(new HttpError(404, "No user found"));
  }
  if (!user) {
    return next(new HttpError(404, "No user found"));
  }
  if (!file) {
    return next(new HttpError(404, "Something went wrong"));
  }
  story = new Stories<Story>({
    imageUrl: file.filename,
    creatorImage: user.ProfilePic,
    creatorName: user.Name,
    userId: userId,
  });
  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await story.save({ session: sess });
    user.Stories.unshift(story);
    await user.save({ session: sess });
    await sess.commitTransaction();
  } catch {
    return next(new HttpError(404, "Cant add stories"));
  }
  res.json({ message: "Story created", story });
};
export const searchForUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { Name } = req.query;
    const response = await Users.aggregate([
      {
        $search: {
          index: "user",
          autocomplete: {
            query: Name,
            path: "Name",
            fuzzy: {
              maxEdits: 1,
            },
          },
        },
      },
      { $limit: 5 },
    ]);
    return res.json(response);
  } catch (err) {
    return next(new HttpError(401, `${err}`));
  }
};
export const getRequestDetail = async (
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
  const request = await Users.find({ _id: { $in: existingUser.Requests } });
  res.json({ request, message: "request fetched" });
};

export const unfriendUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { currentUserId, unfriendUserId } = req.body;

  let currentUser, removeUser;
  try {
    currentUser = await Users.findById(currentUserId);
    removeUser = await Users.findById(unfriendUserId);
  } catch (err) {
    return next(new HttpError(401, `${err}`));
  }
  if (!currentUser || !removeUser) {
    return next(new HttpError(401, "No user found"));
  }
  try {
    currentUser.Friends = currentUser.Friends.filter(
      (item) => item === unfriendUserId
    );
    removeUser.Friends = removeUser.Friends.filter(
      (item) => item === currentUserId
    );
    await currentUser.save();
    await removeUser.save();
  } catch (err) {
    return next(new HttpError(401, `${err}`));
  }
  res.json({ currentUser, removeUser, message: "Removed" });
};
