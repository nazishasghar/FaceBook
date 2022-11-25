import express from "express";
import { signUp, login, logout } from "../controllers/login-controller";
import { authorizationMiddleware } from "../controllers/middleware/check_auth";
import { imageUpload } from "./post-routes";

export const authRouter = express();

authRouter.post("/signup", imageUpload.single("ProfilePic"), signUp);
authRouter.post("/login", login);
authRouter.use(authorizationMiddleware);
authRouter.post("/logout", logout);
