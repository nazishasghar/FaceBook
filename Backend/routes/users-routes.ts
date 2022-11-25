import express from "express";
import { login, logout, signUp } from "../controllers/login-controller";
import { authorizationMiddleware } from "../controllers/middleware/check_auth";
import {
  getUserbyId,
  getAllUser,
  deleteUser,
  sendRequest,
  addFriend,
  getAllFriends,
  createStory,
  getStories,
  updateUser,
  searchForUser,
  removeRequest,
  getRequestDetail,
  unfriendUser,
} from "../controllers/user-controller";

import { imageUpload } from "./post-routes";
export const router = express();

// Routes
router.get("/search/searchForUser", searchForUser);
router.use(authorizationMiddleware);
router.get("/", getAllUser);
router.get("/:uid", getUserbyId);

router.delete("/:uid", deleteUser);
router.post("/friends/sendRequest", sendRequest);
router.post("/friends/addFriend", addFriend);
router.post("/friends/getFriends", getAllFriends);
router.post("/stories/createStory", imageUpload.single("imageUrl"), createStory);
router.get("/stories/getAllStories", getStories);
router.patch(
  "/updateUser",
  imageUpload.single("updatedProfilePic"),
  updateUser
);
router.post("/friends/removeRequest", removeRequest);
router.post("/friends/getAllRequest", getRequestDetail);
router.post("/friends/unfriend", unfriendUser);
