"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.messageRouter = void 0;
const express_1 = __importDefault(require("express"));
const message_controller_1 = require("./controllers/message-controller");
const check_auth_1 = require("./controllers/middleware/check_auth");
exports.messageRouter = (0, express_1.default)();
exports.messageRouter.use(check_auth_1.authorizationMiddleware);
exports.messageRouter.post("/sendMessage", message_controller_1.sendMessage);
exports.messageRouter.post("/getMessagesForUser", message_controller_1.getMessagesForUser);
