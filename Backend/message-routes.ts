import express from "express";
import {
  getMessagesForUser,
  sendMessage,
} from "./controllers/message-controller";
import { authorizationMiddleware } from "./controllers/middleware/check_auth";

export const messageRouter = express();
messageRouter.use(authorizationMiddleware);
messageRouter.post("/sendMessage", sendMessage);
messageRouter.post("/getMessagesForUser", getMessagesForUser);
